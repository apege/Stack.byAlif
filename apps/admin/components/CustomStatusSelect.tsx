'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Clock,
  Eye,
  CheckCircle2,
  PauseCircle,
  FileCode2,
  Check,
} from 'lucide-react';

export interface StatusMeta {
  value: 'in_progress' | 'review' | 'completed' | 'on_hold' | 'planning';
  label: string;
  badge: string;
  icon: any;
  colorClass: string;
  dotClass: string;
}

export const STATUS_CONFIG: StatusMeta[] = [
  {
    value: 'in_progress',
    label: 'Sedang Dikerjakan',
    badge: 'In Progress',
    icon: Clock,
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    dotClass: 'bg-amber-400',
  },
  {
    value: 'review',
    label: 'Tahap Review Klien',
    badge: 'Review',
    icon: Eye,
    colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
    dotClass: 'bg-purple-400',
  },
  {
    value: 'completed',
    label: 'Selesai & Handover',
    badge: 'Completed',
    icon: CheckCircle2,
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    dotClass: 'bg-emerald-400',
  },
  {
    value: 'planning',
    label: 'Perencanaan',
    badge: 'Planning',
    icon: FileCode2,
    colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
    dotClass: 'bg-sky-400',
  },
  {
    value: 'on_hold',
    label: 'Ditunda Sementara',
    badge: 'On Hold',
    icon: PauseCircle,
    colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
    dotClass: 'bg-rose-400',
  },
];

interface CustomStatusSelectProps {
  value: 'in_progress' | 'review' | 'completed' | 'on_hold' | 'planning';
  onChange: (
    statusValue: 'in_progress' | 'review' | 'completed' | 'on_hold' | 'planning'
  ) => void;
  className?: string;
}

export default function CustomStatusSelect({
  value,
  onChange,
  className = '',
}: CustomStatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeStatus =
    STATUS_CONFIG.find((s) => s.value === value) || STATUS_CONFIG[0];
  const ActiveIcon = activeStatus.icon;

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
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${activeStatus.dotClass}`}
          />
          <span className="font-medium text-slate-100 text-xs truncate">
            {activeStatus.label}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            ({activeStatus.badge})
          </span>
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
            Status Pengerjaan
          </div>

          {STATUS_CONFIG.map((status) => {
            const Icon = status.icon;
            const isSelected = status.value === value;

            return (
              <button
                key={status.value}
                type="button"
                onClick={() => {
                  onChange(status.value);
                  setIsOpen(false);
                }}
                className={`w-full p-2 rounded-xl flex items-center justify-between gap-2.5 text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-slate-800/90 border border-slate-700/80 shadow-xs'
                    : 'hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${status.colorClass}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-slate-200'
                      }`}
                    >
                      {status.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {status.badge}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#0052ff]/20 border border-[#0052ff]/40 flex items-center justify-center text-[#0052ff] shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
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
