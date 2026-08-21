import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { BSDate, LocationData } from '../types';
import {
  bsToAd,
  getDaysInBSMonth,
  getDaysInBSYear,
  getWeekday,
  NEPALI_MONTHS,
  NEPALI_WEEKDAYS,
  toNepaliDigits,
} from '../engines/calendarEngine';

interface YearCalendarViewProps {
  year: number;
  onSelectMonth: (month: number) => void;
  onSelectDate?: (date: BSDate) => void;
  onChangeYear: (year: number) => void;
  onClose: () => void;
  location: LocationData;
}

export const YearCalendarView: React.FC<YearCalendarViewProps> = ({
  year,
  onSelectMonth,
  onSelectDate,
  onChangeYear,
  onClose,
}) => {
  const totalDaysInYear = getDaysInBSYear(year);

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

  return (
    <div className="space-y-6">
      {/* Year Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChangeYear(year - 1)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="अघिल्लो वर्ष"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Mukta',sans-serif]">
              वि.सं. {toNepaliDigits(year)} को वार्षिक पात्रो
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Year {year} BS ({year - 57} - {year - 56} AD) • जम्मा {toNepaliDigits(totalDaysInYear)} दिन
            </p>
          </div>

          <button
            onClick={() => onChangeYear(year + 1)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="पछिल्लो वर्ष"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          महिना दृश्यमा फर्कनुहोस् (Back to Month)
        </button>
      </div>

      {/* 12 Months Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {NEPALI_MONTHS.map((m) => {
          const daysInMonth = getDaysInBSMonth(year, m.id);
          const firstAD = bsToAd({ year, month: m.id, day: 1 });
          const lastAD = bsToAd({ year, month: m.id, day: daysInMonth });
          const firstWeekday = getWeekday(firstAD);

          const adRange = `${firstAD.day} ${adMonthsEnglish[firstAD.month]} - ${lastAD.day} ${adMonthsEnglish[lastAD.month]}`;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMonth(m.id)}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-red-400 dark:hover:border-rose-600 cursor-pointer transition-all hover:shadow-md group flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors font-['Mukta',sans-serif]">
                    {m.nameNepali} ({m.nameEnglish})
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {adRange} • {toNepaliDigits(daysInMonth)} दिन
                  </span>
                </div>
                <span className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 group-hover:bg-red-50 dark:group-hover:bg-red-950/50 group-hover:text-red-600 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Mini Weekday Row */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">
                {['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'].map((w, idx) => (
                  <div key={idx} className={idx === 6 ? 'text-red-500 font-bold' : ''}>
                    {w}
                  </div>
                ))}
              </div>

              {/* Mini Days Grid */}
              <div className="grid grid-cols-7 gap-0.5 text-center text-[11px]">
                {/* Empty cells */}
                {Array.from({ length: firstWeekday }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-6" />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dayWeekday = (firstWeekday + idx) % 7;
                  const isSat = dayWeekday === 6;

                  return (
                    <div
                      key={dayNum}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectDate) {
                          onSelectDate({ year, month: m.id, day: dayNum });
                        } else {
                          onSelectMonth(m.id);
                        }
                      }}
                      className={`h-6 flex items-center justify-center rounded-md font-medium transition-colors hover:bg-red-100 dark:hover:bg-red-950/60 hover:text-red-600 ${
                        isSat
                          ? 'text-red-600 dark:text-red-400 font-bold bg-red-50/40 dark:bg-red-950/20'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {toNepaliDigits(dayNum)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
