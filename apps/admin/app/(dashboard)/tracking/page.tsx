import { createClient } from '@/lib/supabase/server';
import TrackingClient from './TrackingClient';

export default async function TrackingPage() {
  const supabase = await createClient();

  const { data: trackings } = await supabase
    .from('project_trackings')
    .select('*')
    .order('updated_at', { ascending: false });

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, company, email')
    .order('name', { ascending: true });

  const { data: agreements } = await supabase
    .from('agreements')
    .select('id, project_title, client_id')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
              Project Management & Live Tracking
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 uppercase">
              Real-time Client Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
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
      />
    </div>
  );
}
