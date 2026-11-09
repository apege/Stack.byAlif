'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ImageUploader from '@/components/ImageUploader';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ProjectFormProps {
  initialData?: {
    id?: string;
    slug: string;
    title: string;
    short_desc: string;
    description: string;
    thumbnail: string;
    year: string;
    tags: string[];
    live_url: string;
    github_url: string;
    overview: string;
    challenge: string;
    process: string;
    results: string;
    gallery: string[];
    is_published: boolean;
    display_order: number;
  };
  isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    short_desc: initialData?.short_desc || '',
    description: initialData?.description || initialData?.overview || '',
    thumbnail: initialData?.thumbnail || '',
    year: initialData?.year || '2026',
    tagsInput: initialData?.tags?.join(', ') || '',
    live_url: initialData?.live_url || '',
    github_url: initialData?.github_url || '',
    overview: initialData?.overview || initialData?.description || '',
    challenge: initialData?.challenge || '',
    process: initialData?.process || '',
    results: initialData?.results || '',
    gallery: initialData?.gallery || [],
    is_published: initialData?.is_published ?? true,
    display_order: initialData?.display_order || 0,
  });

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      // Auto-generate slug if not editing or slug hasn't been manually set
      const autoSlug = !isEdit && !prev.slug
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : prev.slug;

      return { ...prev, title: val, slug: autoSlug };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const tagsArray = formData.tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const shortDesc = formData.short_desc.trim();
      const detailedOverview = (formData.overview || formData.description || shortDesc).trim();

      const payload = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        short_desc: shortDesc,
        description: shortDesc,
        thumbnail: formData.thumbnail.trim(),
        year: formData.year.trim(),
        tags: tagsArray,
        live_url: formData.live_url.trim(),
        github_url: formData.github_url.trim(),
        overview: detailedOverview,
        challenge: formData.challenge?.trim() || '',
        process: formData.process?.trim() || '',
        results: formData.results?.trim() || '',
        gallery: formData.gallery,
        is_published: formData.is_published,
        display_order: Number(formData.display_order) || 0,
        updated_at: new Date().toISOString(),
      };

      if (!payload.title || !payload.slug || !payload.thumbnail || !payload.short_desc) {
        throw new Error('Judul, Slug, Thumbnail gambar, dan Deskripsi Singkat wajib diisi.');
      }

      if (isEdit && initialData?.id) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      }

      router.push('/projects');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan data project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEdit ? 'Edit Project' : 'Tambah Project Baru'}
            </h1>
            <p className="text-xs text-slate-400">
              Isi data detail project dan unggah aset visual ke Supabase Storage.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#0052ff] hover:bg-[#0045d8] text-white font-medium px-5 py-2.5 rounded-xl text-sm transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Simpan Project
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Judul Project *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Sistem Reservasi Villa Terpadu"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Slug URL * (Unik)
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="sistem-reservasi-villa"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tahun & Urutan Tampilan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2026"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                placeholder="Order (0, 1, 2...)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tags / Kategori (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={formData.tagsInput}
              onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
              placeholder="Hospitality System, Booking Engine, Admin Dashboard"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Live URL Website
            </label>
            <input
              type="url"
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              placeholder="https://client-project.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Thumbnail Upload Column */}
        <div className="space-y-4">
          <ImageUploader
            label="Thumbnail Utama (Upload ke Cloud)"
            value={formData.thumbnail}
            onChange={(url) => setFormData({ ...formData, thumbnail: url })}
            folder="thumbnails"
          />

          <div className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl mt-4">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-slate-200 cursor-pointer">
              Terbitkan langsung di website portfolio publik
            </label>
          </div>
        </div>
      </div>

      {/* Text Content Sections */}
      <div className="space-y-6 pt-4 border-t border-slate-800">
        {/* Field 1: Short Description (Subtitle di bawah judul & di card homepage) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Deskripsi Singkat (Subtitle di Bawah Judul) *
            </label>
            <span className="text-[11px] text-sky-400">
              1-2 Kalimat Ringkas
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
            Ditampilkan tepat di bawah judul pada halaman proyek dan kartu daftar karya di beranda portofolio.
          </p>
          <textarea
            rows={2}
            required
            value={formData.short_desc}
            onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
            placeholder="Contoh: Platform merchant digital (top-up & game voucher) end-to-end dengan verifikasi otomatis & analitik laba"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
          />
        </div>

        {/* Field 2: Ringkasan Layanan Pendampingan System (Card di halaman detail) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Ringkasan Layanan Pendampingan System (Isi Card Detail) *
            </label>
            <span className="text-[11px] text-emerald-400">
              Isi Card Detail Proyek
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
            Ditampilkan di dalam card khusus &quot;Ringkasan Layanan Pendampingan System&quot; pada halaman detail proyek.
          </p>
          <textarea
            rows={6}
            required
            value={formData.overview}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({
                ...formData,
                overview: val,
                description: val,
              });
            }}
            placeholder="Contoh: Stack.byAlif memberikan layanan pendampingan dan pengoptimalan sistem transaksi digital harian serta otomatisasi workflow operasional bisnis..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
          />
        </div>
      </div>
    </form>
  );
}
