'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'oauth_callback'
      ? 'Login Google gagal. Silakan coba lagi.'
      : null
  );

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(sanitizedRedirect)}`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  };

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
      setError(err.message || 'Terjadi kesalahan saat masuk');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full min-h-12 flex items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-white text-zinc-200 font-bold hover:bg-zinc-900 transition disabled:opacity-50"
      >
        <span className="grid size-6 place-items-center rounded-full bg-white text-sm font-black text-[#1a73e8] shadow-sm" aria-hidden="true">G</span>
        Lanjutkan dengan Google
      </button>

      <div className="flex items-center gap-3 text-zinc-500" aria-hidden="true">
        <span className="h-px flex-1 bg-zinc-800" />
        <span>atau gunakan email</span>
        <span className="h-px flex-1 bg-zinc-800" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-zinc-300 font-semibold mb-1">
          Alamat email
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
          <label className="text-zinc-300 font-semibold">Kata sandi</label>
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
        {loading ? 'Sedang masuk...' : 'Masuk ke Dasbor'}
        <ArrowRight className="w-4 h-4" />
      </button>
      </form>
    </div>
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
          Buat akun
        </Link>
      </header>

      <div className="w-full max-w-md mx-auto my-auto space-y-4">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-emerald-500 transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Kembali ke beranda
        </Link>
        <main className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Masuk ke ReviewTap
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Akses dasbor bisnis dan analitik kartu ulasan Anda
            </p>
          </div>

          <Suspense fallback={<div className="text-xs text-zinc-500 py-4 text-center">Memuat...</div>}>
            <LoginForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
