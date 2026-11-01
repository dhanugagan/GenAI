/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  MapPin, 
  User, 
  Sparkles,
  ListTodo,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventPlan, MilestoneItem, DayOfScheduleItem } from '../types';
import { formatDate } from '../utils/formatters';

interface TimelineTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ event, onUpdateEvent }) => {
  const [activeSubView, setActiveSubView] = useState<'milestones' | 'dayOf'>('milestones');
  const [copiedSchedule, setCopiedSchedule] = useState(false);

  // Milestone Add/Edit Modal
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneItem | null>(null);
  const [mTitle, setMTitle] = useState('');
  const [mPhase, setMPhase] = useState('1 Month Before');
  const [mDueDate, setMDueDate] = useState('');
  const [mPriority, setMPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [mCategory, setMCategory] = useState('General');
  const [mNotes, setMNotes] = useState('');

  // DayOf Add/Edit Modal
  const [isDayOfModalOpen, setIsDayOfModalOpen] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState<DayOfScheduleItem | null>(null);
  const [sTime, setSTime] = useState('10:00 AM');
  const [sEndTime, setSEndTime] = useState('11:00 AM');
  const [sTitle, setSTitle] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sLocation, setSLocation] = useState('');
  const [sLead, setSLead] = useState('');

  // Milestone actions
  const handleToggleMilestone = (id: string) => {
    const updated = event.milestones.map((m) => {
      if (m.id === id) {
        const nextState = !m.isCompleted;
        if (nextState) {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'],
          });
        }
        return { ...m, isCompleted: nextState };
      }
      return m;
    });
    onUpdateEvent({ ...event, milestones: updated });
  };

  const handleOpenMilestoneModal = (item?: MilestoneItem) => {
    if (item) {
      setEditingMilestone(item);
      setMTitle(item.title);
      setMPhase(item.phase);
      setMDueDate(item.dueDate || '');
      setMPriority(item.priority);
      setMCategory(item.category);
      setMNotes(item.notes || '');
    } else {
      setEditingMilestone(null);
      setMTitle('');
      setMPhase('1 Month Before');
      setMDueDate('');
      setMPriority('medium');
      setMCategory('General');
      setMNotes('');
    }
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim()) return;

    if (editingMilestone) {
      const updated = event.milestones.map((m) =>
        m.id === editingMilestone.id
          ? {
              ...m,
              title: mTitle.trim(),
              phase: mPhase,
              dueDate: mDueDate,
              priority: mPriority,
              category: mCategory,
              notes: mNotes.trim(),
            }
          : m
      );
      onUpdateEvent({ ...event, milestones: updated });
    } else {
      const newItem: MilestoneItem = {
        id: `m-${Date.now()}`,
        title: mTitle.trim(),
        phase: mPhase,
        dueDate: mDueDate,
        priority: mPriority,
        category: mCategory,
        notes: mNotes.trim(),
        isCompleted: false,
      };
      onUpdateEvent({ ...event, milestones: [...event.milestones, newItem] });
    }
    setIsMilestoneModalOpen(false);
  };

  const handleDeleteMilestone = (id: string) => {
    onUpdateEvent({
      ...event,
      milestones: event.milestones.filter((m) => m.id !== id),
    });
  };

  // Day of Schedule actions
  const handleToggleScheduleItem = (id: string) => {
    const updated = event.dayOfSchedule.map((s) =>
      s.id === id ? { ...s, isCompleted: !s.isCompleted } : s
    );
    onUpdateEvent({ ...event, dayOfSchedule: updated });
  };

  const handleOpenDayOfModal = (item?: DayOfScheduleItem) => {
    if (item) {
      setEditingScheduleItem(item);
      setSTime(item.time);
      setSEndTime(item.endTime || '');
      setSTitle(item.title);
      setSDesc(item.description);
      setSLocation(item.location || '');
      setSLead(item.leadPerson || '');
    } else {
      setEditingScheduleItem(null);
      setSTime('12:00 PM');
      setSEndTime('01:00 PM');
      setSTitle('');
      setSDesc('');
      setSLocation(event.location);
      setSLead('');
    }
    setIsDayOfModalOpen(true);
  };

  const handleSaveScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle.trim() || !sTime.trim()) return;

    if (editingScheduleItem) {
      const updated = event.dayOfSchedule.map((s) =>
        s.id === editingScheduleItem.id
          ? {
              ...s,
              time: sTime.trim(),
              endTime: sEndTime.trim(),
              title: sTitle.trim(),
              description: sDesc.trim(),
              location: sLocation.trim(),
              leadPerson: sLead.trim(),
            }
          : s
      );
      onUpdateEvent({ ...event, dayOfSchedule: updated });
    } else {
      const newItem: DayOfScheduleItem = {
        id: `s-${Date.now()}`,
        time: sTime.trim(),
        endTime: sEndTime.trim(),
        title: sTitle.trim(),
        description: sDesc.trim(),
        location: sLocation.trim(),
        leadPerson: sLead.trim(),
        isCompleted: false,
      };
      onUpdateEvent({ ...event, dayOfSchedule: [...event.dayOfSchedule, newItem] });
    }
    setIsDayOfModalOpen(false);
  };

  const handleDeleteScheduleItem = (id: string) => {
    onUpdateEvent({
      ...event,
      dayOfSchedule: event.dayOfSchedule.filter((s) => s.id !== id),
    });
  };

  const handleCopyScheduleToClipboard = () => {
    const lines = [
      `📅 RUN-OF-SHOW SCHEDULE: ${event.title}`,
      `Date: ${formatDate(event.date)} | Location: ${event.location}`,
      '----------------------------------------',
      ...event.dayOfSchedule.map(
        (s) =>
          `[${s.time}${s.endTime ? ` - ${s.endTime}` : ''}] ${s.title}\n   • Details: ${s.description}\n   • Lead: ${s.leadPerson || 'N/A'}${s.location ? ` | Location: ${s.location}` : ''}`
      ),
      '----------------------------------------',
      'Generated with Occasio AI Planner',
    ].join('\n\n');

    navigator.clipboard.writeText(lines);
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2500);
  };

  // Group milestones by Phase
  const groupedMilestones: Record<string, MilestoneItem[]> = {};
  event.milestones.forEach((m) => {
    const phaseKey = m.phase || 'General Timeline';
    if (!groupedMilestones[phaseKey]) groupedMilestones[phaseKey] = [];
    groupedMilestones[phaseKey].push(m);
  });

  return (
    <div className="space-y-6">
      
      {/* View Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-serif-display font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Timeline, Milestones & Schedules</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between long-term milestone planning and day-of execution run-of-show.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Toggle pill */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setActiveSubView('milestones')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubView === 'milestones'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Milestone Roadmap</span>
            </button>
            <button
              onClick={() => setActiveSubView('dayOf')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubView === 'dayOf'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Day-Of Run-of-Show</span>
            </button>
          </div>

          {activeSubView === 'milestones' ? (
            <button
              onClick={() => handleOpenMilestoneModal()}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyScheduleToClipboard}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                title="Copy schedule to send to team or print"
              >
                {copiedSchedule ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Schedule</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleOpenDayOfModal()}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUBVIEW 1: MILESTONE ROADMAP */}
      {activeSubView === 'milestones' && (
        <div className="space-y-6">
          {Object.keys(groupedMilestones).length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              <Calendar className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-slate-700">No milestones yet</p>
              <p className="text-xs">Click "Add Task" above or regenerate your plan with GenAI.</p>
            </div>
          ) : (
            Object.entries(groupedMilestones).map(([phase, items]) => (
              <div key={phase} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-800">{phase}</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {items.filter((i) => i.isCompleted).length} / {items.length} done
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                        m.isCompleted ? 'bg-slate-50/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        <button
                          onClick={() => handleToggleMilestone(m.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                            m.isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white hover:border-indigo-500'
                          }`}
                          aria-label={`Toggle completion for ${m.title}`}
                        >
                          {m.isCompleted && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div>
                          <p
                            className={`text-sm font-medium ${
                              m.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
                            }`}
                          >
                            {m.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[11px] text-slate-500 font-medium">
                              {m.category}
                            </span>
                            {m.dueDate && (
                              <span className="text-[11px] text-indigo-600 font-medium">
                                • Due {formatDate(m.dueDate)}
                              </span>
                            )}
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                                m.priority === 'high'
                                  ? 'bg-rose-100 text-rose-700'
                                  : m.priority === 'medium'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {m.priority}
                            </span>
                          </div>
                          {m.notes && (
                            <p className="text-xs text-slate-500 mt-1 italic">
                              {m.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => handleOpenMilestoneModal(m)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(m.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUBVIEW 2: DAY-OF RUN-OF-SHOW SCHEDULE */}
      {activeSubView === 'dayOf' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Official Event Day Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Chronological sequence with designated leads and venue locations
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              {event.dayOfSchedule.length} Time Blocks
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {event.dayOfSchedule.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No schedule blocks added yet. Click "Add Item" to map out your day!
              </div>
            ) : (
              event.dayOfSchedule.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors ${
                    item.isCompleted ? 'bg-slate-50/60 opacity-60' : 'hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Time pill */}
                    <div className="w-28 shrink-0">
                      <div className="inline-flex flex-col items-start px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-100 font-mono text-xs font-bold">
                        <span>{item.time}</span>
                        {item.endTime && (
                          <span className="text-[10px] text-indigo-500 font-normal">
                            to {item.endTime}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleScheduleItem(item.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            item.isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {item.isCompleted && <Check className="w-3 h-3" />}
                        </button>
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.title}
                        </h4>
                      </div>
                      
                      <p className="text-xs text-slate-600 leading-relaxed pl-6">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 pl-6 text-xs text-slate-500">
                        {item.leadPerson && (
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="font-medium text-slate-700">Lead: {item.leadPerson}</span>
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{item.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end md:self-start">
                    <button
                      onClick={() => handleOpenDayOfModal(item)}
                      className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteScheduleItem(item.id)}
                      className="text-xs text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Milestone Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-serif-display font-bold text-slate-900 mb-4">
              {editingMilestone ? 'Edit Task' : 'Add Milestone Task'}
            </h3>
            <form onSubmit={handleSaveMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule hair & makeup trial"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Timeline Phase
                  </label>
                  <select
                    value={mPhase}
                    onChange={(e) => setMPhase(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="9-12 Months Before">9-12 Months Before</option>
                    <option value="6-9 Months Before">6-9 Months Before</option>
                    <option value="3-6 Months Before">3-6 Months Before</option>
                    <option value="2-3 Months Before">2-3 Months Before</option>
                    <option value="1 Month Before">1 Month Before</option>
                    <option value="2 Weeks Before">2 Weeks Before</option>
                    <option value="Week Of">Week Of</option>
                    <option value="Day Before">Day Before</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={mPriority}
                    onChange={(e) => setMPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={mDueDate}
                    onChange={(e) => setMDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Venue, Catering, Music"
                    value={mCategory}
                    onChange={(e) => setMCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Day-Of Schedule Modal */}
      {isDayOfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-serif-display font-bold text-slate-900 mb-4">
              {editingScheduleItem ? 'Edit Schedule Item' : 'Add Day-Of Schedule Block'}
            </h3>
            <form onSubmit={handleSaveScheduleItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 04:30 PM"
                    value={sTime}
                    onChange={(e) => setSTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 05:15 PM"
                    value={sEndTime}
                    onChange={(e) => setSEndTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ceremony Processional & Vows"
                  value={sTitle}
                  onChange={(e) => setSTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Logistics Details *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. String trio begins playing prelude at 04:15. Water carafes ready at entrance."
                  value={sDesc}
                  onChange={(e) => setSDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Point of Contact / Lead
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coordinator Sarah"
                    value={sLead}
                    onChange={(e) => setSLead(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location / Room
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. South Lawn Gazebo"
                    value={sLocation}
                    onChange={(e) => setSLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDayOfModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Save Schedule Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
