export interface Project {
  slug: string;
  title: string;
  description: string;
  shortDesc: string;
  thumbnail: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  overview: string;
  challenge: string;
  process: string;
  results: string;
  gallery: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
  price: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  thumbnail: string;
}

export interface TechStack {
  name: string;
  icon: string;
  category: string;
}
