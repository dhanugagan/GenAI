/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { 
  Download, 
  Printer, 
  Upload, 
  RotateCcw, 
  X, 
  FileJson, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  Wallet,
  Check
} from 'lucide-react';
import { EventPlan } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ExportModalProps {
  isOpen: boolean;
  event: EventPlan;
  onClose: () => void;
  onImportPlan: (imported: EventPlan) => void;
  onResetSamples: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  event,
  onClose,
  onImportPlan,
  onResetSamples,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Handle Download JSON
  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(event, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Import JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (eventReader) => {
      try {
        const parsed = JSON.parse(eventReader.target?.result as string);
        if (parsed.title && parsed.budgetItems) {
          onImportPlan(parsed);
          alert('Event plan imported successfully!');
          onClose();
        } else {
          alert('Invalid event plan format.');
        }
      } catch (err: any) {
        alert(`Failed to parse JSON file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Trigger Print
  const handlePrint = () => {
    window.print();
  };

  const totalBudget = event.totalBudget || 0;
  const totalAllocated = event.budgetItems.reduce((acc, item) => acc + (item.actualCost || item.estimatedCost || 0), 0);
  const totalPaid = event.budgetItems.reduce((acc, item) => acc + (item.paidAmount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Download className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="font-serif-display font-bold text-lg text-white">
                Export, Print & Data Backup
              </h3>
              <p className="text-xs text-slate-300">
                Share full master plan with committee, family, or vendors
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              <FileJson className="w-3.5 h-3.5 text-slate-600" />
              <span>Download JSON</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import Plan</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset to initial sample events? Any unsaved edits will be refreshed.')) {
                  onResetSamples();
                  onClose();
                }
              }}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 font-medium"
              title="Reset samples"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Printable Executive Summary Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6" ref={printRef}>
          
          {/* Print Header */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
                Occasio AI • Master Event Dossier
              </span>
              <span className="text-xs text-slate-500">
                Generated: {new Date().toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-slate-900 mt-2">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 italic">
              {event.ideas.themeName || event.vibe}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold">DATE</span>
                <span className="font-bold text-slate-800">{formatDate(event.date)}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold">LOCATION</span>
                <span className="font-bold text-slate-800 truncate block">{event.location}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold">ATTENDEES</span>
                <span className="font-bold text-slate-800">{event.guestCount} Guests</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold">TOTAL BUDGET</span>
                <span className="font-bold text-slate-800">{formatCurrency(totalBudget, event.currency)}</span>
              </div>
            </div>
          </div>

          {/* Day of Run of Show Schedule */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-3">
              Official Day-Of Run-of-Show Schedule
            </h2>
            <div className="divide-y divide-slate-100 text-xs">
              {event.dayOfSchedule.map((s) => (
                <div key={s.id} className="py-2 flex items-start gap-3">
                  <span className="font-mono font-bold text-indigo-700 w-24 shrink-0">
                    {s.time}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{s.title}</span>
                    <p className="text-slate-600 mt-0.5">{s.description}</p>
                    <div className="flex gap-3 text-[11px] text-slate-400 mt-0.5">
                      {s.leadPerson && <span>Lead: {s.leadPerson}</span>}
                      {s.location && <span>Location: {s.location}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Vendors & Contacts */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-3">
              Booked Vendors & Supplier Directory
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {event.vendors.map((v) => (
                <div key={v.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{v.businessName}</span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-white border border-slate-200">
                      {v.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {v.contactPerson ? `${v.contactPerson} • ` : ''}{v.email || v.phone || 'Contact pending'}
                  </p>
                  <div className="flex justify-between items-center text-[11px] font-medium text-slate-700 mt-2 pt-1 border-t border-slate-200/60">
                    <span>Final: {v.finalPrice ? formatCurrency(v.finalPrice, event.currency) : 'TBD'}</span>
                    <span>Status: {v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Allocation Summary */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-3">
              Budget Distribution Summary
            </h2>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2">Category</th>
                    <th className="p-2 text-right">Quoted / Actual</th>
                    <th className="p-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {event.budgetItems.map((b) => (
                    <tr key={b.id}>
                      <td className="p-2 font-medium text-slate-900">{b.name}</td>
                      <td className="p-2 text-slate-500 capitalize">{b.category.replace('_', ' ')}</td>
                      <td className="p-2 text-right font-bold text-slate-800">
                        {formatCurrency(b.actualCost || b.estimatedCost, event.currency)}
                      </td>
                      <td className="p-2 text-right text-[11px] capitalize">{b.status.replace('_', ' ')}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-slate-50 border-t-2 border-slate-300">
                    <td className="p-2" colSpan={2}>Total Allocated:</td>
                    <td className="p-2 text-right text-slate-900">{formatCurrency(totalAllocated, event.currency)}</td>
                    <td className="p-2 text-right">Cap: {formatCurrency(totalBudget, event.currency)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Guest Attendance & Dietary Requirements */}
          {event.guests && event.guests.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-3">
                Guest Attendance & Dietary Manifest
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {event.guests.map((g) => (
                  <div key={g.id} className="p-2 border border-slate-200 rounded bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900">{g.name}</span>
                      <p className="text-[11px] text-slate-500">
                        {g.tableNumber || 'Unassigned'} • {g.groupCategory || 'General'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        {g.status}
                      </span>
                      {g.dietaryRequirements && g.dietaryRequirements !== 'None' && (
                        <p className="text-[10px] text-emerald-700 font-medium mt-0.5">🌱 {g.dietaryRequirements}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
