'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    brandName: string;
  }>({
    name: 'Muhammad Alif Muzakky',
    email: 'alifmuzakki1110@gmail.com',
    brandName: 'Stack.byAlif',
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const res = await fetch('/api/settings');
        const data = await res.json();

        setProfile({
          name: data?.profile?.name || user?.user_metadata?.full_name || 'Muhammad Alif Muzakky',
          email: data?.profile?.email || user?.email || 'alifmuzakki1110@gmail.com',
          brandName: data?.profile?.brandName || 'Stack.byAlif',
        });
      } catch (e) {
        console.warn('Failed to load user profile in header:', e);
      }
    }
    loadUser();
  }, []);

  return (
    <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 px-8 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>RLS Active & Secured</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition group py-1 px-2.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60"
          title="Buka Pengaturan Profil"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500/20 to-blue-600/30 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xs group-hover:border-sky-400 transition shrink-0">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-slate-200 group-hover:text-white leading-tight">
              {profile.name}
            </span>
            <span className="text-[11px] text-slate-400 group-hover:text-sky-300 leading-tight">
              {profile.email}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
