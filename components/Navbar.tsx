'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#projects', label: t('nav.work') },
    { href: '#process', label: t('nav.process') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-50/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3'
          : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo - Alif Web / Stack.byAlif */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 overflow-hidden rounded-full shadow-sm group-hover:scale-105 transition-transform duration-200 bg-slate-950 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Logo Alif Web"
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 tracking-tight text-base leading-none">
              Stack<span className="text-blue-500">.</span>byAlif
            </span>
            <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
              DIGITAL SOLUTIONS
            </span>
          </div>
        </Link>


        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Language Switcher: ID / EN */}
          <div className="flex items-center text-xs font-semibold text-slate-500">
            <button
              onClick={() => setLang('id')}
              className={`transition-colors px-1 py-0.5 ${
                lang === 'id' ? 'text-slate-950 font-bold underline underline-offset-4 decoration-2 decoration-blue-600' : 'hover:text-slate-900'
              }`}
            >
              ID
            </button>
            <span className="mx-1 text-slate-300">/</span>
            <button
              onClick={() => setLang('en')}
              className={`transition-colors px-1 py-0.5 ${
                lang === 'en' ? 'text-slate-950 font-bold underline underline-offset-4 decoration-2 decoration-blue-600' : 'hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>

          {/* CTA Pill Button: Mulai percakapan ↗ */}
          <a
            href="#contact"
            className="flex items-center gap-2 bg-[#061021] hover:bg-slate-800 text-white text-xs md:text-sm font-medium px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-200 group"
          >
            <span>{t('nav.cta')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}


