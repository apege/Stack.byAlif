'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, Calendar, Hash, Building2, ExternalLink } from 'lucide-react';
import { fadeUp, stagger, scaleIn } from '@/lib/motion';

const certificate = {
  title: 'Lomba Kompetensi Siswa Nasional',
  subtitle: 'Tingkat Kota Bandung Tahun 2026',
  achievement: 'Juara 2',
  category: 'IT Software Solution For Business',
  categoryId: 'Teknologi Informasi Piranti Lunak Untuk Bisnis',
  institution: 'SMKN 4 Bandung',
  issuer: 'Disdik Jabar / MKKSMK Kota Bandung',
  credentialId: '195/MKKSMK Kota Bandung/V/2026',
  eventDate: '11 - 13 Mei 2026',
  location: 'Kota Bandung',
  image: '/images/certificates/lksn-2026.png',
  accentColor: '#38BDF8',
  badge: '🥈',
};

export default function Achievements() {
  const cert = certificate;

  return (
    <section id="certificates" className="section-pad bg-[#111827]/50">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Heading */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3"
          >
            Achievements
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Certificates &{' '}
            <span className="gradient-text">Awards</span>
          </motion.h2>
        </motion.div>

        {/* Banner Card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="group glass rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all duration-300"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Certificate Image */}
            <div className="relative h-72 lg:h-auto bg-gradient-to-br from-[#38BDF8]/20 to-[#818CF8]/20 overflow-hidden">
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111827]/60 hidden lg:block" />

              {/* Achievement badge overlay */}
              <div className="absolute top-4 left-4">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm"
                  style={{
                    background: `${cert.accentColor}20`,
                    borderColor: `${cert.accentColor}40`,
                    color: cert.accentColor,
                  }}
                >
                  <Award className="w-3 h-3" />
                  {cert.achievement}
                </div>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="p-8 flex flex-col justify-center">
              {/* Category */}
              <span
                className="text-xs font-semibold tracking-[0.15em] uppercase mb-4 block"
                style={{ color: cert.accentColor }}
              >
                {cert.category}
              </span>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1">
                {cert.title}
              </h3>
              <p className="text-[#94A3B8] text-base mb-6">{cert.subtitle}</p>

              {/* Achievement highlight */}
              <div
                className="inline-flex items-center gap-3 px-4 py-3 rounded-xl mb-6 w-fit"
                style={{
                  background: `${cert.accentColor}10`,
                  border: `1px solid ${cert.accentColor}25`,
                }}
              >
                <span className="text-2xl">{cert.badge}</span>
                <div>
                  <div className="text-white font-black text-lg leading-none">{cert.achievement}</div>
                  <div className="text-[#94A3B8] text-xs mt-0.5">{cert.categoryId}</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#94A3B8] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-[#64748B] mb-0.5">Institution</div>
                    <div className="text-sm text-white font-medium">{cert.institution}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-[#94A3B8] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-[#64748B] mb-0.5">Issued by</div>
                    <div className="text-sm text-white font-medium">{cert.issuer}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#94A3B8] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-[#64748B] mb-0.5">Event Date</div>
                    <div className="text-sm text-white font-medium">
                      {cert.eventDate} · {cert.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-[#94A3B8] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-[#64748B] mb-0.5">Credential ID</div>
                    <div className="text-sm text-white font-mono">{cert.credentialId}</div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div>
                <a
                  href={cert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all"
                  style={{
                    background: `${cert.accentColor}15`,
                    border: `1px solid ${cert.accentColor}30`,
                    color: cert.accentColor,
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Certificate
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coming soon placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 glass rounded-2xl p-8 border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <Award className="w-5 h-5 text-[#94A3B8]" />
          </div>
          <p className="text-[#94A3B8] text-sm">More certificates coming soon</p>
        </motion.div>
      </div>
    </section>
  );
}