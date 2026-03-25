'use client';
import { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/dashboard/AppShell';
import { marketplace as mktApi } from '@/lib/api';
import type { MarketplaceConnection, PlatformDefinition } from '@/types';
import { PLAT_COLORS, relTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { RefreshCw, Trash2, ExternalLink, AlertCircle } from 'lucide-react';


const SYNC_DOT: Record<string, string> = {
  ok:'bg-success', warning:'bg-warning', error:'bg-error',
  syncing:'bg-info animate-pulse', pending:'bg-warning', never:'bg-base-content/20',
};

export default function IntegrationsPage() {
  const toast = useToast();
  const [platforms,   setPlatforms]   = useState<PlatformDefinition[]>([]);
  const [connections, setConnections] = useState<MarketplaceConnection[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [syncing,     setSyncing]     = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([mktApi.platforms(), mktApi.connections()]);
      setPlatforms(p.platforms); setConnections(c.connections);
    } catch { toast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const installed = params.get('installed');
    if (installed) {
      toast(`${installed.charAt(0).toUpperCase()+installed.slice(1)} connected!`, 'success');
      window.history.replaceState({}, '', window.location.pathname);
      load();
    }
  }, [load, toast]);

  async function handleSync(id: string) {
    setSyncing(s => new Set(s).add(id));
    try {
      await mktApi.sync(id);
      toast('Sync started', 'success');
      const poll = setInterval(async () => {
        try {
          const { connections: fresh } = await mktApi.connections();
          setConnections(fresh);
          if (fresh.find(c => c.id===id)?.syncStatus !== 'syncing') {
            clearInterval(poll); setSyncing(s => { const n=new Set(s); n.delete(id); return n; });
          }
        } catch { clearInterval(poll); setSyncing(s => { const n=new Set(s); n.delete(id); return n; }); }
      }, 2000);
    } catch (err: unknown) {
      toast((err as Error).message ?? 'Sync failed', 'error');
      setSyncing(s => { const n=new Set(s); n.delete(id); return n; });
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}"? Event history is preserved.`)) return;
    try { await mktApi.delete(id); toast('Removed', 'success'); setConnections(c => c.filter(x => x.id!==id)); }
    catch { toast('Failed to remove', 'error'); }
  }

  async function handleOAuth(platform: string, shop?: string) {
    try {
      const body: Record<string,string> = {};
      if (shop) body.shop = shop;
      const { installUrl } = await mktApi.authBegin(platform, body);
      window.location.href = installUrl;
    } catch (err: unknown) { toast((err as Error).message ?? 'OAuth failed', 'error'); }
  }

  function OAuthButton({ p }: { p: PlatformDefinition }) {
    const [shop, setShop] = useState('');
    const needsDomain = p.id === 'shopify';
    return (
      <div className="mt-3 space-y-2">
        {needsDomain && (
          <div className="join w-full">
            <input className="input input-bordered input-sm join-item flex-1 min-w-0"
              placeholder="your-store"
              value={shop}
              onChange={e => setShop(e.target.value.replace(/^https?:\/\//,'').replace(/\.myshopify\.com$/,'').replace(/\//,''))}
            />
            <span className="join-item bg-base-300 border border-base-content/20 px-2 text-xs text-base-content/40 flex items-center">.myshopify.com</span>
          </div>
        )}
        <Button size="sm" className="w-full" onClick={() => handleOAuth(p.id, needsDomain ? shop : undefined)}
          disabled={needsDomain && !shop}>
          <ExternalLink size={12} />
          {p.oauthLabel ?? `Connect via ${p.name}`}
        </Button>
      </div>
    );
  }

  const activePlatIds = new Set(connections.map(c => c.platform));

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Integrations</h1>
            <p className="text-sm text-base-content/50 mt-0.5">Connect marketplaces and sync financial data</p>
          </div>
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading?'animate-spin':''} /> Refresh
          </Button>
        </div>

        {/* Active connections */}
        {connections.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-mono text-base-content/40 uppercase tracking-widest">Connected</h2>
            {connections.map(c => {
              const color = PLAT_COLORS[c.platform] ?? '#888';
              const isSyncing = syncing.has(c.id) || c.syncStatus==='syncing';
              return (
                <div key={c.id} className="card bg-base-200 border border-base-content/[0.06]">
                  <div className="card-body p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-display flex-shrink-0"
                        style={{ background: color+'22', color }}>
                        {c.platform.slice(0,1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-semibold text-sm">{c.displayName}</span>
                          <Badge variant={c.syncStatus==='ok'?'green':c.syncStatus==='warning'?'amber':c.syncStatus==='error'?'red':'muted'}>
                            <span className={`w-1.5 h-1.5 rounded-full ${SYNC_DOT[c.syncStatus]??'bg-base-content/20'}`} />
                            {c.syncStatus==='ok' ? `Synced ${relTime(c.lastSyncedAt)}` :
                             c.syncStatus==='syncing' ? 'Syncing…' :
                             c.syncStatus==='warning' ? `Warning` :
                             c.syncStatus==='error' ? 'Error' : c.syncStatus}
                          </Badge>
                        </div>
                        {c.lastSyncError && (
                          <div className={`flex items-start gap-1.5 mt-1.5 text-xs ${c.syncStatus==='warning'?'text-warning':'text-error'}`}>
                            <AlertCircle size={11} className="flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{c.lastSyncError}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" loading={isSyncing} onClick={() => handleSync(c.id)}>
                          <RefreshCw size={12} /> Sync
                        </Button>
                        <button onClick={() => handleDelete(c.id, c.displayName)}
                          className="btn btn-ghost btn-sm text-base-content/30 hover:text-error">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Platform catalog */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono text-base-content/40 uppercase tracking-widest">Add integration</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {platforms.map(p => {
              const color = PLAT_COLORS[p.id] ?? p.color;
              const connected = activePlatIds.has(p.id);
              return (
                <div key={p.id} className={`card bg-base-200 border border-base-content/[0.07] overflow-hidden relative ${!p.syncEnabled?'opacity-70':''}`}>
                  {p.syncEnabled && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />}
                  <div className="card-body p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-display flex-shrink-0"
                        style={{ background: color+'22', color, fontSize: p.icon.length>1?'0.6rem':undefined }}>
                        {p.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-display font-semibold text-sm">{p.name}</span>
                          {connected && <span className="badge badge-success badge-outline badge-sm">Connected</span>}
                          {!p.syncEnabled && <span className="badge badge-ghost badge-sm">Coming soon</span>}
                          {p.oauthInstall && p.syncEnabled && <span className="badge badge-primary badge-outline badge-sm">🔐 OAuth</span>}
                        </div>
                        <p className="text-xs text-base-content/50 leading-relaxed">{p.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.scopes.map(s => (
                            <span key={s} className="badge badge-ghost badge-sm font-mono text-[0.58rem]">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {p.syncEnabled && !connected && (p.oauthInstall ? <OAuthButton p={p} /> :
                      <Button size="sm" variant="ghost" className="w-full mt-3" disabled>Manual setup coming soon</Button>
                    )}
                    {p.syncEnabled && connected && (
                      <Button size="sm" variant="ghost" className="w-full mt-3" onClick={() => p.oauthInstall && handleOAuth(p.id)}>
                        Re-connect to refresh token
                      </Button>
                    )}
                    {!p.syncEnabled && p.comingSoonNote && (
                      <p className="text-xs text-base-content/30 font-mono mt-3">{p.comingSoonNote}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
