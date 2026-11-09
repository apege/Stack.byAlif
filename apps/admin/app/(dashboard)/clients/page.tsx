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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            Direktori Klien
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Data Klien & Mitra Kerja Sama
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Data identitas dan kontak klien tersimpan secara privat untuk kebutuhan administrasi proyek.
          </p>
        </div>
      </div>

      <ClientsClient initialClients={clients || []} />
    </div>
  );
}
