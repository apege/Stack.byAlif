-- ==============================================================================
-- MIGRATION: INVOICE SYSTEM, REFUND POLICY & PROJECT STATUS TRACKING
-- ==============================================================================

-- 1. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  agreement_id UUID REFERENCES public.agreements(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  registration_number TEXT DEFAULT '',
  client_name TEXT NOT NULL,
  client_company TEXT DEFAULT '',
  client_email TEXT DEFAULT '',
  client_phone TEXT DEFAULT '',
  client_address TEXT DEFAULT '',
  project_title TEXT NOT NULL,
  invoice_type TEXT NOT NULL DEFAULT 'down_payment' CHECK (invoice_type IN ('down_payment', 'final_payment', 'full_payment', 'maintenance', 'custom')),
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'cancelled', 'refunded')),
  subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
  paid_at TIMESTAMPTZ,
  payment_method TEXT DEFAULT 'Bank Transfer',
  bank_name TEXT DEFAULT 'BCA',
  bank_account_name TEXT DEFAULT 'Muhammad Alif Muzakky',
  bank_account_number TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  refund_policy_note TEXT DEFAULT 'Uang muka (DP) bersifat non-refundable setelah pengerjaan teknis atau registrasi domain/server dimulai, sesuai ketentuan Perjanjian Kerja Sama.',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Project Trackings Table
CREATE TABLE IF NOT EXISTS public.project_trackings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code TEXT UNIQUE NOT NULL,
  registration_number TEXT DEFAULT '',
  agreement_id UUID REFERENCES public.agreements(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_company TEXT DEFAULT '',
  current_phase TEXT NOT NULL DEFAULT 'Onboarding & Requirement',
  progress_percent INTEGER NOT NULL DEFAULT 10 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled')),
  staging_url TEXT DEFAULT '',
  production_url TEXT DEFAULT '',
  estimated_completion DATE,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  activity_logs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_trackings ENABLE ROW LEVEL SECURITY;

-- Admins full access
DROP POLICY IF EXISTS "Admins full access to invoices" ON public.invoices;
CREATE POLICY "Admins full access to invoices"
  ON public.invoices
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to project_trackings" ON public.project_trackings;
CREATE POLICY "Admins full access to project_trackings"
  ON public.project_trackings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Grants
GRANT ALL ON public.invoices TO authenticated, service_role;
GRANT ALL ON public.project_trackings TO authenticated, service_role;
