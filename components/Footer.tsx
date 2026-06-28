import Link from 'next/link';
import { GitFork, Globe, Mail, MessageCircle, Camera } from 'lucide-react';
import Image from 'next/image';

const quickLinks = [
  { href: '#home', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#certificates', label: 'Certificates' }, 
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];

const socials = [
  { icon: GitFork, href: 'https://github.com/apege', label: 'GitHub' },
  { icon: Camera, href: 'https://instagram.com/stack.byalif', label: 'Instagram' },
  { icon: Mail, href: 'mailto:stackbyalif@gmail.com', label: 'Email' },
  { icon: MessageCircle, href: 'https://wa.me/62895412735876', label: 'WhatsApp' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
                <Image
                  src="/images/logo.png"
                  alt="Stack.byAlif Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              <span className="font-bold text-white tracking-tight text-sm">
                Stack<span className="text-[#38BDF8]">.</span>byAlif
              </span>
            </Link>
            <p className="text-[#94A3B8] text-xs leading-relaxed max-w-xs">
              Full Stack Web Developer building modern websites and applications for businesses
              that want to grow online.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 glass rounded-lg flex items-center justify-center border border-white/8 hover:border-[#38BDF8]/30 hover:text-[#38BDF8] text-[#94A3B8] transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#94A3B8]">
            © {new Date().getFullYear()} Stack.byAlif · All rights reserved.
          </p>
          <p className="text-xs text-[#64748B]">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
