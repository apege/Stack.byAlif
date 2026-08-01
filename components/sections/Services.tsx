'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';
import {
  Globe,
  ShoppingBag,
  LayoutDashboard,
  Smartphone,
  MonitorSmartphone,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const iconMap: Record<string, React.ElementType> = {
  Globe,
  ShoppingBag,
  LayoutDashboard,
  Smartphone,
  MonitorSmartphone,
};

const servicesData = {
  id: [
    {
      id: 1,
      icon: 'Globe',
      title: 'Website Development',
      description: 'Membangun website profesional untuk meningkatkan kredibilitas, membangun impresi pertama yang kuat, dan memperluas jangkauan bisnis Anda.',
      features: [
        'Landing Page & Company Profile',
        'SEO & Performance Optimization',
        'Desain Responsive Desktop & Mobile',
        'Integrasi WhatsApp & Lead Capture',
        'Kecepatan Load Tinggi (Lighthouse 90+)',
      ],
    },
    {
      id: 2,
      icon: 'LayoutDashboard',
      title: 'Business System',
      description: 'Membuat sistem internal kustom untuk membantu bisnis mengelola data, otomatisasi operasional, inventaris, dan laporan transaksi secara real-time.',
      features: [
        'Dashboard Analitik & Admin',
        'Sistem Manajemen Stok & WMS',
        'CRM & Pengelolaan Pelanggan',
        'Multi-user Role & Security',
        'Laporan Keuangan & Laporan Operasional',
      ],
    },
    {
      id: 3,
      icon: 'ShoppingBag',
      title: 'E-Commerce Platform',
      description: 'Membangun platform penjualan online mandiri yang disesuaikan dengan kebutuhan bisnis tanpa komisi pihak ketiga.',
      features: [
        'Katalog Produk Interaktif',
        'Integrasi Payment Gateway',
        'Manajemen Pesanan & Resi',
        'WhatsApp Order Automation',
        'Sistem Diskon & Promo Code',
      ],
    },
    {
      id: 4,
      icon: 'MonitorSmartphone',
      title: 'Custom Software Solution',
      description: 'Pengembangan aplikasi web kustom yang dibangun sesuai dengan masalah dan alur kerja spesifik bisnis Anda.',
      features: [
        'Aplikasi Web Skala Menengah/Besar',
        'Integrasi API & Third-party',
        'Automated Workflow & Poster Generator',
        'Database Architecture yang Aman',
        'Maintenance & Pemeliharaan Rutin',
      ],
    },
  ],
  en: [
    {
      id: 1,
      icon: 'Globe',
      title: 'Website Development',
      description: 'Building professional websites to boost credibility, create strong first impressions, and expand your business reach.',
      features: [
        'Landing Page & Company Profile',
        'SEO & Performance Optimization',
        'Desktop & Mobile Responsive Design',
        'WhatsApp & Lead Capture Integration',
        'High Load Speed (Lighthouse 90+)',
      ],
    },
    {
      id: 2,
      icon: 'LayoutDashboard',
      title: 'Business Systems',
      description: 'Custom internal systems to manage operational data, workflow automation, inventory, and real-time transaction reports.',
      features: [
        'Analytics & Admin Dashboard',
        'Inventory & WMS Management System',
        'CRM & Customer Management',
        'Multi-user Role & Security',
        'Financial & Operational Reports',
      ],
    },
    {
      id: 3,
      icon: 'ShoppingBag',
      title: 'E-Commerce Platforms',
      description: 'Independent online store platforms customized to your business workflow with 0% third-party commission.',
      features: [
        'Interactive Product Catalog',
        'Payment Gateway Integration',
        'Order & Tracking Management',
        'WhatsApp Order Automation',
        'Discount & Promo Code Engine',
      ],
    },
    {
      id: 4,
      icon: 'MonitorSmartphone',
      title: 'Custom Software Solutions',
      description: 'Custom web application development specifically engineered around your unique business problems and workflows.',
      features: [
        'Medium-to-Large Web Applications',
        'API & Third-party Integration',
        'Automated Workflow & Poster Generator',
        'Secure Database Architecture',
        'Routine Maintenance & Support',
      ],
    },
  ],
};

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { lang, t } = useLanguage();
  const servicesList = servicesData[lang] || servicesData.id;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % servicesList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + servicesList.length) % servicesList.length);
  };

  return (
    <section id="services" className="section-pad bg-[#111827]/50">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3"
          >
            {t('services.subtitle')}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
          >
            {t('services.title1')} <span className="gradient-text">{t('services.title2')}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#94A3B8] mt-4 max-w-xl mx-auto text-sm md:text-base">
            {t('services.desc')}
          </motion.p>
        </motion.div>

        {/* Mobile View: Single-Card Animated Carousel */}
        <div className="block md:hidden">
          <div className="relative">
            <AnimatePresence mode="wait">
              {servicesList.map((service, index) => {
                if (index !== currentIndex) return null;
                const Icon = iconMap[service.icon];
                const isHighlighted = index === 0;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`relative glass rounded-2xl p-6 border ${
                      isHighlighted ? 'border-[#38BDF8]/40 bg-[#38BDF8]/5' : 'border-white/10'
                    } shadow-2xl flex flex-col justify-between`}
                  >
                    <div>
                      {/* Top Header: Icon & Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                              isHighlighted ? 'bg-[#38BDF8]/20 text-[#38BDF8]' : 'bg-white/10 text-white'
                            }`}
                          >
                            {Icon && <Icon className="w-5 h-5" />}
                          </div>
                          <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                            {lang === 'en' ? `Service #${index + 1} of ${servicesList.length}` : `Layanan #${index + 1} Dari ${servicesList.length}`}
                          </span>
                        </div>
                        {isHighlighted && (
                          <div className="bg-[#38BDF8] text-[#0F172A] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                            {t('services.popular')}
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-white text-lg mb-2">{service.title}</h3>
                      <p className="text-[#94A3B8] text-xs leading-relaxed mb-5">{service.description}</p>
                    </div>

                    {/* Features Block */}
                    <div className="pt-3.5 border-t border-white/8 bg-white/5 -mx-6 -mb-6 p-4 rounded-b-2xl">
                      <div className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider mb-2">
                        {t('services.featuresTitle')}
                      </div>
                      <ul className="space-y-2">
                        {service.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                            <Check className="w-3.5 h-3.5 text-[#38BDF8] flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-between mt-5 px-1">
            <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
              {servicesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-8 bg-[#38BDF8]' : 'w-2 bg-white/20'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all"
                aria-label="Previous Service"
              >
                <ChevronLeft className="w-5 h-5 text-[#94A3B8]" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 hover:bg-[#38BDF8] flex items-center justify-center text-white hover:text-[#0F172A] active:scale-95 transition-all"
                aria-label="Next Service"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop View: Grid (3 columns) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicesList.map((service, i) => {
            const Icon = iconMap[service.icon];
            const isHighlighted = i === 0;

            return (
              <div
                key={service.id}
                className={`group relative glass rounded-2xl p-6 transition-all duration-300 ${
                  isHighlighted
                    ? 'border-[#38BDF8]/30 bg-[#38BDF8]/5'
                    : 'border-white/8 hover:border-white/15'
                } flex flex-col`}
              >
                {isHighlighted && (
                  <div className="absolute top-4 right-4 bg-[#38BDF8] text-[#0F172A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {t('services.popular')}
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

                <h3 className="font-bold text-white text-base sm:text-lg mb-2">{service.title}</h3>
                <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs sm:text-sm text-[#CBD5E1]">
                      <Check className="w-3.5 h-3.5 text-[#38BDF8] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}