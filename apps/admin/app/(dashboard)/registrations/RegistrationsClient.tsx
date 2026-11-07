'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  FileCheck2,
  Globe,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2,
  X,
  Search,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export interface ClientRegistration {
  id: string;
  registration_number: string;
  full_name: string;
  email: string;
  whatsapp: string;
  domicile_address: string;
  business_name: string;
  ownership_status: string;
  legal_entity?: string;
  business_address: string;
  domain_name?: string;
  domain_identity_option?: string;
  domain_registrar?: string;
  declaration_identity_correct: boolean;
  declaration_authority: boolean;
  declaration_liability: boolean;
  declaration_scope_understanding: boolean;
  status: 'pending_review' | 'verified' | 'rejected' | 'converted';
  admin_notes?: string;
  client_ip?: string;
  user_agent?: string;
  created_at: string;
}

export default function RegistrationsClient({
  initialRegistrations,
}: {
  initialRegistrations: ClientRegistration[];
}) {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<ClientRegistration[]>(initialRegistrations);
  const [selectedReg, setSelectedReg] = useState<ClientRegistration | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = registrations.filter(
    (r) =>
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.business_name.toLowerCase().includes(search.toLowerCase()) ||
      r.registration_number.toLowerCase().includes(search.toLowerCase()) ||
      (r.domain_name && r.domain_name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUpdateStatus = async (
    id: string,
    newStatus: 'verified' | 'rejected' | 'pending_review'
  ) => {
    setLoadingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('client_registrations')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setRegistrations(
        registrations.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedReg && selectedReg.id === id) {
        setSelectedReg({ ...selectedReg, status: newStatus });
      }
    } catch (err: any) {
      alert(`Gagal memperbarui status: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const handleConvertToClient = async (reg: ClientRegistration) => {
    if (!confirm(`Konversi "${reg.business_name}" (${reg.full_name}) menjadi Klien resmi dan siapkan draft kontrak?`)) {
      return;
    }

    setLoadingId(reg.id);
    try {
      const supabase = createClient();

      // 1. Insert into clients table
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([
          {
            name: reg.full_name,
            company: reg.business_name,
            email: reg.email,
            phone: reg.whatsapp,
            address: `${reg.business_address} (Domisili: ${reg.domicile_address})`,
            notes: `Converted dari ${reg.registration_number}. Opsi Domain: ${reg.domain_identity_option || '-'}. Registrar: ${reg.domain_registrar || '-'}. Status Kepemilikan: ${reg.ownership_status}.`,
          },
        ])
        .select()
        .single();

      if (clientError) throw clientError;

      // 2. Update registration status to converted
      await supabase
        .from('client_registrations')
        .update({ status: 'converted', updated_at: new Date().toISOString() })
        .eq('id', reg.id);

      setRegistrations(
        registrations.map((r) => (r.id === reg.id ? { ...r, status: 'converted' } : r))
      );

      alert(`Berhasil membuat klien "${reg.business_name}"! Mengalihkan ke menu Agreement...`);
      router.push('/agreements');
    } catch (err: any) {
      alert(`Gagal konversi ke klien: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama, bisnis, domain, ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            Total Masuk: <strong className="text-white">{registrations.length}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            Terverifikasi:{' '}
            <strong className="text-emerald-300">
              {registrations.filter((r) => r.status === 'verified' || r.status === 'converted').length}
            </strong>
          </span>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Ref ID</th>
                <th className="py-3.5 px-4 font-semibold">Klien & Bisnis</th>
                <th className="py-3.5 px-4 font-semibold">Kontak</th>
                <th className="py-3.5 px-4 font-semibold">Permintaan Domain</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    Belum ada data registrasi klien yang masuk.
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {reg.registration_number}
                      <span className="block text-[10px] text-slate-500 font-sans mt-0.5">
                        {new Date(reg.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{reg.business_name}</div>
                      <div className="text-slate-400 text-[11px]">
                        {reg.full_name} ({reg.ownership_status})
                      </div>
                      {reg.legal_entity && (
                        <span className="text-[10px] text-slate-500 block">
                          {reg.legal_entity}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white">{reg.whatsapp}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[150px]">
                        {reg.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200">
                        {reg.domain_name || 'Tidak ada'}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {reg.domain_identity_option || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {reg.status === 'converted' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-950/80 text-blue-400 border border-blue-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Klien Resmi
                        </span>
                      ) : reg.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="w-3 h-3" />
                          Terverifikasi
                        </span>
                      ) : reg.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-950/80 text-red-400 border border-red-500/30">
                          <XCircle className="w-3 h-3" />
                          Ditolak
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          Perlu Review
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Lihat Detail Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {reg.status !== 'converted' && (
                          <button
                            onClick={() => handleConvertToClient(reg)}
                            disabled={loadingId === reg.id}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                            title="Konversi ke Klien & Buat Kontrak"
                          >
                            <FileCheck2 className="w-3 h-3" />
                            <span>Buat Kontrak</span>
                          </button>
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

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono text-emerald-400">
                  {selectedReg.registration_number}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Detail Registrasi: {selectedReg.business_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Section 01 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block mb-1 text-sm">
                  01. Personal Information (Identitas Pemesan)
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div>Nama Lengkap: <strong className="text-white">{selectedReg.full_name}</strong></div>
                  <div>WhatsApp: <strong className="text-white">{selectedReg.whatsapp}</strong></div>
                  <div>Email: <strong className="text-white">{selectedReg.email}</strong></div>
                  <div>Domisili: <strong className="text-white">{selectedReg.domicile_address}</strong></div>
                </div>
              </div>

              {/* Section 02 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block mb-1 text-sm">
                  02. Business Information
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div>Nama Bisnis: <strong className="text-white">{selectedReg.business_name}</strong></div>
                  <div>Status: <strong className="text-white">{selectedReg.ownership_status}</strong></div>
                  <div>Badan Usaha: <strong className="text-white">{selectedReg.legal_entity || '-'}</strong></div>
                  <div>Alamat Bisnis: <strong className="text-white">{selectedReg.business_address}</strong></div>
                </div>
              </div>

              {/* Section 03 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block mb-1 text-sm">
                  03. Domain Registration Preference
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div>Domain: <strong className="text-white">{selectedReg.domain_name || '-'}</strong></div>
                  <div>Opsi Registrasi: <strong className="text-white">{selectedReg.domain_identity_option || '-'}</strong></div>
                  <div>Registrar Pilihan: <strong className="text-white">{selectedReg.domain_registrar || '-'}</strong></div>
                </div>
              </div>

              {/* Legal Verification Evidence */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                <span className="font-bold text-emerald-400 block mb-1 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  04. Pernyataan Legalitas & Audit Trail
                </span>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Informasi identitas dan bisnis dinyatakan benar.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Memiliki kewenangan sah untuk memesan proyek.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bertanggung jawab mutlak atas legalitas isi, konten, & transaksi.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Memahami Stack.byAlif hanya bertindak sebagai vendor software.</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-slate-400 flex justify-between">
                  <span>IP Pengirim: <code className="text-emerald-400">{selectedReg.client_ip || '-'}</code></span>
                  <span>Waktu: {new Date(selectedReg.created_at).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                {selectedReg.status !== 'verified' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReg.id, 'verified')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-500/30 cursor-pointer"
                  >
                    Tandai Terverifikasi
                  </button>
                )}
                {selectedReg.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReg.id, 'rejected')}
                    className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-semibold border border-red-500/30 cursor-pointer"
                  >
                    Tolak / Flag Mencurigakan
                  </button>
                )}
              </div>

              {selectedReg.status !== 'converted' && (
                <button
                  onClick={() => handleConvertToClient(selectedReg)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Konversi ke Klien & Terbitkan Kontrak</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
