'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  Briefcase,
  Layers,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Printer,
  ChevronRight,
  Hash,
  Info,
  ArrowRight,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import OfficialContractPDF from '@/components/OfficialContractPDF';

interface AgreementData {
  id: string;
  project_title: string;
  client_company: string;
  client_contact_name: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  client_notes?: string;
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
  signature_data?: string;
  provider_signature_data?: string;
  provider_signer_name?: string;
  provider_signer_title?: string;
  provider_signed_at?: string;
}

function AgreementPortalContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || searchParams.get('token') || '';
  const initialCode = searchParams.get('code') || '';

  const [refId, setRefId] = useState(initialRef);
  const [accessCode, setAccessCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [agreement, setAgreement] = useState<AgreementData | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Signer inputs
  const [signerName, setSignerName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const [agreedLegal, setAgreedLegal] = useState(false);

  // Signature canvas & section refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signatureSectionRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSignatureVisible, setIsSignatureVisible] = useState(false);

  // Smooth scroll to signature / bottom
  const scrollToSignature = () => {
    if (signatureSectionRef.current) {
      signatureSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Smooth scroll back to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Detect whether user has reached the signature section at the bottom
  useEffect(() => {
    if (!agreement) return;

    const handleScroll = () => {
      if (!signatureSectionRef.current) return;
      const rect = signatureSectionRef.current.getBoundingClientRect();
      // If signature section has entered viewport
      const inView = rect.top <= window.innerHeight * 0.8;
      setIsSignatureVisible(inView);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [agreement]);

  // Readiness validation: All 4 conditions required
  const isReadyToSign = Boolean(
    agreedLegal &&
    hasSignature &&
    signerName.trim().length > 0 &&
    signerTitle.trim().length > 0
  );

  // Currency formatter
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const verifyDocument = async (token: string, code: string) => {
    if (!token.trim()) {
      setErrorMsg('Masukkan Token atau ID Dokumen Agreement.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/agreement/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), code: code.trim() }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Gagal memverifikasi dokumen.');
      }

      setAgreement(result.agreement);
      if (result.agreement?.client_contact_name) {
        setSignerName(result.agreement.client_contact_name);
      }
      setSignerTitle(result.agreement?.signer_title || 'Pemilik Usaha');
    } catch (err: any) {
      setErrorMsg(err.message || 'Dokumen tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef && initialCode) {
      verifyDocument(initialRef, initialCode);
    }
  }, [initialRef, initialCode]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    verifyDocument(refId, accessCode);
  };

  // Canvas drawing handlers for desktop mouse
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#10b981'; // emerald
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setHasSignature(false);
  };

  // High-DPI canvas setup & bulletproof mobile touch lock (NO page scrolling while drawing)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }

    let isTouchActive = false;

    // Passive: false with e.preventDefault() guarantees ZERO page scrolling or dragging on phones
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 0) return;
      isTouchActive = true;
      setIsDrawing(true);
      const r = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - r.left;
      const y = touch.clientY - r.top;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Lockdown against screen dragging / pull to refresh
      if (!isTouchActive || e.touches.length === 0) return;
      const r = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - r.left;
      const y = touch.clientY - r.top;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#10b981';
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSignature(true);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      isTouchActive = false;
      setIsDrawing(false);
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [agreement]);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreement) return;

    if (!signerName.trim() || !signerTitle.trim()) {
      alert('Mohon isi nama lengkap penandatangan dan jabatan.');
      return;
    }

    if (!hasSignature || !canvasRef.current) {
      alert('Mohon bubuhkan tanda tangan Anda pada kotak yang disediakan.');
      return;
    }

    if (!agreedLegal) {
      alert('Anda wajib menyetujui pernyataan keabsahan sebelum menandatangani dokumen.');
      return;
    }

    const signatureData = canvasRef.current.toDataURL('image/png');

    setSigning(true);
    try {
      const res = await fetch('/api/agreement/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: refId.trim(),
          code: accessCode.trim(),
          signer_name: signerName.trim(),
          signer_title: signerTitle.trim(),
          signature_data: signatureData,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Gagal menandatangani perjanjian.');
      }

      setAgreement({
        ...agreement,
        status: 'signed',
        signed_at: result.signed_at,
        signer_name: signerName.trim(),
        signer_title: signerTitle.trim(),
        document_checksum: result.checksum,
        signature_data: signatureData,
      });
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Banner Navigation */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Registrasi</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {agreement && (
              <button
                type="button"
                onClick={isSignatureVisible ? scrollToTop : scrollToSignature}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer"
                title={isSignatureVisible ? 'Kembali ke atas' : 'Langsung menuju formulir tanda tangan di bawah'}
              >
                {isSignatureVisible ? (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="hidden sm:inline">Kembali ke Atas</span>
                    <span className="sm:hidden">Atas ↑</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 animate-bounce text-emerald-400" />
                    <span className="hidden sm:inline">
                      {agreement.status === 'signed' ? 'Lihat Bukti TTD' : 'Gulir ke Tanda Tangan'}
                    </span>
                    <span className="sm:hidden">TTD ↓</span>
                  </>
                )}
              </button>
            )}

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stack.byAlif Secure Agreement</span>
              <span className="sm:hidden">Secure</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!agreement ? (
          /* Step 1: Verification Access Form */
          <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Verifikasi Dokumen Kontrak
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Akses dokumen perjanjian kerja sama resmi (PKS) Stack.byAlif menggunakan ID dokumen dan kode verifikasi rahasia Anda.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  ID Referensi Dokumen / Token
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 64b8a2... atau UUID Dokumen"
                    value={refId}
                    onChange={(e) => setRefId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Kode Akses Rahasia (6 Karakter)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Contoh: 8E3B9A"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest text-emerald-400 uppercase placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Diberikan oleh tim Stack.byAlif bersamaan dengan tautan kontrak.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Dokumen...</span>
                  </>
                ) : (
                  <>
                    <span>Buka & Verifikasi Kontrak</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Explanation box on where to get the code */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-850 text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dari mana mendapatkan Kode Akses?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                Kode Akses Rahasia (6 karakter) diterbitkan oleh <strong>Admin Stack.byAlif</strong> setelah Anda mengisi formulir registrasi proyek dan draft kontrak telah disetujui.
              </p>
              <div className="pt-1">
                <Link
                  href="/"
                  className="text-emerald-400 hover:text-emerald-300 text-[11px] font-medium inline-flex items-center gap-1"
                >
                  <span>Belum mengisi registrasi proyek? Klik di sini</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Full Interactive Agreement Document */
          <div className="space-y-6 print:hidden">
            {(() => {
              // Parse title and project name
              const parseProjectTitle = (rawTitle: string) => {
                if (rawTitle.includes(' — ')) {
                  const [judul, ...proyekParts] = rawTitle.split(' — ');
                  return {
                    judulPerjanjian: judul.trim(),
                    namaProyek: proyekParts.join(' — ').trim(),
                  };
                }
                return {
                  judulPerjanjian: 'Website Development Agreement',
                  namaProyek: rawTitle.trim(),
                };
              };

              const parseClientNotes = (notes?: string) => {
                let statusKepemilikan = 'Pemilik bisnis';
                let domainName = '-';

                if (notes) {
                  const statusMatch = notes.match(/Status Kepemilikan:\s*([^.]+)/i);
                  if (statusMatch && statusMatch[1]) {
                    statusKepemilikan = statusMatch[1].trim();
                  }
                  const domainMatch = notes.match(/Opsi Domain:\s*([^.]+)/i);
                  if (domainMatch && domainMatch[1]) {
                    domainName = domainMatch[1].trim();
                  }
                }
                return { statusKepemilikan, domainName };
              };

              const { judulPerjanjian, namaProyek } = parseProjectTitle(agreement.project_title);
              const { statusKepemilikan, domainName: namaDomain } = parseClientNotes(agreement.client_notes);

              return (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl agreement-document">
                  {/* Document Header */}
                  <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                        STACK.BYALIF
                      </h1>
                      <h2 className="text-sm sm:text-base font-bold text-zinc-300 uppercase tracking-wide mt-1">
                        KETENTUAN PENGERJAAN WEBSITE & SISTEM DIGITAL
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {agreement.status === 'signed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-4 h-4" />
                          Telah Ditandatangani
                        </span>
                      ) : agreement.status === 'expired' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-950/80 text-red-400 border border-red-500/30">
                          <Clock className="w-4 h-4" />
                          Masa Berlaku Habis
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30">
                          <PenTool className="w-4 h-4" />
                          Menunggu Tanda Tangan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Statement of Parties */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <strong className="text-white">Para pihak.</strong> Pihak pertama adalah Muhammad Alif Muzakky, individu yang menjalankan kegiatan penyediaan jasa pengembangan website dan sistem digital dengan nama Stack.byAlif, berdomisili di Bandung, selanjutnya disebut &ldquo;Stack.byAlif&rdquo;. Pihak kedua adalah klien dengan data berikut, selanjutnya disebut &ldquo;klien&rdquo;.
                  </p>

                  {/* Data Table */}
                  <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-[11px] font-semibold">
                        <tr>
                          <th className="py-3 px-4 sm:px-6 w-1/3">Data</th>
                          <th className="py-3 px-4 sm:px-6">Isian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Judul perjanjian</td>
                          <td className="py-2.5 px-4 sm:px-6 font-semibold text-white">{judulPerjanjian}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Nama proyek</td>
                          <td className="py-2.5 px-4 sm:px-6 font-semibold text-white">{namaProyek}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Nilai kontrak</td>
                          <td className="py-2.5 px-4 sm:px-6 font-mono font-bold text-emerald-400">{formatRupiah(agreement.total_fee)}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Nama lengkap</td>
                          <td className="py-2.5 px-4 sm:px-6">{agreement.client_contact_name}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Email</td>
                          <td className="py-2.5 px-4 sm:px-6">{agreement.client_email || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Nomor WhatsApp</td>
                          <td className="py-2.5 px-4 sm:px-6">{agreement.client_phone || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Alamat domisili</td>
                          <td className="py-2.5 px-4 sm:px-6">{agreement.client_address || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Nama bisnis / brand</td>
                          <td className="py-2.5 px-4 sm:px-6 font-semibold text-white">{agreement.client_company}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Status kepemilikan bisnis</td>
                          <td className="py-2.5 px-4 sm:px-6">{statusKepemilikan}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 sm:px-6 text-zinc-400 font-medium">Nama domain</td>
                          <td className="py-2.5 px-4 sm:px-6 font-mono text-zinc-300">{namaDomain}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 1. RUANG LINGKUP PEKERJAAN */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      1. RUANG LINGKUP PEKERJAAN
                    </h3>
                    <ol className="list-decimal list-outside ml-4 sm:ml-5 space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      <li>Stack.byAlif menyediakan jasa pembuatan website dan sistem digital berdasarkan paket layanan atau kesepakatan proyek yang telah disetujui oleh klien.</li>
                      <li>Ruang lingkup pekerjaan meliputi perancangan, pengembangan, implementasi, konfigurasi, pengujian, dan deployment website sesuai spesifikasi proyek.</li>
                      <li>Fitur, halaman, teknologi, integrasi, dan batasan pekerjaan mengikuti paket layanan atau quotation yang telah disepakati.</li>
                      <li>Pekerjaan yang tidak tercantum dalam ruang lingkup awal dianggap sebagai pekerjaan tambahan dan dapat dikenakan biaya terpisah.</li>
                      <li>Stack.byAlif berhak menentukan metode dan teknologi pengembangan yang sesuai dengan kebutuhan teknis proyek, selama tidak bertentangan dengan kesepakatan.</li>
                      <li>Klien bertanggung jawab menyediakan informasi, materi, konten, dan akses yang diperlukan untuk pengerjaan proyek.</li>
                      <li><strong className="text-white">Tanggung jawab Stack.byAlif terbatas pada pembuatan website.</strong> Stack.byAlif tidak mengelola, mengawasi, atau bertanggung jawab atas operasional bisnis klien, termasuk produk, penjualan, transaksi, dan isi konten yang dipublikasikan.</li>
                    </ol>

                    {agreement.scope_of_work && (
                      <div className="mt-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs sm:text-sm text-zinc-300">
                        <strong className="text-zinc-200 block mb-1">Rincian Spesifikasi Teknis Proyek:</strong>
                        <div className="whitespace-pre-wrap">{agreement.scope_of_work}</div>
                      </div>
                    )}
                  </div>

                  {/* 2. DELIVERABLES (HASIL PEKERJAAN) */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      2. DELIVERABLES (HASIL PEKERJAAN)
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Setelah proyek selesai dan seluruh kewajiban pembayaran dipenuhi, klien akan menerima hasil pekerjaan sesuai paket yang dipilih, yang dapat mencakup:
                    </p>
                    <ol className="list-decimal list-outside ml-4 sm:ml-5 space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      <li>Website yang telah dikembangkan sesuai spesifikasi proyek.</li>
                      <li>Website yang telah melalui proses pengujian dasar dan deployment.</li>
                      <li>Source code proyek sesuai kesepakatan.</li>
                      <li>Konfigurasi domain dan hosting sesuai paket layanan.</li>
                      <li>Akses administrator atau dashboard apabila fitur tersebut termasuk dalam paket.</li>
                      <li>Akses database dan layanan terkait sesuai pengaturan kepemilikan yang disepakati.</li>
                      <li>Dokumentasi atau panduan penggunaan dasar apabila termasuk dalam ruang lingkup proyek.</li>
                    </ol>

                    {agreement.deliverables && agreement.deliverables.length > 0 && (
                      <div className="mt-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                        <strong className="text-xs font-semibold text-zinc-300 block mb-2">Item Deliverables Khusus Proyek Ini:</strong>
                        <div className="space-y-1.5">
                          {agreement.deliverables.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                      Penyerahan source code, akses akun, dokumentasi, dan aset proyek dilakukan setelah pelunasan penuh, sesuai ketentuan paket dan kesepakatan kedua belah pihak. Sejak serah terima, kendali dan penggunaan website berada pada klien.
                    </p>
                  </div>

                  {/* 3. KETENTUAN PEMBAYARAN */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      3. KETENTUAN PEMBAYARAN
                    </h3>
                    <ol className="list-decimal list-outside ml-4 sm:ml-5 space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      <li>Klien diwajibkan membayar uang muka (DP) sebesar 50% dari total biaya proyek sebelum pengerjaan dimulai.</li>
                      <li>Sisa pembayaran sebesar 50% wajib dilunasi setelah pengerjaan selesai dan sebelum serah terima final atau publikasi final website.</li>
                      <li>Pengerjaan proyek dimulai setelah pembayaran DP diterima dan seluruh kebutuhan awal proyek telah tersedia.</li>
                      <li>Pembayaran dilakukan melalui metode yang telah disepakati oleh Stack.byAlif dan klien.</li>
                      <li>Biaya layanan pihak ketiga, seperti domain, hosting premium, API supplier, payment gateway, dan layanan berbayar lainnya, ditanggung oleh klien kecuali dinyatakan termasuk dalam paket.</li>
                      <li>Pekerjaan tambahan atau perubahan di luar ruang lingkup awal akan diberikan estimasi biaya dan waktu pengerjaan terlebih dahulu.</li>
                      <li>Keterlambatan pembayaran dapat menyebabkan penundaan pengerjaan, serah terima, atau layanan terkait hingga kewajiban pembayaran diselesaikan.</li>
                    </ol>

                    {agreement.payment_terms && (
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                        <strong className="block mb-0.5 text-emerald-400">Ringkasan Ketentuan Pembayaran:</strong>
                        {agreement.payment_terms}
                      </div>
                    )}
                  </div>

                  {/* 4. KETENTUAN TAMBAHAN */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      4. KETENTUAN TAMBAHAN
                    </h3>

                    <div className="space-y-4 pl-2 sm:pl-3 border-l-2 border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      <div>
                        <h4 className="font-bold text-white mb-1">A. Revisi</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-1">
                          <li>Klien memperoleh maksimal 2 kali revisi minor sesuai paket layanan.</li>
                          <li>Revisi minor mencakup penyesuaian teks, warna, gambar, spacing, atau elemen visual sederhana.</li>
                          <li>Revisi major, perubahan struktur halaman, perubahan alur sistem, dan penambahan fitur tidak termasuk revisi minor.</li>
                          <li>Revisi tambahan atau pekerjaan di luar batas yang ditentukan dapat dikenakan biaya terpisah setelah disetujui oleh klien.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">B. Konten dan Materi</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-1">
                          <li>Klien bertanggung jawab menyediakan konten, logo, gambar, teks, data produk, dan materi lain yang diperlukan.</li>
                          <li>Klien menjamin bahwa materi yang diberikan memiliki hak penggunaan yang sah dan tidak melanggar hak pihak lain.</li>
                          <li>Keterlambatan penyediaan materi oleh klien dapat memengaruhi estimasi waktu penyelesaian proyek.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">C. Domain, Hosting, dan Layanan Pihak Ketiga</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-1">
                          <li>Domain, hosting, database, API, payment gateway, dan layanan pihak ketiga mengikuti ketentuan serta kebijakan masing-masing penyedia.</li>
                          <li>Biaya perpanjangan domain, hosting, dan layanan berbayar setelah masa yang termasuk dalam paket berakhir menjadi tanggung jawab klien.</li>
                          <li>Stack.byAlif tidak menjamin layanan pihak ketiga selalu tersedia tanpa gangguan, dan perubahan atau penghentian layanan tersebut dapat memengaruhi operasional website.</li>
                          <li>Domain didaftarkan dengan data identitas klien sebagai pemilik (registrant). Apabila domain akan dimiliki pihak lain, atau klien sudah memiliki domain, klien wajib menyebutkan nama pemilik domain atau registrar yang digunakan dan menjamin bahwa ia berhak atas domain tersebut.</li>
                          <li>Akun layanan yang berkaitan dengan uang klien, seperti payment gateway, API supplier, dan rekening penerimaan, terdaftar atas nama klien. Stack.byAlif tidak menampung atau mengelola dana klien.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">D. Garansi dan Maintenance</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-1">
                          <li>Stack.byAlif memberikan garansi perbaikan bug selama 14 hari kalender setelah serah terima proyek.</li>
                          <li>Garansi mencakup bug yang berasal dari pengerjaan Stack.byAlif dan tidak mencakup perubahan fitur atau kebutuhan baru.</li>
                          <li>Gangguan akibat layanan pihak ketiga, perubahan yang dilakukan klien, atau penggunaan di luar spesifikasi tidak termasuk dalam garansi.</li>
                          <li>Maintenance setelah masa garansi berakhir tersedia sebagai layanan tambahan dengan biaya sesuai paket maintenance yang berlaku.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">E. Penggunaan Website</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-1">
                          <li>Klien bertanggung jawab penuh atas penggunaan website, produk, layanan, transaksi, dan konten yang dipublikasikan, termasuk legalitas usahanya.</li>
                          <li>Website tidak boleh digunakan untuk penipuan, toko atau produk fiktif, phishing, penyebaran malware, judi online, pinjaman atau investasi ilegal, aktivitas ilegal lainnya, atau pelanggaran hak pihak lain.</li>
                          <li>Stack.byAlif berhak menolak, menunda, atau menghentikan pengerjaan apabila terdapat indikasi penyalahgunaan atau pelanggaran hukum maupun kebijakan penyedia layanan.</li>
                          <li>Klien wajib segera memberi tahu Stack.byAlif apabila mengetahui website disalahgunakan.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">F. Pembatalan Proyek</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-1">
                          <li>Pembatalan proyek oleh klien setelah pengerjaan dimulai akan dievaluasi berdasarkan pekerjaan yang telah dilakukan dan biaya yang telah dikeluarkan.</li>
                          <li>Pengembalian dana, apabila berlaku, ditentukan berdasarkan kesepakatan kedua belah pihak dan kewajiban yang telah timbul.</li>
                          <li>Biaya layanan pihak ketiga yang telah dibayarkan dan tidak dapat dikembalikan tidak termasuk dalam pengembalian dana.</li>
                          <li>Pembatalan atau penghentian proyek harus disampaikan secara tertulis.</li>
                          <li>Apabila klien tidak memberikan tanggapan, materi, atau pembayaran yang diperlukan selama 30 hari kalender setelah menerima pemberitahuan, pengerjaan dapat ditunda. Apabila tidak terdapat kelanjutan setelah pemberitahuan berikutnya, Stack.byAlif dapat menghentikan proyek dengan penyelesaian pembayaran berdasarkan pekerjaan yang telah dilakukan dan biaya yang telah dikeluarkan.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">G. Data Klien dan Pernyataan</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-1">
                          <li>Klien menyatakan bahwa data yang diberikan pada formulir registrasi adalah benar dan milik klien sendiri, bahwa klien adalah pemilik atau pihak yang berwenang atas proyek ini, dan bahwa klien tidak akan menggunakan website untuk aktivitas yang melanggar hukum.</li>
                          <li>Data klien digunakan untuk administrasi proyek, pendaftaran domain, dan sebagai bukti identitas pihak yang memesan.</li>
                          <li>Apabila terdapat permintaan resmi dari pihak atau instansi berwenang sesuai ketentuan yang berlaku, Stack.byAlif dapat memberikan data klien, riwayat komunikasi, dan catatan pembayaran yang berkaitan dengan proyek sesuai kebutuhan permintaan tersebut.</li>
                          <li>Stack.byAlif tidak menjual data klien kepada pihak ketiga.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">H. Penangguhan Website</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-1">
                          <li>Apabila terdapat indikasi penyalahgunaan website, permintaan dari pihak atau instansi berwenang, atau data klien terbukti tidak benar, Stack.byAlif berhak menangguhkan atau menonaktifkan website, termasuk melalui mekanisme penonaktifan jarak jauh, apabila diperlukan.</li>
                          <li>Stack.byAlif akan menyampaikan pemberitahuan kepada klien sebelum atau sesudah tindakan tersebut apabila kondisi memungkinkan.</li>
                          <li>Untuk keterlambatan pembayaran, penangguhan website atau layanan terkait dilakukan setelah pemberitahuan tertulis, termasuk melalui WhatsApp, dengan tenggang waktu minimal 3 hari kalender.</li>
                          <li>Mekanisme penonaktifan jarak jauh hanya digunakan untuk kondisi dan tujuan sebagaimana diatur dalam perjanjian ini.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">I. Tanggung Jawab Para Pihak</h4>
                        <ol className="list-decimal list-outside ml-4 space-y-1">
                          <li>Klien bertanggung jawab atas produk, layanan, transaksi, konten, dan aktivitas bisnis yang dijalankan melalui website.</li>
                          <li>Stack.byAlif bertanggung jawab atas pekerjaan pengembangan sesuai ruang lingkup dan kesepakatan proyek.</li>
                          <li>Masing-masing pihak bertanggung jawab atas tindakan dan kewajiban yang menjadi tanggung jawabnya.</li>
                          <li>Stack.byAlif tidak bertanggung jawab atas kendala yang berasal dari layanan pihak ketiga, perubahan yang dilakukan klien, atau penggunaan website di luar spesifikasi yang telah disepakati.</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">J. Persetujuan Hasil Pekerjaan</h4>
                        <p>Stack.byAlif memberikan kesempatan kepada klien untuk memeriksa hasil pekerjaan sebelum serah terima final. Klien dapat menyampaikan ketidaksesuaian terhadap spesifikasi yang telah disepakati untuk diperbaiki sesuai ketentuan revisi dan garansi. Permintaan perubahan di luar spesifikasi awal diperlakukan sebagai pekerjaan tambahan.</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-white mb-1">K. Persetujuan Elektronik</h4>
                        <p className="mb-2">Dengan melakukan persetujuan melalui portal Stack.byAlif, klien menyatakan telah membaca, memahami, dan menyetujui seluruh isi perjanjian beserta rincian proyek yang tercantum di dalamnya.</p>
                        <p className="mb-2">Persetujuan dilakukan secara sadar melalui tindakan konfirmasi elektronik oleh klien. Sistem Stack.byAlif menyimpan catatan persetujuan yang mencakup identitas klien, tanggal dan waktu persetujuan, versi dokumen, serta informasi pendukung lainnya.</p>
                        <p>Dokumen yang telah disetujui menjadi catatan kesepakatan antara Stack.byAlif dan klien. Salinan dokumen diberikan kepada masing-masing pihak.</p>
                      </div>
                    </div>

                    {agreement.terms_and_conditions && (
                      <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs sm:text-sm text-zinc-300">
                        <strong className="text-zinc-200 block mb-1">Ketentuan Khusus Tambahan:</strong>
                        <div className="whitespace-pre-wrap">{agreement.terms_and_conditions}</div>
                      </div>
                    )}
                  </div>

                  {/* Kolom Tanda Tangan Resmi Para Pihak (Signature Block) */}
                  <div className="pt-6 border-t border-zinc-800 signature-container">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:grid-cols-2">
                      {/* Pihak Pertama - Stack.byAlif */}
                      <div className="flex flex-col justify-between p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 signature-card text-center sm:text-left space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-zinc-400 print:text-black uppercase tracking-wider block">
                            PIHAK PERTAMA (Penyedia Jasa)
                          </span>
                          <h4 className="text-sm font-bold text-white print:text-black mt-0.5">
                            STACK.BYALIF
                          </h4>
                          <span className="text-[11px] text-zinc-500 print:text-zinc-700 block">
                            Website Development & Business Systems
                          </span>
                        </div>

                        {/* Developer Signature Mark */}
                        <div className="py-2 flex flex-col items-center sm:items-start justify-center min-h-[70px]">
                          {agreement.provider_signature_data ? (
                            <div className="p-2 bg-white rounded-xl border border-zinc-700 shadow-sm">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={agreement.provider_signature_data}
                                alt="Tanda Tangan Pihak Pertama"
                                className="max-h-16 max-w-[200px] object-contain filter contrast-125"
                              />
                            </div>
                          ) : (
                            <span className="font-serif italic text-base tracking-widest text-emerald-400 border-b border-emerald-500/40 pb-0.5 px-3">
                              Alif Muzakky
                            </span>
                          )}
                        </div>

                        <div className="border-t border-zinc-800 print:border-black pt-3">
                          <span className="font-bold text-sm text-white print:text-black block">
                            {agreement.provider_signer_name || 'M. ALIF MUZAKKY'}
                          </span>
                          <span className="text-xs text-zinc-400 print:text-black block">
                            Pemilik Usaha
                          </span>
                          <span className="text-[11px] text-zinc-500 print:text-zinc-700 block mt-0.5">
                            Tanggal: {agreement.provider_signed_at ? new Date(agreement.provider_signed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : (agreement.signed_at ? new Date(agreement.signed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }))}
                          </span>
                        </div>
                      </div>

                      {/* Pihak Kedua - Klien */}
                      <div className="flex flex-col justify-between p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 signature-card text-center sm:text-left space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-zinc-400 print:text-black uppercase tracking-wider block">
                            PIHAK KEDUA (Pemesan / Klien)
                          </span>
                          <h4 className="text-sm font-bold text-white print:text-black mt-0.5">
                            {agreement.client_company || agreement.signer_name || agreement.client_contact_name || 'Klien'}
                          </h4>
                          <span className="text-[11px] text-zinc-500 print:text-zinc-700 block">
                            {agreement.client_address || 'Domisili Klien'}
                          </span>
                        </div>

                        {/* Client Actual Signature */}
                        <div className="py-2 flex flex-col items-center sm:items-start justify-center min-h-[70px]">
                          {agreement.signature_data ? (
                            <img
                              src={agreement.signature_data}
                              alt="Tanda Tangan Digital Klien"
                              className="max-h-16 w-auto object-contain client-signature-img filter invert contrast-200 print:filter-none"
                            />
                          ) : (
                            <div className="w-full border border-dashed border-zinc-700 rounded-xl p-3 text-center text-xs text-zinc-500">
                              [Menunggu Pembubuhan Tanda Tangan Digital]
                            </div>
                          )}
                        </div>

                        <div className="border-t border-zinc-800 print:border-black pt-3">
                          <span className="font-bold text-sm text-white print:text-black block uppercase">
                            {agreement.signer_name || agreement.client_contact_name || '-'}
                          </span>
                          <span className="text-xs text-zinc-400 print:text-black block">
                            Pemilik Usaha
                          </span>
                          <span className="text-[11px] text-zinc-500 print:text-zinc-700 block mt-0.5">
                            {agreement.signed_at
                              ? `Ditandatangani secara elektronik: ${new Date(agreement.signed_at).toLocaleString('id-ID')}`
                              : 'Status: Belum Ditandatangani'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Official Electronic Document Integrity Reference */}
                    <div className="mt-6 pt-4 border-t border-zinc-800/80 print:border-black/40 text-[10px] text-zinc-500 print:text-black flex flex-col sm:flex-row items-center justify-between gap-2">
                      <span>
                        Dokumen Elektronik Resmi • Sah & Mengikat berdasarkan UU ITE No. 11/2008 jo. UU No. 1/2024
                      </span>
                      <span className="font-mono text-[9px] text-zinc-400 print:text-black">
                        No. Registrasi: PKS-{agreement.id.slice(0, 8).toUpperCase()} • Stack.byAlif
                      </span>
                    </div>
                  </div>

                  {/* Template Footer Brand Tag */}
                  <div className="pt-6 border-t border-zinc-800 text-center space-y-1 print:hidden">
                    <span className="font-bold tracking-tight text-white block text-sm">
                      STACK.BYALIF
                    </span>
                    <span className="text-xs text-zinc-400 block">
                      Website Development • E-Commerce • Business Systems
                    </span>
                    <span className="text-[11px] text-zinc-500 italic block">
                      Build your digital presence. Grow your business.
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Signature Section */}
            <div ref={signatureSectionRef} id="signature-section" className="scroll-mt-24">
              {agreement.status === 'signed' ? (
                /* Already Signed Banner (Clean Screen Actions, No Raw SHA-256) */
                <div className="bg-zinc-950 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl no-print">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          Perjanjian Kerja Sama Resmi Telah Ditandatangani
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Telah disahkan secara digital oleh {agreement.signer_name} ({agreement.signer_title}). Dokumen terkunci dan memiliki kekuatan hukum penuh.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowPdfPreview(true)}
                        className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                        title="Buka pratinjau surat perjanjian format cetak A4"
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span>Pratinjau Surat Resmi</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Cetak / Unduh PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : agreement.status === 'expired' ? (
                <div className="bg-zinc-950 border border-red-500/30 rounded-2xl p-6 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Masa Berlaku Penandatanganan Habis</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Dokumen ini telah melewati batas waktu tanggal kedaluwarsa. Silakan hubungi Stack.byAlif untuk menerbitkan pembaruan dokumen.
                  </p>
                </div>
              ) : (
                /* Signing Form with Canvas */
                <form onSubmit={handleSign} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-emerald-400" />
                      Penandatanganan Digital Elektronik
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Bubuhkan tanda tangan digital Anda di bawah ini sebagai persetujuan kerja sama resmi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Nama Lengkap Penandatangan <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nama lengkap sesuai KTP"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Jabatan / Status Wewenang <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Direktur / Pemilik Usaha"
                        value={signerTitle}
                        onChange={(e) => setSignerTitle(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>

                  {/* Digital Signature Canvas */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                        <span>Kotak Tanda Tangan Digital</span>
                        <span className="text-red-400">*</span>
                        {hasSignature && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                            Tanda tangan terdeteksi
                          </span>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-xs text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        Hapus & Ulangi
                      </button>
                    </div>

                    <div
                      className="border border-zinc-800 bg-zinc-900/60 rounded-xl overflow-hidden relative select-none"
                      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
                    >
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full h-44 cursor-crosshair block select-none"
                        style={{ touchAction: 'none' }}
                      />
                      {!hasSignature && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-zinc-600 text-xs px-4 text-center">
                          Bubuhkan tanda tangan di sini (Mendukung sentuhan layar HP, Tablet, & Stylus)
                        </div>
                      )}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition">
                    <input
                      type="checkbox"
                      required
                      checked={agreedLegal}
                      onChange={(e) => setAgreedLegal(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-emerald-500 bg-zinc-900 border-zinc-700 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-300 leading-relaxed">
                      Saya menyatakan secara sadar bahwa saya adalah pihak yang berwenang untuk menandatangani dokumen perjanjian ini, menyetujui seluruh klausul pembebasan tanggung jawab operasional bagi Stack.byAlif, dan dokumen ini sah mengikat secara hukum sesuai UU ITE. <span className="text-red-400">*</span>
                    </span>
                  </label>

                  {/* Checklist Guide when not ready */}
                  {!isReadyToSign && (
                    <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
                      <div className="font-medium flex items-center gap-1.5 text-amber-400/90 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Tombol persetujuan akan aktif setelah melengkapi:</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[11px]">
                        <span className={signerName.trim() && signerTitle.trim() ? 'text-emerald-400 font-medium inline-flex items-center gap-1' : 'text-zinc-500 inline-flex items-center gap-1'}>
                          <span>{signerName.trim() && signerTitle.trim() ? '✓' : '○'}</span>
                          <span>Nama & Jabatan</span>
                        </span>
                        <span className={hasSignature ? 'text-emerald-400 font-medium inline-flex items-center gap-1' : 'text-zinc-500 inline-flex items-center gap-1'}>
                          <span>{hasSignature ? '✓' : '○'}</span>
                          <span>Tanda Tangan Digital</span>
                        </span>
                        <span className={agreedLegal ? 'text-emerald-400 font-medium inline-flex items-center gap-1' : 'text-zinc-500 inline-flex items-center gap-1'}>
                          <span>{agreedLegal ? '✓' : '○'}</span>
                          <span>Centang Pernyataan UU ITE</span>
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isReadyToSign || signing}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      isReadyToSign && !signing
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-[0.99]'
                        : 'bg-zinc-900/80 border border-zinc-800 text-zinc-500 cursor-not-allowed opacity-50 shadow-none hover:bg-zinc-900/80'
                    }`}
                  >
                    {signing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Mengunci & Menandatangani Dokumen...</span>
                      </>
                    ) : isReadyToSign ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-white" />
                        <span>Setujui & Tanda Tangani Kontrak Resmi</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-zinc-500" />
                        <span>Setujui Kontrak (Lengkapi Tanda Tangan & Ceklis Dahulu)</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* DEDICATED OFFICIAL PRINT TEMPLATE: Only rendered for printing / PDF export */}
        {agreement && (
          <div className="hidden print:block w-full">
            <OfficialContractPDF agreement={agreement} />
          </div>
        )}
      </main>

      {/* MODAL PRATINJAU DOKUMEN CETAK A4 (SCREEN PREVIEW) */}
      {showPdfPreview && agreement && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 overflow-y-auto no-print">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs sm:text-sm text-white">
                  Pratinjau Dokumen Kontrak Resmi (Format Cetak A4 Standar Hukum)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Unduh PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfPreview(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body with Paper Simulation */}
            <div className="p-4 sm:p-8 bg-zinc-800/60 overflow-y-auto flex-1 flex justify-center">
              <div className="shadow-2xl rounded-sm overflow-hidden border border-zinc-300 w-full max-w-[210mm] bg-white">
                <OfficialContractPDF agreement={agreement} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Scroll to Signature Button: Only shown when NOT at the signature area */}
      {agreement && !isSignatureVisible && (
        <button
          type="button"
          onClick={scrollToSignature}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xl shadow-emerald-950/80 border border-emerald-400/40 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur animate-in fade-in duration-300"
          title="Gulir langsung ke bagian tanda tangan"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
          <span>{agreement.status === 'signed' ? 'Lihat Bukti Tanda Tangan ↓' : 'Gulir ke Tanda Tangan ↓'}</span>
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500 print:hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>STACK.BYALIF — Website Development • E-Commerce • Business Systems</span>
          <span className="text-[11px] text-zinc-600">Dokumen Digital Terenkripsi Berstandar UU ITE</span>
        </div>
      </footer>
    </div>
  );
}

export default function AgreementPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
          <span>Memuat Portal Agreement...</span>
        </div>
      }
    >
      <AgreementPortalContent />
    </Suspense>
  );
}
