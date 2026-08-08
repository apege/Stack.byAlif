import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import Services from '@/components/sections/Services';
import WorkProcess from '@/components/sections/WorkProcess';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

export default function Home() {
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
