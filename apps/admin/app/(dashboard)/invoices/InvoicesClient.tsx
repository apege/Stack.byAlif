'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  DollarSign,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Building,
  UserCheck,
  MoreVertical,
} from 'lucide-react';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomClientSelect from '@/components/CustomClientSelect';
import CustomInvoiceTypeSelect, { type InvoiceType } from '@/components/CustomInvoiceTypeSelect';

export interface InvoiceItem {
  description: string;
  qty: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  agreement_id?: string;
  client_id?: string;
  registration_number?: string;
  client_name: string;
  client_company?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  project_title: string;
  invoice_type: 'down_payment' | 'final_payment' | 'full_payment' | 'maintenance' | 'custom';
  status: 'unpaid' | 'paid' | 'cancelled' | 'refunded';
  subtotal: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
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
  created_at: string;
}

interface ClientOption {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface AgreementOption {
  id: string;
  project_title: string;
  total_fee: number;
  client_id: string;
}

export default function InvoicesClient({
  initialInvoices,
  clients,
  agreements,
}: {
  initialInvoices: Invoice[];
  clients: ClientOption[];
  agreements: AgreementOption[];
}) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'paid' | 'cancelled'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close 3-dots action menu when clicking outside
  useEffect(() => {
    function handleClickOutside() {
      setOpenActionMenuId(null);
    }
    if (openActionMenuId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openActionMenuId]);

  // Form state
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedAgreementId, setSelectedAgreementId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [invoiceType, setInvoiceType] = useState<'down_payment' | 'final_payment' | 'full_payment' | 'custom'>('down_payment');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [bankName, setBankName] = useState('BCA');
  const [bankAccountName, setBankAccountName] = useState('Muhammad Alif Muzakky');
  const [bankAccountNumber, setBankAccountNumber] = useState('123-456-7890');
  const [notes, setNotes] = useState('Pembayaran mohon ditransfer ke rekening di atas dan konfirmasi via WhatsApp.');

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Down Payment (DP 50%) Pengembangan Website', qty: 1, unit_price: 1500000, total: 1500000 },
  ]);

  const subtotal = items.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalAmount = subtotal;

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const found = clients.find((c) => c.id === clientId);
    if (found) {
      setClientName(found.name || '');
      setClientCompany(found.company || '');
      setClientEmail(found.email || '');
      setClientPhone(found.phone || '');
      setClientAddress(found.address || '');

      // Check if client has agreement
      const clientAgreements = agreements.filter((a) => a.client_id === clientId);
      if (clientAgreements.length > 0) {
        const ag = clientAgreements[0];
        setSelectedAgreementId(ag.id);
        setProjectTitle(ag.project_title || '');
        const dpVal = Math.round(Number(ag.total_fee || 0) * 0.5);
        setItems([
          {
            description: `Down Payment (DP 50%) - ${ag.project_title}`,
            qty: 1,
            unit_price: dpVal,
            total: dpVal,
          },
        ]);
      }
    }
  };

  const handleAgreementSelect = (agreementId: string) => {
    setSelectedAgreementId(agreementId);
    const ag = agreements.find((a) => a.id === agreementId);
    if (ag) {
      setProjectTitle(ag.project_title);
      const fee = Number(ag.total_fee || 0);
      if (invoiceType === 'down_payment') {
        const dp = Math.round(fee * 0.5);
        setItems([{ description: `Down Payment (DP 50%) - ${ag.project_title}`, qty: 1, unit_price: dp, total: dp }]);
      } else if (invoiceType === 'final_payment') {
        const sisa = Math.round(fee * 0.5);
        setItems([{ description: `Pelunasan Sisa 50% - ${ag.project_title}`, qty: 1, unit_price: sisa, total: sisa }]);
      } else {
        setItems([{ description: `Pembayaran Penuh - ${ag.project_title}`, qty: 1, unit_price: fee, total: fee }]);
      }
    }
  };

  const handleTypeChange = (type: any) => {
    setInvoiceType(type);
    const ag = agreements.find((a) => a.id === selectedAgreementId);
    const baseFee = ag ? Number(ag.total_fee || 0) : items[0]?.unit_price ? items[0].unit_price * 2 : 3000000;

    if (type === 'down_payment') {
      const val = Math.round(baseFee * 0.5);
      setItems([{ description: `Down Payment (DP 50%) - ${projectTitle || 'Pengembangan Website'}`, qty: 1, unit_price: val, total: val }]);
    } else if (type === 'final_payment') {
      const val = Math.round(baseFee * 0.5);
      setItems([{ description: `Pelunasan Sisa 50% - ${projectTitle || 'Pengembangan Website'}`, qty: 1, unit_price: val, total: val }]);
    } else if (type === 'full_payment') {
      setItems([{ description: `Pembayaran Penuh 100% - ${projectTitle || 'Pengembangan Website'}`, qty: 1, unit_price: baseFee, total: baseFee }]);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', qty: 1, unit_price: 0, total: 0 }]);
  };

  const handleItemChange = (idx: number, field: keyof InvoiceItem, val: any) => {
    const updated = [...items];
    const target = { ...updated[idx], [field]: val };
    if (field === 'qty' || field === 'unit_price') {
      const q = field === 'qty' ? Number(val) : target.qty;
      const p = field === 'unit_price' ? Number(val) : target.unit_price;
      target.total = q * p;
    }
    updated[idx] = target;
    setItems(updated);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClientId || null,
          agreement_id: selectedAgreementId || null,
          client_name: clientName,
          client_company: clientCompany,
          client_email: clientEmail,
          client_phone: clientPhone,
          client_address: clientAddress,
          project_title: projectTitle,
          invoice_type: invoiceType,
          items,
          subtotal,
          discount_amount: 0,
          tax_rate: 0,
          tax_amount: 0,
          total_amount: totalAmount,
          issue_date: issueDate,
          due_date: dueDate,
          bank_name: bankName,
          bank_account_name: bankAccountName,
          bank_account_number: bankAccountNumber,
          notes,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Gagal menerbitkan invoice.');
      }

      setInvoices([result.data, ...invoices]);
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (invoice: Invoice) => {
    const nextStatus = invoice.status === 'paid' ? 'unpaid' : 'paid';
    try {
      const res = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: invoice.id,
          status: nextStatus,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setInvoices(invoices.map((inv) => (inv.id === invoice.id ? result.data : inv)));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus invoice ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/invoices?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInvoices(invoices.filter((inv) => inv.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = (invoice: Invoice) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    // Client portal domain or fallback
    const clientUrl = origin.includes('admin.')
      ? origin.replace('admin.', 'client.') + `/invoice/${invoice.id}`
      : `https://client.stackbyalif.my.id/invoice/${invoice.id}`;

    navigator.clipboard.writeText(clientUrl);
    setCopiedId(invoice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  // Stats calculation
  const totalInvoiced = invoices.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
  const totalUnpaid = invoices
    .filter((inv) => inv.status === 'unpaid')
    .reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.client_company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.project_title.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && inv.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tagihan</span>
            <Receipt className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{formatRupiah(totalInvoiced)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{invoices.length} total invoice diterbitkan</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lunas (Paid)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 tracking-tight">{formatRupiah(totalPaid)}</p>
          <p className="text-[11px] text-emerald-400/80 mt-1">Pembayaran terverifikasi masuk</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Menunggu Pembayaran</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 tracking-tight">{formatRupiah(totalUnpaid)}</p>
          <p className="text-[11px] text-amber-400/80 mt-1">
            {invoices.filter((i) => i.status === 'unpaid').length} invoice belum dilunasi
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ketentuan Refund</span>
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-sm font-bold text-white tracking-tight mt-1">PKS Pasal 4 Enforced</p>
          <p className="text-[11px] text-slate-400 mt-1">DP 50% Non-Refundable terlindungi hukum</p>
        </div>
      </div>

      {/* 2. Search & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari invoice, klien, atau proyek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'unpaid', 'paid', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-[#0052ff] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'Semua' : st === 'unpaid' ? 'Belum Lunas' : st === 'paid' ? 'Lunas' : 'Dibatalkan'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0052ff] hover:bg-[#0045d8] text-white text-sm font-medium shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Terbitkan Invoice
          </button>
        </div>
      </div>

      {/* 3. Invoices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
        <div className="overflow-x-auto overflow-y-visible min-h-[280px]">
          <table className="min-w-[880px] w-full text-left text-sm">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 whitespace-nowrap">No. Invoice & Tanggal</th>
                <th className="py-4 px-6 whitespace-nowrap">Klien & Proyek</th>
                <th className="py-4 px-6 whitespace-nowrap">Tipe Tagihan</th>
                <th className="py-4 px-6 whitespace-nowrap">Total Nominal</th>
                <th className="py-4 px-6 whitespace-nowrap">Jatuh Tempo</th>
                <th className="py-4 px-6 whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-right whitespace-nowrap w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <Receipt className="w-10 h-10 mx-auto text-slate-600 mb-3 opacity-60" />
                    Belum ada invoice yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-mono font-bold text-white flex items-center gap-2">
                        {inv.invoice_number}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Diterbitkan: {inv.issue_date}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-semibold text-white">{inv.client_name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="truncate max-w-[220px]">{inv.project_title}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                        inv.invoice_type === 'down_payment'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                          : inv.invoice_type === 'final_payment'
                          ? 'bg-purple-950/80 text-purple-400 border border-purple-800/60'
                          : 'bg-blue-950/80 text-blue-400 border border-blue-800/60'
                      }`}>
                        {inv.invoice_type === 'down_payment'
                          ? 'DP 50%'
                          : inv.invoice_type === 'final_payment'
                          ? 'Pelunasan 50%'
                          : inv.invoice_type === 'full_payment'
                          ? 'Full 100%'
                          : 'Custom'}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-white text-base font-mono">
                        {formatRupiah(inv.total_amount)}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-xs text-slate-300 font-mono block">
                        {inv.due_date}
                      </span>
                      {inv.status === 'unpaid' && (
                        <span className="text-[10px] text-amber-400/90 font-medium whitespace-nowrap">
                          Batas Pembayaran
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(inv)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          inv.status === 'paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/60'
                            : inv.status === 'unpaid'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40 hover:bg-amber-900/60'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                        }`}
                        title="Klik untuk mengubah status lunas / belum lunas"
                      >
                        {inv.status === 'paid' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                          </>
                        ) : inv.status === 'unpaid' ? (
                          <>
                            <Clock className="w-3.5 h-3.5" /> Menunggu Bayar
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Batal
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(openActionMenuId === inv.id ? null : inv.id);
                          }}
                          className={`p-2 rounded-xl transition cursor-pointer select-none ${
                            openActionMenuId === inv.id
                              ? 'bg-[#0052ff] text-white shadow-xs'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                          }`}
                          title="Menu Aksi"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === inv.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1.5 z-50 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-1.5 min-w-[210px] animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-800/80"
                          >
                            <div className="space-y-0.5 pb-1">
                              <a
                                href={`https://client.stackbyalif.my.id/invoice/${inv.id}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setOpenActionMenuId(null)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-sky-400 hover:bg-sky-500/10 rounded-xl transition text-left cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Buka Invoice (Preview)</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => {
                                  handleCopyLink(inv);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-xl transition text-left cursor-pointer"
                              >
                                {copiedId === inv.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 font-semibold">Link Tersalin!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Salin Link Invoice</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleToggleStatus(inv);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-xl transition text-left cursor-pointer"
                              >
                                {inv.status === 'paid' ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Ubah ke Belum Lunas</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Tandai Lunas</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  handleDelete(inv.id);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition text-left cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus Invoice</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal Buat Invoice Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden my-auto">
            {/* Modal Header (Sticky) */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-800/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0052ff]">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Terbitkan Invoice Baru</h3>
                  <p className="text-xs text-slate-400">
                    Otomatis generate nomor invoice resmi dengan klausul non-refundable refund policy.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form with Scrollable Body & Sticky Footer */}
            <form onSubmit={handleCreateInvoice} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto overflow-x-hidden space-y-4 text-xs flex-1">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              {/* Quick Select from existing clients */}
              {clients.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Pilih Klien Tersimpan (Opsional)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Auto-fill identitas & tagihan</span>
                  </div>

                  <CustomClientSelect
                    clients={clients}
                    selectedClientId={selectedClientId}
                    onSelectClient={handleClientSelect}
                    onClear={() => handleClientSelect('')}
                  />
                </div>
              )}

              {/* Client and Project Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Nama Klien / Penanggung Jawab *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Klien"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Nama Bisnis / Perusahaan
                  </label>
                  <input
                    type="text"
                    placeholder="Brand / PT / CV"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pembuatan Website E-Commerce"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Tipe Tagihan
                  </label>
                  <CustomInvoiceTypeSelect
                    value={invoiceType}
                    onChange={(val) => handleTypeChange(val)}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Tanggal Terbit
                  </label>
                  <CustomDatePicker
                    value={issueDate}
                    onChange={setIssueDate}
                    placeholder="Pilih tanggal terbit..."
                    required
                    align="left"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Tanggal Jatuh Tempo (Due Date)
                  </label>
                  <CustomDatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    placeholder="Pilih jatuh tempo..."
                    required
                    align="right"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Rincian Item Tagihan</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-sky-400 hover:text-sky-300 font-medium text-[11px]"
                  >
                    + Tambah Baris
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        required
                        placeholder="Deskripsi layanan / item"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-center text-white focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="number"
                        step="1000"
                        placeholder="Harga"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                        className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-right text-white focus:outline-none focus:border-sky-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-500 hover:text-rose-400 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm">
                  <span className="font-bold text-white">Total Tagihan:</span>
                  <span className="font-bold text-sky-400 font-mono text-base">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Bank Details */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Bank
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Atas Nama
                  </label>
                  <input
                    type="text"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="Contoh: 1234567890"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer (Sticky) */}
            <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#090d18] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-medium transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium shadow-xs transition-all disabled:opacity-50 cursor-pointer text-sm"
              >
                {loading ? 'Menerbitkan...' : 'Terbitkan & Simpan Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
}
