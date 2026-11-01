/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, MapPin, Users, Wallet, Clock, Sparkles, LayoutDashboard, CheckSquare, Lightbulb, Bot, Edit2 } from 'lucide-react';
import { EventPlan, EventType } from '../types';
import { formatCurrency, formatDate, getDaysUntil } from '../utils/formatters';

interface EventHeaderProps {
  event: EventPlan;
  activeTab: 'overview' | 'budget' | 'timeline' | 'vendors' | 'guests' | 'ideas' | 'concierge';
  onTabChange: (tab: 'overview' | 'budget' | 'timeline' | 'vendors' | 'guests' | 'ideas' | 'concierge') => void;
  onEditDetails: () => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  activeTab,
  onTabChange,
  onEditDetails,
}) => {
  const countdown = getDaysUntil(event.date);

  // Calculate budget stats
  const totalBudget = event.totalBudget || 0;
  const totalAllocated = event.budgetItems.reduce((acc, item) => acc + (item.actualCost || item.estimatedCost || 0), 0);
  const totalPaid = event.budgetItems.reduce((acc, item) => acc + (item.paidAmount || 0), 0);
  const remaining = totalBudget - totalAllocated;
  const percentUsed = totalBudget > 0 ? Math.min(100, Math.round((totalAllocated / totalBudget) * 100)) : 0;

  // Event type theme badge
  const getBadgeConfig = (type: EventType) => {
    switch (type) {
      case 'wedding':
        return { label: 'Wedding Celebration', bg: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500' };
      case 'birthday':
        return { label: 'Birthday Bash', bg: 'bg-violet-100 text-violet-800 border-violet-200', dot: 'bg-violet-500' };
      case 'community':
        return { label: 'Community Festival', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' };
      default:
        return { label: 'Special Event', bg: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' };
    }
  };

  const badge = getBadgeConfig(event.eventType);

  interface TabItem {
    id: 'overview' | 'budget' | 'timeline' | 'vendors' | 'guests' | 'ideas' | 'concierge';
    label: string;
    icon: React.ElementType;
    badgeText?: string;
    highlight?: boolean;
  }

  const confirmedGuests = (event.guests || []).filter(g => g.status === 'confirmed').reduce((sum, g) => sum + (g.partySize || 1), 0);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'budget', label: 'Budget Planner', icon: Wallet, badgeText: formatCurrency(totalAllocated, event.currency) },
    { id: 'timeline', label: 'Timeline & Schedule', icon: Clock, badgeText: `${event.milestones.filter(m => m.isCompleted).length}/${event.milestones.length}` },
    { id: 'vendors', label: 'Vendor Checklist', icon: CheckSquare, badgeText: `${event.vendors.filter(v => v.status === 'booked').length} booked` },
    { id: 'guests', label: 'Guests & Seating', icon: Users, badgeText: `${confirmedGuests} attending` },
    { id: 'ideas', label: 'Personalized Ideas', icon: Lightbulb, badgeText: 'AI Themes' },
    { id: 'concierge', label: 'AI Co-Planner', icon: Bot, highlight: true },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        
        {/* Top Header Card */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.dot}`} />
                {badge.label}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                <Clock className="w-3 h-3 mr-1 text-slate-500" />
                {countdown.text}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-slate-900 tracking-tight">
                {event.title}
              </h1>
              <button
                onClick={onEditDetails}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Edit Event Details"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{event.guestCount} Attendees</span>
              </div>
            </div>
          </div>

          {/* Budget Quick Summary Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 sm:p-4 min-w-[280px] sm:min-w-[320px] shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600 flex items-center space-x-1">
                <Wallet className="w-3.5 h-3.5 text-slate-500" />
                <span>Budget Status</span>
              </span>
              <span className="font-bold text-slate-900">
                {percentUsed}% Allocated
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentUsed > 100
                    ? 'bg-red-500'
                    : percentUsed > 85
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, percentUsed)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center border-t border-slate-200/60">
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Total Cap</p>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {formatCurrency(totalBudget, event.currency)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Spent / Quoted</p>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {formatCurrency(totalAllocated, event.currency)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Balance</p>
                <p className={`text-xs font-bold truncate ${remaining < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {remaining < 0 ? '-' : ''}{formatCurrency(Math.abs(remaining), event.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none border-t border-slate-100 pt-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-rose-600 text-rose-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                } ${tab.highlight && !isActive ? 'text-indigo-600' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : tab.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badgeText && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isActive ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badgeText}
                  </span>
                )}
                {tab.highlight && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
