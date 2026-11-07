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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
              Kontrak & Bukti Kerja Sama
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 uppercase">
              Immutable Signed Docs
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Manajemen Agreement & Tanda Tangan Digital
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Buat draf kontrak dengan token acak 256-bit dan kode verifikasi yang dapat kedaluwarsa. Dokumen yang telah ditandatangani terkunci secara permanen.
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
