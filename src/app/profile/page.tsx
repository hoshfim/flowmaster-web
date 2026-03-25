'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/dashboard/AppShell';
import { profile as profileApi, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { FinancialSettings } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Save, Lock, AlertTriangle } from 'lucide-react';


export default function ProfilePage() {
  const { merchant } = useAuth();
  const toast = useToast();
  const [settings,  setSettings]  = useState<FinancialSettings>({ monthlyExpenses: 0, currency: 'USD' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [saving,    setSaving]    = useState<string|null>(null);
  const [errors,    setErrors]    = useState<Record<string,string>>({});

  useEffect(() => {
    profileApi.get().then(({ financialSettings }) => { if (financialSettings) setSettings(financialSettings); }).catch(()=>{});
  }, []);

  async function saveExpenses(e: React.FormEvent) {
    e.preventDefault(); setSaving('expenses');
    try { await profileApi.updateExpenses(settings.monthlyExpenses, settings.currency); toast('Expenses updated','success'); }
    catch (err) { toast(err instanceof ApiError ? err.message : 'Save failed','error'); }
    finally { setSaving(null); }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string,string> = {};
    if (passwords.next.length<8) errs.next='Minimum 8 characters';
    if (passwords.next!==passwords.confirm) errs.confirm='Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setSaving('password');
    try {
      await profileApi.updatePassword(passwords.current, passwords.next);
      toast('Password changed','success'); setPasswords({ current:'', next:'', confirm:'' });
    } catch (err) { toast(err instanceof ApiError ? err.message : 'Failed','error'); }
    finally { setSaving(null); }
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-base-content/50 mt-0.5">Manage your account and financial settings</p>
        </div>

        {/* Account info */}
        <div className="card bg-base-200 border border-base-content/[0.06]">
          <div className="card-body">
            <h3 className="card-title text-sm font-display">Account</h3>
            <div className="grid gap-3 mt-1">
              {[
                { label: 'Company name', val: merchant?.companyName },
                { label: 'Email',        val: merchant?.email },
                { label: 'Member since', val: merchant?.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : '—' },
              ].map(r => (
                <div key={r.label}>
                  <div className="text-[0.62rem] text-base-content/40 uppercase tracking-widest mb-0.5">{r.label}</div>
                  <div className="text-sm">{r.val ?? '—'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial settings */}
        <div className="card bg-base-200 border border-base-content/[0.06]">
          <div className="card-body">
            <h3 className="card-title text-sm font-display">Financial Settings</h3>
            <p className="text-xs text-base-content/50 leading-relaxed">Monthly expenses used to calculate daily burn rate and cash coverage days.</p>
            <form onSubmit={saveExpenses} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Monthly expenses" type="number" value={settings.monthlyExpenses}
                  onChange={e => setSettings(s => ({ ...s, monthlyExpenses: parseFloat(e.target.value)||0 }))}
                  placeholder="5000" min={0} step={100} />
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs uppercase tracking-widest text-base-content/50">Currency</span>
                  </label>
                  <select className="select select-bordered" value={settings.currency}
                    onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}>
                    {['USD','EUR','GBP','SGD','MYR','PHP','THB','IDR','VND'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="text-xs text-base-content/30 bg-base-300 rounded-xl px-3 py-2 border border-base-content/[0.05] font-mono">
                Daily burn = ${((settings.monthlyExpenses||0)/30).toFixed(2)}/day
              </div>
              <Button type="submit" loading={saving==='expenses'} size="sm">
                <Save size={13} /> Save settings
              </Button>
            </form>
          </div>
        </div>

        {/* Password */}
        <div className="card bg-base-200 border border-base-content/[0.06]">
          <div className="card-body">
            <h3 className="card-title text-sm font-display"><Lock size={14} /> Change password</h3>
            <form onSubmit={changePassword} className="space-y-4 mt-2">
              <Input label="Current password" type="password" value={passwords.current}
                onChange={e => setPasswords(p=>({...p,current:e.target.value}))} placeholder="••••••••" required />
              <Input label="New password" type="password" value={passwords.next}
                onChange={e => setPasswords(p=>({...p,next:e.target.value}))} placeholder="Min 8 characters" required error={errors.next} />
              <Input label="Confirm new password" type="password" value={passwords.confirm}
                onChange={e => setPasswords(p=>({...p,confirm:e.target.value}))} placeholder="Repeat password" required error={errors.confirm} />
              <Button type="submit" loading={saving==='password'} size="sm">
                <Lock size={13} /> Update password
              </Button>
            </form>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card bg-base-200 border border-error/30">
          <div className="card-body">
            <h3 className="card-title text-sm font-display text-error"><AlertTriangle size={14} /> Danger zone</h3>
            <p className="text-xs text-base-content/50 leading-relaxed">Permanently removes all data including financial events and integrations.</p>
            <div className="mt-2">
              <Button variant="danger" size="sm">Delete account</Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
