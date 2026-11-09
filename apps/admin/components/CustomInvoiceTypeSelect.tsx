'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  Check,
} from 'lucide-react';

export type InvoiceType = 'down_payment' | 'final_payment' | 'full_payment' | 'custom';

export interface InvoiceTypeMeta {
  value: InvoiceType;
  title: string;
  badge: string;
  subtitle: string;
  icon: any;
  colorClass: string;
  badgeClass: string;
}

export const INVOICE_TYPE_CONFIG: InvoiceTypeMeta[] = [
  {
    value: 'down_payment',
    title: 'Uang Muka (DP 50%)',
    badge: 'DP 50%',
    subtitle: 'Pembayaran awal 50% untuk memulai pengerjaan',
    icon: CreditCard,
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    badgeClass: 'text-amber-400 border-amber-500/30 bg-amber-950/60',
  },
  {
    value: 'final_payment',
    title: 'Pelunasan (Sisa 50%)',
    badge: 'Sisa 50%',
    subtitle: 'Pelunasan sisa 50% sebelum handover & deployment',
    icon: CheckCircle2,
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    badgeClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60',
  },
  {
    value: 'full_payment',
    title: 'Pembayaran Penuh (100%)',
    badge: '100% Full',
    subtitle: 'Pelunasan satu kali di awal untuk paket / setup',
    icon: ShieldCheck,
    colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
    badgeClass: 'text-sky-400 border-sky-500/30 bg-sky-950/60',
  },
  {
    value: 'custom',
    title: 'Tagihan Kustom / Add-on',
    badge: 'Custom',
    subtitle: 'Biaya fitur tambahan, maintenance, atau domain',
    icon: Sliders,
    colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
    badgeClass: 'text-purple-400 border-purple-500/30 bg-purple-950/60',
  },
];

interface CustomInvoiceTypeSelectProps {
  value: InvoiceType;
  onChange: (val: InvoiceType) => void;
  className?: string;
}

export default function CustomInvoiceTypeSelect({
  value,
  onChange,
  className = '',
}: CustomInvoiceTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeType =
    INVOICE_TYPE_CONFIG.find((t) => t.value === value) || INVOICE_TYPE_CONFIG[0];
  const ActiveIcon = activeType.icon;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#0052ff] rounded-xl px-3.5 py-2.5 text-white flex items-center justify-between transition cursor-pointer select-none group text-left shadow-xs"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${activeType.colorClass}`}
          >
            <ActiveIcon className="w-3.5 h-3.5" />
          </div>

          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${activeType.badgeClass}`}
            >
              {activeType.badge}
            </span>
            <span className="font-medium text-slate-100 text-xs truncate">
              {activeType.title}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-[#0052ff]' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
            Pilih Skema Tagihan
          </div>

          {INVOICE_TYPE_CONFIG.map((t) => {
            const Icon = t.icon;
            const isSelected = t.value === value;

            return (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  onChange(t.value);
                  setIsOpen(false);
                }}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-slate-800/90 border border-slate-700/80 shadow-xs'
                    : 'hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${t.colorClass}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${t.badgeClass}`}
                      >
                        {t.badge}
                      </span>
                      <span
                        className={`font-semibold text-xs truncate ${
                          isSelected ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">
                      {t.subtitle}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#0052ff]/20 border border-[#0052ff]/40 flex items-center justify-center text-[#0052ff] shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
