'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      num: t('services.item1Num'),
      title: t('services.item1Title'),
      desc: t('services.item1Desc'),
    },
    {
      num: t('services.item2Num'),
      title: t('services.item2Title'),
      desc: t('services.item2Desc'),
    },
    {
      num: t('services.item3Num'),
      title: t('services.item3Title'),
      desc: t('services.item3Desc'),
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 md:py-36 bg-[#061021] text-white relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header Grid: Tag & Big Title */}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start mb-12 sm:mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-400 uppercase">
              {t('services.tag')}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <h2 className="fluid-section-title font-extrabold text-white tracking-tight">
              {t('services.title')}
            </h2>
          </motion.div>
        </div>

        {/* List Layanan (01, 02, 03) */}
        <div className="divide-y divide-slate-800/80 border-t border-b border-slate-800/80">
          {services.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="py-6 sm:py-8 md:py-12 grid md:grid-cols-12 gap-3 sm:gap-6 items-baseline group hover:bg-slate-900/40 transition-colors px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-lg"
            >
              {/* Number - 2 cols */}
              <div className="md:col-span-2">
                <span className="text-xs sm:text-sm font-bold text-blue-500 font-mono">
                  {item.num}
                </span>
              </div>

              {/* Title - 5 cols */}
              <div className="md:col-span-5">
                <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Description - 5 cols */}
              <div className="md:col-span-5">
                <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Callout to Dedicated Pricing Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">
              TRANSPARAN &amp; TERJANGKAU
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Butuh paket siap pakai untuk usaha atau bisnis Anda?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Lihat 6 paket solusi website &amp; sistem bisnis Stack.byAlif mulai dari Rp349.000 dengan domain &amp; deployment siap pakai.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm px-5 py-3 rounded-full transition-all duration-200 shrink-0 group shadow-sm"
          >
            <span>Lihat Paket &amp; Harga</span>
            <ArrowUpRight className="w-4 h-4 text-blue-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}