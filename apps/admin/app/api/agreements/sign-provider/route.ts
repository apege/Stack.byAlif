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

    const updatePayload = {
      provider_signature_data,
      provider_signer_name: provider_signer_name || 'Muhammad Alif Muzakky',
      provider_signer_title: provider_signer_title || 'Pemilik Usaha',
      provider_signed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Try updating with the authenticated admin user client first
    let result = await supabaseUser
      .from('agreements')
      .update(updatePayload)
      .eq('id', agreement_id)
      .select();

    // 2. If no rows updated or error, try with getAdminClient (service role bypass)
    if (result.error || !result.data || result.data.length === 0) {
      try {
        const adminSupabase = getAdminClient();
        const adminResult = await adminSupabase
          .from('agreements')
          .update(updatePayload)
          .eq('id', agreement_id)
          .select();

        if (adminResult.data && adminResult.data.length > 0) {
          result = adminResult;
        } else if (adminResult.error && !result.error) {
          result = adminResult;
        }
      } catch (adminErr) {
        console.warn('Fallback getAdminClient failed:', adminErr);
      }
    }

    if (result.error) {
      if (result.error.message?.includes('provider_signature_data')) {
        return NextResponse.json(
          {
            error:
              'Kolom provider_signature_data belum ada di Supabase. Silakan jalankan query ALTER TABLE di Supabase SQL Editor.',
            need_migration: true,
          },
          { status: 400 }
        );
      }
      throw result.error;
    }

    if (!result.data || result.data.length === 0) {
      return NextResponse.json(
        {
          error:
            'Gagal memperbarui agreement: Data tidak ditemukan atau izin akses ditolak oleh database.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tanda tangan Pihak Pertama (Stack.byAlif) berhasil dibubuhkan!',
      data: result.data[0],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan saat menyimpan tanda tangan.' },
      { status: 500 }
    );
  }
}
