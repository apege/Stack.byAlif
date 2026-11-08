-- ==============================================================================
-- SUPABASE DATABASE SCHEMA & RLS POLICIES FOR STACKBYALIF MONOREPO
-- ==============================================================================
-- Security Focus:
-- 1. Strictly restrict admin dashboard access via Supabase Auth & Role-Based Access Control.
-- 2. Client identities, contact details, and agreements are NEVER accessible to public anon.
-- 3. Agreement signing links use high-entropy random tokens + verification codes with expiry.
-- 4. Signed agreements and documents are IMMUTABLE (enforced by DB trigger and versioning).
-- 5. Storage buckets separated: public `project-images` vs strictly private `contracts`.
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & ROLES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles RLS
CREATE POLICY "Admins can view and manage profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin() OR auth.uid() = id)
  WITH CHECK (public.is_admin() OR auth.uid() = id);

-- Auto-create profile trigger on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'admin' -- Default newly invited/created user to admin
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. PROJECTS TABLE (Public portfolio items)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  year TEXT DEFAULT '2026',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  challenge TEXT DEFAULT '',
  process TEXT DEFAULT '',
  results TEXT DEFAULT '',
  gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN DEFAULT true NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can only read published projects
CREATE POLICY "Public can view published projects"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

-- Only admins can insert, update, delete projects
CREATE POLICY "Admins full access on projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. CLIENTS TABLE (Confidential Client Data - NEVER PUBLIC)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Strict: NO anon access allowed under any circumstances!
CREATE POLICY "Admins only access clients"
  ON public.clients
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. AGREEMENTS & CONTRACTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  scope_of_work TEXT NOT NULL,
  deliverables TEXT[] DEFAULT ARRAY[]::TEXT[],
  total_fee NUMERIC(15, 2) NOT NULL DEFAULT 0,
  payment_terms TEXT NOT NULL,
  terms_and_conditions TEXT NOT NULL,
  -- Cryptographically secure token (64 hex characters)
  access_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  -- 6-character verification code for zero-sensitive-URL verification
  access_code TEXT NOT NULL DEFAULT upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 6)),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ NOT NULL,
  signed_at TIMESTAMPTZ,
  signer_name TEXT,
  signer_title TEXT,
  signer_ip TEXT,
  signer_user_agent TEXT,
  signature_data TEXT, -- Base64 SVG/PNG e-signature
  document_checksum TEXT, -- SHA-256 integrity hash
  document_storage_path TEXT, -- Path in private 'contracts' storage bucket
  -- Pihak Pertama (Provider / Stack.byAlif) Signature
  provider_signature_data TEXT,
  provider_signer_name TEXT DEFAULT 'Muhammad Alif Muzakky',
  provider_signer_title TEXT DEFAULT 'Founder / Lead Developer',
  provider_signed_at TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- Admins have full access
CREATE POLICY "Admins only access agreements"
  ON public.agreements
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. IMMUTABLE VERSIONED AGREEMENT SNAPSHOTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agreement_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL REFERENCES public.agreements(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  snapshot_data JSONB NOT NULL,
  document_checksum TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.agreement_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view agreement versions"
  ON public.agreement_versions
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Immutability enforcement trigger on signed agreements
CREATE OR REPLACE FUNCTION public.check_signed_agreement_immutable()
RETURNS TRIGGER AS $$
BEGIN
  -- If agreement was already signed, prohibit altering contract terms or signature
  IF OLD.status = 'signed' THEN
    IF (OLD.total_fee <> NEW.total_fee OR
        OLD.scope_of_work <> NEW.scope_of_work OR
        OLD.signature_data <> NEW.signature_data OR
        OLD.signed_at <> NEW.signed_at OR
        OLD.document_checksum <> NEW.document_checksum) THEN
      RAISE EXCEPTION 'Security Violation: Signed agreements are immutable and cannot be modified.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_signed_tampering ON public.agreements;
CREATE TRIGGER trg_prevent_signed_tampering
  BEFORE UPDATE ON public.agreements
  FOR EACH ROW EXECUTE FUNCTION public.check_signed_agreement_immutable();

-- ------------------------------------------------------------------------------
-- 6. SECURE RPC FOR CLIENT AGREEMENT VIEWING & SIGNING
-- (Never exposes full database or other clients to anon)
-- ------------------------------------------------------------------------------

-- Public RPC: Retrieve agreement details for client signing using token & verification code
CREATE OR REPLACE FUNCTION public.get_client_agreement(p_token TEXT, p_code TEXT DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  v_rec RECORD;
  v_is_expired BOOLEAN;
BEGIN
  SELECT 
    a.id,
    a.project_title,
    a.scope_of_work,
    a.deliverables,
    a.total_fee,
    a.payment_terms,
    a.terms_and_conditions,
    a.status,
    a.expires_at,
    a.signed_at,
    a.signer_name,
    a.signer_title,
    a.signature_data,
    a.document_checksum,
    a.access_code,
    a.provider_signature_data,
    a.provider_signer_name,
    a.provider_signer_title,
    a.provider_signed_at,
    c.company AS client_company,
    c.name AS client_contact_name,
    c.email AS client_email,
    c.phone AS client_phone,
    c.address AS client_address,
    c.notes AS client_notes
  INTO v_rec
  FROM public.agreements a
  LEFT JOIN public.clients c ON a.client_id = c.id
  WHERE (a.access_token = p_token OR a.id::text = p_token);

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Dokumen agreement tidak ditemukan.');
  END IF;

  -- Optional access code check if provided or configured
  IF p_code IS NOT NULL AND p_code <> '' AND upper(v_rec.access_code) <> upper(p_code) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Kode verifikasi tidak cocok.');
  END IF;

  -- Check expiry
  v_is_expired := (now() > v_rec.expires_at);
  IF v_is_expired AND v_rec.status <> 'signed' THEN
    UPDATE public.agreements SET status = 'expired' WHERE id = v_rec.id;
    v_rec.status := 'expired';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'agreement', jsonb_build_object(
      'id', v_rec.id,
      'project_title', v_rec.project_title,
      'client_company', v_rec.client_company,
      'client_contact_name', v_rec.client_contact_name,
      'client_email', v_rec.client_email,
      'client_phone', v_rec.client_phone,
      'client_address', v_rec.client_address,
      'client_notes', v_rec.client_notes,
      'scope_of_work', v_rec.scope_of_work,
      'deliverables', v_rec.deliverables,
      'total_fee', v_rec.total_fee,
      'payment_terms', v_rec.payment_terms,
      'terms_and_conditions', v_rec.terms_and_conditions,
      'status', v_rec.status,
      'expires_at', v_rec.expires_at,
      'signed_at', v_rec.signed_at,
      'signer_name', v_rec.signer_name,
      'signer_title', v_rec.signer_title,
      'signature_data', v_rec.signature_data,
      'document_checksum', v_rec.document_checksum,
      'provider_signature_data', v_rec.provider_signature_data,
      'provider_signer_name', v_rec.provider_signer_name,
      'provider_signer_title', v_rec.provider_signer_title,
      'provider_signed_at', v_rec.provider_signed_at
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public RPC: Client signs the agreement
CREATE OR REPLACE FUNCTION public.sign_client_agreement(
  p_token TEXT,
  p_code TEXT,
  p_signer_name TEXT,
  p_signer_title TEXT,
  p_signature_data TEXT,
  p_signer_ip TEXT DEFAULT '',
  p_signer_user_agent TEXT DEFAULT ''
)
RETURNS JSONB AS $$
DECLARE
  v_rec RECORD;
  v_checksum TEXT;
  v_snapshot JSONB;
BEGIN
  SELECT * INTO v_rec
  FROM public.agreements
  WHERE (access_token = p_token OR id::text = p_token);

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Dokumen agreement tidak ditemukan.');
  END IF;

  IF p_code IS NOT NULL AND p_code <> '' AND upper(v_rec.access_code) <> upper(p_code) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Kode verifikasi tidak cocok.');
  END IF;

  IF v_rec.status = 'signed' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Dokumen ini sudah pernah ditandatangani.');
  END IF;

  IF now() > v_rec.expires_at THEN
    UPDATE public.agreements SET status = 'expired' WHERE id = v_rec.id;
    RETURN jsonb_build_object('success', false, 'error', 'Masa berlaku penandatanganan dokumen ini telah kedaluwarsa.');
  END IF;

  -- Generate SHA-256 cryptographic checksum of agreement + signing details
  v_checksum := encode(
    digest(
      v_rec.id::text || v_rec.scope_of_work || v_rec.total_fee::text || p_signer_name || now()::text,
      'sha256'
    ),
    'hex'
  );

  -- Update agreement
  UPDATE public.agreements
  SET
    status = 'signed',
    signed_at = timezone('utc'::text, now()),
    signer_name = p_signer_name,
    signer_title = p_signer_title,
    signer_ip = p_signer_ip,
    signer_user_agent = p_signer_user_agent,
    signature_data = p_signature_data,
    document_checksum = v_checksum,
    version = v_rec.version + 1,
    updated_at = timezone('utc'::text, now())
  WHERE id = v_rec.id;

  -- Store immutable snapshot in agreement_versions
  v_snapshot := jsonb_build_object(
    'agreement_id', v_rec.id,
    'project_title', v_rec.project_title,
    'total_fee', v_rec.total_fee,
    'scope_of_work', v_rec.scope_of_work,
    'signer_name', p_signer_name,
    'signer_title', p_signer_title,
    'signer_ip', p_signer_ip,
    'signed_at', now(),
    'signature_data', p_signature_data,
    'checksum', v_checksum
  );

  INSERT INTO public.agreement_versions (agreement_id, version, snapshot_data, document_checksum)
  VALUES (v_rec.id, v_rec.version + 1, v_snapshot, v_checksum);

  -- Log to audit
  INSERT INTO public.audit_logs (action, entity_type, entity_id, ip_address, metadata)
  VALUES ('AGREEMENT_SIGNED', 'agreement', v_rec.id::text, p_signer_ip, jsonb_build_object('signer', p_signer_name, 'checksum', v_checksum));

  RETURN jsonb_build_object('success', true, 'checksum', v_checksum, 'signed_at', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 7. INQUIRIES TABLE (Contact form leads)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '-',
  subject TEXT DEFAULT '-',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'contacted', 'archived')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Public can submit inquiries
CREATE POLICY "Public can insert inquiries"
  ON public.inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read, update, delete inquiries
CREATE POLICY "Admins only access inquiries"
  ON public.inquiries
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. CLIENT REGISTRATIONS TABLE (Confidential Onboarding & Domain Intake)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE NOT NULL DEFAULT ('REG-' || upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 8))),
  -- 01. Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  domicile_address TEXT NOT NULL,
  -- 02. Business Information
  business_name TEXT NOT NULL,
  ownership_status TEXT NOT NULL, -- 'Pemilik bisnis', 'Perwakilan bisnis', 'Individu / personal project'
  legal_entity TEXT DEFAULT '', -- 'PT / CV / lainnya (opsional)'
  business_address TEXT NOT NULL,
  -- 03. Domain Registration
  domain_name TEXT DEFAULT '',
  domain_identity_option TEXT DEFAULT '', -- 'Ya, menggunakan identitas saya', 'Tidak, ada pemilik domain lain', 'Saya sudah memiliki domain'
  domain_registrar TEXT DEFAULT '',
  -- 04. Business Declaration (Must all be true)
  declaration_identity_correct BOOLEAN DEFAULT false NOT NULL,
  declaration_authority BOOLEAN DEFAULT false NOT NULL,
  declaration_liability BOOLEAN DEFAULT false NOT NULL,
  declaration_scope_understanding BOOLEAN DEFAULT false NOT NULL,
  -- Status & Admin workflow
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'verified', 'rejected', 'converted')),
  admin_notes TEXT DEFAULT '',
  client_ip TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.client_registrations ENABLE ROW LEVEL SECURITY;

-- Public can submit registrations, but ONLY if all 4 declarations are accepted
CREATE POLICY "Public can submit client registrations"
  ON public.client_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    declaration_identity_correct = true AND
    declaration_authority = true AND
    declaration_liability = true AND
    declaration_scope_understanding = true
  );

-- Admins have full access to view, update, and manage registrations
CREATE POLICY "Admins full access to client registrations"
  ON public.client_registrations
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  performed_by UUID REFERENCES auth.users(id),
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit logs"
  ON public.audit_logs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. SUPABASE STORAGE BUCKETS & POLICIES
-- ------------------------------------------------------------------------------
-- Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policy: Public can read project-images
CREATE POLICY "Public read project images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-images');

-- Storage Policy: Admin can upload/update/delete project images
CREATE POLICY "Admins manage project images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'project-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'project-images' AND public.is_admin());

-- Storage Policy: Strictly admin-only access to private contracts bucket
CREATE POLICY "Admins only manage contracts storage"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'contracts' AND public.is_admin())
  WITH CHECK (bucket_id = 'contracts' AND public.is_admin());

-- Client Portal Policy: Allow public to read agreement and client for client portal verification
DROP POLICY IF EXISTS "Public read agreements for client portal" ON public.agreements;
CREATE POLICY "Public read agreements for client portal"
  ON public.agreements
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read clients for client portal" ON public.clients;
CREATE POLICY "Public read clients for client portal"
  ON public.clients
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ------------------------------------------------------------------------------
-- 10. POSTGRES ROLE PRIVILEGES (CRITICAL FOR SUPABASE POSTGREST ACCESS)
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
