'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

const stats = [
  { value: '5+', label: 'Projects Delivered' },
  { value: '5+', label: 'Happy Clients' },
  { value: '1+', label: 'Years Experience' },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden noise-bg"
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
                <span className="text-[#38BDF8] text-xs font-medium tracking-wide">
                  Available for Freelance
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              Building Modern{' '}
              <span className="gradient-text">Websites & Apps</span>{' '}
              That Help{' '}
              <br />
              <span className="text-white">Businesses Grow</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-xl"
            >
              I design and develop fast, modern, and scalable websites, applications, 
              and custom systems that help businesses improve efficiency, build credibility, and grow faster.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-12">
              <Link
                href="#projects"
                className="flex items-center gap-2 bg-[#38BDF8] hover:bg-[#29a8e0] text-[#0F172A] font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] text-sm"
              >
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#contact"
                className="flex items-center gap-2 border border-white/10 hover:border-white/25 text-white px-6 py-3 rounded-lg transition-all duration-200 text-sm bg-white/5 hover:bg-white/8"
              >
                Contact Me
                <ArrowUpRight className="w-4 h-4 text-[#94A3B8]" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="group">
                  <div className="text-3xl font-black text-white group-hover:gradient-text transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Dashboard mockup */}
            <div className="relative w-full max-w-lg">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/20 to-[#818CF8]/20 rounded-2xl blur-3xl" />

              {/* Main card */}
              <div className="relative glass rounded-2xl p-6 border border-white/10">
                {/* Top bar */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <div className="w-3 h-3 rounded-full bg-green-400/60" />
                  <div className="flex-1 mx-4 h-6 bg-white/5 rounded-md flex items-center px-3">
                    <span className="text-[10px] text-[#94A3B8]">stackbyalif.my.id/dashboard</span>
                  </div>
                </div>

                {/* Metric row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Conversion', value: '8.4%', up: true },
                    { label: 'Revenue', value: '$24.5k', up: true },
                    { label: 'Visitors', value: '12.3k', up: false },
                  ].map((m, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] text-[#94A3B8] mb-1">{m.label}</div>
                      <div className="text-sm font-bold text-white">{m.value}</div>
                      <div className={`text-[10px] mt-0.5 ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.up ? '↑ 12%' : '↓ 3%'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="bg-white/5 rounded-xl p-4 mb-4 h-28 flex items-end gap-1.5">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 75, 85, 60, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.8 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
                      className="flex-1 rounded-sm"
                      style={{
                        background: i === 11 ? '#38BDF8' : 'rgba(56,189,248,0.25)',
                      }}
                    />
                  ))}
                </div>

                {/* Project cards */}
                <div className="space-y-2">
                  {[
                    { title: 'E-Commerce Revamp', status: 'Live', color: 'emerald' },
                    { title: 'SaaS Dashboard', status: 'Building', color: 'sky' },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-xs text-white font-medium">{p.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        p.color === 'emerald'
                          ? 'bg-emerald-400/15 text-emerald-400'
                          : 'bg-sky-400/15 text-sky-400'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating rating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 -left-5 glass rounded-xl px-4 py-3 border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#38BDF8] text-[#38BDF8]" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white">5.0 Rating</span>
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-0.5">from 5+ happy clients</div>
              </motion.div>

              {/* Floating speed badge */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-4 glass rounded-xl px-4 py-3 border border-white/10 shadow-xl"
              >
                <div className="text-xs font-bold text-white">
                  <span className="text-[#38BDF8]">95+</span> Lighthouse
                </div>
                <div className="text-[10px] text-[#94A3B8]">Performance Score</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
