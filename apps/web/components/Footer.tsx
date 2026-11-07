'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GitFork, Mail, MessageCircle, Camera } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const socials = [
  { icon: GitFork, href: 'https://github.com/apege', label: 'GitHub' },
  { icon: Camera, href: 'https://instagram.com/stack.byalif', label: 'Instagram' },
  { icon: Mail, href: 'mailto:stackbyalif@gmail.com', label: 'Email' },
  { icon: MessageCircle, href: 'https://wa.me/62895412735876', label: 'WhatsApp' },
];

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#projects', label: t('nav.work') },
    { href: '#process', label: t('nav.process') },
  ];

  return (
    <footer className="bg-[#061021] text-white border-t border-slate-800/80 py-12 sm:py-16">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid md:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-slate-800/80">
          {/* Brand - 5 cols */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <Image
                src="/images/logo.png"
                alt="Alif Web Logo"
                width={30}
                height={30}
                className="rounded-lg"
              />
              <span className="font-bold text-white tracking-tight text-base">
                Stack<span className="text-blue-500">.</span>byAlif
              </span>
            </Link>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm">
              Digital Solutions yang membantu bisnis, UMKM, dan perusahaan membangun software kustom, website cepat, dan sistem internal terintegrasi.
            </p>
          </div>

          {/* Quick links - 4 cols */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs md:text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials - 3 cols */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
              CONNECT
            </h4>
            <div className="flex items-center gap-2.5">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Stack.byAlif. All rights reserved.</p>
          <p className="text-slate-500">Building digital solutions for modern businesses.</p>
        </div>
      </div>
    </footer>
  );
}



