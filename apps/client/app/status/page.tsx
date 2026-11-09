'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calendar,
  Layers,
  Terminal,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  date?: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  author: string;
}

interface TrackingData {
  tracking_code: string;
  registration_number?: string;
  project_name: string;
  client_name: string;
  client_company?: string;
  current_phase: string;
  progress_percent: number;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
  staging_url?: string;
  production_url?: string;
  estimated_completion?: string;
  milestones: Milestone[];
  activity_logs: ActivityLog[];
  updated_at: string;
}

function StatusContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || searchParams.get('ref') || '';

  const [searchCode, setSearchCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<TrackingData | null>(null);

  const fetchTracking = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/tracking/search?code=${encodeURIComponent(codeToSearch.trim())}`);
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Proyek tidak ditemukan.');
      }
      setData(result.data);
    } catch (err: any) {
      setData(null);
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchTracking(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(searchCode);
  };

  return (
    <div className="space-y-8">
      {/* Search Bar Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-900 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
            Real-Time Project Tracking
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pantau Progres Pengerjaan Proyek Anda
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Masukkan Nomor Referensi Registrasi (<code className="text-zinc-200">REG-XXXXXX</code>) atau Kode Tracking Proyek (<code className="text-zinc-200">PRJ-XXXXXX</code>) yang Anda terima.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              required
              placeholder="Contoh: REG-XXXXXX atau PRJ-XXXXXX"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengecek...
              </>
            ) : (
              <>
                Lacak Progres <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {data && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Status Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full">
                    {data.tracking_code}
                  </span>
                  {data.registration_number && (
                    <span className="font-mono text-xs text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                      Ref: {data.registration_number}
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {data.project_name}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Klien: <strong className="text-zinc-200">{data.client_name}</strong>{' '}
                  {data.client_company ? `(${data.client_company})` : ''}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Status Pengerjaan
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                  data.status === 'completed'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/80'
                    : data.status === 'review'
                    ? 'bg-purple-950 text-purple-400 border border-purple-700/80'
                    : 'bg-amber-950 text-amber-400 border border-amber-700/80'
                }`}>
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  {data.status === 'completed'
                    ? 'Selesai & Handover'
                    : data.status === 'review'
                    ? 'Tahap Review Klien'
                    : 'Sedang Berjalan (In Progress)'}
                </span>
              </div>
            </div>

            {/* Glowing Neon Progress Bar */}
            <div className="py-6 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Fase Saat Ini:</span>
                  <span className="text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/40">
                    {data.current_phase}
                  </span>
                </div>
                <span className="font-mono text-lg text-emerald-400 font-extrabold">
                  {data.progress_percent}%
                </span>
              </div>

              <div className="w-full bg-zinc-900 h-4 rounded-full overflow-hidden p-0.5 border border-zinc-800 shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 h-full rounded-full transition-all duration-700 shadow-lg shadow-emerald-500/20"
                  style={{ width: `${data.progress_percent}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 pt-1 gap-2">
                <span>
                  Terakhir diperbarui:{' '}
                  <strong className="text-zinc-300">
                    {new Date(data.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </strong>
                </span>

                {data.estimated_completion && (
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    Target Selesai:{' '}
                    <strong className="text-white">
                      {new Date(data.estimated_completion).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </strong>
                  </span>
                )}
              </div>
            </div>

            {/* Staging & Live Buttons */}
            {data.staging_url && (
              <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/80">
                <div className="text-xs">
                  <span className="font-bold text-white block">Preview Staging / Demo Tersedia</span>
                  <span className="text-zinc-400 text-[11px]">
                    Sistem dapat dicoba secara langsung melalui tautan privat berikut:
                  </span>
                </div>
                <a
                  href={data.staging_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow transition-all shrink-0"
                >
                  <ExternalLink className="w-4 h-4" /> Buka Live Demo Staging
                </a>
              </div>
            )}
          </div>

          {/* Timeline & Milestones Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Roadmap Milestones */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-zinc-900 pb-3">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Tahapan Pengerjaan (Roadmap)</span>
              </div>

              <div className="space-y-3">
                {data.milestones && data.milestones.length > 0 ? (
                  data.milestones.map((ms, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                        ms.status === 'completed'
                          ? 'bg-emerald-950/20 border-emerald-900/50 text-zinc-200'
                          : ms.status === 'in_progress'
                          ? 'bg-zinc-900 border-emerald-500/50 text-white shadow-sm'
                          : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {ms.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : ms.status === 'in_progress' ? (
                          <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-800 shrink-0" />
                        )}
                        <span className="font-medium">{ms.title}</span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        ms.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-400'
                          : ms.status === 'in_progress'
                          ? 'bg-amber-950 text-amber-400'
                          : 'text-zinc-600'
                      }`}>
                        {ms.status === 'completed' ? 'Selesai' : ms.status === 'in_progress' ? 'Proses' : 'Menunggu'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 py-4 text-center">Milestones belum dikonfigurasi.</p>
                )}
              </div>
            </div>

            {/* 2. Real-Time Activity Logs */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-zinc-900 pb-3">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>Log Aktivitas & Catatan Rekayasa</span>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {data.activity_logs && data.activity_logs.length > 0 ? (
                  data.activity_logs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="font-semibold text-zinc-400">{log.author || 'Stack.byAlif'}</span>
                        <span>
                          {new Date(log.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-zinc-200 leading-relaxed font-sans">{log.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 py-4 text-center">Belum ada catatan aktivitas.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Banner Navigation */}
      <header className="border-b border-zinc-900 bg-zinc-950/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 shadow-md">
              <Image
                src="/images/logo.png"
                alt="Stack.byAlif Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-white block">
                Stack.byAlif
              </span>
              <span className="text-[11px] text-zinc-400">Client Project Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              Registrasi
            </Link>
            <Link
              href="/agreement"
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              Tanda Tangan PKS
            </Link>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              Live Tracker
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        <Suspense fallback={<div className="text-center py-12 text-zinc-500 text-sm">Memuat modul tracking...</div>}>
          <StatusContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600 bg-zinc-950">
        <p>© {new Date().getFullYear()} Stack.byAlif. Seluruh hak cipta dilindungi undang-undang.</p>
        <p className="mt-1 text-[11px] text-zinc-500">
          Sistem live tracking transparan untuk klien resmi Stack.byAlif.
        </p>
      </footer>
    </div>
  );
}
