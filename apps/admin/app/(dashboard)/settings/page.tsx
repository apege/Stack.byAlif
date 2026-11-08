'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Gavel,
  PenTool,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck2,
  Sparkles,
  Shield,
} from 'lucide-react';

interface ProviderProfile {
  name: string;
  brandName: string;
  roleTitle: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  legalJurisdictionCity: string;
  defaultSignature?: string;
  updatedAt?: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<ProviderProfile>({
    name: '',
    brandName: '',
    roleTitle: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    legalJurisdictionCity: '',
    defaultSignature: '',
  });

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasNewSignature, setHasNewSignature] = useState(false);

  // Load existing settings
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch('/api/settings');
        const data = await res.json();
        const loaded = data.profile || {};

        // Merge with localStorage defaults if available
        if (typeof window !== 'undefined') {
          const localSig = localStorage.getItem('stackbyalif_default_signature');
          const localName = localStorage.getItem('stackbyalif_signer_name');
          const localTitle = localStorage.getItem('stackbyalif_signer_title');

          if (!loaded.defaultSignature && localSig) loaded.defaultSignature = localSig;
          if (!loaded.name && localName) loaded.name = localName;
          if (!loaded.roleTitle && localTitle) loaded.roleTitle = localTitle;
        }

        setForm(loaded);
      } catch (err: any) {
        console.error('Failed to load settings:', err);
        setErrorMsg('Gagal memuat pengaturan profil.');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Canvas drawing handlers (mouse & touch)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0284c7'; // Sky-600
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasNewSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasNewSignature(false);
  };

  const clearSavedSignature = () => {
    setForm((prev) => ({ ...prev, defaultSignature: '' }));
    clearCanvas();
  };

  // Touch handlers for mobile/tablet
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isTouching = false;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 0) return;
      isTouching = true;
      const r = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(touch.clientX - r.left, touch.clientY - r.top);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isTouching || e.touches.length === 0) return;
      const r = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(touch.clientX - r.left, touch.clientY - r.top);
        ctx.stroke();
        setHasNewSignature(true);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      isTouching = false;
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    let signatureToSave = form.defaultSignature || '';
    if (hasNewSignature && canvasRef.current) {
      signatureToSave = canvasRef.current.toDataURL('image/png');
    }

    // Always immediately persist to local browser storage
    if (typeof window !== 'undefined') {
      if (signatureToSave) localStorage.setItem('stackbyalif_default_signature', signatureToSave);
      if (form.name) localStorage.setItem('stackbyalif_signer_name', form.name);
      if (form.roleTitle) localStorage.setItem('stackbyalif_signer_title', form.roleTitle);
    }

    let isSuccess = false;
    let errorMessage = '';

    // 1. Try server API route
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          defaultSignature: signatureToSave,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        isSuccess = true;
        setForm(data.profile);
      } else {
        errorMessage = data.error || 'Gagal menyimpan via server API.';
      }
    } catch (apiErr: any) {
      errorMessage = apiErr.message || 'Koneksi ke server API gagal.';
    }

    // 2. Direct Supabase browser client fallback
    if (!isSuccess) {
      try {
        const supabase = createClient();
        const { data: authData } = await supabase.auth.getUser();
        const updatedProfile = {
          ...form,
          defaultSignature: signatureToSave,
          updatedAt: new Date().toISOString(),
        };

        const { error: directErr } = await supabase.from('audit_logs').insert([
          {
            action: 'PROVIDER_PROFILE_SETTING',
            entity_type: 'settings',
            entity_id: 'provider_profile',
            performed_by: authData?.user?.id || null,
            ip_address: '127.0.0.1',
            metadata: updatedProfile,
          },
        ]);

        if (!directErr) {
          isSuccess = true;
          setForm(updatedProfile);
        } else {
          errorMessage = directErr.message || errorMessage;
        }
      } catch (directCatch: any) {
        errorMessage = directCatch.message || errorMessage;
      }
    }

    if (isSuccess) {
      setHasNewSignature(false);
      setSuccessMsg('Pengaturan profil dan identitas kontrak berhasil disimpan!');
      alert('Pengaturan profil dan identitas kontrak berhasil disimpan!');
      setTimeout(() => setSuccessMsg(null), 5000);
    } else {
      setErrorMsg(errorMessage || 'Gagal menyimpan pengaturan.');
      alert(errorMessage || 'Gagal menyimpan pengaturan.');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-3" />
        <p className="text-sm">Memuat pengaturan profil bisnis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
            Identitas Resmi & Kontrak
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Pengaturan Profil Usaha
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Ubah nama, alamat domisili, kontak, serta tanda tangan resmi yang terbit di seluruh Dokumen Kontrak & PKS.
          </p>
        </div>

        {form.updatedAt && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Terakhir diperbarui: {new Date(form.updatedAt).toLocaleDateString('id-ID')}</span>
          </div>
        )}
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Informasi Dasar Usaha */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Building2 className="w-4 h-4 text-sky-400" />
                <h2 className="text-base font-bold text-white">Identitas Usaha & Penandatangan</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Lengkap Penandatangan *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Muhammad Alif Muzakky"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Nama Brand */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Brand / Badan Usaha *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={form.brandName}
                      onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                      placeholder="Stack.byAlif"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Jabatan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Jabatan / Status Wewenang *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.roleTitle}
                    onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                    placeholder="Pemilik Usaha"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Disarankan: &ldquo;Pemilik Usaha&rdquo;</p>
                </div>

                {/* Kota Yurisdiksi Hukum */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kota Yurisdiksi Hukum (Pasal 9) *
                  </label>
                  <div className="relative">
                    <Gavel className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={form.legalJurisdictionCity}
                      onChange={(e) => setForm({ ...form, legalJurisdictionCity: e.target.value })}
                      placeholder="Bandung"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Pengadilan Negeri domisili Pihak Pertama</p>
                </div>
              </div>

              {/* Alamat Domisili */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Alamat Domisili Resmi (Tampil di Kontrak & Kop Surat) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
                  <textarea
                    rows={2}
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Contoh: Bandung, Jawa Barat (atau masukkan alamat kantor lengkap)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 leading-relaxed"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Bisa diisi kota saja (misal: <em>Bandung, Jawa Barat</em>) atau alamat domisili lengkap sesuai preferensi Anda.
                </p>
              </div>
            </div>

            {/* 2. Kontak & Media Resmi */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Phone className="w-4 h-4 text-sky-400" />
                <h2 className="text-base font-bold text-white">Kontrak & Media Komunikasi</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    WhatsApp Bisnis *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0895-4127-35876"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Bisnis Resmi *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alifmuzakki1110@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Website Portofolio
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="stackbyalif.my.id"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Tanda Tangan Digital Pihak Pertama */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-sky-400" />
                  <h2 className="text-base font-bold text-white">Tanda Tangan Digital Resmi (Pihak Pertama)</h2>
                </div>
                {(form.defaultSignature || hasNewSignature) && (
                  <button
                    type="button"
                    onClick={clearSavedSignature}
                    className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer"
                  >
                    Hapus Tanda Tangan
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Bubuhkan tanda tangan asli Anda di bawah. Tanda tangan ini akan dipakai sebagai tanda tangan resmi Pihak Pertama di kolom surat perjanjian kerja sama.
              </p>

              <div className="space-y-3">
                <div className="border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950 relative">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-40 cursor-crosshair touch-none"
                  />
                  {!hasNewSignature && form.defaultSignature && (
                    <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.defaultSignature}
                        alt="Tanda Tangan Tersimpan"
                        className="max-h-20 max-w-[240px] object-contain filter invert contrast-200"
                      />
                      <span className="text-[11px] text-slate-400 mt-2">
                        Tanda Tangan Aktif Tersimpan (Klik &ldquo;Ganti / Gambar Ulang&rdquo; untuk mengubah)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {hasNewSignature
                      ? 'Tanda tangan baru terdeteksi (klik Simpan untuk menerapkan)'
                      : form.defaultSignature
                      ? 'Tanda tangan resmi sudah tersimpan'
                      : 'Belum ada tanda tangan. Silakan gambar di kotak di atas.'}
                  </span>
                  <div className="flex items-center gap-3">
                    {form.defaultSignature && !hasNewSignature && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, defaultSignature: '' }));
                          clearCanvas();
                        }}
                        className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
                      >
                        Ganti / Gambar Ulang
                      </button>
                    )}
                    {hasNewSignature && (
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Bersihkan Canvas</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button & Bottom Notifications */}
            <div className="pt-2 space-y-3">
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-sky-600/20 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Pengaturan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan Profil & Kontrak</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Document Preview */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 sticky top-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Pratinjau di Dokumen Kontrak</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Berikut pratinjau identitas PIHAK PERTAMA yang akan tampil di lembar Surat Perjanjian Kerja Sama (PKS) klien:
              </p>

              {/* Mini Contract Mock Card */}
              <div className="p-4 rounded-xl bg-white text-black font-serif text-[11px] shadow-md border border-slate-200 space-y-3">
                {/* Kop Preview */}
                <div className="border-b border-black pb-2">
                  <div className="font-sans font-bold text-sm tracking-tight">
                    {(form.brandName || 'STACK.BYALIF').toUpperCase()}
                  </div>
                  <div className="font-sans text-[9px] text-gray-700">
                    Layanan Pengembangan Website & Sistem Digital
                  </div>
                  <div className="font-sans text-[8px] text-gray-500 truncate mt-0.5">
                    {form.address || 'Bandung, Jawa Barat'} • WA: {form.phone || '0895-4127-35876'}
                  </div>
                </div>

                {/* Identity Preview */}
                <div className="pl-2 border-l-2 border-black space-y-1">
                  <div className="font-bold text-[10px]">1. PIHAK PERTAMA (Penyedia Jasa):</div>
                  <div className="text-[9.5px] leading-tight space-y-0.5">
                    <div>
                      <span className="text-gray-600">Nama:</span> <strong>{form.name || 'Muhammad Alif Muzakky'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Brand:</span> <strong>{form.brandName || 'Stack.byAlif'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Domisili:</span> {form.address || 'Bandung, Jawa Barat'}
                    </div>
                    <div>
                      <span className="text-gray-600">Kontak:</span> {form.phone || '0895-4127-35876'}
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span> {form.email || 'alifmuzakki1110@gmail.com'}
                    </div>
                  </div>
                </div>

                {/* Signature Preview */}
                <div className="pt-2 border-t border-gray-300 text-center">
                  <div className="text-[9px] font-bold">PIHAK PERTAMA</div>
                  <div className="h-10 flex items-center justify-center my-0.5">
                    {hasNewSignature ? (
                      <span className="text-[8px] text-sky-600 italic">[Tanda Tangan Baru]</span>
                    ) : form.defaultSignature ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.defaultSignature}
                        alt="Preview TTD"
                        className="max-h-8 object-contain filter contrast-200 brightness-0"
                      />
                    ) : (
                      <span className="font-serif italic text-xs tracking-wider border-b border-black pb-0.5 px-2">
                        {form.name ? form.name.split(' ').slice(0, 2).join(' ') : 'Alif Muzakky'}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-[9.5px] underline">
                    {form.name ? form.name.toUpperCase() : 'MUHAMMAD ALIF MUZAKKY'}
                  </div>
                  <div className="text-[8px] text-gray-600">
                    {form.roleTitle || 'Pemilik Usaha'}
                  </div>
                </div>
              </div>

              {/* Status info */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sinkronisasi Otomatis</span>
                </div>
                <p>
                  Setiap kali Anda menekan tombol simpan, data akan tersimpan aman di database Supabase dan langsung aktif saat klien melihat atau mencetak kontrak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
