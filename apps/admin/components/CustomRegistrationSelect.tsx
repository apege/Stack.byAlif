'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  Search,
  Check,
  X,
  User,
  Building2,
  Globe,
  Mail,
  FileText,
  UserCheck,
} from 'lucide-react';

export interface ClientRegistrationOption {
  id: string;
  registration_number: string;
  full_name: string;
  business_name: string;
  email?: string;
  domain_name?: string;
}

export interface AgreementOption {
  id: string;
  project_title: string;
  client_id: string;
}

interface CustomRegistrationSelectProps {
  registrations: ClientRegistrationOption[];
  agreements?: AgreementOption[];
  selectedSource: string; // e.g. "reg:REG-08D17132" or "ag:id" or ""
  onSelectRegistration: (reg: ClientRegistrationOption) => void;
  onSelectAgreement?: (ag: AgreementOption) => void;
  onClear: () => void;
  className?: string;
}

export default function CustomRegistrationSelect({
  registrations,
  agreements = [],
  selectedSource,
  onSelectRegistration,
  onSelectAgreement,
  onClear,
  className = '',
}: CustomRegistrationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Find currently selected item
  const selectedReg = useMemo(() => {
    if (!selectedSource.startsWith('reg:')) return null;
    const regNum = selectedSource.replace('reg:', '');
    return (
      registrations.find((r) => r.registration_number === regNum) || null
    );
  }, [selectedSource, registrations]);

  const selectedAg = useMemo(() => {
    if (!selectedSource.startsWith('ag:')) return null;
    const agId = selectedSource.replace('ag:', '');
    return agreements.find((a) => a.id === agId) || null;
  }, [selectedSource, agreements]);

  // Filter registrations by search query
  const filteredRegistrations = useMemo(() => {
    if (!searchQuery.trim()) return registrations;
    const q = searchQuery.toLowerCase().trim();
    return registrations.filter(
      (r) =>
        r.registration_number.toLowerCase().includes(q) ||
        r.full_name.toLowerCase().includes(q) ||
        r.business_name.toLowerCase().includes(q) ||
        (r.domain_name && r.domain_name.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q))
    );
  }, [registrations, searchQuery]);

  // Filter agreements by search query
  const filteredAgreements = useMemo(() => {
    if (!searchQuery.trim()) return agreements;
    const q = searchQuery.toLowerCase().trim();
    return agreements.filter((a) =>
      a.project_title.toLowerCase().includes(q)
    );
  }, [agreements, searchQuery]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full bg-slate-950 border ${
          selectedReg || selectedAg
            ? 'border-sky-500/40 bg-sky-950/10'
            : 'border-slate-800 hover:border-slate-700'
        } focus:border-[#0052ff] rounded-xl px-3.5 py-2.5 text-white flex items-center justify-between transition cursor-pointer select-none group text-left shadow-xs outline-none`}
      >
        {selectedReg ? (
          <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center shrink-0 text-sky-400">
              <UserCheck className="w-3.5 h-3.5" />
            </div>

            <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/30 text-sky-400 shrink-0">
              {selectedReg.registration_number}
            </span>

            <span className="font-medium text-slate-100 text-xs truncate">
              {selectedReg.full_name}
            </span>

            <span className="text-slate-600 text-xs shrink-0">•</span>

            <span className="text-slate-400 text-xs truncate">
              {selectedReg.business_name}
            </span>

            {selectedReg.domain_name && (
              <span className="text-[11px] font-mono text-slate-500 truncate hidden md:inline">
                ({selectedReg.domain_name})
              </span>
            )}
          </div>
        ) : selectedAg ? (
          <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center shrink-0 text-purple-400">
              <FileText className="w-3.5 h-3.5" />
            </div>

            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-400 shrink-0 uppercase">
              PKS
            </span>

            <span className="font-medium text-slate-100 text-xs truncate">
              {selectedAg.project_title}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-slate-400 text-xs">
            <User className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Pilih registrasi masuk untuk auto-fill formulir...</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {(selectedReg || selectedAg) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800/80 transition"
              title="Lepas tautan registrasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#0052ff]' : ''
            }`}
          />
        </div>
      </div>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari nama, brand, domain, nomor REG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0052ff] transition"
            />
          </div>

          <div className="max-h-72 overflow-y-auto space-y-3 pr-0.5">
            {/* Registrations Group */}
            {filteredRegistrations.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Registrasi Klien Masuk</span>
                  <span className="text-[10px] font-mono text-sky-400">
                    {filteredRegistrations.length} data
                  </span>
                </div>

                {filteredRegistrations.map((r) => {
                  const isSelected =
                    selectedSource === `reg:${r.registration_number}`;

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        onSelectRegistration(r);
                        setIsOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-slate-800/90 border border-slate-700/80 shadow-xs'
                          : 'hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <div className="flex flex-col gap-1 overflow-hidden min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/30 text-sky-400 shrink-0">
                            {r.registration_number}
                          </span>
                          <span
                            className={`font-semibold text-xs truncate ${
                              isSelected ? 'text-white' : 'text-slate-200'
                            }`}
                          >
                            {r.full_name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 overflow-hidden">
                          <span className="flex items-center gap-1 truncate">
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            {r.business_name}
                          </span>

                          {r.domain_name && (
                            <span className="flex items-center gap-1 font-mono text-slate-400 truncate">
                              <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                              {r.domain_name}
                            </span>
                          )}

                          {r.email && (
                            <span className="hidden sm:flex items-center gap-1 text-slate-500 truncate">
                              <Mail className="w-3 h-3 text-slate-600 shrink-0" />
                              {r.email}
                            </span>
                          )}
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

            {/* Agreements Group */}
            {filteredAgreements.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-slate-800/60">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Kontrak Agreement PKS</span>
                  <span className="text-[10px] font-mono text-purple-400">
                    {filteredAgreements.length} data
                  </span>
                </div>

                {filteredAgreements.map((a) => {
                  const isSelected = selectedSource === `ag:${a.id}`;

                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        if (onSelectAgreement) onSelectAgreement(a);
                        setIsOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-slate-800/90 border border-slate-700/80 shadow-xs'
                          : 'hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
                        <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-400 shrink-0">
                          PKS
                        </span>
                        <span
                          className={`font-semibold text-xs truncate ${
                            isSelected ? 'text-white' : 'text-slate-200'
                          }`}
                        >
                          {a.project_title}
                        </span>
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

            {filteredRegistrations.length === 0 &&
              filteredAgreements.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500">
                  Tidak ada registrasi yang sesuai dengan pencarian.
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
