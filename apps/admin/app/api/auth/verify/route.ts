import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID dan Email diperlukan.' }, { status: 400 });
    }

    // Verify session: only the actual authenticated user can verify their own ID
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi otentikasi tidak valid.' },
        { status: 401 }
      );
    }

    const adminSupabase = getAdminClient();

    // 1. Check if user already exists in profiles
    const { data: profile, error: selectErr } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (selectErr) {
      // Check if table 'profiles' doesn't exist
      if (selectErr.message?.includes('relation "public.profiles" does not exist') || selectErr.code === '42P01') {
        return NextResponse.json(
          {
            error: 'Tabel database belum dibuat! Buka Supabase Dashboard -> SQL Editor, lalu jalankan isi file packages/database/schema.sql terlebih dahulu.',
          },
          { status: 400 }
        );
      }

      // If row not found (PGRST116), automatically provision this authenticated user as admin!
      if (selectErr.code === 'PGRST116') {
        const { error: insertErr } = await adminSupabase.from('profiles').insert([
          {
            id: userId,
            email: email,
            full_name: email.split('@')[0] || 'Admin',
            role: 'admin',
          },
        ]);

        if (insertErr) {
          return NextResponse.json(
            { error: `Gagal membuat profil admin: ${insertErr.message}` },
            { status: 500 }
          );
        }

        return NextResponse.json({ isAdmin: true, message: 'Profil admin otomatis dibuat.' });
      }

      return NextResponse.json({ error: selectErr.message }, { status: 500 });
    }

    if (profile?.role === 'admin') {
      return NextResponse.json({ isAdmin: true });
    }

    return NextResponse.json(
      { error: 'Akses Ditolak: Akun Anda tidak memiliki hak akses Administrator (Role saat ini: ' + profile?.role + ').' },
      { status: 403 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error saat verifikasi role.' }, { status: 500 });
  }
}
