import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const {
      token,
      code,
      signer_name,
      signer_title,
      signature_data,
    } = await req.json();

    if (!token || !signer_name || !signer_title || !signature_data) {
      return NextResponse.json(
        { error: 'Lengkapi nama penandatangan, jabatan, dan tanda tangan digital.' },
        { status: 400 }
      );
    }

    const cleanToken = token.trim();
    const cleanCode = (code || '').trim().toUpperCase();

    // Extract network evidence for legal audit trail
    const forwarded = req.headers.get('x-forwarded-for');
    const cfIp = req.headers.get('cf-connecting-ip');
    const clientIp = cfIp || (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1');
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    const supabase = getAdminClient();

    let finalChecksum: string | null = null;
    let finalSignedAt: string | null = null;

    // 1. Try RPC sign_client_agreement first
    const { data: rpcData, error: rpcError } = await supabase.rpc('sign_client_agreement', {
      p_token: cleanToken,
      p_code: cleanCode,
      p_signer_name: signer_name.trim(),
      p_signer_title: signer_title.trim(),
      p_signature_data: signature_data,
      p_signer_ip: clientIp,
      p_signer_user_agent: userAgent,
    });

    if (!rpcError && rpcData && rpcData.success) {
      finalChecksum = rpcData.checksum;
      finalSignedAt = rpcData.signed_at;
    } else {
      // 2. Resilient Direct Fallback via Supabase Admin (handles both access_token and UUID id)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanToken);

      let query = supabase.from('agreements').select('*');
      if (isUUID) {
        query = query.or(`id.eq.${cleanToken},access_token.eq.${cleanToken}`);
      } else {
        query = query.eq('access_token', cleanToken);
      }

      const { data: agreement, error: findError } = await query.maybeSingle();

      if (findError || !agreement) {
        return NextResponse.json(
          { error: 'Dokumen agreement tidak ditemukan.' },
          { status: 404 }
        );
      }

      if (cleanCode && agreement.access_code?.toUpperCase() !== cleanCode) {
        return NextResponse.json(
          { error: 'Kode verifikasi tidak cocok.' },
          { status: 403 }
        );
      }

      if (agreement.status === 'signed') {
        return NextResponse.json(
          { error: 'Dokumen ini sudah pernah ditandatangani.' },
          { status: 400 }
        );
      }

      if (new Date(agreement.expires_at).getTime() < Date.now()) {
        await supabase.from('agreements').update({ status: 'expired' }).eq('id', agreement.id);
        return NextResponse.json(
          { error: 'Masa berlaku penandatanganan dokumen ini telah kedaluwarsa.' },
          { status: 400 }
        );
      }

      const nowIso = new Date().toISOString();
      const hashPayload = `${agreement.id}${agreement.scope_of_work}${agreement.total_fee}${signer_name.trim()}${nowIso}`;
      const checksum = crypto.createHash('sha256').update(hashPayload).digest('hex');

      // Update agreement
      const { error: updateError } = await supabase
        .from('agreements')
        .update({
          status: 'signed',
          signed_at: nowIso,
          signer_name: signer_name.trim(),
          signer_title: signer_title.trim(),
          signer_ip: clientIp,
          signer_user_agent: userAgent,
          signature_data: signature_data,
          document_checksum: checksum,
          version: (agreement.version || 1) + 1,
          updated_at: nowIso,
        })
        .eq('id', agreement.id);

      if (updateError) {
        console.error('Direct sign update error:', updateError);
        return NextResponse.json(
          { error: 'Gagal memperbarui status tanda tangan.' },
          { status: 500 }
        );
      }

      // Snapshot & Audit Log
      try {
        await supabase.from('agreement_versions').insert([{
          agreement_id: agreement.id,
          version: (agreement.version || 1) + 1,
          snapshot_data: {
            agreement_id: agreement.id,
            project_title: agreement.project_title,
            total_fee: agreement.total_fee,
            scope_of_work: agreement.scope_of_work,
            signer_name: signer_name.trim(),
            signer_title: signer_title.trim(),
            signer_ip: clientIp,
            signed_at: nowIso,
            signature_data: signature_data,
            checksum: checksum,
          },
          document_checksum: checksum,
        }]);

        await supabase.from('audit_logs').insert([{
          action: 'AGREEMENT_SIGNED',
          entity_type: 'agreement',
          entity_id: agreement.id,
          ip_address: clientIp,
          metadata: { signer: signer_name.trim(), checksum: checksum },
        }]);
      } catch (logErr) {
        console.warn('Logging snapshot warning:', logErr);
      }

      finalChecksum = checksum;
      finalSignedAt = nowIso;
    }

    // Optional Telegram notification to Alif
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const telegramMessage = `✍️ *KONTRAK RESMI DITANDATANGANI (STACK.BYALIF)*
━━━━━━━━━━━━━━━━━━━━
👤 *Penandatangan:* ${signer_name} (${signer_title})
🔐 *SHA-256 Checksum:* \`${finalChecksum?.substring(0, 16)}...\`
🌐 *IP Penandatangan:* \`${clientIp}\`
📅 *Waktu:* ${new Date().toLocaleString('id-ID')}
━━━━━━━━━━━━━━━━━━━━
_Dokumen terkunci secara immutable (tidak dapat dimanipulasi). Silakan cek Dashboard Admin._`;

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
      } catch (tgErr) {
        console.error('Telegram notification error (non-fatal):', tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      checksum: finalChecksum,
      signed_at: finalSignedAt,
      signature_data: signature_data,
    });
  } catch (err: any) {
    console.error('Server sign error:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan server internal.' },
      { status: 500 }
    );
  }
}

