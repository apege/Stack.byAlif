'use client';

import { useState } from 'react';
import {
  Download,
  Database,
  ShieldCheck,
  HardDrive,
  FileCheck2,
  Terminal,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function BackupPage() {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadBackup = async () => {
    setDownloading(true);
    setDownloadSuccess(false);
    try {
      const res = await fetch('/api/backup');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal mengunduh backup');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stackbyalif_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err: any) {
      alert(`Error saat unduh backup: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="pb-6 border-b border-slate-800/80">
        <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
          Sistem & Disaster Recovery
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Backup Database & Dokumen Kontrak
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Simpan salinan cadangan seluruh tabel database, data kontrak terenkripsi, dan bukti kerja sama secara berkala.
        </p>
      </div>

      {/* Main Download Card */}
      <div className="p-8 bg-[#0d1322] border border-slate-800/80 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0052ff]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">One-Click Database Snapshot (JSON)</h2>
              <p className="text-xs text-slate-400">
                Mengekstrak seluruh tabel: projects, clients, agreements, agreement_versions, inquiries, dan audit_logs.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadBackup}
          disabled={downloading}
          className="inline-flex items-center gap-2 bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium px-5 py-3 rounded-xl text-sm transition shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Menyiapkan Backup...
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Backup Terunduh!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Unduh Backup Database (.json)
            </>
          )}
        </button>
      </div>

      {/* CLI Script & Automation Guide */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>Automated CLI & Cron Backup Script</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Anda juga dapat menjalankan skrip backup otomatis dari terminal lokal atau penjadwalan CI/CD (GitHub Actions / Cloudflare Cron) untuk mencadangkan database dan berkas kontrak secara terjadwal:
        </p>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 flex items-center justify-between">
          <code>npm run backup</code>
          <span className="text-[11px] text-slate-500 font-sans">Menyimpan ke folder /backups/</span>
        </div>
      </div>

      {/* Security Principles Checklist */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Daftar Verifikasi Standar Keamanan Sistem</span>
        </div>

        <div className="grid md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Akses Dashboard Dibatasi:</span>
              <p className="text-slate-400 mt-0.5">Hanya akun dengan role admin terotentikasi yang dapat mengakses panel ini.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Supabase RLS Diaktifkan:</span>
              <p className="text-slate-400 mt-0.5">Tabel clients dan agreements memiliki kebijakan Row Level Security ketat.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Data Klien Terisolasi:</span>
              <p className="text-slate-400 mt-0.5">Portfolio publik di stackbyalif.my.id tidak memiliki akses ke data klien atau kontrak.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Dokumen Bertanda Tangan Immutable:</span>
              <p className="text-slate-400 mt-0.5">Pencegahan manipulasi teks kontrak pasca penandatanganan dijamin database trigger.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
