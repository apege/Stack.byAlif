'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Key,
  PenTool,
  Loader2,
  DollarSign,
  Briefcase,
  Layers,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AgreementData {
  id: string;
  project_title: string;
  client_company: string;
  client_contact_name: string;
  scope_of_work: string;
  deliverables: string[];
  total_fee: number;
  payment_terms: string;
  terms_and_conditions: string;
  status: string;
  expires_at: string;
  signed_at?: string;
  signer_name?: string;
  signer_title?: string;
  document_checksum?: string;
  access_code?: string;
  access_token?: string;
}

export default function ClientAgreementPortal({ initialRef }: { initialRef: string }) {
  const [refId, setRefId] = useState(initialRef);
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [agreement, setAgreement] = useState<AgreementData | null>(null);

  // Signer inputs
  const [signerName, setSignerName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Format currency
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // Retrieve agreement by ID and access code
      const { data, error } = await supabase
        .from('agreements')
        .select(`
          id,
          project_title,
          scope_of_work,
          deliverables,
          total_fee,
          payment_terms,
          terms_and_conditions,
          status,
          expires_at,
          signed_at,
          signer_name,
          signer_title,
          document_checksum,
          access_code,
          access_token,
          client:clients(company, name)
        `)
        .eq('id', refId.trim())
        .single();

      if (error || !data) {
        throw new Error('Dokumen agreement tidak ditemukan. Pastikan ID referensi benar.');
      }

      // Verify access code
      if (data.access_code.toUpperCase() !== accessCode.trim().toUpperCase()) {
        throw new Error('Kode verifikasi salah. Silakan periksa kembali kode yang diberikan.');
      }

      // Check expiry
      const isExpired = new Date(data.expires_at).getTime() < Date.now();
      const currentStatus = isExpired && data.status !== 'signed' ? 'expired' : data.status;

      setAgreement({
        ...data,
        status: currentStatus,
        client_company: (data.client as any)?.company || 'Klien',
        client_contact_name: (data.client as any)?.name || 'PIC',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memverifikasi dokumen.');
    } finally {
      setLoading(false);
    }
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(x, y);
    ctx.stroke();
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
    setHasSignature(false);
  };

  const handleSign = async () => {
    if (!agreement) return;
    if (!signerName.trim()) {
      alert('Masukkan nama lengkap penandatangan.');
      return;
    }
    if (!hasSignature || !canvasRef.current) {
      alert('Silakan bubuhkan tanda tangan digital pada kotak tanda tangan.');
      return;
    }

    setSigning(true);
    try {
      const signatureDataUrl = canvasRef.current.toDataURL('image/png');

      // Generate SHA-256 checksum client-side
      const rawText = `${agreement.id}:${agreement.total_fee}:${signerName.trim()}:${new Date().toISOString()}`;
      const msgBuffer = new TextEncoder().encode(rawText);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const checksum = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      const supabase = createClient();
      const { error } = await supabase
        .from('agreements')
        .update({
          status: 'signed',
          signed_at: new Date().toISOString(),
          signer_name: signerName.trim(),
          signer_title: signerTitle.trim() || 'PIC / Direktur',
          signature_data: signatureDataUrl,
          document_checksum: checksum,
          version: 2,
          updated_at: new Date().toISOString(),
        })
        .eq('id', agreement.id);

      if (error) throw error;

      // Update local state
      setAgreement({
        ...agreement,
        status: 'signed',
        signed_at: new Date().toISOString(),
        signer_name: signerName.trim(),
        signer_title: signerTitle.trim() || 'PIC / Direktur',
        document_checksum: checksum,
      });
    } catch (err: any) {
      alert(`Gagal menandatangani agreement: ${err.message}`);
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 selection:bg-sky-500 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Portal Penandatanganan Bukti Kerja Sama</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Stack.byAlif Agreement Portal
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Sistem verifikasi dokumen hukum digital dengan tanda tangan elektronik terenkripsi dan pengarsipan immutable.
          </p>
        </div>

        {/* Verification Card (if not loaded yet) */}
        {!agreement ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <Key className="w-5 h-5 text-sky-400" />
              <div>
                <h2 className="text-base font-bold text-white">Masukkan Otorisasi Dokumen</h2>
                <p className="text-xs text-slate-400">
                  Untuk keamanan privasi, masukkan ID Dokumen dan Kode Verifikasi rahasia Anda.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  ID Dokumen (Referensi)
                </label>
                <input
                  type="text"
                  required
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  placeholder="Contoh: 123e4567-e89b-12d3-a456-426614174000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Kode Verifikasi Rahasia (6 Karakter)
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Contoh: ALF892"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono uppercase tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memvalidasi Otorisasi...
                  </>
                ) : (
                  <>
                    Buka Dokumen Kerja Sama <FileText className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Agreement View & Sign Area */
          <div className="space-y-6">
            {/* Status Alert */}
            {agreement.status === 'signed' ? (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300">Dokumen Telah Sah Ditandatangani (Immutable)</div>
                  <p className="text-xs text-emerald-400/90 mt-1">
                    Ditandatangani oleh <strong>{agreement.signer_name}</strong> ({agreement.signer_title}) pada{' '}
                    {new Date(agreement.signed_at || '').toLocaleString('id-ID')}. Checksum integritas:{' '}
                    <span className="font-mono">{agreement.document_checksum}</span>
                  </p>
                </div>
              </div>
            ) : agreement.status === 'expired' ? (
              <div className="p-4 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-300">Masa Berlaku Dokumen Telah Kedaluwarsa</div>
                  <p className="text-xs text-red-400/90 mt-1">
                    Batas waktu penandatanganan dokumen ini telah berakhir pada{' '}
                    {new Date(agreement.expires_at).toLocaleString('id-ID')}. Silakan hubungi Stack.byAlif untuk penerbitan dokumen pembaruan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-800/80 text-amber-200 text-sm flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300">Menunggu Penandatanganan</div>
                  <p className="text-xs text-amber-400/90 mt-0.5">
                    Dokumen ini berlaku hingga{' '}
                    <strong>{new Date(agreement.expires_at).toLocaleString('id-ID')}</strong>. Silakan tinjau ruang lingkup pekerjaan sebelum menandatangani.
                  </p>
                </div>
              </div>
            )}

            {/* Document Content Sheet */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-xl">
              {/* Document Header */}
              <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                    Surat Perjanjian Kerja Sama
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    {agreement.project_title}
                  </h2>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-400 font-mono">
                  <div>Ref: {agreement.id.slice(0, 13)}</div>
                  <div className="mt-1">Pihak Klien: <strong className="text-slate-200">{agreement.client_company}</strong></div>
                </div>
              </div>

              {/* Scope of Work */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-sky-400" />
                  <span>1. Ruang Lingkup Pekerjaan (Scope of Work)</span>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {agreement.scope_of_work}
                </div>
              </div>

              {/* Deliverables */}
              {agreement.deliverables && agreement.deliverables.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>2. Deliverables / Hasil Akhir</span>
                  </div>
                  <ul className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-sm text-slate-300">
                    {agreement.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fee & Payment Terms */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <DollarSign className="w-4 h-4 text-sky-400" />
                  <span>3. Nilai Kontrak & Ketentuan Pembayaran</span>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Total Biaya Pengerjaan:</span>
                    <span className="text-xl font-bold text-sky-400">
                      {formatRupiah(agreement.total_fee)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <span className="font-semibold text-slate-200">Termin Pembayaran:</span>{' '}
                    {agreement.payment_terms}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>4. Syarat & Ketentuan Tambahan</span>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {agreement.terms_and_conditions}
                </div>
              </div>

              {/* Digital Signing Pad (Active only if not signed and not expired) */}
              {agreement.status !== 'signed' && agreement.status !== 'expired' && (
                <div className="pt-6 border-t border-slate-800 space-y-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <PenTool className="w-4 h-4 text-sky-400" />
                    <span>Konfirmasi & Tanda Tangan Elektronik</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Nama Lengkap Penandatangan *
                      </label>
                      <input
                        type="text"
                        required
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Jabatan / Posisi
                      </label>
                      <input
                        type="text"
                        value={signerTitle}
                        onChange={(e) => setSignerTitle(e.target.value)}
                        placeholder="Contoh: Direktur Utama / Project Lead"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Goreskan Tanda Tangan Pada Kolom di Bawah:
                      </label>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Hapus / Ulangi TTD
                      </button>
                    </div>

                    <div className="border-2 border-dashed border-slate-700 rounded-xl bg-white p-2">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={180}
                        className="w-full h-40 bg-white rounded-lg cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Gunakan jari pada layar sentuh atau mouse untuk menggambar tanda tangan Anda.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSign}
                    disabled={signing || !hasSignature || !signerName.trim()}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {signing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Mengunci Dokumen & Mengarsipkan...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Setujui & Sahkan Surat Perjanjian
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
