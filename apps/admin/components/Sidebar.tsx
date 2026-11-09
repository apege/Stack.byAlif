'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  FileCheck2,
  Mail,
  ShieldCheck,
  LogOut,
  ExternalLink,
  UserCheck,
  Settings,
  Receipt,
  Activity,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Kelola Project', href: '/projects', icon: FolderGit2 },
  { name: 'Status Proyek Live', href: '/tracking', icon: Activity },
  { name: 'Invoice & Tagihan', href: '/invoices', icon: Receipt },
  { name: 'Registrasi Klien', href: '/registrations', icon: UserCheck },
  { name: 'Data Klien (Privat)', href: '/clients', icon: Users },
  { name: 'Agreement & Kontrak', href: '/agreements', icon: FileCheck2 },
  { name: 'Pesan Masuk', href: '/inquiries', icon: Mail },
  { name: 'Pengaturan Profil', href: '/settings', icon: Settings },
  { name: 'Backup & Security', href: '/backup', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-[#0b0f19] border-r border-slate-800/80 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-slate-950 border border-slate-800 shadow-xs">
            <Image
              src="/images/logo.png"
              alt="Stack.byAlif Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">
              Stack<span className="text-[#0052ff]">.</span>byAlif
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
              Admin Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-800/90 text-white border border-slate-700/80 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0052ff]' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-2 shrink-0 bg-[#0b0f19]">
        <a
          href="https://stackbyalif.my.id"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition"
        >
          <span>Lihat Website Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-rose-400/90 hover:bg-rose-950/30 hover:text-rose-300 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
