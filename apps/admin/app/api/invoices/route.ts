import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch invoices error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    console.error('Invoices GET handler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      client_name,
      client_company,
      client_email,
      client_phone,
      client_address,
      project_title,
      invoice_type,
      items,
      subtotal,
      discount_amount,
      tax_rate,
      tax_amount,
      total_amount,
      issue_date,
      due_date,
      bank_name,
      bank_account_name,
      bank_account_number,
      notes,
      agreement_id,
      client_id,
      registration_number,
    } = body;

    if (!client_name || !project_title || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Nama klien, judul proyek, dan rincian item wajib diisi.' },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = `INV-${year}/SBA/${randomHex}`;

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('invoices')
      .insert([
        {
          invoice_number: invoiceNumber,
          agreement_id: agreement_id || null,
          client_id: client_id || null,
          registration_number: registration_number || '',
          client_name: client_name.trim(),
          client_company: (client_company || '').trim(),
          client_email: (client_email || '').trim().toLowerCase(),
          client_phone: (client_phone || '').trim(),
          client_address: (client_address || '').trim(),
          project_title: project_title.trim(),
          invoice_type: invoice_type || 'down_payment',
          status: 'unpaid',
          subtotal: Number(subtotal) || 0,
          discount_amount: Number(discount_amount) || 0,
          tax_rate: Number(tax_rate) || 0,
          tax_amount: Number(tax_amount) || 0,
          total_amount: Number(total_amount) || 0,
          issue_date: issue_date || new Date().toISOString().split('T')[0],
          due_date: due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          bank_name: bank_name || 'BCA',
          bank_account_name: bank_account_name || 'Muhammad Alif Muzakky',
          bank_account_number: bank_account_number || '',
          items,
          notes: notes || '',
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Insert invoice error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Invoice create error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, paid_at, payment_method, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID diperlukan.' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updatePayload.status = status;
      if (status === 'paid' && !paid_at) {
        updatePayload.paid_at = new Date().toISOString();
      } else if (status === 'unpaid') {
        updatePayload.paid_at = null;
      }
    }
    if (paid_at !== undefined) updatePayload.paid_at = paid_at;
    if (payment_method) updatePayload.payment_method = payment_method;
    if (notes !== undefined) updatePayload.notes = notes;

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('invoices')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Update invoice error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Invoice update error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID diperlukan.' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from('invoices').delete().eq('id', id);

    if (error) {
      console.error('Delete invoice error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Invoice delete error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
