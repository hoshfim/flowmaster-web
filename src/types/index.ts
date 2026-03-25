// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface Merchant {
  id:           string;
  email:        string;
  companyName:  string;
  fullName?:    string | null;
  createdAt?:   string;
  lastLoginAt?: string | null;
  emailVerified?: boolean;
}

export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;
  merchant:     Merchant;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  availableToday:      number;
  inTransit:           number;
  forecast14d:         number;
  avgDailyInflow:      number;
  avgDailyExpenses:    number;
  riskLevel:           'low' | 'medium' | 'high';
  cashCoverageDays:    number;
  warnings:            string[];
  recommendedLiquidity: number;
}

export interface FinancialEvent {
  platform:      string;
  event_type:    'sale' | 'refund' | 'fee' | 'payout' | 'reserve_increase' | 'reserve_release';
  amount:        number;
  currency:      string;
  status:        'pending' | 'cleared';
  event_date:    string;
  expected_date?: string;
}

// ─── Marketplace ──────────────────────────────────────────────────────────────

export interface MarketplaceConnection {
  id:             string;
  merchantId:     string;
  platform:       string;
  displayName:    string;
  isActive:       boolean;
  syncStatus:     'never' | 'pending' | 'syncing' | 'ok' | 'warning' | 'error';
  lastSyncedAt:   string | null;
  lastSyncError:  string | null;
  credentialKeys: string[];
  createdAt:      string;
  updatedAt:      string;
}

export interface PlatformDefinition {
  id:          string;
  name:        string;
  description: string;
  color:       string;
  icon:        string;
  scopes:      string[];
  docsUrl:     string;
  syncEnabled: boolean;
  oauthInstall?: boolean;
  oauthLabel?:   string;
  comingSoonNote?: string;
  fields: Array<{
    key:       string;
    label:     string;
    placeholder: string;
    type:      'text' | 'password' | 'url';
    required:  boolean;
    helpText?: string;
  }>;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface FinancialSettings {
  monthlyExpenses: number;
  currency:        string;
}
