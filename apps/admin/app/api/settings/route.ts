import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import fs from 'fs';
import path from 'path';

// Default fallback profile
const DEFAULT_PROFILE = {
  name: 'Muhammad Alif Muzakky',
  brandName: 'Stack.byAlif',
  roleTitle: 'Pemilik Usaha',
  address: 'Bandung, Jawa Barat',
  phone: '0895-4127-35876',
  email: 'alifmuzakki1110@gmail.com',
  website: 'stackbyalif.my.id',
  legalJurisdictionCity: 'Bandung',
  defaultSignature: '',
};

export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('audit_logs')
      .select('metadata')
      .eq('action', 'PROVIDER_PROFILE_SETTING')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('Could not read settings from audit_logs:', error);
      return NextResponse.json({ profile: DEFAULT_PROFILE });
    }

    const profile = data?.metadata ? { ...DEFAULT_PROFILE, ...data.metadata } : DEFAULT_PROFILE;
    return NextResponse.json({ profile });
  } catch (err: any) {
    console.error('Settings GET error:', err);
    return NextResponse.json({ profile: DEFAULT_PROFILE });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify caller is an authenticated admin
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
      return NextResponse.json({ error: 'Forbidden: Hanya role admin yang diizinkan.' }, { status: 403 });
    }

    const body = await req.json();
    const supabase = getAdminClient();

    const updatedProfile = {
      name: (body.name || DEFAULT_PROFILE.name).trim(),
      brandName: (body.brandName || DEFAULT_PROFILE.brandName).trim(),
      roleTitle: (body.roleTitle || DEFAULT_PROFILE.roleTitle).trim(),
      address: (body.address || DEFAULT_PROFILE.address).trim(),
      phone: (body.phone || DEFAULT_PROFILE.phone).trim(),
      email: (body.email || DEFAULT_PROFILE.email).trim(),
      website: (body.website || DEFAULT_PROFILE.website).trim(),
      legalJurisdictionCity: (body.legalJurisdictionCity || DEFAULT_PROFILE.legalJurisdictionCity).trim(),
      defaultSignature: body.defaultSignature || '',
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to Supabase audit_logs as persistent setting
    const { error: logError } = await supabase.from('audit_logs').insert([
      {
        action: 'PROVIDER_PROFILE_SETTING',
        entity_type: 'settings',
        entity_id: 'provider_profile',
        ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
        metadata: updatedProfile,
      },
    ]);

    if (logError) {
      console.error('Failed to save settings to audit_logs:', logError);
      return NextResponse.json(
        { error: 'Gagal menyimpan pengaturan ke database.' },
        { status: 500 }
      );
    }

    // 2. Also sync to apps/client/config/provider.ts if available on local filesystem
    try {
      const configPath = path.resolve(process.cwd(), '../client/config/provider.ts');
      const rootConfigPath = path.resolve(process.cwd(), 'apps/client/config/provider.ts');
      const targetPath = fs.existsSync(configPath) ? configPath : (fs.existsSync(rootConfigPath) ? rootConfigPath : null);

      if (targetPath) {
        const fileContent = `/**
 * Konfigurasi Identitas Resmi Pihak Pertama (Penyedia Jasa / Stack.byAlif)
 * File ini otomatis disinkronkan dari Menu Pengaturan Admin.
 */
export const PROVIDER_PROFILE = ${JSON.stringify(updatedProfile, null, 2)};
`;
        fs.writeFileSync(targetPath, fileContent, 'utf-8');
      }
    } catch (fsErr) {
      console.warn('Syncing provider config file warning (non-fatal):', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Profil usaha dan identitas kontrak berhasil diperbarui!',
      profile: updatedProfile,
    });
  } catch (err: any) {
    console.error('Settings POST error:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan sistem saat menyimpan.' },
      { status: 500 }
    );
  }
}
