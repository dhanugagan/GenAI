/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  DollarSign, 
  Copy, 
  Check, 
  Trash2, 
  Edit3,
  Filter
} from 'lucide-react';
import { EventPlan, VendorItem, VendorStatus } from '../types';
import { formatCurrency } from '../utils/formatters';

interface VendorsTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({ event, onUpdateEvent }) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  
  // Add/Edit Vendor Modal
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorItem | null>(null);
  const [vCategory, setVCategory] = useState('Venue');
  const [vName, setVName] = useState('');
  const [vContact, setVContact] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vWebsite, setVWebsite] = useState('');
  const [vStatus, setVStatus] = useState<VendorStatus>('researching');
  const [vQuoted, setVQuoted] = useState<number>(0);
  const [vFinal, setVFinal] = useState<number>(0);
  const [vNotes, setVNotes] = useState('');
  const [vContract, setVContract] = useState(false);

  // AI Vendor Assistant Modal
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantVendor, setAssistantVendor] = useState<VendorItem | null>(null);
  const [assistantAction, setAssistantAction] = useState<'inquiry' | 'contract_check' | 'negotiate'>('inquiry');
  const [customPromptDetails, setCustomPromptDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [assistantResult, setAssistantResult] = useState<string | null>(null);
  const [hasCopiedResult, setHasCopiedResult] = useState(false);

  // New task input state per vendor
  const [newTaskTexts, setNewTaskTexts] = useState<Record<string, string>>({});

  // Status badge styling
  const getStatusBadge = (status: VendorStatus) => {
    switch (status) {
      case 'booked':
        return { label: 'Booked & Locked', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'quoted':
        return { label: 'Quote Received', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'contacted':
        return { label: 'Contacted', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'declined':
        return { label: 'Declined', bg: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { label: 'Researching', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const filteredVendors = event.vendors.filter((v) => {
    if (selectedStatusFilter !== 'all' && v.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingVendor(null);
    setVCategory('Venue');
    setVName('');
    setVContact('');
    setVEmail('');
    setVPhone('');
    setVWebsite('');
    setVStatus('researching');
    setVQuoted(0);
    setVFinal(0);
    setVNotes('');
    setVContract(false);
    setIsVendorModalOpen(true);
  };

  const handleOpenEditModal = (vendor: VendorItem) => {
    setEditingVendor(vendor);
    setVCategory(vendor.category);
    setVName(vendor.businessName);
    setVContact(vendor.contactPerson || '');
    setVEmail(vendor.email || '');
    setVPhone(vendor.phone || '');
    setVWebsite(vendor.website || '');
    setVStatus(vendor.status);
    setVQuoted(vendor.quotedPrice || 0);
    setVFinal(vendor.finalPrice || 0);
    setVNotes(vendor.notes || '');
    setVContract(vendor.contractSigned);
    setIsVendorModalOpen(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim()) return;

    if (editingVendor) {
      const updated = event.vendors.map((v) =>
        v.id === editingVendor.id
          ? {
              ...v,
              category: vCategory.trim(),
              businessName: vName.trim(),
              contactPerson: vContact.trim(),
              email: vEmail.trim(),
              phone: vPhone.trim(),
              website: vWebsite.trim(),
              status: vStatus,
              quotedPrice: Number(vQuoted) || 0,
              finalPrice: Number(vFinal) || 0,
              notes: vNotes.trim(),
              contractSigned: vContract,
            }
          : v
      );
      onUpdateEvent({ ...event, vendors: updated });
    } else {
      const newVendor: VendorItem = {
        id: `v-${Date.now()}`,
        category: vCategory.trim(),
        businessName: vName.trim(),
        contactPerson: vContact.trim(),
        email: vEmail.trim(),
        phone: vPhone.trim(),
        website: vWebsite.trim(),
        status: vStatus,
        quotedPrice: Number(vQuoted) || 0,
        finalPrice: Number(vFinal) || 0,
        notes: vNotes.trim(),
        contractSigned: vContract,
        checklist: [
          { id: `vc-${Date.now()}-1`, text: 'Confirm date availability and request package pricing', done: false },
          { id: `vc-${Date.now()}-2`, text: 'Verify liability insurance and licensing', done: false },
        ],
      };
      onUpdateEvent({ ...event, vendors: [...event.vendors, newVendor] });
    }
    setIsVendorModalOpen(false);
  };

  const handleDeleteVendor = (id: string) => {
    onUpdateEvent({
      ...event,
      vendors: event.vendors.filter((v) => v.id !== id),
    });
  };

  // Toggle checklist inside vendor
  const handleToggleVendorChecklist = (vendorId: string, checkId: string) => {
    const updated = event.vendors.map((v) => {
      if (v.id === vendorId) {
        return {
          ...v,
          checklist: v.checklist.map((c) =>
            c.id === checkId ? { ...c, done: !c.done } : c
          ),
        };
      }
      return v;
    });
    onUpdateEvent({ ...event, vendors: updated });
  };

  // Add checklist item to vendor
  const handleAddVendorChecklistItem = (vendorId: string) => {
    const text = newTaskTexts[vendorId]?.trim();
    if (!text) return;

    const updated = event.vendors.map((v) => {
      if (v.id === vendorId) {
        return {
          ...v,
          checklist: [...v.checklist, { id: `vc-${Date.now()}`, text, done: false }],
        };
      }
      return v;
    });
    onUpdateEvent({ ...event, vendors: updated });
    setNewTaskTexts({ ...newTaskTexts, [vendorId]: '' });
  };

  // Run AI Assistant
  const handleRunVendorAssistant = async (vendor: VendorItem, action: 'inquiry' | 'contract_check' | 'negotiate') => {
    setAssistantVendor(vendor);
    setAssistantAction(action);
    setIsAssistantOpen(true);
    setIsGenerating(true);
    setAssistantResult(null);

    try {
      const res = await fetch('/api/ai/vendor-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: action,
          vendorType: `${vendor.category} (${vendor.businessName})`,
          details: customPromptDetails || vendor.notes || '',
          eventContext: {
            title: event.title,
            eventType: event.eventType,
            date: event.date,
            location: event.location,
            guestCount: event.guestCount,
            vibe: event.vibe,
            currency: event.currency,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.content) {
        setAssistantResult(data.content);
      } else {
        setAssistantResult('Failed to generate vendor assistance text.');
      }
    } catch (err: any) {
      setAssistantResult(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAssistantResult = () => {
    if (!assistantResult) return;
    navigator.clipboard.writeText(assistantResult);
    setHasCopiedResult(true);
    setTimeout(() => setHasCopiedResult(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-serif-display font-bold text-slate-900 flex items-center space-x-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <span>Vendor Management & Checklists</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize suppliers, compare quotes, track contract tasks, and draft communications with GenAI.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700"
          >
            <option value="all">All Statuses ({event.vendors.length})</option>
            <option value="booked">Booked</option>
            <option value="quoted">Quoted</option>
            <option value="contacted">Contacted</option>
            <option value="researching">Researching</option>
          </select>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredVendors.length === 0 ? (
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <Store className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No vendors found</p>
            <p className="text-xs mt-1">Add your vendors manually or generate a full list with GenAI.</p>
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const badge = getStatusBadge(vendor.status);
            const doneCount = vendor.checklist.filter((c) => c.done).length;

            return (
              <div
                key={vendor.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top row: Category, Status, Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {vendor.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {vendor.businessName}
                      </h3>
                      {vendor.contactPerson && (
                        <p className="text-xs text-slate-500">
                          Contact: {vendor.contactPerson}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <button
                        onClick={() => handleOpenEditModal(vendor)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title="Edit vendor details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete vendor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Financials & Contract Pill */}
                  <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">Quoted</span>
                      <p className="font-bold text-slate-800">
                        {vendor.quotedPrice ? formatCurrency(vendor.quotedPrice, event.currency) : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">Agreed / Final</span>
                      <p className="font-bold text-slate-900">
                        {vendor.finalPrice ? formatCurrency(vendor.finalPrice, event.currency) : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">Contract</span>
                      <p className={`font-semibold flex items-center space-x-1 ${vendor.contractSigned ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {vendor.contractSigned ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Signed</span>
                          </>
                        ) : (
                          <span>Pending</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Contact Links */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
                    {vendor.email && (
                      <a
                        href={`mailto:${vendor.email}`}
                        className="flex items-center space-x-1 text-slate-600 hover:text-emerald-600 truncate max-w-[200px]"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{vendor.email}</span>
                      </a>
                    )}
                    {vendor.phone && (
                      <span className="flex items-center space-x-1 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{vendor.phone}</span>
                      </span>
                    )}
                    {vendor.website && (
                      <a
                        href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-indigo-600 hover:underline truncate max-w-[150px]"
                      >
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{vendor.website}</span>
                      </a>
                    )}
                  </div>

                  {/* Notes */}
                  {vendor.notes && (
                    <p className="text-xs text-slate-500 mt-2 italic bg-slate-50/70 p-2 rounded">
                      "{vendor.notes}"
                    </p>
                  )}

                  {/* Vendor Specific Checklist */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-700">
                        Requirements & Deliverables ({doneCount}/{vendor.checklist.length})
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {vendor.checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleVendorChecklist(vendor.id, item.id)}
                          className="flex items-start space-x-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer group"
                        >
                          <button
                            className={`w-3.5 h-3.5 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              item.done
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 group-hover:border-slate-500'
                            }`}
                          >
                            {item.done && <Check className="w-2.5 h-2.5" />}
                          </button>
                          <span className={item.done ? 'line-through text-slate-400' : ''}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Checklist Input */}
                    <div className="mt-2 flex items-center space-x-1.5">
                      <input
                        type="text"
                        placeholder="Add requirement..."
                        value={newTaskTexts[vendor.id] || ''}
                        onChange={(e) =>
                          setNewTaskTexts({ ...newTaskTexts, [vendor.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddVendorChecklistItem(vendor.id);
                          }
                        }}
                        className="flex-1 text-xs px-2.5 py-1 rounded border border-slate-200 focus:outline-emerald-500"
                      />
                      <button
                        onClick={() => handleAddVendorChecklistItem(vendor.id)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: AI Vendor Communication Tools */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold text-indigo-700 flex items-center mr-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Assistant:
                  </span>
                  <button
                    onClick={() => handleRunVendorAssistant(vendor, 'inquiry')}
                    className="text-[11px] px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors"
                  >
                    Draft Inquiry RFP
                  </button>
                  <button
                    onClick={() => handleRunVendorAssistant(vendor, 'contract_check')}
                    className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Contract Red Flags
                  </button>
                  <button
                    onClick={() => handleRunVendorAssistant(vendor, 'negotiate')}
                    className="text-[11px] px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium transition-colors"
                  >
                    Negotiate Price
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Vendor Add/Edit Modal */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-serif-display font-bold text-slate-900 mb-4">
              {editingVendor ? 'Edit Vendor Details' : 'Add New Vendor'}
            </h3>
            <form onSubmit={handleSaveVendor} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Venue, Catering, Florist, DJ"
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vetting Status
                  </label>
                  <select
                    value={vStatus}
                    onChange={(e) => setVStatus(e.target.value as VendorStatus)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="researching">Researching</option>
                    <option value="contacted">Contacted</option>
                    <option value="quoted">Quoted</option>
                    <option value="booked">Booked & Locked</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bloom & Twig Botanical Studio"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chloe Vance"
                    value={vContact}
                    onChange={(e) => setVContact(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. hello@vendor.com"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. (503) 555-0192"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website / Portfolio
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. floralstudio.com"
                    value={vWebsite}
                    onChange={(e) => setVWebsite(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quoted Price ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={vQuoted || ''}
                    onChange={(e) => setVQuoted(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Final Agreed Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={vFinal || ''}
                    onChange={(e) => setVFinal(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="vContract"
                  checked={vContract}
                  onChange={(e) => setVContract(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="vContract" className="text-xs font-medium text-slate-700">
                  Official Contract Executed & Signed
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes & Special Clauses
                </label>
                <textarea
                  rows={2}
                  value={vNotes}
                  onChange={(e) => setVNotes(e.target.value)}
                  placeholder="e.g. Load-in starts at 9am, includes 2 sound checks"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVendorModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Output Modal */}
      {isAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-indigo-700">
                <Sparkles className="w-5 h-5" />
                <div>
                  <h3 className="font-serif-display font-bold text-base text-slate-900">
                    GenAI Vendor Assistant
                  </h3>
                  <p className="text-xs text-slate-500">
                    {assistantAction === 'inquiry'
                      ? `Drafting RFP / Inquiry to ${assistantVendor?.businessName}`
                      : assistantAction === 'contract_check'
                      ? `Analyzing Contract Red Flags for ${assistantVendor?.category}`
                      : `Drafting Tactful Budget Negotiation with ${assistantVendor?.businessName}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssistantOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {isGenerating ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">
                    Crafting communication with Gemini...
                  </p>
                </div>
              ) : assistantResult ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {assistantResult}
                </div>
              ) : null}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleCopyAssistantResult}
                disabled={!assistantResult}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold"
              >
                {hasCopiedResult ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Response</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsAssistantOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
