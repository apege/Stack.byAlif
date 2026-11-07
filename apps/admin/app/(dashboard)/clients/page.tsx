import { createClient } from '@/lib/supabase/server';
import ClientsClient from './ClientsClient';

export default async function ClientsPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
              Direktori Klien Rahasia
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/80 uppercase">
              Strictly Confidential (RLS)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Data Klien & Mitra Kerja Sama
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Data identitas klien dilindungi kebijakan keamanan Supabase RLS dan tidak pernah terekspos di portfolio publik.
          </p>
        </div>
      </div>

      <ClientsClient initialClients={clients || []} />
    </div>
  );
}
