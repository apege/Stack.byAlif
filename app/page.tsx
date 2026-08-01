import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import TrustSection from '@/components/sections/TrustSection';
import BusinessProblems from '@/components/sections/BusinessProblems';
import Services from '@/components/sections/Services';
import Projects from '@/components/sections/Projects';
import Pricing from '@/components/sections/Pricing';
import About from '@/components/sections/About';
import WorkProcess from '@/components/sections/WorkProcess';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustSection />
      <BusinessProblems />
      {/* <Services /> */}
      <Projects />
      <Pricing />
      <About />
      <WorkProcess />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}

