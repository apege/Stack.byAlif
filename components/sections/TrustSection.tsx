'use client';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

const companies = [
  'Jumpscare Industriez', 'Vision 9 Store', 'MLR Game Store',
  'KingVillaBali', 'Personal Client',
];

export default function TrustSection() {
  return (
    <section className="py-16 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-xs font-semibold tracking-[0.2em] text-[#94A3B8] uppercase mb-10"
        >
          Trusted by Businesses &amp; Clients
        </motion.p>

        {/* Logo wall */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6"
        >
          {companies.map((company, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group flex items-center gap-2 opacity-40 hover:opacity-75 transition-opacity duration-300"
            >
              {/* Placeholder logo icon */}
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                <span className="text-[9px] font-black text-white">{company[0]}</span>
              </div>
              <span className="text-sm font-semibold text-[#94A3B8] tracking-wide group-hover:text-white transition-colors">
                {company}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
