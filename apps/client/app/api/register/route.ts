import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { getEnv } from '@/lib/env';

// Anti-spam registration rate limiter: max 5 submissions per hour per IP
const registrationRateLimits = new Map<string, { count: number; firstAttempt: number }>();

export async function POST(req: NextRequest) {
  try {
    // Capture network audit trail & enforce rate limit
    const forwarded = req.headers.get('x-forwarded-for');
    const cfIp = req.headers.get('cf-connecting-ip');
    const clientIp = cfIp || (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1');
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const now = Date.now();

    const rateData = registrationRateLimits.get(clientIp);
    if (rateData) {
      if (now - rateData.firstAttempt < 60 * 60 * 1000) {
        if (rateData.count >= 5) {
          return NextResponse.json(
            { error: 'Batas pengiriman registrasi tercapai (maksimal 5 kali per jam). Silakan coba lagi nanti.' },
            { status: 429 }
          );
        }
        rateData.count += 1;
      } else {
        registrationRateLimits.set(clientIp, { count: 1, firstAttempt: now });
      }
    } else {
      registrationRateLimits.set(clientIp, { count: 1, firstAttempt: now });
    }

    const body = await req.json();

    const {
      full_name,
      email,
      whatsapp,
      domicile_address,
      business_name,
      ownership_status,
      legal_entity,
      business_address,
      domain_name,
      domain_identity_option,
      domain_registrar,
      declaration_identity_correct,
      declaration_authority,
      declaration_liability,
      declaration_scope_understanding,
    } = body;

    // Strict validation
    if (!full_name || !email || !whatsapp || !domicile_address) {
      return NextResponse.json(
        { error: 'Mohon lengkapi seluruh Data Pribadi (01. Personal Information).' },
        { status: 400 }
      );
    }

    if (!business_name || !ownership_status || !business_address) {
      return NextResponse.json(
        { error: 'Mohon lengkapi seluruh Informasi Bisnis (02. Business Information).' },
        { status: 400 }
      );
    }

    if (
      !declaration_identity_correct ||
      !declaration_authority ||
      !declaration_liability ||
      !declaration_scope_understanding
    ) {
      return NextResponse.json(
        { error: 'Anda wajib menyetujui seluruh klausul pernyataan legal (04. Business Declaration) sebelum melanjutkan.' },
        { status: 400 }
      );
    }

    // Generate unique reference upfront so we don't depend on RETURNING/SELECT RLS
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    const registrationNumber = `REG-${randomHex}`;

    // Insert into Supabase
    const supabase = getAdminClient();

    const { error } = await supabase
      .from('client_registrations')
      .insert([
        {
          full_name: full_name.trim(),
          email: email.trim().toLowerCase(),
          whatsapp: whatsapp.trim(),
          domicile_address: domicile_address.trim(),
          business_name: business_name.trim(),
          ownership_status: ownership_status.trim(),
          legal_entity: (legal_entity || '').trim(),
          business_address: business_address.trim(),
          domain_name: (domain_name || '').trim(),
          domain_identity_option: (domain_identity_option || '').trim(),
          domain_registrar: (domain_registrar || '').trim(),
          declaration_identity_correct: true,
          declaration_authority: true,
          declaration_liability: true,
          declaration_scope_understanding: true,
          client_ip: clientIp,
          user_agent: userAgent,
          status: 'pending_review',
          registration_number: registrationNumber,
        },
      ]);

    if (error) {
      console.error('Supabase registration error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Terjadi kesalahan sistem saat menyimpan registrasi. Pastikan tabel client_registrations sudah dibuat di Supabase.',
          details: error.details,
          code: error.code,
        },
        { status: 500 }
      );
    }

    // Optional Telegram notification to Alif
    const botToken = getEnv('TELEGRAM_BOT_TOKEN');
    const chatId = getEnv('TELEGRAM_CHAT_ID');

    if (botToken && chatId) {
      const telegramMessage = `📋 *REGISTRASI KLIEN BARU (STACK.BYALIF)*
━━━━━━━━━━━━━━━━━━━━
🆔 *Ref:* \`${registrationNumber}\`
👤 *Nama:* ${full_name}
🏢 *Bisnis:* ${business_name} (${ownership_status})
${legal_entity ? `🏛 *Badan Usaha:* ${legal_entity}\n` : ''}📱 *WhatsApp:* ${whatsapp}
✉️ *Email:* ${email}
🌐 *Domain Diminta:* ${domain_name || '-'}
🛡 *Opsi Domain:* ${domain_identity_option || '-'}
🏢 *Registrar:* ${domain_registrar || '-'}
📍 *Alamat Bisnis:* ${business_address}
🏠 *Domisili:* ${domicile_address}

⚖️ *Legalitas:* Seluruh 4 klausul pernyataan & non-liability disetujui.
🌐 *IP:* \`${clientIp}\`
━━━━━━━━━━━━━━━━━━━━
_Silakan verifikasi data klien di Dashboard Admin sebelum menerbitkan kontrak._`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'Markdown',
          }),
        });
      } catch (tgError) {
        console.error('Telegram notification error (non-fatal):', tgError);
      }
    }

    return NextResponse.json({
      success: true,
      registration_number: registrationNumber,
      message: 'Registrasi proyek berhasil disimpan dan diverifikasi.',
    });
  } catch (err: any) {
    console.error('Server error on register:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan server internal.' },
      { status: 500 }
    );
  }
}
