'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function WorkProcess() {
  const { t } = useLanguage();

  const steps = [
    {
      num: t('process.item1Num'),
      title: t('process.item1Title'),
      desc: t('process.item1Desc'),
    },
    {
      num: t('process.item2Num'),
      title: t('process.item2Title'),
      desc: t('process.item2Desc'),
    },
    {
      num: t('process.item3Num'),
      title: t('process.item3Title'),
      desc: t('process.item3Desc'),
    },
  ];

  return (
    <section id="process" className="py-16 sm:py-24 md:py-36 bg-grid-pattern border-t border-slate-200/80">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Headline Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-500 uppercase block mb-4 sm:mb-6">
              {t('process.tag')}
            </span>
            <h2 className="fluid-section-title font-extrabold text-slate-950 tracking-tight">
              {t('process.title')}
            </h2>
          </motion.div>

          {/* Right Process List Column - 6 cols */}
          <div className="lg:col-span-6 divide-y divide-slate-200">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="py-8 first:pt-0 last:pb-0 flex items-start gap-6"
              >
                <span className="text-sm font-bold text-blue-600 font-mono pt-1 shrink-0">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-950 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

