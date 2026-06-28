'use client';
import { motion } from 'framer-motion';
import { fadeUp, staggerFast, scaleIn } from '@/lib/motion';
import { techStack } from '@/data';

const techIconSlug: Record<string, { slug: string; color: string }> = {
  'HTML5':        { slug: 'html5',        color: 'E34F26' },
  'CSS3':         { slug: 'css',         color: '1572B6' },
  'Tailwind CSS': { slug: 'tailwindcss',  color: '06B6D4' },
  'JavaScript':   { slug: 'javascript',   color: 'F7DF1E' },
  'TypeScript':   { slug: 'typescript',   color: '3178C6' },
  'React':        { slug: 'react',        color: '61DAFB' },
  'Next.js':      { slug: 'nextdotjs',    color: 'white'  },
  'PHP':          { slug: 'php',          color: '777BB4' },
  'Laravel':      { slug: 'laravel',      color: 'FF2D20' },
  'MySQL':        { slug: 'mysql',        color: '4479A1' },
  'PostgreSQL':   { slug: 'postgresql',   color: '4169E1' },
  'Git':          { slug: 'git',          color: 'F05032' },
};

function TechIcon({ name }: { name: string }) {
  const icon = techIconSlug[name];
  if (!icon) return <span className="text-2xl">🔧</span>;

  return (
    <img
      src={`https://cdn.simpleicons.org/${icon.slug}/${icon.color}`}
      alt={name}
      width={32}
      height={32}
      className="w-8 h-8 object-contain"
    />
  );
}

const categoryColor: Record<string, string> = {
  Frontend: '#38BDF8',
  Language: '#818CF8',
  Framework: '#38BDF8',
  Backend: '#34D399',
  Database: '#F472B6',
  Tools: '#FBBF24',
};

export default function TechStack() {
  return (
    <section className="section-pad bg-[#111827]/50">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-[#38BDF8] uppercase block mb-3">
            Tech Stack
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Tools of the Trade
          </h2>
          <p className="text-[#94A3B8] mt-3 max-w-xl mx-auto">
            Modern technologies I use to build fast, scalable, and maintainable web solutions.
          </p>
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
        >
          {techStack.map((tech, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="group glass rounded-xl p-4 flex flex-col items-center gap-2.5 cursor-default transition-all duration-300 hover:border-[#38BDF8]/30 hover:bg-[#38BDF8]/5 hover:-translate-y-0.5"
            >
              <TechIcon name={tech.name} />
              <div className="text-center">
                <div className="text-xs font-semibold text-white leading-tight">{tech.name}</div>
                <div
                  className="text-[10px] mt-0.5 font-medium"
                  style={{ color: categoryColor[tech.category] || '#94A3B8' }}
                >
                  {tech.category}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
