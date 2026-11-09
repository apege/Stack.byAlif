import { NextRequest, NextResponse } from 'next/server';
import { validateEmail, validateWhatsAppNumber } from '@/lib/contact-validator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, value } = body;

    if (type === 'email') {
      const result = await validateEmail(value);
      return NextResponse.json(result);
    }

    if (type === 'whatsapp') {
      const result = validateWhatsAppNumber(value);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Tipe validasi tidak dikenal (hanya email atau whatsapp).' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Gagal memvalidasi kontak.' },
      { status: 500 }
    );
  }
}
