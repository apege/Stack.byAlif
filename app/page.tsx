import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import BusinessProblems from '@/components/sections/BusinessProblems';
import Services from '@/components/sections/Services';
import Pricing from '@/components/sections/Pricing';
import Projects from '@/components/sections/Projects';
import WorkProcess from '@/components/sections/WorkProcess';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <BusinessProblems />
      <Services />
      <Pricing />
      <Projects />
      <WorkProcess />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
