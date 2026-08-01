'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import { FileSpreadsheet, DatabaseZap, BarChart3, Layers, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const iconMap: Record<string, React.ElementType> = {
  FileSpreadsheet,
  DatabaseZap,
  BarChart3,
  Layers,
};

const businessProblemsData = {
  id: [
    {
      id: 1,
      icon: 'FileSpreadsheet',
      problem: 'Operasional Masih Manual',
      description: 'Pencatatan pesanan, inventaris, atau laporan bisnis masih menggunakan spreadsheet/kertas yang memakan waktu dan rawan kesalahan.',
      solution: 'Pengembangan sistem manajemen otomatisasi internal yang terpusat dan efisien.',
    },
    {
      id: 2,
      icon: 'DatabaseZap',
      problem: 'Data Bisnis Tidak Terstruktur',
      description: 'Informasi pelanggan, stok barang, dan riwayat transaksi tersebar di banyak tempat sehingga sulit dianalisis.',
      solution: 'Database terintegrasi dengan dashboard analitik real-time untuk pengambilan keputusan cepat.',
    },
    {
      id: 3,
      icon: 'BarChart3',
      problem: 'Sulit Monitoring Transaksi',
      description: 'Pemilik bisnis kesulitan memantau arus kas, status pesanan harian, dan performa tim secara real-time.',
      solution: 'Aplikasi dashboard admin modern dengan notifikasi otomatis dan laporan komprehensif.',
    },
    {
      id: 4,
      icon: 'Layers',
      problem: 'Membutuhkan Sistem Custom',
      description: 'Aplikasi pasaran (SaaS siap pakai) terlalu mahal, tidak fleksibel, atau tidak sesuai dengan alur kerja spesifik bisnis Anda.',
      solution: 'Software kustom tailor-made yang dibangun khusus sesuai skala & kebutuhan proses bisnis Anda.',
    },
  ],
  en: [
    {
      id: 1,
      icon: 'FileSpreadsheet',
      problem: 'Manual Operations',
      description: 'Order tracking, inventory, or business reports are managed manually with spreadsheets or paper, consuming time and error-prone.',
      solution: 'Development of a centralized, efficient internal automation management system.',
    },
    {
      id: 2,
      icon: 'DatabaseZap',
      problem: 'Unstructured Business Data',
      description: 'Customer data, stock levels, and transaction histories are scattered across tools, making business analysis difficult.',
      solution: 'Integrated database with real-time analytics dashboard for fast decision making.',
    },
    {
      id: 3,
      icon: 'BarChart3',
      problem: 'Difficult Transaction Tracking',
      description: 'Business owners struggle to monitor daily cash flow, order statuses, and team performance in real-time.',
      solution: 'Modern admin dashboard application with automated notifications and comprehensive reports.',
    },
    {
      id: 4,
      icon: 'Layers',
      problem: 'Need Custom Software',
      description: 'Off-the-shelf SaaS apps are too expensive, inflexible, or unfit for your unique operational workflow.',
      solution: 'Tailor-made custom software built specifically to fit your business scale & workflow.',
    },
  ],
};

export default function BusinessProblems() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { lang, t } = useLanguage();
  const problems = businessProblemsData[lang] || businessProblemsData.id;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % problems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + problems.length) % problems.length);
  };

  return (
    <section id="problems" className="section-pad relative overflow-hidden bg-[#0B0F17]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#38BDF8]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
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
            {t('problems.subtitle')}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight"
          >
            {t('problems.title1')} <span className="gradient-text">{t('problems.title2')}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#94A3B8] mt-4 max-w-xl mx-auto text-sm md:text-base">
            {t('problems.desc')}
          </motion.p>
        </motion.div>

        {/* Mobile View: Professional Full-Card Carousel */}
        <div className="block md:hidden">
          <div className="relative">
            <AnimatePresence mode="wait">
              {problems.map((item, index) => {
                if (index !== currentIndex) return null;
                const Icon = iconMap[item.icon];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between"
                  >
                    {/* Header: Icon & Title */}
                    <div>
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center flex-shrink-0">
                          {Icon && <Icon className="w-5 h-5 text-[#38BDF8]" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider block">
                            {lang === 'en' ? `Problem #${index + 1} of ${problems.length}` : `Masalah #${index + 1} Dari ${problems.length}`}
                          </span>
                          <h3 className="font-bold text-white text-base leading-snug">{item.problem}</h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[#94A3B8] text-xs leading-relaxed mb-5">
                        {item.description}
                      </p>
                    </div>

                    {/* Solution Footer Block */}
                    <div className="pt-3.5 border-t border-white/8 bg-[#38BDF8]/5 -mx-6 -mb-6 p-4 rounded-b-2xl">
                      <div className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider mb-1">
                        {t('problems.solutionLbl')}
                      </div>
                      <p className="text-xs text-white font-medium leading-relaxed">
                        {item.solution}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Slider Bottom Controls */}
          <div className="flex items-center justify-between mt-5 px-1">
            <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
              {problems.map((_, idx) => (
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
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#38BDF8]/40 flex items-center justify-center text-white active:scale-95 transition-all"
                aria-label="Previous problem"
              >
                <ChevronLeft className="w-5 h-5 text-[#94A3B8]" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 hover:bg-[#38BDF8] flex items-center justify-center text-white hover:text-[#0F172A] active:scale-95 transition-all"
                aria-label="Next problem"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop View: Grid (2 columns) */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {problems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={item.id}
                className="glass rounded-2xl p-7 border border-white/8 hover:border-[#38BDF8]/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#38BDF8] transition-colors duration-300">
                    {Icon && <Icon className="w-6 h-6 text-[#38BDF8] group-hover:text-[#0F172A] transition-colors" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">{item.problem}</h3>
                    <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-[#38BDF8] font-medium">
                      <span className="flex-shrink-0">{t('problems.solutionLbl')}</span>
                      <span className="text-[#CBD5E1]">{item.solution}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 md:mt-12 text-center"
        >
          <a
            href="https://wa.me/62895412735876?text=Halo%20Stack.byAlif,%20bisnis%20saya%20memiliki%20kendala%20operasional%20yang%20ingin%20didiskusikan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/5 border border-white/10 hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/10 px-6 py-3 rounded-xl transition-all"
          >
            {t('problems.ctaMore')}
            <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}




