import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import TrustSection from '@/components/sections/TrustSection';
import About from '@/components/sections/About';
import Achievements from '@/components/sections/Achievements';
import TechStack from '@/components/sections/TechStack';
import Projects from '@/components/sections/Projects';
import Services from '@/components/sections/Services';
import WorkProcess from '@/components/sections/WorkProcess';
import Testimonials from '@/components/sections/Testimonials';
// import BlogPreview from '@/components/sections/BlogPreview';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustSection />
      <About />
      <Achievements />
      <TechStack />
      <Projects />
      <Services />
      <WorkProcess />
      <Testimonials />
      {/* <BlogPreview /> */}
      <Contact />
      <Footer />
    </main>
  );
}
