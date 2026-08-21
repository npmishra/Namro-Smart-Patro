import React from 'react';
import {
  X,
  Calendar,
  Compass,
  Sunrise,
  Sunset,
  Moon,
  Clock,
  Sparkles,
  ShieldAlert,
  CalendarCheck,
  Share2,
  ChevronLeft,
  ChevronRight,
  Printer,
  Heart,
  Star,
} from 'lucide-react';
import { BSDate, DailyPanchang, PersonalEvent } from '../types';
import {
  formatADDateEnglish,
  formatBSDateNepali,
  toNepaliDigits,
  bsToAd,
} from '../engines/calendarEngine';
import { CALCULATION_METHODS } from '../engines/calculationMethods';

interface DayDetailModalProps {
  panchang: DailyPanchang;
  isToday: boolean;
  onClose: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onAddEvent: (bsDate: BSDate) => void;
  onViewRashifal?: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  panchang,
  isToday,
  onClose,
  onPrevDay,
  onNextDay,
  onAddEvent,
  onViewRashifal,
}) => {
  const {
    bsDate,
    adDate,
    weekdayNepali,
    weekdayEnglish,
    tithi,
    nakshatra,
    yoga,
    karana,
    rashi,
    astronomy,
    samvat,
    festivals,
    holidays,
    calculationMethod,
    location,
  } = panchang;

  const methodInfo = CALCULATION_METHODS[calculationMethod];

  const handleShare = () => {
    const text = `नाम्रो स्मार्ट पात्रो\nमिति: ${formatBSDateNepali(bsDate, true)} (${formatADDateEnglish(adDate)})\nवार: ${weekdayNepali} (${weekdayEnglish})\nतिथि: ${tithi.nameNepali} (${tithi.pakshaNepali})\nनक्षत्र: ${nakshatra.nameNepali}\nसूर्योदय: ${astronomy.sunrise} | सूर्यास्त: ${astronomy.sunset}`;
    if (navigator.share) {
      navigator.share({
        title: `नाम्रो स्मार्ट पात्रो - ${formatBSDateNepali(bsDate, true)}`,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('पात्रोको विवरण क्लिपबोर्डमा कपी भयो!');
    }
  };

  return (
    <div
      id="day-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Top Header with Rich Gradient */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold flex items-center gap-1.5">
                {isToday && <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />}
                {isToday ? 'आजको मिति' : 'दैनिक पञ्चाङ्ग तथा विवरण'}
              </span>
              <span className="text-xs text-rose-100 hidden sm:inline">
                📍 {location.nameNepali.split(' ')[0]} ({toNepaliDigits(location.elevationMeters)}m)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                title="साझेदारी गर्नुहोस् (Share)"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                id="btn-close-day-detail"
                onClick={onClose}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                title="बन्द गर्नुहोस् (Close)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Date Main Headline with Day Prev/Next Controls */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={onPrevDay}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/30 text-white transition-colors"
              title="अघिल्लो दिन (Previous Day)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-center space-y-0.5">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-['Mukta',sans-serif]">
                {formatBSDateNepali(bsDate, true)}
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 font-medium">
                ई.सं. {formatADDateEnglish(adDate)} • {weekdayNepali} ({weekdayEnglish})
              </p>
            </div>

            <button
              onClick={onNextDay}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/30 text-white transition-colors"
              title="पछिल्लो दिन (Next Day)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Festivals or Holidays Alert */}
          {(festivals.length > 0 || holidays.length > 0) && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>चाडपर्व तथा विशेष दिवस:</span>
              </div>
              <div className="space-y-1.5">
                {festivals.map((fest) => (
                  <div key={fest.id} className="text-sm font-bold text-red-700 dark:text-rose-400">
                    ★ {fest.nameNepali} ({fest.nameEnglish})
                  </div>
                ))}
                {holidays.map((hol) => (
                  <div key={hol.id} className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                    🔴 {hol.nameNepali} — {hol.isPublicHoliday ? 'सार्वजनिक बिदा' : 'विशेष पर्व'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5 Angas (पञ्चाङ्ग) Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
              पञ्चाङ्गका पाँच अङ्गहरू (5 Limbs of Panchang)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Tithi */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">१. तिथि</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {tithi.nameNepali}
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  {tithi.pakshaNepali} ({tithi.endTime} सम्म)
                </span>
              </div>

              {/* Vara */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">२. वार</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {weekdayNepali}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {weekdayEnglish}
                </span>
              </div>

              {/* Nakshatra */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">३. नक्षत्र</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {nakshatra.nameNepali}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {nakshatra.endTime} सम्म
                </span>
              </div>

              {/* Yoga */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">४. योग</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {yoga.nameNepali}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {yoga.endTime} सम्म
                </span>
              </div>

              {/* Karana */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">५. करण</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {karana.nameNepali}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {karana.endTime} सम्म
                </span>
              </div>

              {/* Moon Rashi */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">चन्द्र राशि</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {rashi.moonRashiNepali}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  सूर्य: {rashi.sunRashiNepali}
                </span>
              </div>
            </div>
          </div>

          {/* Sun & Moon Times */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
              सूर्य तथा चन्द्र समय (Sun & Moon Timings)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2">
                <Sunrise className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">सूर्योदय</span>
                  <span className="font-bold text-slate-900 dark:text-white">{astronomy.sunrise}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center gap-2">
                <Sunset className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">सूर्यास्त</span>
                  <span className="font-bold text-slate-900 dark:text-white">{astronomy.sunset}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">चन्द्रोदय</span>
                  <span className="font-bold text-slate-900 dark:text-white">{astronomy.moonrise}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 flex items-center gap-2">
                <Moon className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">चन्द्रास्त</span>
                  <span className="font-bold text-slate-900 dark:text-white">{astronomy.moonset}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inauspicious / Auspicious Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-between">
              <span className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                राहु काल (अशुभ):
              </span>
              <span className="font-bold text-red-900 dark:text-red-200 font-mono">
                {astronomy.rahuKaal}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                अभिजित मुहूर्त (शुभ):
              </span>
              <span className="font-bold text-emerald-900 dark:text-emerald-200 font-mono">
                ११:४० - १२:३०
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onViewRashifal && (
              <button
                onClick={onViewRashifal}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-1.5"
              >
                <Star className="w-4 h-4 text-amber-600" />
                <span>आजको राशिफल हेर्नुहोस्</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddEvent(bsDate)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>यस दिनमा घटना थप्नुहोस्</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
