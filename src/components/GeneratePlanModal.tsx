/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  Wallet, 
  X, 
  Check, 
  Heart, 
  Cake, 
  TreePine, 
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventPlan, EventType, CurrencyCode } from '../types';

interface GeneratePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: EventPlan) => void;
}

const VIBE_PRESETS: Record<EventType, string[]> = {
  wedding: [
    'Romantic Botanical & Candlelit Glasshouse',
    'Modern Minimalist Black-Tie Chic',
    'Sun-Drenched Coastal Tuscan Villa',
    'Cozy Autumn Barn with Acoustic Strings',
  ],
  birthday: [
    'Neon Retro Arcade & Rooftop Sunset Lounge',
    'Glitzy Golden Disco 70s Glamour',
    'Speakeasy Cocktail Tasting & Jazz Piano',
    'Outdoor Boho Glamping & Campfire Acoustic',
  ],
  community: [
    'Eco-Friendly Harvest & Artisan Maker Fair',
    'Neighborhood Block Party & Food Truck Jam',
    'Charity 5K Run & Healthy Living Pavilion',
    'Summer Outdoor Cinema & Acoustic Lawn Concert',
  ],
  other: [
    'Non-Profit Gala & Silent Auction',
    'Tech Startup Founder Showcase & Mixer',
    'Family Reunion Weekend Retreat',
  ],
};

export const GeneratePlanModal: React.FC<GeneratePlanModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
}) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [budget, setBudget] = useState<number>(25000);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [location, setLocation] = useState('San Francisco, CA');
  const [date, setDate] = useState('2027-08-21');
  const [vibe, setVibe] = useState('Romantic Botanical & Candlelit Glasshouse');
  const [notes, setNotes] = useState('');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepText, setStepText] = useState('Preparing blueprint details...');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const steps = [
      'Querying Gemini 3.8 Flash for market cost distribution...',
      'Structuring milestone schedule across months and weeks...',
      'Designing chronological day-of run-of-show...',
      'Assembling vendor contracts & deliverable checklists...',
      'Synthesizing personalized decor, food & color palettes...',
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setStepText(steps[stepIndex]);
      }
    }, 1200);

    try {
      const response = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          title: title || `${eventType.toUpperCase()} Celebration`,
          guestCount,
          budget,
          currency,
          location,
          date,
          vibe,
          notes,
        }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.success && data.plan) {
        const generated = data.plan;
        const newEvent: EventPlan = {
          id: `event-${Date.now()}`,
          title: generated.title || title || `${vibe} ${eventType}`,
          eventType,
          date,
          location,
          guestCount: Number(guestCount) || 50,
          totalBudget: Number(budget) || 10000,
          currency,
          vibe,
          notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          budgetItems: (generated.budgetItems || []).map((b: any, i: number) => ({
            id: `b-${Date.now()}-${i}`,
            category: b.category || 'venue',
            name: b.name || 'Expense',
            estimatedCost: Number(b.estimatedCost) || 0,
            actualCost: Number(b.estimatedCost) || 0,
            paidAmount: 0,
            notes: b.notes || '',
            status: 'planned',
          })),
          milestones: (generated.milestones || []).map((m: any, i: number) => ({
            id: `m-${Date.now()}-${i}`,
            title: m.title || 'Milestone',
            phase: m.phase || '1 Month Before',
            priority: m.priority || 'medium',
            category: m.category || 'General',
            notes: m.notes || '',
            isCompleted: false,
          })),
          dayOfSchedule: (generated.dayOfSchedule || []).map((s: any, i: number) => ({
            id: `s-${Date.now()}-${i}`,
            time: s.time || '10:00 AM',
            endTime: s.endTime || '',
            title: s.title || 'Activity',
            description: s.description || '',
            location: s.location || location,
            leadPerson: s.leadPerson || 'Event Lead',
            isCompleted: false,
          })),
          vendors: (generated.vendors || []).map((v: any, i: number) => ({
            id: `v-${Date.now()}-${i}`,
            category: v.category || 'Vendor',
            businessName: v.businessName || 'Supplier',
            status: 'researching',
            quotedPrice: Number(v.quotedPrice) || 0,
            finalPrice: 0,
            contractSigned: false,
            notes: v.notes || '',
            checklist: (v.checklist || ['Review quote and portfolio']).map((c: string, ci: number) => ({
              id: `vc-${Date.now()}-${i}-${ci}`,
              text: c,
              done: false,
            })),
          })),
          ideas: generated.ideas || {
            themeName: `${vibe} Theme`,
            vibeDescription: vibe,
            colorPalette: [],
            decorConcepts: [],
            foodAndBeverage: [],
            activitiesAndEntertainment: [],
            favorsAndGifts: [],
            musicMood: { genre: 'Acoustic Soul', vibeTracks: [], soundTip: '' },
          },
          guests: [
            { id: `g-${Date.now()}-1`, name: 'VIP Host / Family', status: 'confirmed', partySize: 2, tableNumber: 'Table 1', dietaryRequirements: 'None', groupCategory: 'VIP' },
          ],
        };

        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });

        onPlanCreated(newEvent);
        onClose();
      } else {
        alert('Could not generate plan. Please verify inputs.');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('Plan generation failed:', err);
      alert(`Generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-lg text-white">
                Occasio GenAI Blueprint Creator
              </h3>
              <p className="text-xs text-slate-300">
                Generate budget allocations, timelines, vendors & design ideas in seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isGenerating ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-rose-500/20 border-t-rose-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-rose-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif-display font-bold text-lg text-slate-900">
                Architecting Your Master Plan
              </h4>
              <p className="text-xs font-mono text-indigo-600 font-semibold animate-pulse">
                {stepText}
              </p>
              <p className="text-xs text-slate-500 pt-2 max-w-md mx-auto">
                Powered by Gemini 3.8 Flash. Calculating market rates, schedules, and custom aesthetics.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* 1. Event Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Event Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'wedding', label: 'Wedding', icon: Heart, color: 'text-rose-500' },
                  { id: 'birthday', label: 'Birthday', icon: Cake, color: 'text-violet-500' },
                  { id: 'community', label: 'Community', icon: TreePine, color: 'text-emerald-500' },
                  { id: 'other', label: 'Gala / Other', icon: Compass, color: 'text-amber-500' },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = eventType === t.id;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => {
                        setEventType(t.id as EventType);
                        setVibe(VIBE_PRESETS[t.id as EventType][0]);
                        if (t.id === 'wedding') setBudget(30000);
                        if (t.id === 'birthday') setBudget(5000);
                        if (t.id === 'community') setBudget(8000);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all text-xs font-semibold ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/60 text-slate-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${t.color}`} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Title & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${eventType === 'wedding' ? 'Sarah & Leo’s Botanical Wedding' : eventType === 'birthday' ? 'Marcus’ 40th Speakeasy Bash' : 'Maple Street Community Festival'}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-rose-500"
                />
              </div>
            </div>

            {/* 3. Location, Guests & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Austin, TX"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Guest Count: <span className="text-rose-600 font-bold">{guestCount}</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  required
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-rose-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Total Budget Cap
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="text-[11px] font-semibold text-slate-700 bg-slate-100 rounded px-1 py-0.5"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="INR">INR</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="500"
                  required
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-rose-500"
                />
              </div>
            </div>

            {/* 4. Vibe & Preset Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Vibe & Aesthetic Style
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {VIBE_PRESETS[eventType].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setVibe(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                      vibe === preset
                        ? 'bg-rose-100 border-rose-300 text-rose-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="Or type custom vibe: e.g. Vintage French Garden, 90s Cyberpunk, Bohemian Meadow"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-rose-500"
              />
            </div>

            {/* 5. Special Notes / Custom Needs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom Priorities or Dietary/Cultural Details (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Vegan and gluten-free catering required; prioritize live acoustic music over DJ; wheelchair accessible."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-rose-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Master Blueprint with GenAI</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
