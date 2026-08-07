import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: {
    default: 'Jasa Pembuatan Website & Custom Software Professional | Stack.byAlif',
    template: '%s | Stack.byAlif - Jasa Website & Web Developer',
  },
  description:
    'Jasa pembuatan website profesional, aplikasi web custom, landing page konversi tinggi, toko online, dan sistem bisnis (WMS/CRM/POS). Solusi digital cepat, modern, dan scalable untuk UMKM, Startup, Perusahaan di Indonesia & Internasional.',
  keywords: [
    // Primary High Volume ID
    'jasa pembuatan website',
    'jasa website',
    'jasa buat website',
    'jasa pembuatan web',
    'jasa web developer',
    'jasa web developer indonesia',
    'jasa pembuatan website profesional',
    'jasa website murah terpercaya',
    
    // Service Types ID
    'jasa landing page',
    'jasa landing page konversi tinggi',
    'jasa website company profile',
    'jasa pembuatan toko online',
    'jasa pembuatan e-commerce',
    'jasa aplikasi web',
    'jasa aplikasi web custom',
    'jasa software custom',
    'jasa software house indonesia',
    'jasa pembuat dashboard admin',
    'jasa sistem manajemen bisnis',
    'jasa crm wms pos custom',
    'jasa pembuatan website portofolio',
    
    // Price / Cost Intent ID
    'biaya pembuatan website',
    'harga jasa pembuatan website',
    'biaya buat website bisnis',
    'biaya buat web umkm',
    'paket jasa pembuatan website',

    // Regional Intent ID
    'jasa pembuatan website jakarta',
    'jasa pembuatan website bandung',
    'jasa pembuatan website surabaya',
    'jasa pembuatan website bali',
    'jasa pembuatan website medan',

    // Technical / Modern Stack ID
    'jasa website nextjs',
    'jasa web developer react',
    'jasa pembuat website responsif',
    'jasa optimasi seo website',
    'jasa perbaikan website',
    'jasa redesign website',

    // Global / Offshore Target EN
    'custom web development services',
    'web development agency indonesia',
    'hire nextjs developer indonesia',
    'hire react developer',
    'custom software development company',
    'affordable custom web application',
    'offshore web development services',
    'fullstack developer indonesia',
    'custom saas development agency',
    'ecommerce web development service',
  ],
  authors: [
    {
      name: 'Alif - Stack.byAlif',
      url: 'https://stackbyalif.my.id',
    },
  ],
  creator: 'Alif',
  publisher: 'Stack.byAlif',
  metadataBase: new URL('https://stackbyalif.my.id'),
  alternates: {
    canonical: 'https://stackbyalif.my.id',
    languages: {
      'id-ID': 'https://stackbyalif.my.id/id',
      'en-US': 'https://stackbyalif.my.id/en',
      'x-default': 'https://stackbyalif.my.id',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: ['en_US'],
    url: 'https://stackbyalif.my.id',
    title: 'Jasa Pembuatan Website & Custom Software Professional | Stack.byAlif',
    description:
      'Solusi jasa pembuatan website profesional, landing page, toko online e-commerce, dan software custom berkinerja tinggi untuk bisnis Anda.',
    siteName: 'Stack.byAlif',
    images: [
      {
        url: '/images/OG-Image.png',
        width: 1200,
        height: 630,
        alt: 'Stack.byAlif - Jasa Pembuatan Website & Custom Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jasa Pembuatan Website & Custom Software | Stack.byAlif',
    description:
      'Website profesional, aplikasi web, landing page, toko online, dan software custom untuk bisnis di Indonesia & Internasional.',
    images: ['/images/OG-Image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Rich Structured Data Schema Graph
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': 'https://stackbyalif.my.id/#organization',
        name: 'Stack.byAlif - Jasa Pembuatan Website & Custom Software',
        url: 'https://stackbyalif.my.id',
        logo: 'https://stackbyalif.my.id/favicon.ico',
        image: 'https://stackbyalif.my.id/images/OG-Image.png',
        description:
          'Jasa pembuatan website profesional, landing page konversi tinggi, aplikasi web custom, toko online, dan sistem bisnis terintegrasi.',
        priceRange: '$$',
        telephone: '+6281234567890',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'ID',
          addressRegion: 'Indonesia',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -6.200000,
          longitude: 106.816666,
        },
        areaServed: [
          { '@type': 'Country', name: 'Indonesia' },
          { '@type': 'Country', name: 'Worldwide' },
        ],
        knowsAbout: [
          'Website Development',
          'Custom Web Application Development',
          'Next.js & React Framework',
          'Search Engine Optimization (SEO)',
          'E-Commerce Systems',
          'Business Process Automation',
        ],
        sameAs: [
          'https://github.com/apege',
          'https://instagram.com/stack.byalif',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Layanan Jasa Pembuatan Website & Software',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Jasa Website Starter / Company Profile',
                description: 'Landing Page profesional, desain responsif, SEO dasar, dan integrasi WhatsApp.',
              },
              price: '500000',
              priceCurrency: 'IDR',
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Jasa Business System & Management Software',
                description: 'Dashboard Admin custom, manajemen stok WMS, CRM, dan sistem transaksi terpusat.',
              },
              price: '1500000',
              priceCurrency: 'IDR',
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Jasa Custom Application & Fullstack Software',
                description: 'Aplikasi web skala penuh, integrasi API, payment gateway, dan arsitektur modern.',
              },
              price: '3000000',
              priceCurrency: 'IDR',
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://stackbyalif.my.id/#website',
        url: 'https://stackbyalif.my.id',
        name: 'Stack.byAlif',
        description: 'Jasa Pembuatan Website & Custom Software Indonesia',
        publisher: {
          '@id': 'https://stackbyalif.my.id/#organization',
        },
        inLanguage: ['id-ID', 'en-US'],
      },
      {
        '@type': 'Person',
        '@id': 'https://stackbyalif.my.id/#person',
        name: 'Alif',
        jobTitle: 'Fullstack Web Developer & Software Engineer',
        url: 'https://stackbyalif.my.id',
        sameAs: [
          'https://github.com/apege',
          'https://instagram.com/stack.byalif',
        ],
      },
    ],
  };

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,500&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaGraph),
          }}
        />
      </head>
      <body
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        }}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
