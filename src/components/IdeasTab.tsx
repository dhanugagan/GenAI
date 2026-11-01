/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lightbulb, 
  Palette, 
  Utensils, 
  Sparkles, 
  Music, 
  Gift, 
  PartyPopper, 
  Copy, 
  Check, 
  HelpCircle,
  Plus
} from 'lucide-react';
import { EventPlan, ColorSwatch } from '../types';

interface IdeasTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
  onAskConcierge: (prompt: string) => void;
}

export const IdeasTab: React.FC<IdeasTabProps> = ({ event, onUpdateEvent, onAskConcierge }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const ideas = event.ideas;

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="space-y-6">
      
      {/* Theme Hero Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-purple-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>GenAI Creative Direction</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-white tracking-tight">
            {ideas.themeName || `${event.eventType.toUpperCase()} Concept`}
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-light">
            {ideas.vibeDescription || event.vibe}
          </p>

          <div className="pt-2">
            <button
              onClick={() => onAskConcierge(`Give me 5 more unique, creative DIY decor concepts specifically for a "${ideas.themeName}" aesthetic.`)}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Brainstorm More DIY Decor with AI</span>
            </button>
          </div>
        </div>

        {/* Decorative background blurs */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* SECTION 1: COLOR PALETTE */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif-display font-bold text-base text-slate-900">
              Curated Color Palette & Roles
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click any swatch to copy HEX
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {ideas.colorPalette && ideas.colorPalette.length > 0 ? (
            ideas.colorPalette.map((color, idx) => (
              <div
                key={idx}
                onClick={() => handleCopyHex(color.hex)}
                className="group relative rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white"
              >
                <div
                  className="h-16 w-full rounded-lg shadow-inner border border-black/10 transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="mt-2.5">
                  <p className="font-semibold text-xs text-slate-800 truncate">
                    {color.name}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5 font-mono">
                    <span>{color.hex}</span>
                    {copiedHex === color.hex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </div>
                  <span className="inline-block mt-1 text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                    {color.role}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 col-span-full">No color palette generated yet.</p>
          )}
        </div>
      </div>

      {/* SECTION 2: DECOR & ATMOSPHERE CONCEPTS */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif-display font-bold text-base text-slate-900">
              Atmosphere & Decor Concepts
            </h3>
          </div>
          <button
            onClick={() => onAskConcierge(`Suggest 3 budget-friendly lighting and floral installations for our "${event.title}"`)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1"
          >
            <span>Ask AI for lighting ideas</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ideas.decorConcepts?.map((concept, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Concept 0{idx + 1}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">
                  {concept.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {concept.description}
                </p>
              </div>

              {concept.diyTip && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 bg-amber-50/60 -mx-4 -mb-4 p-3 rounded-b-xl text-[11px] text-amber-900">
                  <span className="font-semibold">💡 Budget / DIY Tip:</span> {concept.diyTip}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: FOOD & BEVERAGES & ENTERTAINMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Food & Beverage */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-rose-500" />
              <h3 className="font-serif-display font-bold text-base text-slate-900">
                Culinary & Beverage Concepts
              </h3>
            </div>
            <button
              onClick={() => onAskConcierge(`Suggest a memorable signature mocktail and signature cocktail pairing for our ${event.eventType}.`)}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Cocktail recipe ideas
            </button>
          </div>

          <div className="space-y-3">
            {ideas.foodAndBeverage?.map((fb, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  {fb.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {fb.description}
                </p>
                {fb.dietaryNotes && (
                  <span className="inline-block mt-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-100">
                    🌱 {fb.dietaryNotes}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Entertainment, Music & Activities */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PartyPopper className="w-5 h-5 text-indigo-500" />
              <h3 className="font-serif-display font-bold text-base text-slate-900">
                Interactive Activities & Music Mood
              </h3>
            </div>
            <button
              onClick={() => onAskConcierge(`Suggest 3 high-engagement icebreakers or crowd activities for a ${event.guestCount}-person ${event.eventType}.`)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Icebreaker ideas
            </button>
          </div>

          <div className="space-y-3">
            {/* Music Mood Box */}
            {ideas.musicMood && (
              <div className="p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/50">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900">
                  <Music className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Vibe Playlist: {ideas.musicMood.genre}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ideas.musicMood.vibeTracks?.map((track, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-white border border-indigo-200/80 text-indigo-800 px-2 py-0.5 rounded-md font-mono"
                    >
                      🎵 {track}
                    </span>
                  ))}
                </div>
                {ideas.musicMood.soundTip && (
                  <p className="text-[11px] text-indigo-700 mt-2 italic">
                    Tip: {ideas.musicMood.soundTip}
                  </p>
                )}
              </div>
            )}

            {/* Activities */}
            {ideas.activitiesAndEntertainment?.map((act, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {act.title}
                  </h4>
                  {act.timing && (
                    <span className="text-[10px] text-slate-500 font-medium">
                      {act.timing}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {act.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 4: FAVORS & GUEST KEEPSAKES */}
      {ideas.favorsAndGifts && ideas.favorsAndGifts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif-display font-bold text-base text-slate-900">
              Thoughtful Guest Favors & Keepsakes
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {ideas.favorsAndGifts.map((favor, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  {favor.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {favor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
