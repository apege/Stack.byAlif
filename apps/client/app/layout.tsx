import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Client Registration & Agreement Portal | Stack.byAlif',
  description: 'Portal resmi registrasi proyek, administrasi domain, dan verifikasi dokumen kerja sama Stack.byAlif.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
