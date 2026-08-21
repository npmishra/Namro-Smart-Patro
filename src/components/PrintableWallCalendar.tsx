import React from 'react';
import { Printer, ArrowLeft, Download, Sparkles } from 'lucide-react';
import { BSDate, LocationData } from '../types';
import {
  formatBSDateNepali,
  getDaysInBSMonth,
  NEPALI_MONTHS,
  toNepaliDigits,
} from '../engines/calendarEngine';
import { getMonthlyCalendarDays } from '../engines/panchangEngine';

interface PrintableWallCalendarProps {
  year: number;
  month: number;
  location: LocationData;
  onClose: () => void;
}

export const PrintableWallCalendar: React.FC<PrintableWallCalendarProps> = ({
  year,
  month,
  location,
  onClose,
}) => {
  const days = getMonthlyCalendarDays(year, month, location, 'drik');
  const monthInfo = NEPALI_MONTHS.find((m) => m.id === month) || NEPALI_MONTHS[0];

  const handlePrint = () => {
    window.print();
  };

  const weekdaysNepali = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden in print) */}
      <div className="print:hidden bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <button
          onClick={onClose}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>पात्रोमा फर्कनुहोस् (Back to Calendar)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>भित्ते पात्रो प्रिन्ट गर्नुहोस् (Print Wall Calendar)</span>
          </button>
        </div>
      </div>

      {/* Wall Calendar Printable Canvas */}
      <div className="bg-white text-slate-950 p-6 sm:p-8 rounded-3xl border-2 border-red-800 shadow-xl max-w-5xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 font-['Mukta',sans-serif]">
        {/* Traditional Header */}
        <div className="border-b-2 border-red-800 pb-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-red-700 font-bold text-xs">
            <span>ॐ श्री गणेशाय नमः</span>
            <span>•</span>
            <span>नाम्रो स्मार्ट पात्रो (भित्ते संस्करण)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-red-800 tracking-wide">
            वि.सं. {toNepaliDigits(year)} साल {monthInfo.nameNepali} महिना
          </h1>
          <div className="text-sm font-semibold text-slate-600 flex items-center justify-center gap-3">
            <span>{monthInfo.nameEnglish} ({monthInfo.gregorianMapping})</span>
            <span>•</span>
            <span>ऋतु: {monthInfo.seasonNepali}</span>
            <span>•</span>
            <span>स्थान: {location.nameNepali}</span>
          </div>
        </div>

        {/* 7 Column Weekday Grid */}
        <div className="grid grid-cols-7 border-b-2 border-red-800 mt-4 text-center font-bold text-sm bg-red-50">
          {weekdaysNepali.map((w, idx) => (
            <div
              key={w}
              className={`py-2 border-r border-red-200 last:border-r-0 ${
                idx === 6 ? 'text-red-700 font-black' : 'text-slate-800'
              }`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 border-l border-t border-slate-300">
          {days.map((d, index) => {
            const isSaturday = d.panchang.dayOfWeek === 6;
            const isHoliday = d.isHoliday;

            return (
              <div
                key={index}
                className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 border-r border-b border-slate-300 flex flex-col justify-between ${
                  !d.isCurrentMonth
                    ? 'bg-slate-50 opacity-40'
                    : isSaturday || isHoliday
                    ? 'bg-red-50/40'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-xl sm:text-2xl font-black ${
                      isSaturday || isHoliday ? 'text-red-600' : 'text-slate-900'
                    }`}
                  >
                    {toNepaliDigits(d.bsDate.day)}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">
                    {d.adDate.day}
                  </span>
                </div>

                <div className="space-y-0.5 mt-1">
                  <div className="text-[11px] font-semibold text-amber-900 leading-tight truncate">
                    {d.panchang.tithi.nameNepali}
                  </div>

                  {d.festivals.length > 0 && (
                    <div className="text-[10px] font-bold text-red-700 leading-tight line-clamp-2">
                      ★ {d.festivals[0].nameNepali}
                    </div>
                  )}

                  {d.holidayName && !d.festivals.length && (
                    <div className="text-[10px] font-bold text-rose-700 leading-tight line-clamp-2">
                      {d.holidayName}
                    </div>
                  )}
                </div>

                <div className="text-[9px] text-slate-400 text-right">
                  सूर्योदय: {d.panchang.sunTimes.sunrise.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Monthly Notes & Major Holidays Summary */}
        <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-900 block mb-1">
              यस महिनाका मुख्य चाडपर्वहरू:
            </span>
            <ul className="space-y-0.5 text-[11px]">
              {days
                .filter((d) => d.festivals.length > 0)
                .slice(0, 5)
                .map((d, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="text-red-600 font-bold">{toNepaliDigits(d.bsDate.day)} गते:</span>
                    <span>{d.festivals[0].nameNepali}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <span className="font-bold text-slate-900 block mb-1">
              सार्वजनिक बिदा विवरण:
            </span>
            <ul className="space-y-0.5 text-[11px]">
              {days
                .filter((d) => d.isHoliday && d.holidayName)
                .slice(0, 5)
                .map((d, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="text-rose-600 font-bold">{toNepaliDigits(d.bsDate.day)} गते:</span>
                    <span>{d.holidayName}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
