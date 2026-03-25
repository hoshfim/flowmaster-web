'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getAccessToken, getRefreshToken } from '@/lib/api';
import { LayoutDashboard, Link2, Droplets, User, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const NAV = [
  { href: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/integrations', icon: Link2,           label: 'Integrations' },
  { href: '/liquidity',    icon: Droplets,        label: 'Liquidity' },
  { href: '/profile',      icon: User,            label: 'Profile' },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { merchant, logout } = useAuth();
  const pathname = usePathname();

  const initials = merchant?.companyName
    ? merchant.companyName.slice(0, 2).toUpperCase()
    : merchant?.email?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <div className="flex flex-col h-full w-64 bg-base-200 border-r border-base-content/[0.06]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-base-content/[0.05]">
        <span className="pulse-dot w-2 h-2 flex-shrink-0" />
        <span className="font-display font-extrabold tracking-tight text-sm flex-1">FlowMaster AI</span>
        <ThemeToggle className="-mr-1" />
      </div>

      {/* Nav */}
      <ul className="menu flex-1 px-2 py-4 gap-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 text-sm font-medium transition-all',
                  active ? 'nav-active' : 'text-base-content/60 hover:text-base-content hover:bg-base-content/[0.05]'
                )}
              >
                <Icon size={16} className={active ? 'text-[var(--fm-green)]' : ''} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User */}
      <div className="p-3 border-t border-base-content/[0.05]">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-content/[0.04] transition-colors group">
          <div className="avatar placeholder">
            <div className="w-8 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-display font-bold">
              <span>{initials}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{merchant?.companyName ?? 'Account'}</div>
            <div className="text-[0.65rem] text-base-content/40 truncate">{merchant?.email}</div>
          </div>
          <button
            onClick={logout}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-base-content/30 hover:text-error p-1 rounded-lg hover:bg-error/10"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!getAccessToken() && !getRefreshToken()) {
      window.location.href = '/auth/login';
    }
  }, [ready]);

  if (!ready || (!getAccessToken() && !getRefreshToken())) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-md text-primary" />
          <span className="text-sm text-base-content/40">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />

      {/* Page content */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="navbar bg-base-200 border-b border-base-content/[0.05] lg:hidden sticky top-0 z-30 px-4">
          <label htmlFor="app-drawer" className="btn btn-ghost btn-sm drawer-button">
            <Menu size={18} />
          </label>
          <div className="flex-1 flex items-center justify-center gap-2 font-display font-bold text-sm">
            <span className="pulse-dot w-1.5 h-1.5" />
            FlowMaster AI
          </div>
          <ThemeToggle />
        </div>

        <main className="flex-1 p-5 md:p-7 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="app-drawer" className="drawer-overlay" />
        <Sidebar onClose={() => {
          const el = document.getElementById('app-drawer') as HTMLInputElement;
          if (el) el.checked = false;
        }} />
      </div>
    </div>
  );
}
