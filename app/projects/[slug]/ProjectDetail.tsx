'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, GitFork, ArrowRight } from 'lucide-react';
import { Project } from '@/types';
import { fadeUp, stagger } from '@/lib/motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Props {
  project: Project;
  nextProject: Project;
}

const sections = [
  { key: 'overview', label: 'Overview' },
  { key: 'challenge', label: 'Challenge' },
  { key: 'process', label: 'Process' },
  { key: 'results', label: 'Results' },
] as const;

export default function ProjectDetail({ project, nextProject }: Props) {
  return (
    <main>
      <Navbar />

      <div className="pt-28 pb-20 max-w-[1280px] mx-auto px-6">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium bg-[#38BDF8]/10 text-[#38BDF8] px-3 py-1 rounded-full border border-[#38BDF8]/20"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            {project.title}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[#94A3B8] text-lg max-w-2xl mb-6">
            {project.description}
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#38BDF8] hover:bg-[#29a8e0] text-[#0F172A] font-bold px-5 py-2.5 rounded-lg transition-all text-sm hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-white/10 hover:border-white/25 text-white px-5 py-2.5 rounded-lg transition-all text-sm bg-white/5"
              >
                <GitFork className="w-4 h-4" /> View Code
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Thumbnail Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative w-full h-64 md:h-96 glass rounded-2xl mb-16 overflow-hidden border border-white/8"
        >
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/15 to-[#818CF8]/15 flex items-center justify-center">
              <span className="text-8xl opacity-20">🖥️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent" />
        </motion.div>

        {/* Case Study Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {sections.map(({ key, label }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-black text-[#38BDF8] bg-[#38BDF8]/10 w-7 h-7 rounded-lg flex items-center justify-center">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-xl font-bold text-white">{label}</h2>
                </div>
                <p className="text-[#94A3B8] leading-relaxed">{project[key]}</p>
              </motion.div>
            ))}

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-black text-[#38BDF8] bg-[#38BDF8]/10 w-7 h-7 rounded-lg flex items-center justify-center">
                    05
                  </span>
                  <h2 className="text-xl font-bold text-white">Gallery</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="relative h-48 rounded-xl overflow-hidden border border-white/8">
                      <Image
                        src={img}
                        alt={`${project.title} screenshot ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="glass rounded-2xl p-5 border border-white/8 sticky top-24">
              <h3 className="font-bold text-white text-sm mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white/8 text-[#CBD5E1] px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Project */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 pt-12 border-t border-white/8"
        >
          <p className="text-xs text-[#94A3B8] mb-2 font-semibold tracking-wider uppercase">Next Project</p>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group flex items-center justify-between glass rounded-2xl p-6 border border-white/8 hover:border-white/20 transition-all hover:-translate-y-0.5"
          >
            <div>
              <h3 className="font-bold text-white text-xl group-hover:text-[#38BDF8] transition-colors">
                {nextProject.title}
              </h3>
              <p className="text-[#94A3B8] text-sm mt-1">{nextProject.shortDesc}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-[#94A3B8] group-hover:text-[#38BDF8] group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}