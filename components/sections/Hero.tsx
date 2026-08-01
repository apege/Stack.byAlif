'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';
import { useLanguage } from '@/context/LanguageContext';

const businessFocusAreas = [
  'Website Development',
  'Custom Business System',
  'Digital Transformation',
];

export default function Hero() {
  const { t } = useLanguage();

  const stats = [
    { value: t('hero.metric3Val'), label: t('hero.metric3Lbl') },
    { value: t('hero.metric2Val'), label: t('hero.metric2Lbl') },
    { value: t('hero.metric1Val'), label: t('hero.metric1Lbl') },
  ];

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden noise-bg"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#38BDF8]/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#818CF8]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-[#38BDF8]/5 rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content — 7 cols */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative z-10 lg:col-span-7"
          >
            {/* Studio Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-[#38BDF8]/10 border border-[#38BDF8]/25 rounded-full px-4 py-1.5 backdrop-blur-sm">
                <span className="w-2 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                <span className="text-[#38BDF8] text-xs font-semibold tracking-wide uppercase">
                  {t('hero.badge')}
                </span>
              </div>
            </motion.div>

            {/* Business Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-white"
            >
              {t('hero.title1')} <br className="hidden sm:inline" />
              <span className="gradient-text">{t('hero.title2')}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              className="text-[#94A3B8] text-base md:text-lg leading-relaxed mb-8 max-w-xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Business Focus Pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5 mb-8">
              {businessFocusAreas.map((area, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-lg text-xs text-[#CBD5E1] font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{area}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="https://wa.me/62895412735876?text=Halo%20Stack.byAlif,%20saya%20ingin%20konsultasi%20mengenai%20proyek%20bisnis%20saya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#38BDF8] hover:bg-[#29a8e0] text-[#0F172A] font-bold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] text-sm"
              >
                {t('hero.ctaConsult')}
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="#projects"
                className="flex items-center gap-2 border border-white/10 hover:border-white/25 text-white font-medium px-6 py-3.5 rounded-xl transition-all duration-200 text-sm bg-white/5 hover:bg-white/8"
              >
                {t('hero.ctaProjects')}
                <ArrowUpRight className="w-4 h-4 text-[#94A3B8]" />
              </Link>
            </motion.div>

            {/* Stats / Trust metrics */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 pt-6 border-t border-white/8">
              {stats.map((stat, i) => (
                <div key={i} className="group">
                  <div className="text-xl md:text-2xl font-black text-white group-hover:text-[#38BDF8] transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>


          {/* Right Visual — Studio Interactive Solution Showcase (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-5 flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/20 to-[#818CF8]/20 rounded-3xl blur-3xl" />

              {/* Main Card — Digital Solution Dashboard */}
              <div className="relative glass rounded-2xl p-6 border border-white/12 shadow-2xl">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                  <span className="text-[11px] font-mono text-[#94A3B8] bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    stackbyalif.my.id/dashboard
                  </span>
                </div>

                {/* Main Feature Highlight */}
                <div className="bg-gradient-to-r from-[#38BDF8]/10 via-[#818CF8]/10 to-transparent p-4 rounded-xl border border-[#38BDF8]/20 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                      Custom Business System
                    </span>
                    <span className="text-[10px] bg-[#38BDF8] text-[#0F172A] font-bold px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Sistem internal kustom mengotomatiskan pengelolaan stok &amp; laporan transaksi real-time.
                  </p>
                </div>

                {/* Dashboard Metrics grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-[#94A3B8] mb-1">Efisiensi Operasional</div>
                    <div className="text-lg font-bold text-white">+60%</div>
                    <div className="text-[10px] text-emerald-400 font-medium">Otomatisasi Laporan</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-[#94A3B8] mb-1">Kecepatan System</div>
                    <div className="text-lg font-bold text-white">&lt; 0.8s</div>
                    <div className="text-[10px] text-sky-400 font-medium">Performa Tinggi</div>
                  </div>
                </div>

                {/* Live Solution List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <Zap className="w-4 h-4 text-[#38BDF8]" />
                      <span className="text-xs font-semibold text-white">E-Commerce &amp; Payment</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-medium">Integrated</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#818CF8]" />
                      <span className="text-xs font-semibold text-white">Security &amp; Maintenance</span>
                    </div>
                    <span className="text-[10px] text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded font-medium">Protected</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Business First */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 border border-white/12 shadow-2xl"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/20 flex items-center justify-center border border-[#38BDF8]/30">
                    <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Business-Value First</div>
                    <div className="text-[10px] text-[#94A3B8]">Fokus hasil &amp; dampak bisnis</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

