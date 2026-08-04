'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Projects() {
  const { t } = useLanguage();

  const works = [
    {
      category: t('projects.item1Category'),
      title: t('projects.item1Title'),
      desc: t('projects.item1Desc'),
      bgColor: 'bg-slate-200/60',
      wireframeColor: 'border-slate-400/30 bg-slate-100/50',
    },
    {
      category: t('projects.item2Category'),
      title: t('projects.item2Title'),
      desc: t('projects.item2Desc'),
      bgColor: 'bg-[#061021]',
      textColor: 'text-white',
      wireframeColor: 'border-slate-700/50 bg-slate-900/50',
    },
    {
      category: t('projects.item3Category'),
      title: t('projects.item3Title'),
      desc: t('projects.item3Desc'),
      bgColor: 'bg-sky-200/80',
      wireframeColor: 'border-sky-400/30 bg-sky-100/50',
    },
  ];

  return (
    <section id="projects" className="py-24 md:py-36 bg-grid-pattern border-t border-slate-200/80">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Section Header Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
              {t('projects.tag')}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-950 leading-[1.08] tracking-tight">
              {t('projects.title')}
            </h2>
          </motion.div>
        </div>

        {/* 3 Columns Selected Work Cards (Persis Screenshot 3 & 4) */}
        <div className="grid md:grid-cols-3 gap-8">
          {works.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="flex flex-col group cursor-pointer"
            >
              {/* Card Thumbnail Area with wireframe mockup */}
              <div
                className={`relative h-64 md:h-72 rounded-sm ${item.bgColor} p-6 flex flex-col justify-between overflow-hidden shadow-sm transition-transform duration-300 group-hover:-translate-y-1`}
              >
                {/* Top Category Badge inside Card */}
                <span
                  className={`text-[11px] font-bold tracking-wider uppercase ${
                    item.textColor || 'text-slate-600'
                  }`}
                >
                  {item.category}
                </span>

                {/* Minimalist Studio Wireframe Preview */}
                <div
                  className={`w-full h-36 rounded border ${item.wireframeColor} p-3 flex flex-col gap-2 my-auto`}
                >
                  <div className="w-12 h-2.5 rounded bg-slate-400/40" />
                  <div className="grid grid-cols-3 gap-2 flex-1 mt-1">
                    <div className="rounded border border-slate-400/20 bg-white/10" />
                    <div className="rounded border border-slate-400/20 bg-white/10" />
                    <div className="rounded border border-slate-400/20 bg-white/10" />
                  </div>
                </div>

                {/* Diagonal Arrow Circle Button */}
                <div className="self-end mt-2">
                  <div
                    className={`w-10 h-10 rounded-full border ${
                      item.textColor
                        ? 'border-white/30 text-white group-hover:bg-white group-hover:text-slate-950'
                        : 'border-slate-400/40 text-slate-950 group-hover:bg-slate-950 group-hover:text-white'
                    } flex items-center justify-center transition-all duration-300`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Card Below Details */}
              <div className="pt-6 border-t border-b border-slate-300 pb-8 mt-6">
                <h3 className="text-xl md:text-2xl font-bold text-slate-950 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}


        </div>
      </div>
    </section>
  );
}