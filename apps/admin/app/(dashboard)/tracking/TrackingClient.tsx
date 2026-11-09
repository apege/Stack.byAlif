'use client';

import { useState, useRef, useEffect } from 'react';
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
  X,
  ChevronDown,
} from 'lucide-react';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomPhaseSelect from '@/components/CustomPhaseSelect';
import CustomStatusSelect from '@/components/CustomStatusSelect';

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

export interface ClientRegistrationOption {
  id: string;
  registration_number: string;
  full_name: string;
  business_name: string;
  email?: string;
  domain_name?: string;
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
  registrations = [],
}: {
  initialTrackings: ProjectTracking[];
  clients: ClientOption[];
  agreements: AgreementOption[];
  registrations?: ClientRegistrationOption[];
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

  // Autocomplete state for Registration Numbers
  const [showRegSuggestions, setShowRegSuggestions] = useState(false);
  const regContainerRef = useRef<HTMLDivElement>(null);
  const [quickSource, setQuickSource] = useState('');

  const filteredRegistrations = registrations.filter((r) => {
    if (!newRegNumber.trim()) return true;
    const q = newRegNumber.toLowerCase();
    return (
      r.registration_number.toLowerCase().includes(q) ||
      r.full_name.toLowerCase().includes(q) ||
      r.business_name.toLowerCase().includes(q) ||
      (r.domain_name && r.domain_name.toLowerCase().includes(q))
    );
  });

  const handleSelectRegistration = (r: ClientRegistrationOption) => {
    setNewRegNumber(r.registration_number);
    setNewClientName(r.full_name);
    setNewClientCompany(r.business_name);
    if (!newProjectName || newProjectName.startsWith('Pengembangan Website') || newProjectName.startsWith('Website')) {
      setNewProjectName(
        r.domain_name
          ? `Website ${r.domain_name} — ${r.business_name}`
          : `Pengembangan Website — ${r.business_name}`
      );
    }
    setShowRegSuggestions(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (regContainerRef.current && !regContainerRef.current.contains(e.target as Node)) {
        setShowRegSuggestions(false);
      }
    }
    if (showRegSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRegSuggestions]);

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
                    ? 'bg-[#0052ff] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'Semua' : st === 'in_progress' ? 'Aktif' : st === 'review' ? 'Review' : 'Selesai'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0052ff] hover:bg-[#0045d8] text-white text-sm font-medium shadow-xs transition-all shrink-0 cursor-pointer"
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
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-[#0052ff] h-full rounded-full transition-all duration-500 shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden my-auto">
            {/* Modal Header (Sticky) */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-800/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0052ff]">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Mulai Live Status Proyek</h3>
                  <p className="text-xs text-slate-400">
                    Klien bisa memantau progres dan catatan pengerjaan secara real-time.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form with Scrollable Body & Sticky Footer */}
            <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto overflow-x-hidden space-y-4 text-xs flex-1">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 0. Quick Auto-fill Selector */}
                {(registrations.length > 0 || agreements.length > 0) && (
                  <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-blue-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pilih Registrasi / Klien (Isi Otomatis)</span>
                      </label>
                      <span className="text-[10px] text-slate-500">Auto-fill semua data form</span>
                    </div>
                    <select
                      value={quickSource}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuickSource(val);
                        if (!val) return;
                        if (val.startsWith('reg:')) {
                          const regNum = val.replace('reg:', '');
                          const found = registrations.find((r) => r.registration_number === regNum);
                          if (found) handleSelectRegistration(found);
                        } else if (val.startsWith('ag:')) {
                          const agId = val.replace('ag:', '');
                          const foundAg = agreements.find((a) => a.id === agId);
                          if (foundAg) {
                            setNewProjectName(foundAg.project_title);
                            const foundClient = clients.find((c) => c.id === foundAg.client_id);
                            if (foundClient) {
                              setNewClientName(foundClient.name);
                              setNewClientCompany(foundClient.company || '');
                            }
                          }
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#0052ff] text-xs cursor-pointer"
                    >
                      <option value="">-- Pilih untuk Auto-Fill Formulir --</option>
                      {registrations.length > 0 && (
                        <optgroup label="Registrasi Klien Masuk">
                          {registrations.map((r) => (
                            <option key={r.id} value={`reg:${r.registration_number}`}>
                              [{r.registration_number}] {r.full_name} — {r.business_name} {r.domain_name ? `(${r.domain_name})` : ''}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {agreements.length > 0 && (
                        <optgroup label="Kontrak Agreement PKS">
                          {agreements.map((a) => (
                            <option key={a.id} value={`ag:${a.id}`}>
                              {a.project_title}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                )}

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
                  <div className="relative" ref={regContainerRef}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-slate-300">
                        Nomor Referensi Registrasi (Opsional)
                      </label>
                      {registrations.length > 0 && (
                        <span className="text-[10px] text-blue-400 font-medium">
                          {registrations.length} terdaftar
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ketik / pilih REG-XXXXXXXX"
                        value={newRegNumber}
                        onFocus={() => setShowRegSuggestions(true)}
                        onChange={(e) => {
                          setNewRegNumber(e.target.value);
                          setShowRegSuggestions(true);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#0052ff] font-mono text-xs pr-8 transition"
                      />
                      {newRegNumber ? (
                        <button
                          type="button"
                          onClick={() => {
                            setNewRegNumber('');
                            setShowRegSuggestions(false);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                          title="Hapus"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowRegSuggestions(!showRegSuggestions)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                          title="Tampilkan daftar registrasi"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Autocomplete Dropdown List */}
                    {showRegSuggestions && filteredRegistrations.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0d1322] border border-slate-800 rounded-xl shadow-2xl max-h-56 overflow-y-auto divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 bg-slate-950/90 sticky top-0 flex items-center justify-between border-b border-slate-800/80">
                          <span>Saran Registrasi Klien ({filteredRegistrations.length})</span>
                          <span className="text-[9px] text-[#0052ff] font-medium">Klik untuk auto-fill</span>
                        </div>
                        {filteredRegistrations.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => handleSelectRegistration(r)}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-800/80 transition-colors flex flex-col gap-0.5 cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-sky-400 group-hover:text-white text-xs">
                                {r.registration_number}
                              </span>
                              <span className="text-[11px] text-slate-300 font-semibold truncate max-w-[150px]">
                                {r.business_name}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <span className="text-slate-400">Klien: {r.full_name}</span>
                              {r.domain_name && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-400 truncate max-w-[120px]">{r.domain_name}</span>
                                </>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Estimasi Tanggal Selesai</label>
                    <CustomDatePicker
                      value={newEstCompletion}
                      onChange={setNewEstCompletion}
                      placeholder="Pilih estimasi selesai..."
                      align="right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Fase Awal Proyek</label>
                  <CustomPhaseSelect
                    value={newPhase}
                    onChange={(val) => {
                      setNewPhase(val);
                      const idx = PHASES.indexOf(val);
                      if (idx >= 0) {
                        const suggested = Math.min(100, Math.round(((idx + 1) / PHASES.length) * 100));
                        setNewProgress(suggested);
                      }
                    }}
                  />
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
                    className="w-full accent-[#0052ff] cursor-pointer"
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
              </div>

              {/* Modal Footer (Sticky) */}
              <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#090d18] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-medium transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium shadow-xs transition-all disabled:opacity-50 cursor-pointer text-sm"
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
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden my-auto">
            {/* Modal Header (Sticky) */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-800/80 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Update Status Proyek</h3>
                <p className="text-xs text-sky-400 font-mono mt-0.5">
                  {editingItem.project_name} ({editingItem.tracking_code})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form with Scrollable Body & Sticky Footer */}
            <form onSubmit={handleUpdateSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto overflow-x-hidden space-y-4 text-xs flex-1">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tahapan / Fase Saat Ini</label>
                  <CustomPhaseSelect
                    value={editPhase}
                    onChange={(val) => {
                      setEditPhase(val);
                      const idx = PHASES.indexOf(val);
                      if (idx >= 0) {
                        const suggested = Math.min(100, Math.round(((idx + 1) / PHASES.length) * 100));
                        setEditProgress(suggested);
                        if (val === 'Selesai (Completed)') {
                          setEditStatus('completed');
                        }
                      }
                    }}
                  />
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
                    <CustomStatusSelect
                      value={editStatus}
                      onChange={setEditStatus}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Estimasi Selesai</label>
                    <CustomDatePicker
                      value={editEstCompletion}
                      onChange={setEditEstCompletion}
                      placeholder="Pilih estimasi selesai..."
                      align="right"
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
              </div>

              {/* Modal Footer (Sticky) */}
              <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#090d18] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-medium transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium shadow-xs transition-all disabled:opacity-50 cursor-pointer text-sm"
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
