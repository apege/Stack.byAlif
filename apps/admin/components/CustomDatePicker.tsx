'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // Format: 'YYYY-MM-DD'
  onChange: (dateStr: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: string;
  required?: boolean;
  align?: 'left' | 'right' | 'auto';
}

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAYS_SHORT_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

function parseYMD(str: string): { year: number; month: number; day: number } | null {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-based
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day };
}

function formatDisplayDate(dateStr: string): string {
  const parsed = parseYMD(dateStr);
  if (!parsed) return '';
  const monthName = MONTH_NAMES_ID[parsed.month] || '';
  return `${parsed.day} ${monthName.slice(0, 3)} ${parsed.year}`;
}

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Pilih tanggal...',
  className = '',
  required = false,
  align = 'auto',
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view date
  const parsedValue = parseYMD(value);
  const today = new Date();
  const [viewYear, setViewYear] = useState<number>(
    parsedValue ? parsedValue.year : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    parsedValue ? parsedValue.month : today.getMonth()
  );

  // Alignment detection
  const [computedAlign, setComputedAlign] = useState<'left' | 'right'>(
    align === 'right' ? 'right' : 'left'
  );

  useEffect(() => {
    if (align === 'right') {
      setComputedAlign('right');
      return;
    }
    if (align === 'left') {
      setComputedAlign('left');
      return;
    }
    // Auto-detect if container is on the right half of window or parent
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - rect.left;
      if (spaceOnRight < 340 || rect.left > window.innerWidth / 2) {
        setComputedAlign('right');
      } else {
        setComputedAlign('left');
      }
    }
  }, [isOpen, align]);

  // Sync view month/year if value changes externally
  useEffect(() => {
    if (value) {
      const p = parseYMD(value);
      if (p) {
        setViewYear(p.year);
        setViewMonth(p.month);
      }
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  // Calendar calculations
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (year: number, month: number, day: number) => {
    const formatted = `${year}-${padZero(month + 1)}-${padZero(day)}`;
    onChange(formatted);
    setIsOpen(false);
  };

  // Quick shortcuts helper
  const handleQuickAddDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    handleSelectDate(y, m, day);
  };

  const isToday = (day: number) => {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  };

  const isSelected = (day: number) => {
    if (!parsedValue) return false;
    return (
      parsedValue.year === viewYear &&
      parsedValue.month === viewMonth &&
      parsedValue.day === day
    );
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Input Display Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3.5 py-2.5 text-white flex items-center justify-between cursor-pointer transition select-none group"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <CalendarIcon className="w-4 h-4 text-[#0052ff] shrink-0" />
          {value ? (
            <span className="font-medium text-slate-100 truncate text-xs">
              {formatDisplayDate(value)}
            </span>
          ) : (
            <span className="text-slate-500 text-xs">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && !required && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition cursor-pointer"
              title="Hapus tanggal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <div
          className={`absolute ${
            computedAlign === 'right' ? 'right-0' : 'left-0'
          } top-full mt-2 z-50 w-72 sm:w-[285px] max-w-[calc(100vw-2rem)] bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-3.5 text-xs animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Quick Shortcuts */}
          <div className="flex items-center gap-1 pb-2.5 border-b border-slate-800/80 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleQuickAddDays(0)}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10.5px] text-slate-300 border border-slate-800 transition shrink-0 cursor-pointer"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddDays(7)}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10.5px] text-slate-300 border border-slate-800 transition shrink-0 cursor-pointer"
            >
              +7 Hari
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddDays(14)}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10.5px] text-slate-300 border border-slate-800 transition shrink-0 cursor-pointer"
            >
              +14 Hari
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddDays(30)}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10.5px] text-slate-300 border border-slate-800 transition shrink-0 cursor-pointer"
            >
              +1 Bulan
            </button>
          </div>

          {/* Month & Year Navigation */}
          <div className="flex items-center justify-between py-2.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-bold text-white text-xs tracking-wide">
              {MONTH_NAMES_ID[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[11px] text-slate-500 mb-1">
            {DAYS_SHORT_ID.map((d, i) => (
              <div key={i} className="py-0.5">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Previous month trailing days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
              const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
              const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
              return (
                <button
                  type="button"
                  key={`prev-${i}`}
                  onClick={() => handleSelectDate(prevYear, prevMonth, dayNum)}
                  className="w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800/40 text-[11px] transition cursor-pointer"
                >
                  {dayNum}
                </button>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const selected = isSelected(dayNum);
              const currentToday = isToday(dayNum);

              return (
                <button
                  type="button"
                  key={`cur-${dayNum}`}
                  onClick={() => handleSelectDate(viewYear, viewMonth, dayNum)}
                  className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    selected
                      ? 'bg-[#0052ff] text-white font-bold shadow-xs'
                      : currentToday
                      ? 'border border-[#0052ff]/60 text-white font-bold bg-[#0052ff]/10 hover:bg-[#0052ff]/20'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}

            {/* Next month leading days */}
            {Array.from({
              length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7,
            }).map((_, i) => {
              const dayNum = i + 1;
              const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
              const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
              return (
                <button
                  type="button"
                  key={`next-${i}`}
                  onClick={() => handleSelectDate(nextYear, nextMonth, dayNum)}
                  className="w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800/40 text-[11px] transition cursor-pointer"
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
