/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { EventHeader } from './components/EventHeader';
import { DashboardTab } from './components/DashboardTab';
import { BudgetTab } from './components/BudgetTab';
import { TimelineTab } from './components/TimelineTab';
import { VendorsTab } from './components/VendorsTab';
import { IdeasTab } from './components/IdeasTab';
import { GuestListTab } from './components/GuestListTab';
import { ConciergeChatModal } from './components/ConciergeChatModal';
import { GeneratePlanModal } from './components/GeneratePlanModal';
import { EditEventModal } from './components/EditEventModal';
import { ExportModal } from './components/ExportModal';
import { SpeechGeneratorModal } from './components/SpeechGeneratorModal';
import { EventPlan, CurrencyCode } from './types';
import { INITIAL_EVENTS } from './data/sampleEvents';

const STORAGE_KEY = 'occasio_events_storage_v1';
const ACTIVE_EVENT_KEY = 'occasio_active_event_id_v1';

export default function App() {
  const [events, setEvents] = useState<EventPlan[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored events, using defaults', e);
    }
    return INITIAL_EVENTS;
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    try {
      const storedId = localStorage.getItem(ACTIVE_EVENT_KEY);
      if (storedId) return storedId;
    } catch {}
    return INITIAL_EVENTS[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'timeline' | 'vendors' | 'guests' | 'ideas' | 'concierge'>('overview');

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [isFloatingConciergeOpen, setIsFloatingConciergeOpen] = useState(false);
  const [conciergePresetPrompt, setConciergePresetPrompt] = useState<string>('');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events to storage', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_EVENT_KEY, activeEventId);
    } catch (e) {
      console.error('Failed to save active event ID', e);
    }
  }, [activeEventId]);

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0] || INITIAL_EVENTS[0];

  const handleUpdateActiveEvent = (updated: EventPlan) => {
    setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
  };

  const handlePlanCreated = (newPlan: EventPlan) => {
    setEvents((prev) => [newPlan, ...prev]);
    setActiveEventId(newPlan.id);
    setActiveTab('overview');
  };

  const handleChangeCurrency = (newCurrency: CurrencyCode) => {
    handleUpdateActiveEvent({ ...activeEvent, currency: newCurrency });
  };

  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = activeEvent.milestones.map((m) =>
      m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
    );
    handleUpdateActiveEvent({ ...activeEvent, milestones: updatedMilestones });
  };

  const handleOpenConciergeWithPrompt = (prompt: string) => {
    setConciergePresetPrompt(prompt);
    setActiveTab('concierge');
  };

  const handleResetSamples = () => {
    setEvents(INITIAL_EVENTS);
    setActiveEventId(INITIAL_EVENTS[0].id);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_EVENT_KEY);
  };

  const handleImportPlan = (imported: EventPlan) => {
    setEvents((prev) => [imported, ...prev]);
    setActiveEventId(imported.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      
      {/* Navigation Header */}
      <Navbar
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={(id) => setActiveEventId(id)}
        onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
        onOpenConciergeModal={() => setIsFloatingConciergeOpen(true)}
        onOpenSpeechModal={() => setIsSpeechModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onChangeCurrency={handleChangeCurrency}
      />

      {/* Main Event Header Banner & Tabs */}
      <EventHeader
        event={activeEvent}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'concierge') setConciergePresetPrompt('');
        }}
        onEditDetails={() => setIsEditModalOpen(true)}
      />

      {/* Tab Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <DashboardTab
            event={activeEvent}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onToggleMilestone={handleToggleMilestone}
            onOpenConciergeWithPrompt={handleOpenConciergeWithPrompt}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTab
            event={activeEvent}
            onUpdateEvent={handleUpdateActiveEvent}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab
            event={activeEvent}
            onUpdateEvent={handleUpdateActiveEvent}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorsTab
            event={activeEvent}
            onUpdateEvent={handleUpdateActiveEvent}
          />
        )}

        {activeTab === 'guests' && (
          <GuestListTab
            event={activeEvent}
            onUpdateEvent={handleUpdateActiveEvent}
            onAskConcierge={handleOpenConciergeWithPrompt}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasTab
            event={activeEvent}
            onUpdateEvent={handleUpdateActiveEvent}
            onAskConcierge={handleOpenConciergeWithPrompt}
          />
        )}

        {activeTab === 'concierge' && (
          <ConciergeChatModal
            event={activeEvent}
            initialPrompt={conciergePresetPrompt}
            isModal={false}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-serif-display font-medium text-slate-700">
            Occasio AI • Intelligent Planning Assistant for Weddings, Birthdays & Community Events
          </p>
          <p className="text-[11px] text-slate-400">
            Built with Google GenAI SDK (Gemini 3.8 Flash) • Real-time Budgets, Timelines & Ideas
          </p>
        </div>
      </footer>

      {/* Floating Quick Concierge Modal */}
      {isFloatingConciergeOpen && (
        <ConciergeChatModal
          event={activeEvent}
          isModal={true}
          onClose={() => setIsFloatingConciergeOpen(false)}
        />
      )}

      {/* Generate Plan Modal */}
      <GeneratePlanModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onPlanCreated={handlePlanCreated}
      />

      {/* Edit Event Details Modal */}
      <EditEventModal
        isOpen={isEditModalOpen}
        event={activeEvent}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateActiveEvent}
      />

      {/* Export / Print Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        event={activeEvent}
        onClose={() => setIsExportModalOpen(false)}
        onImportPlan={handleImportPlan}
        onResetSamples={handleResetSamples}
      />

      {/* AI Speech & Toast Writer Modal */}
      <SpeechGeneratorModal
        isOpen={isSpeechModalOpen}
        event={activeEvent}
        onClose={() => setIsSpeechModalOpen(false)}
      />

    </div>
  );
}
