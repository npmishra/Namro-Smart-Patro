import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Grid,
  List,
  Sparkles,
  Flag,
  Sun,
} from 'lucide-react';
import { BSDate, CalendarDayCell, DailyPanchang } from '../types';
import {
  getDaysInBSMonth,
  NEPALI_MONTHS,
  NEPALI_WEEKDAYS,
  toNepaliDigits,
  formatBSDateNepali,
  formatADDateEnglish,
  bsToAd,
} from '../engines/calendarEngine';

interface CalendarMonthViewProps {
  currentYear: number;
  currentMonth: number;
  selectedDate: BSDate;
  todayDate: BSDate;
  days: {
    bsDate: BSDate;
    adDate: { year: number; month: number; day: number };
    weekday: number;
    isToday: boolean;
    isCurrentMonth: boolean;
    isSaturday: boolean;
    hasHoliday: boolean;
    holidayTitle?: string;
    hasFestival: boolean;
    festivalTitle?: string;
    tithiNameNepali: string;
    tithiNumber: number;
    eventsCount: number;
    panchang: DailyPanchang;
  }[];
  onSelectDate: (bsDate: BSDate) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onChangeYear: (year: number) => void;
  onChangeMonth: (month: number) => void;
  onJumpToday: () => void;
  onOpenYearView: () => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  currentYear,
  currentMonth,
  selectedDate,
  todayDate,
  days,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onChangeYear,
  onChangeMonth,
  onJumpToday,
  onOpenYearView,
}) => {
  const monthInfo = NEPALI_MONTHS.find((m) => m.id === currentMonth) || NEPALI_MONTHS[0];

  // Calculate starting padding (first day of the month weekday: 0=Sun ... 6=Sat)
  const firstDay = days[0];
  const startingEmptyCells = firstDay ? firstDay.weekday : 0;

  // AD range for this BS month
  const firstAD = firstDay ? firstDay.adDate : bsToAd({ year: currentYear, month: currentMonth, day: 1 });
  const lastDay = days[days.length - 1];
  const lastAD = lastDay ? lastDay.adDate : bsToAd({ year: currentYear, month: currentMonth, day: getDaysInBSMonth(currentYear, currentMonth) });

  const adMonthsEnglish = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const adRangeStr = `${firstAD.day} ${adMonthsEnglish[firstAD.month]} - ${lastAD.day} ${adMonthsEnglish[lastAD.month]} ${lastAD.year}`;

  // Years array (1970 BS to 2105 BS)
  const availableYears: number[] = [];
  for (let y = 1970; y <= 2105; y++) {
    availableYears.push(y);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Month Navigation & Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Left: Month / Year Title with Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            {/* Month Select */}
            <select
              id="select-month"
              value={currentMonth}
              onChange={(e) => onChangeMonth(parseInt(e.target.value, 10))}
              aria-label="महिना छनोट गर्नुहोस् (Select BS Month)"
              className="px-2.5 py-1.5 text-base sm:text-lg font-extrabold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-red-500 font-['Mukta',sans-serif]"
            >
              {NEPALI_MONTHS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nameNepali} ({m.nameEnglish})
                </option>
              ))}
            </select>

            {/* Year Select */}
            <select
              id="select-year"
              value={currentYear}
              onChange={(e) => onChangeYear(parseInt(e.target.value, 10))}
              aria-label="वर्ष छनोट गर्नुहोस् (Select BS Year)"
              className="px-2.5 py-1.5 text-base sm:text-lg font-extrabold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-red-500 font-['Mukta',sans-serif]"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {toNepaliDigits(y)} BS ({y})
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            {adRangeStr}
          </span>
        </div>

        {/* Right: Prev, Next, Today, Year Overview */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="btn-prev-month"
            onClick={onPrevMonth}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="अघिल्लो महिना (Previous Month)"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="btn-jump-today"
            onClick={onJumpToday}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>आज (Today)</span>
          </button>

          <button
            id="btn-next-month"
            onClick={onNextMonth}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="पछिल्लो महिना (Next Month)"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="btn-open-year-view"
            onClick={onOpenYearView}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors hidden sm:flex items-center gap-1"
            title="वर्ष पात्रो (Full Year Calendar)"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>वर्ष दृश्य</span>
          </button>
        </div>
      </div>

      {/* 7 Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center text-xs sm:text-sm font-bold bg-slate-100/60 dark:bg-slate-800/60">
        {NEPALI_WEEKDAYS.map((w) => {
          const isSat = w.id === 6;
          return (
            <div
              key={w.id}
              className={`py-2.5 sm:py-3 ${
                isSat ? 'text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 font-black' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-black text-sm">{w.nameNepali}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {w.shortEnglish}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar Grid (Days) */}
      <div className="grid grid-cols-7 auto-rows-fr gap-px bg-slate-200 dark:bg-slate-800">
        {/* Preceding blank days */}
        {Array.from({ length: startingEmptyCells }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="bg-slate-50/40 dark:bg-slate-900/40 min-h-[85px] sm:min-h-[115px] p-1.5 opacity-30 select-none"
          />
        ))}

        {/* Month Day Cells */}
        {days.map((dayItem) => {
          const isSelected =
            selectedDate.year === dayItem.bsDate.year &&
            selectedDate.month === dayItem.bsDate.month &&
            selectedDate.day === dayItem.bsDate.day;

          const isToday =
            todayDate.year === dayItem.bsDate.year &&
            todayDate.month === dayItem.bsDate.month &&
            todayDate.day === dayItem.bsDate.day;

          const isSaturday = dayItem.weekday === 6;
          const isPurnima = dayItem.tithiNumber === 15;
          const isAmavasya = dayItem.tithiNumber === 30;
          const isEkadashi = dayItem.tithiNumber === 11 || dayItem.tithiNumber === 26;

          return (
            <div
              key={`day-${dayItem.bsDate.day}`}
              id={`cal-cell-${dayItem.bsDate.year}-${dayItem.bsDate.month}-${dayItem.bsDate.day}`}
              onClick={() => onSelectDate(dayItem.bsDate)}
              className={`group relative bg-white dark:bg-slate-900 min-h-[85px] sm:min-h-[115px] p-1.5 sm:p-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                isSelected
                  ? 'ring-2 ring-inset ring-red-600 dark:ring-rose-500 bg-red-50/40 dark:bg-red-950/30 z-10'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
              } ${isSaturday ? 'bg-rose-50/25 dark:bg-rose-950/15' : ''}`}
            >
              {/* Top row: BS Date, AD Date, and Special Tithi Glyphs */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1">
                  <span
                    className={`text-lg sm:text-2xl font-extrabold leading-none ${
                      isToday
                        ? 'w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs'
                        : isSaturday || dayItem.hasHoliday
                        ? 'text-red-600 dark:text-red-400 font-black'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {toNepaliDigits(dayItem.bsDate.day)}
                  </span>
                  
                  {isPurnima && (
                    <span className="text-[10px]" title="पूर्णिमा (Full Moon)">🌕</span>
                  )}
                  {isAmavasya && (
                    <span className="text-[10px]" title="औंसी (New Moon)">🌑</span>
                  )}
                  {isEkadashi && (
                    <span className="text-[10px] text-emerald-600 font-bold" title="एकादशी व्रत">🌿</span>
                  )}
                </div>

                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {dayItem.adDate.day}
                </span>
              </div>

              {/* Middle row: Tithi */}
              <div className="mt-1">
                <span
                  className={`text-[10px] sm:text-[11px] block truncate font-medium ${
                    isPurnima || isAmavasya || isEkadashi
                      ? 'text-amber-700 dark:text-amber-400 font-black'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  title={dayItem.tithiNameNepali}
                >
                  {dayItem.tithiNameNepali}
                </span>
              </div>

              {/* Bottom row: Festival and Holiday Badges */}
              <div className="mt-1 space-y-0.5">
                {dayItem.hasFestival && (
                  <div
                    className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 truncate flex items-center gap-1 shadow-2xs border border-amber-200/60 dark:border-amber-800/40"
                    title={dayItem.festivalTitle}
                  >
                    <span className="shrink-0 text-[10px]">🎉</span>
                    <span className="truncate">{dayItem.festivalTitle}</span>
                  </div>
                )}

                {dayItem.hasHoliday && !dayItem.isSaturday && (
                  <div
                    className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-200 truncate flex items-center gap-1 border border-red-200/60 dark:border-red-800/40"
                    title={dayItem.holidayTitle}
                  >
                    <span className="shrink-0 text-[10px]">🚩</span>
                    <span className="truncate">{dayItem.holidayTitle}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
