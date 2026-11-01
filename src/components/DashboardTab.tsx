/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Store, 
  ArrowRight, 
  Lightbulb, 
  Check, 
  AlertCircle,
  Palette,
  TrendingDown,
  CalendarCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventPlan } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface DashboardTabProps {
  event: EventPlan;
  onNavigateTab: (tab: 'budget' | 'timeline' | 'vendors' | 'guests' | 'ideas' | 'concierge') => void;
  onToggleMilestone: (milestoneId: string) => void;
  onOpenConciergeWithPrompt: (prompt: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  event,
  onNavigateTab,
  onToggleMilestone,
  onOpenConciergeWithPrompt,
}) => {
  // Calculations
  const totalBudget = event.totalBudget || 0;
  const totalAllocated = event.budgetItems.reduce((acc, item) => acc + (item.actualCost || item.estimatedCost || 0), 0);
  const totalPaid = event.budgetItems.reduce((acc, item) => acc + (item.paidAmount || 0), 0);
  const remainingBudget = totalBudget - totalAllocated;

  const totalMilestones = event.milestones.length;
  const completedMilestones = event.milestones.filter(m => m.isCompleted).length;
  const milestonePercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const totalVendors = event.vendors.length;
  const bookedVendors = event.vendors.filter(v => v.status === 'booked').length;

  // Next up milestones (incomplete)
  const upcomingMilestones = event.milestones.filter(m => !m.isCompleted).slice(0, 4);

  const handleMilestoneClick = (id: string) => {
    onToggleMilestone(id);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#10b981'],
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Vibe & Theme Spotlight */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>AI Design Blueprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-white tracking-tight">
            {event.ideas.themeName || 'Tailored Celebration Blueprint'}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {event.vibe || event.ideas.vibeDescription}
          </p>

          {/* Color Palette preview dots */}
          {event.ideas.colorPalette && event.ideas.colorPalette.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400 font-medium flex items-center">
                <Palette className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Color Story:
              </span>
              <div className="flex items-center space-x-2">
                {event.ideas.colorPalette.map((color, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-2xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[11px] text-slate-200 font-mono">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 -mb-10 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Budget Card */}
        <div 
          onClick={() => onNavigateTab('budget')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Budget Health
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalAllocated, event.currency)}
            </p>
            <p className="text-xs text-slate-500 flex items-center justify-between">
              <span>Cap: {formatCurrency(totalBudget, event.currency)}</span>
              <span className={`font-semibold ${remainingBudget < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {remainingBudget >= 0 ? `${formatCurrency(remainingBudget, event.currency)} free` : 'Over cap'}
              </span>
            </p>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${totalAllocated > totalBudget ? 'bg-red-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(100, totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0)}%` }}
            />
          </div>
        </div>

        {/* Milestone Progress */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Milestones
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-900">
              {completedMilestones} / {totalMilestones}
            </p>
            <p className="text-xs text-slate-500">
              {milestonePercent}% of overall checklist done
            </p>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${milestonePercent}%` }}
            />
          </div>
        </div>

        {/* Vendors Card */}
        <div 
          onClick={() => onNavigateTab('vendors')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Vendors Booked
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-900">
              {bookedVendors} / {totalVendors}
            </p>
            <p className="text-xs text-slate-500">
              {totalVendors - bookedVendors} pending contract / quote
            </p>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${totalVendors > 0 ? (bookedVendors / totalVendors) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Day-of Run-of-Show Card */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Day-Of Schedule
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-900">
              {event.dayOfSchedule.length} Events
            </p>
            <p className="text-xs text-slate-500">
              From {event.dayOfSchedule[0]?.time || 'Morning'} to {event.dayOfSchedule[event.dayOfSchedule.length - 1]?.endTime || 'Night'}
            </p>
          </div>
          <div className="mt-3 flex items-center text-xs font-medium text-amber-700 group-hover:translate-x-0.5 transition-transform">
            <span>View run-of-show</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

      </div>

      {/* Main Grid: Priority Milestones & Day-Of Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Upcoming Checklist */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-serif-display font-bold text-slate-900">
                Action Checklist & Upcoming Milestones
              </h3>
              <p className="text-xs text-slate-500">
                Click any task to mark complete and celebrate progress!
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <span>View All ({event.milestones.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingMilestones.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-medium text-slate-700">All planned milestones are completed!</p>
                <p className="text-xs">Add more tasks in the Timeline tab anytime.</p>
              </div>
            ) : (
              upcomingMilestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start justify-between p-3.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition-all group"
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleMilestoneClick(m.id)}
                      className="mt-0.5 w-5 h-5 rounded-md border border-slate-300 hover:border-rose-500 flex items-center justify-center transition-colors bg-white shrink-0 group-hover:scale-105"
                      aria-label={`Mark ${m.title} as completed`}
                    >
                      {m.isCompleted && <Check className="w-3.5 h-3.5 text-rose-600" />}
                    </button>
                    <div>
                      <p className="text-sm font-medium text-slate-800 leading-snug">
                        {m.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {m.phase}
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
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Quick AI Assistant Prompts */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-rose-50/50 rounded-xl border border-indigo-100 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-serif-display font-bold text-base text-slate-900">
                Ask Occasio AI Co-Planner
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained on event management logistics, etiquette, budget negotiation, and creative concepts.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => onOpenConciergeWithPrompt('Suggest 3 ways to reduce our catering and bar expenses without guests noticing a difference.')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs text-slate-700 transition-all flex items-center justify-between group"
              >
                <span>💡 "Cut catering costs smartly"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => onOpenConciergeWithPrompt('Draft a heartfelt, funny 3-minute toast/welcome speech for this event.')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs text-slate-700 transition-all flex items-center justify-between group"
              >
                <span>🎙️ "Draft a 3-minute toast / speech"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => onOpenConciergeWithPrompt('What are the top 5 unexpected logistical surprises or permits we should prepare for?')}
                className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs text-slate-700 transition-all flex items-center justify-between group"
              >
                <span>📋 "Common hidden logistical surprises"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </button>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('concierge')}
            className="w-full py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors"
          >
            <span>Open Dedicated AI Concierge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
