'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import { Check, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const pricingPackagesData = {
  id: [
    {
      id: 1,
      name: 'Website Starter',
      price: 'Rp 500.000',
      description: 'Cocok untuk UMKM & bisnis yang membutuhkan kehadiran digital profesional dan meningkatkan kredibilitas.',
      features: [
        'Landing Page / Company Profile',
        'Desain Responsive & Modern',
        'Integrasi WhatsApp CTA',
        'SEO Basic & Optimasi Kecepatan',
        'Hosting & Domain Setup',
        'Revisi & Dukungan Teknis',
      ],
      recommendedFor: 'UMKM, Profil Perusahaan, Landing Page Promo',
    },
    {
      id: 2,
      name: 'Business System',
      badge: 'Paling Populer',
      isPopular: true,
      price: 'Rp 1.500.000',
      description: 'Sistem internal kustom untuk mengelola operasional, transaksi, inventaris, dan data bisnis terpusat.',
      features: [
        'Custom Dashboard Admin & User',
        'Manajemen Data / WMS / CRM / POS',
        'Notifikasi WhatsApp & Email',
        'Fitur Export Laporan (PDF/Excel)',
        'Hak Akses Multi-User / Role',
        'Garansi Pemeliharaan 3 Bulan',
      ],
      recommendedFor: 'Perusahaan Kecil-Menengah, Yayasan, Retail',
    },
    {
      id: 3,
      name: 'Custom Application',
      price: 'Rp 3.000.000',
      description: 'Solusi perangkat lunak lengkap dan kompleks yang disesuaikan penuh dengan proses bisnis unik Anda.',
      features: [
        'Arsitektur Software Scalable',
        'Integrasi Payment Gateway / API',
        'Aplikasi Web & Mobile Dynamic',
        'Keamanan Data & Backup Otomatis',
        'Dokumentasi Lengkap & SOK',
        'Dukungan Prioritas & Maintenance',
      ],
      recommendedFor: 'Startup, E-Commerce Kompleks, Platform SaaS',
    },
  ],
  en: [
    {
      id: 1,
      name: 'Website Starter',
      price: '$35 / Rp 500.000',
      description: 'Ideal for SMEs & businesses needing a professional digital presence to build trust & credibility.',
      features: [
        'Landing Page / Company Profile',
        'Responsive & Modern Design',
        'WhatsApp CTA Integration',
        'Basic SEO & Speed Optimization',
        'Hosting & Domain Setup',
        'Revisions & Technical Support',
      ],
      recommendedFor: 'SMEs, Company Profile, Promo Landing Page',
    },
    {
      id: 2,
      name: 'Business System',
      badge: 'Most Popular',
      isPopular: true,
      price: '$100 / Rp 1.500.000',
      description: 'Custom internal management system to streamline operations, inventory, and centralized data.',
      features: [
        'Custom Admin & User Dashboard',
        'Data / WMS / CRM / POS Management',
        'Automated WhatsApp & Email Alerts',
        'Report Export Feature (PDF/Excel)',
        'Multi-User Access & Role Control',
        '3 Months Maintenance Warranty',
      ],
      recommendedFor: 'Small-Medium Enterprises, Foundations, Retail',
    },
    {
      id: 3,
      name: 'Custom Application',
      price: '$200 / Rp 3.000.000',
      description: 'Comprehensive software solution fully tailored to your unique, complex business workflows.',
      features: [
        'Scalable Software Architecture',
        'Payment Gateway & API Integrations',
        'Dynamic Web & Mobile Applications',
        'Data Security & Automated Backups',
        'Complete Documentation & SOP',
        'Priority Technical Support & SLA',
      ],
      recommendedFor: 'Startups, Complex E-Commerce, SaaS Platforms',
    },
  ],
};

export default function Pricing() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { lang, t } = useLanguage();
  const pricingPackagesList = pricingPackagesData[lang] || pricingPackagesData.id;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % pricingPackagesList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + pricingPackagesList.length) % pricingPackagesList.length);
  };

  return (
    <section id="pricing" className="section-pad relative bg-[#111827]/40">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3"
          >
            {t('pricing.subtitle')}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
          >
            {t('pricing.title1')} <span className="gradient-text">{t('pricing.title2')}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#94A3B8] mt-4 max-w-xl mx-auto text-sm md:text-base">
            {t('pricing.desc')}
          </motion.p>
        </motion.div>

        {/* Mobile View: Single-Card Animated Carousel */}
        <div className="block md:hidden">
          <div className="relative pt-3">
            <AnimatePresence mode="wait">
              {pricingPackagesList.map((pkg, index) => {
                if (index !== currentIndex) return null;
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`relative glass rounded-2xl p-6 flex flex-col border ${
                      pkg.isPopular
                        ? 'border-[#38BDF8]/40 bg-[#38BDF8]/8 shadow-2xl shadow-[#38BDF8]/10'
                        : 'border-white/10'
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#38BDF8] text-[#0F172A] text-[10px] font-extrabold px-3 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        {pkg.badge}
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider mb-1">
                        {lang === 'en' ? `Package #${index + 1} of ${pricingPackagesList.length}` : `Paket #${index + 1} Dari ${pricingPackagesList.length}`}
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1.5">{pkg.name}</h3>
                      <p className="text-[#94A3B8] text-xs leading-relaxed">{pkg.description}</p>
                    </div>

                    <div className="mb-5 pb-5 border-b border-white/8">
                      <div className="text-[10px] text-[#94A3B8] font-medium mb-0.5">{t('pricing.startingFrom')}</div>
                      <div className="text-2xl font-black text-white">{pkg.price}</div>
                    </div>

                    {/* Features list */}
                    <div className="flex-1 mb-6">
                      <div className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">
                        {t('pricing.includes')}
                      </div>
                      <ul className="space-y-2.5">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                            <Check className="w-3.5 h-3.5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3.5 border-t border-white/5 space-y-3">
                      <div className="text-[10px] text-[#94A3B8] text-center">
                        {t('pricing.recommendedShort')} <span className="text-white font-medium">{pkg.recommendedFor}</span>
                      </div>
                      <a
                        href={`https://wa.me/62895412735876?text=Halo%20Stack.byAlif,%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(pkg.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${
                          pkg.isPopular
                            ? 'bg-[#38BDF8] text-[#0F172A]'
                            : 'bg-white/5 text-white border border-white/10'
                        }`}
                      >
                        {t('pricing.cta')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-between mt-5 px-1">
            <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
              {pricingPackagesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-8 bg-[#38BDF8]' : 'w-2 bg-white/20'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all"
                aria-label="Previous Package"
              >
                <ChevronLeft className="w-5 h-5 text-[#94A3B8]" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 hover:bg-[#38BDF8] flex items-center justify-center text-white hover:text-[#0F172A] active:scale-95 transition-all"
                aria-label="Next Package"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop View: Grid (3 columns) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch">
          {pricingPackagesList.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative glass rounded-2xl p-6 sm:p-7 flex flex-col transition-all duration-300 ${
                pkg.isPopular
                  ? 'border-[#38BDF8]/40 bg-[#38BDF8]/8 shadow-2xl shadow-[#38BDF8]/10 md:-translate-y-2'
                  : 'border-white/8 hover:border-white/20'
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#38BDF8] text-[#0F172A] text-xs font-extrabold px-3.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  {pkg.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2">{pkg.name}</h3>
                <p className="text-[#94A3B8] text-xs leading-relaxed min-h-[36px]">
                  {pkg.description}
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-white/8">
                <div className="text-xs text-[#94A3B8] font-medium mb-1">{t('pricing.startingFrom')}</div>
                <div className="text-2xl sm:text-3xl font-black text-white">{pkg.price}</div>
              </div>

              {/* Features list */}
              <div className="flex-1 mb-8">
                <div className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                  {t('pricing.includes')}
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-[#CBD5E1]">
                      <Check className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="text-[11px] text-[#94A3B8] text-center">
                  {t('pricing.recommended')} <span className="text-white font-medium">{pkg.recommendedFor}</span>
                </div>
                <a
                  href={`https://wa.me/62895412735876?text=Halo%20Stack.byAlif,%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(pkg.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    pkg.isPopular
                      ? 'bg-[#38BDF8] hover:bg-[#29a8e0] text-[#0F172A] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {t('pricing.cta')}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-xs text-[#64748B] mt-8 md:mt-10"
        >
          {t('pricing.note')}
        </motion.p>
      </div>
    </section>
  );
}




