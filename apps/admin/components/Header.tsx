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
    <header className="h-16 bg-[#070b14]/80 border-b border-slate-800/80 px-8 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span className="text-slate-300">Admin Workspace</span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition group py-1 px-2.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-800"
          title="Buka Pengaturan Profil"
        >
          <div className="w-7 h-7 rounded-full bg-[#0052ff] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-slate-200 group-hover:text-white leading-tight">
              {profile.name}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight">
              {profile.email}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
