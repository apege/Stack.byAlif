export interface PricingItem {
  id: string;
  num: string;
  name: string;
  fullName: string;
  price: number;
  priceFormatted: string;
  category: 'profil' | 'commerce' | 'digital';
  categoryLabel: string;
  target: string;
  benefits: string[];
  includes: string[];
  technology: string;
  popular?: boolean;
  badge?: string;
}

export interface AddonService {
  name: string;
  price: string;
  desc?: string;
}

export interface PricingTerm {
  num: string;
  title: string;
  points: string[];
}

export const pricingPackagesData: PricingItem[] = [
  {
    id: 'starter',
    num: '01',
    name: 'Starter',
    fullName: '01. STARTER',
    price: 349000,
    priceFormatted: 'Rp349.000',
    category: 'profil',
    categoryLabel: 'Web Profil',
    target: 'Cocok untuk personal branding, profil usaha, jasa, dan bisnis yang baru memulai digitalisasi.',
    benefits: [
      'Website profil sederhana (maks. 3 halaman)',
      'Desain modern dan responsif (Mobile & Desktop)',
      'Informasi bisnis dan layanan lengkap',
      'Tombol WhatsApp direct click',
      'Informasi kontak dan peta lokasi',
      'Basic SEO (Meta tags & Google indexing ready)',
      'Setup domain dan deployment',
      'Testing hingga website online live',
    ],
    includes: [
      'Domain .my.id gratis tahun pertama',
      'Hosting Cloudflare Pages (Free & High Speed)',
      'Setup dan deployment website',
    ],
    technology: 'Next.js Static Export',
    popular: false,
  },
  {
    id: 'umkm',
    num: '02',
    name: 'UMKM',
    fullName: '02. UMKM',
    price: 599000,
    priceFormatted: 'Rp599.000',
    category: 'profil',
    categoryLabel: 'Web Profil',
    target: 'Cocok untuk toko, bisnis kuliner, jasa lokal, dan usaha kecil yang ingin tampil lebih profesional.',
    benefits: [
      'Semua fitur pada paket Starter',
      'Website maksimal 5 halaman',
      'Halaman layanan dan etalase produk',
      'Galeri foto bisnis & dokumentasi',
      'Formulir kontak terintegrasi',
      'WhatsApp dengan pesan otomatis terformat',
      'Basic SEO & performa teroptimasi',
      'Setup dan deployment hingga online',
    ],
    includes: [
      'Domain .my.id gratis tahun pertama',
      'Hosting Cloudflare (Free)',
      'Setup website hingga online live',
    ],
    technology: 'Next.js',
    popular: false,
  },
  {
    id: 'katalog',
    num: '03',
    name: 'Katalog',
    fullName: '03. KATALOG',
    price: 899000,
    priceFormatted: 'Rp899.000',
    category: 'commerce',
    categoryLabel: 'Katalog & Reservasi',
    target: 'Cocok untuk toko online, reseller, distributor, dan bisnis dengan banyak pilihan produk dinamis.',
    badge: 'Paling Populer',
    popular: true,
    benefits: [
      'Website katalog produk dinamis & interaktif',
      'Maksimal 30 produk awal siap tayang',
      'Kategori produk terstruktur',
      'Fitur pencarian produk cepat',
      'Halaman detail foto dan deskripsi produk',
      'Tombol pemesanan cepat via WhatsApp',
      'Dashboard admin untuk kelola data produk',
      'Pengelolaan tambah/edit/hapus produk',
      'Database produk terpusat',
      'Setup hingga website online live',
    ],
    includes: [
      'Domain .my.id gratis tahun pertama',
      'Hosting Cloudflare (Free)',
      'Setup database & deployment',
      'Opsi upgrade domain .com: +Rp150.000',
    ],
    technology: 'Next.js + Supabase',
  },
  {
    id: 'booking',
    num: '04',
    name: 'Booking',
    fullName: '04. BOOKING',
    price: 1299000,
    priceFormatted: 'Rp1.299.000',
    category: 'commerce',
    categoryLabel: 'Katalog & Reservasi',
    target: 'Cocok untuk villa, penginapan, barbershop, salon, rental, dan bisnis berbasis reservasi jadwal.',
    benefits: [
      'Website profil bisnis & fasilitas',
      'Sistem booking & reservasi online',
      'Formulir reservasi terstruktur',
      'Pilihan tanggal & durasi reservasi',
      'Informasi ketersediaan unit/jadwal',
      'Dashboard admin pengelola booking',
      'Pengelolaan dan update status reservasi',
      'Integrasi konfirmasi WhatsApp',
      'Database reservasi aman',
      'Setup hingga website online live',
    ],
    includes: [
      'Domain .com gratis tahun pertama',
      'Hosting Cloudflare (Free)',
      'Setup database & deployment',
    ],
    technology: 'Next.js + Supabase',
    popular: false,
  },
  {
    id: 'topup-wa',
    num: '05',
    name: 'Top-Up WA',
    fullName: '05. TOP-UP WA',
    price: 799000,
    priceFormatted: 'Rp799.000',
    category: 'digital',
    categoryLabel: 'Game & Digital',
    target: 'Cocok untuk penjual top-up game, voucher digital, dan produk digital dengan alur pesanan via WhatsApp.',
    benefits: [
      'Website toko top-up digital modern',
      'Katalog produk digital (maks. 20 produk awal)',
      'Kategori game atau voucher produk',
      'Detail harga & daftar nominal top-up',
      'Formulir input ID & data pembeli',
      'Checkout langsung terformat ke WhatsApp',
      'Dashboard admin kelola produk & harga',
      'Database produk digital terintegrasi',
      'Setup hingga website online live',
    ],
    includes: [
      'Domain .my.id gratis tahun pertama',
      'Hosting Cloudflare (Free)',
      'Setup database & deployment',
    ],
    technology: 'Next.js + Supabase',
    popular: false,
  },
  {
    id: 'topup-otomatis',
    num: '06',
    name: 'Top-Up Otomatis',
    fullName: '06. TOP-UP OTOMATIS',
    price: 1999000,
    priceFormatted: 'Rp1.999.000',
    category: 'digital',
    categoryLabel: 'Game & Digital',
    target: 'Cocok untuk bisnis top-up game dan produk digital yang ingin mengotomatisasi penuh proses transaksi.',
    badge: 'Full Automated',
    popular: true,
    benefits: [
      'Semua fitur pada Top-up WA',
      'Sistem pemesanan & transaksi otomatis 24/7',
      'Integrasi Payment Gateway resmi (QRIS, VA, E-Wallet)',
      'Callback status pembayaran instan',
      'Integrasi API supplier top-up game',
      'Pemrosesan transaksi otomatis tanpa manual',
      'Dashboard admin transaksi & mutasi lengkap',
      'Riwayat transaksi & status pesanan realtime',
      'Database transaksi terstruktur',
      'Setup Pro & konfigurasi server',
      'Testing end-to-end transaksi hingga live',
    ],
    includes: [
      'Domain .com gratis tahun pertama',
      'Hosting premium 1 tahun',
      'Setup database dan server',
      'Setup Pro dan deployment',
      'Opsi upgrade domain .id dengan bayar selisih',
    ],
    technology: 'Next.js + Laravel + MySQL/PostgreSQL',
  },
];

export const addonServicesData: AddonService[] = [
  { name: 'Tambahan Halaman', price: 'Rp75.000 / halaman', desc: 'Penambahan halaman statis / informasi baru' },
  { name: 'Copywriting Sederhana', price: 'Rp100.000', desc: 'Penyusunan teks bisnis dan penawaran yang menjual' },
  { name: 'Input Produk Tambahan', price: 'Rp5.000 / produk', desc: 'Bantu input foto, deskripsi, dan varian harga' },
  { name: 'Maintenance Bulanan', price: 'Rp50.000 – Rp150.000 / bln', desc: 'Pemantauan uptime, backup data, dan pembaruan berkala' },
  { name: 'Setup Email Bisnis', price: 'Mulai Rp100.000', desc: 'Email domain profesional (contoh: halo@bisnisanda.com)' },
  { name: 'Integrasi Payment Gateway', price: 'Mulai Rp300.000', desc: 'Daftar & integrasi QRIS/VA (+ biaya regulasi provider)' },
  { name: 'SEO Lanjutan', price: 'Mulai Rp150.000', desc: 'Riset keyword, sitemap Google Search Console, Schema markup' },
  { name: 'Fitur Custom Tambahan', price: 'Berdasarkan Estimasi', desc: 'Penyesuaian alur kerja unik sesuai kebutuhan Anda' },
  { name: 'Upgrade Kapasitas Hosting', price: 'Berdasarkan Kebutuhan', desc: 'Skalabilitas cloud server untuk trafik tinggi' },
];

export const pricingTermsData: PricingTerm[] = [
  {
    num: '01',
    title: 'Pembayaran',
    points: [
      'DP (Down Payment) sebesar 50% wajib dibayarkan sebelum pengerjaan proyek dimulai.',
      'Pelunasan sisa 50% dilakukan sebelum serah terima final akses atau publikasi website secara resmi.',
    ],
  },
  {
    num: '02',
    title: 'Revisi & Perubahan',
    points: [
      'Maksimal 2 kali revisi minor secara gratis.',
      'Revisi minor meliputi penyesuaian warna, perbaikan teks/typo, spacing, dan penggantian gambar.',
      'Revisi major seperti perombakan layout, restrukturisasi halaman, atau penambahan alur fitur dikenakan biaya tambahan.',
      'Penambahan fitur di luar ruang lingkup paket awal akan dihitung berdasarkan estimasi terpisah.',
    ],
  },
  {
    num: '03',
    title: 'Halaman & Materi Konten',
    points: [
      'Penambahan halaman di luar kuota paket dikenakan biaya Rp50.000–Rp100.000/halaman tergantung kompleksitas komponen.',
      'Materi konten (teks, foto produk, logo, dokumen legalitas) disediakan langsung oleh klien.',
      'Jasa pembuatan atau penyuntingan konten oleh tim Stack.byAlif tersedia sebagai layanan add-on tambahan.',
    ],
  },
  {
    num: '04',
    title: 'Ketentuan Domain',
    points: [
      'Domain gratis berlaku selama 1 (satu) tahun pertama sesuai paket yang dipilih.',
      'Domain didaftarkan secara transparan menggunakan akun dan identitas resmi klien agar kepemilikan 100% milik klien.',
      'Biaya perpanjangan (renewal) domain di tahun berikutnya sepenuhnya menjadi tanggung jawab klien.',
    ],
  },
  {
    num: '05',
    title: 'Hosting & Database',
    points: [
      'Hosting mengikuti kapasitas dan arsitektur paket yang dipilih (Cloudflare Pages/Supabase/VPS Premium).',
      'Layanan Cloudflare Pages Free dan Supabase Free Tier mengikuti kuota dan kebijakan resmi penyedia layanan.',
      'Hosting premium termasuk 1 tahun khusus paket yang menyediakannya (Top-Up Otomatis).',
      'Biaya langganan layanan pihak ketiga (misal: SMS OTP, WhatsApp API berbayar, provider payment gateway) ditanggung klien.',
    ],
  },
  {
    num: '06',
    title: 'Garansi & Maintenance',
    points: [
      'Garansi perbaikan bug teknis berlaku selama 14 hari kalender setelah serah terima project.',
      'Garansi hanya mencakup cacat sistem atau bug yang murni berasal dari pengerjaan kode proyek kami.',
      'Perubahan fitur baru, kerusakan akibat kelalaian modifikasi pihak luar, atau gangguan server pihak ketiga tidak tercakup garansi.',
      'Dukungan maintenance berkala dapat diambil melalui layanan kontrak add-on bulanan.',
    ],
  },
];

export function getWhatsAppPricingUrl(pkg: PricingItem): string {
  const phone = '62895412735876';
  const text = `Halo Mas Alif (Stack.byAlif),\n\nSaya tertarik untuk konsultasi pembuatan website dengan paket *${pkg.fullName}* (${pkg.priceFormatted}).\n\nBisa dibantu informasi ketersediaan jadwal dan langkah selanjutnya? Terima kasih.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function getGeneralWhatsAppPricingUrl(): string {
  const phone = '62895412735876';
  const text = `Halo Mas Alif (Stack.byAlif),\n\nSaya ingin konsultasi mengenai paket pembuatan website / sistem digital kustom. Bisa dibantu diskusi kebutuhan bisnis saya? Terima kasih.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
