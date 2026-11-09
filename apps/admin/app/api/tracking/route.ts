import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('project_trackings')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Fetch tracking error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    console.error('Tracking GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      project_name,
      client_name,
      client_company,
      registration_number,
      agreement_id,
      client_id,
      current_phase,
      progress_percent,
      status,
      staging_url,
      production_url,
      estimated_completion,
      milestones,
      initial_log,
    } = body;

    if (!project_name || !client_name) {
      return NextResponse.json(
        { error: 'Nama proyek dan nama klien wajib diisi.' },
        { status: 400 }
      );
    }

    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const trackingCode = `PRJ-${randomHex}`;

    const defaultMilestones = [
      { id: '1', title: '01. Onboarding & Verifikasi Data', status: 'completed', date: new Date().toISOString().split('T')[0] },
      { id: '2', title: '02. Wireframing & UI/UX Design', status: 'in_progress' },
      { id: '3', title: '03. Frontend & Architecture Engineering', status: 'pending' },
      { id: '4', title: '04. Backend, Database & API Integration', status: 'pending' },
      { id: '5', title: '05. Testing, Security QA & Audit', status: 'pending' },
      { id: '6', title: '06. Client Review & Revisions', status: 'pending' },
      { id: '7', title: '07. Production Deployment & Handover', status: 'pending' },
    ];

    const logs = [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        message: initial_log || 'Inisiasi proyek dan onboarding berhasil dimulai.',
        author: 'Stack.byAlif Team',
      },
    ];

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('project_trackings')
      .insert([
        {
          tracking_code: trackingCode,
          registration_number: registration_number || '',
          agreement_id: agreement_id || null,
          client_id: client_id || null,
          project_name: project_name.trim(),
          client_name: client_name.trim(),
          client_company: (client_company || '').trim(),
          current_phase: current_phase || '01. Onboarding & Verifikasi Data',
          progress_percent: progress_percent !== undefined ? Number(progress_percent) : 15,
          status: status || 'in_progress',
          staging_url: (staging_url || '').trim(),
          production_url: (production_url || '').trim(),
          estimated_completion: estimated_completion || null,
          milestones: milestones && Array.isArray(milestones) ? milestones : defaultMilestones,
          activity_logs: logs,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Insert tracking error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Tracking POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      current_phase,
      progress_percent,
      status,
      staging_url,
      production_url,
      estimated_completion,
      milestones,
      new_log_message,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Tracking ID diperlukan.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Fetch existing tracking to append logs if message provided
    const { data: current, error: fetchErr } = await supabase
      .from('project_trackings')
      .select('activity_logs')
      .eq('id', id)
      .single();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (current_phase) updatePayload.current_phase = current_phase;
    if (progress_percent !== undefined) updatePayload.progress_percent = Number(progress_percent);
    if (status) updatePayload.status = status;
    if (staging_url !== undefined) updatePayload.staging_url = staging_url;
    if (production_url !== undefined) updatePayload.production_url = production_url;
    if (estimated_completion !== undefined) updatePayload.estimated_completion = estimated_completion;
    if (milestones) updatePayload.milestones = milestones;

    if (new_log_message && new_log_message.trim()) {
      const existingLogs = Array.isArray(current.activity_logs) ? current.activity_logs : [];
      const newEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        message: new_log_message.trim(),
        author: 'Stack.byAlif Team',
      };
      updatePayload.activity_logs = [newEntry, ...existingLogs];
    }

    const { data, error } = await supabase
      .from('project_trackings')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Update tracking error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Tracking PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Tracking ID diperlukan.' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from('project_trackings').delete().eq('id', id);

    if (error) {
      console.error('Delete tracking error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Tracking DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
