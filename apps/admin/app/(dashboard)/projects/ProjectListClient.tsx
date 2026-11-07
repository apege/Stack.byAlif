'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, ExternalLink, Globe, Search, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Project {
  id: string;
  slug: string;
  title: string;
  short_desc?: string;
  thumbnail: string;
  year?: string;
  tags?: string[];
  live_url?: string;
  is_published: boolean;
}

export default function ProjectListClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch directly from browser Supabase client
  const refreshProjects = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        setProjects(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus project "${title}"?`)) return;

    setLoadingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(`Gagal menghapus project: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_published: !currentStatus } : p))
      );
    } catch (err: any) {
      alert(`Gagal memperbarui status: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan judul, slug, atau tag..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="font-bold">Izin Database Supabase Diperlukan:</div>
            <p className="mt-0.5">{errorMsg}. Jalankan perintah GRANT di SQL Editor Supabase.</p>
          </div>
        </div>
      )}

      {loading && projects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 text-sky-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-xs text-slate-400">Memuat data karya dari Supabase...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">
            {projects.length === 0
              ? 'Belum ada data project yang dapat dimuat. Periksa hak akses database di Supabase SQL Editor.'
              : 'Tidak ada project yang sesuai dengan kata kunci pencarian.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition"
            >
              <div>
                {/* Thumbnail Preview */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800/80">
                  {project.thumbnail ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      onError={(e) => {
                        // Fallback to public portfolio domain if relative path fails
                        if (project.thumbnail?.startsWith('/')) {
                          e.currentTarget.src = `https://stackbyalif.my.id${project.thumbnail}`;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <span className="text-xs text-slate-600">No Image Uploaded</span>
                  )}

                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      project.is_published
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {project.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-xs text-slate-400 font-mono mb-1">
                    /{project.slug} • {project.year || '2026'}
                  </div>
                  <h3 className="font-bold text-base text-white line-clamp-1 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {project.short_desc || 'Tidak ada deskripsi singkat.'}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.tags?.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags && project.tags.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(project.id, project.is_published)}
                  disabled={loadingId === project.id}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {project.is_published ? 'Jadikan Draft' : 'Terbitkan'}
                </button>

                <div className="flex items-center gap-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-sky-400"
                      title="Lihat Website Langsung"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}

                  <Link
                    href={`/projects/edit/${project.id}`}
                    className="text-slate-400 hover:text-sky-400"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={loadingId === project.id}
                    className="text-slate-500 hover:text-red-400 transition cursor-pointer"
                    title="Hapus"
                  >
                    {loadingId === project.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
