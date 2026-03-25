'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ArrowRight, Shield, Zap, BarChart2, Clock, Droplets, TrendingUp } from 'lucide-react';

const PLATFORMS = [
  { icon: 'S',  name: 'Shopify',     color: '#96bf47', tag: 'Live' },
  { icon: '♪',  name: 'TikTok Shop', color: '#ff0050', tag: 'Live' },
  { icon: 'A',  name: 'Amazon',      color: '#ff9900', tag: 'Soon' },
  { icon: 'e',  name: 'eBay',        color: '#e53238', tag: 'Soon' },
  { icon: 'T',  name: 'Temu',        color: '#ff6b35', tag: 'Soon' },
  { icon: 'SH', name: 'SHEIN',       color: '#888888', tag: 'Soon' },
  { icon: 'W',  name: 'WooCommerce', color: '#7f54b3', tag: 'Soon' },
  { icon: 'L',  name: 'Lazada',      color: '#6b74f5', tag: 'Soon' },
];

const FEATURES = [
  { icon: BarChart2,   title: 'Unified cashflow dashboard', accent: 'success',
    desc: 'Available balance, in-transit funds, and 14-day forecast — all platforms in one view.' },
  { icon: Zap,         title: 'AI risk engine', accent: 'error',
    desc: 'Three-tier risk scoring monitors burn rate vs payouts and warns you days before you go negative.' },
  { icon: TrendingUp,  title: '14-day forecast', accent: 'info',
    desc: 'Daily net inflow projections from real sales data, accounting for refunds and platform fees.' },
  { icon: Clock,       title: 'In-transit tracking', accent: 'warning',
    desc: "Every scheduled payout tracked with its expected arrival so you always know what's coming." },
  { icon: Droplets,    title: 'One-click liquidity', accent: 'success',
    desc: 'When risk is elevated, FlowMaster calculates the optimal early payout and preps the request.' },
  { icon: Shield,      title: 'Bank-grade encryption', accent: 'success',
    desc: 'AES-256-GCM encrypted credentials. OAuth 2.0 means read-only access — we never write to your store.' },
];

const STEPS = [
  { num: '1', title: 'Connect your stores via OAuth',
    desc: 'Click "Connect via Shopify" or "Connect via TikTok Shop." Approve read-only access — no tokens to copy.' },
  { num: '2', title: 'FlowMaster syncs and normalises',
    desc: 'Orders, payouts, settlements, refunds, and fees are pulled automatically into a unified financial events model.' },
  { num: '3', title: 'Get your cashflow picture instantly',
    desc: 'Available balance, in-transit funds, 14-day forecast, and risk score calculated in real time.' },
  { num: '4', title: 'Act before problems hit',
    desc: 'When risk turns amber or red, FlowMaster recommends the exact amount to request as early payout.' },
];

const INTEGRATIONS = [
  { icon: 'S',  name: 'Shopify',     color: '#96bf47', live: true,  desc: 'Orders, payouts, refunds, and fees via Shopify Payments API.' },
  { icon: '♪',  name: 'TikTok Shop', color: '#ff0050', live: true,  desc: 'Order settlements, payouts, and reserve balances via Finance API.' },
  { icon: 'A',  name: 'Amazon',      color: '#ff9900', live: false, desc: 'Settlements, disbursements, and fees via Amazon SP-API.' },
  { icon: 'e',  name: 'eBay',        color: '#e53238', live: false, desc: 'Seller payouts and transaction history via eBay Finances API.' },
  { icon: 'T',  name: 'Temu',        color: '#ff6b35', live: false, desc: 'Earnings and settlement tracking via Temu Open Platform.' },
  { icon: 'SH', name: 'SHEIN',       color: '#888',    live: false, desc: 'Sales settlements and fees via SHEIN Open Platform.' },
  { icon: 'W',  name: 'WooCommerce', color: '#7f54b3', live: false, desc: 'Orders and refunds from your self-hosted WooCommerce store.' },
  { icon: 'L',  name: 'Lazada',      color: '#6b74f5', live: false, desc: 'Financials across SEA markets (SG, MY, TH, PH, ID, VN).' },
];

function PlatIcon({ icon, color, size = 40 }: { icon: string; color: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl font-bold font-display flex-shrink-0"
      style={{
        width: size, height: size,
        background: color + '22', color,
        fontSize: icon.length > 1 ? '0.6rem' : size > 32 ? '1rem' : '0.75rem',
      }}
    >
      {icon}
    </div>
  );
}

export default function LandingPage() {
  const marqueeItems = [...PLATFORMS, ...PLATFORMS];

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">

      {/* ── NAV ── */}
      <div className="navbar sticky top-0 z-50 bg-base-100/85 backdrop-blur-xl border-b border-base-content/[0.05] px-4 md:px-10">
        <div className="navbar-start">
          <div className="flex items-center gap-2 font-display font-extrabold tracking-tight text-[1.05rem]">
            <span className="pulse-dot" />
            FlowMaster AI
          </div>
        </div>
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal gap-1 text-sm">
            {['Features', 'How it works', 'Integrations'].map(item => (
              <li key={item}>
                <a href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                   className="text-base-content/50 hover:text-base-content rounded-lg transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end gap-1">
          <ThemeToggle />
          <div className="w-px h-5 bg-base-content/10 mx-1 hidden md:block" />
          <Link href="/auth/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link href="/auth/register"><Button size="sm">Get started</Button></Link>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-65px)] flex items-center justify-center overflow-hidden px-6">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(var(--fm-grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--fm-grid-line) 1px,transparent 1px)',
            backgroundSize: '52px 52px',
          }} />
          <div className="absolute animate-float" style={{
            width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, var(--fm-glow-green) 0%, transparent 70%)',
            top: -200, left: -200,
          }} />
          <div className="absolute animate-[float_10s_ease-in-out_infinite_reverse]" style={{
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, var(--fm-glow-blue) 0%, transparent 70%)',
            bottom: -200, right: -200,
          }} />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto py-16">
          {/* Eyebrow */}
          <div className="badge badge-outline badge-success gap-2 mb-8 py-3 px-4 animate-fade-up">
            <span className="pulse-dot w-1.5 h-1.5" />
            <span className="text-xs font-mono tracking-widest uppercase">Cashflow Intelligence for E-Commerce</span>
          </div>

          <h1
            className="font-display font-extrabold leading-none tracking-[-0.04em] mb-6 animate-fade-up"
            style={{ fontSize: 'clamp(3rem,8vw,5.2rem)', animationDelay: '0.1s', opacity: 0 }}
          >
            Know your cash.<br />
            <span className="text-success">Stop the bleed.</span><br />
            <span className="text-info">Grow faster.</span>
          </h1>

          <p
            className="text-base-content/55 text-lg leading-relaxed max-w-xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: '0.25s', opacity: 0 }}
          >
            FlowMaster AI unifies your Shopify and TikTok Shop financials into a single real-time dashboard — with AI-powered risk alerts before you ever hit zero.
          </p>

          <div
            className="flex items-center justify-center gap-3 flex-wrap animate-fade-up"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            <Link href="/auth/register">
              <Button size="lg">Start for free <ArrowRight size={16} /></Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="ghost" size="lg">See how it works</Button>
            </a>
          </div>

          {/* Hero stats */}
          <div
            className="stats stats-horizontal shadow-lg mt-14 bg-base-200 border border-base-content/[0.07] animate-fade-up rounded-2xl"
            style={{ animationDelay: '0.55s', opacity: 0 }}
          >
            <div className="stat px-6 py-4">
              <div className="stat-value text-success text-2xl font-display">$0</div>
              <div className="stat-desc uppercase tracking-widest text-[0.62rem]">Available Today</div>
            </div>
            <div className="stat px-6 py-4">
              <div className="stat-value text-info text-2xl font-display">$0</div>
              <div className="stat-desc uppercase tracking-widest text-[0.62rem]">In Transit</div>
            </div>
            <div className="stat px-6 py-4">
              <div className="stat-value text-warning text-2xl font-display">—</div>
              <div className="stat-desc uppercase tracking-widest text-[0.62rem]">Cash Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORMS MARQUEE ── */}
      <div className="border-y border-base-content/[0.05] bg-base-200 overflow-hidden relative py-4">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-base-200 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-base-200 to-transparent z-10" />
        <div className="flex gap-4 animate-marquee" style={{ width: 'max-content' }}>
          {marqueeItems.map((p, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-base-content/[0.07] bg-base-300 whitespace-nowrap">
              <PlatIcon icon={p.icon} color={p.color} size={22} />
              <span className="text-sm text-base-content/60 font-medium">{p.name}</span>
              <span className={`badge badge-xs ${p.tag === 'Live' ? 'badge-success' : 'badge-ghost'}`}>{p.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-xs font-mono text-success uppercase tracking-widest mb-3">What FlowMaster does</div>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4">
          Every dollar, every platform,<br />one place.
        </h2>
        <p className="text-base-content/50 text-base mb-12 max-w-lg">
          Stop switching between Shopify Admin, TikTok Seller Center, and spreadsheets. FlowMaster pulls it all together automatically.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-base-content/[0.05] border border-base-content/[0.05] rounded-2xl overflow-hidden">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-base-200 p-6 hover:bg-base-300 transition-colors group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${f.accent}/10 group-hover:scale-110 transition-transform`}>
                <f.icon size={18} className={`text-${f.accent}`} />
              </div>
              <div className="font-display font-bold text-sm mb-2">{f.title}</div>
              <div className="text-base-content/50 text-sm leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-base-200 border-y border-base-content/[0.05]">
        <div className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs font-mono text-success uppercase tracking-widest mb-3">How it works</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-8">
              Connected in minutes.<br />
              <span className="text-success">Running forever.</span>
            </h2>
            <ul className="steps steps-vertical">
              {STEPS.map(s => (
                <li key={s.num} className="step step-primary" data-content={s.num}>
                  <div className="text-left ml-3 mb-4">
                    <div className="font-display font-bold text-sm mb-1">{s.title}</div>
                    <div className="text-base-content/50 text-sm leading-relaxed">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard mockup */}
          <div className="mockup-window border border-base-content/[0.07] bg-base-100 shadow-xl">
            <div className="px-4 py-3 space-y-3 bg-base-100">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: '$24.8K', lbl: 'Available',  color: 'var(--fm-green)' },
                  { val: '$6.2K',  lbl: 'In Transit', color: 'var(--fm-blue)' },
                  { val: '18d',    lbl: 'Coverage',   color: 'var(--fm-amber)' },
                ].map(k => (
                  <div key={k.lbl} className="bg-base-200 rounded-xl p-3 border border-base-content/[0.05]">
                    <div className="font-display font-bold text-base" style={{ color: k.color }}>{k.val}</div>
                    <div className="text-[0.6rem] text-base-content/40 mt-0.5 uppercase tracking-wider">{k.lbl}</div>
                  </div>
                ))}
              </div>
              <div className="bg-base-200 rounded-xl p-3 border border-base-content/[0.05] flex items-end gap-1 h-20">
                {[35,55,45,70,60,80,65,90,75,50,40,30,25,20].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{
                    height: `${h}%`,
                    background: i < 9 ? 'var(--fm-green)' : i < 11 ? 'var(--fm-amber)' : 'var(--fm-red)',
                    opacity: i < 9 ? 0.7 + h/300 : 0.7,
                  }} />
                ))}
              </div>
              <div className="alert alert-success py-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" style={{ boxShadow: '0 0 6px var(--fm-green)' }} />
                Low risk · 18 days coverage · $533/day burn
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RISK ENGINE ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <div className="text-xs font-mono text-success uppercase tracking-widest mb-3">Risk Engine</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4">Know before the cliff.</h2>
          <p className="text-base-content/50 text-sm leading-relaxed mb-6">
            FlowMaster continuously evaluates your coverage days against burn rate and incoming payouts — giving you time to act, not just a warning after the fact.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { level: 'Low',    alertClass: 'alert-success', desc: '14+ days of cash coverage. Payouts on track. No action needed.' },
              { level: 'Medium', alertClass: 'alert-warning', desc: '7–14 days of coverage. Consider requesting early payout.' },
              { level: 'High',   alertClass: 'alert-error',   desc: 'Under 7 days. Immediate liquidity request recommended.' },
            ].map(r => (
              <div key={r.level} className={`alert ${r.alertClass} text-sm`}>
                <span className="badge badge-outline font-mono text-xs font-medium">{r.level}</span>
                <span className="text-base-content/70">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card bg-base-200 border border-base-content/[0.06]">
          <div className="card-body font-mono text-sm space-y-4">
            <div className="text-[0.6rem] text-base-content/30 uppercase tracking-widest">Coverage formula</div>
            {[
              { lbl: 'Available Today', formula: '= Cleared payouts − |Refunds| − |Fees|', color: 'text-success' },
              { lbl: 'In Transit',      formula: '= Pending payouts (expected date > today)', color: 'text-info' },
              { lbl: 'Cash Coverage',   formula: '= (Available + In Transit) ÷ Daily Burn', color: 'text-warning' },
            ].map(f => (
              <div key={f.lbl}>
                <div className="text-[0.6rem] text-base-content/40 uppercase tracking-widest mb-0.5">{f.lbl}</div>
                <div className={`text-sm ${f.color}`}>{f.formula}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" className="bg-base-200 border-y border-base-content/[0.05]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-xs font-mono text-success uppercase tracking-widest mb-3">Integrations</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-3">All your stores. One dashboard.</h2>
          <p className="text-base-content/50 text-sm mb-10 max-w-lg">
            Connect via OAuth — no tokens to manage. FlowMaster handles authentication and keeps credentials encrypted at rest.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {INTEGRATIONS.map(p => (
              <div key={p.name} className="card bg-base-100 border border-base-content/[0.07] hover:-translate-y-0.5 transition-transform relative overflow-hidden">
                {p.live && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: p.color }} />}
                <div className="card-body p-4">
                  <PlatIcon icon={p.icon} color={p.color} size={38} />
                  <div className="font-display font-bold text-sm mt-2 mb-0.5">{p.name}</div>
                  <div className="flex items-center gap-1 mb-1">
                    {p.live
                      ? <span className="badge badge-success badge-xs gap-1"><span className="w-1 h-1 rounded-full bg-current" />Live</span>
                      : <span className="badge badge-ghost badge-xs">🔜 Soon</span>
                    }
                  </div>
                  <div className="text-[0.7rem] text-base-content/40 leading-snug">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden py-28 px-6 text-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, var(--fm-glow-green) 0%, transparent 70%)',
          }} />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="badge badge-outline badge-success gap-2 mb-6 py-3 px-4">
            <span className="pulse-dot w-1.5 h-1.5" />
            <span className="text-xs font-mono uppercase tracking-widest">Start today — free</span>
          </div>
          <h2 className="font-display font-extrabold tracking-tight leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem,5vw,3.2rem)' }}>
            Never be surprised<br />by your cash again.
          </h2>
          <p className="text-base-content/50 text-base leading-relaxed mb-8 max-w-md mx-auto">
            Connect your first store in under two minutes. No credit card. No API keys. Just a clear picture of your money.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/auth/register">
              <Button size="lg">Create free account <ArrowRight size={16} /></Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="lg">Sign in</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer footer-center border-t border-base-content/[0.05] p-6 md:footer-horizontal md:px-12 md:py-6">
        <div className="flex items-center gap-2 font-display font-bold text-sm">
          <span className="pulse-dot w-1.5 h-1.5" />
          FlowMaster AI
        </div>
        <nav className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Docs'].map(l => (
            <a key={l} href="#" className="link link-hover text-base-content/30 text-xs">{l}</a>
          ))}
        </nav>
        <aside className="flex items-center gap-3">
          <p className="text-base-content/30 text-xs">© 2025 FlowMaster AI. All rights reserved.</p>
          <ThemeToggle />
        </aside>
      </footer>
    </div>
  );
}
