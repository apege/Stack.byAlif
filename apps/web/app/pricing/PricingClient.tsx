'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  pricingPackagesData,
  addonServicesData,
  pricingTermsData,
  getWhatsAppPricingUrl,
  getGeneralWhatsAppPricingUrl,
  PricingItem,
} from '@/data/pricingData';
import {
  Check,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Layers,
  ChevronDown,
  Cpu,
  BadgeCheck,
  Clock,
  MessageCircle,
} from 'lucide-react';

export default function PricingClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'profil' | 'commerce' | 'digital'>('all');
  const [openTermIndex, setOpenTermIndex] = useState<number | null>(null);

  const filteredPackages =
    activeTab === 'all'
      ? pricingPackagesData
      : pricingPackagesData.filter((pkg) => pkg.category === activeTab);

  const toggleTerm = (index: number) => {
    setOpenTermIndex((prev) => (prev === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/20 selection:text-blue-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 bg-grid-pattern relative overflow-hidden border-b border-slate-200/80">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
              TRANSPARENT INVESTMENT · STACK.BYALIF
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-8"
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1] mb-6">
                Paket Solusi Website &amp; <br className="hidden sm:inline" />
                <span className="italic font-serif font-normal text-blue-600 underline decoration-blue-200 decoration-wavy decoration-1">
                  Sistem Bisnis Digital.
                </span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
                Solusi pembuatan website dan sistem digital untuk membantu bisnis berkembang, menjangkau lebih banyak pelanggan, dan mengelola operasional secara rapi tanpa biaya tak terduga.
              </p>
            </motion.div>

            {/* Quick Stat Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4 flex lg:justify-end"
            >
              <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm max-w-xs w-full">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Garansi &amp; Kepemilikan 100%</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                  Domain resmi atas nama Anda. Kode modern, performa tinggi, dan garansi perbaikan bug 14 hari pasca serah terima.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-10 sm:mt-14 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'Semua Paket (6)' },
              { id: 'profil', label: 'Web Profil & Usaha' },
              { id: 'commerce', label: 'Katalog & Booking' },
              { id: 'digital', label: 'Game & Produk Digital' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#061021] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid Section */}
      <section className="py-12 sm:py-20 max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          <AnimatePresence>
            {filteredPackages.map((pkg, index) => {
              const isDarkHighlight = pkg.popular;

              return (
                <motion.div
                  layout
                  key={pkg.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`rounded-2xl sm:rounded-3xl flex flex-col justify-between transition-all duration-300 relative ${
                    isDarkHighlight
                      ? 'bg-[#061021] text-white border-2 border-blue-500/80 shadow-xl shadow-blue-950/10'
                      : 'bg-white text-slate-900 border border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md'
                  } p-6 sm:p-8`}
                >
                  {/* Top Badge (if any) */}
                  {pkg.badge && (
                    <div className="absolute -top-3 right-6">
                      <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[10px] sm:text-xs font-bold font-mono tracking-wider px-3 py-1 rounded-full uppercase shadow-md">
                        <Sparkles className="w-3 h-3" />
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  {/* Header Card */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs font-mono font-bold tracking-widest ${
                          isDarkHighlight ? 'text-blue-400' : 'text-blue-600'
                        }`}
                      >
                        {pkg.num} · {pkg.categoryLabel.toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isDarkHighlight
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Paket Resmi
                      </span>
                    </div>

                    <h3
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${
                        isDarkHighlight ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      {pkg.name}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed min-h-[44px] mb-6 ${
                        isDarkHighlight ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {pkg.target}
                    </p>

                    {/* Price Tag */}
                    <div
                      className={`pt-5 pb-6 border-t ${
                        isDarkHighlight ? 'border-slate-800' : 'border-slate-100'
                      }`}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
                            isDarkHighlight ? 'text-white' : 'text-slate-950'
                          }`}
                        >
                          {pkg.priceFormatted}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isDarkHighlight ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          / project
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <Cpu className={`w-3.5 h-3.5 ${isDarkHighlight ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span
                          className={`text-[11px] font-mono font-medium ${
                            isDarkHighlight ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {pkg.technology}
                        </span>
                      </div>
                    </div>

                    {/* Inclusions Box */}
                    <div
                      className={`p-4 rounded-xl mb-6 text-xs ${
                        isDarkHighlight
                          ? 'bg-slate-900/90 border border-slate-800 text-slate-300'
                          : 'bg-slate-50 border border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-[10px] font-mono tracking-wider uppercase mb-2 text-blue-500 flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        SUDAH TERMASUK (INCLUDE):
                      </div>
                      <ul className="space-y-1.5">
                        {pkg.includes.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold shrink-0">•</span>
                            <span className="leading-snug">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Feature Benefits List */}
                    <div className="space-y-3 mb-8">
                      <div
                        className={`text-[11px] font-mono font-bold tracking-wider uppercase ${
                          isDarkHighlight ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        FITUR &amp; BENEFIT:
                      </div>
                      <ul className="space-y-2.5">
                        {pkg.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                            <Check
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isDarkHighlight ? 'text-blue-400' : 'text-blue-600'
                              }`}
                            />
                            <span
                              className={`leading-snug ${
                                isDarkHighlight ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <a
                      href={getWhatsAppPricingUrl(pkg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 group ${
                        isDarkHighlight
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                          : 'bg-[#061021] hover:bg-slate-800 text-white shadow-sm'
                      }`}
                    >
                      <span>Pilih Paket {pkg.name}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    <p
                      className={`text-center text-[10px] mt-2.5 ${
                        isDarkHighlight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      Konsultasi langsung via WhatsApp
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Add-on Services Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-b border-slate-200/80">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block mb-2">
              FLEKSIBEL SESUAI KEBUTUHAN
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
              Add-on &amp; Layanan Tambahan
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Dapat ditambahkan ke paket mana pun sesuai kebutuhan pengembangan skala bisnis Anda. Biaya layanan pihak ketiga ditanggung oleh klien.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {addonServicesData.map((addon, index) => (
              <div
                key={index}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-blue-500/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {addon.name}
                  </h4>
                  {addon.desc && (
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{addon.desc}</p>
                  )}
                </div>
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Biaya Investasi:</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-950 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {addon.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ketentuan Umum / Terms & Policy Accordion Section */}
      <section className="py-16 sm:py-24 bg-grid-pattern">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            {/* Left Header */}
            <div className="lg:col-span-4">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block mb-2">
                TRANSPARANSI KERJA SAMA
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
                Ketentuan Umum Pengerjaan
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed mb-6">
                Kami menjunjung tinggi kejelasan alur kerja dan transparansi agar kedua belah pihak merasa aman dan puas dengan hasil akhir.
              </p>

              <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Jadwal Pengerjaan Rata-Rata</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Paket Starter &amp; UMKM berkisar 3–7 hari kerja. Paket dinamis (Katalog, Booking, Top-up) berkisar 7–14 hari kerja setelah materi lengkap diterima.
                </p>
              </div>
            </div>

            {/* Right Accordion List */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              {pricingTermsData.map((term, index) => {
                const isOpen = openTermIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm transition-colors"
                  >
                    <button
                      onClick={() => toggleTerm(index)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/80 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-xs sm:text-sm font-mono font-bold text-blue-600 bg-blue-50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                          {term.num}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900">
                          {term.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-600 space-y-2.5">
                            {term.points.map((point, pIndex) => (
                              <div key={pIndex} className="flex items-start gap-2.5">
                                <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                                <span className="leading-relaxed">{point}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Custom Project Callout */}
      <section className="py-16 sm:py-20 bg-[#061021] text-white relative overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12 text-center">
          <div className="max-w-2xl mx-auto space-y-5">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
              CUSTOM SOFTWARE &amp; ENTERPRISE
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Punya Kebutuhan Sistem Khusus?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
              Jika skala bisnis Anda membutuhkan arsitektur custom, multi-cabang POS, ERP, WMS, atau integrasi API kompleks di luar paket di atas, mari diskusikan solusinya bersama kami.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getGeneralWhatsAppPricingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg shadow-blue-600/30 transition-all group"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Kebutuhan Custom</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 font-medium text-xs sm:text-sm px-6 py-3.5 rounded-full transition-colors"
              >
                <span>Lihat Portofolio Karya</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
