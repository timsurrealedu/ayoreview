'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ErrorAlert } from '@/components/ui/alert';

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/my';
  const sanitizedRedirect = redirectTo.startsWith('/') && !redirectTo.startsWith('//') 
    ? redirectTo 
    : '/my';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'oauth_callback'
      ? 'Login Google gagal. Silakan coba lagi.'
      : null
  );

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(sanitizedRedirect)}`,
        },
      });

      if (authError) {
        setError(authError.message);
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memulai login Google');
      setGoogleLoading(false);
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
        setError(authError.message === 'Invalid login credentials' ? 'Email atau kata sandi salah.' : authError.message);
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
    <div className="space-y-5 text-xs">
      {error && <ErrorAlert>{error}</ErrorAlert>}

      {/* Google OAuth Login Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full min-h-12 flex items-center justify-center gap-3 rounded border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm shadow-md transition disabled:opacity-50 active:scale-[0.98] cursor-pointer"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-zinc-800" />
        ) : (
          <GoogleIcon className="w-5 h-5" />
        )}
        <span>{googleLoading ? 'Menghubungkan ke Google...' : 'Masuk dengan Google'}</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 font-semibold text-ink" aria-hidden="true">
        <span className="h-px flex-1 bg-subtle" />
        <span className="text-[11px] uppercase tracking-wider">atau gunakan email</span>
        <span className="h-px flex-1 bg-subtle" />
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-ink font-bold mb-1.5 text-xs">
            Alamat Email *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="nama@bisnis.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-line focus:border-action rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-medium text-xs focus:outline-none focus:ring-1 focus:ring-action"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-ink font-bold text-xs">Kata Sandi *</label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-line focus:border-action rounded pl-10 pr-4 py-3 text-ink placeholder:text-muted-ink font-medium text-xs focus:outline-none focus:ring-1 focus:ring-action"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-action hover:bg-action-hover text-white font-bold text-sm transition shadow-lg shadow-action/30 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          <span>{loading ? 'Sedang masuk...' : 'Masuk ke Dasbor'}</span>
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between p-4 sm:p-8 font-sans">
      <header className="w-full max-w-md mx-auto flex items-center justify-between pb-4 border-b border-line">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-action flex items-center justify-center text-white font-black text-sm shadow-md shadow-action/30 group-hover:scale-105 transition">
            A
          </div>
          <span className="font-bold text-ink tracking-tight text-base">AyoReview</span>
        </Link>
        <Link
          href="/signup"
          className="text-xs font-bold text-action hover:text-action-hover hover:underline transition"
        >
          Daftar Akun Baru
        </Link>
      </header>

      <div className="w-full max-w-md mx-auto my-auto space-y-3 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-ink hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Kembali ke Beranda
        </Link>
        <main className="bg-surface border border-line rounded p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
              Masuk ke AyoReview
            </h1>
            <p className="text-xs text-ink mt-1">
              Akses dasbor bisnis dan analitik kartu ulasan Anda
            </p>
          </div>

          <Suspense fallback={<div className="text-xs text-ink py-4 text-center">Memuat...</div>}>
            <LoginForm />
          </Suspense>
        </main>
      </div>

      <footer className="w-full max-w-md mx-auto text-center text-xs text-muted-ink py-2">
        © 2026 AyoReview · Platform Ulasan Google Cerdas
      </footer>
    </div>
  );
}
