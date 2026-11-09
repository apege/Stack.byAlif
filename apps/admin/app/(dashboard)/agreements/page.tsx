import { createClient } from '@/lib/supabase/server';
import AgreementsClient from './AgreementsClient';

export default async function AgreementsPage() {
  const supabase = await createClient();

  // Fetch agreements with joined client details
  const { data: agreements } = await supabase
    .from('agreements')
    .select(`
      *,
      client:clients(id, name, company, email, phone)
    `)
    .order('created_at', { ascending: false });

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, company, email')
    .order('company', { ascending: true });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            Kontrak & Legalitas
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Manajemen Agreement & Tanda Tangan Digital
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Buat draf kontrak dengan token acak 256-bit dan kode verifikasi. Dokumen yang telah ditandatangani bersifat permanen.
          </p>
        </div>
      </div>

      <AgreementsClient
        initialAgreements={agreements || []}
        clients={clients || []}
      />
    </div>
  );
}
