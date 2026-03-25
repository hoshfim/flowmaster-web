'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';


export default function LoginPage() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [next,     setNext]     = useState('/dashboard');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get('next');
    if (n && n.startsWith('/')) setNext(n);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      window.location.href = next;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--fm-glow-green) 0%, transparent 70%)',
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
              <h1 className="card-title text-xl font-display">Welcome back</h1>
              <p className="text-sm text-base-content/50 mt-0.5">Sign in to your account</p>
            </div>

            {error && (
              <div className="alert alert-error text-sm py-3">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input label="Email" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com" required autoFocus />
              <Input label="Password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required />
              <Button type="submit" loading={loading} className="w-full mt-1">
                Sign in
              </Button>
            </form>

            <p className="text-center text-sm text-base-content/50">
              No account?{' '}
              <Link href="/auth/register" className="link link-primary font-medium">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
