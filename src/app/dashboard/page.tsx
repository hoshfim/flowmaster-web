'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/dashboard/AppShell';
import { dashboard as dashApi, marketplace } from '@/lib/api';
import type { DashboardSummary, FinancialEvent, MarketplaceConnection } from '@/types';
import { fmtK, fmt$, relTime, PLAT_COLORS, PLAT_NAMES } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, TrendingUp, Wallet, Clock, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';


export default function DashboardPage() {
  const [summary,     setSummary]     = useState<DashboardSummary | null>(null);
  const [events,      setEvents]      = useState<FinancialEvent[]>([]);
  const [connections, setConnections] = useState<MarketplaceConnection[]>([]);
  const [loading,     setLoading]     = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [s, e, c] = await Promise.all([
        dashApi.summary(), dashApi.events(60, 300), marketplace.connections(),
      ]);
      setSummary(s); setEvents(e.events); setConnections(c.connections);
    } catch {}
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const forecastRows = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const inflow = summary ? Math.round(summary.avgDailyInflow * (0.85 + Math.random() * 0.3)) : 0;
    const deductions = Math.round(inflow * 0.06);
    const burn = summary ? Math.round(summary.avgDailyExpenses) : 0;
    return { label, inflow, deductions, burn, net: inflow - deductions - burn };
  });

  const chartData = (() => {
    const byDay: Record<string, number> = {};
    events.filter(e => e.event_type === 'sale').forEach(e => {
      byDay[e.event_date] = (byDay[e.event_date] ?? 0) + e.amount;
    });
    return Object.entries(byDay).sort(([a],[b]) => a.localeCompare(b)).slice(-30)
      .map(([date, total]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: Math.round(total),
      }));
  })();

  const riskVariant = summary?.riskLevel === 'low' ? 'green' : summary?.riskLevel === 'medium' ? 'amber' : 'red';

  const KPIS = [
    { label: 'Available Today', val: summary ? fmtK(summary.availableToday) : '—', icon: Wallet,      color: 'text-success', accent: 'var(--fm-green)', sub: 'Cleared payouts' },
    { label: 'In Transit',      val: summary ? fmtK(summary.inTransit)      : '—', icon: Clock,       color: 'text-info',    accent: 'var(--fm-blue)',  sub: 'Expected soon' },
    { label: '14-Day Forecast', val: summary ? fmtK(summary.forecast14d)    : '—', icon: TrendingUp,   color: 'text-warning', accent: 'var(--fm-amber)', sub: 'Projected net' },
    { label: 'Avg Daily Inflow',val: summary ? fmt$(summary.avgDailyInflow) : '—', icon: Activity,    color: 'text-base-content', accent: 'var(--fm-dim)', sub: 'Last 30 days' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-base-content/50 mt-0.5">Your real-time cashflow overview</p>
          </div>
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {KPIS.map(k => (
            <div key={k.label} className="kpi-card card bg-base-200 border border-base-content/[0.06]"
              style={{ ['--kpi-accent' as string]: k.accent }}>
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[0.62rem] text-base-content/40 uppercase tracking-widest">{k.label}</span>
                  <k.icon size={14} className="text-base-content/20" />
                </div>
                <div className={`font-display font-bold text-2xl tracking-tight mt-1 ${k.color}`}>
                  {loading ? <span className="loading loading-dots loading-xs" /> : k.val}
                </div>
                <div className="text-xs text-base-content/30 mt-0.5">{k.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk banner */}
        {summary && (
          <div className={`alert ${
            summary.riskLevel === 'low' ? 'alert-success' :
            summary.riskLevel === 'medium' ? 'alert-warning' : 'alert-error'
          } items-start`}>
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={riskVariant}>
                  {summary.riskLevel.charAt(0).toUpperCase() + summary.riskLevel.slice(1)} risk
                </Badge>
                <span className="text-sm">
                  {summary.cashCoverageDays >= 999 ? '∞' : summary.cashCoverageDays} days coverage
                  {' '}· {fmt$(summary.avgDailyExpenses)}/day burn
                </span>
              </div>
              {summary.warnings.map((w, i) => (
                <p key={i} className="text-xs opacity-75 mt-1">• {w}</p>
              ))}
            </div>
          </div>
        )}

        {/* Chart + stores */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card bg-base-200 border border-base-content/[0.06]">
            <div className="card-body">
              <h3 className="card-title text-sm font-display">Revenue (last 30 days)</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--fm-green)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--fm-green)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--fm-border)" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: 'var(--fm-dim)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: 'var(--fm-dim)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => '$'+(v/1000).toFixed(0)+'K'} />
                    <Tooltip
                      contentStyle={{
                        background: 'oklch(var(--b2))',
                        border: '1px solid var(--fm-border-2)',
                        borderRadius: 10,
                        fontSize: 12,
                        color: 'oklch(var(--bc))',
                      }}
                      formatter={(v: number) => [fmt$(v), 'Revenue']}
                    />
                    <Area type="monotone" dataKey="total" stroke="var(--fm-green)" strokeWidth={2} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-44 flex items-center justify-center text-sm text-base-content/30">
                  Sync your stores to see revenue data
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-200 border border-base-content/[0.06]">
            <div className="card-body">
              <h3 className="card-title text-sm font-display">Connected Stores</h3>
              {connections.length === 0 ? (
                <div className="text-sm text-base-content/30 text-center py-6">
                  No stores connected.
                  <div className="mt-2">
                    <a href="/integrations" className="link link-primary text-xs">Connect a store →</a>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {connections.map(c => {
                    const color = PLAT_COLORS[c.platform] ?? '#888';
                    return (
                      <li key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-base-300 border border-base-content/[0.04] hover:border-base-content/[0.08] transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-display flex-shrink-0"
                          style={{ background: color+'22', color }}>
                          {c.platform.slice(0,1).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{c.displayName}</div>
                          <div className="text-[0.62rem] text-base-content/30">{relTime(c.lastSyncedAt)}</div>
                        </div>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          c.syncStatus==='ok' ? 'bg-success' :
                          c.syncStatus==='warning' ? 'bg-warning' :
                          c.syncStatus==='error' ? 'bg-error' :
                          c.syncStatus==='syncing' ? 'bg-info animate-pulse' : 'bg-base-content/20'
                        }`} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* 14-day table */}
        <div className="card bg-base-200 border border-base-content/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-base-content/[0.05] flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm">14-Day Cashflow Detail</h3>
            {summary && <span className="text-xs text-base-content/30">Based on {fmt$(summary.avgDailyInflow)}/day avg</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="table table-sm table-zebra">
              <thead>
                <tr className="text-[0.62rem] text-base-content/30 uppercase tracking-wider">
                  <th>Date</th><th>Inflow</th><th>Deductions</th><th>Burn</th><th>Net</th><th>Balance</th><th></th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let running = summary?.availableToday ?? 0;
                  return forecastRows.map((row, i) => {
                    running += row.net;
                    const neg = running < 0;
                    return (
                      <tr key={i} className={neg ? 'bg-error/[0.04]' : ''}>
                        <td className="text-base-content/50 font-mono text-xs">{row.label}</td>
                        <td className="text-success text-xs font-mono">+{fmtK(row.inflow)}</td>
                        <td className="text-error text-xs font-mono">-{fmtK(row.deductions)}</td>
                        <td className="text-base-content/40 text-xs font-mono">-{fmtK(row.burn)}</td>
                        <td className={`text-xs font-mono ${row.net>=0?'text-success':'text-error'}`}>{row.net>=0?'+':''}{fmtK(row.net)}</td>
                        <td className={`text-xs font-mono font-semibold ${neg?'text-error':''}`}>{fmtK(Math.round(running))}</td>
                        <td>{neg && <span className="badge badge-error badge-outline badge-sm">⚠ Neg</span>}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card bg-base-200 border border-base-content/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-base-content/[0.05]">
            <h3 className="font-display font-semibold text-sm">Recent Activity</h3>
          </div>
          {events.length === 0 ? (
            <div className="p-10 text-center text-sm text-base-content/30">
              Sync your stores to see financial activity
            </div>
          ) : (
            <ul className="divide-y divide-base-content/[0.03]">
              {events.slice(0, 20).map((e, i) => {
                const color = PLAT_COLORS[e.platform] ?? '#888';
                const positive = ['sale','payout','reserve_release'].includes(e.event_type);
                return (
                  <li key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-base-content/[0.02] transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.6rem] font-bold font-display flex-shrink-0"
                      style={{ background: color+'20', color }}>
                      {e.platform.slice(0,1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium capitalize">{e.event_type.replace(/_/g,' ')}</div>
                      <div className="text-[0.62rem] text-base-content/30">{PLAT_NAMES[e.platform]??e.platform} · {e.event_date}</div>
                    </div>
                    <span className={`text-xs font-mono font-semibold ${positive?'text-success':'text-error'}`}>
                      {positive?'+':''}{fmt$(e.amount)}
                    </span>
                    <Badge variant={e.status==='cleared'?'green':'amber'}>{e.status}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
