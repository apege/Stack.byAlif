'use client';
import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import { workProcess } from '@/data';

export default function WorkProcess() {
  return (
    <section className="section-pad">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3"
          >
            Process
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight">
            How We Work{' '}
            <span className="gradient-text">Together</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#94A3B8] mt-4 max-w-xl mx-auto">
            A clear, structured process that ensures every project is delivered on time, on
            budget, and above expectations.
          </motion.p>
        </motion.div>

        {/* Timeline — desktop horizontal, mobile vertical */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#38BDF8]/30 to-transparent" />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
          >
            {workProcess.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative flex flex-col items-center text-center lg:items-center"
              >
                {/* Step dot */}
                <div className="relative z-10 mb-5">
                  <div className="w-16 h-16 rounded-2xl glass border border-[#38BDF8]/20 flex items-center justify-center group hover:border-[#38BDF8]/50 hover:bg-[#38BDF8]/5 transition-all duration-300">
                    <span className="text-2xl font-black gradient-text">{step.step}</span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{step.description}</p>

                {/* Mobile connector */}
                {i < workProcess.length - 1 && (
                  <div className="lg:hidden mt-6 w-px h-8 bg-gradient-to-b from-[#38BDF8]/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
