'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal mengirim pesan');
      }

      setStatusMsg({
        type: 'success',
        text: 'Terima kasih! Pesan Anda berhasil terkirim. Kami akan segera menghubungi Anda kembali.',
      });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-blue-600 text-white py-16 sm:py-24 md:py-36 relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-blue-200 uppercase block mb-4 sm:mb-6">
              {t('contact.tag')}
            </span>
            <h2 className="fluid-section-title font-extrabold text-white tracking-tight mb-4 sm:mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
              {t('contact.desc')}
            </p>
          </motion.div>

          {/* Right White Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl text-slate-950">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Grid 2 Inputs: Nama & Email */}
                <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1.5 sm:mb-2">
                      {t('contact.formName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t('contact.formNamePlaceholder')}
                      className="w-full border-b border-slate-300 py-2.5 sm:py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 transition-colors bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1.5 sm:mb-2">
                      {t('contact.formEmail')}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={t('contact.formEmailPlaceholder')}
                      className="w-full border-b border-slate-300 py-2.5 sm:py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 transition-colors bg-transparent"
                    />
                  </div>
                </div>

                {/* Grid 2 Inputs: Phone & Subject */}
                <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1.5 sm:mb-2">
                      {t('contact.formPhone')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder={t('contact.formPhonePlaceholder')}
                      className="w-full border-b border-slate-300 py-2.5 sm:py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 transition-colors bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1.5 sm:mb-2">
                      {t('contact.formSubject')}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={t('contact.formSubjectPlaceholder')}
                      className="w-full border-b border-slate-300 py-2.5 sm:py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 transition-colors bg-transparent"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1.5 sm:mb-2">
                    {t('contact.formMsg')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t('contact.formMsgPlaceholder')}
                    className="w-full border-b border-slate-300 py-2.5 sm:py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-950 transition-colors bg-transparent resize-none"
                  />
                </div>

                {statusMsg && (
                  <div
                    className={`p-3 rounded-lg text-xs sm:text-sm ${
                      statusMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {statusMsg.text}
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pt-2 sm:pt-4">
                  <p className="text-[11px] sm:text-xs text-slate-400 max-w-xs">
                    {t('contact.formDisclaimer')}
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#061021] hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm px-7 py-3.5 rounded-full shadow transition-all duration-200 group shrink-0"
                  >
                    <span>{loading ? 'Sending...' : t('contact.formSubmit')}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

