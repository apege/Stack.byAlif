'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeUp, slideRight, stagger } from '@/lib/motion';
import { CheckCircle2, ShieldCheck, Code2, Rocket } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const studioValues = [
    {
      icon: Code2,
      title: t('about.value1Title'),
      desc: t('about.value1Desc'),
    },
    {
      icon: ShieldCheck,
      title: t('about.value2Title'),
      desc: t('about.value2Desc'),
    },
    {
      icon: Rocket,
      title: t('about.value3Title'),
      desc: t('about.value3Desc'),
    },
  ];

  const highlights = [
    'Website Development & Company Profile',
    'Custom Business System & Admin Dashboard',
    'E-Commerce Platform & Payment Gateway',
    'Integrasi WhatsApp & Lead Generation',
    'Otomatisasi Laporan & Workflow Bisnis',
    'Pemeliharaan & Pendampingan Teknis',
  ];

  return (
    <section id="about" className="section-pad">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left — Studio & Founder Card (5 cols) */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#38BDF8]/15 to-[#818CF8]/10 rounded-3xl blur-3xl" />

              {/* Main Studio Card */}
              <div className="relative glass rounded-2xl p-6 border border-white/10 space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
                    Our Approach
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">Stack.byAlif</h3>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                    Independent Digital Development Studio yang berdedikasi membangun perangkat lunak praktis dan bernilai tinggi untuk bisnis.
                  </p>
                </div>

                {/* Values grid */}
                <div className="space-y-3">
                  {studioValues.map((v, i) => {
                    const Icon = v.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-[#38BDF8]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{v.title}</div>
                          <div className="text-[11px] text-[#94A3B8] leading-tight mt-0.5">{v.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Founder Badge (Small, Professional) */}
                <div className="pt-4 border-t border-white/8 flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#38BDF8]/30 flex-shrink-0">
                    <Image
                      src="/images/me.png"
                      alt="Alif Muzakky - Founder Stack.byAlif"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Muhammad Alif Muzakky</div>
                    <div className="text-[11px] text-[#94A3B8]">Founder &amp; Lead Software Developer</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Content (7 cols) */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <motion.div variants={fadeUp} className="mb-3">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase">
                {t('about.subtitle')}
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight"
            >
              {t('about.title1')} <br />
              <span className="gradient-text">{t('about.title2')}</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-[#94A3B8] text-sm md:text-base leading-relaxed mb-4">
              {t('about.desc1')}
            </motion.p>

            <motion.p variants={fadeUp} className="text-[#94A3B8] text-sm md:text-base leading-relaxed mb-8">
              {t('about.desc2')}
            </motion.p>

            {/* Highlights Grid */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-white/5 border border-white/5 px-3.5 py-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                  <span className="text-xs text-[#CBD5E1] font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

