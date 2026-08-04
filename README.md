# 🚀 Alif Portfolio & Software Agency Platform

A modern, high-performance, and responsive portfolio and project inquiry web application designed for Software Engineering & Web Development services. Built with **Next.js 16 (App Router & Turbopack)**, **TypeScript**, **TailwindCSS**, **Supabase**, and **Telegram Bot Integration**.

---

## ✨ Features

- ** Modern & Responsive UI**: Clean, high-converting design with modern dark/light accent schemes, dynamic micro-animations via `framer-motion`, and fluid layouts.
- **🌐 Internationalization (i18n)**: Seamless multi-language support (Bahasa Indonesia & English) for global client engagement.
- **⚡ Inquiry Management**: High-speed contact form with validation and live state updates.
- **🗄️ Supabase Database Integration**: Stores project inquiries securely in PostgreSQL with Row Level Security (RLS).
- **🔔 Real-time Telegram Notifications**: Instant formatted Telegram alerts sent to the owner whenever a new inquiry is submitted.
- **🚀 Optimized Performance**: Built on Next.js 16 Turbopack with server components, font optimization, and SEO readiness.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Notification Engine**: Telegram Bot API

---

## 📁 Architecture Overview

```text
├── app/
│   ├── [lang]/              # Multi-language routing
│   ├── api/
│   │   └── contact/         # Contact inquiry API route (Supabase + Telegram)
│   ├── globals.css          # Global Tailwind styles
│   └── layout.tsx           # Main application shell
├── components/
│   ├── Navbar.tsx           # Responsive Navigation bar
│   ├── Footer.tsx           # Footer component
│   └── sections/            # Landing page sections (Hero, Projects, Services, Contact, etc.)
├── context/
│   └── LanguageContext.tsx  # Multi-language state provider
├── lib/
│   └── supabase.ts          # Supabase client configuration
└── public/                  # Static assets & graphics
```

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root directory and add the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

---

## 🗄️ Supabase Table Schema

Execute the following SQL query in your Supabase SQL Editor to set up the `inquiries` table:

```sql
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS & set public insert permissions
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" 
ON public.inquiries 
FOR INSERT 
TO public 
WITH CHECK (true);
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Build for Production

```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
