/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mic, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Clock, 
  Smile, 
  Heart, 
  Volume2, 
  RotateCcw
} from 'lucide-react';
import { EventPlan } from '../types';

interface SpeechGeneratorModalProps {
  isOpen: boolean;
  event: EventPlan;
  onClose: () => void;
}

export const SpeechGeneratorModal: React.FC<SpeechGeneratorModalProps> = ({
  isOpen,
  event,
  onClose,
}) => {
  const [role, setRole] = useState(
    event.eventType === 'wedding'
      ? 'Maid of Honor / Best Man'
      : event.eventType === 'birthday'
      ? 'Best Friend / Sibling'
      : 'Event Organizer / Host'
  );
  const [tone, setTone] = useState<'heartfelt' | 'funny' | 'inspiring' | 'poetic'>('heartfelt');
  const [duration, setDuration] = useState<'1 min' | '3 min' | '5 min'>('3 min');
  const [guestOfHonor, setGuestOfHonor] = useState('');
  const [keyMemories, setKeyMemories] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSpeech, setGeneratedSpeech] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedSpeech(null);

    const prompt = `Write an exceptional ${duration} ${tone} speech / toast for a ${event.eventType}.
Role of speaker: ${role}
Guest(s) of Honor: ${guestOfHonor || 'the celebrated couple/person'}
Event Context: ${event.title} in ${event.location}
Special memories, inside jokes, or heartfelt points to include: ${keyMemories || 'Celebrate their kindness, shared adventures, and joyful future together.'}

Requirements:
- Include natural delivery stage directions like [Pause for laughter], [Smile and make eye contact], [Raise glass].
- Keep the language natural, authentic, memorable, and avoid clichés.
- Format with an opening hook, personal story, heartfelt tribute, and grand closing toast.`;

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          eventContext: {
            title: event.title,
            eventType: event.eventType,
            date: event.date,
            location: event.location,
            guestCount: event.guestCount,
            vibe: event.vibe,
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setGeneratedSpeech(data.reply);
      } else {
        setGeneratedSpeech('Could not generate speech script.');
      }
    } catch (err: any) {
      setGeneratedSpeech(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedSpeech) return;
    navigator.clipboard.writeText(generatedSpeech);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-lg text-white">
                GenAI Speech & Toast Writer
              </h3>
              <p className="text-xs text-slate-300">
                Craft memorable toasts, vows & welcoming remarks with Gemini 3.8
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!generatedSpeech ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Role / Relation
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Maid of Honor, Best Friend, Host"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Name of Guest(s) of Honor
                  </label>
                  <input
                    type="text"
                    value={guestOfHonor}
                    onChange={(e) => setGuestOfHonor(e.target.value)}
                    placeholder="e.g. Elena & Julian, Maya"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-rose-500"
                  />
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Desired Speech Tone
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'heartfelt', label: 'Heartfelt & Emotional', icon: Heart },
                    { id: 'funny', label: 'Witty & Humorous', icon: Smile },
                    { id: 'inspiring', label: 'Inspiring & Warm', icon: Sparkles },
                    { id: 'poetic', label: 'Poetic & Elegant', icon: Volume2 },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = tone === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTone(t.id as any)}
                        className={`p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{t.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Length / Target Timing
                </label>
                <div className="flex items-center space-x-3">
                  {(['1 min', '3 min', '5 min'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        duration === d
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-3 h-3 inline mr-1" />
                      {d} (~{d === '1 min' ? '150' : d === '3 min' ? '400' : '700'} words)
                    </button>
                  ))}
                </div>
              </div>

              {/* Key memories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Stories, Memories, or Inside Jokes to Mention
                </label>
                <textarea
                  rows={3}
                  value={keyMemories}
                  onChange={(e) => setKeyMemories(e.target.value)}
                  placeholder="e.g. How we met in college dorms; their shared love for camping in the rain; the time they adopted their golden retriever..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-xs transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Drafting Speech...' : 'Generate Custom Speech'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-[60vh] overflow-y-auto text-xs sm:text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
                {generatedSpeech}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setGeneratedSpeech(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Adjust Parameters & Re-write</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    {hasCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Speech</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
