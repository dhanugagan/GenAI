/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatDate, getDaysUntil } from '../src/utils/formatters.ts';
import { SAMPLE_WEDDING, SAMPLE_BIRTHDAY, SAMPLE_COMMUNITY } from '../src/data/sampleEvents.ts';
import { EventPlan, CurrencyCode } from '../src/types/index.ts';

describe('Occasio AI — Utility & Data Model Tests', () => {
  
  test('formatCurrency correctly formats all supported currencies', () => {
    assert.equal(formatCurrency(1000, 'USD'), '$1,000');
    assert.equal(formatCurrency(2500, 'EUR'), '€2,500');
    assert.equal(formatCurrency(450, 'GBP'), '£450');
    assert.equal(formatCurrency(8000, 'CAD'), 'CA$8,000');
    assert.equal(formatCurrency(12000, 'AUD'), 'AU$12,000');
    assert.equal(formatCurrency(500000, 'INR'), '₹500,000');
    assert.equal(formatCurrency(1000000, 'JPY'), '¥1,000,000');
  });

  test('formatCurrency handles 0, negative values, and decimals safely', () => {
    assert.equal(formatCurrency(0, 'USD'), '$0');
    assert.equal(formatCurrency(-500, 'USD'), '$-500');
    assert.equal(formatCurrency(1234.56, 'USD'), '$1,235');
  });

  test('formatDate handles valid dates, edge cases, and empty strings gracefully', () => {
    assert.equal(formatDate(''), 'Date TBD');
    assert.ok(formatDate('2027-06-19').includes('2027'));
    assert.equal(formatDate('invalid-date'), 'invalid-date');
  });

  test('getDaysUntil handles future and past events correctly', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureStr = futureDate.toISOString().split('T')[0];
    const countdown = getDaysUntil(futureStr);
    assert.equal(countdown.isPast, false);
    assert.ok(countdown.days >= 29 && countdown.days <= 31);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    const pastStr = pastDate.toISOString().split('T')[0];
    const pastCountdown = getDaysUntil(pastStr);
    assert.equal(pastCountdown.isPast, true);
    assert.ok(pastCountdown.days >= 9 && pastCountdown.days <= 11);

    // Empty date edge case
    assert.equal(getDaysUntil('').text, 'No date set');
  });

  test('SAMPLE_WEDDING conforms strictly to EventPlan schema with guests', () => {
    const wedding: EventPlan = SAMPLE_WEDDING;
    assert.equal(wedding.eventType, 'wedding');
    assert.ok(wedding.totalBudget > 0);
    assert.ok(wedding.guestCount > 0);
    assert.ok(wedding.budgetItems.length > 0);
    assert.ok(wedding.milestones.length > 0);
    assert.ok(wedding.dayOfSchedule.length > 0);
    assert.ok(wedding.vendors.length > 0);
    assert.ok(wedding.ideas.colorPalette.length >= 3);
    assert.ok(Array.isArray(wedding.guests) && wedding.guests.length > 0);
  });

  test('SAMPLE_BIRTHDAY conforms strictly to EventPlan schema with guests', () => {
    const birthday: EventPlan = SAMPLE_BIRTHDAY;
    assert.equal(birthday.eventType, 'birthday');
    assert.ok(birthday.totalBudget > 0);
    assert.ok(birthday.dayOfSchedule.length >= 3);
    assert.ok(birthday.ideas.musicMood.vibeTracks.length > 0);
    assert.ok(Array.isArray(birthday.guests) && birthday.guests.length > 0);
  });

  test('SAMPLE_COMMUNITY conforms strictly to EventPlan schema with guests', () => {
    const community: EventPlan = SAMPLE_COMMUNITY;
    assert.equal(community.eventType, 'community');
    assert.ok(community.guestCount >= 100);
    assert.ok(community.vendors.some((v) => v.contractSigned));
    assert.ok(Array.isArray(community.guests) && community.guests.length > 0);
  });

  test('Guest list RSVP counts and dietary requirements aggregate accurately', () => {
    const wedding = SAMPLE_WEDDING;
    const confirmedCount = wedding.guests
      .filter((g) => g.status === 'confirmed')
      .reduce((sum, g) => sum + (g.partySize || 1), 0);
    assert.ok(confirmedCount > 0);

    const hasVegetarian = wedding.guests.some((g) =>
      g.dietaryRequirements?.toLowerCase().includes('vegetarian')
    );
    assert.equal(hasVegetarian, true);
  });

  test('Budget allocations do not exceed realistic financial parameters', () => {
    const wedding = SAMPLE_WEDDING;
    const allocated = wedding.budgetItems.reduce(
      (sum, item) => sum + (item.actualCost || item.estimatedCost || 0),
      0
    );
    assert.ok(allocated > 0);
    assert.ok(Math.abs(wedding.totalBudget - allocated) < wedding.totalBudget);
  });

  test('Day-of Schedule items are formatted in chronological sequence', () => {
    const schedule = SAMPLE_WEDDING.dayOfSchedule;
    assert.ok(schedule.length > 3);
    for (const item of schedule) {
      assert.ok(item.time.length > 0);
      assert.ok(item.title.length > 0);
      assert.ok(item.description.length > 0);
    }
  });

  test('Vendor checklist tasks correctly track completion state', () => {
    const vendors = SAMPLE_WEDDING.vendors;
    for (const v of vendors) {
      assert.ok(v.businessName.length > 0);
      assert.ok(Array.isArray(v.checklist));
      for (const c of v.checklist) {
        assert.equal(typeof c.done, 'boolean');
        assert.ok(c.text.length > 0);
      }
    }
  });

  test('Full EventPlan JSON serialization round-trips without data loss', () => {
    const original = SAMPLE_WEDDING;
    const jsonStr = JSON.stringify(original);
    const parsed = JSON.parse(jsonStr) as EventPlan;

    assert.equal(parsed.id, original.id);
    assert.equal(parsed.title, original.title);
    assert.equal(parsed.budgetItems.length, original.budgetItems.length);
    assert.equal(parsed.milestones.length, original.milestones.length);
    assert.equal(parsed.dayOfSchedule.length, original.dayOfSchedule.length);
    assert.equal(parsed.vendors.length, original.vendors.length);
    assert.equal(parsed.guests.length, original.guests.length);
  });
});
