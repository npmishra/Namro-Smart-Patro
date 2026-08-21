import { ADDate, BSDate } from '../types';
import {
  adToBs,
  bsToAd,
  formatBSDateNepali,
  getDaysInBSMonth,
  NEPALI_MONTHS,
  toNepaliDigits,
} from './calendarEngine';

export interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  nextOccasionDays: number;
}

/**
 * Calculate exact difference between two Gregorian AD dates
 */
export function calculateADDateDifference(startDate: ADDate, endDate: ADDate): DateDifferenceResult {
  const d1 = new Date(Date.UTC(startDate.year, startDate.month - 1, startDate.day));
  const d2 = new Date(Date.UTC(endDate.year, endDate.month - 1, endDate.day));

  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  let earlier = d1 < d2 ? d1 : d2;
  let later = d1 < d2 ? d2 : d1;

  let y = later.getUTCFullYear() - earlier.getUTCFullYear();
  let m = later.getUTCMonth() - earlier.getUTCMonth();
  let d = later.getUTCDate() - earlier.getUTCDate();

  if (d < 0) {
    m -= 1;
    const prevMonthDays = new Date(later.getUTCFullYear(), later.getUTCMonth(), 0).getDate();
    d += prevMonthDays;
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }

  // Next birthday/anniversary calculation relative to today
  const now = new Date();
  const nextOccasionYear = now.getUTCMonth() > startDate.month - 1 ||
    (now.getUTCMonth() === startDate.month - 1 && now.getUTCDate() > startDate.day)
      ? now.getUTCFullYear() + 1
      : now.getUTCFullYear();
  const nextOccasionDate = new Date(Date.UTC(nextOccasionYear, startDate.month - 1, startDate.day));
  const nextDiffMs = nextOccasionDate.getTime() - now.getTime();
  const nextOccasionDays = Math.max(0, Math.ceil(nextDiffMs / (1000 * 60 * 60 * 24)));

  return {
    years: Math.max(0, y),
    months: Math.max(0, m),
    days: Math.max(0, d),
    totalDays,
    totalWeeks,
    totalHours,
    nextOccasionDays,
  };
}

/**
 * Calculate exact difference between two BS dates
 */
export function calculateBSDateDifference(startBS: BSDate, endBS: BSDate): DateDifferenceResult {
  const startAD = bsToAd(startBS);
  const endAD = bsToAd(endBS);
  return calculateADDateDifference(startAD, endAD);
}
