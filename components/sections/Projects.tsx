'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { projects } from '@/data';

export default function Projects() {
  const { t } = useLanguage();

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-36 bg-grid-pattern border-t border-slate-200/80">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Section Header Grid */}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-500 uppercase">
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
            <h2 className="fluid-section-title font-extrabold text-slate-950 tracking-tight">
              {t('projects.title')}
            </h2>
          </motion.div>
        </div>

        {/* Selected Work Cards (Limit 3 items) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project, index) => {
            const num = String(index + 1).padStart(2, '0');
            const cardBg = index % 3 === 0 ? 'bg-slate-200/60' : index % 3 === 1 ? 'bg-[#061021]' : 'bg-sky-200/80';
            const isDark = index % 3 === 1;

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link href={`/projects/${project.slug}`} className="flex flex-col group cursor-pointer h-full">
                  {/* Card Outer Container */}
                  <div
                    className={`relative h-[225px] md:h-[245px] rounded-xl ${cardBg} pt-4 px-6 flex flex-col justify-between overflow-hidden shadow-sm transition-transform duration-300 group-hover:-translate-y-1`}
                  >
                    {/* Header: 01 / CATEGORY - Centered vertically in top space */}
                    <div className="flex items-center justify-between z-10 py-1">
                      <span
                        className={`text-[11px] font-bold tracking-wider uppercase ${
                          isDark ? 'text-white' : 'text-slate-700'
                        }`}
                      >
                        {num} / {project.tags[0] || 'SYSTEM'}
                      </span>
                    </div>

                    {/* Image Area - Full Width with Dynamic Hover Effect */}
                    <div className="absolute inset-x-0 bottom-0 top-14 overflow-hidden">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover object-top group-hover:scale-110 group-hover:-rotate-2 group-hover:translate-y-1.5 transition-all duration-700 ease-out"
                      />
                    </div>

                    {/* Arrow Button Floating at Bottom Right */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <div
                        className={`w-9 h-9 rounded-full border shadow-md ${
                          isDark
                            ? 'border-white/40 bg-[#061021]/80 backdrop-blur-sm text-white group-hover:bg-white group-hover:text-slate-950'
                            : 'border-slate-400/40 bg-white/80 backdrop-blur-sm text-slate-950 group-hover:bg-slate-950 group-hover:text-white'
                        } flex items-center justify-center transition-all duration-300`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Details Below Card */}
                  <div className="pt-5 border-t border-slate-300 pb-6 mt-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-950 leading-snug mb-2 group-hover:text-sky-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-4 text-xs font-semibold text-sky-600 group-hover:text-sky-700 flex items-center gap-1">
                      Lihat Detail Sistem →
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-full font-bold text-sm hover:bg-sky-600 transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <span>Lihat Karya Lainnya ({projects.length})</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}