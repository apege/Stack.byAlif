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
    'nav.about': 'Tentang',
    'nav.services': 'Layanan',
    'nav.work': 'Karya',
    'nav.process': 'Cara kerja',
    'nav.cta': 'Mulai percakapan',

    // Hero Section
    'hero.badge': 'INDEPENDENT DIGITAL SOLUTIONS · INDONESIA',
    'hero.titleMain1': 'Dibuat tenang.',
    'hero.titleMain2': 'Bekerja ',
    'hero.titleMain3': 'keras.',
    'hero.desc': 'Kami merancang website dan sistem digital yang terasa sederhana bagi pengguna dan berarti bagi pertumbuhan bisnis.',
    'hero.ctaWork': 'Lihat pilihan karya',
    'hero.cardTitle1': 'Bukan sekadar ',
    'hero.cardTitle2': 'terlihat ',
    'hero.cardTitle3': 'bagus.',
    'hero.cardDesc': 'Setiap keputusan desain kami mulai dari apa yang perlu dituntaskan oleh bisnis Anda.',

    // Services ticker / pillars
    'pillar.1': 'Digital strategy',
    'pillar.2': 'Experience design',
    'pillar.3': 'Custom development',
    'pillar.4': 'Long-term partnership',

    // Projects Section
    'projects.tag': 'SELECTED WORK / 2024—2026',
    'projects.title': 'Karya yang membuat bisnis terasa lebih siap.',
    'projects.item1Category': '01 / COMMERCE',
    'projects.item1Title': 'Dari katalog menjadi mesin penjualan yang lebih ringan.',
    'projects.item1Desc': 'Platform commerce untuk brand lokal yang ingin tumbuh tanpa pengalaman belanja yang berisik.',
    'projects.item2Category': '02 / OPERATIONS',
    'projects.item2Title': 'Sistem operasional yang membuat tim bergerak lebih pasti.',
    'projects.item2Desc': 'Dashboard dan workflow internal yang dibangun dari cara kerja bisnis, bukan dari template.',
    'projects.item3Category': '03 / BRAND SITE',
    'projects.item3Title': 'Identitas digital yang terasa setara dengan kualitas produknya.',
    'projects.item3Desc': 'Website naratif untuk brand yang ingin terlihat jelas, terpercaya, dan siap bertumbuh.',

    // What We Do (Services)
    'services.tag': 'WHAT WE DO',
    'services.title': 'Cukup tajam untuk kebutuhan hari ini. Cukup lentur untuk besok.',
    'services.item1Num': '01',
    'services.item1Title': 'Digital presence',
    'services.item1Desc': 'Website perusahaan, platform produk, dan identitas digital yang bekerja untuk bisnis.',
    'services.item2Num': '02',
    'services.item2Title': 'Custom systems',
    'services.item2Desc': 'Sistem internal untuk proses yang lebih rapi, cepat, dan mudah dipantau.',
    'services.item3Num': '03',
    'services.item3Title': 'Commerce & growth',
    'services.item3Desc': 'Pengalaman transaksi yang sederhana—dengan fondasi data yang siap berkembang.',

    // Work Process
    'process.tag': 'CARA KERJA',
    'process.title': 'Lebih sedikit asumsi. Lebih banyak kejelasan.',
    'process.item1Num': '01',
    'process.item1Title': 'Dengar & memetakan',
    'process.item1Desc': 'Kami mulai dari konteks bisnis, bukan sekadar daftar fitur.',
    'process.item2Num': '02',
    'process.item2Title': 'Menentukan arah',
    'process.item2Desc': 'Strategi, struktur, dan visual dirapikan menjadi satu keputusan yang terarah.',
    'process.item3Num': '03',
    'process.item3Title': 'Membangun dengan teliti',
    'process.item3Desc': 'Kami memproduksi dan menguji sampai pengalaman terasa wajar digunakan.',

    // Contact
    'contact.tag': 'A GOOD PLACE TO START',
    'contact.title': 'Punya sesuatu yang perlu dibangun dengan benar?',
    'contact.desc': 'Ceritakan sedikit tentang bisnis dan apa yang sedang ingin Anda rapikan. Kami akan membalas dalam 1–2 hari kerja.',
    'contact.formName': 'NAMA',
    'contact.formNamePlaceholder': 'Nama lengkap',
    'contact.formEmail': 'EMAIL',
    'contact.formEmailPlaceholder': 'nama@perusahaan.com',
    'contact.formPhone': 'NOMOR WHATSAPP (OPSIONAL)',
    'contact.formPhonePlaceholder': '081234567890',
    'contact.formSubject': 'SUBJEK / JUDUL PROYEK',
    'contact.formSubjectPlaceholder': 'Misal: Pembuatan Website E-Commerce',
    'contact.formMsg': 'APA YANG INGIN DIBANGUN?',
    'contact.formMsgPlaceholder': 'Ceritakan proyek, target, atau masalah yang ingin diselesaikan.',
    'contact.formDisclaimer': 'Dengan mengirim form ini, Anda setuju untuk kami hubungi.',
    'contact.formSubmit': 'Kirim pesan',

    // Footer
    'footer.rights': '© 2026 Alif Web Digital Solutions. Hak cipta dilindungi undang-undang.',
  },
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.work': 'Work',
    'nav.process': 'Process',
    'nav.cta': 'Start conversation',

    // Hero Section
    'hero.badge': 'INDEPENDENT DIGITAL STUDIO · INDONESIA',
    'hero.titleMain1': 'Built calm.',
    'hero.titleMain2': 'Working ',
    'hero.titleMain3': 'hard.',
    'hero.desc': 'We design websites and digital systems that feel simple for users—and meaningful for business growth.',
    'hero.ctaWork': 'View selected work',
    'hero.cardTitle1': 'Not just ',
    'hero.cardTitle2': 'looking ',
    'hero.cardTitle3': 'good.',
    'hero.cardDesc': 'Every design decision of ours starts from what your business needs to accomplish.',

    // Services ticker / pillars
    'pillar.1': 'Digital strategy',
    'pillar.2': 'Experience design',
    'pillar.3': 'Custom development',
    'pillar.4': 'Long-term partnership',

    // Projects Section
    'projects.tag': 'SELECTED WORK / 2024—2026',
    'projects.title': 'Work that makes businesses feel ready.',
    'projects.item1Category': '01 / COMMERCE',
    'projects.item1Title': 'From catalog to a lighter sales machine.',
    'projects.item1Desc': 'Commerce platform for local brands that want to grow without noisy shopping experience.',
    'projects.item2Category': '02 / OPERATIONS',
    'projects.item2Title': 'Operational systems that move teams forward with confidence.',
    'projects.item2Desc': 'Dashboards and internal workflows built around how your business works, not from templates.',
    'projects.item3Category': '03 / BRAND SITE',
    'projects.item3Title': 'Digital identity that matches product quality.',
    'projects.item3Desc': 'Narrative website for brands that want to be clear, trusted, and ready to scale.',

    // What We Do (Services)
    'services.tag': 'WHAT WE DO',
    'services.title': 'Sharp enough for today. Flexible enough for tomorrow.',
    'services.item1Num': '01',
    'services.item1Title': 'Digital presence',
    'services.item1Desc': 'Corporate websites, product platforms, and digital identities that work for business.',
    'services.item2Num': '02',
    'services.item2Title': 'Custom systems',
    'services.item2Desc': 'Internal systems for cleaner, faster, and easily monitored processes.',
    'services.item3Num': '03',
    'services.item3Title': 'Commerce & growth',
    'services.item3Desc': 'Simple transaction experiences with a data foundation ready for growth.',

    // Work Process
    'process.tag': 'WORK PROCESS',
    'process.title': 'Fewer assumptions. More clarity.',
    'process.item1Num': '01',
    'process.item1Title': 'Listen & map',
    'process.item1Desc': 'We start from business context, not just a feature wishlist.',
    'process.item2Num': '02',
    'process.item2Title': 'Set direction',
    'process.item2Desc': 'Strategy, structure, and visuals organized into one guided decision.',
    'process.item3Num': '03',
    'process.item3Title': 'Build meticulously',
    'process.item3Desc': 'We build and test until the experience feels completely natural to use.',

    // Contact
    'contact.tag': 'A GOOD PLACE TO START',
    'contact.title': 'Have something that needs to be built right?',
    'contact.desc': 'Tell us a bit about your business and what you are looking to refine. We will respond within 1–2 business days.',
    'contact.formName': 'NAME',
    'contact.formNamePlaceholder': 'Full name',
    'contact.formEmail': 'EMAIL',
    'contact.formEmailPlaceholder': 'name@company.com',
    'contact.formPhone': 'PHONE NUMBER / WHATSAPP',
    'contact.formPhonePlaceholder': '+62 812 3456 7890',
    'contact.formSubject': 'SUBJECT / PROJECT TITLE',
    'contact.formSubjectPlaceholder': 'E.g., E-Commerce Website Development',
    'contact.formMsg': 'WHAT ARE YOU LOOKING TO BUILD?',
    'contact.formMsgPlaceholder': 'Tell us about your project, goals, or problems to solve.',
    'contact.formDisclaimer': 'By submitting this form, you agree to let us contact you.',
    'contact.formSubmit': 'Send message',

    // Footer
    'footer.rights': '© 2026 Alif Web Digital Solutions. All rights reserved.',
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

