'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Navigation
    'nav.home': 'Home',
    'nav.solutions': 'Solusi Bisnis',
    'nav.services': 'Layanan',
    'nav.portfolio': 'Portfolio',
    'nav.pricing': 'Paket Harga',
    'nav.about': 'Tentang Studio',
    'nav.cta': 'Konsultasi Gratis',
    'nav.consult': 'Konsultasi',

    // Hero Section
    'hero.badge': 'DIGITAL DEVELOPMENT STUDIO',
    'hero.title1': 'Build Digital Solutions',
    'hero.title2': 'That Help Businesses Grow',
    'hero.subtitle': 'Kami membantu UMKM, perusahaan menengah, dan organisasi membangun website profesional, sistem manajemen kustom, dan aplikasi digital berbasis ROI bisnis.',
    'hero.ctaConsult': 'Konsultasi Gratis Via WhatsApp',
    'hero.ctaProjects': 'Lihat Project & Case Study',
    'hero.metric1Val': '60%+',
    'hero.metric1Lbl': 'Efisiensi Operasional Klien',
    'hero.metric2Val': '< 0.8s',
    'hero.metric2Lbl': 'Kecepatan Web Standard',
    'hero.metric3Val': '100%',
    'hero.metric3Lbl': 'Sistem Transparan & Scalable',
    'hero.dashboardTitle': 'System Overview',
    'hero.dashboardStatus': 'Sistem Aktif',
    'hero.statOrders': 'Pesanan Otomatis',
    'hero.statProcTime': 'Waktu Proses',
    'hero.statUptime': 'Uptime System',

    // Business Problems Section
    'problems.subtitle': 'Business Solutions',
    'problems.title1': 'Business Problems',
    'problems.title2': 'We Solve',
    'problems.desc': 'Kami mengubah tantangan operasional dan teknis bisnis Anda menjadi sistem digital yang efisien dan menguntungkan.',
    'problems.solutionLbl': 'Solusi Digital:',
    'problems.ctaMore': 'Punya kendala bisnis lain? Konsultasikan bersama kami',
    'problems.slideLabel': 'Masalah #{index} Dari {total}',

    // Services Section
    'services.subtitle': 'Layanan Utama Studio',
    'services.title1': 'Solusi Digital untuk',
    'services.title2': 'Pertumbuhan Bisnis',
    'services.desc': 'Setiap layanan dirancang dan dibangun dengan berfokus pada hasil nyata, efisiensi operasional, serta konversi bisnis.',
    'services.popular': 'Popular',
    'services.featuresTitle': 'Fitur Utama:',
    'services.slideLabel': 'Layanan #{index} Dari {total}',

    // Projects Section
    'projects.subtitle': 'Case Study & Portfolio',
    'projects.title1': 'Solusi Digital Yang',
    'projects.title2': 'Memberikan Dampak Nyata',
    'projects.slideLabel': 'Project #{index} dari {total}',
    'projects.btnCaseStudy': 'Case Study',
    'projects.btnLive': 'Live',
    'projects.btnCode': 'Code',

    // Pricing Section
    'pricing.subtitle': 'Investasi Terjangkau & Transparan',
    'pricing.title1': 'Paket Layanan',
    'pricing.title2': 'Pengembangan',
    'pricing.desc': 'Gambaran estimasi biaya pengembangan. Setiap solusi disesuaikan dengan skala dan kebutuhan spesifik bisnis Anda.',
    'pricing.startingFrom': 'Mulai dari',
    'pricing.includes': 'Termasuk dalam Paket:',
    'pricing.recommended': 'Direkomendasikan untuk:',
    'pricing.recommendedShort': 'Cocok untuk:',
    'pricing.cta': 'Pilih Paket & Konsultasi',
    'pricing.note': '* Seluruh harga bersifat fleksibel & transparan berdasarkan ruang lingkup (scope of work) proyek yang disepakati.',
    'pricing.slideLabel': 'Paket #{index} Dari {total}',

    // About Section
    'about.subtitle': 'Tentang Stack.byAlif',
    'about.title1': 'Studio Pengembangan Software',
    'about.title2': 'Berfokus Hasil Bisnis',
    'about.desc1': 'Stack.byAlif adalah digital development studio independen yang berfokus membangun website berkinerja tinggi, sistem manajemen internal, dan aplikasi digital terintegrasi untuk bisnis.',
    'about.desc2': 'Dikelola oleh developer independen berpengalaman, kami mengombinasikan ketelitian teknis, arsitektur software modern, dan pemahaman alur kerja bisnis untuk menghasilkan produk digital yang cepat, aman, dan dapat diandalkan.',
    'about.founderTitle': 'Alif Muzakky',
    'about.founderRole': 'Lead Developer & Studio Founder',
    'about.value1Title': 'Arsitektur Kustom & Scalable',
    'about.value1Desc': 'Bukan template pasaran. Setiap baris kode ditulis khusus sesuai kebutuhan & skala bisnis Anda.',
    'about.value2Title': 'Fokus Hasil & ROI Bisnis',
    'about.value2Desc': 'Mengutamakan kecepatan loading, keamanan data, serta efisiensi operasional harian.',
    'about.value3Title': 'Komunikasi Langsung & Transparan',
    'about.value3Desc': 'Berhubungan langsung dengan developer utama tanpa melalui banyak perantara agency.',

    // Footer
    'footer.tagline': 'Digital Development Studio yang membantu bisnis, UMKM, dan perusahaan membangun software kustom, website cepat, dan sistem internal terintegrasi.',
    'footer.rights': 'Stack.byAlif Studio. All rights reserved.',

    // Case Study Detail Page
    'cs.back': 'Kembali ke Portfolio',
    'cs.problem': 'Tantangan Bisnis (Problem)',
    'cs.solution': 'Solusi & Proses (Solution)',
    'cs.result': 'Hasil & Dampak (Result)',
    'cs.overview': 'Ringkasan Project',
    'cs.techStack': 'Teknologi & Fitur',
    'cs.liveWebsite': 'Kunjungi Website Live',
    'cs.discussProject': 'Diskusi Proyek Serupa',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.solutions': 'Business Solutions',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.pricing': 'Pricing',
    'nav.about': 'About Studio',
    'nav.cta': 'Free Consultation',
    'nav.consult': 'Consult',

    // Hero Section
    'hero.badge': 'DIGITAL DEVELOPMENT STUDIO',
    'hero.title1': 'Build Digital Solutions',
    'hero.title2': 'That Help Businesses Grow',
    'hero.subtitle': 'We help SMEs, mid-sized enterprises, and organizations build professional websites, custom management systems, and ROI-driven digital applications.',
    'hero.ctaConsult': 'Free Consultation via WhatsApp',
    'hero.ctaProjects': 'Explore Projects & Case Studies',
    'hero.metric1Val': '60%+',
    'hero.metric1Lbl': 'Client Operational Efficiency',
    'hero.metric2Val': '< 0.8s',
    'hero.metric2Lbl': 'Standard Web Speed',
    'hero.metric3Val': '100%',
    'hero.metric3Lbl': 'Transparent & Scalable System',
    'hero.dashboardTitle': 'System Overview',
    'hero.dashboardStatus': 'System Active',
    'hero.statOrders': 'Automated Orders',
    'hero.statProcTime': 'Processing Time',
    'hero.statUptime': 'System Uptime',

    // Business Problems Section
    'problems.subtitle': 'Business Solutions',
    'problems.title1': 'Business Problems',
    'problems.title2': 'We Solve',
    'problems.desc': 'We transform your operational and technical business challenges into efficient and profitable digital systems.',
    'problems.solutionLbl': 'Digital Solution:',
    'problems.ctaMore': 'Have other business challenges? Consult with us',
    'problems.slideLabel': 'Problem #{index} of {total}',

    // Services Section
    'services.subtitle': 'Core Studio Services',
    'services.title1': 'Digital Solutions for',
    'services.title2': 'Business Growth',
    'services.desc': 'Every service is engineered to focus on real results, operational efficiency, and business conversions.',
    'services.popular': 'Popular',
    'services.featuresTitle': 'Key Features:',
    'services.slideLabel': 'Service #{index} of {total}',

    // Projects Section
    'projects.subtitle': 'Case Study & Portfolio',
    'projects.title1': 'Digital Solutions That',
    'projects.title2': 'Deliver Real Impact',
    'projects.slideLabel': 'Project #{index} of {total}',
    'projects.btnCaseStudy': 'Case Study',
    'projects.btnLive': 'Live',
    'projects.btnCode': 'Code',

    // Pricing Section
    'pricing.subtitle': 'Affordable & Transparent Investment',
    'pricing.title1': 'Development',
    'pricing.title2': 'Service Packages',
    'pricing.desc': 'Estimated development investment. Every solution is tailored to your specific business scope.',
    'pricing.startingFrom': 'Starting from',
    'pricing.includes': 'Included in Package:',
    'pricing.recommended': 'Recommended for:',
    'pricing.recommendedShort': 'Best for:',
    'pricing.cta': 'Select Package & Consult',
    'pricing.note': '* All prices are flexible & transparent based on agreed project scope of work.',
    'pricing.slideLabel': 'Package #{index} of {total}',

    // About Section
    'about.subtitle': 'About Stack.byAlif',
    'about.title1': 'Software Development Studio',
    'about.title2': 'Focused on Business Results',
    'about.desc1': 'Stack.byAlif is an independent digital development studio focused on building high-performance websites, internal management systems, and integrated digital applications for businesses.',
    'about.desc2': 'Managed by an experienced independent developer, we combine technical precision, modern software architecture, and deep business workflow understanding to deliver fast, secure, and reliable digital products.',
    'about.founderTitle': 'Alif Muzakky',
    'about.founderRole': 'Lead Developer & Studio Founder',
    'about.value1Title': 'Custom & Scalable Architecture',
    'about.value1Desc': 'No generic templates. Every line of code is custom-written tailored to your business scale.',
    'about.value2Title': 'Focus on Business Results & ROI',
    'about.value2Desc': 'Prioritizing loading speed, data security, and daily operational efficiency.',
    'about.value3Title': 'Direct & Transparent Communication',
    'about.value3Desc': 'Deal directly with the lead developer without agency middleman delays.',

    // Footer
    'footer.tagline': 'Digital Development Studio helping businesses, SMEs, and enterprises build custom software, fast websites, and integrated internal systems.',
    'footer.rights': 'Stack.byAlif Studio. All rights reserved.',

    // Case Study Detail Page
    'cs.back': 'Back to Portfolio',
    'cs.problem': 'Business Challenge (Problem)',
    'cs.solution': 'Solution & Process',
    'cs.result': 'Result & Business Impact',
    'cs.overview': 'Project Overview',
    'cs.techStack': 'Technologies & Features',
    'cs.liveWebsite': 'Visit Live Website',
    'cs.discussProject': 'Discuss Similar Project',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('id');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang === 'id' || savedLang === 'en') {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['id']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
