import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nama, Email, dan Detail Pesan wajib diisi.' },
        { status: 400 }
      );
    }

    // 1. Insert into Supabase database (table: inquiries)
    const { data: inquiryData, error: dbError } = await supabase
      .from('inquiries')
      .insert([
        {
          name,
          email,
          phone: phone || '-',
          subject: subject || '-',
          message,
        },
      ])
      .select();

    if (dbError) {
      console.error('Supabase DB Error Details:', JSON.stringify(dbError, null, 2));
      return NextResponse.json(
        { error: `Gagal menyimpan pesan ke database: ${dbError.message || dbError.details || 'Tabel inquiries belum dibuat atau RLS memblokir.'}` },
        { status: 500 }
      );
    }

    // 2. Send Telegram notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const telegramMessage = `🔔 *New Project Inquiry*

👤 *Nama:*
${name}

📧 *Email:*
${email}

📱 *WhatsApp:*
${phone || '-'}

📌 *Project:*
${subject || '-'}

💬 *Detail:*
${message}`;

      try {
        const tgRes = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: telegramMessage,
              parse_mode: 'Markdown',
            }),
          }
        );

        if (!tgRes.ok) {
          const tgErr = await tgRes.text();
          console.error('Telegram API Error:', tgErr);
        }
      } catch (tgErr) {
        console.error('Failed to dispatch Telegram message:', tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim dan tersimpan!',
      data: inquiryData,
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
