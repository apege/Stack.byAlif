'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, stagger, scaleIn } from '@/lib/motion';
import { ExternalLink, GitFork, ArrowRight } from 'lucide-react';
import { projects } from '@/data';

const projectColors: Record<number, string> = {
  0: 'from-[#38BDF8]/20 to-[#818CF8]/20',
  1: 'from-[#F472B6]/20 to-[#818CF8]/20',
  2: 'from-[#34D399]/20 to-[#38BDF8]/20',
  3: 'from-[#FBBF24]/20 to-[#F472B6]/20',
  4: 'from-[#818CF8]/20 to-[#38BDF8]/20',
  5: 'from-[#38BDF8]/20 to-[#34D399]/20',
};

export default function Projects() {
  return (
    <section id="projects" className="section-pad">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <motion.span
              variants={fadeUp}
              className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3"
            >
              Featured Work
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black tracking-tight"
            >
              Projects That
              <br />
              <span className="gradient-text">Deliver Results</span>
            </motion.h2>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              variants={scaleIn}
              className="group glass rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 flex flex-col"
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
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-4 flex-1">
                  {project.shortDesc}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex-1 text-center text-xs font-semibold bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] px-3 py-2 rounded-lg transition-colors"
                  >
                    Case Study
                  </Link>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium border border-white/10 hover:border-white/25 text-[#94A3B8] hover:text-white px-3 py-2 rounded-lg transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Live
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
                      Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}