/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Copy, 
  Check, 
  RefreshCw,
  Lightbulb,
  X
} from 'lucide-react';
import { EventPlan, AiChatMessage } from '../types';

interface ConciergeChatProps {
  event: EventPlan;
  initialPrompt?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const ConciergeChatModal: React.FC<ConciergeChatProps> = ({
  event,
  initialPrompt,
  isModal = false,
  onClose,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm your Occasio AI Co-Planner. I'm completely briefed on your **${event.title}** (${event.guestCount} guests, ${event.currency} ${event.totalBudget.toLocaleString()} budget).\n\nAsk me anything: speech writing, rainy-day contingency strategies, invitation wording, decor DIYs, or schedule timings!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // If initialPrompt provided, trigger it
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          eventContext: {
            title: event.title,
            eventType: event.eventType,
            date: event.date,
            location: event.location,
            guestCount: event.guestCount,
            totalBudget: event.totalBudget,
            currency: event.currency,
            vibe: event.vibe,
          },
          conversationHistory: messages,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "I'm having trouble connecting right now, but feel free to retry.";

      const aiMsg: AiChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `Error contacting planner: ${err.message}. Please check your connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const suggestions = [
    'Write a 3-minute Maid of Honor / Host speech',
    'Rainy day backup plan for outdoor space',
    'Invitation RSVP wording & attire dress code',
    'How to trim $1,500 without guests noticing',
    '5 creative crowd icebreakers or table games',
  ];

  const content = (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      
      {/* Top Header */}
      <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-display font-bold text-base text-white flex items-center space-x-1.5">
              <span>Occasio AI Co-Planner</span>
              <span className="bg-rose-500/30 text-rose-300 text-[10px] px-1.5 py-0.2 rounded-full uppercase font-sans">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
              Context: {event.title} • {event.guestCount} guests
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Suggestions Chips */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center">
          <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-500" />
          Prompts:
        </span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(s)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 text-xs transition-colors shrink-0"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-[350px] max-h-[550px] bg-slate-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                msg.sender === 'user'
                  ? 'bg-slate-800'
                  : 'bg-gradient-to-tr from-rose-500 to-indigo-600'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs relative group ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              <div
                className={`mt-2 flex items-center justify-between text-[10px] ${
                  msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>

                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 hover:text-indigo-600 ml-2"
                    title="Copy text"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200" />
                <span className="font-medium text-slate-600 ml-1">
                  Occasio is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask anything about timelines, budgets, speeches, decor..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600 focus:border-indigo-600 bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-colors shadow-xs shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
        <div className="max-w-2xl w-full h-[85vh]">{content}</div>
      </div>
    );
  }

  return <div className="h-[75vh]">{content}</div>;
};
