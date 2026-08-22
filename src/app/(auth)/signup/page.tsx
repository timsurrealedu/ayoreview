'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Lock, Mail, User, AlertCircle, Building2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
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
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            organization_name: organizationName || `Grup ${name}`,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push('/onboarding');
        router.refresh();
      } else {
        // Confirmation email required
        router.push('/login?message=check_email');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between p-6 sm:p-12 font-sans">
      <header className="w-full max-w-md mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#1a73e8]/30">
            AR
          </div>
          <span className="font-bold text-white tracking-tight text-base">AyoReview</span>
        </Link>
        <Link
          href="/login"
          className="text-xs font-medium text-zinc-300 hover:text-[#1a73e8] transition"
        >
          Sudah punya akun?
        </Link>
      </header>

      <div className="w-full max-w-md mx-auto my-auto space-y-4">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-[#1a73e8] transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Kembali ke beranda
        </Link>
        <main className="bg-[#121215] border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Buat akun AyoReview
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Pasang kartu ulasan Google NFC & QR pintar di tempat usaha Anda
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-200 font-semibold mb-1.5">
              Nama lengkap *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="contoh: Budi Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-200 font-semibold mb-1.5">
              Nama bisnis / grup usaha
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="contoh: Kopi Kenangan Group"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-200 font-semibold mb-1.5">
              Alamat email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="nama@bisnis.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-200 font-semibold mb-1.5">
              Kata sandi *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition shadow-lg shadow-[#1a73e8]/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Membuat akun...' : 'Mulai Pengaturan AyoReview'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        </main>
      </div>
    </div>
  );
}
