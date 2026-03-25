/**
 * FlowMaster API Client
 * Typed wrappers around every backend endpoint.
 * Token management: accessToken in memory, refreshToken in localStorage.
 */

import type {
  AuthTokens, DashboardSummary, FinancialEvent,
  MarketplaceConnection, PlatformDefinition,
  Merchant, FinancialSettings,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

// ─── Token store (module-level — survives re-renders) ─────────────────────────

let _accessToken:  string | null = null;
let _refreshToken: string | null = null;
let _refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function getAccessToken()  { return _accessToken; }
export function getRefreshToken() { return _refreshToken; }

export function saveTokens(data: AuthTokens): void {
  _accessToken  = data.accessToken;
  _refreshToken = data.refreshToken;
  if (typeof window !== 'undefined') {
    localStorage.setItem('fm_rt', data.refreshToken);
    localStorage.setItem('fm_merchant', JSON.stringify(data.merchant));
  }
  scheduleRefresh(data.expiresIn);
}

/** Returns the merchant from the last saveTokens call, or null. */
export function getSavedMerchant(): Merchant | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('fm_merchant');
  return raw ? JSON.parse(raw) as Merchant : null;
}

export function clearTokens(): void {
  _accessToken  = null;
  _refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fm_rt');
    localStorage.removeItem('fm_merchant');
  }
  if (_refreshTimer) clearTimeout(_refreshTimer);
}

export function loadPersistedTokens(): Merchant | null {
  if (typeof window === 'undefined') return null;
  _refreshToken = localStorage.getItem('fm_rt');
  const raw = localStorage.getItem('fm_merchant');
  return raw ? JSON.parse(raw) as Merchant : null;
}

export function isLoggedIn(): boolean {
  return !!_accessToken || !!_refreshToken;
}

function scheduleRefresh(expiresIn: number): void {
  if (_refreshTimer) clearTimeout(_refreshTimer);
  const ms = Math.max((expiresIn - 60) * 1000, 10_000);
  _refreshTimer = setTimeout(silentRefresh, ms);
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method:   string,
  path:     string,
  body?:    unknown,
  withAuth = true,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (withAuth) {
    if (!_accessToken && _refreshToken) await silentRefresh();
    if (!_accessToken) throw new ApiError(401, 'Session expired — please sign in again');
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({})) as Record<string, unknown>;

  if (!res.ok) {
    if (res.status === 401 && withAuth && _refreshToken) {
      try {
        await silentRefresh();
        headers['Authorization'] = `Bearer ${_accessToken}`;
        const retry = await fetch(API_BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
        const retryJson = await retry.json().catch(() => ({})) as Record<string, unknown>;
        if (!retry.ok) throw new ApiError(retry.status, (retryJson.error as string) ?? 'Request failed');
        return retryJson as T;
      } catch {
        clearTokens();
        throw new ApiError(401, 'Session expired');
      }
    }
    throw new ApiError(res.status, (json.error as string) ?? `HTTP ${res.status}`);
  }

  return json as T;
}

export async function silentRefresh(): Promise<void> {
  if (!_refreshToken) return;
  try {
    const data = await request<AuthTokens>('POST', '/api/auth/refresh', { refreshToken: _refreshToken }, false);
    saveTokens(data);
  } catch {
    clearTokens();
  }
}

const get  = <T>(path: string)             => request<T>('GET',    path, undefined);
const post = <T>(path: string, body: unknown, auth = true) => request<T>('POST',   path, body, auth);
const patch = <T>(path: string, body: unknown) => request<T>('PATCH',  path, body);
const del  = <T>(path: string)             => request<T>('DELETE', path, undefined);

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const auth = {
  login:    (email: string, password: string) =>
    post<AuthTokens>('/api/auth/login', { email, password }, false),
  register: (email: string, password: string, companyName: string, fullName?: string) =>
    post<AuthTokens>('/api/auth/register', { email, password, companyName, fullName }, false),
  logout:   (refreshToken: string) =>
    post<{ success: boolean }>('/api/auth/logout', { refreshToken }, false),
  me:       () => get<{ merchant: Merchant }>('/api/auth/me'),
};

// ─── Dashboard endpoints ──────────────────────────────────────────────────────

export const dashboard = {
  summary: () => get<DashboardSummary>('/api/dashboard/summary'),
  events:  (days = 60, limit = 500) =>
    get<{ events: FinancialEvent[]; total: number }>(`/api/dashboard/events?days=${days}&limit=${limit}`),
};

// ─── Marketplace endpoints ────────────────────────────────────────────────────

export const marketplace = {
  platforms:   () => get<{ platforms: PlatformDefinition[] }>('/api/marketplace/platforms'),
  connections: () => get<{ connections: MarketplaceConnection[] }>('/api/marketplace/connections'),
  create:      (platform: string, displayName: string, credentials: Record<string, string>) =>
    post<{ connection: MarketplaceConnection }>('/api/marketplace/connections', { platform, displayName, credentials }),
  update:      (id: string, data: { displayName?: string; credentials?: Record<string, string>; isActive?: boolean }) =>
    patch<{ connection: MarketplaceConnection }>(`/api/marketplace/connections/${id}`, data),
  delete:      (id: string) => del<{ success: boolean }>(`/api/marketplace/connections/${id}`),
  sync:        (id: string) => post<{ success: boolean }>(`/api/marketplace/connections/${id}/sync`, {}),
  authBegin:   (platform: string, body: Record<string, string>) =>
    post<{ installUrl: string }>(`/${platform}/auth/begin`, body),
};

// ─── Profile endpoints ────────────────────────────────────────────────────────

export const profile = {
  get:             () => get<{ merchant: Merchant; financialSettings: FinancialSettings }>('/api/profile'),
  update:          (data: Partial<Merchant>) => patch<{ merchant: Merchant }>('/api/profile', data),
  updateExpenses:  (monthlyExpenses: number, currency: string) =>
    patch<{ success: boolean }>('/api/profile/expenses', { monthlyExpenses, currency }),
  updatePassword:  (currentPassword: string, newPassword: string) =>
    patch<{ success: boolean }>('/api/profile/password', { currentPassword, newPassword }),
  delete:          (password: string) =>
    request<{ success: boolean }>('DELETE', '/api/profile', { password }),
};

// ─── Liquidity endpoints ──────────────────────────────────────────────────────

export const liquidity = {
  request: (payload: unknown) => post<{ success: boolean }>('/api/liquidity/request', payload),
};
