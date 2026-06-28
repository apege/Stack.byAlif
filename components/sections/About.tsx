'use client';
import { motion } from 'framer-motion';
import { fadeUp, slideRight, stagger } from '@/lib/motion';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const highlights = [
  'Websites & Landing Pages',
  'Web Applications',
  'Custom Software Development',
  'Custom Business Systems',
  'Dashboard & Admin Panels',
  'Support & Maintenance',
];

export default function About() {
  return (
    <section id="about" className="section-pad">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Photo */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#38BDF8]/15 to-[#818CF8]/10 rounded-3xl blur-3xl" />

              {/* Photo placeholder */}
              <div className="relative glass rounded-2xl overflow-hidden aspect-[4/5] max-w-sm mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 via-transparent to-[#818CF8]/10" />
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#38BDF8]/30 to-[#818CF8]/30 flex items-center justify-center border border-white/10">
                    <Image 
                    src="/images/me.png"
                    alt="Apege - Full Stack Web Developer"
                    fill 
                    sizes="(max-width: 384px) 100vw, 384px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  </div>
                  <div className="text-center px-6">
                    <div className="text-sm font-semibold text-white mb-1">Apege</div>
                    <div className="text-xs text-[#94A3B8]">Full Stack Web Developer</div>
                  </div>
                </div>

                {/* Experience badge */}
                <div className="absolute bottom-4 right-4 glass rounded-xl px-3 py-2 border border-white/10">
                  <div className="text-xs font-bold text-white">1+ Years</div>
                  <div className="text-[10px] text-[#94A3B8]">Experience</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="mb-3">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase">
                About Me
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight"
            >
              Full Stack Developer{' '}
              <span className="gradient-text">Building Solutions, Not Just Websites</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-[#94A3B8] leading-relaxed mb-4">
              I'm a Full Stack Developer based in Indonesia who enjoys turning ideas into 
              digital products. From company websites and e-commerce platforms to custom 
              business systems, I build solutions that help businesses work smarter and grow online.
            </motion.p>

            <motion.p variants={fadeUp} className="text-[#94A3B8] leading-relaxed mb-8">
              I focus on creating fast, modern, and reliable applications with clean user experiences and scalable architecture. My goal is simple: build digital products that are useful, maintainable, and deliver real value.
            </motion.p>

            {/* Highlights */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                  <span className="text-sm text-[#CBD5E1]">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
