import Link from 'next/link';
import { Plus, Edit2, Trash2, ExternalLink, Globe, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ProjectListClient from './ProjectListClient';

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="max-w-2xl">
          <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            Portfolio Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Daftar Karya & Project
          </h1>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Unggah screenshot/gambar langsung ke Supabase Storage tanpa perlu memindahkan file secara manual ke folder kode.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium px-4 py-2.5 rounded-xl text-sm transition shadow-xs cursor-pointer self-start sm:self-auto shrink-0 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Project Baru</span>
        </Link>
      </div>

      <ProjectListClient initialProjects={projects || []} />
    </div>
  );
}
