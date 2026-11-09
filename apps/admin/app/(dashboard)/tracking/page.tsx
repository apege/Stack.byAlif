import { createClient } from '@/lib/supabase/server';
import TrackingClient from './TrackingClient';

export default async function TrackingPage() {
  const supabase = await createClient();

  const [
    { data: trackings },
    { data: clients },
    { data: agreements },
    { data: registrations },
  ] = await Promise.all([
    supabase
      .from('project_trackings')
      .select('*')
      .order('updated_at', { ascending: false }),
    supabase
      .from('clients')
      .select('id, name, company, email')
      .order('name', { ascending: true }),
    supabase
      .from('agreements')
      .select('id, project_title, client_id')
      .order('created_at', { ascending: false }),
    supabase
      .from('client_registrations')
      .select('id, registration_number, full_name, business_name, email, domain_name')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            Project Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Status Proyek & Live Milestone Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kelola tahapan pengerjaan (onboarding, design, development, QA, deployment). Klien dapat mengecek progres secara transparan di Client Portal.
          </p>
        </div>
      </div>

      <TrackingClient
        initialTrackings={trackings || []}
        clients={clients || []}
        agreements={agreements || []}
        registrations={registrations || []}
      />
    </div>
  );
}
