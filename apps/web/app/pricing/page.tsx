import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Paket & Harga Pembuatan Website & Sistem Bisnis | Stack.byAlif',
  description:
    'Daftar harga dan paket pembuatan website profesional, toko online, sistem booking reservasi, dan platform top-up game mulai dari Rp349.000. Domain gratis, Cloudflare hosting, dan teknologi modern Next.js + Supabase.',
  keywords: [
    'harga jasa pembuatan website',
    'biaya pembuatan website',
    'paket website umkm',
    'jasa web murah terpercaya',
    'biaya bikin website toko online',
    'jasa website booking reservasi',
    'jasa web top up game otomatis',
    'stackbyalif pricing',
  ],
  alternates: {
    canonical: 'https://stackbyalif.my.id/pricing',
  },
  openGraph: {
    title: 'Paket & Harga Pembuatan Website & Sistem Bisnis | Stack.byAlif',
    description:
      'Pricelist transparan solusi website & sistem digital Stack.byAlif mulai dari Rp349.000. Lengkap dengan domain, hosting, dan garansi maintenance.',
    url: 'https://stackbyalif.my.id/pricing',
    siteName: 'Stack.byAlif',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
