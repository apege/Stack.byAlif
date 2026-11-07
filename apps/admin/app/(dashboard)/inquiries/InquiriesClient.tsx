'use client';

import { useState } from 'react';
import { Mail, Phone, Calendar, Check, Archive, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'contacted' | 'archived';
  created_at: string;
}

export default function InquiriesClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: 'unread' | 'contacted' | 'archived') => {
    setLoadingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
    } catch (err: any) {
      alert(`Gagal memperbarui status: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini secara permanen?')) return;
    setLoadingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(`Gagal menghapus pesan: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {inquiries.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            Belum ada pesan masuk dari formulir kontak.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const isUnread = inquiry.status === 'unread';
            const isContacted = inquiry.status === 'contacted';

            return (
              <div
                key={inquiry.id}
                className={`p-6 bg-slate-900 border rounded-2xl transition flex flex-col md:flex-row md:items-start justify-between gap-6 ${
                  isUnread
                    ? 'border-sky-500/50 shadow-md shadow-sky-500/5 bg-slate-900/90'
                    : 'border-slate-800'
                }`}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isUnread
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                          : isContacted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {inquiry.status}
                    </span>

                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(inquiry.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{inquiry.name}</h3>
                    <div className="text-xs text-sky-400 font-medium mt-0.5">
                      Proyek: {inquiry.subject || 'Konsultasi Umum'}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-1.5 hover:text-white transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{inquiry.email}</span>
                    </a>

                    {inquiry.phone && inquiry.phone !== '-' && (
                      <a
                        href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-emerald-400 transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{inquiry.phone} (WhatsApp)</span>
                      </a>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {inquiry.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center md:flex-col gap-2 shrink-0 self-end md:self-start">
                  {isUnread && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry.id, 'contacted')}
                      disabled={loadingId === inquiry.id}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Tandai Dihubungi</span>
                    </button>
                  )}

                  {inquiry.status !== 'archived' && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry.id, 'archived')}
                      disabled={loadingId === inquiry.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Arsipkan</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    disabled={loadingId === inquiry.id}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition cursor-pointer"
                    title="Hapus"
                  >
                    {loadingId === inquiry.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
