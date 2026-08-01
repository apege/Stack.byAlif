'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Layers, Briefcase, Tag, Info, MessageSquare, ArrowUpRight, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('#home');
  const { lang, setLang, t } = useLanguage();

  const desktopNavLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#problems', label: t('nav.solutions') },
    { href: '#projects', label: t('nav.portfolio') },
    { href: '#pricing', label: t('nav.pricing') },
    { href: '#about', label: t('nav.about') },
  ];

  const mobileBottomNavLinks = [
    { href: '#home', label: t('nav.home'), icon: Home },
    { href: '#problems', label: t('nav.solutions'), icon: Layers },
    { href: '#projects', label: t('nav.portfolio'), icon: Briefcase },
    { href: '#pricing', label: t('nav.pricing'), icon: Tag },
    { href: '#about', label: t('nav.about'), icon: Info },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'services', 'problems', 'projects', 'pricing', 'about'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveHash(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Header Navbar for Desktop & Tablet Branding */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo.png"
              alt="Stack.byAlif Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight leading-none text-base">
                Stack<span className="text-[#38BDF8]">.</span>byAlif
              </span>
              <span className="text-[10px] text-[#94A3B8] font-medium tracking-wide">
              Web &amp; Software Development
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {desktopNavLinks.map((link) => {
              const isActive = activeHash === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs lg:text-sm font-medium transition-colors duration-200 relative ${
                    isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#38BDF8] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions (Language Switcher + Desktop CTA) */}
          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs font-semibold">
              <button
                onClick={() => setLang('id')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                  lang === 'id'
                    ? 'bg-[#38BDF8] text-[#0F172A] shadow-md font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                🇮🇩 ID
              </button>
              <button
                onClick={() => setLang('en')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-[#38BDF8] text-[#0F172A] shadow-md font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Desktop CTA */}
            <a
              href="https://wa.me/62895412735876?text=Halo%20Stack.byAlif,%20saya%20ingin%20konsultasi%20mengenai%20proyek%20bisnis%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-[#38BDF8] hover:bg-[#29a8e0] text-[#0F172A] font-bold text-xs lg:text-sm px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]"
            >
              {t('nav.cta')}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Direct WhatsApp Quick Button */}
            <a
              href="https://wa.me/62895412735876?text=Halo%20Stack.byAlif,%20saya%20ingin%20konsultasi%20mengenai%20proyek%20bisnis%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex md:hidden items-center gap-1 bg-[#38BDF8] text-[#0F172A] font-bold text-xs px-2.5 py-1.5 rounded-lg"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {t('nav.consult')}
            </a>
          </div>
        </div>
      </motion.header>


      {/* Floating Bottom Navigation Bar for Mobile */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden fixed bottom-4 left-4 right-4 z-50 pointer-events-auto"
      >
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-white/12 rounded-2xl px-2 py-2 shadow-2xl shadow-black/80 flex items-center justify-around">
          {mobileBottomNavLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeHash === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveHash(item.href)}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-[#38BDF8]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="mobileActiveDot"
                    className="absolute -bottom-1 w-1.5 h-1.5 bg-[#38BDF8] rounded-full shadow-[0_0_8px_#38BDF8]"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

