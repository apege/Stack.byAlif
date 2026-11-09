'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ClipboardCheck,
  Palette,
  Code2,
  Database,
  ShieldCheck,
  Eye,
  Rocket,
  CheckCircle2,
  Check,
} from 'lucide-react';

export interface PhaseMeta {
  value: string;
  number: string;
  title: string;
  subtitle: string;
  icon: any;
  colorClass: string;
  badgeClass: string;
}

export const PHASE_CONFIG: PhaseMeta[] = [
  {
    value: '01. Onboarding & Verifikasi Data',
    number: '01',
    title: 'Onboarding & Verifikasi Data',
    subtitle: 'Pengumpulan brief, verifikasi identitas & domain',
    icon: ClipboardCheck,
    colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
    badgeClass: 'text-sky-400 border-sky-500/30 bg-sky-950/60',
  },
  {
    value: '02. Wireframing & UI/UX Design',
    number: '02',
    title: 'Wireframing & UI/UX Design',
    subtitle: 'Rancangan arsitektur UI, layout & visual mockup',
    icon: Palette,
    colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
    badgeClass: 'text-purple-400 border-purple-500/30 bg-purple-950/60',
  },
  {
    value: '03. Frontend & Architecture Engineering',
    number: '03',
    title: 'Frontend & Architecture Engineering',
    subtitle: 'Pembangunan komponen Next.js, animasi & interaktivitas',
    icon: Code2,
    colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    badgeClass: 'text-blue-400 border-blue-500/30 bg-blue-950/60',
  },
  {
    value: '04. Backend, Database & API Integration',
    number: '04',
    title: 'Backend, Database & API Integration',
    subtitle: 'Setup skema database Supabase, webhook & REST API',
    icon: Database,
    colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
    badgeClass: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/60',
  },
  {
    value: '05. Testing, Security QA & Audit',
    number: '05',
    title: 'Testing, Security QA & Audit',
    subtitle: 'Audit keamanan RLS, cross-device QA & benchmark performa',
    icon: ShieldCheck,
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    badgeClass: 'text-amber-400 border-amber-500/30 bg-amber-950/60',
  },
  {
    value: '06. Client Review & Revisions',
    number: '06',
    title: 'Client Review & Revisions',
    subtitle: 'Peninjauan langsung oleh klien & penyesuaian detail',
    icon: Eye,
    colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
    badgeClass: 'text-rose-400 border-rose-500/30 bg-rose-950/60',
  },
  {
    value: '07. Production Deployment & Handover',
    number: '07',
    title: 'Production Deployment & Handover',
    subtitle: 'Peluncuran live domain, sertifikat SSL & serah terima',
    icon: Rocket,
    colorClass: 'text-teal-400 bg-teal-500/10 border-teal-500/25',
    badgeClass: 'text-teal-400 border-teal-500/30 bg-teal-950/60',
  },
  {
    value: 'Selesai (Completed)',
    number: '✓',
    title: 'Selesai (Completed)',
    subtitle: 'Proyek tuntas 100%, sistem online live & garansi aktif',
    icon: CheckCircle2,
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    badgeClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60',
  },
];

interface CustomPhaseSelectProps {
  value: string;
  onChange: (phaseValue: string) => void;
  className?: string;
}

export default function CustomPhaseSelect({
  value,
  onChange,
  className = '',
}: CustomPhaseSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find active phase config
  const activePhase =
    PHASE_CONFIG.find((p) => p.value === value) || PHASE_CONFIG[0];
  const ActiveIcon = activePhase.icon;

  // Click outside listener
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
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${activePhase.colorClass}`}
          >
            <ActiveIcon className="w-3.5 h-3.5" />
          </div>

          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${activePhase.badgeClass}`}
            >
              {activePhase.number}
            </span>
            <span className="font-medium text-slate-100 text-xs truncate">
              {activePhase.title}
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
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-2 max-h-72 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center justify-between">
            <span>Pilih Tahapan Proyek</span>
            <span className="text-[9px] text-[#0052ff] font-medium font-sans">
              8 Fase Standar
            </span>
          </div>

          {PHASE_CONFIG.map((phase) => {
            const Icon = phase.icon;
            const isSelected = phase.value === value;

            return (
              <button
                key={phase.value}
                type="button"
                onClick={() => {
                  onChange(phase.value);
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
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${phase.colorClass}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${phase.badgeClass}`}
                      >
                        {phase.number}
                      </span>
                      <span
                        className={`font-semibold text-xs truncate ${
                          isSelected ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {phase.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">
                      {phase.subtitle}
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
