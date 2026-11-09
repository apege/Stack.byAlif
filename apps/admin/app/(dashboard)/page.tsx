import Link from 'next/link';
import {
  FolderGit2,
  Users,
  FileCheck2,
  Mail,
  Plus,
  ArrowUpRight,
  Activity,
  Receipt,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch counts safely
  const [
    { count: projectsCount },
    { count: clientsCount },
    { count: agreementsCount },
    { count: inquiriesCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('agreements').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
  ]);

  const stats = [
    {
      label: 'Total Project',
      value: projectsCount ?? 0,
      desc: 'Portfolio di web publik',
      icon: FolderGit2,
      href: '/projects',
    },
    {
      label: 'Data Klien',
      value: clientsCount ?? 0,
      desc: 'Mitra kerja sama terdaftar',
      icon: Users,
      href: '/clients',
    },
    {
      label: 'Agreement & Kontrak',
      value: agreementsCount ?? 0,
      desc: 'PKS & tanda tangan digital',
      icon: FileCheck2,
      href: '/agreements',
    },
    {
      label: 'Pesan Masuk',
      value: inquiriesCount ?? 0,
      desc: 'Konsultasi belum dibaca',
      icon: Mail,
      href: '/inquiries',
    },
  ];

  const quickActions = [
    {
      title: 'Status Proyek Live',
      desc: 'Kelola milestone pengerjaan & update progres ke klien.',
      icon: Activity,
      href: '/tracking',
      badge: 'Live Tracker',
    },
    {
      title: 'Invoice & Tagihan',
      desc: 'Terbitkan invoice resmi termin DP 50% atau pelunasan.',
      icon: Receipt,
      href: '/invoices',
      badge: 'Billing',
    },
    {
      title: 'Registrasi Klien Masuk',
      desc: 'Review data onboarding, domain pilihan, dan legal intake.',
      icon: UserCheck,
      href: '/registrations',
      badge: 'Onboarding',
    },
    {
      title: 'Kontrak Agreement (PKS)',
      desc: 'Buat draf kerja sama dan kirim link penandatanganan.',
      icon: FileCheck2,
      href: '/agreements',
      badge: 'PKS Digital',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            Ringkasan Sistem
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kelola karya portfolio, pantau progres milestone, terbitkan invoice, dan kelola kontrak klien.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium px-4 py-2.5 rounded-xl text-sm transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Project Baru</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              href={s.href}
              className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 transition-all duration-200 block group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {s.value}
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-1">
                {s.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">{s.desc}</div>
            </Link>
          );
        })}
      </div>

      {/* Operational Quick Actions Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Menu Operasional & Quick Actions
          </h2>
          <span className="text-xs text-slate-400">Pintasan modul utama</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[#0052ff]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#0052ff] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
                  <span>Buka Menu</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
