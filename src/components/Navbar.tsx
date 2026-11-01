/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Calendar, Plus, MessageSquare, Download, ChevronDown, Check, Mic } from 'lucide-react';
import { EventPlan, CurrencyCode } from '../types';

interface NavbarProps {
  events: EventPlan[];
  activeEvent: EventPlan;
  onSelectEvent: (eventId: string) => void;
  onOpenGenerateModal: () => void;
  onOpenConciergeModal: () => void;
  onOpenSpeechModal: () => void;
  onOpenExportModal: () => void;
  onChangeCurrency: (currency: CurrencyCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onOpenGenerateModal,
  onOpenConciergeModal,
  onOpenSpeechModal,
  onOpenExportModal,
  onChangeCurrency,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 flex items-center justify-center shadow-sm text-white">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif-display text-xl font-bold tracking-tight text-slate-900">
                  Occasio
                </span>
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  GenAI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Weddings • Birthdays • Community Events
              </p>
            </div>
          </div>

          {/* Active Event Dropdown Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-medium transition-colors"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[220px]">
                {activeEvent.title}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Your Event Plans
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {events.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => {
                        onSelectEvent(ev.id);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-rose-50/60 flex items-start justify-between group transition-colors"
                    >
                      <div>
                        <p className={`text-xs sm:text-sm font-medium ${ev.id === activeEvent.id ? 'text-rose-700 font-semibold' : 'text-slate-800 group-hover:text-rose-700'}`}>
                          {ev.title}
                        </p>
                        <p className="text-[11px] text-slate-500 capitalize">
                          {ev.eventType} • {ev.guestCount} guests • {ev.location}
                        </p>
                      </div>
                      {ev.id === activeEvent.id && (
                        <Check className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenGenerateModal();
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Event with AI</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Currency selector */}
            <div className="hidden md:flex items-center space-x-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
              <span className="font-semibold text-slate-600">Cur:</span>
              <select
                value={activeEvent.currency}
                onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
                aria-label="Select currency"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Speech & Toast button */}
            <button
              onClick={onOpenSpeechModal}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/80 hover:bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium transition-colors"
              title="Draft AI Toast or Speech"
            >
              <Mic className="w-4 h-4 text-amber-600" />
              <span>AI Speech / Toast</span>
            </button>

            {/* AI Concierge quick button */}
            <button
              onClick={onOpenConciergeModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-medium transition-colors"
              title="Open AI Event Concierge"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">AI Co-Planner</span>
            </button>

            {/* Export & Print */}
            <button
              onClick={onOpenExportModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-medium flex items-center space-x-1 transition-colors"
              title="Export, Print & Backup"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">Export / Print</span>
            </button>

            {/* AI Generator Button */}
            <button
              onClick={onOpenGenerateModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan Event</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
