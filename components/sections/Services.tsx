'use client';
import { motion } from 'framer-motion';
import { fadeUp, stagger, scaleIn } from '@/lib/motion';
import { services } from '@/data';
import {
  Globe,
  ShoppingBag,
  LayoutDashboard,
  Smartphone,
  MonitorSmartphone,
  Check,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Globe,
  ShoppingBag,
  LayoutDashboard,
  Smartphone,
  MonitorSmartphone,
};

export default function Services() {
  return (
    <section id="services" className="section-pad bg-[#111827]/50">
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
            Services
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            What I Build For{' '}
            <span className="gradient-text">Your Business</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#94A3B8] mt-4 max-w-xl mx-auto">
            Every service is built with conversion, performance, and scalability in mind.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            const isHighlighted = i === 0;

            return (
              <motion.div
                key={service.id}
                variants={scaleIn}
                className={`group relative glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 ${
                  isHighlighted
                    ? 'border-[#38BDF8]/30 bg-[#38BDF8]/5'
                    : 'border-white/8 hover:border-white/15'
                } flex flex-col`}
              >
                {isHighlighted && (
                  <div className="absolute top-4 right-4 bg-[#38BDF8] text-[#0F172A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Popular
                  </div>
                )}

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                    isHighlighted
                      ? 'bg-[#38BDF8]/20'
                      : 'bg-white/8 group-hover:bg-[#38BDF8]/10'
                  } transition-colors`}
                >
                  {Icon && (
                    <Icon
                      className={`w-5 h-5 ${
                        isHighlighted
                          ? 'text-[#38BDF8]'
                          : 'text-[#94A3B8] group-hover:text-[#38BDF8]'
                      } transition-colors`}
                    />
                  )}
                </div>

                <h3 className="font-bold text-white text-lg mb-2">{service.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-5">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                      <Check className="w-3.5 h-3.5 text-[#38BDF8] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#38BDF8]">{service.price}</span>
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-xs text-[#94A3B8] hover:text-white transition-colors"
                  >
                    Discuss Project →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}