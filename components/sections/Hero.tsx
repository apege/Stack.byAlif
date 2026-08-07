'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  const pillars = [
    t('pillar.1'),
    t('pillar.2'),
    t('pillar.3'),
    t('pillar.4'),
  ];

  return (
    <section
      id="home"
      className="relative pt-28 sm:pt-36 md:pt-44 pb-0 bg-grid-pattern overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Studio Badge Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-6 sm:mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {t('hero.badge')}
          </span>
        </motion.div>

        {/* Hero Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-end mb-12 sm:mb-16 md:mb-24">
          {/* Main Title & Subtitle - 8 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <h1 className="fluid-hero-title font-extrabold text-slate-950 tracking-tight mb-6 sm:mb-8">
              {t('hero.titleMain1')} <br className="hidden sm:inline" />
              {t('hero.titleMain2')}{' '}
              <span className="italic font-serif font-normal text-blue-600 underline decoration-blue-200 decoration-wavy decoration-1">
                {t('hero.titleMain3')}
              </span>
            </h1>

            <div className="pt-6 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 max-w-3xl">
              <p className="text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed font-normal max-w-md">
                {t('hero.desc')}
              </p>
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 text-slate-950 font-semibold text-sm hover:text-blue-600 transition-colors group shrink-0"
              >
                <span>{t('hero.ctaWork')}</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Callout Box - 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 lg:pl-6 border-l-2 border-slate-950/10 lg:border-l lg:border-slate-300 pt-4 lg:pt-0"
          >
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 leading-tight">
                {t('hero.cardTitle1')}
                <span className="relative inline-block text-blue-600 italic font-serif font-normal px-1">
                  <span className="absolute inset-0 bg-blue-600/10 -rotate-1 rounded-sm" />
                  <span className="relative">{t('hero.cardTitle2')}</span>
                </span>
                {t('hero.cardTitle3')}
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed">
              {t('hero.cardDesc')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Ticker / Service Pillars Bar Full Width Soft Grey Background */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full bg-[#e9eef5]/90 backdrop-blur-sm border-t border-b border-slate-200/80 py-5 sm:py-6 md:py-8 mt-0"
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="touch-scroll-x flex md:grid md:grid-cols-4 gap-6 text-slate-700 text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap md:whitespace-normal">
            {pillars.map((pillar, index) => (
              <div key={index} className="flex items-center shrink-0 touch-snap-start">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 md:hidden" />
                <span className="hover:text-slate-950 transition-colors">{pillar}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
