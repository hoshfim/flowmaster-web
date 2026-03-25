'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/dashboard/AppShell';
import { dashboard as dashApi, marketplace } from '@/lib/api';
import type { DashboardSummary, MarketplaceConnection } from '@/types';
import { fmtK, fmt$, PLAT_COLORS } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { Droplets, TrendingDown, Wallet, Clock } from 'lucide-react';


export default function LiquidityPage() {
  const toast = useToast();
  const [summary,     setSummary]     = useState<DashboardSummary | null>(null);
  const [connections, setConnections] = useState<MarketplaceConnection[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [requesting,  setRequesting]  = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [s, c] = await Promise.all([dashApi.summary(), marketplace.connections()]);
        setSummary(s); setConnections(c.connections);
      } catch { toast('Failed to load', 'error'); }
      finally { setLoading(false); }
    }
    load();
  }, [toast]);

  const riskVariant = summary?.riskLevel==='low' ? 'green' : summary?.riskLevel==='medium' ? 'amber' : 'red';

  const collateral = connections.map(c => ({
    name: c.displayName, platform: c.platform, color: PLAT_COLORS[c.platform] ?? '#888',
    value: summary ? Math.round(summary.inTransit / Math.max(connections.length, 1)) : 0,
  }));

  const KPIS = [
    { label: 'Available Today', val: summary ? fmtK(summary.availableToday) : '—', icon: Wallet,     color: 'text-success', sub: 'Cleared funds' },
    { label: 'In Transit',      val: summary ? fmtK(summary.inTransit)      : '—', icon: Clock,      color: 'text-info',    sub: 'Incoming payouts' },
    { label: 'Recommended ask', val: summary ? fmtK(summary.recommendedLiquidity) : '—', icon: Droplets, color: 'text-warning', sub: 'Coverage gap' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Liquidity</h1>
          <p className="text-sm text-base-content/50 mt-0.5">Early payout requests and collateral management</p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {KPIS.map(k => (
            <div key={k.label} className="card bg-base-200 border border-base-content/[0.06]">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[0.62rem] text-base-content/40 uppercase tracking-widest">{k.label}</span>
                  <k.icon size={14} className="text-base-content/20" />
                </div>
                <div className={`font-display font-bold text-2xl tracking-tight mt-1 ${k.color}`}>{loading?'—':k.val}</div>
                <div className="text-xs text-base-content/30 mt-0.5">{k.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {summary && (
          <div className={`alert ${summary.riskLevel==='low'?'alert-success':summary.riskLevel==='medium'?'alert-warning':'alert-error'} items-start`}>
            <TrendingDown size={16} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={riskVariant}>{summary.riskLevel.charAt(0).toUpperCase()+summary.riskLevel.slice(1)} risk</Badge>
                <span className="text-sm">{summary.cashCoverageDays>=999?'∞':summary.cashCoverageDays} days · {fmt$(summary.avgDailyExpenses)}/day burn</span>
              </div>
              {summary.warnings.map((w,i) => <p key={i} className="text-xs opacity-75 mt-1">• {w}</p>)}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Liquidity request */}
          <div className="card bg-base-200 border border-base-content/[0.06]">
            <div className="card-body">
              <h3 className="card-title text-sm font-display">Liquidity Request</h3>
              <p className="text-xs text-base-content/50 leading-relaxed">Request an early payout based on your risk profile and collateral.</p>
              {summary && (
                <div className="space-y-2 my-2">
                  {[
                    { label: 'Recommended amount', val: fmtK(summary.recommendedLiquidity), color: 'text-warning' },
                    { label: 'Coverage after payout', val: '~14 days', color: 'text-success' },
                    { label: 'Est. platform fee', val: '~1.5%', color: '' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between text-sm">
                      <span className="text-base-content/50">{r.label}</span>
                      <span className={`font-display font-bold ${r.color}`}>{r.val}</span>
                    </div>
                  ))}
                  <div className="divider my-1" />
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>Net received</span>
                    <span className="font-display">{fmtK(summary.recommendedLiquidity*0.985)}</span>
                  </div>
                </div>
              )}
              <Button className="w-full" loading={requesting}
                onClick={() => { setRequesting(true); setTimeout(()=>{ toast('Request sent','success'); setRequesting(false); },800); }}
                disabled={!summary||summary.recommendedLiquidity===0}>
                <Droplets size={14} /> Request early payout
              </Button>
            </div>
          </div>

          {/* Collateral */}
          <div className="card bg-base-200 border border-base-content/[0.06]">
            <div className="card-body">
              <h3 className="card-title text-sm font-display">Collateral Breakdown</h3>
              <p className="text-xs text-base-content/50 leading-relaxed">In-transit funds per platform available as collateral.</p>
              {collateral.length===0 ? (
                <div className="text-sm text-base-content/30 text-center py-6">
                  No connected stores. <a href="/integrations" className="link link-primary">Connect one →</a>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  {collateral.map(c => (
                    <div key={c.platform}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded flex items-center justify-center text-[0.55rem] font-bold font-display"
                            style={{ background: c.color+'25', color: c.color }}>
                            {c.platform.slice(0,1).toUpperCase()}
                          </div>
                          <span className="text-base-content/50">{c.name}</span>
                        </div>
                        <span className="font-mono">{fmtK(c.value)}</span>
                      </div>
                      <progress className="progress progress-info w-full h-1.5"
                        value={Math.min((c.value/Math.max(summary?.inTransit??1,1))*100,100)} max="100" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Formula */}
        <div className="card bg-base-200 border border-base-content/[0.06]">
          <div className="card-body">
            <h3 className="card-title text-sm font-display">How coverage is calculated</h3>
            <div className="grid md:grid-cols-3 gap-3 mt-1">
              {[
                { title:'Available Today', formula:'Cleared payouts − |Refunds| − |Fees|', color:'text-success' },
                { title:'In Transit',      formula:'Pending payouts (expected date > today)', color:'text-info' },
                { title:'Cash Coverage',   formula:'(Available + In Transit) ÷ Daily Burn', color:'text-warning' },
              ].map(f => (
                <div key={f.title} className="bg-base-300 rounded-xl p-3 border border-base-content/[0.05]">
                  <div className="text-[0.6rem] text-base-content/30 uppercase tracking-widest mb-1">{f.title}</div>
                  <div className={`text-xs font-mono ${f.color}`}>{f.formula}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
