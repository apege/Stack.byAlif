'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  Terminal,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export interface Milestone {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  date?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  author: string;
}

export interface ProjectTracking {
  id: string;
  tracking_code: string;
  registration_number?: string;
  agreement_id?: string;
  client_id?: string;
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
  created_at: string;
  updated_at: string;
}

interface ClientOption {
  id: string;
  name: string;
  company?: string;
  email?: string;
}

interface AgreementOption {
  id: string;
  project_title: string;
  client_id: string;
}

export const PHASES = [
  '01. Onboarding & Verifikasi Data',
  '02. Wireframing & UI/UX Design',
  '03. Frontend & Architecture Engineering',
  '04. Backend, Database & API Integration',
  '05. Testing, Security QA & Audit',
  '06. Client Review & Revisions',
  '07. Production Deployment & Handover',
  'Selesai (Completed)',
];

export default function TrackingClient({
  initialTrackings,
  clients,
  agreements,
}: {
  initialTrackings: ProjectTracking[];
  clients: ClientOption[];
  agreements: AgreementOption[];
}) {
  const router = useRouter();
  const [trackings, setTrackings] = useState<ProjectTracking[]>(initialTrackings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Create Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newRegNumber, setNewRegNumber] = useState('');
  const [newPhase, setNewPhase] = useState(PHASES[0]);
  const [newProgress, setNewProgress] = useState(15);
  const [newStagingUrl, setNewStagingUrl] = useState('');
  const [newEstCompletion, setNewEstCompletion] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [initialNote, setInitialNote] = useState('Proyek resmi dimulai, sedang penyiapan arsitektur.');

  // Update Form State
  const [editPhase, setEditPhase] = useState('');
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState<any>('in_progress');
  const [editStagingUrl, setEditStagingUrl] = useState('');
  const [editProdUrl, setEditProdUrl] = useState('');
  const [editEstCompletion, setEditEstCompletion] = useState('');
  const [newLogText, setNewLogText] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: newProjectName,
          client_name: newClientName,
          client_company: newClientCompany,
          registration_number: newRegNumber,
          current_phase: newPhase,
          progress_percent: newProgress,
          staging_url: newStagingUrl,
          estimated_completion: newEstCompletion,
          initial_log: initialNote,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal membuat status proyek.');

      setTrackings([result.data, ...trackings]);
      setIsCreateOpen(false);
      resetCreateForm();
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetCreateForm = () => {
    setNewProjectName('');
    setNewClientName('');
    setNewClientCompany('');
    setNewRegNumber('');
    setNewPhase(PHASES[0]);
    setNewProgress(15);
    setNewStagingUrl('');
  };

  const openEditModal = (item: ProjectTracking) => {
    setEditingItem(item);
    setEditPhase(item.current_phase);
    setEditProgress(item.progress_percent);
    setEditStatus(item.status);
    setEditStagingUrl(item.staging_url || '');
    setEditProdUrl(item.production_url || '');
    setEditEstCompletion(item.estimated_completion || '');
    setNewLogText('');
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/tracking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          current_phase: editPhase,
          progress_percent: editProgress,
          status: editStatus,
          staging_url: editStagingUrl,
          production_url: editProdUrl,
          estimated_completion: editEstCompletion,
          new_log_message: newLogText,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal update status proyek.');

      setTrackings(trackings.map((t) => (t.id === editingItem.id ? result.data : t)));
      setEditingItem(null);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus tracker proyek ini?')) return;
    try {
      const res = await fetch(`/api/tracking?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTrackings(trackings.filter((t) => t.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const clientUrl = origin.includes('admin.')
      ? origin.replace('admin.', 'client.') + `/status?code=${code}`
      : `https://client.stackbyalif.my.id/status?code=${code}`;

    navigator.clipboard.writeText(clientUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filtered = trackings.filter((t) => {
    const matchesSearch =
      t.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.registration_number || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && t.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama proyek, klien, ref code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'in_progress', 'review', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'Semua' : st === 'in_progress' ? 'Aktif' : st === 'review' ? 'Review' : 'Selesai'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Mulai Tracker Proyek
          </button>
        </div>
      </div>

      {/* 2. Tracked Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <Activity className="w-10 h-10 mx-auto text-slate-600 mb-3 opacity-60" />
            Belum ada proyek yang sedang ditrack. Klik &ldquo;Mulai Tracker Proyek&rdquo; untuk memulai.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Row: Ref Code & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 border border-sky-800/80 px-2.5 py-0.5 rounded-lg">
                      {item.tracking_code}
                    </span>
                    {item.registration_number && (
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                        Ref: {item.registration_number}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      item.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                        : item.status === 'review'
                        ? 'bg-purple-950 text-purple-400 border border-purple-800/80'
                        : 'bg-amber-950 text-amber-400 border border-amber-800/80'
                    }`}
                  >
                    {item.status === 'in_progress' ? 'Sedang Dikerjakan' : item.status}
                  </span>
                </div>

                {/* Project & Client */}
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {item.project_name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klien: <strong className="text-slate-200">{item.client_name}</strong>{' '}
                  {item.client_company ? `(${item.client_company})` : ''}
                </p>

                {/* Current Phase Pill */}
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    Fase Saat Ini:
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-800/40">
                    {item.current_phase}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Total Progres</span>
                    <span className="text-sky-400 font-mono">{item.progress_percent}% Selesai</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${item.progress_percent}%` }}
                    />
                  </div>
                </div>

                {/* Staging URL Link */}
                {item.staging_url && (
                  <div className="mt-3 text-xs flex items-center gap-1.5">
                    <span className="text-slate-500">Preview:</span>
                    <a
                      href={item.staging_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1 font-mono truncate"
                    >
                      {item.staging_url} <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}

                {/* Latest Activity Log */}
                {item.activity_logs && item.activity_logs.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span className="font-semibold uppercase flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-slate-400" /> Catatan Terakhir
                      </span>
                      <span>
                        {new Date(item.activity_logs[0].timestamp).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="text-slate-300 italic line-clamp-2">
                      &ldquo;{item.activity_logs[0].message}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyLink(item.tracking_code)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                  title="Salin link live tracking untuk klien"
                >
                  {copiedCode === item.tracking_code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Link Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Salin Link Klien
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-800 text-xs font-semibold text-sky-300 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Update Progres
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus Tracker"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. Modal Mulai Tracker Proyek Baru */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Mulai Live Status Proyek</h3>
                  <p className="text-xs text-slate-400">
                    Klien bisa memantau progres dan catatan pengerjaan secara real-time.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Nama Proyek *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Redesign Website & Sistem Pemesanan"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nama Klien *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Klien"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nama Perusahaan / Brand</label>
                  <input
                    type="text"
                    placeholder="Brand Klien"
                    value={newClientCompany}
                    onChange={(e) => setNewClientCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Nomor Referensi Registrasi (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: REG-XXXXXXXX"
                    value={newRegNumber}
                    onChange={(e) => setNewRegNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Estimasi Tanggal Selesai</label>
                  <input
                    type="date"
                    value={newEstCompletion}
                    onChange={(e) => setNewEstCompletion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Fase Awal Proyek</label>
                <select
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                >
                  {PHASES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium text-slate-300">Persentase Progres Awal</label>
                  <span className="font-mono text-sky-400 font-bold">{newProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Link Preview Staging (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://staging.domain.com"
                  value={newStagingUrl}
                  onChange={(e) => setNewStagingUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Catatan Log Awal</label>
                <textarea
                  rows={2}
                  value={initialNote}
                  onChange={(e) => setInitialNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Mulai Tracking Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Update Progres Proyek */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Update Status Proyek</h3>
                <p className="text-xs text-sky-400 font-mono mt-0.5">
                  {editingItem.project_name} ({editingItem.tracking_code})
                </p>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Tahapan / Fase Saat Ini</label>
                <select
                  value={editPhase}
                  onChange={(e) => setEditPhase(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                >
                  {PHASES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium text-slate-300">Persentase Progres Proyek</label>
                  <span className="font-mono text-emerald-400 font-bold text-sm">{editProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Status Proyek</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="in_progress">Sedang Dikerjakan (In Progress)</option>
                    <option value="review">Tahap Review Klien</option>
                    <option value="completed">Selesai (Completed / Handover)</option>
                    <option value="on_hold">Ditunda (On Hold)</option>
                    <option value="planning">Perencanaan (Planning)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Estimasi Selesai</label>
                  <input
                    type="date"
                    value={editEstCompletion}
                    onChange={(e) => setEditEstCompletion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Link Preview Staging / Demo</label>
                <input
                  type="url"
                  placeholder="https://staging.domain.com"
                  value={editStagingUrl}
                  onChange={(e) => setEditStagingUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Tambah Catatan Log Progres Baru (Akan dilihat Klien)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Fitur payment gateway dan kalkulator ongkir berhasil terpasang dan siap dites."
                  value={newLogText}
                  onChange={(e) => setNewLogText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Perbarui Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
