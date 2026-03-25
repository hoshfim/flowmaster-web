'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Merchant } from '@/types';
import {
  saveTokens, clearTokens, loadPersistedTokens,
  silentRefresh, getRefreshToken, getAccessToken,
  auth as authApi,
} from '@/lib/api';

interface AuthContextValue {
  merchant:  Merchant | null;
  // ready = boot sequence fully complete (token refreshed, access token in memory)
  // Pages must not make authenticated API calls until ready === true
  ready:     boolean;
  login:     (email: string, password: string) => Promise<void>;
  register:  (email: string, password: string, companyName: string, fullName?: string) => Promise<void>;
  logout:    () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [ready,    setReady]    = useState(false);

  useEffect(() => {
    async function boot() {
      // 1. Restore merchant profile from localStorage immediately (no flicker)
      const cached = loadPersistedTokens(); // also sets _refreshToken in memory
      if (cached) setMerchant(cached);

      // 2. Exchange refresh token for a fresh access token
      //    This MUST complete before any authenticated API calls fire.
      //    We set ready=true only after this resolves.
      if (getRefreshToken()) {
        await silentRefresh();

        // If refresh failed (expired/revoked), clearTokens() was called inside
        // silentRefresh — _refreshToken is now null, clear UI too
        if (!getRefreshToken() && !getAccessToken()) {
          setMerchant(null);
        }
      }

      // 3. Signal that boot is complete — AppShell gates all API calls on this
      setReady(true);
    }
    boot();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    saveTokens(data);      // writes to localStorage + sets _accessToken in memory
    setMerchant(data.merchant);
    setReady(true);        // already authenticated — no boot sequence needed
  }, []);

  const register = useCallback(async (
    email: string, password: string, companyName: string, fullName?: string
  ) => {
    const data = await authApi.register(email, password, companyName, fullName);
    saveTokens(data);
    setMerchant(data.merchant);
    setReady(true);
  }, []);

  const logout = useCallback(async () => {
    const rt = getRefreshToken();
    if (rt) await authApi.logout(rt).catch(() => {});
    clearTokens();
    setMerchant(null);
    setReady(false);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ merchant, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
