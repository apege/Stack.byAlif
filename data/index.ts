import { Project, Testimonial, Service, BlogPost, BusinessProblem, PricingPackage, FaqItem } from '@/types';

export const businessProblems: BusinessProblem[] = [
  {
    id: 1,
    icon: 'FileSpreadsheet',
    problem: 'Operasional Masih Manual',
    description: 'Pencatatan pesanan, inventaris, atau laporan bisnis masih menggunakan spreadsheet/kertas yang memakan waktu dan rawan kesalahan.',
    solution: 'Pengembangan sistem manajemen otomatisasi internal yang terpusat dan efisien.',
  },
  {
    id: 2,
    icon: 'DatabaseZap',
    problem: 'Data Bisnis Tidak Terstruktur',
    description: 'Informasi pelanggan, stok barang, dan riwayat transaksi tersebar di banyak tempat sehingga sulit dianalisis.',
    solution: 'Database terintegrasi dengan dashboard analitik real-time untuk pengambilan keputusan cepat.',
  },
  {
    id: 3,
    icon: 'BarChart3',
    problem: 'Sulit Monitoring Transaksi',
    description: 'Pemilik bisnis kesulitan memantau arus kas, status pesanan harian, dan performa tim secara real-time.',
    solution: 'Aplikasi dashboard admin modern dengan notifikasi otomatis dan laporan komprehensif.',
  },
  {
    id: 4,
    icon: 'Layers',
    problem: 'Membutuhkan Sistem Custom',
    description: 'Aplikasi pasaran (SaaS siap pakai) terlalu mahal, tidak fleksibel, atau tidak sesuai dengan alur kerja spesifik bisnis Anda.',
    solution: 'Software kustom tailor-made yang dibangun khusus sesuai skala & kebutuhan proses bisnis Anda.',
  },
];

export const pricingPackages: PricingPackage[] = [
  {
    id: 1,
    name: 'Website Starter',
    price: 'Rp 500.000',
    description: 'Cocok untuk UMKM & bisnis yang membutuhkan kehadiran digital profesional dan meningkatkan kredibilitas.',
    features: [
      'Landing Page / Company Profile',
      'Desain Responsive & Modern',
      'Integrasi WhatsApp CTA',
      'SEO Basic & Optimasi Kecepatan',
      'Hosting & Domain Setup',
      'Revisi & Dukungan Teknis',
    ],
    recommendedFor: 'UMKM, Profil Perusahaan, Landing Page Promo',
  },
  {
    id: 2,
    name: 'Business System',
    badge: 'Paling Populer',
    isPopular: true,
    price: 'Rp 1.500.000',
    description: 'Sistem internal kustom untuk mengelola operasional, transaksi, inventaris, dan data bisnis terpusat.',
    features: [
      'Custom Dashboard Admin & User',
      'Manajemen Data / WMS / CRM / POS',
      'Notifikasi WhatsApp & Email',
      'Fitur Export Laporan (PDF/Excel)',
      'Hak Akses Multi-User / Role',
      'Garansi Pemeliharaan 3 Bulan',
    ],
    recommendedFor: 'Perusahaan Kecil-Menengah, Yayasan, Retail',
  },
  {
    id: 3,
    name: 'Custom Application',
    price: 'Rp 3.000.000',
    description: 'Solusi perangkat lunak lengkap dan kompleks yang disesuaikan penuh dengan proses bisnis unik Anda.',
    features: [
      'Arsitektur Software Scalable',
      'Integrasi Payment Gateway / API',
      'Aplikasi Web & Mobile Dynamic',
      'Keamanan Data & Backup Otomatis',
      'Dokumentasi Lengkap & SOK',
      'Dukungan Prioritas & Maintenance',
    ],
    recommendedFor: 'Startup, E-Commerce Kompleks, Platform SaaS',
  },
];

export const services: Service[] = [
  {
    id: 1,
    icon: 'Globe',
    title: 'Website Development',
    description:
      'Membangun website profesional untuk meningkatkan kredibilitas, membangun impresi pertama yang kuat, dan memperluas jangkauan bisnis Anda.',
    features: [
      'Landing Page & Company Profile',
      'SEO & Performance Optimization',
      'Desain Responsive Desktop & Mobile',
      'Integrasi WhatsApp & Lead Capture',
      'Kecepatan Load Tinggi (Lighthouse 90+)',
    ],
    price: 'Mulai Rp 500.000',
  },
  {
    id: 2,
    icon: 'LayoutDashboard',
    title: 'Business System',
    description:
      'Membuat sistem internal kustom untuk membantu bisnis mengelola data, otomatisasi operasional, inventaris, dan laporan transaksi secara real-time.',
    features: [
      'Dashboard Analitik & Admin',
      'Sistem Manajemen Stok & WMS',
      'CRM & Pengelolaan Pelanggan',
      'Multi-user Role & Security',
      'Laporan Keuangan & Laporan Operasional',
    ],
    price: 'Mulai Rp 2.500.000',
  },
  {
    id: 3,
    icon: 'ShoppingBag',
    title: 'E-Commerce Platform',
    description:
      'Membangun platform penjualan online mandiri yang disesuaikan dengan kebutuhan bisnis tanpa komisi pihak ketiga.',
    features: [
      'Katalog Produk Interaktif',
      'Integrasi Payment Gateway',
      'Manajemen Pesanan & Resi',
      'WhatsApp Order Automation',
      'Sistem Diskon & Promo Code',
    ],
    price: 'Mulai Rp 1.500.000',
  },
  {
    id: 4,
    icon: 'MonitorSmartphone',
    title: 'Custom Software Solution',
    description:
      'Pengembangan aplikasi web kustom yang dibangun sesuai dengan masalah dan alur kerja spesifik bisnis Anda.',
    features: [
      'Aplikasi Web Skala Menengah/Besar',
      'Integrasi API & Third-party',
      'Automated Workflow & Poster Generator',
      'Database Architecture yang Aman',
      'Maintenance & Pemeliharaan Rutin',
    ],
    price: 'Mulai Rp 5.000.000',
  },
];

export const projects: Project[] = [
  {
    slug: 'bloxy-lucy',
    title: 'Sistem Platform Merchant Digital & Otomatisasi Transaksi Top-Up',
    shortDesc: 'Platform merchant digital (top-up & game voucher) end-to-end dengan verifikasi otomatis & analitik laba',
    description: 'Sistem platform web merchant digital end-to-end untuk transaksi top-up dan game voucher dengan verifikasi ID pemain otomatis, payment flow QRIS, order dispatching, dan dashboard analitik laba.',
    thumbnail: '/images/bloxylucy/bloxylucy.png',
    year: '2026',
    tags: [
      'Digital Merchant',
      'Game Voucher & Top-Up',
      'QRIS Payment Flow',
      'Order Dispatching',
      'Admin Analytics'
    ],
    liveUrl: 'https://bloxylucy.com/',
    githubUrl: '',
    overview: 'Stack.byAlif merancang platform web merchant digital (top-up & game voucher) end-to-end yang memadukan pengalaman transaksi pelanggan yang mulus dengan sistem manajemen operasional terpadu.\n\nSolusi ini mencakup verifikasi ID pemain otomatis via API, payment flow berbasis QRIS dengan pengunggahan bukti bayar teroptimasi, manajemen lifecycle status pesanan (order dispatching), kebijakan retensi penyimpanan otomatis, serta dashboard laporan omset dan laba interaktif bagi pemilik bisnis.\n\nImplementasi sistem ini menghadirkan efisiensi alur kerja operasional toko, mencegah pesanan ganda atau ulasan palsu melalui order token verification, dan memberikan visibilitas penuh terhadap performa penjualan secara real-time.',
    challenge: 'Pengelolaan transaksi top-up game konvensional rentan mengalami kendala verifikasi ID akun manual yang rawan salah, validasi pembayaran lambat, risiko pesanan ganda atau ulasan palsu, serta ketiadaan monitoring laba bersih secara real-time.',
    process: 'Stack.byAlif membangun arsitektur platform merchant terpadu dengan integrasi verifikasi ID via API, payment flow berbasis QRIS yang teroptimasi, order token verification, manajemen dispatching pesanan, serta dashboard laporan omset dan laba interaktif.',
    results: 'Meningkatkan efisiensi alur kerja operasional toko secara signifikan, mencegah transaksi ganda serta ulasan palsu, dan memberikan visibilitas penuh terhadap performa penjualan dan margin laba secara real-time.',
    gallery: [],
  },
  {
    slug: 'king-villa-bali',
    title: 'Sistem Reservasi & Manajemen Properti Villa',
    shortDesc: 'Platform reservasi villa terpadu dan sistem manajemen operasional properti',
    description: 'Sistem pendampingan dan pengembangan platform reservasi villa terpadu serta manajemen operasional properti untuk memastikan efisiensi pengelolaan unit dan optimalisasi layanan reservasi.',
    thumbnail: '/images/kingvillabali/kingvillabali.png',
    year: '2026',
    tags: [
      'Hospitality System',
      'Booking Engine',
      'WhatsApp Automation',
      'Admin Dashboard',
      'Property Management'
    ],
    liveUrl: 'https://kingvillabali.com/',
    githubUrl: '',
    overview: 'Stack.byAlif memberikan layanan pendampingan dan pengembangan sistem terpadu dalam rangka memastikan implementasi serta pengelolaan platform reservasi villa berjalan secara optimal.\n\nPendampingan ini mencakup aspek strategis dan operasional, mulai dari evaluasi alur reservasi tamu, optimalisasi manajemen ketersediaan unit, hingga peningkatan efektivitas pemanfaatan teknologi digital untuk memperluas jangkauan wisatawan lokal maupun mancanegara.\n\nSelain itu, dilakukan identifikasi kendala pada proses booking konvensional serta penyusunan rekomendasi perbaikan yang fleksibel dan aplikatif. Fokus utama adalah memastikan platform reservasi dapat digunakan secara maksimal oleh seluruh tim operasional dan mengotomatiskan konfirmasi layanan via WhatsApp secara terstruktur.',
    challenge: 'Proses pemesanan sebelumnya masih dilakukan secara manual dan terpisah, mengakibatkan kelambatan waktu respon saat peak season dan potensi miskomunikasi data ketersediaan kamar.',
    process: 'Stack.byAlif merancang arsitektur sistem reservasi terpusat dengan fitur pencarian ketersediaan real-time, kalkulasi penawaran promo dinamis, dashboard pengelola properti, dan otomatisasi pengiriman draf pesanan langsung ke WhatsApp customer service.',
    results: 'Melalui pendampingan dan implementasi sistem ini, pengelolaan reservasi villa berjalan lebih efektif, terintegrasi, dan meningkatkan efisiensi operasional hingga 60% serta memberikan pengalaman pemesanan yang responsif bagi calon tamu.',
    gallery: [],
  },
  {
    slug: 'jumpscare-industriez',
    title: 'Sistem E-Commerce & Manajemen Inventaris Retail',
    shortDesc: 'Platform toko online mandiri dengan integrasi pembayaran otomatis dan kontrol stok',
    description: 'Sistem e-commerce dan manajemen operasional retail kustom untuk mengoptimalkan proses transaksi online, pengelolaan katalog produk, serta otomatisasi verifikasi pembayaran.',
    thumbnail: '/images/jumpscareindustriez/jumpscareindustriez.png',
    year: '2025',
    tags: [
      'E-Commerce',
      'Payment Gateway',
      'Inventory Control',
      'Order Tracking',
      'Fashion Retail'
    ],
    liveUrl: 'https://jumpscareindustriez.com/',
    githubUrl: '',
    overview: 'Stack.byAlif memberikan layanan pendampingan dan pengembangan platform e-commerce retail dalam rangka memastikan pengelolaan sistem penjualan dan inventaris berjalan secara mandiri dan optimal.\n\nPendampingan ini mencakup evaluasi alur belanja pengguna (checkout flow), otomatisasi verifikasi pembayaran melalui payment gateway, hingga efisiensi pemantauan stok produk secara real-time tanpa bergantung pada platform pihak ketiga.\n\nFokus utama pendampingan adalah membangun infrastruktur transaksi independen yang memiliki performa tinggi, tingkat keamanan yang baik, serta antarmuka intuitif yang disesuaikan dengan identitas brand.',
    challenge: 'Ketergantungan pada marketplace menyebabkan terbatasnya fleksibilitas promosi, adanya potongan komisi tinggi, dan proses rekapitulasi pesanan harian yang memakan waktu.',
    process: 'Stack.byAlif membangun platform e-commerce dengan sistem keranjang belanja dinamis, integrasi payment gateway otomatis, serta panel administrasi terpusat untuk memantau status pembayaran dan riwayat pesanan.',
    results: 'Implementasi platform berhasil memotong waktu pemrosesan pesanan admin, meningkatkan angka konversi penjualan langsung, dan memberikan kendali penuh atas data serta margin bisnis secara berkelanjutan.',
    gallery: [],
  },
  {
    slug: 'vision9-store',
    title: 'Sistem Operasional Transaksi Digital & Otomatisasi Media Marketing',
    shortDesc: 'Platform manajemen transaksi voucher digital dengan generator poster promosi harian',
    description: 'Sistem otomatisasi operasional transaksi merchant digital serta modul pembuat materi promosi visual harian untuk efisiensi pemasaran dan pencatatan arus kas.',
    thumbnail: '/images/vision9store/vision9store.png',
    year: '2025',
    tags: [
      'Digital Commerce',
      'WhatsApp Order Automation',
      'Poster Generator',
      'Admin Dashboard',
      'Business Workflow'
    ],
    liveUrl: 'https://vision9store.com/',
    githubUrl: '',
    overview: 'Stack.byAlif memberikan layanan pendampingan dan pengoptimalan sistem transaksi digital harian serta otomatisasi workflow operasional bisnis.\n\nPendampingan mencakup analisis beban kerja operasional admin, digitalisasi proses pemesanan melalui integrasi formulir dinamis WhatsApp, hingga pengembangan modul inovatif pembuat poster promo (materi pemasaran visual) otomatis dalam satu klik.\n\nMelalui pendekatan terstruktur ini, alur kerja bisnis diselaraskan agar pengelola dapat berfokus pada pengembangan skala usaha dan pelayanan pelanggan tanpa terhambat oleh pekerjaan manual yang berulang.',
    challenge: 'Tinggi volume transaksi harian dan kebutuhan pembaruan harga promo media sosial secara terus-menerus menguras waktu operasional tim admin hingga belasan jam tiap minggu.',
    process: 'Stack.byAlif mengimplementasikan antarmuka pemesanan cepat berbasis web, dashboard rekapitulasi transaksi real-time, serta generator poster promosi otomatis yang menghasilkan gambar siap posting.',
    results: 'Menghemat lebih dari 15 jam kerja operasional per minggu, mempercepat pemrosesan transaksi pelanggan, serta menjaga konsistensi publikasi materi promosi bisnis secara efisien.',
    gallery: [],
  },
  {
    slug: 'mlr-game-store',
    title: 'Sistem Manajemen Katalog & Otomatisasi Pesanan Merchant',
    shortDesc: 'Platform operasional merchant digital dengan alur pesan terstruktur & rekapitulasi data',
    description: 'Sistem operasional kustom merchant digital untuk pemrosesan katalog produk dinamis, rekapitulasi pesanan harian, dan otomatisasi alur komunikasi transaksi pelanggan.',
    thumbnail: '/images/mlrgamestore/mlrgamestore.png',
    year: '2025',
    tags: [
      'Digital Store',
      'Process Automation',
      'Transaction Dashboard',
      'Marketing Automation'
    ],
    liveUrl: 'https://mlrgamestore.com/',
    githubUrl: '',
    overview: 'Stack.byAlif memberikan layanan pendampingan pengolahan sistem merchant digital guna memastikan operasional pencatatan katalog dan pemrosesan pesanan pelanggan berjalan teratur dan efisien.\n\nPendampingan ini berfokus pada penyusunan tata kelola data produk digital yang fleksibel, otomatisasi format draf transaksi, serta penyediaan dashboard laporan transaksi yang informatif bagi pemilik usaha.\n\nPendekatan ini memastikan setiap transaksi terdata secara transparan dan memperkecil risiko human error dalam penginputan kode voucher maupun harga produk.',
    challenge: 'Perubahan harga produk digital yang cepat dan banyaknya varian item membuat pembaruan data secara manual menjadi rentan kesalahan dan lambat.',
    process: 'Stack.byAlif menyusun arsitektur platform yang dapat memperbarui kategori produk secara fleksibel, mengintegrasikan sistem checkout cepat via WhatsApp, dan menyediakan rekapitulasi arus transaksi terpusat.',
    results: 'Meningkatkan kelancaran dan efisiensi operasional transaksi harian serta memberikan visibilitas penuh terhadap performa penjualan merchant secara real-time.',
    gallery: [],
  },
  {
    slug: 'kamus-bahasa-gaul',
    title: 'Sistem Direktori & Pencarian Informasi Digital Real-Time',
    shortDesc: 'Aplikasi pencarian & direktori istilah interaktif berbasis performa tinggi',
    description: 'Sistem direktori digital dan aplikasi pencarian informasi instan berbasis web yang dirancang untuk akses data cepat, responsif, dan terstruktur.',
    thumbnail: '/images/kamus/kamus.png',
    year: '2024',
    tags: [
      'Web Application',
      'Real-time Search',
      'Lightweight Architecture',
      'Responsive UI'
    ],
    liveUrl: 'https://frolicking-bavarois-ad126d.netlify.app/',
    githubUrl: '',
    overview: 'Stack.byAlif memberikan layanan pendampingan dan pengembangan sistem aplikasi direktori digital dalam rangka menghadirkan akses informasi yang cepat dan efisien bagi pengguna.\n\nPendampingan ini berfokus pada optimasi arsitektur frontend, pencarian data instan tanpa reload halaman, serta pemangkasan beban transfer data pada perangkat seluler maupun desktop.\n\nFokus utama adalah memastikan antarmuka direktori dapat merespons kueri pengguna secara instan (real-time) dengan tingkat ketersediaan tinggi dan performa sistem yang optimal.',
    challenge: 'Kebutuhan akan sistem pencarian yang instan dan ramah kuota tanpa kompromi pada kecepatan akses antarmuka.',
    process: 'Stack.byAlif merancang struktur pencarian client-side teroptimasi dengan tampilan UI minimalis, modern, dan cepat diakses dari berbagai jenis perangkat.',
    results: 'Menghasilkan sistem pencarian direktori yang sangat responsif dengan pencapaian skor performa Lighthouse 100% serta navigasi informasi yang seamless.',
    gallery: [],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Jumpscare Industries',
    role: 'Brand Owner',
    company: 'Jumpscare Industries',
    content:
      'Sangat puas dengan hasil website e-commerce yang dibangun oleh Stack.byAlif. Komunikasi sangat jelas, paham kebutuhan bisnis kami, pengerjaan tepat waktu, dan hasilnya mampu meningkatkan penjualan toko online kami.',
    avatar: '/images/avatars/jumpscare.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Vision9 Store',
    role: 'Operations Lead',
    company: 'Vision9 Store',
    content:
      'Sistem bisnis dan otomasi poster yang dibuat sangat membantu operasional harian kami. Dulu buat poster promo butuh waktu lama, sekarang sekali klik selesai. Sangat direkomendasikan untuk solusi bisnis!',
    avatar: '/images/avatars/vision.png',
    rating: 5,
  },
  {
    id: 3,
    name: 'MLR Game Store',
    role: 'Business Owner',
    company: 'MLR Game Store',
    content:
      'Pelayanan sangat responsif dan profesional. Semua kebutuhan fitur transaksi bisnis berhasil diimplementasikan dengan sangat rapi dan sistem berjalan tanpa hambatan.',
    avatar: '/images/avatars/mlr.png',
    rating: 5,
  },
  {
    id: 4,
    name: 'King Villa Bali',
    role: 'Management',
    company: 'King Villa Bali',
    content:
      'Website reservasi villa buatan Stack.byAlif membuat tampilan bisnis kami jauh lebih premium di mata wisatawan. Proses booking jadi sangat praktis dan cepat.',
    avatar: '/images/avatars/kingvilla.jpeg',
    rating: 5,
  },
];

export const techStack = [
  { name: 'HTML5', category: 'Frontend' },
  { name: 'CSS3', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'JavaScript', category: 'Language' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Framework' },
  { name: 'Laravel', category: 'Framework' },
  { name: 'PHP', category: 'Backend' },
  { name: 'MySQL', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Git', category: 'Tools' },
];

export const workProcess = [

  {
    step: '01',
    title: 'Konsultasi Kebutuhan',
    description:
      'Diskusi mendalam untuk memahami alur bisnis Anda, kendala operasional yang dihadapi, serta target yang ingin dicapai.',
  },
  {
    step: '02',
    title: 'Perencanaan Solusi',
    description:
      'Merumuskan spesifikasi sistem, struktur fitur, estimasi waktu, dan anggaran transparan sebelum pengembangan dimulai.',
  },
  {
    step: '03',
    title: 'Desain UI/UX & Prototipe',
    description:
      'Merancang antarmuka bersih, modern, dan intuitif yang mengedepankan pengalaman pengguna serta citra profesional bisnis Anda.',
  },
  {
    step: '04',
    title: 'Pengembangan Sistem',
    description:
      'Membangun sistem dengan kode berkualitas tinggi, performa cepat, keamanan baik, dan skala yang dapat dikembangkan di masa depan.',
  },
  {
    step: '05',
    title: 'Peluncuran & Garansi',
    description:
      'Pengujian akhir, penyiapan server, serah terima sistem, serta pendampingan dan garansi pemeliharaan pasca-launching.',
  },
];

export const faqData: FaqItem[] = [
  {
    id: 1,
    question: 'Berapa biaya jasa pembuatan website & aplikasi custom di Stack.byAlif?',
    answer:
      'Biaya jasa pembuatan website mulai dari Rp 500.000 untuk Landing Page / Company Profile UMKM. Untuk Business System & E-Commerce mulai Rp 1.500.000 hingga Rp 3.000.000+, dan Custom Software Application disesuaikan dengan tingkat kompleksitas fitur. Kami mengedepankan transparansi tanpa biaya tersembunyi.',
  },
  {
    id: 2,
    question: 'Berapa lama proses pembuatan website hingga siap diakses (go-live)?',
    answer:
      'Waktu pengerjaan bergantung pada skala proyek. Landing page & website starter biasanya selesai dalam 3–7 hari kerja. Sistem bisnis & e-commerce membutuhkan waktu 1–3 minggu. Untuk software custom aplikasi web skala menengah/besar, waktu pengerjaan berkisar 3–6 minggu dengan laporan progres berkala.',
  },
  {
    id: 3,
    question: 'Apakah pembuatan website sudah termasuk domain, hosting, dan optimasi SEO?',
    answer:
      'Ya! Seluruh paket jasa website kami sudah mencakup setup domain (.com / .id / .my.id), hosting berkinerja tinggi, sertifikat keamanan SSL HTTPS gratis, serta optimasi SEO On-Page dasar (meta title, description, schema markup, dan sitemap Google).',
  },
  {
    id: 4,
    question: 'Apakah Stack.byAlif menerima pembuatan website untuk klien luar negeri (International Clients)?',
    answer:
      'Tentu saja! Kami berpengalaman melayani klien internasional (US, Singapore, Europe, Australia) yang membutuhkan jasa web developer profesional, offshore software development, serta pembuatan web app berbasis Next.js & React dengan harga sangat kompetitif.',
  },
  {
    id: 5,
    question: 'Apa keunggulan menggunakan custom code (Next.js / React) dibanding WordPress / Template?',
    answer:
      'Website custom dengan Next.js / React memiliki kecepatan loading jauh lebih tinggi (Lighthouse score 90+), tingkat keamanan jauh lebih aman dari hacker, fleksibilitas penuh tanpa batasan plugin, serta kemudahan integrasi dengan API, payment gateway, dan sistem internal bisnis.',
  },
  {
    id: 6,
    question: 'Apakah website bisa diatur sendiri dan diberi garansi pemeliharaan?',
    answer:
      'Bisa! Kami menyediakan dashboard admin khusus yang mudah digunakan untuk mengelola konten, produk, dan laporan. Selain itu, kami memberikan garansi pemeliharaan teknis & pembenahan bug gratis selama 3 hingga 6 bulan pasca peluncuran.',
  },
  {
    id: 7,
    question: 'Bagaimana alur pembayaran dan konsultasi proyek?',
    answer:
      'Konsultasi kebutuhan awal 100% GRATIS via WhatsApp atau Online Meeting. Pembayaran dilakukan secara bertahap (Down Payment 30-50% di awal, dan sisanya setelah website selesai dan dites secara menyeluruh sebelum go-live).',
  },
];


