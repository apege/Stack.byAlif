import { createClient } from '@/lib/supabase/server';
import InquiriesClient from './InquiriesClient';

export default async function InquiriesPage() {
  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            Pesan Masuk
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Pesan Masuk & Konsultasi Klien
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Daftar pesan prospek yang dikirimkan oleh calon klien melalui formulir kontak portfolio.
          </p>
        </div>
      </div>

      <InquiriesClient initialInquiries={inquiries || []} />
    </div>
  );
}
