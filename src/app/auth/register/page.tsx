'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';


export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', companyName: '', fullName: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.password, form.companyName, form.fullName || undefined);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--fm-glow-blue) 0%, transparent 70%)',
        }} />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 font-display font-extrabold tracking-tight text-lg hover:opacity-80 transition-opacity">
          <span className="pulse-dot" />
          FlowMaster AI
        </Link>

        <div className="card bg-base-200 shadow-xl border border-base-content/[0.06]">
          <div className="card-body gap-5">
            <div>
              <h1 className="card-title text-xl font-display">Create your account</h1>
              <p className="text-sm text-base-content/50 mt-0.5">Start tracking cashflow — free</p>
            </div>

            {error && (
              <div className="alert alert-error text-sm py-3">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input label="Company name" type="text" value={form.companyName}
                onChange={set('companyName')} placeholder="Acme Store" required autoFocus />
              <Input label="Full name (optional)" type="text" value={form.fullName}
                onChange={set('fullName')} placeholder="Jane Smith" />
              <Input label="Email" type="email" value={form.email}
                onChange={set('email')} placeholder="you@company.com" required />
              <Input label="Password" type="password" value={form.password}
                onChange={set('password')} placeholder="Min 8 characters" required
                help="At least 8 characters" />
              <Button type="submit" loading={loading} className="w-full mt-1">
                Create account
              </Button>
            </form>

            <p className="text-center text-sm text-base-content/50">
              Already have an account?{' '}
              <Link href="/auth/login" className="link link-primary font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
