'use client';

import React, { useState } from 'react';
import { faqData } from '@/data';
import { useLanguage } from '@/context/LanguageContext';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export default function FAQ() {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured Data JSON-LD for Google Rich Snippet FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* JSON-LD Rich Snippet for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>{lang === 'id' ? 'Tanya Jawab & Informasi' : 'FAQ & Knowledge Base'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            {lang === 'id' ? (
              <>
                Pertanyaan Umum <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Jasa Website & Web App</span>
              </>
            ) : (
              <>
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Questions</span>
              </>
            )}
          </h2>

          <p className="text-base sm:text-lg text-slate-300">
            {lang === 'id'
              ? 'Segala hal yang perlu Anda ketahui tentang biaya, proses pengerjaan, garansi, hingga teknologi jasa pembuatan website dan aplikasi kami.'
              : 'Everything you need to know about pricing, timeline, tech stack, maintenance, and custom web development services.'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'bg-slate-800/90 border-blue-500/50 shadow-lg shadow-blue-500/5'
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/60'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-100 flex items-center gap-3">
                    <span className="text-blue-400 font-mono text-sm">0{faq.id}</span>
                    {faq.question}
                  </h3>
                  <div
                    className={`p-2 rounded-full bg-slate-700/50 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 bg-blue-500 text-white' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-slate-300 text-base leading-relaxed border-t border-slate-700/40 mt-1">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-8 sm:p-10 max-w-3xl mx-auto backdrop-blur-sm">
          <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {lang === 'id' ? 'Punya pertanyaan spesifik atau ingin konsultasi gratis?' : 'Have a custom request or specific question?'}
          </h3>
          <p className="text-slate-300 mb-6 text-sm sm:text-base">
            {lang === 'id'
              ? 'Tim Stack.byAlif siap membantu menganalisis kebutuhan website & software bisnis Anda secara langsung.'
              : 'Our development team is ready to analyze your business web app requirements.'}
          </p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Stack.byAlif,%20saya%20ingin%20konsultasi%20jasa%20pembuatan%20website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/30 hover:scale-[1.02]"
          >
            {lang === 'id' ? 'Konsultasi Gratis via WhatsApp' : 'Get Free Consultation'}
          </a>
        </div>
      </div>
    </section>
  );
}
