import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Jasa Website, Aplikasi & Custom Software | Stack.byAlif',
    template: '%s | Stack.byAlif',
  },
  description:
    'Membantu bisnis, UMKM, startup, dan perusahaan membangun website profesional, aplikasi web, landing page, toko online, dan software custom yang cepat, modern, dan scalable.',
  keywords: [
    'jasa pembuatan website',
    'jasa website',
    'jasa website company profile',
    'jasa website toko online',
    'jasa landing page',
    'jasa aplikasi web',
    'jasa software custom',
    'jasa web developer indonesia',
    'website bisnis',
    'website umkm',
    'custom web application',
    'software development indonesia',
  ],
  authors: [
    {
      name: 'Alif',
      url: 'https://stackbyalif.my.id',
    },
  ],
  creator: 'Alif',
  metadataBase: new URL('https://stackbyalif.my.id'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://stackbyalif.my.id',
    title: 'Jasa Website, Aplikasi & Custom Software | Stack.byAlif',
    description:
      'Website profesional, aplikasi web, landing page, toko online, dan software custom untuk membantu bisnis berkembang secara digital.',
    siteName: 'Stack.byAlif',
    images: [
      {
        url: '/images/OG-Image.png',
        width: 1200,
        height: 630,
        alt: 'Stack.byAlif - Website, Aplikasi & Custom Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jasa Website, Aplikasi & Custom Software | Stack.byAlif',
    description:
      'Website profesional, aplikasi web, landing page, toko online, dan software custom untuk bisnis modern.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Alif',
              url: 'https://stackbyalif.my.id',
              jobTitle: 'Web Developer & Software Solutions',
              description:
                'Membantu bisnis, UMKM, startup, dan perusahaan membangun website profesional, aplikasi web, landing page, toko online, dan software custom.',
              sameAs: [
                'https://github.com/apege',
                'https://instagram.com/stack.byalif',
              ],
            }),
          }}
        />
      </head>
      <body
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
