'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, slideRight } from '@/lib/motion';
import { Mail, MessageCircle, Globe, GitFork, Send, ArrowUpRight, Camera } from 'lucide-react';

const contactLinks = [
  {
    icon: Mail,
    label: 'Email',
    value: 'stackbyalif@gmail.com',
    href: 'mailto:stackbyalif@gmail.com',
    color: '#38BDF8',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+62 895-4127-35876',
    href: 'https://wa.me/62895412735876',
    color: '#34D399',
  },
  {
    icon: Camera,
    label: 'Instagram',
    value: 'instagram.com/stack.byalif',
    href: 'https://instagram.com/stack.byalif',
    color: '#818CF8',
  },
  {
    icon: GitFork,
    label: 'GitHub',
    value: 'github.com/apege',
    href: 'https://github.com/apege',
    color: '#94A3B8',
  },
];

const projectTypes = [
  'Website Development',
  'E-Commerce Solutions',
  'Business Systems',
  'Custom Web App',
  'Mobile Application',
  'Custom Software',
  'Other',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `Halo Alif! Saya ingin menghubungi kamu mengenai proyek berikut:

  Nama: ${form.name}
  Email: ${form.email}
  Tipe Proyek: ${form.projectType}

  Detail Proyek:
  ${form.message}`;

    const encoded = encodeURIComponent(message);
    const waNumber = '62895412735876';
    window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');

    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', projectType: '', message: '' });
  };

  return (
    <section id="contact" className="section-pad bg-[#111827]/50">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* CTA Headline */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3"
          >
            Contact
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
          >
            Let&apos;s Build Something{' '}
            <span className="gradient-text">Great Together</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#94A3B8] mt-4 max-w-xl mx-auto">
            Ready to take your business online to the next level? Let&apos;s talk about your
            project and how I can help you achieve your goals.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form — takes 3/5 */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-2xl p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                    <span className="text-3xl">✅</span>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-white text-lg">Message Sent!</h3>
                    <p className="text-[#94A3B8] text-sm mt-1">
                      I&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Lorem Ipsum"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]/50 focus:bg-[#38BDF8]/5 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Example@gmail.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]/50 focus:bg-[#38BDF8]/5 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                      Project Type
                    </label>
                    <select
                      required
                      value={form.projectType}
                      onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]/50 focus:bg-[#38BDF8]/5 transition-all appearance-none"
                    >
                      <option value="" disabled className="bg-[#111827]">
                        Select project type...
                      </option>
                      {projectTypes.map((t) => (
                        <option key={t} value={t} className="bg-[#111827]">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                      Tell me about your project
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your project, goals, timeline, and budget..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]/50 focus:bg-[#38BDF8]/5 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#38BDF8] hover:bg-[#29a8e0] text-[#0F172A] font-bold py-3.5 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(56,189,248,0.35)]"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact info — takes 2/5 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-white mb-1">Quick Response</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                I typically respond within 4–8 hours on business days. For urgent projects, WhatsApp
                is the fastest way to reach me.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Available for new projects</span>
              </div>
            </div>

            {contactLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 glass rounded-xl px-5 py-4 border border-white/8 hover:border-white/15 transition-all group hover:-translate-y-0.5"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${link.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: link.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#94A3B8] mb-0.5">{link.label}</div>
                    <div className="text-sm font-medium text-white truncate">{link.value}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-white transition-colors" />
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
