import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    // 1. Verify that the caller is authenticated as an admin
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Harap login terlebih dahulu.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Hanya role admin yang diizinkan mengunduh backup.' }, { status: 403 });
    }

    // 2. Fetch all tables via Admin client
    const adminSupabase = getAdminClient();
    const tables = ['projects', 'clients', 'agreements', 'agreement_versions', 'inquiries', 'audit_logs', 'profiles'];

    const backupData: Record<string, any> = {
      meta: {
        exportedAt: new Date().toISOString(),
        exportedBy: user.email,
        version: '1.0.0',
        system: 'Stack.byAlif Management Database',
      },
      tables: {},
    };

    for (const table of tables) {
      const { data, error } = await adminSupabase.from(table).select('*');
      if (error) {
        backupData.tables[table] = { error: error.message };
      } else {
        backupData.tables[table] = data || [];
      }
    }

    // Log the backup action into audit_logs
    await adminSupabase.from('audit_logs').insert([
      {
        action: 'DATABASE_BACKUP_EXPORTED',
        entity_type: 'system',
        performed_by: user.id,
        metadata: { timestamp: new Date().toISOString() },
      },
    ]);

    const jsonString = JSON.stringify(backupData, null, 2);
    const filename = `stackbyalif_backup_${new Date().toISOString().slice(0, 10)}.json`;

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal membuat backup database.' },
      { status: 500 }
    );
  }
}
