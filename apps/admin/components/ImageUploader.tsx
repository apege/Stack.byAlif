'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, X, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Upload Gambar',
  folder = 'projects',
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 5MB.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const cleanFileName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .toLowerCase();
      const fileName = `${folder}/${Date.now()}_${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw new Error(error.message || 'Gagal mengunggah file ke Supabase Storage.');
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('project-images').getPublicUrl(data.path);

      onChange(publicUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat upload gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </label>

      {value ? (
        <div className="relative group border border-slate-700 rounded-xl overflow-hidden bg-slate-900/60 p-2">
          <div className="relative h-48 w-full rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              onError={(e) => {
                if (value?.startsWith('/')) {
                  e.currentTarget.src = `https://stackbyalif.my.id${value}`;
                }
              }}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <span className="text-xs text-slate-400 truncate max-w-[280px]">
              {value}
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 rounded-lg bg-red-950/80 text-red-400 hover:bg-red-900 border border-red-800 transition cursor-pointer text-xs flex items-center gap-1 px-2 py-1"
            >
              <X className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl p-8 text-center cursor-pointer transition bg-slate-900/40 hover:bg-slate-900/80 flex flex-col items-center justify-center gap-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-sky-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-medium">Mengunggah ke Supabase Storage...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-sky-400">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Klik untuk pilih atau drag & drop gambar ke sini
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG, WebP, SVG hingga 5MB. Otomatis tersimpan ke Cloud Storage.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
