'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  // Prevent scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? 'bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm py-3'
          : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Brand Logo - Alif Web / Stack.byAlif */}
        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 sm:gap-3 group z-50">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 overflow-hidden rounded-full shadow-sm group-hover:scale-105 transition-transform duration-200 bg-slate-950 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Logo Alif Web"
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base leading-none">
              Stack<span className="text-blue-500">.</span>byAlif
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
              DIGITAL SOLUTIONS
            </span>
          </div>
        </Link>

        {/* Center Nav Links - Desktop */}
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
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 z-50">
          {/* Language Switcher: ID / EN */}
          <div className="flex items-center text-xs font-semibold text-slate-500">
            <button
              onClick={() => setLang('id')}
              className={`transition-colors px-1.5 py-1 ${
                lang === 'id' ? 'text-slate-950 font-bold underline underline-offset-4 decoration-2 decoration-blue-600' : 'hover:text-slate-900'
              }`}
              aria-label="Bahasa Indonesia"
            >
              ID
            </button>
            <span className="mx-0.5 text-slate-300">/</span>
            <button
              onClick={() => setLang('en')}
              className={`transition-colors px-1.5 py-1 ${
                lang === 'en' ? 'text-slate-950 font-bold underline underline-offset-4 decoration-2 decoration-blue-600' : 'hover:text-slate-900'
              }`}
              aria-label="English language"
            >
              EN
            </button>
          </div>

          {/* CTA Pill Button: Mulai percakapan ↗ (Desktop) */}
          <a
            href="#contact"
            className="hidden sm:flex items-center gap-2 bg-[#061021] hover:bg-slate-800 text-white text-xs md:text-sm font-medium px-4 md:px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-200 group"
          >
            <span>{t('nav.cta')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Mobile Menu Hamburger Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-slate-900/5 hover:bg-slate-900/10 flex items-center justify-center text-slate-900 transition-colors focus:outline-none"
            aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Apple-style Mobile Glass Overlay Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-[57px] bg-slate-950/95 backdrop-blur-2xl z-40 md:hidden flex flex-col justify-between px-6 pt-8 pb-20 overflow-y-auto"
          >
            <div className="flex flex-col space-y-6">
              <span className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">
                NAVIGASI SITEMAP
              </span>

              <nav className="flex flex-col space-y-4">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * (idx + 1), duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-bold text-slate-100 hover:text-blue-400 flex items-center justify-between py-2 border-b border-slate-800/80 transition-colors"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-5 h-5 text-slate-500" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Mobile Bottom CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="pt-6"
            >
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-base"
              >
                <span>{t('nav.cta')}</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
              <p className="text-center text-xs text-slate-500 mt-4">
                Stack.byAlif — Digital Solutions &amp; Software House
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}



