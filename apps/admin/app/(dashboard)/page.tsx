import Link from 'next/link';
import {
  FolderGit2,
  Users,
  FileCheck2,
  Mail,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Database,
  Lock,
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
      color: 'from-blue-500/20 to-sky-500/10 text-sky-400 border-sky-500/30',
      href: '/projects',
    },
    {
      label: 'Data Klien (Privat)',
      value: clientsCount ?? 0,
      desc: 'Tersimpan aman via RLS',
      icon: Users,
      color: 'from-purple-500/20 to-indigo-500/10 text-indigo-400 border-indigo-500/30',
      href: '/clients',
    },
    {
      label: 'Agreement & Kontrak',
      value: agreementsCount ?? 0,
      desc: 'Token acak & tanda tangan digital',
      icon: FileCheck2,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
      href: '/agreements',
    },
    {
      label: 'Pesan Belum Dibaca',
      value: inquiriesCount ?? 0,
      desc: 'Dari formulir kontak publik',
      icon: Mail,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
      href: '/inquiries',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
            Sistem Manajemen Internal
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kelola karya portfolio, unggah gambar ke cloud storage, dan proses bukti kerja sama klien secara aman.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Project Baru</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              href={s.href}
              className={`p-6 rounded-2xl bg-gradient-to-b ${s.color} border bg-slate-900/60 backdrop-blur-sm transition-all hover:-translate-y-1 block`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
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

      {/* Security & Compliance Checklist Panel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Status Keamanan & Kepatuhan Data</h2>
            <p className="text-xs text-slate-400">
              Verifikasi penerapan perlindungan identitas klien dan bukti kerja sama.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-white">Dashboard Terisolasi & Terotentikasi</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dashboard berada di subdomain khusus (admin.stackbyalif.my.id) dengan middleware auth & role admin.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-white">Supabase Row Level Security (RLS)</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tabel klien, agreement, dan log hanya dapat diakses oleh admin authenticated. Anonim diblokir secara ketat.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-white">Token Agreement Acak & Masa Berlaku</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Link agreement menggunakan token kriptografis 256-bit dan memiliki batas kadaluwarsa (expires_at).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
            <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-white">Dokumen Ditandatangani Bersifat Immutable</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Database trigger mencegah pengubahan isi agreement yang sudah berstatus signed dan tersimpan versioning-nya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
