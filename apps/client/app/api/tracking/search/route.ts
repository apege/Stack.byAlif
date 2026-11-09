import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

// In-memory rate limiter: 15 queries per 10 minutes per IP
const searchLimiters = new Map<string, { count: number; lastReset: number }>();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code') || searchParams.get('q');

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: 'Masukkan Kode Tracking (PRJ-...) atau No. Registrasi (REG-...).' },
        { status: 400 }
      );
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const cfIp = req.headers.get('cf-connecting-ip');
    const clientIp = cfIp || (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1');
    const now = Date.now();

    // Check rate limit
    const tracker = searchLimiters.get(clientIp);
    if (tracker) {
      if (now - tracker.lastReset > 10 * 60 * 1000) {
        searchLimiters.set(clientIp, { count: 1, lastReset: now });
      } else {
        if (tracker.count >= 20) {
          return NextResponse.json(
            { error: 'Terlalu banyak permintaan pencarian status. Coba lagi dalam beberapa menit.' },
            { status: 429 }
          );
        }
        tracker.count += 1;
      }
    } else {
      searchLimiters.set(clientIp, { count: 1, lastReset: now });
    }

    const cleanCode = code.trim().toUpperCase();
    const supabase = getAdminClient();

    // Search by tracking_code, registration_number, or id
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanCode);

    let query = supabase.from('project_trackings').select('*');

    if (isUUID) {
      query = query.or(`id.eq.${cleanCode},tracking_code.eq.${cleanCode}`);
    } else {
      query = query.or(`tracking_code.eq.${cleanCode},registration_number.eq.${cleanCode}`);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        {
          error: `Proyek dengan kode "${cleanCode}" tidak ditemukan. Pastikan Anda memasukkan kode tracking (PRJ-...) atau nomor registrasi (REG-...) yang benar.`,
        },
        { status: 404 }
      );
    }

    // Return public-safe tracking view (hide internal db IDs if any)
    return NextResponse.json({
      success: true,
      data: {
        tracking_code: data.tracking_code,
        registration_number: data.registration_number,
        project_name: data.project_name,
        client_name: data.client_name,
        client_company: data.client_company,
        current_phase: data.current_phase,
        progress_percent: data.progress_percent,
        status: data.status,
        staging_url: data.staging_url,
        production_url: data.production_url,
        estimated_completion: data.estimated_completion,
        milestones: data.milestones || [],
        activity_logs: data.activity_logs || [],
        updated_at: data.updated_at,
      },
    });
  } catch (err: any) {
    console.error('Tracking search error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
