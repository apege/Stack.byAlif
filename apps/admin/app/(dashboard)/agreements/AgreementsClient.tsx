'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  X,
  Loader2,
  Key,
  Hash,
  PenTool,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Agreement {
  id: string;
  client_id: string;
  project_title: string;
  scope_of_work: string;
  deliverables: string[];
  total_fee: number;
  payment_terms: string;
  terms_and_conditions: string;
  access_token: string;
  access_code: string;
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  expires_at: string;
  signed_at?: string;
  signer_name?: string;
  signer_title?: string;
  signer_ip?: string;
  signature_data?: string;
  document_checksum?: string;
  provider_signature_data?: string;
  provider_signer_name?: string;
  provider_signer_title?: string;
  provider_signed_at?: string;
  version: number;
  created_at: string;
  client?: {
    id: string;
    name: string;
    company: string;
    email: string;
    phone?: string;
  };
}

interface ClientOption {
  id: string;
  name: string;
  company: string;
  email: string;
}

// Template Standar Resmi Stack.byAlif
const DEFAULT_SCOPE_OF_WORK = `1. Stack.byAlif menyediakan jasa pembuatan website dan sistem digital berdasarkan paket layanan atau kesepakatan proyek yang telah disetujui oleh klien.
2. Ruang lingkup pekerjaan meliputi perancangan, pengembangan, implementasi, konfigurasi, pengujian, dan deployment website sesuai spesifikasi proyek.
3. Fitur, halaman, teknologi, integrasi, dan batasan pekerjaan mengikuti paket layanan atau quotation yang telah disepakati.
4. Pekerjaan yang tidak tercantum dalam ruang lingkup awal dianggap sebagai pekerjaan tambahan dan dapat dikenakan biaya terpisah.
5. Stack.byAlif berhak menentukan metode dan teknologi pengembangan yang sesuai dengan kebutuhan teknis proyek, selama tidak bertentangan dengan kesepakatan.
6. Klien bertanggung jawab menyediakan informasi, materi, konten, dan akses yang diperlukan untuk pengerjaan proyek.
7. Tanggung jawab Stack.byAlif terbatas pada pembuatan website. Stack.byAlif tidak mengelola, mengawasi, atau bertanggung jawab atas operasional bisnis klien, termasuk produk, penjualan, transaksi, dan isi konten yang dipublikasikan.`;

const DEFAULT_DELIVERABLES = `Website yang telah dikembangkan sesuai spesifikasi proyek.
Website yang telah melalui proses pengujian dasar dan deployment.
Source code proyek sesuai kesepakatan.
Konfigurasi domain dan hosting sesuai paket layanan.
Akses administrator atau dashboard apabila fitur tersebut termasuk dalam paket.
Akses database dan layanan terkait sesuai pengaturan kepemilikan yang disepakati.
Dokumentasi atau panduan penggunaan dasar apabila termasuk dalam ruang lingkup proyek.`;

const DEFAULT_PAYMENT_TERMS = `1. Klien diwajibkan membayar uang muka (DP) sebesar 50% dari total biaya proyek sebelum pengerjaan dimulai.
2. Sisa pembayaran sebesar 50% wajib dilunasi setelah pengerjaan selesai dan sebelum serah terima final atau publikasi final website.
3. Pengerjaan proyek dimulai setelah pembayaran DP diterima dan seluruh kebutuhan awal proyek telah tersedia.
4. Pembayaran dilakukan melalui metode yang telah disepakati oleh Stack.byAlif dan klien.
5. Biaya layanan pihak ketiga (domain, hosting premium, API, payment gateway) ditanggung oleh klien kecuali dinyatakan termasuk dalam paket.
6. Pekerjaan tambahan atau perubahan di luar ruang lingkup awal akan diberikan estimasi biaya dan waktu pengerjaan terlebih dahulu.
7. Keterlambatan pembayaran dapat menyebabkan penundaan pengerjaan, serah terima, atau layanan terkait hingga kewajiban pembayaran diselesaikan.`;

const DEFAULT_TERMS_AND_CONDITIONS = `A. Revisi
1. Klien memperoleh maksimal 2 kali revisi minor sesuai paket layanan.
2. Revisi minor mencakup penyesuaian teks, warna, gambar, spacing, atau elemen visual sederhana.
3. Revisi major, perubahan struktur halaman, perubahan alur sistem, dan penambahan fitur tidak termasuk revisi minor.
4. Revisi tambahan atau pekerjaan di luar batas yang ditentukan dapat dikenakan biaya terpisah setelah disetujui oleh klien.

B. Konten dan Materi
1. Klien bertanggung jawab menyediakan konten, logo, gambar, teks, data produk, dan materi lain yang diperlukan.
2. Klien menjamin bahwa materi yang diberikan memiliki hak penggunaan yang sah dan tidak melanggar hak pihak lain.
3. Keterlambatan penyediaan materi oleh klien dapat memengaruhi estimasi waktu penyelesaian proyek.

C. Domain, Hosting, dan Layanan Pihak Ketiga
1. Domain, hosting, database, API, payment gateway, dan layanan pihak ketiga mengikuti ketentuan serta kebijakan masing-masing penyedia.
2. Biaya perpanjangan domain, hosting, dan layanan berbayar setelah masa yang termasuk dalam paket berakhir menjadi tanggung jawab klien.
3. Stack.byAlif tidak menjamin layanan pihak ketiga selalu tersedia tanpa gangguan, dan perubahan atau penghentian layanan tersebut dapat memengaruhi operasional website.
4. Domain didaftarkan dengan data identitas klien sebagai pemilik (registrant). Apabila domain akan dimiliki pihak lain, atau klien sudah memiliki domain, klien wajib menyebutkan nama pemilik domain atau registrar yang digunakan dan menjamin bahwa ia berhak atas domain tersebut.
5. Akun layanan yang berkaitan dengan uang klien, seperti payment gateway, API supplier, dan rekening penerimaan, terdaftar atas nama klien. Stack.byAlif tidak menampung atau mengelola dana klien.

D. Garansi dan Maintenance
1. Stack.byAlif memberikan garansi perbaikan bug selama 14 hari kalender setelah serah terima proyek.
2. Garansi mencakup bug yang berasal dari pengerjaan Stack.byAlif dan tidak mencakup perubahan fitur atau kebutuhan baru.
3. Gangguan akibat layanan pihak ketiga, perubahan yang dilakukan klien, atau penggunaan di luar spesifikasi tidak termasuk dalam garansi.
4. Maintenance setelah masa garansi berakhir tersedia sebagai layanan tambahan dengan biaya sesuai paket maintenance yang berlaku.

E. Penggunaan Website
1. Klien bertanggung jawab penuh atas penggunaan website, produk, layanan, transaksi, dan konten yang dipublikasikan, termasuk legalitas usahanya.
2. Website tidak boleh digunakan untuk penipuan, toko atau produk fiktif, phishing, penyebaran malware, judi online, pinjaman atau investasi ilegal, aktivitas ilegal lainnya, atau pelanggaran hak pihak lain.
3. Stack.byAlif berhak menolak, menunda, atau menghentikan pengerjaan apabila terdapat indikasi penyalahgunaan atau pelanggaran hukum maupun kebijakan penyedia layanan.
4. Klien wajib segera memberi tahu Stack.byAlif apabila mengetahui website disalahgunakan.

F. Pembatalan Proyek
1. Pembatalan proyek oleh klien setelah pengerjaan dimulai akan dievaluasi berdasarkan pekerjaan yang telah dilakukan dan biaya yang telah dikeluarkan.
2. Pengembalian dana, apabila berlaku, ditentukan berdasarkan kesepakatan kedua belah pihak dan kewajiban yang telah timbul.
3. Biaya layanan pihak ketiga yang telah dibayarkan dan tidak dapat dikembalikan tidak termasuk dalam pengembalian dana.
4. Pembatalan atau penghentian proyek harus disampaikan secara tertulis.
5. Apabila klien tidak memberikan tanggapan, materi, atau pembayaran yang diperlukan selama 30 hari kalender setelah menerima pemberitahuan, pengerjaan dapat ditunda.

G. Data Klien dan Pernyataan
1. Klien menyatakan bahwa data yang diberikan pada formulir registrasi adalah benar dan milik klien sendiri, bahwa klien adalah pemilik atau pihak yang berwenang atas proyek ini, dan bahwa klien tidak akan menggunakan website untuk aktivitas yang melanggar hukum.
2. Data klien digunakan untuk administrasi proyek, pendaftaran domain, dan sebagai bukti identitas pihak yang memesan.
3. Apabila terdapat permintaan resmi dari pihak atau instansi berwenang sesuai ketentuan yang berlaku, Stack.byAlif dapat memberikan data klien, riwayat komunikasi, dan catatan pembayaran yang berkaitan dengan proyek sesuai kebutuhan permintaan tersebut.
4. Stack.byAlif tidak menjual data klien kepada pihak ketiga.

H. Penangguhan Website (Kill Switch)
1. Apabila terdapat indikasi penyalahgunaan website, permintaan dari pihak atau instansi berwenang, atau data klien terbukti tidak benar, Stack.byAlif berhak menangguhkan atau menonaktifkan website, termasuk melalui mekanisme penonaktifan jarak jauh, apabila diperlukan.
2. Stack.byAlif akan menyampaikan pemberitahuan kepada klien sebelum atau sesudah tindakan tersebut apabila kondisi memungkinkan.
3. Untuk keterlambatan pembayaran, penangguhan website atau layanan terkait dilakukan setelah pemberitahuan tertulis, termasuk melalui WhatsApp, dengan tenggang waktu minimal 3 hari kalender.

I. Tanggung Jawab Para Pihak
1. Klien bertanggung jawab atas produk, layanan, transaksi, konten, dan aktivitas bisnis yang dijalankan melalui website.
2. Stack.byAlif bertanggung jawab atas pekerjaan pengembangan sesuai ruang lingkup dan kesepakatan proyek.
3. Masing-masing pihak bertanggung jawab atas tindakan dan kewajiban yang menjadi tanggung jawabnya.
4. Stack.byAlif tidak bertanggung jawab atas kendala yang berasal dari layanan pihak ketiga, perubahan yang dilakukan klien, atau penggunaan website di luar spesifikasi yang telah disepakati.

J. Persetujuan Hasil Pekerjaan
Stack.byAlif memberikan kesempatan kepada klien untuk memeriksa hasil pekerjaan sebelum serah terima final. Klien dapat menyampaikan ketidaksesuaian terhadap spesifikasi yang telah disepakati untuk diperbaiki sesuai ketentuan revisi dan garansi.

K. Persetujuan Elektronik
Dengan melakukan persetujuan melalui portal Stack.byAlif, klien menyatakan telah membaca, memahami, dan menyetujui seluruh isi perjanjian beserta rincian proyek yang tercantum di dalamnya secara sadar dan sah mengikat menurut UU ITE.`;

export default function AgreementsClient({
  initialAgreements,
  clients,
}: {
  initialAgreements: Agreement[];
  clients: ClientOption[];
}) {
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewSigned, setViewSigned] = useState<Agreement | null>(null);
  const [clientBaseUrl, setClientBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const url = isLocal
        ? `${window.location.protocol}//${window.location.hostname}:3002`
        : window.location.origin.replace('admin.', 'client.');
      setClientBaseUrl(url);
    }
  }, []);

  const getClientAgreementUrl = (agreement: Agreement) => {
    const tokenOrId = agreement.access_token || agreement.id;
    const base = clientBaseUrl || '';
    return `${base}/agreement?ref=${tokenOrId}&code=${agreement.access_code}`;
  };

  // Provider (Stack.byAlif) Signature Modal State
  const [signProviderModal, setSignProviderModal] = useState<Agreement | null>(null);
  const [providerSignerName, setProviderSignerName] = useState('Muhammad Alif Muzakky');
  const [providerSignerTitle, setProviderSignerTitle] = useState('Founder / Lead Developer');
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [isSigningProvider, setIsSigningProvider] = useState(false);
  const [hasProviderDrawn, setHasProviderDrawn] = useState(false);
  const providerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isProviderDrawing, setIsProviderDrawing] = useState(false);

  const handleOpenProviderSign = (agreement: Agreement) => {
    setSignProviderModal(agreement);
    setHasProviderDrawn(!!agreement.provider_signature_data);
    if (agreement.provider_signer_name) setProviderSignerName(agreement.provider_signer_name);
    if (agreement.provider_signer_title) setProviderSignerTitle(agreement.provider_signer_title);

    // Render existing or saved signature
    setTimeout(() => {
      const canvas = providerCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const targetSig =
        agreement.provider_signature_data ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('stackbyalif_default_signature')
          : null);
      if (targetSig) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasProviderDrawn(true);
        };
        img.src = targetSig;
      }
    }, 100);
  };

  const startProviderDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = providerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsProviderDrawing(true);
    setHasProviderDrawn(true);
  };

  const drawProvider = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isProviderDrawing) return;
    const canvas = providerCanvasRef.current;
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

  const stopProviderDrawing = () => {
    setIsProviderDrawing(false);
  };

  const clearProviderCanvas = () => {
    const canvas = providerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasProviderDrawn(false);
  };

  const handleUseSavedSignature = () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('stackbyalif_default_signature');
    if (!saved) {
      alert(
        'Belum ada tanda tangan default yang tersimpan. Silakan goreskan tanda tangan Anda terlebih dahulu lalu centang "Simpan sebagai default".'
      );
      return;
    }
    const canvas = providerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setHasProviderDrawn(true);
    };
    img.src = saved;
  };

  const handleSaveProviderSignature = async () => {
    if (!signProviderModal) return;
    if (!hasProviderDrawn || !providerCanvasRef.current) {
      alert('Silakan goreskan tanda tangan Anda pada kanvas terlebih dahulu.');
      return;
    }
    const signatureData = providerCanvasRef.current.toDataURL('image/png');

    if (saveAsDefault && typeof window !== 'undefined') {
      localStorage.setItem('stackbyalif_default_signature', signatureData);
      localStorage.setItem('stackbyalif_signer_name', providerSignerName);
      localStorage.setItem('stackbyalif_signer_title', providerSignerTitle);
    }

    setIsSigningProvider(true);
    try {
      let isSuccess = false;
      let errorMsg = '';
      const signedAt = new Date().toISOString();

      // 1. Try server API route first
      try {
        const res = await fetch('/api/agreements/sign-provider', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agreement_id: signProviderModal.id,
            provider_signature_data: signatureData,
            provider_signer_name: providerSignerName,
            provider_signer_title: providerSignerTitle,
          }),
        });

        const resData = await res.json();
        if (res.ok && resData.success) {
          isSuccess = true;
        } else {
          errorMsg = resData.error || '';
        }
      } catch (apiErr: any) {
        errorMsg = apiErr.message || '';
      }

      // 2. If API route didn't succeed (e.g. cookie forwarding or edge worker context in Cloudflare),
      // update directly via the authenticated browser Supabase client
      if (!isSuccess) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('agreements')
          .update({
            provider_signature_data: signatureData,
            provider_signer_name: providerSignerName || 'Muhammad Alif Muzakky',
            provider_signer_title: providerSignerTitle || 'Pemilik Usaha',
            provider_signed_at: signedAt,
            updated_at: signedAt,
          })
          .eq('id', signProviderModal.id)
          .select();

        if (error) {
          if (error.message?.includes('provider_signature_data')) {
            throw new Error(
              'Kolom tanda tangan belum dibuat di database Supabase. Silakan jalankan kueri SQL ALTER TABLE di Supabase SQL Editor.'
            );
          }
          throw new Error(error.message || errorMsg || 'Gagal menyimpan tanda tangan.');
        }

        if (data && data.length > 0) {
          isSuccess = true;
        } else {
          throw new Error(
            errorMsg || 'Gagal menyimpan tanda tangan: Akses ditolak atau data tidak ditemukan.'
          );
        }
      }

      setAgreements((prev) =>
        prev.map((a) =>
          a.id === signProviderModal.id
            ? {
                ...a,
                provider_signature_data: signatureData,
                provider_signer_name: providerSignerName,
                provider_signer_title: providerSignerTitle,
                provider_signed_at: signedAt,
              }
            : a
        )
      );

      setSignProviderModal(null);
      alert('Tanda tangan Pihak Pertama (Stack.byAlif) berhasil dibubuhkan ke kontrak!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSigningProvider(false);
    }
  };

  const [formData, setFormData] = useState({
    client_id: clients[0]?.id || '',
    agreement_title: 'Ketentuan Pengerjaan Website & Sistem Digital',
    project_title: '',
    scope_of_work: DEFAULT_SCOPE_OF_WORK,
    deliverables: DEFAULT_DELIVERABLES,
    total_fee: '',
    payment_terms: DEFAULT_PAYMENT_TERMS,
    terms_and_conditions: DEFAULT_TERMS_AND_CONDITIONS,
    expiry_days: '7',
  });

  const handleCopyLink = (code: string, id: string, token?: string) => {
    // Determine client portal base url
    const clientBaseUrl =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? `${window.location.protocol}//${window.location.hostname}:3002`
        : window.location.origin.replace('admin.', 'client.');

    const tokenOrId = token || id;
    const directLink = `${clientBaseUrl}/agreement?ref=${tokenOrId}&code=${code}`;

    const textToCopy = `📋 *DOKUMEN PERJANJIAN KERJA SAMA (PKS) — STACK.BYALIF*
Silakan buka tautan berikut untuk memeriksa detail proyek dan membubuhkan tanda tangan digital Anda:

🔗 Link Kontrak: ${directLink}
🔑 Kode Akses Rahasia: ${code}

_Tautan ini dilindungi tanda tangan digital dan enkripsi berstandar UU ITE._`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id) {
      alert('Pilih klien terlebih dahulu. Jika belum ada, buat klien di menu Data Klien.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + (parseInt(formData.expiry_days, 10) || 7));

      // Generate cryptographically random token (64 hex) & 6-char verification code
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      const token = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');

      const codeArr = new Uint8Array(3);
      window.crypto.getRandomValues(codeArr);
      const code = Array.from(codeArr, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      const deliverablesArr = formData.deliverables
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean);

      const finalTitle = formData.agreement_title
        ? `${formData.agreement_title} — ${formData.project_title.trim()}`
        : formData.project_title.trim();

      const payload = {
        client_id: formData.client_id,
        project_title: finalTitle,
        scope_of_work: formData.scope_of_work.trim(),
        deliverables: deliverablesArr,
        total_fee: parseFloat(formData.total_fee) || 0,
        payment_terms: formData.payment_terms.trim(),
        terms_and_conditions: formData.terms_and_conditions.trim(),
        access_token: token,
        access_code: code,
        status: 'sent',
        expires_at: expiryDate.toISOString(),
      };

      const { data, error } = await supabase
        .from('agreements')
        .insert([payload])
        .select(`
          *,
          client:clients(id, name, company, email, phone)
        `)
        .single();

      if (error) throw error;
      if (data) setAgreements([data, ...agreements]);

      setShowModal(false);
      setFormData({
        client_id: clients[0]?.id || '',
        agreement_title: 'Ketentuan Pengerjaan Website & Sistem Digital',
        project_title: '',
        scope_of_work: DEFAULT_SCOPE_OF_WORK,
        deliverables: DEFAULT_DELIVERABLES,
        total_fee: '',
        payment_terms: DEFAULT_PAYMENT_TERMS,
        terms_and_conditions: DEFAULT_TERMS_AND_CONDITIONS,
        expiry_days: '7',
      });
    } catch (err: any) {
      alert(`Gagal membuat agreement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Total: <span className="font-semibold text-white">{agreements.length}</span> dokumen
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium px-4 py-2.5 rounded-xl text-sm transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Agreement Baru</span>
        </button>
      </div>

      {agreements.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <FileCheck2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            Belum ada agreement kerja sama yang dibuat.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {agreements.map((agreement) => {
            const isSigned = agreement.status === 'signed';
            const isExpired =
              !isSigned && new Date(agreement.expires_at).getTime() < Date.now();

            return (
              <div
                key={agreement.id}
                className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                        isSigned
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isExpired
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {isSigned ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Ditandatangani
                        </>
                      ) : isExpired ? (
                        <>
                          <AlertCircle className="w-3 h-3" /> Kedaluwarsa
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Menunggu TTD
                        </>
                      )}
                    </span>

                    <span className="text-xs text-slate-400 font-mono">
                      Ref: {agreement.id.slice(0, 8)}
                    </span>

                    <span className="text-xs text-slate-400">
                      Berlaku hingga:{' '}
                      <strong className="text-slate-200">
                        {new Date(agreement.expires_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {agreement.project_title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <div>
                      Klien:{' '}
                      <span className="font-semibold text-slate-200">
                        {agreement.client?.company || 'Klien'} ({agreement.client?.name})
                      </span>
                    </div>
                    <div>•</div>
                    <div>
                      Nilai Kontrak:{' '}
                      <span className="font-semibold text-sky-400">
                        {formatRupiah(agreement.total_fee)}
                      </span>
                    </div>
                  </div>

                  {isSigned && (
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-400/90 font-mono">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Penandatangan: {agreement.signer_name} ({agreement.signer_title || 'PIC'})</span>
                      </div>
                      <div>•</div>
                      <div className="truncate max-w-xs" title={agreement.document_checksum}>
                        SHA-256: {agreement.document_checksum?.slice(0, 16)}...
                      </div>
                    </div>
                  )}

                  {/* Status Tanda Tangan Para Pihak */}
                  <div className="pt-3 flex flex-wrap items-center gap-2.5">
                    {/* Status TTD Pihak 1 (Stack.byAlif) */}
                    {agreement.provider_signature_data ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                        <span>TTD Pihak 1 (Stack.byAlif): Sah</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span>TTD Pihak 1: Belum Dibubuhkan</span>
                      </div>
                    )}

                    {/* Status TTD Pihak 2 (Klien) */}
                    {isSigned ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                        <span>TTD Pihak 2 ({agreement.signer_name || 'Klien'}): Sah</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                        <Clock className="w-3.5 h-3.5" />
                        <span>TTD Pihak 2: Menunggu Klien</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 shrink-0">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-slate-400">Kode Akses:</span>
                    <span className="font-mono font-bold text-white tracking-widest">
                      {agreement.access_code}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Tombol Tandatangani PKS oleh Pihak Pertama (Stack.byAlif) */}
                    <button
                      onClick={() => handleOpenProviderSign(agreement)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        agreement.provider_signature_data
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                          : 'bg-[#0052ff] hover:bg-[#0045d8] text-white shadow-xs'
                      }`}
                      title={agreement.provider_signature_data ? 'Ubah Tanda Tangan Anda' : 'Bubuhkan Tanda Tangan Anda sebagai Pihak Pertama'}
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>{agreement.provider_signature_data ? 'Ubah TTD Anda' : 'Tandatangani PKS'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(agreement.access_code, agreement.id, agreement.access_token)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>{copiedId === agreement.id ? 'Tersalin!' : 'Salin Link'}</span>
                    </button>

                    {(isSigned || agreement.provider_signature_data) && (
                      <button
                        onClick={() => setViewSigned(agreement)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Lihat Bukti TTD</span>
                      </button>
                    )}

                    <a
                      href={getClientAgreementUrl(agreement)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                      title="Buka Portal Penandatanganan Klien"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal View Signed Agreement Proof (Dual Party) */}
      {viewSigned && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl my-6 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
                <ShieldCheck className="w-5 h-5" />
                <span>Bukti Keabsahan Tanda Tangan Para Pihak</span>
              </div>
              <button
                onClick={() => setViewSigned(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400">
                  Dokumen Kontrak:{' '}
                  <strong className="text-white text-sm">{viewSigned.project_title}</strong>
                </div>
                <div className="text-slate-400">
                  Klien:{' '}
                  <strong className="text-slate-200">
                    {viewSigned.client?.company} ({viewSigned.client?.name})
                  </strong>
                </div>
                <div className="text-slate-400">
                  Nilai Kontrak:{' '}
                  <strong className="text-sky-400 font-semibold">
                    {formatRupiah(viewSigned.total_fee)}
                  </strong>
                </div>
                {viewSigned.document_checksum && (
                  <div className="text-slate-400 pt-1">
                    SHA-256 Checksum:{' '}
                    <span className="font-mono text-emerald-400 break-all">
                      {viewSigned.document_checksum}
                    </span>
                  </div>
                )}
              </div>

              {/* Dua Kolom TTD: Pihak Pertama & Pihak Kedua */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pihak Pertama (Stack.byAlif) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                        Pihak Pertama (Penyedia)
                      </span>
                      {viewSigned.provider_signature_data ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Sah
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Belum TTD
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {viewSigned.provider_signer_name || 'Muhammad Alif Muzakky'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {viewSigned.provider_signer_title || 'Founder / Lead Developer'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Waktu TTD:{' '}
                      {viewSigned.provider_signed_at
                        ? new Date(viewSigned.provider_signed_at).toLocaleString('id-ID')
                        : 'Belum dibubuhkan'}
                    </div>
                  </div>

                  <div>
                    <div className="p-3 bg-white rounded-lg border border-slate-700 min-h-[110px] flex items-center justify-center">
                      {viewSigned.provider_signature_data ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={viewSigned.provider_signature_data}
                          alt="Tanda Tangan Pihak Pertama"
                          className="max-h-24 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          Belum ada tanda tangan
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pihak Kedua (Klien) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        Pihak Kedua (Klien)
                      </span>
                      {viewSigned.status === 'signed' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Sah
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Menunggu Klien
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {viewSigned.signer_name || viewSigned.client?.name || 'Nama Klien'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {viewSigned.signer_title || 'Klien / Penanggung Jawab'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Waktu TTD:{' '}
                      {viewSigned.signed_at
                        ? new Date(viewSigned.signed_at).toLocaleString('id-ID')
                        : 'Menunggu penandatanganan klien'}
                    </div>
                    {viewSigned.signer_ip && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        IP: {viewSigned.signer_ip}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="p-3 bg-white rounded-lg border border-slate-700 min-h-[110px] flex items-center justify-center">
                      {viewSigned.signature_data ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={viewSigned.signature_data}
                          alt="Tanda Tangan Pihak Kedua"
                          className="max-h-24 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          Menunggu tanda tangan klien
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-slate-400">
                Sistem PKS Digital Resmi — Stack.byAlif
              </div>
              <button
                onClick={() => setViewSigned(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tanda Tangan Pihak Pertama (Stack.byAlif) */}
      {signProviderModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden text-zinc-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-800/80 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Tanda Tangan Pihak Pertama (Stack.byAlif)
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Bubuhkan tanda tangan Anda selaku pihak pengembang / penyedia jasa. Tanda tangan ini akan otomatis terlampir di lembar kontrak resmi &amp; PDF klien.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSignProviderModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Document Overview */}
              <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs space-y-1">
                <div className="text-zinc-400">
                  Dokumen:{' '}
                  <strong className="text-white">{signProviderModal.project_title}</strong>
                </div>
                <div className="text-zinc-400">
                  Klien:{' '}
                  <strong className="text-zinc-200">
                    {signProviderModal.client?.company || 'Klien'} ({signProviderModal.client?.name})
                  </strong>
                </div>
              </div>

              {/* Input Identitas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nama Penandatangan
                  </label>
                  <input
                    type="text"
                    required
                    value={providerSignerName}
                    onChange={(e) => setProviderSignerName(e.target.value)}
                    placeholder="Muhammad Alif Muzakky"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Jabatan / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={providerSignerTitle}
                    onChange={(e) => setProviderSignerTitle(e.target.value)}
                    placeholder="Founder / Lead Developer"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Kanvas Tanda Tangan */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <span>Goreskan Tanda Tangan Anda</span>
                    <span className="text-[10px] text-zinc-500">(Gunakan mouse, stylus, atau jari di layar HP)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUseSavedSignature}
                      className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
                      title="Gunakan tanda tangan yang pernah Anda simpan sebelumnya"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Pakai TTD Tersimpan</span>
                    </button>
                    <span className="text-zinc-600">|</span>
                    <button
                      type="button"
                      onClick={clearProviderCanvas}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-red-400 font-medium cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Bersihkan</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border-2 border-zinc-700/80 overflow-hidden shadow-inner flex items-center justify-center p-2 relative">
                  <canvas
                    ref={providerCanvasRef}
                    width={520}
                    height={180}
                    onMouseDown={startProviderDrawing}
                    onMouseMove={drawProvider}
                    onMouseUp={stopProviderDrawing}
                    onMouseLeave={stopProviderDrawing}
                    onTouchStart={startProviderDrawing}
                    onTouchMove={drawProvider}
                    onTouchEnd={stopProviderDrawing}
                    className="w-full h-44 cursor-crosshair touch-none bg-white rounded-lg"
                  />
                  {!hasProviderDrawn && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs">
                      <PenTool className="w-6 h-6 mb-1 text-slate-300" />
                      <span>Tanda tangani di sini</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Opsi Simpan sebagai Default */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-500 bg-zinc-900 border-zinc-700 focus:ring-sky-500"
                  />
                  <span>
                    Simpan tanda tangan ini sebagai default (agar tidak perlu menggambar ulang di kontrak berikutnya)
                  </span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 px-6 border-t border-zinc-800 bg-zinc-950/90 shrink-0 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSignProviderModal(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer transition"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={isSigningProvider}
                onClick={handleSaveProviderSignature}
                className="py-2.5 px-5 rounded-xl bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isSigningProvider ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengesahkan TTD...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Sahkan &amp; Bubuhkan ke Kontrak</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Generate Project Agreement (Matches User Screenshots 1 & 2) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl my-6 flex flex-col max-h-[90vh] overflow-hidden text-zinc-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-800/80 shrink-0">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Generate Project Agreement
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-400 border border-sky-500/30">
                    Admin Only
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Buat dokumen perjanjian berdasarkan data klien dan proyek yang sudah disepakati.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-hidden">
              <div
                className="p-6 overflow-y-auto space-y-6 flex-1 pr-4"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#3f3f46 #09090b',
                }}
              >
                {/* 1. Informasi Klien & Proyek */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    1. Informasi Klien & Proyek
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Klien
                    </label>
                    <select
                      required
                      value={formData.client_id}
                      onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.company} — {c.name} ({c.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-zinc-300">
                        Judul perjanjian
                      </label>
                      <span className="text-[11px] text-zinc-500">Patokan Template</span>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ketentuan Pengerjaan Website & Sistem Digital"
                      value={formData.agreement_title}
                      onChange={(e) => setFormData({ ...formData, agreement_title: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            agreement_title: 'Ketentuan Pengerjaan Website & Sistem Digital',
                            scope_of_work: DEFAULT_SCOPE_OF_WORK,
                            deliverables: DEFAULT_DELIVERABLES,
                            payment_terms: DEFAULT_PAYMENT_TERMS,
                            terms_and_conditions: DEFAULT_TERMS_AND_CONDITIONS,
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-emerald-400 font-medium cursor-pointer transition"
                      >
                        ⚡ Template Resmi Stack.byAlif (Lengkap)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            agreement_title: 'Website Development Agreement — Toko Online & E-Commerce',
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-400 font-medium cursor-pointer transition"
                      >
                        E-Commerce
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Nama proyek
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama website / sistem"
                      value={formData.project_title}
                      onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Nilai kontrak (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 599000"
                      value={formData.total_fee}
                      onChange={(e) => setFormData({ ...formData, total_fee: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-850 pt-2" />

                {/* 2. Ketentuan Perjanjian */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      2. Ketentuan Perjanjian
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          scope_of_work: DEFAULT_SCOPE_OF_WORK,
                          deliverables: DEFAULT_DELIVERABLES,
                          payment_terms: DEFAULT_PAYMENT_TERMS,
                          terms_and_conditions: DEFAULT_TERMS_AND_CONDITIONS,
                        });
                      }}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-medium cursor-pointer underline"
                    >
                      Isi Otomatis Template Resmi
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Masa berlaku penawaran / quotation
                    </label>
                    <div className="space-y-2">
                      {[
                        { days: '3', label: '3 hari' },
                        { days: '7', label: '7 hari (standar)' },
                        { days: '14', label: '14 hari' },
                      ].map((item) => (
                        <label
                          key={item.days}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                            formData.expiry_days === item.days
                              ? 'bg-zinc-900 border-zinc-700 text-white'
                              : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="expiry_days"
                            value={item.days}
                            checked={formData.expiry_days === item.days}
                            onChange={(e) => setFormData({ ...formData, expiry_days: e.target.value })}
                            className="w-4 h-4 text-emerald-500 bg-zinc-900 border-zinc-700 focus:ring-emerald-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-2">
                      Catatan: Ini masa berlaku penawaran, bukan masa berlaku kontrak.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Ruang lingkup pekerjaan
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Jelaskan pekerjaan yang akan dilakukan..."
                      value={formData.scope_of_work}
                      onChange={(e) => setFormData({ ...formData, scope_of_work: e.target.value })}
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#3f3f46 #18181b',
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Deliverables (Satu deliverable per baris)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Satu deliverable per baris"
                      value={formData.deliverables}
                      onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#3f3f46 #18181b',
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Ketentuan pembayaran
                    </label>
                    <textarea
                      rows={4}
                      value={formData.payment_terms}
                      onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#3f3f46 #18181b',
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Ketentuan tambahan (Klausul A s/d K)
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Ketentuan khusus proyek..."
                      value={formData.terms_and_conditions}
                      onChange={(e) => setFormData({ ...formData, terms_and_conditions: e.target.value })}
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#3f3f46 #18181b',
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Button matching Image 2 */}
              <div className="p-4 px-6 border-t border-zinc-850 bg-zinc-950/90 shrink-0 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                      <span>Membuat Agreement...</span>
                    </>
                  ) : (
                    <span>Generate & Simpan Agreement</span>
                  )}
                </button>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
                  <span>Terhubung ke sistem Supabase Stack.byAlif</span>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
