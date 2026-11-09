import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Invoice ID diperlukan.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Check if searching by UUID id or invoice_number
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabase.from('invoices').select('*');
    if (isUUID) {
      query = query.or(`id.eq.${id},invoice_number.eq.${id}`);
    } else {
      query = query.eq('invoice_number', id);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Dokumen invoice tidak ditemukan. Periksa kembali ID atau nomor invoice Anda.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('Client invoice fetch error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
