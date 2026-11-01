/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UtensilsCrossed, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  LayoutGrid,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventPlan, GuestItem, RsvpStatus } from '../types';

interface GuestListTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
  onAskConcierge: (prompt: string) => void;
}

export const GuestListTab: React.FC<GuestListTabProps> = ({
  event,
  onUpdateEvent,
  onAskConcierge,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<RsvpStatus>('confirmed');
  const [formPartySize, setFormPartySize] = useState<number>(1);
  const [formTable, setFormTable] = useState('');
  const [formDiet, setFormDiet] = useState('None');
  const [formGroup, setFormGroup] = useState('Friends');
  const [formNotes, setFormNotes] = useState('');

  const guests = event.guests || [];

  // Metrics
  const totalGuestsInvited = guests.reduce((sum, g) => sum + (g.partySize || 1), 0);
  const confirmedCount = guests.filter(g => g.status === 'confirmed').reduce((sum, g) => sum + (g.partySize || 1), 0);
  const pendingCount = guests.filter(g => g.status === 'pending').reduce((sum, g) => sum + (g.partySize || 1), 0);
  const declinedCount = guests.filter(g => g.status === 'declined').reduce((sum, g) => sum + (g.partySize || 1), 0);
  const percentConfirmed = totalGuestsInvited > 0 ? Math.round((confirmedCount / totalGuestsInvited) * 100) : 0;

  // Dietary counts
  const dietaryMap: Record<string, number> = {};
  guests.forEach(g => {
    if (g.status === 'confirmed' && g.dietaryRequirements && g.dietaryRequirements !== 'None') {
      const diets = g.dietaryRequirements.split(',').map(d => d.trim());
      diets.forEach(d => {
        dietaryMap[d] = (dietaryMap[d] || 0) + (g.partySize || 1);
      });
    }
  });

  // Filtered guests
  const filteredGuests = guests.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchEmail = g.email?.toLowerCase().includes(q) || false;
      const matchGroup = g.groupCategory?.toLowerCase().includes(q) || false;
      const matchTable = g.tableNumber?.toLowerCase().includes(q) || false;
      if (!matchName && !matchEmail && !matchGroup && !matchTable) return false;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingGuest(null);
    setFormName('');
    setFormEmail('');
    setFormStatus('pending');
    setFormPartySize(1);
    setFormTable('');
    setFormDiet('None');
    setFormGroup('Friends');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (g: GuestItem) => {
    setEditingGuest(g);
    setFormName(g.name);
    setFormEmail(g.email || '');
    setFormStatus(g.status);
    setFormPartySize(g.partySize || 1);
    setFormTable(g.tableNumber || '');
    setFormDiet(g.dietaryRequirements || 'None');
    setFormGroup(g.groupCategory || 'Friends');
    setFormNotes(g.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingGuest) {
      const updated = guests.map(g =>
        g.id === editingGuest.id
          ? {
              ...g,
              name: formName.trim(),
              email: formEmail.trim(),
              status: formStatus,
              partySize: Number(formPartySize) || 1,
              tableNumber: formTable.trim(),
              dietaryRequirements: formDiet.trim(),
              groupCategory: formGroup.trim(),
              notes: formNotes.trim(),
            }
          : g
      );
      onUpdateEvent({ ...event, guests: updated });
    } else {
      const newGuest: GuestItem = {
        id: `g-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim(),
        status: formStatus,
        partySize: Number(formPartySize) || 1,
        tableNumber: formTable.trim(),
        dietaryRequirements: formDiet.trim(),
        groupCategory: formGroup.trim(),
        notes: formNotes.trim(),
      };
      onUpdateEvent({ ...event, guests: [...guests, newGuest] });
    }
    setIsModalOpen(false);
  };

  const handleDeleteGuest = (id: string) => {
    onUpdateEvent({
      ...event,
      guests: guests.filter(g => g.id !== id),
    });
  };

  // AI Auto Table Organizer
  const handleAiAutoAssignTables = () => {
    const groups: Record<string, GuestItem[]> = {};
    guests.forEach(g => {
      const grp = g.groupCategory || 'General Attendees';
      if (!groups[grp]) groups[grp] = [];
      groups[grp].push(g);
    });

    let tableNum = 1;
    const updated = guests.map(g => {
      // Determine table based on group
      const grp = g.groupCategory || 'General Attendees';
      const assigned = `Table ${tableNum} (${grp})`;
      return { ...g, tableNumber: g.tableNumber || assigned };
    });

    // Stagger table numbers by group
    Object.keys(groups).forEach(() => {
      tableNum++;
    });

    onUpdateEvent({ ...event, guests: updated });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-serif-display font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Guest Experience, RSVPs & Seating</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage attendance, dietary accommodations, group clusters, and table assignments.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleAiAutoAssignTables}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold border border-indigo-200 transition-colors"
            title="Auto-cluster guests into tables based on groups"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Seating Cluster</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest / Party</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Invites
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalGuestsInvited} <span className="text-xs font-normal text-slate-400">/ {event.guestCount} capacity</span>
          </p>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${Math.min(100, (totalGuestsInvited / (event.guestCount || 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confirmed RSVPs</span>
          </span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {confirmedCount} <span className="text-xs font-normal text-slate-500">({percentConfirmed}%)</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Ready for catering headcounts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1 text-amber-700">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Awaiting Reply</span>
          </span>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {pendingCount}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Pending follow-up reminders</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1 text-slate-500">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Declined / Regrets</span>
          </span>
          <p className="text-2xl font-bold text-slate-700 mt-1">
            {declinedCount}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Freed up for waiting list</p>
        </div>
      </div>

      {/* Dietary Requirements Bar (Critical for Catering Accuracy) */}
      {Object.keys(dietaryMap).length > 0 && (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-emerald-900 font-semibold">
            <UtensilsCrossed className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Catering Dietary Alert:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dietaryMap).map(([diet, count]) => (
              <span
                key={diet}
                className="bg-white px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-800 font-medium font-mono text-[11px]"
              >
                🌱 {diet}: <strong className="text-slate-900">{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Guest Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[240px]">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search guest, email, table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
            >
              <option value="all">All RSVPs ({guests.length})</option>
              <option value="confirmed">Confirmed ({guests.filter(g => g.status === 'confirmed').length})</option>
              <option value="pending">Pending ({guests.filter(g => g.status === 'pending').length})</option>
              <option value="declined">Declined ({guests.filter(g => g.status === 'declined').length})</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredGuests.length} of {guests.length} parties
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Guest Name & Email</th>
                <th className="py-3 px-4">Group Cluster</th>
                <th className="py-3 px-4 text-center">Party Size</th>
                <th className="py-3 px-4">Table / Seating</th>
                <th className="py-3 px-4">Dietary Needs</th>
                <th className="py-3 px-4 text-center">RSVP Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No guests match your filters.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{g.name}</p>
                      {g.email && <p className="text-[11px] text-slate-400">{g.email}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {g.groupCategory || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {g.partySize || 1}
                    </td>
                    <td className="py-3 px-4 font-medium text-indigo-700">
                      {g.tableNumber || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4">
                      {g.dietaryRequirements && g.dietaryRequirements !== 'None' ? (
                        <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-medium">
                          {g.dietaryRequirements}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          g.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : g.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(g)}
                          className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Edit guest"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(g.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete guest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-serif-display font-bold text-slate-900 mb-4">
              {editingGuest ? 'Edit Guest Record' : 'Add Guest or Party'}
            </h3>

            <form onSubmit={handleSaveGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Guest Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova, Dr. Marcus Bell"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. elena@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as RsvpStatus)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Party Size (Pax)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formPartySize}
                    onChange={(e) => setFormPartySize(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Group Cluster
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Family, Wedding Party, College"
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Table Assignment
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 1, Table 4"
                    value={formTable}
                    onChange={(e) => setFormTable(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dietary Accommodations
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Gluten-Free, Nut Allergy, None"
                  value={formDiet}
                  onChange={(e) => setFormDiet(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Highchair needed for toddler; traveling from out of town"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
