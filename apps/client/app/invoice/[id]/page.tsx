'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Printer,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Building2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

interface InvoiceItem {
  description: string;
  qty: number;
  unit_price: number;
  total: number;
}

interface InvoiceData {
  id: string;
  invoice_number: string;
  client_name: string;
  client_company?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  project_title: string;
  invoice_type: string;
  status: 'unpaid' | 'paid' | 'cancelled' | 'refunded';
  subtotal: number;
  total_amount: number;
  issue_date: string;
  due_date: string;
  paid_at?: string;
  payment_method?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  items: InvoiceItem[];
  notes?: string;
  refund_policy_note?: string;
}

export default function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch(`/api/invoice/${resolvedParams.id}`);
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || 'Invoice tidak ditemukan.');
        }
        setInvoice(result.data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem.');
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [resolvedParams.id]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Memuat lembar invoice resmi...</span>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h1 className="text-xl font-bold text-white mb-1">Invoice Tidak Ditemukan</h1>
        <p className="text-sm text-zinc-400 max-w-md mb-6">{error}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portal Klien
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-6 sm:py-10 px-4 selection:bg-emerald-500/20 selection:text-emerald-300 print:p-0 print:bg-white print:text-black">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Portal Klien
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all"
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Official Invoice Sheet (Paper Layout) */}
      <div className="max-w-[210mm] mx-auto bg-white text-zinc-900 rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl border border-zinc-200/80 font-sans print:p-0 print:m-0 print:max-w-none print:shadow-none print:border-none print:rounded-none">
        {/* 1. KOP SURAT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-zinc-900 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 shadow-md">
              <Image
                src="/images/logo.png"
                alt="Stack.byAlif Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 uppercase">
                Stack.byAlif
              </h1>
              <p className="text-xs text-zinc-600 font-medium">
                Software Engineering & Digital Solutions
              </p>
              <p className="text-[11px] text-zinc-500">
                stackbyalif.my.id • WhatsApp: +62 895-4127-35876
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase block">
              Official Invoice
            </span>
            <span className="text-xl sm:text-2xl font-mono font-black text-zinc-950">
              {invoice.invoice_number}
            </span>
          </div>
        </div>

        {/* 2. STATUS & DATES ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
              Status Tagihan
            </span>
            {invoice.status === 'paid' ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 text-sm mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                LUNAS (PAID)
              </span>
            ) : invoice.status === 'unpaid' ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 text-sm mt-0.5">
                <Clock className="w-4 h-4 text-amber-600" />
                MENUNGGU PEMBAYARAN
              </span>
            ) : (
              <span className="font-bold text-rose-700 text-sm mt-0.5">
                DIBATALKAN
              </span>
            )}
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
              Tanggal Diterbitkan
            </span>
            <span className="font-semibold text-zinc-900 block mt-0.5 text-sm">
              {formatDate(invoice.issue_date)}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
              Jatuh Tempo (Due Date)
            </span>
            <span className="font-bold text-zinc-900 block mt-0.5 text-sm font-mono">
              {formatDate(invoice.due_date)}
            </span>
          </div>
        </div>

        {/* 3. BILL TO & PROJECT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Ditagihkan Kepada (Bill To):
            </span>
            <p className="text-sm font-bold text-zinc-950">{invoice.client_name}</p>
            {invoice.client_company && (
              <p className="font-semibold text-zinc-700">{invoice.client_company}</p>
            )}
            {invoice.client_phone && (
              <p className="text-zinc-600">WhatsApp: {invoice.client_phone}</p>
            )}
            {invoice.client_email && (
              <p className="text-zinc-600">Email: {invoice.client_email}</p>
            )}
            {invoice.client_address && (
              <p className="text-zinc-600 leading-relaxed">{invoice.client_address}</p>
            )}
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Deskripsi Proyek:
            </span>
            <p className="text-sm font-bold text-zinc-950">{invoice.project_title}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-200 text-zinc-800">
              {invoice.invoice_type === 'down_payment'
                ? 'Termin 1: Uang Muka (DP 50%)'
                : invoice.invoice_type === 'final_payment'
                ? 'Termin 2: Pelunasan (Sisa 50%)'
                : 'Pembayaran Penuh (100%)'}
            </span>
          </div>
        </div>

        {/* 4. ITEMS TABLE */}
        <div className="my-6">
          <table className="w-full text-left text-xs border border-collapse border-zinc-300">
            <thead className="bg-zinc-100 text-zinc-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 border border-zinc-300 w-12 text-center">No</th>
                <th className="py-2.5 px-3 border border-zinc-300">Rincian Layanan / Item</th>
                <th className="py-2.5 px-3 border border-zinc-300 w-16 text-center">Qty</th>
                <th className="py-2.5 px-3 border border-zinc-300 w-32 text-right">Harga Satuan</th>
                <th className="py-2.5 px-3 border border-zinc-300 w-36 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-800">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 border border-zinc-300 text-center font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 border border-zinc-300 font-medium">
                      {item.description}
                    </td>
                    <td className="py-2.5 px-3 border border-zinc-300 text-center font-mono">
                      {item.qty}
                    </td>
                    <td className="py-2.5 px-3 border border-zinc-300 text-right font-mono">
                      {formatRupiah(item.unit_price)}
                    </td>
                    <td className="py-2.5 px-3 border border-zinc-300 text-right font-mono font-bold">
                      {formatRupiah(item.total)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-zinc-500">
                    Tidak ada rincian item.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-zinc-50 font-bold text-zinc-900">
              <tr>
                <td colSpan={4} className="py-3 px-4 border border-zinc-300 text-right text-xs uppercase">
                  Total Tagihan Yang Harus Dibayar:
                </td>
                <td className="py-3 px-3 border border-zinc-300 text-right font-mono text-sm text-emerald-800">
                  {formatRupiah(invoice.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 5. PAYMENT METHOD & INSTRUCTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
          <div>
            <span className="font-bold text-zinc-950 flex items-center gap-1.5 mb-2">
              <CreditCard className="w-4 h-4 text-zinc-700" />
              Instruksi Transfer Bank:
            </span>
            <div className="space-y-1 text-zinc-700">
              <p>Bank: <strong className="text-zinc-950 font-mono">{invoice.bank_name || 'BCA'}</strong></p>
              <p>Nomor Rekening: <strong className="text-zinc-950 font-mono text-sm tracking-wider">{invoice.bank_account_number || '0895412735876'}</strong></p>
              <p>Atas Nama: <strong className="text-zinc-950">{invoice.bank_account_name || 'Muhammad Alif Muzakky'}</strong></p>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2 italic">
              *Harap sertakan berita transfer: {invoice.invoice_number}
            </p>
          </div>

          <div>
            <span className="font-bold text-zinc-950 block mb-1">Catatan Tambahan:</span>
            <p className="text-zinc-600 leading-relaxed text-[11px]">
              {invoice.notes || 'Pembayaran yang telah dilakukan mohon dikonfirmasi melalui WhatsApp admin dengan menyertakan bukti transfer.'}
            </p>
          </div>
        </div>

        {/* 6. KLAUSUL REFUND POLICY RESMI */}
        <div className="my-6 p-3.5 rounded-xl border border-amber-300 bg-amber-50/70 text-[10.5px] text-amber-950 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            KEBIJAKAN PENGEMBALIAN DANA (REFUND POLICY)
          </div>
          <p>
            Sesuai ketentuan Perjanjian Kerja Sama (PKS) Pasal 4, pembayaran uang muka (DP) bersifat <strong>non-refundable (tidak dapat dikembalikan)</strong> apabila pembatalan proyek dilakukan atas kehendak atau kelalaian sepihak dari Klien setelah pengerjaan arsitektur teknis atau pengadaan aset (domain/server/lisensi) telah dimulai.
          </p>
        </div>

        {/* 7. FOOTER & TANDA TANGAN */}
        <div className="pt-6 border-t border-zinc-300 flex items-center justify-between text-xs text-zinc-500">
          <div>
            <p className="font-bold text-zinc-900">Stack.byAlif</p>
            <p className="text-[10px]">Dokumen invoice elektronik yang sah dan mengikat.</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px]">Ref: {invoice.id.slice(0, 18).toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
