/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '5mb' }));

// Initialize GoogleGenAI SDK with user-agent
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Timeout helper to guarantee responsive UI under network variance
async function withTimeout<T>(promise: Promise<T>, ms = 3500): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer!);
    return result;
  } catch (err) {
    clearTimeout(timer!);
    throw err;
  }
}

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Route: Generate Master Event Plan (Budget, Timeline, Schedule, Vendors, Ideas)
 */
app.post('/api/ai/generate-plan', async (req: Request, res: Response) => {
  try {
    const {
      eventType = 'wedding',
      title,
      guestCount = 100,
      budget = 20000,
      currency = 'USD',
      location = 'Local Area',
      date = '2027-06-20',
      vibe = 'Celebratory and modern',
      notes = '',
    } = req.body;

    const ai = getGeminiClient();

    let parsedPlan: any = null;

    if (ai) {
      try {
        const prompt = `Create an exceptional, comprehensive master plan for a ${eventType} named "${title || `${eventType.toUpperCase()} Celebration`}".
Key details:
- Guest Count: ${guestCount} people
- Total Budget: ${currency} ${budget}
- Location: ${location}
- Planned Date: ${date}
- Vibe / Aesthetic: ${vibe}
- Extra Notes / Special Requirements: ${notes || 'None'}

Please return a comprehensive, structured JSON with realistic line items, timeline milestones, day-of run-of-show schedule, essential vendors, and creative design ideas.`;

        const systemInstruction = `You are an elite, world-class event planner specializing in weddings, milestone birthdays, and community gatherings.
You provide realistic market-rate cost distributions, actionable timeline phases, realistic day-of run-of-show timing, essential vendor requirements, and high-taste creative themes.
Always respond strictly with valid JSON conforming to the requested schema.`;

        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  budgetItems: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: {
                          type: Type.STRING,
                          description: 'One of: venue, catering, decor_rentals, photo_video, entertainment, attire_beauty, invitations_gifts, logistics_permits, contingency',
                        },
                        name: { type: Type.STRING },
                        estimatedCost: { type: Type.NUMBER },
                        notes: { type: Type.STRING },
                      },
                      required: ['category', 'name', 'estimatedCost'],
                    },
                  },
                  milestones: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        phase: { type: Type.STRING, description: 'e.g. 6-12 Months Before, 3-6 Months Before, 1 Month Before, Week Of, Day Before' },
                        priority: { type: Type.STRING, description: 'low, medium, or high' },
                        category: { type: Type.STRING },
                        notes: { type: Type.STRING },
                      },
                      required: ['title', 'phase', 'priority', 'category'],
                    },
                  },
                  dayOfSchedule: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING, description: 'e.g. 10:00 AM' },
                        endTime: { type: Type.STRING, description: 'e.g. 11:30 AM' },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        location: { type: Type.STRING },
                        leadPerson: { type: Type.STRING },
                      },
                      required: ['time', 'title', 'description'],
                    },
                  },
                  vendors: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        businessName: { type: Type.STRING },
                        notes: { type: Type.STRING },
                        quotedPrice: { type: Type.NUMBER },
                        checklist: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                      required: ['category', 'businessName', 'checklist'],
                    },
                  },
                  ideas: {
                    type: Type.OBJECT,
                    properties: {
                      themeName: { type: Type.STRING },
                      vibeDescription: { type: Type.STRING },
                      colorPalette: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            hex: { type: Type.STRING },
                            role: { type: Type.STRING },
                          },
                          required: ['name', 'hex', 'role'],
                        },
                      },
                      decorConcepts: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            diyTip: { type: Type.STRING },
                          },
                          required: ['title', 'description'],
                        },
                      },
                      foodAndBeverage: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            dietaryNotes: { type: Type.STRING },
                          },
                          required: ['title', 'description'],
                        },
                      },
                      activitiesAndEntertainment: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            timing: { type: Type.STRING },
                          },
                          required: ['title', 'description'],
                        },
                      },
                      favorsAndGifts: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                          },
                          required: ['title', 'description'],
                        },
                      },
                      musicMood: {
                        type: Type.OBJECT,
                        properties: {
                          genre: { type: Type.STRING },
                          vibeTracks: { type: Type.ARRAY, items: { type: Type.STRING } },
                          soundTip: { type: Type.STRING },
                        },
                        required: ['genre', 'vibeTracks', 'soundTip'],
                      },
                    },
                    required: ['themeName', 'vibeDescription', 'colorPalette', 'decorConcepts', 'foodAndBeverage'],
                  },
                },
                required: ['title', 'budgetItems', 'milestones', 'dayOfSchedule', 'vendors', 'ideas'],
              },
            },
          }),
          5000
        );

        parsedPlan = JSON.parse(response.text || '{}');
      } catch (geminiErr) {
        console.warn('Gemini generateContent failover to dynamic generator:', geminiErr);
      }
    }

    if (!parsedPlan || !parsedPlan.budgetItems || parsedPlan.budgetItems.length === 0) {
      parsedPlan = generateDynamicFallback({
        eventType,
        title: title || `${eventType.toUpperCase()} Celebration`,
        guestCount,
        budget,
        currency,
        location,
        date,
        vibe,
        notes,
      });
      return res.json({ success: true, plan: parsedPlan, fallback: true });
    }

    return res.json({ success: true, plan: parsedPlan });
  } catch (error: any) {
    console.error('Error in generate-plan route:', error);
    const fallbackPlan = generateDynamicFallback(req.body);
    return res.json({ success: true, plan: fallbackPlan, fallback: true });
  }
});

/**
 * Route: AI Budget Optimizer
 */
app.post('/api/ai/optimize-budget', async (req: Request, res: Response) => {
  try {
    const { totalBudget, currency = 'USD', items = [], goal = 'save_15_percent', eventType = 'event' } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Analyze this ${eventType} budget with a total budget of ${currency} ${totalBudget}.
Current line items:
${JSON.stringify(items, null, 2)}

User goal: ${goal}.
Provide:
1. Executive analysis of current spending ratios.
2. 4-6 specific, actionable cost-saving or re-allocation recommendations.
3. Category-by-category trade-offs (what to splurge on vs what to scale down).
4. Three vendor negotiation tips to lock in lower rates.`;

      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: 'You are a veteran financial event strategist. Provide crisp, realistic, highly impactful advice formatted in clear sections.',
            },
          }),
          3500
        );

        return res.json({ success: true, analysis: response.text });
      } catch (geminiErr) {
        console.warn('Gemini optimize-budget failover to strategist engine:', geminiErr);
      }
    }

    // Fallback optimizer
    const fallbackAnalysis = `### Budget Optimization Strategy for your ${eventType}
**Total Target Budget:** ${currency} ${totalBudget.toLocaleString()}

#### 1. Spending Ratio Health Check
- **Venue & Catering:** Typically absorbs 45-55% of your total budget. Ensure food minimums don't force unnecessary upcharges.
- **Entertainment & Media (Photo/Video):** Represents 15-20%. These preserve lifelong memories and energy.
- **Decor & Extras:** High variance area where 20-30% can be saved through focal installations instead of scattering small items.

#### 2. Key Actionable Savings
1. **Consolidate Vendor Travel & Load-In:** Bundling sound, lighting, and DJ with one provider avoids multiple setup and delivery fees (average saving: ${currency} 400 - 800).
2. **Repurpose Floral & Decor:** Move ceremony arrangements and entrance arches to frame the main reception table or photo backdrop.
3. **Smart Bar Strategy:** Offer signature cocktail stations plus beer & wine instead of an unlimited top-shelf open bar to reduce per-head beverage waste by up to 25%.
4. **Digitize Auxiliary Stationery:** Keep physical paper for keepsakes (invitations), but use QR code mobile programs and digital guestbooks for day-of details.

#### 3. Vendor Negotiation Tips
- Ask vendors if paying by ACH or bank transfer offers a 2-3% cash discount versus credit card processing fees.
- Inquire about off-peak load-in windows or weekday discounts if your date allows flexibility.
- Ask for complimentary service add-ons (e.g. an extra hour of cocktail music or complimentary rehearsal coverage) rather than only pushing for price drops.`;

    return res.json({ success: true, analysis: fallbackAnalysis, fallback: true });
  } catch (err: any) {
    console.error('Budget optimizer error:', err);
    res.status(500).json({ error: 'Failed to optimize budget', details: err.message });
  }
});

/**
 * Route: AI Vendor Assistant (Draft Inquiries, Check Contracts, Negotiate)
 */
app.post('/api/ai/vendor-assistant', async (req: Request, res: Response) => {
  try {
    const { actionType, vendorType, details, eventContext } = req.body;
    const ai = getGeminiClient();

    let taskDescription = '';
    if (actionType === 'inquiry') {
      taskDescription = `Draft a polite, professional, and clear Request for Proposal (RFP) / initial inquiry email to a ${vendorType} for our event. Include specific questions regarding availability, package inclusions, cancellation terms, and equipment needs.`;
    } else if (actionType === 'contract_check') {
      taskDescription = `Analyze this vendor quote / contract clause for a ${vendorType} and highlight potential red flags, hidden fees (like service charges, overtime rates, gratuities, force majeure), and items that should be clarified before signing.`;
    } else {
      taskDescription = `Draft a tactful negotiation response to a ${vendorType} to ask if there are package customizations or date/hour adjustments to bring the price within our budget without being offensive.`;
    }

    if (ai) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Task: ${taskDescription}\nEvent Details: ${JSON.stringify(eventContext || {})}\nSpecific Notes/Input: ${details || 'None'}`,
            config: {
              systemInstruction: 'You are a seasoned event planner helping the client communicate flawlessly with event vendors. Output clear, ready-to-copy text and concise bullet points.',
            },
          }),
          3500
        );

        return res.json({ success: true, content: response.text });
      } catch (geminiErr) {
        console.warn('Gemini vendor-assistant failover to template engine:', geminiErr);
      }
    }

    // Fallback response
    let fallbackText = '';
    if (actionType === 'inquiry') {
      fallbackText = `Subject: Inquiry: Availability & Packages for ${eventContext?.eventType || 'Upcoming Event'} - ${eventContext?.title || 'Our Celebration'}

Dear [Vendor Name / Team],

I hope this message finds you well!

We are currently organizing our ${eventContext?.eventType || 'event'}, scheduled for ${eventContext?.date || '[Date]'} at ${eventContext?.location || '[Location]'} with approximately ${eventContext?.guestCount || '[Guest Count]'} guests.

We love your work and would love to learn more about your packages and availability for this date. Could you please share:
1. Your pricing guide and package inclusions for events of our size.
2. Typical setup/load-in requirements and staffing details.
3. Your deposit and cancellation/rescheduling policies.
4. Any travel or overtime fees we should anticipate.

Our overall vibe is "${eventContext?.vibe || 'warm, engaging, and memorable'}". We are hoping to review quotes this week and would be thrilled to connect.

Warm regards,
[Your Name]
[Your Phone Number]`;
    } else if (actionType === 'contract_check') {
      fallbackText = `### Key Contract Safeguards for ${vendorType || 'Event Vendor'}

1. **Hidden Fees & Gratuity Structure:** Check whether the contract includes an administrative fee (often 18-22%) and verify whether that covers staff tips or if gratuity is separate.
2. **Overtime & Load-Out Clock:** Clarify the exact minute the billable rate starts and what the per-hour rate is if the party extends past schedule.
3. **Force Majeure & Rescheduling:** Ensure there is a clear clause covering weather events, venue emergencies, or pandemics with credit transfer options.
4. **Substitution Clause:** For photographers, DJs, or key performers: ensure the specific named talent is locked in writing, with an agreed replacement standard if illness occurs.
5. **Permits & Insurance:** Verify they carry commercial liability insurance (minimum $1M standard in most venues).`;
    } else {
      fallbackText = `Subject: Follow-up on Proposal for ${eventContext?.title || 'Our Event'}

Hi [Vendor Name],

Thank you so much for sending over your detailed proposal! We are genuinely excited about the possibility of collaborating with you.

We are reviewing all our event commitments against our current budget cap. Your current estimate is slightly above our allocated target for this category.

Is there any flexibility in the package scope where we could adjust certain hours or inclusions (for instance, adjusting coverage hours or equipment options) to help us meet closer to our target budget? We would love to make this work and lock in our date with you.

Looking forward to your thoughts!

Best regards,
[Your Name]`;
    }

    return res.json({ success: true, content: fallbackText, fallback: true });
  } catch (err: any) {
    console.error('Vendor assistant error:', err);
    res.status(500).json({ error: 'Vendor assistant failed', details: err.message });
  }
});

/**
 * Route: AI Interactive Concierge Chat
 */
app.post('/api/ai/concierge', async (req: Request, res: Response) => {
  try {
    const { message, eventContext, conversationHistory = [] } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const contextIntro = `Current Event Context:
- Title: ${eventContext?.title || 'Our Celebration'}
- Type: ${eventContext?.eventType || 'event'}
- Guests: ${eventContext?.guestCount || 'N/A'}
- Budget: ${eventContext?.currency || '$'} ${eventContext?.totalBudget || 'N/A'}
- Location: ${eventContext?.location || 'TBD'}
- Date: ${eventContext?.date || 'TBD'}
- Vibe: ${eventContext?.vibe || 'Festive'}`;

        const historySummary = (conversationHistory || [])
          .slice(-4)
          .map((m: any) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
          .join('\n');

        const fullPrompt = `${contextIntro}\n\nRecent Conversation Context:\n${historySummary || 'None'}\n\nUser Question: ${message}`;

        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: fullPrompt,
            config: {
              systemInstruction: 'You are Occasio, an intelligent, empathetic, and exceptionally experienced event planner. Help users with wedding, birthday, and community event planning. Answer clearly, offer creative ideas, realistic logistical advice, speech outlines, schedule timings, and keep formatting scannable with bullet points and bold highlights. Keep your tone encouraging and inspiring.',
            },
          }),
          3500
        );

        return res.json({ success: true, reply: response.text });
      } catch (geminiErr) {
        console.warn('Gemini concierge failover to advice engine:', geminiErr);
      }
    }

    // Fallback conversational responses
    let reply = `Thank you for asking! For your **${eventContext?.title || 'event'}**, here are some top recommendations:\n\n`;
    if (message.toLowerCase().includes('speech') || message.toLowerCase().includes('toast')) {
      reply += `### Perfect 3-Minute Toast Outline
1. **The Hook (30 sec):** A warm, funny one-liner welcoming everyone and setting a joyful tone.
2. **The Story (1.5 min):** A heartwarming or humorous anecdote illustrating the guest of honor or couple's genuine character.
3. **The Meaning (45 sec):** What this gathering means to everyone present and what the future holds.
4. **The Toast (15 sec):** Invite everyone to raise their glasses with a memorable closing sentence!`;
    } else if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('cut') || message.toLowerCase().includes('save')) {
      reply += `### Quick Budget Balancing Moves
- **Table Count Reduction:** Increasing table sizes from 8-tops to 10-tops reduces centerpiece, linen, and table rental costs by 20%.
- **Off-Peak Delivery:** Avoid early Sunday morning or late midnight vendor pickups which carry heavy overtime surcharge premiums.
- **Digital Stationery:** Keep formal invitations printed, but run RSVPs and day-of schedules on mobile web pages.`;
    } else {
      reply += `1. **Guest Flow & Pacing:** Ensure transitions between arrivals, main program, and dining have clear music or emcee cues so guests never wonder where to stand.
2. **Atmosphere Lighting:** Candlelight and warm 2700K amber string lights transform any space for a fraction of the cost of elaborate physical props.
3. **Comfort Stations:** Always ensure accessible seating, shaded or heated zones, and plenty of complimentary still & sparkling water available.

Feel free to ask me to draft vendor emails, write speech scripts, or brainstorm specific party games!`;
    }

    return res.json({ success: true, reply, fallback: true });
  } catch (err: any) {
    console.error('Concierge error:', err);
    res.status(500).json({ error: 'Concierge failed', details: err.message });
  }
});

// Dynamic Fallback Helper
function generateDynamicFallback(params: any) {
  const {
    eventType = 'wedding',
    title = 'Celebration',
    guestCount = 75,
    budget = 15000,
    currency = 'USD',
    location = 'Downtown Venue',
    vibe = 'Festive and memorable',
  } = params;

  const budgetNum = Number(budget) || 15000;
  const guestNum = Number(guestCount) || 75;

  let ratioVenue = 0.25;
  let ratioCatering = 0.35;
  let ratioDecor = 0.12;
  let ratioMedia = 0.12;
  let ratioEntertainment = 0.10;
  let ratioContingency = 0.06;

  if (eventType === 'community') {
    ratioVenue = 0.15;
    ratioCatering = 0.15;
    ratioDecor = 0.20;
    ratioMedia = 0.08;
    ratioEntertainment = 0.25;
    ratioContingency = 0.17;
  } else if (eventType === 'birthday') {
    ratioVenue = 0.25;
    ratioCatering = 0.30;
    ratioDecor = 0.15;
    ratioMedia = 0.10;
    ratioEntertainment = 0.15;
    ratioContingency = 0.05;
  }

  return {
    title: title || `${vibe} ${eventType.toUpperCase()}`,
    budgetItems: [
      {
        category: 'venue',
        name: `${eventType === 'wedding' ? 'Ceremony & Reception Space' : eventType === 'birthday' ? 'Lounge & Private Hall Rental' : 'Community Park / Hall Booking'}`,
        estimatedCost: Math.round(budgetNum * ratioVenue),
        notes: `Accommodates ${guestNum} guests comfortably with facilities`,
      },
      {
        category: 'catering',
        name: `${eventType === 'wedding' ? 'Plated Dinner & Cocktail Hors d’oeuvres' : eventType === 'birthday' ? 'Buffet / Slider Stations & Signature Drinks' : 'Food Trucks & Community Refreshments'}`,
        estimatedCost: Math.round(budgetNum * ratioCatering),
        notes: `Estimated ~$${Math.round((budgetNum * ratioCatering) / guestNum)} per guest`,
      },
      {
        category: 'decor_rentals',
        name: 'Lighting, Floral Installations & Table Linens',
        estimatedCost: Math.round(budgetNum * ratioDecor),
        notes: 'Theme accents and aesthetic lighting',
      },
      {
        category: 'photo_video',
        name: 'Event Photography & Highlight Reel',
        estimatedCost: Math.round(budgetNum * ratioMedia),
        notes: 'Coverage for key moments and high-resolution gallery',
      },
      {
        category: 'entertainment',
        name: `${eventType === 'community' ? 'Live Stage Bands & Audio Engineer' : 'Live DJ & Sound System Package'}`,
        estimatedCost: Math.round(budgetNum * ratioEntertainment),
        notes: 'MC services and music progression',
      },
      {
        category: 'contingency',
        name: 'Contingency & Weather Reserve',
        estimatedCost: Math.round(budgetNum * ratioContingency),
        notes: 'Emergency buffer for unexpected overtime or logistics',
      },
    ],
    milestones: [
      {
        title: 'Finalize venue selection and lock date deposit',
        phase: '6-12 Months Before',
        priority: 'high',
        category: 'Venue',
        notes: 'Confirm insurance and capacity requirements',
      },
      {
        title: 'Review menu tasting and select catering package',
        phase: '3-6 Months Before',
        priority: 'high',
        category: 'Catering',
        notes: 'Account for vegetarian and allergy options',
      },
      {
        title: 'Send out formal invitations and monitor RSVP responses',
        phase: '2-3 Months Before',
        priority: 'medium',
        category: 'Stationery',
        notes: 'Collect dietary restrictions',
      },
      {
        title: 'Finalize day-of timeline and distribute to all key vendors',
        phase: '1 Month Before',
        priority: 'high',
        category: 'Logistics',
        notes: 'Hold coordination phone call',
      },
      {
        title: 'Run-through and pack decor / vendor tip envelopes',
        phase: 'Day Before',
        priority: 'medium',
        category: 'Prep',
        notes: 'Ensure all logistics points of contact are saved on phone',
      },
    ],
    dayOfSchedule: [
      {
        time: '10:00 AM',
        endTime: '12:00 PM',
        title: 'Vendor Load-In & Site Setup',
        description: 'Tables, sound equipment, floral arches, and staging positioned.',
        location: location,
        leadPerson: 'Event Lead',
      },
      {
        time: '01:00 PM',
        endTime: '02:00 PM',
        title: 'Welcome & Guest Arrival',
        description: 'Ambient background music, signature welcome refreshments served.',
        location: 'Entrance Foyer',
        leadPerson: 'Welcome Greeters',
      },
      {
        time: '02:30 PM',
        endTime: '04:00 PM',
        title: 'Main Program & Featured Highlights',
        description: 'Keynotes, vows, ceremonies or milestone festivities.',
        location: 'Main Hall',
        leadPerson: 'Emcee',
      },
      {
        time: '04:30 PM',
        endTime: '06:30 PM',
        title: 'Dinner & Social Dining Experience',
        description: 'Delicious cuisine, heartfelt toasts, and relaxed conversations.',
        location: 'Dining Area',
        leadPerson: 'Catering Captain',
      },
      {
        time: '07:00 PM',
        endTime: '10:00 PM',
        title: 'Party, Dancing & Celebration Send-off',
        description: 'Peak dance floor energy, late-night treats, and grand exit.',
        location: 'Main Stage',
        leadPerson: 'DJ / Band',
      },
    ],
    vendors: [
      {
        category: 'Venue & Facilities',
        businessName: `${location} Management`,
        notes: 'Verify load-in elevator and parking availability',
        quotedPrice: Math.round(budgetNum * ratioVenue),
        checklist: ['Sign facility contract', 'Provide Certificate of Insurance', 'Confirm curfew time'],
      },
      {
        category: 'Catering & Bar',
        businessName: 'Artisan Kitchen & Beverage Co.',
        notes: 'Includes buffet/plated service and bartending staff',
        quotedPrice: Math.round(budgetNum * ratioCatering),
        checklist: ['Dietary counts finalized', 'Bar liquor permit confirmed', 'Tasting approved'],
      },
      {
        category: 'Sound & Entertainment',
        businessName: 'SoundWave Event Productions',
        notes: 'Microphones, stage lighting, and sound engineer included',
        quotedPrice: Math.round(budgetNum * ratioEntertainment),
        checklist: ['Submit song playlist and must-not-play list', 'Test wireless mic frequencies'],
      },
      {
        category: 'Media & Photography',
        businessName: 'Lumina Story Studios',
        notes: '8 hours coverage with digital delivery',
        quotedPrice: Math.round(budgetNum * ratioMedia),
        checklist: ['Complete shot list with key people', 'Timeline review meeting'],
      },
    ],
    ideas: {
      themeName: `${vibe.charAt(0).toUpperCase() + vibe.slice(1)} Ambiance`,
      vibeDescription: `A tailored ${eventType} designed around warm hospitality, cohesive aesthetics, and memorable attendee moments.`,
      colorPalette: [
        { name: 'Warm Terracotta', hex: '#C25E3E', role: 'Warm Accent' },
        { name: 'Sage Evergreen', hex: '#4B6B58', role: 'Organic Base' },
        { name: 'Champagne Linen', hex: '#F5EFEB', role: 'Light Neutral' },
        { name: 'Brushed Brass', hex: '#C79D58', role: 'Metallic Touch' },
      ],
      decorConcepts: [
        {
          title: 'Ambient Warm Filament Lighting',
          description: 'Hanging Edison bulb clusters and warm uplighting to give an intimate, welcoming glow across the venue.',
          diyTip: 'Use battery-operated wireless amber puck lights for effortless placement.',
        },
        {
          title: 'Signature Interactive Welcome Display',
          description: 'A customized wooden or mirror entryway sign with live greenery garlands welcoming guests.',
          diyTip: 'Design with vinyl decals on an ornate thrifted framed mirror.',
        },
      ],
      foodAndBeverage: [
        {
          title: 'Craft Signature Welcome Refreshment',
          description: 'Fresh citrus spritz with rosemary sprigs, offered both with artisanal spirit or as a mocktail.',
          dietaryNotes: 'Naturally gluten-free and vegan.',
        },
        {
          title: 'Interactive Grazing or Dessert Display',
          description: 'Artisanal bites, mini pastries, and local seasonal specialties for engaging social mingling.',
        },
      ],
      activitiesAndEntertainment: [
        {
          title: 'Custom Memory & Polaroid Station',
          description: 'Instant film cameras with a dedicated prompt board for guests to leave notes and candid snapshots.',
          timing: 'Open throughout cocktail hour and reception',
        },
      ],
      favorsAndGifts: [
        {
          title: 'Locally Sourced Keepsakes',
          description: 'Artisan honey jars, mini wildflower seeds, or locally roasted coffee bags tagged with a heartfelt thank-you.',
        },
      ],
      musicMood: {
        genre: 'Modern Soul, Indie Folk & Feel-Good Groove',
        vibeTracks: ['Leon Bridges - Texas Sun', 'Khruangbin - Texas Sun', 'Stevie Wonder - For Once In My Life'],
        soundTip: 'Keep sound volume comfortable during social dining hours so conversations remain easy.',
      },
    },
  };
}

// Mount Vite or static files
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Occasio AI Server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
