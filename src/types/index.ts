/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventType = 'wedding' | 'birthday' | 'community' | 'other';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'INR' | 'JPY';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  dueDate?: string;
  notes?: string;
  status: 'planned' | 'deposit_paid' | 'paid_in_full';
}

export type BudgetCategory =
  | 'venue'
  | 'catering'
  | 'decor_rentals'
  | 'photo_video'
  | 'entertainment'
  | 'attire_beauty'
  | 'invitations_gifts'
  | 'logistics_permits'
  | 'contingency';

export interface MilestoneItem {
  id: string;
  title: string;
  phase: string; // e.g. "9-12 Months Before", "1 Month Before", "Week Of"
  dueDate?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  notes?: string;
}

export interface DayOfScheduleItem {
  id: string;
  time: string; // e.g. "09:00 AM"
  endTime?: string; // e.g. "10:30 AM"
  title: string;
  description: string;
  location?: string;
  leadPerson?: string;
  isCompleted: boolean;
}

export type VendorStatus = 'researching' | 'contacted' | 'quoted' | 'booked' | 'declined';

export interface VendorItem {
  id: string;
  category: string; // e.g. "Venue", "Catering", "Florals", "Audio/Visual", "Photography"
  businessName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  status: VendorStatus;
  quotedPrice?: number;
  finalPrice?: number;
  rating?: number;
  notes?: string;
  contractSigned: boolean;
  checklist: { id: string; text: string; done: boolean }[];
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string; // e.g. "Primary Accent", "Neutral Base", "Metallic Pop"
}

export interface PersonalizedIdeas {
  themeName: string;
  vibeDescription: string;
  colorPalette: ColorSwatch[];
  decorConcepts: { title: string; description: string; diyTip?: string }[];
  foodAndBeverage: { title: string; description: string; dietaryNotes?: string }[];
  activitiesAndEntertainment: { title: string; description: string; timing?: string }[];
  favorsAndGifts: { title: string; description: string }[];
  musicMood: { genre: string; vibeTracks: string[]; soundTip: string };
}

export type RsvpStatus = 'confirmed' | 'declined' | 'pending';

export interface GuestItem {
  id: string;
  name: string;
  email?: string;
  status: RsvpStatus;
  partySize: number;
  tableNumber?: string;
  dietaryRequirements?: string;
  groupCategory?: string;
  notes?: string;
}

export interface EventPlan {
  id: string;
  title: string;
  eventType: EventType;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyCode;
  vibe: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  
  // Modules
  budgetItems: BudgetItem[];
  milestones: MilestoneItem[];
  dayOfSchedule: DayOfScheduleItem[];
  vendors: VendorItem[];
  ideas: PersonalizedIdeas;
  guests: GuestItem[];
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
