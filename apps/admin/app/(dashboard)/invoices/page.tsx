import { createClient } from '@/lib/supabase/server';
import InvoicesClient from './InvoicesClient';

export default async function InvoicesPage() {
  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, company, email, phone, address')
    .order('name', { ascending: true });

  const { data: agreements } = await supabase
    .from('agreements')
    .select('id, project_title, total_fee, client_id')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
              Financial & Billing
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 uppercase">
              Official Invoicing
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Manajemen Invoice & Pembayaran
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Terbitkan invoice resmi, catat termin DP 50% dan pelunasan, serta kirimkan link tagihan resmi dengan ketentuan non-refundable refund policy.
          </p>
        </div>
      </div>

      <InvoicesClient
        initialInvoices={invoices || []}
        clients={clients || []}
        agreements={agreements || []}
      />
    </div>
  );
}
