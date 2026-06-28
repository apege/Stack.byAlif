'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import { testimonials } from '@/data';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="section-pad bg-[#111827]/50">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3"
          >
            Testimonials
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight">
            What Clients{' '}
            <span className="gradient-text">Say</span>
          </motion.h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-8 md:p-10 text-center relative"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-[#38BDF8]/20 mx-auto mb-6" />

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#38BDF8] text-[#38BDF8]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-[#CBD5E1] text-lg leading-relaxed mb-8 italic">
                &ldquo;{testimonials[current].content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-gradient-to-br from-[#38BDF8]/30 to-[#818CF8]/30 flex items-center justify-center">
                  {testimonials[current].avatar ? (
                    <img
                      src={testimonials[current].avatar}
                      alt={testimonials[current].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <span className={`text-lg font-bold text-white ${testimonials[current].avatar ? 'hidden' : ''}`}>
                    {testimonials[current].name[0]}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{testimonials[current].name}</div>
                  <div className="text-xs text-[#94A3B8]">
                    {testimonials[current].role} · {testimonials[current].company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass border border-white/10 hover:border-[#38BDF8]/40 flex items-center justify-center text-[#94A3B8] hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 h-2 bg-[#38BDF8]'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass border border-white/10 hover:border-[#38BDF8]/40 flex items-center justify-center text-[#94A3B8] hover:text-white transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
