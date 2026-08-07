'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, Layers, ArrowRight, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { Project } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  project: Project;
  nextProject: Project;
}

export default function ProjectDetail({ project, nextProject }: Props) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      <Navbar />

      <div className="pt-32 pb-24 max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 hover:text-sky-600 uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembalikan Ke Daftar Karya
          </Link>
        </motion.div>

        {/* Title & Short Tag Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-4xl"
        >
          <span className="inline-block text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-200 uppercase mb-4">
            {project.tags[0] || 'SYSTEM SOLUTION'}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-950 leading-[1.1] tracking-tight mb-4">
            {project.title}
          </h1>
          <p className="text-slate-600 text-base md:text-xl font-normal leading-relaxed">
            {project.shortDesc}
          </p>
        </motion.div>

        {/* Top Hero Layout: Banner Left + Side Info Card Right */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Main Hero Banner (Left 8 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8 relative w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden bg-slate-200/70 border border-slate-300 shadow-sm group"
          >
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-102"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
                <Sparkles className="w-12 h-12" />
              </div>
            )}
          </motion.div>

          {/* Right Info Cards (Right 4 cols) - Light Theme Elegant */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Metadata Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-md flex flex-col justify-between gap-6">
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase block mb-1">
                    System Category
                  </span>
                  <h3 className="text-lg font-bold text-slate-950 leading-snug">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block font-medium">Tahun Pengerjaan</span>
                    <span className="text-sm font-bold text-slate-900">{project.year || '2026'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block font-medium mb-1.5">Layanan & Fitur</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-md hover:shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" /> Kunjungi Sistem Live
                </a>
              )}
            </div>

            {/* Premium CTA Contact Card */}
            <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-slate-950 text-white shadow-xl border border-slate-900">
              <div className="relative z-10 space-y-3">
                <span className="text-xs font-extrabold tracking-widest text-sky-400 uppercase block">
                  KONSULTASI SISTEM
                </span>
                <h4 className="text-xl font-bold leading-tight text-white">
                  Butuh Solusi Digital Serupa?
                </h4>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Diskusikan kebutuhan sistem dan otomatisasi operasional bisnis Anda bersama tim pakar kami.
                </p>
                <Link
                  href="/#contact"
                  className="mt-4 inline-flex items-center justify-center w-full gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 px-5 rounded-xl transition-all text-sm shadow-md"
                >
                  <MessageSquare className="w-4 h-4" /> Hubungi Stack.byAlif
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Clean & Concise Professional Description Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200/90 mb-16 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
              Ringkasan Layanan Pendampingan System
            </h2>
          </div>
          
          <div className="prose prose-slate max-w-none text-slate-700 text-base md:text-lg leading-relaxed font-normal space-y-6">
            {project.overview.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Next Project Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-10 border-t border-slate-200"
        >
          <span className="text-xs text-slate-500 font-bold tracking-widest uppercase block mb-3">
            KARYA SELANJUTNYA
          </span>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white hover:bg-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200/90 transition-all duration-300 gap-4 shadow-sm"
          >
            <div>
              <h3 className="font-bold text-slate-950 text-xl md:text-2xl group-hover:text-sky-600 transition-colors">
                {nextProject.title}
              </h3>
              <p className="text-slate-500 text-sm mt-1">{nextProject.shortDesc}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-slate-950 text-slate-700 group-hover:text-white flex items-center justify-center transition-all shrink-0">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}