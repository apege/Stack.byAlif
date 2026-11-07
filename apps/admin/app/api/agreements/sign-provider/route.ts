import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    // Verify caller is an authenticated admin
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Harap login terlebih dahulu.' }, { status: 401 });
    }

    const { data: profile } = await supabaseUser
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Hanya admin yang diizinkan.' }, { status: 403 });
    }

    const {
      agreement_id,
      provider_signature_data,
      provider_signer_name,
      provider_signer_title,
    } = await req.json();

    if (!agreement_id || !provider_signature_data) {
      return NextResponse.json(
        { error: 'ID Agreement dan data tanda tangan wajib diisi.' },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('agreements')
      .update({
        provider_signature_data,
        provider_signer_name: provider_signer_name || 'Muhammad Alif Muzakky',
        provider_signer_title: provider_signer_title || 'Pemilik Usaha',
        provider_signed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', agreement_id)
      .select()
      .single();

    if (error) {
      // If column doesn't exist yet, return helpful error
      if (error.message?.includes('provider_signature_data')) {
        return NextResponse.json(
          {
            error:
              'Kolom provider_signature_data belum ada di Supabase. Silakan jalankan query ALTER TABLE di Supabase SQL Editor.',
            need_migration: true,
          },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Tanda tangan Pihak Pertama (Stack.byAlif) berhasil dibubuhkan!',
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan saat menyimpan tanda tangan.' },
      { status: 500 }
    );
  }
}
