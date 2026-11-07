'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Lock,
  ArrowRight,
  Loader2,
  Globe,
  Building,
  User,
  ExternalLink,
} from 'lucide-react';

export default function ClientRegistrationPage() {
  const [formData, setFormData] = useState({
    // 01. Personal Information
    full_name: '',
    email: '',
    whatsapp: '',
    domicile_address: '',

    // 02. Business Information
    business_name: '',
    ownership_status: 'Pemilik bisnis',
    legal_entity: '',
    business_address: '',

    // 03. Domain Registration
    domain_name: '',
    domain_identity_option: 'Ya, menggunakan identitas saya',
    domain_registrar: '',

    // 04. Business Declaration
    declaration_identity_correct: false,
    declaration_authority: false,
    declaration_liability: false,
    declaration_scope_understanding: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.whatsapp.trim() || !formData.domicile_address.trim()) {
      setErrorMsg('Mohon isi semua data di bagian 01. Personal Information.');
      return;
    }

    if (!formData.business_name.trim() || !formData.business_address.trim()) {
      setErrorMsg('Mohon isi semua data di bagian 02. Business Information.');
      return;
    }

    if (
      !formData.declaration_identity_correct ||
      !formData.declaration_authority ||
      !formData.declaration_liability ||
      !formData.declaration_scope_understanding
    ) {
      setErrorMsg('Anda wajib mencentang seluruh 4 klausul pernyataan legal pada bagian 04. Business Declaration.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal mengirim formulir.');
      }

      setSubmittedRef(result.registration_number);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Banner Navigation */}
      <header className="border-b border-zinc-900 bg-zinc-950/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 shadow-md">
              <Image
                src="/images/logo.png"
                alt="Stack.byAlif Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-white block">
                Stack.byAlif
              </span>
              <span className="text-[11px] text-zinc-400">Client Project Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/agreement"
              className="text-xs font-medium text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-emerald-500/30 bg-zinc-900/60"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tanda Tangan Kontrak</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {submittedRef ? (
          /* Submission Success State */
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Registrasi Berhasil Terkirim
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Data Proyek & Registrasi Diterima
              </h2>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                Terima kasih telah melengkapi data administrasi. Informasi Anda telah disimpan secara aman dan terenkripsi untuk persiapan registrasi domain dan penerbitan dokumen kerja sama resmi.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs text-zinc-400">Nomor Referensi Registrasi:</span>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {submittedRef}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs text-zinc-400">Nama Bisnis:</span>
                <span className="text-sm font-medium text-white">{formData.business_name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs text-zinc-400">Domain Pilihan:</span>
                <span className="text-sm font-medium text-white">{formData.domain_name || 'Menunggu konfirmasi'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Status Legalitas:</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pernyataan Legal Terverifikasi
                </span>
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 text-xs text-zinc-300 leading-relaxed">
              <strong className="text-emerald-400 block mb-1">Tahap Selanjutnya:</strong>
              1. Tim Stack.byAlif akan memverifikasi kesesuaian data identitas dan domain.<br />
              2. Draft dokumen perjanjian kerja sama (PKS) digital dan rincian quotation akan diterbitkan.<br />
              3. Anda akan menerima notifikasi WhatsApp untuk penandatanganan kontrak digital dan pembayaran DP 50%.
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/agreement"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
              >
                <span>Buka Portal Tanda Tangan Kontrak</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setSubmittedRef(null);
                  setFormData({
                    full_name: '',
                    email: '',
                    whatsapp: '',
                    domicile_address: '',
                    business_name: '',
                    ownership_status: 'Pemilik bisnis',
                    legal_entity: '',
                    business_address: '',
                    domain_name: '',
                    domain_identity_option: 'Ya, menggunakan identitas saya',
                    domain_registrar: '',
                    declaration_identity_correct: false,
                    declaration_authority: false,
                    declaration_liability: false,
                    declaration_scope_understanding: false,
                  });
                }}
                className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-sm transition-all border border-zinc-800"
              >
                Isi Formulir Baru
              </button>
            </div>
          </div>
        ) : (
          /* Client Registration Form UI (matching screenshots 1, 2, 3) */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header Block */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Client Registration
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  Stack.byAlif
                </span>
              </div>
              <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                CLIENT ONBOARDING / REGISTRATION
              </p>
              <h1 className="text-lg sm:text-xl font-bold text-zinc-100">
                Complete Your Project Registration
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Lengkapi informasi berikut untuk kebutuhan administrasi proyek, verifikasi identitas, registrasi domain, dan penyusunan dokumen kerja sama.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <p className="flex-1">{errorMsg}</p>
              </div>
            )}

            {/* 01. Personal Information */}
            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">
                    01. Personal Information
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Identitas pihak yang melakukan pemesanan.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
                  Required
                </span>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nama lengkap sesuai identitas
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Email aktif
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+62xxxxxxxxxxx"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Alamat domisili
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Alamat lengkap sesuai kebutuhan administrasi"
                    value={formData.domicile_address}
                    onChange={(e) => setFormData({ ...formData, domicile_address: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 02. Business Information */}
            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  02. Business Information
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
                  Required
                </span>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nama bisnis / brand
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama bisnis"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-2">
                    Status kepemilikan bisnis
                  </label>
                  <div className="space-y-2">
                    {[
                      'Pemilik bisnis',
                      'Perwakilan bisnis',
                      'Individu / personal project',
                    ].map((status) => (
                      <label
                        key={status}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                          formData.ownership_status === status
                            ? 'bg-zinc-900 border-zinc-700 text-white'
                            : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ownership_status"
                          value={status}
                          checked={formData.ownership_status === status}
                          onChange={(e) => setFormData({ ...formData, ownership_status: e.target.value })}
                          className="w-4 h-4 text-emerald-500 bg-zinc-900 border-zinc-700 focus:ring-emerald-500"
                        />
                        <span>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nama badan usaha (jika ada)
                  </label>
                  <input
                    type="text"
                    placeholder="PT / CV / lainnya (opsional)"
                    value={formData.legal_entity}
                    onChange={(e) => setFormData({ ...formData, legal_entity: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Alamat bisnis
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Alamat bisnis"
                    value={formData.business_address}
                    onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 03. Domain Registration */}
            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  03. Domain Registration
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Conditional
                </span>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nama domain yang akan digunakan
                  </label>
                  <input
                    type="text"
                    placeholder="contoh.com"
                    value={formData.domain_name}
                    onChange={(e) => setFormData({ ...formData, domain_name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-2">
                    Apakah domain akan didaftarkan menggunakan identitas Anda?
                  </label>
                  <div className="space-y-2">
                    {[
                      'Ya, menggunakan identitas saya',
                      'Tidak, ada pemilik domain lain',
                      'Saya sudah memiliki domain',
                    ].map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                          formData.domain_identity_option === opt
                            ? 'bg-zinc-900 border-zinc-700 text-white'
                            : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="domain_identity_option"
                          value={opt}
                          checked={formData.domain_identity_option === opt}
                          onChange={(e) => setFormData({ ...formData, domain_identity_option: e.target.value })}
                          className="w-4 h-4 text-emerald-500 bg-zinc-900 border-zinc-700 focus:ring-emerald-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Registrar pilihan (jika sudah ada)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: DomaiNesia"
                    value={formData.domain_registrar}
                    onChange={(e) => setFormData({ ...formData, domain_registrar: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 04. Business Declaration */}
            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  04. Business Declaration
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
                  Required
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  {
                    key: 'declaration_identity_correct',
                    label: 'Saya menyatakan bahwa informasi identitas dan bisnis yang diberikan adalah benar.',
                  },
                  {
                    key: 'declaration_authority',
                    label: 'Saya merupakan pemilik atau pihak yang memiliki kewenangan untuk memesan dan mengelola proyek ini.',
                  },
                  {
                    key: 'declaration_liability',
                    label: 'Saya bertanggung jawab atas legalitas produk, layanan, konten, dan aktivitas operasional bisnis.',
                  },
                  {
                    key: 'declaration_scope_understanding',
                    label: 'Saya memahami bahwa Stack.byAlif bertindak sebagai penyedia jasa pengembangan website sesuai ruang lingkup perjanjian.',
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(formData as any)[item.key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [item.key]: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-emerald-500 bg-zinc-900 border-zinc-700 focus:ring-emerald-500"
                    />
                    <span className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed pt-2">
                Data akan digunakan untuk administrasi proyek, verifikasi, dan kebutuhan registrasi domain sesuai kebijakan privasi Stack.byAlif.
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-6 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                    <span>Memproses & Menyimpan Data...</span>
                  </>
                ) : (
                  <span>Submit Registration</span>
                )}
              </button>

              <p className="text-center text-[10px] text-zinc-600 pt-1">
                Sistem keamanan terenkripsi Stack.byAlif • Hak Cipta Dilindungi Hukum
              </p>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>STACK.BYALIF — Website Development • E-Commerce • Business Systems</span>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/agreement" className="hover:text-emerald-400 transition-colors">
              Portal Kontrak
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
