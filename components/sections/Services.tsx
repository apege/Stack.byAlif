'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      num: t('services.item1Num'),
      title: t('services.item1Title'),
      desc: t('services.item1Desc'),
    },
    {
      num: t('services.item2Num'),
      title: t('services.item2Title'),
      desc: t('services.item2Desc'),
    },
    {
      num: t('services.item3Num'),
      title: t('services.item3Title'),
      desc: t('services.item3Desc'),
    },
  ];

  return (
    <section id="services" className="py-24 md:py-36 bg-[#061021] text-white relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Header Grid: Tag & Big Title (Persis Screenshot 5) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              {t('services.tag')}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
              {t('services.title')}
            </h2>
          </motion.div>
        </div>

        {/* List Layanan (01, 02, 03) - Persis Screenshot 6 */}
        <div className="divide-y divide-slate-800/80 border-t border-b border-slate-800/80">
          {services.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="py-8 md:py-12 grid md:grid-cols-12 gap-6 items-baseline group hover:bg-slate-900/40 transition-colors px-4 -mx-4 rounded-lg"
            >
              {/* Number - 2 cols */}
              <div className="md:col-span-2">
                <span className="text-sm font-bold text-blue-500 font-mono">
                  {item.num}
                </span>
              </div>

              {/* Title - 5 cols */}
              <div className="md:col-span-5">
                <h3 className="text-2xl md:text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Description - 5 cols */}
              <div className="md:col-span-5">
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}