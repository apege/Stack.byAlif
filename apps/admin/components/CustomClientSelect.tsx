'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  Search,
  Check,
  X,
  User,
  Building2,
  Mail,
  Phone,
  UserCheck,
} from 'lucide-react';

export interface ClientOption {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface CustomClientSelectProps {
  clients: ClientOption[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export default function CustomClientSelect({
  clients,
  selectedClientId,
  onSelectClient,
  onClear,
  placeholder = 'Isi manual atau pilih dari klien tersimpan...',
  className = '',
}: CustomClientSelectProps) {
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

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || null,
    [clients, selectedClientId]
  );

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q))
    );
  }, [clients, searchQuery]);

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
          selectedClient
            ? 'border-sky-500/40 bg-sky-950/10'
            : 'border-slate-800 hover:border-slate-700'
        } focus:border-[#0052ff] rounded-xl px-3.5 py-2.5 text-white flex items-center justify-between transition cursor-pointer select-none group text-left shadow-xs outline-none`}
      >
        {selectedClient ? (
          <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center shrink-0 text-sky-400">
              <UserCheck className="w-3.5 h-3.5" />
            </div>

            <span className="font-semibold text-slate-100 text-xs truncate">
              {selectedClient.name}
            </span>

            {selectedClient.company && (
              <>
                <span className="text-slate-600 text-xs shrink-0">•</span>
                <span className="text-slate-400 text-xs truncate">
                  {selectedClient.company}
                </span>
              </>
            )}

            {selectedClient.email && (
              <span className="text-[11px] font-mono text-slate-500 truncate hidden md:inline">
                ({selectedClient.email})
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-slate-400 text-xs">
            <User className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{placeholder}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {selectedClient && onClear && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800/80 transition"
              title="Lepas pilihan klien"
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
              placeholder="Cari nama klien, perusahaan, email, atau telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0052ff] transition"
            />
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
            {/* Reset / Manual input option */}
            {onClear && (
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group ${
                  !selectedClientId
                    ? 'bg-slate-800/80 text-sky-400 border border-slate-700/60'
                    : 'hover:bg-slate-800/40 text-slate-400 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="italic">Isi Manual (Tanpa Tautkan Klien)</span>
                </div>
                {!selectedClientId && (
                  <Check className="w-3.5 h-3.5 text-sky-400" />
                )}
              </button>
            )}

            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-t border-slate-800/60 pt-1.5">
              <span>Klien Tersimpan</span>
              <span className="text-[10px] font-mono text-sky-400">
                {filteredClients.length} klien
              </span>
            </div>

            {filteredClients.map((c) => {
              const isSelected = selectedClientId === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onSelectClient(c.id);
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
                      <span
                        className={`font-semibold text-xs truncate ${
                          isSelected ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {c.name}
                      </span>
                      {c.company && (
                        <span className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                          {c.company}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 overflow-hidden">
                      {c.email && (
                        <span className="flex items-center gap-1 truncate font-mono text-[10px] text-slate-400">
                          <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                          {c.email}
                        </span>
                      )}
                      {c.phone && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500 truncate">
                          <Phone className="w-3 h-3 text-slate-600 shrink-0" />
                          {c.phone}
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

            {filteredClients.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500">
                Tidak ada klien yang cocok dengan pencarian.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
