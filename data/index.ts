import { Project, Testimonial, Service, BlogPost } from '@/types';

export const projects: Project[] = [
  {
    slug: 'jumpscare-industriez',
    title: 'Jumpscare Industriez',
    shortDesc: 'Streetwear fashion e-commerce platform with secure checkout and payment integration',
    description: 'A full-featured fashion e-commerce platform developed for Jumpscare Industriez, enabling customers to browse products, manage carts, complete secure purchases, and track orders through a seamless shopping experience.',
    thumbnail: '/images/jumpscareindustriez/home.png',
    tags: [
      'PHP Native',
      'Tailwind CSS',
      'JavaScript',
      'MySQL',
      'Payment Gateway',
      'E-Commerce'
    ],
    liveUrl: 'https://jumpscareindustriez.com/',
    githubUrl: '',
    overview: 'Developed a complete fashion e-commerce platform for Jumpscare Industriez, featuring product management, shopping cart functionality, customer authentication, checkout flow, payment gateway integration, and responsive user experience.',
    challenge: 'The main challenge was building a scalable e-commerce system that delivers a smooth shopping experience while handling product management, user authentication, order processing, and payment integration efficiently.',
    process: 'Designed the database structure, developed both customer-facing and administrative interfaces, implemented authentication and cart systems, integrated payment processing, and optimized the platform for responsiveness and performance across devices.',
    results: 'Successfully launched a fully functional online store that streamlined product sales, improved customer purchasing experience, and provided the business with a centralized platform for managing products, orders, and transactions.',
    gallery: [
      '/images/jumpscareindustriez/home.png',
      '/images/jumpscareindustriez/katalog.png',
      '/images/jumpscareindustriez/checkout.png',
      '/images/jumpscareindustriez/cart.png',
      '/images/jumpscareindustriez/register.png',
      '/images/jumpscareindustriez/login.png',
      '/images/jumpscareindustriez/order.png',
      '/images/jumpscareindustriez/profile.png',
      '/images/jumpscareindustriez/admin_home.png',
      '/images/jumpscareindustriez/admin_produk.png',
      '/images/jumpscareindustriez/admin_kategori.png',
      '/images/jumpscareindustriez/admin_banner.png',
      '/images/jumpscareindustriez/admin_order.png',
    ],
  },
  {
    slug: 'vision9-store',
    title: 'Vision9 Store',
    shortDesc: 'Gaming top-up platform with automated order processing and poster generation',
    description: 'A comprehensive gaming top-up platform developed for Vision9 Store, featuring dynamic product management, WhatsApp-based ordering, transaction management, testimonial systems, and automated promotional poster generation.',
    thumbnail: '/images/vision9store/home.png',
    tags: [
    'PHP Native',
    'Tailwind CSS',
    'JavaScript',
    'MySQL',
    'WhatsApp Integration',
    'Admin Dashboard',
    'Image Generation',
    'Digital Products'
    ],
    liveUrl: 'https://vision9store.com/',
    githubUrl: '',
    overview: 'Developed a complete gaming top-up management platform that enables customers to place orders through dynamic forms while providing administrators with tools to manage products, categories, transactions, testimonials, and automatically generate promotional posters.',
    challenge: 'The client required a centralized system capable of simplifying order management, reducing manual administrative work, organizing digital product catalogs, and automating promotional content creation.',
    process: 'Designed and developed a responsive customer-facing website alongside a powerful administration panel, implemented dynamic order workflows, integrated WhatsApp order generation, built transaction and category management modules, and created an automated poster generation system to streamline marketing activities.',
    results: 'Successfully delivered a custom business platform that improved operational efficiency, accelerated order handling, simplified content management, and automated promotional asset creation for the business.',
    gallery: [
    '/images/vision9store/home.png',
    '/images/vision9store/produk.png',
    '/images/vision9store/testimoni.png',
    '/images/vision9store/detail.png',
    '/images/vision9store/detail2.png',
    '/images/vision9store/kontak.png',
    '/images/vision9store/profile.png',
    '/images/vision9store/order.png',
    '/images/vision9store/login.png',
    '/images/vision9store/dashboard.png',
    '/images/vision9store/transaksi.png',
    '/images/vision9store/kelola.png',
    '/images/vision9store/kategori.png',
    '/images/vision9store/payment.png',
    '/images/vision9store/admin_testi.png',
    '/images/vision9store/poster.png',
    ],
  },
  {
    slug: 'mlr-game-store',
    title: 'MLR Game Store',
    shortDesc: 'Gaming top-up platform with automated WhatsApp ordering and poster generation',
    description: 'A custom gaming top-up platform developed for MLR Game Store, featuring digital product ordering, WhatsApp-based order automation, transaction management, and automated promotional poster generation.',
    thumbnail: '/images/mlrgamestore/home.png',
    tags: [
    'PHP Native',
    'Tailwind CSS',
    'JavaScript',
    'MySQL',
    'WhatsApp Integration',
    'Admin Dashboard',
    'Image Generation',
    'Digital Products'
    ],
    liveUrl: 'https://mlrgamestore.com/',
    githubUrl: '',
    overview: 'Developed a complete gaming top-up platform that streamlines customer orders through dynamic forms, automated WhatsApp order generation, and integrated promotional poster creation for marketing purposes.',
    challenge: 'The client required an efficient ordering system that could reduce manual administrative tasks while also simplifying the creation of promotional materials and maintaining a strong brand presence.',
    process: 'Customized the platform according to the client’s branding, implemented dynamic order workflows, developed transaction and product management modules, integrated WhatsApp ordering, and built an automated poster generation system to accelerate marketing operations.',
    results: 'Delivered a custom digital commerce platform that improved order management efficiency, reduced repetitive administrative work, and automated the creation of promotional assets for the business.',
    gallery: [
    '/images/mlrgamestore/home.png',
    '/images/mlrgamestore/produk.png',
    '/images/mlrgamestore/testimoni.png',
    '/images/mlrgamestore/detail.png',
    '/images/mlrgamestore/detail2.png',
    '/images/mlrgamestore/kontak.png',
    '/images/mlrgamestore/profile.png',
    '/images/mlrgamestore/order.png',
    '/images/mlrgamestore/login.png',
    '/images/mlrgamestore/dashboard.png',
    '/images/mlrgamestore/transaksi.png',
    '/images/mlrgamestore/kelola.png',
    '/images/mlrgamestore/kategori.png',
    '/images/mlrgamestore/payment.png',
    '/images/mlrgamestore/admin_testi.png',
    '/images/mlrgamestore/poster.png',
    ],
  },
  {
    slug: 'kamus-bahasa-gaul',
    title: 'Kamus Bahasa Gaul',

    shortDesc: 'Interactive slang dictionary web application built with vanilla JavaScript',

    description: 'A web-based slang dictionary that helps users quickly discover and understand popular Indonesian slang terms through a simple, responsive, and user-friendly interface.',

    thumbnail: '/images/kamus/kamus.png',

    tags: [
    'HTML',
    'CSS',
    'JavaScript',
    'Responsive Design',
    'Search System'
    ],

    liveUrl: 'https://frolicking-bavarois-ad126d.netlify.app/',

    githubUrl: '',

    overview: 'Developed an interactive slang dictionary application that allows users to search and explore Indonesian slang terms through a fast and intuitive user interface.',

    challenge: 'The challenge was creating an efficient search experience while keeping the application lightweight, responsive, and easy to navigate across different devices.',

    process: 'Designed the interface, structured the slang term database, implemented real-time search functionality using vanilla JavaScript, and optimized the user experience for both desktop and mobile users.',

    results: 'Delivered a lightweight and accessible web application that makes discovering and understanding Indonesian slang terms faster and more engaging for users.',

    gallery: [
    '/images/kamus/kamus.png',
    '/images/kamus/kamus2.png',
    ],
  },
  {
    slug: 'king-villa-bali',
    title: 'King Villa Bali',

    shortDesc: 'Luxury villa reservation and property management platform',

    description: 'A comprehensive hospitality platform designed for villa bookings, reservation management, promotional campaigns, and customer inquiries through an integrated WhatsApp-based workflow.',

    thumbnail: '/images/kingvillabali/home.png',

    tags: [
    'PHP Native',
    'Tailwind CSS',
    'JavaScript',
    'MySQL',
    'WhatsApp Integration',
    'Booking System',
    'Admin Dashboard',
    'Hospitality'
    ],

    liveUrl: 'https://kingvillabali.com/',

    githubUrl: '',

    overview: 'Developed a complete villa reservation and property management platform featuring dynamic booking forms, pricing management, promo code systems, location-based recommendations, automated poster generation, and a comprehensive administration dashboard.',

    challenge: 'The client required a centralized system to manage villa listings, reservation requests, promotional campaigns, and customer inquiries while delivering a seamless booking experience across desktop and mobile devices.',

    process: 'Designed and developed a custom hospitality platform with villa management, dynamic reservation workflows, guest information handling, discount and promo code systems, nearby attraction recommendations, WhatsApp-based booking automation, automated poster generation, and a feature-rich admin dashboard.',

    results: 'Successfully delivered a complete reservation management platform that streamlined booking operations, improved property presentation, simplified promotional management, and enhanced customer engagement.',

    gallery: [
    '/images/kingvillabali/home.png',
    '/images/kingvillabali/villa.png',
    '/images/kingvillabali/detail.png',
    '/images/kingvillabali/detail2.png',
    '/images/kingvillabali/detail3.png',
    '/images/kingvillabali/detail4.png',
    '/images/kingvillabali/detail5.png',
    '/images/kingvillabali/kontak.png',
    '/images/kingvillabali/testimoni.png',
    '/images/kingvillabali/refund2.png',
    '/images/kingvillabali/login.png',
    '/images/kingvillabali/dashboard.png',
    '/images/kingvillabali/booking.png',
    '/images/kingvillabali/kelola.png',
    '/images/kingvillabali/edit.png',
    '/images/kingvillabali/edit2.png',
    '/images/kingvillabali/edit3.png',
    '/images/kingvillabali/edit4.png',
    '/images/kingvillabali/edit5.png',
    '/images/kingvillabali/edit6.png',
    '/images/kingvillabali/edit7.png',
    '/images/kingvillabali/banner.png',
    '/images/kingvillabali/lokasi.png',
    '/images/kingvillabali/kategori.png',
    '/images/kingvillabali/date.png',
    '/images/kingvillabali/admin_testi.png',
    '/images/kingvillabali/promo.png',
    '/images/kingvillabali/refund.png',
    '/images/kingvillabali/poster.png',
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Jumpscare Industries',
    role: 'Client',
    company: 'Jumpscare Industries',
    content:
      'Sangat puas dengan hasil website yang dibuat. Komunikasi berjalan lancar, pengerjaan sesuai timeline, dan hasil akhirnya sesuai dengan kebutuhan yang kami inginkan.',
    avatar: '/images/avatars/jumpscare.jpg',
    rating: 5,
  },

  {
    id: 2,
    name: 'Vision9 Store',
    role: 'Client',
    company: 'Vision9 Store',
    content:
      'Website yang dibuat terlihat modern dan profesional. Proses pengerjaannya jelas, revisi ditangani dengan cepat, dan hasil akhirnya sangat memuaskan.',
    avatar: '/images/avatars/vision.png',
    rating: 5,
  },

  {
    id: 3,
    name: 'MLR Game Store',
    role: 'Client',
    company: 'MLR Game Store',
    content:
      'Pelayanan sangat baik dan responsif. Semua fitur yang kami butuhkan berhasil diimplementasikan dengan baik dan website berjalan dengan lancar.',
    avatar: '/images/avatars/mlr.png',
    rating: 5,
  },

  {
    id: 4,
    name: 'Gian',
    role: 'Personal Client',
    company: 'Proyek Pribadi',
    content:
      'Pengerjaan cepat, mudah diajak diskusi, dan hasilnya sesuai dengan yang saya harapkan. Setiap revisi juga dikerjakan dengan baik tanpa kendala.',
    avatar: '/images/avatars/gian.jpeg',
    rating: 5,
  },

  {
    id: 5,
    name: 'King Villa Bali',
    role: 'Client',
    company: 'King Villa Bali',
    content:
      'Website berhasil dibuat sesuai kebutuhan bisnis kami. Tampilan profesional, mudah digunakan, dan memberikan pengalaman yang baik bagi pengunjung.',
    avatar: '/images/avatars/kingvilla.jpeg',
    rating: 5,
  },
];

export const services: Service[] = [
  {
    id: 1,
    icon: 'Globe',
    title: 'Website Development',
    description:
      'Professional websites designed to strengthen your online presence, generate leads, and support business growth.',
    features: [
      'Landing Page',
      'Company Profile',
      'SEO Optimization',
      'Responsive Design',
      'WhatsApp Integration',
    ],
    price: 'Start from Rp 250rb',
  },

  {
    id: 2,
    icon: 'ShoppingBag',
    title: 'E-Commerce Solutions',
    description:
      'Complete online store systems with product management, payment integration, and order processing.',
    features: [
      'Product Catalog',
      'Shopping Cart',
      'Payment Gateway',
      'Order Management',
      'Admin Dashboard',
    ],
    price: 'Start from Rp 900rb',
  },

  {
    id: 3,
    icon: 'LayoutDashboard',
    title: 'Business Systems',
    description:
      'Custom management systems built to automate workflows and improve operational efficiency.',
    features: [
      'CRM System',
      'ERP System',
      'Inventory Management',
      'Employee Management',
      'Custom Dashboard',
    ],
    price: 'Start from Rp 2jt',
  },

  {
    id: 4,
    icon: 'Smartphone',
    title: 'Mobile Application',
    description:
      'Cross-platform mobile applications for Android and iOS with modern user experiences.',
    features: [
      'Android & iOS',
      'API Integration',
      'Authentication',
      'Push Notification',
      'App Store Ready',
    ],
    price: 'Start from Rp 2.5jt',
  },

  {
    id: 5,
    icon: 'MonitorSmartphone',
    title: 'Custom Software',
    description:
      'Tailor-made desktop and web software designed around your unique business requirements.',
    features: [
      'Desktop Application',
      'Web Application',
      'Database Integration',
      'Automation Tools',
      'Scalable Architecture',
    ],
    price: 'Start from Rp 4jt',
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-fast-website-wins-customers',
    title: 'Why a 1-Second Delay Costs You 7% of Conversions',
    excerpt: 'Website speed is not just a technical metric — it\'s a direct revenue driver. Here\'s what the data says and how to fix it.',
    date: '2026-05-20',
    readTime: '5 min read',
    category: 'Performance',
    thumbnail: '/blog/speed.jpg',
  },
  {
    slug: 'landing-page-mistakes-killing-conversions',
    title: '7 Landing Page Mistakes That Kill Your Conversion Rate',
    excerpt: 'After auditing 50+ landing pages, these are the most common (and costly) mistakes business owners make when building their website.',
    date: '2026-05-08',
    readTime: '8 min read',
    category: 'Conversion',
    thumbnail: '/blog/conversion.jpg',
  },
  {
    slug: 'nextjs-vs-wordpress-business',
    title: 'Next.js vs WordPress: Which Is Right for Your Business in 2026?',
    excerpt: 'Both platforms have their place, but choosing the wrong one for your business could cost you thousands in lost opportunities.',
    date: '2026-04-15',
    readTime: '6 min read',
    category: 'Technology',
    thumbnail: '/blog/nextjs.jpg',
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
    title: 'Consultation',
    description:
      'Understanding your business, challenges, goals, and project requirements to identify the best digital solution.',
  },
  {
    step: '02',
    title: 'Planning',
    description:
      'Defining features, system architecture, project scope, timeline, and technical requirements before development begins.',
  },
  {
    step: '03',
    title: 'Design & Prototype',
    description:
      'Creating intuitive user interfaces and workflows that align with your brand and business objectives.',
  },
  {
    step: '04',
    title: 'Development',
    description:
      'Building scalable, secure, and high-performance applications using modern technologies and best practices.',
  },
  {
    step: '05',
    title: 'Deployment & Support',
    description:
      'Launching the project, performing final testing, monitoring performance, and providing ongoing support when needed.',
  },
];
