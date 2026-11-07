-- ==============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- ==============================================================================

-- 1. Table for Client Registrations
CREATE TABLE IF NOT EXISTS public.client_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE NOT NULL DEFAULT ('REG-' || upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 8))),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  domicile_address TEXT NOT NULL,
  business_name TEXT NOT NULL,
  ownership_status TEXT NOT NULL,
  legal_entity TEXT DEFAULT '',
  business_address TEXT NOT NULL,
  domain_name TEXT DEFAULT '',
  domain_identity_option TEXT DEFAULT '',
  domain_registrar TEXT DEFAULT '',
  declaration_identity_correct BOOLEAN DEFAULT false NOT NULL,
  declaration_authority BOOLEAN DEFAULT false NOT NULL,
  declaration_liability BOOLEAN DEFAULT false NOT NULL,
  declaration_scope_understanding BOOLEAN DEFAULT false NOT NULL,
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'verified', 'rejected', 'converted')),
  admin_notes TEXT DEFAULT '',
  client_ip TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.client_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit client registrations" ON public.client_registrations;
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

DROP POLICY IF EXISTS "Admins full access to client registrations" ON public.client_registrations;
CREATE POLICY "Admins full access to client registrations"
  ON public.client_registrations
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT ALL ON public.client_registrations TO anon, authenticated, service_role;

-- 2. Enhanced get_client_agreement RPC (matches access_token OR id UUID)
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
    a.document_checksum,
    a.access_code,
    c.company AS client_company,
    c.name AS client_contact_name,
    c.email AS client_email,
    c.phone AS client_phone,
    c.address AS client_address,
    c.notes AS client_notes
  INTO v_rec
  FROM public.agreements a
  JOIN public.clients c ON a.client_id = c.id
  WHERE (a.access_token = p_token OR a.id::text = p_token);

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Dokumen agreement tidak ditemukan. Pastikan Token / ID benar.');
  END IF;

  -- Optional access code check if provided
  IF p_code IS NOT NULL AND p_code <> '' AND upper(v_rec.access_code) <> upper(p_code) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Kode verifikasi salah. Periksa kembali 6 karakter kode Anda.');
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
      'document_checksum', v_rec.document_checksum,
      'signature_data', v_rec.signature_data,
      'provider_signature_data', v_rec.provider_signature_data,
      'provider_signer_name', v_rec.provider_signer_name,
      'provider_signer_title', v_rec.provider_signer_title,
      'provider_signed_at', v_rec.provider_signed_at
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Enhanced sign_client_agreement RPC
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

  -- SHA-256 cryptographic checksum
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

  -- Store snapshot in agreement_versions
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
