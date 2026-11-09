import { createClient } from '@/lib/supabase/server';
import RegistrationsClient from './RegistrationsClient';

export default async function RegistrationsPage() {
  const supabase = await createClient();

  const { data: registrations } = await supabase
    .from('client_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            Client Onboarding
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Formulir Registrasi Klien & Domain
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Data identitas klien, kepemilikan bisnis, opsi registrasi domain, dan bukti persetujuan klausul hukum.
          </p>
        </div>
      </div>

      <RegistrationsClient initialRegistrations={registrations || []} />
    </div>
  );
}
