import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

// In-memory brute-force protection: max 5 failed attempts per IP per 15 minutes
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { token, code } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token atau ID referensi agreement diperlukan.' },
        { status: 400 }
      );
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const cfIp = req.headers.get('cf-connecting-ip');
    const clientIp = cfIp || (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1');
    const now = Date.now();

    // Check brute-force lockout
    const tracker = failedAttempts.get(clientIp);
    if (tracker && tracker.count >= 5 && now - tracker.lastAttempt < 15 * 60 * 1000) {
      const waitMinutes = Math.ceil((15 * 60 * 1000 - (now - tracker.lastAttempt)) / 60000);
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan kode verifikasi yang salah. Akses ditangguhkan selama ${waitMinutes} menit demi keamanan dokumen.`,
        },
        { status: 429 }
      );
    }

    const cleanToken = token.trim();
    const cleanCode = (code || '').trim().toUpperCase();
    const supabase = getAdminClient();

    // Direct Query via Supabase Admin (bypasses RPC inconsistencies and guarantees all fields including signature_data)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanToken);

    let query = supabase
      .from('agreements')
      .select(`
        *,
        client:clients(id, name, company, email, phone, address, notes)
      `);

    if (isUUID) {
      query = query.or(`id.eq.${cleanToken},access_token.eq.${cleanToken}`);
    } else {
      query = query.eq('access_token', cleanToken);
    }

    const { data: agreementData, error: directError } = await query.maybeSingle();

    if (directError || !agreementData) {
      return NextResponse.json(
        { error: 'Dokumen agreement tidak ditemukan. Pastikan Token atau ID Referensi benar.' },
        { status: 404 }
      );
    }

    // Validate access code if provided with anti-brute force counter
    if (cleanCode && agreementData.access_code?.toUpperCase() !== cleanCode) {
      const current = failedAttempts.get(clientIp) || { count: 0, lastAttempt: now };
      const newCount = current.count + 1;
      failedAttempts.set(clientIp, { count: newCount, lastAttempt: now });
      const remaining = 5 - newCount;

      return NextResponse.json(
        {
          error:
            remaining > 0
              ? `Kode verifikasi salah. Sisa kesempatan: ${remaining} kali.`
              : 'Terlalu banyak percobaan kode yang salah. Akses ditangguhkan selama 15 menit demi keamanan dokumen.',
        },
        { status: 403 }
      );
    }

    // Reset attempt counter on valid verification code
    if (cleanCode) {
      failedAttempts.delete(clientIp);
    }

    // Check expiry
    const isExpired = new Date(agreementData.expires_at).getTime() < Date.now();
    let currentStatus = agreementData.status;

    if (isExpired && currentStatus !== 'signed') {
      currentStatus = 'expired';
      await supabase
        .from('agreements')
        .update({ status: 'expired' })
        .eq('id', agreementData.id);
    }

    // Read latest provider profile from Supabase
    let providerProfile: any = null;
    try {
      const { data: profileLog } = await supabase
        .from('audit_logs')
        .select('metadata')
        .eq('action', 'PROVIDER_PROFILE_SETTING')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (profileLog?.metadata) {
        providerProfile = profileLog.metadata;
      }
    } catch (e) {
      console.warn('Could not read provider settings from audit_logs:', e);
    }

    // Return complete, sanitized agreement object with guaranteed signatures and provider profile
    return NextResponse.json({
      success: true,
      agreement: {
        id: agreementData.id,
        project_title: agreementData.project_title,
        client_company: agreementData.client?.company || '',
        client_contact_name: agreementData.client?.name || '',
        client_email: agreementData.client?.email || '',
        client_phone: agreementData.client?.phone || '',
        client_address: agreementData.client?.address || '',
        client_notes: agreementData.client?.notes || '',
        scope_of_work: agreementData.scope_of_work,
        deliverables: agreementData.deliverables,
        total_fee: agreementData.total_fee,
        payment_terms: agreementData.payment_terms,
        terms_and_conditions: agreementData.terms_and_conditions,
        status: currentStatus,
        expires_at: agreementData.expires_at,
        signed_at: agreementData.signed_at,
        signer_name: agreementData.signer_name,
        signer_title: agreementData.signer_title || 'Pemilik Usaha',
        document_checksum: agreementData.document_checksum,
        signature_data: agreementData.signature_data,
        provider_signature_data: agreementData.provider_signature_data || providerProfile?.defaultSignature || '',
        provider_signer_name: agreementData.provider_signer_name || providerProfile?.name || 'Muhammad Alif Muzakky',
        provider_signer_title: providerProfile?.roleTitle || 'Pemilik Usaha',
        provider_signed_at: agreementData.provider_signed_at || agreementData.signed_at,
        provider_address: providerProfile?.address || '',
        provider_phone: providerProfile?.phone || '',
        provider_email: providerProfile?.email || '',
        provider_website: providerProfile?.website || '',
        provider_brand: providerProfile?.brandName || '',
        provider_city: providerProfile?.legalJurisdictionCity || '',
      },
    });
  } catch (err: any) {
    console.error('Server verify agreement error:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan server internal.' },
      { status: 500 }
    );
  }
}
