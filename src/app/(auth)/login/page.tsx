'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  // Sanitize: only same-origin relative paths, prevent open redirect
  const sanitizedRedirect = redirectTo.startsWith('/') && !redirectTo.startsWith('//') 
    ? redirectTo 
    : '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(sanitizedRedirect);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected login error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-zinc-300 font-semibold mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            placeholder="name@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-zinc-300 font-semibold">Password</label>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In to Dashboard'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between p-6 sm:p-12 font-sans">
      <header className="w-full max-w-md mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-sm shadow-lg shadow-emerald-500/20">
            RT
          </div>
          <span className="font-bold text-white tracking-tight">ReviewTap</span>
        </Link>
        <Link
          href="/signup"
          className="text-xs text-zinc-400 hover:text-emerald-400 transition"
        >
          Create account
        </Link>
      </header>

      <main className="w-full max-w-md mx-auto my-auto bg-[#121215] border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Sign in to ReviewTap
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Access your merchant dashboard and review card analytics
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-zinc-500 py-4 text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      <footer className="w-full max-w-md mx-auto text-center text-xs text-zinc-500">
        ReviewTap Hardware SaaS V1.1 · Production Edition
      </footer>
    </div>
  );
}
