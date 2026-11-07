import { use } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import Services from '@/components/sections/Services';
import WorkProcess from '@/components/sections/WorkProcess';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ lang: 'id' }, { lang: 'en' }];
}

export default function LangPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = use(params);
  if (resolvedParams.lang !== 'id' && resolvedParams.lang !== 'en') {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <Projects />
      <Services />
      <WorkProcess />
      <Contact />
      <Footer />
    </main>
  );
}
