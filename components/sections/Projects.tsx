'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, stagger } from '@/lib/motion';
import { ExternalLink, GitFork, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '@/data';
import { useLanguage } from '@/context/LanguageContext';

const projectColors: Record<number, string> = {
  0: 'from-[#38BDF8]/20 to-[#818CF8]/20',
  1: 'from-[#F472B6]/20 to-[#818CF8]/20',
  2: 'from-[#34D399]/20 to-[#38BDF8]/20',
  3: 'from-[#FBBF24]/20 to-[#F472B6]/20',
  4: 'from-[#818CF8]/20 to-[#38BDF8]/20',
  5: 'from-[#38BDF8]/20 to-[#34D399]/20',
};

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { lang, t } = useLanguage();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section id="projects" className="section-pad">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-14"
        >
          <div>
            <motion.span
              variants={fadeUp}
              className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3"
            >
              {t('projects.subtitle')}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-black tracking-tight text-white"
            >
              {t('projects.title1')} <br />
              <span className="gradient-text">{t('projects.title2')}</span>
            </motion.h2>
          </div>
        </motion.div>

        {/* Mobile View: Single-Card Animated Carousel */}
        <div className="block md:hidden">
          <div className="relative">
            <AnimatePresence mode="wait">
              {projects.map((project, index) => {
                if (index !== currentIndex) return null;
                return (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
                  >
                    {/* Thumbnail */}
                    <Link href={`/projects/${project.slug}`} className="block">
                      <div className={`relative h-44 bg-gradient-to-br ${projectColors[index]} overflow-hidden`}>
                        {project.thumbnail ? (
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl opacity-30">
                              {['📊', '🛍️', '🏢', '🚀', '👥', '🍽️'][index]}
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-[#38BDF8] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                          {lang === 'en' ? `Project #${index + 1} of ${projects.length}` : `Project #${index + 1} dari ${projects.length}`}
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex flex-col">
                      <Link href={`/projects/${project.slug}`}>
                        <h3 className="font-bold text-white text-base mb-2">{project.title}</h3>
                      </Link>
                      <p className="text-[#94A3B8] text-xs leading-relaxed mb-4">{project.shortDesc}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium bg-white/5 text-[#CBD5E1] px-2 py-0.5 rounded-full border border-white/8"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/8">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="flex-1 text-center text-xs font-semibold bg-[#38BDF8]/10 text-[#38BDF8] px-3 py-2 rounded-lg"
                        >
                          {t('projects.btnCaseStudy')}
                        </Link>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-medium border border-white/10 text-[#94A3B8] px-3 py-2 rounded-lg"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {t('projects.btnLive')}
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-medium border border-white/10 text-[#94A3B8] px-3 py-2 rounded-lg"
                          >
                            <GitFork className="w-3 h-3" />
                            {t('projects.btnCode')}
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-between mt-5 px-1">
            <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
              {projects.map((_, idx) => (
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
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-5 h-5 text-[#94A3B8]" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 hover:bg-[#38BDF8] flex items-center justify-center text-white hover:text-[#0F172A] active:scale-95 transition-all"
                aria-label="Next Project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop View: Grid (3 columns) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <div
              key={project.slug}
              className="group glass rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail */}
              <Link href={`/projects/${project.slug}`} className="block">
                <div className={`relative h-44 bg-gradient-to-br ${projectColors[i]} overflow-hidden`}>
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-30">
                        {['📊', '🛍️', '🏢', '🚀', '👥', '🍽️'][i]}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium bg-black/40 backdrop-blur-sm text-[#94A3B8] px-2 py-0.5 rounded-full border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <Link href={`/projects/${project.slug}`}>
                  <h3 className="font-bold text-white text-base mb-2 group-hover:text-[#38BDF8] transition-colors">
                    {project.title}
                  </h3>
                </Link>
                <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed mb-4 flex-1">
                  {project.shortDesc}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex-1 text-center text-xs font-semibold bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] px-3 py-2 rounded-lg transition-colors"
                  >
                    {t('projects.btnCaseStudy')}
                  </Link>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium border border-white/10 hover:border-white/25 text-[#94A3B8] hover:text-white px-3 py-2 rounded-lg transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {t('projects.btnLive')}
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium border border-white/10 hover:border-white/25 text-[#94A3B8] hover:text-white px-3 py-2 rounded-lg transition-all"
                    >
                      <GitFork className="w-3 h-3" />
                      {t('projects.btnCode')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}