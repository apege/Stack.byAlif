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
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950">
      <Navbar />

      <div className="pt-28 pb-24 max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 hover:text-sky-400 uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembalikan Ke Daftar Karya
          </Link>
        </motion.div>

        {/* Title & Short Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-4xl"
        >
          <span className="inline-block text-xs font-bold tracking-widest text-sky-400 bg-sky-500/10 px-3.5 py-1.5 rounded-full border border-sky-500/20 uppercase mb-4">
            {project.tags[0] || 'SYSTEM SOLUTION'}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4">
            {project.title}
          </h1>
          <p className="text-slate-400 text-base md:text-xl font-normal leading-relaxed">
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
            className="lg:col-span-8 relative w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl group"
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
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-700">
                <Sparkles className="w-12 h-12" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Right Info Cards (Right 4 cols) - Professional & Sleek */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Metadata Card */}
            <div className="bg-slate-900/90 rounded-2xl p-6 md:p-8 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col justify-between gap-6">
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase block mb-1">
                    System Category
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Tahun Pengerjaan</span>
                    <span className="text-sm font-bold text-white">{project.year || '2026'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium mb-1.5">Layanan & Fitur</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-semibold bg-slate-800 text-sky-300 px-2.5 py-1 rounded-md border border-slate-700"
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
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-lg hover:shadow-sky-500/25"
                >
                  <ExternalLink className="w-4 h-4" /> Kunjungi Sistem Live
                </a>
              )}
            </div>

            {/* Premium CTA Contact Card */}
            <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-xl border border-sky-400/30">
              <div className="relative z-10 space-y-3">
                <span className="text-xs font-extrabold tracking-widest text-sky-200 uppercase block">
                  KONSULTASI SISTEM
                </span>
                <h4 className="text-xl font-bold leading-tight">
                  Butuh Solusi Digital Serupa?
                </h4>
                <p className="text-xs md:text-sm text-sky-100/90 leading-relaxed">
                  Diskusikan kebutuhan sistem dan otomatisasi operasional bisnis Anda bersama tim pakar kami.
                </p>
                <Link
                  href="/#contact"
                  className="mt-4 inline-flex items-center justify-center w-full gap-2 bg-slate-950 hover:bg-slate-900 text-white font-bold py-3 px-5 rounded-xl transition-all text-sm shadow-md"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" /> Hubungi Stack.byAlif
                </Link>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Clean & Concise Professional Description Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl bg-slate-900/50 rounded-2xl p-8 md:p-12 border border-slate-800/80 mb-16 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Ringkasan Layanan Pendampingan System
            </h2>
          </div>
          
          <div className="prose prose-invert max-w-none text-slate-300 text-base leading-relaxed whitespace-pre-line font-normal space-y-4">
            {project.overview}
          </div>
        </motion.div>

        {/* Next Project Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-10 border-t border-slate-800"
        >
          <span className="text-xs text-slate-400 font-bold tracking-widest uppercase block mb-3">
            KARYA SELANJUTNYA
          </span>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/80 hover:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 hover:border-sky-500/40 transition-all duration-300 gap-4"
          >
            <div>
              <h3 className="font-bold text-white text-xl md:text-2xl group-hover:text-sky-400 transition-colors">
                {nextProject.title}
              </h3>
              <p className="text-slate-400 text-sm mt-1">{nextProject.shortDesc}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-sky-500 text-slate-300 group-hover:text-slate-950 flex items-center justify-center transition-all shrink-0">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}