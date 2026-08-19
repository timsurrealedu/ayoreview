'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User, AlertCircle, Building2 } from 'lucide-react';
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
            organization_name: organizationName || `${name}'s Hospitality Group`,
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
      setError(err.message || 'An unexpected error occurred during registration');
      setLoading(false);
    }
  };

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
          href="/login"
          className="text-xs text-zinc-400 hover:text-emerald-400 transition"
        >
          Sign in instead
        </Link>
      </header>

      <main className="w-full max-w-md mx-auto my-auto bg-[#121215] border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Create your ReviewTap account
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Deploy smart NFC & QR review stands in your local venue
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Timothy Surreal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Business / Group Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Surreal Hospitality Group"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@yourbusiness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Password *
            </label>
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
            {loading ? 'Creating account...' : 'Start ReviewTap Setup'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </main>

      <footer className="w-full max-w-md mx-auto text-center text-xs text-zinc-500">
        ReviewTap · Physical-to-Digital Review Infrastructure
      </footer>
    </div>
  );
}
