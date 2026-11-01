/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrencyCode } from '../types';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'AU$',
  INR: '₹',
  JPY: '¥',
};

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'Date TBD';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getDaysUntil(dateString: string): { days: number; text: string; isPast: boolean } {
  if (!dateString) return { days: 0, text: 'No date set', isPast: false };
  try {
    const target = new Date(dateString);
    const today = new Date();
    // Normalize to midnight
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { days: 0, text: 'Today is the day! 🎉', isPast: false };
    } else if (diffDays < 0) {
      return { days: Math.abs(diffDays), text: `${Math.abs(diffDays)} days ago`, isPast: true };
    } else {
      return { days: diffDays, text: `${diffDays} days to go`, isPast: false };
    }
  } catch {
    return { days: 0, text: '', isPast: false };
  }
}
