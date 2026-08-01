import { Project, Testimonial, Service, BlogPost, BusinessProblem, PricingPackage } from '@/types';

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
    slug: 'king-villa-bali',
    title: 'King Villa Bali',
    shortDesc: 'Platform reservasi villa mewah & sistem manajemen properti terintegrasi',
    description: 'Sistem reservasi villa dan manajemen properti terpadu untuk King Villa Bali, menyederhanakan alur reservasi tamu serta otomatisasi promosi.',
    thumbnail: '/images/kingvillabali/home.png',
    tags: [
      'Hospitality System',
      'Booking Engine',
      'WhatsApp Automation',
      'Admin Dashboard',
      'Property Management'
    ],
    liveUrl: 'https://kingvillabali.com/',
    githubUrl: '',
    overview: 'King Villa Bali membutuhkan platform terpusat untuk menampilkan inventaris villa mewah, menerima formulir booking dinamis dari pengunjung luar negeri/lokal, mengelola promo khusus, serta mempercepat konfirmasi via WhatsApp.',
    challenge: 'Proses pemesanan sebelumnya masih serba manual dan kurang terstruktur, mengakibatkan waktu respon lambat dan potensi hilangnya calon tamu saat periode high-season.',
    process: 'Stack.byAlif merancang platform reservasi berbasis web dengan sistem pencarian ketersediaan tanggal, kalkulasi promo otomatis, dashboard admin untuk update harga/fasilitas, dan otomasi pengiriman draf reservasi langsung ke WhatsApp customer service.',
    results: 'Meningkatkan efisiensi pengelolaan unit villa hingga 60%, mempercepat proses konfirmasi reservasi tamu, dan meningkatkan citra profesional properti di mata wisatawan.',
    gallery: [
      '/images/kingvillabali/home.png',
      '/images/kingvillabali/villa.png',
      '/images/kingvillabali/detail.png',
      '/images/kingvillabali/detail2.png',
      '/images/kingvillabali/detail3.png',
      '/images/kingvillabali/kontak.png',
      '/images/kingvillabali/dashboard.png',
      '/images/kingvillabali/booking.png',
      '/images/kingvillabali/poster.png',
    ],
  },
  {
    slug: 'jumpscare-industriez',
    title: 'Jumpscare Industriez',
    shortDesc: 'Platform e-commerce fashion streetwear dengan payment gateway terintegrasi',
    description: 'Platform toko online kustom untuk brand fashion Jumpscare Industriez yang memungkinkan pembelian langsung, integrasi pembayaran otomatis, dan manajemen inventaris.',
    thumbnail: '/images/jumpscareindustriez/home.png',
    tags: [
      'E-Commerce',
      'Payment Gateway',
      'Inventory Control',
      'Order Tracking',
      'Fashion Retail'
    ],
    liveUrl: 'https://jumpscareindustriez.com/',
    githubUrl: '',
    overview: 'Mengembangkan platform e-commerce fashion streetwear secara mandiri agar brand dapat memegang kendali penuh atas data pembeli, katalog produk, dan margin transaksi tanpa bergantung pada marketplace.',
    challenge: 'Brand membutuhkan toko online yang tidak hanya tampil stylish khas streetwear tetapi juga mampu menangani checkout secara lancar, verifikasi pembayaran otomatis, dan manajemen stok real-time.',
    process: 'Stack.byAlif merancang antarmuka e-commerce berkinerja tinggi, mengimplementasikan sistem keranjang belanja interaktif, mengintegrasikan payment gateway otomatis, serta menyediakan admin panel intuitif untuk memantau stok dan status pesanan.',
    results: 'Berhasil meluncurkan toko online independen yang meningkatkan conversion rate pembelian produk, memangkas waktu proses admin pesanan, dan meningkatkan trust pelanggan.',
    gallery: [
      '/images/jumpscareindustriez/home.png',
      '/images/jumpscareindustriez/katalog.png',
      '/images/jumpscareindustriez/checkout.png',
      '/images/jumpscareindustriez/cart.png',
      '/images/jumpscareindustriez/admin_home.png',
      '/images/jumpscareindustriez/admin_produk.png',
      '/images/jumpscareindustriez/admin_order.png',
    ],
  },
  {
    slug: 'vision9-store',
    title: 'Vision9 Store',
    shortDesc: 'Sistem bisnis top-up produk digital & otomatisasi pembuat poster promosi',
    description: 'Platform manajemen bisnis top-up game dengan formulir pemesanan otomatis, manajemen transaksi harian, dan generator poster promosi otomatis untuk pemasaran sosial media.',
    thumbnail: '/images/vision9store/home.png',
    tags: [
      'Digital Commerce',
      'WhatsApp Order Automation',
      'Poster Generator',
      'Admin Dashboard',
      'Business Workflow'
    ],
    liveUrl: 'https://vision9store.com/',
    githubUrl: '',
    overview: 'Platform bisnis operasional untuk Vision9 Store yang menangani ribuan transaksi top-up voucher digital serta menyediakan fitur unik pembuat materi promosi visual otomatis.',
    challenge: 'Pemilik bisnis menghabiskan waktu bertam-jam secara manual mengolah formulir pesanan pembeli dan membuat poster harga harian untuk Instagram/WhatsApp.',
    process: 'Stack.byAlif membangun sistem order berbasis dinamis yang langsung menghasilkan pesan terstruktur ke WhatsApp, disertai modul admin untuk mencatat arus transaksi dan tool otomatis pembuatan poster promosi dengan sekali klik.',
    results: 'Menghemat hingga 15+ jam kerja operasional admin per minggu, mempercepat pemrosesan transaksi pelanggan, dan mempercepat rilis materi promosi harian.',
    gallery: [
      '/images/vision9store/home.png',
      '/images/vision9store/produk.png',
      '/images/vision9store/testimoni.png',
      '/images/vision9store/detail.png',
      '/images/vision9store/dashboard.png',
      '/images/vision9store/transaksi.png',
      '/images/vision9store/poster.png',
    ],
  },
  {
    slug: 'mlr-game-store',
    title: 'MLR Game Store',
    shortDesc: 'Platform operasional merchant digital dengan otomasi pemesanan & laporan',
    description: 'Sistem operasional kustom untuk bisnis voucher digital MLR Game Store dengan alur transaksi WhatsApp otomatis dan pengolahan katalog produk dinamis.',
    thumbnail: '/images/mlrgamestore/home.png',
    tags: [
      'Digital Store',
      'Process Automation',
      'Transaction Dashboard',
      'Marketing Automation'
    ],
    liveUrl: 'https://mlrgamestore.com/',
    githubUrl: '',
    overview: 'Mengembangkan sistem merchant digital terintegrasi yang menyederhanakan alur pemesanan produk gaming bagi pelanggan serta mempermudah rekap inventaris bagi pengelola bisnis.',
    challenge: 'Tinggi variasi produk digital membutuhkan sistem yang fleksibel untuk memperbarui daftar harga dan varian tanpa mengganggu proses transaksi yang sedang berjalan.',
    process: 'Merancang arsitektur web modern yang ringan dan cepat, melengkapi panel kelola kategori & produk dinamis, serta mengintegrasikan otomasi format pesan order WhatsApp.',
    results: 'Meningkatkan efisiensi pemrosesan pesanan harian dan memberikan transparansi data transaksi bagi pengelola toko.',
    gallery: [
      '/images/mlrgamestore/home.png',
      '/images/mlrgamestore/produk.png',
      '/images/mlrgamestore/detail.png',
      '/images/mlrgamestore/dashboard.png',
      '/images/mlrgamestore/transaksi.png',
      '/images/mlrgamestore/poster.png',
    ],
  },
  {
    slug: 'kamus-bahasa-gaul',
    title: 'Kamus Bahasa Gaul',
    shortDesc: 'Aplikasi pencarian & direktori digital interaktif dengan performa cepat',
    description: 'Aplikasi web kamus bahasa gaul interaktif berbasis pencarian instan yang ringan, responsif, dan mudah diakses di seluruh perangkat.',
    thumbnail: '/images/kamus/kamus.png',
    tags: [
      'Web Application',
      'Real-time Search',
      'Lightweight Architecture',
      'Responsive UI'
    ],
    liveUrl: 'https://frolicking-bavarois-ad126d.netlify.app/',
    githubUrl: '',
    overview: 'Mengembangkan platform pengenalan istilah dan direktori digital yang dirancang untuk pencarian cepat data dalam hitungan milidetik.',
    challenge: 'Menyediakan pengalaman pengguna yang sangat responsif tanpa reload halaman dan beban server yang minim.',
    process: 'Membangun aplikasi ringan dengan sistem pencarian real-time client-side, struktur data teroptimasi, dan tata letak intuitif.',
    results: 'Menghasilkan aplikasi direktori cepat dengan skor performa Lighthouse sempurna (100%) dan navigasi ramah pengguna.',
    gallery: [
      '/images/kamus/kamus.png',
      '/images/kamus/kamus2.png',
    ],
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

