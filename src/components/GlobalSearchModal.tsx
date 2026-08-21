import React, { useState } from 'react';
import { Search, Calendar, Sparkles, Flag, ArrowRight } from 'lucide-react';
import { BSDate } from '../types';
import { FESTIVAL_RULES } from '../engines/festivalEngine';
import { HOLIDAY_RULES } from '../engines/holidayEngine';
import {
  adToBs,
  NEPALI_MONTHS,
  toNepaliDigits,
} from '../engines/calendarEngine';

interface GlobalSearchModalProps {
  onClose: () => void;
  onSelectDate: (bsDate: BSDate) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  onClose,
  onSelectDate,
}) => {
  const [query, setQuery] = useState('');

  // 1. Check if user typed a date (e.g. 2083-05-15, 2083/5/15, 2026-08-31)
  const isDatePattern = query.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  let parsedDateResult: BSDate | null = null;
  if (isDatePattern) {
    const y = parseInt(isDatePattern[1], 10);
    const m = parseInt(isDatePattern[2], 10);
    const d = parseInt(isDatePattern[3], 10);
    if (y >= 1970 && y <= 2105 && m >= 1 && m <= 12 && d >= 1 && d <= 32) {
      parsedDateResult = { year: y, month: m, day: d };
    } else if (y >= 1913 && y <= 2048 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      parsedDateResult = adToBs({ year: y, month: m, day: d });
    }
  }

  // 2. Filter festivals
  const matchedFestivals = FESTIVAL_RULES.filter(
    (f) =>
      query.trim().length > 1 &&
      (f.nameNepali.toLowerCase().includes(query.toLowerCase()) ||
        f.nameEnglish.toLowerCase().includes(query.toLowerCase()) ||
        f.descriptionNepali.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  // 3. Filter holidays
  const matchedHolidays = HOLIDAY_RULES.filter(
    (h) =>
      query.trim().length > 1 &&
      (h.titleNepali.toLowerCase().includes(query.toLowerCase()) ||
        h.titleEnglish.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-4 sm:p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="मिति वा पर्व खोज्नुहोस् (उदा: 2083-05-15, दशैं, तीज, तिहार)..."
            className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 text-sm font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-80 overflow-y-auto space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {/* Direct Date Match */}
          {parsedDateResult && (
            <div
              onClick={() => {
                onSelectDate(parsedDateResult!);
                onClose();
              }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-red-600 dark:text-rose-400" />
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    वि.सं. {toNepaliDigits(parsedDateResult.year)} {NEPALI_MONTHS.find((m) => m.id === parsedDateResult!.month)?.nameNepali} {toNepaliDigits(parsedDateResult.day)} गते
                  </span>
                  <span className="text-[11px] text-slate-500 block">यो मितिमा जानुहोस् (Jump to this date)</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-red-600" />
            </div>
          )}

          {/* Matched Festivals */}
          {matchedFestivals.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                चाडपर्वहरू (Festivals)
              </span>
              {matchedFestivals.map((fest) => {
                const month = fest.fixedBSMonth || fest.tithiBSMonth || 1;
                const day = fest.fixedBSDay || 1;
                const targetBS: BSDate = {
                  year: 2083,
                  month,
                  day,
                };
                return (
                  <div
                    key={fest.id}
                    onClick={() => {
                      onSelectDate(targetBS);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{fest.nameNepali}</div>
                        <div className="text-[11px] text-slate-400">{fest.descriptionNepali.slice(0, 60)}...</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Matched Holidays */}
          {matchedHolidays.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                सार्वजनिक बिदाहरू (Holidays)
              </span>
              {matchedHolidays.map((hol) => {
                const month = hol.fixedBSMonth || hol.tithiBSMonth || 1;
                const day = hol.fixedBSDay || 1;
                const targetBS: BSDate = {
                  year: 2083,
                  month,
                  day,
                };
                return (
                  <div
                    key={hol.id}
                    onClick={() => {
                      onSelectDate(targetBS);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-red-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{hol.titleNepali}</div>
                        <div className="text-[11px] text-slate-400">{hol.descriptionNepali ? hol.descriptionNepali.slice(0, 60) : hol.titleEnglish}...</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                );
              })}
            </div>
          )}

          {query && !parsedDateResult && matchedFestivals.length === 0 && matchedHolidays.length === 0 && (
            <div className="text-center py-6 text-slate-400">
              कुनै नतिजा फेला परेन। कृपया मिति वा अर्को शब्द खोज्नुहोस्।
            </div>
          )}

          {!query && (
            <div className="py-4 text-center text-slate-400 text-xs">
              कुनै पनि विक्रम संवत् वा ईस्वी संवत् मिति (उदा: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">2083-05-15</span>) वा चाडपर्वको नाम टाइप गर्नुहोस्।
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            बन्द गर्नुहोस् (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
