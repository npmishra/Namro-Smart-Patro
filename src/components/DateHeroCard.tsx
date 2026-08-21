import React from 'react';
import {
  Sunrise,
  Sunset,
  Moon,
  Sun,
  Sparkles,
  CalendarCheck,
  Flag,
  Clock,
  ChevronRight,
  Share2,
  Printer,
  Compass,
} from 'lucide-react';
import { DailyPanchang } from '../types';
import {
  formatADDateEnglish,
  formatBSDateNepali,
  toNepaliDigits,
} from '../engines/calendarEngine';
import { CALCULATION_METHODS } from '../engines/calculationMethods';

interface DateHeroCardProps {
  panchang: DailyPanchang;
  isToday: boolean;
  onJumpToToday?: () => void;
  onOpenPanchangDetail?: () => void;
}

export const DateHeroCard: React.FC<DateHeroCardProps> = ({
  panchang,
  isToday,
  onJumpToToday,
  onOpenPanchangDetail,
}) => {
  const { bsDate, adDate, weekdayNepali, weekdayEnglish, tithi, nakshatra, yoga, karana, rashi, astronomy, samvat, festivals, holidays, calculationMethod, location } = panchang;
  const methodInfo = CALCULATION_METHODS[calculationMethod];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `नाम्रो स्मार्ट पात्रो - ${formatBSDateNepali(bsDate, true)}`,
        text: `आजको मिति: ${formatBSDateNepali(bsDate, true)} (${formatADDateEnglish(adDate)})\nतिथि: ${tithi.nameNepali} (${tithi.pakshaNepali})\nनक्षत्र: ${nakshatra.nameNepali}\nसूर्योदय: ${astronomy.sunrise} | सूर्यास्त: ${astronomy.sunset}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `नाम्रो स्मार्ट पात्रो\n${formatBSDateNepali(bsDate, true)} (${formatADDateEnglish(adDate)})\nतिथि: ${tithi.nameNepali}\nनक्षत्र: ${nakshatra.nameNepali}\nसूर्योदय: ${astronomy.sunrise} | सूर्यास्त: ${astronomy.sunset}`
      );
      alert('पात्रोको विवरण क्लिपबोर्डमा कपी भयो!');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 dark:from-red-950 dark:via-slate-900 dark:to-amber-950 text-white shadow-xl shadow-red-900/10 border border-red-500/20 p-4 sm:p-6 lg:p-7 transition-all">
      {/* Background Decorative Mandala Rings */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none opacity-40 animate-[spin_120s_linear_infinite]" />
      <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full border border-amber-300/15 pointer-events-none opacity-30" />

      {/* Top Bar: Status Badges & Quick Tools */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/15">
        <div className="flex flex-wrap items-center gap-2">
          {isToday ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-extrabold rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              आजको मिति (Today)
            </span>
          ) : (
            <button
              onClick={onJumpToToday}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-full backdrop-blur-xs transition-colors"
            >
              आजमा फर्कनुहोस् (Jump to Today)
            </button>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-black/20 text-white/90 text-xs rounded-full border border-white/10">
            📍 {location.nameNepali.split(' ')[0]} ({toNepaliDigits(location.elevationMeters)}m)
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-black/20 text-amber-200 text-xs rounded-full border border-amber-300/20" title={methodInfo.description}>
            <Compass className="w-3 h-3 text-amber-400" />
            {methodInfo.nameNepali.split(' ')[0]}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
            title="साझेदारी गर्नुहोस् (Share)"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
            title="प्रिन्ट गर्नुहोस् (Print)"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Hero Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* Left Col: Prominent Date and Samvat (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div>
            <div className="text-sm sm:text-base font-semibold text-amber-200 flex items-center gap-2">
              <span>{weekdayNepali} ({weekdayEnglish})</span>
              <span className="text-white/40">•</span>
              <span className="text-white/90">{formatADDateEnglish(adDate)}</span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-xs font-['Mukta',sans-serif]">
                {formatBSDateNepali(bsDate)}
              </h2>
            </div>
          </div>

          {/* 5 Angas Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex flex-col">
              <span className="text-[10px] text-amber-200 font-medium">तिथि (Tithi)</span>
              <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                {tithi.nameNepali}
                {tithi.specialBadge && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-black">
                    {tithi.specialBadge}
                  </span>
                )}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex flex-col">
              <span className="text-[10px] text-amber-200 font-medium">नक्षत्र (Nakshatra)</span>
              <span className="text-xs sm:text-sm font-bold text-white">{nakshatra.nameNepali} ({nakshatra.pada} चरण)</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex flex-col">
              <span className="text-[10px] text-amber-200 font-medium">योग (Yoga)</span>
              <span className="text-xs sm:text-sm font-bold text-white">{yoga.nameNepali}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex flex-col">
              <span className="text-[10px] text-amber-200 font-medium">करण (Karana)</span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {karana.nameNepali}
                {karana.isVishtiBhadra && <span className="text-[10px] text-rose-300 ml-1 font-semibold">(भद्रा)</span>}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex flex-col">
              <span className="text-[10px] text-amber-200 font-medium">चन्द्र / सूर्य राशि</span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {rashi.moonRashiNepali} / {rashi.sunRashiNepali}
              </span>
            </div>
          </div>

          {/* Samvat Era details */}
          <div className="text-xs text-white/80 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 font-medium">
            <span>वि.सं. {toNepaliDigits(samvat.bikramSambhat)}</span>
            <span>•</span>
            <span>नेपाल संवत् {toNepaliDigits(samvat.nepalSambhat)}</span>
            <span>•</span>
            <span>शक संवत् {toNepaliDigits(samvat.shakaSambhat)}</span>
            <span>•</span>
            <span className="text-amber-200 font-semibold">{samvat.ayanamNepali}</span>
            <span>•</span>
            <span className="text-amber-200 font-semibold">{samvat.rituNepali}</span>
          </div>
        </div>

        {/* Right Col: Solar & Lunar Ephemeris Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-black/25 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            {/* Sunrise */}
            <div className="bg-white/10 rounded-lg p-2.5 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/30 flex items-center justify-center shrink-0">
                <Sunrise className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-amber-200 font-medium">सूर्योदय (Sunrise)</div>
                <div className="text-sm font-bold text-white">{astronomy.sunrise}</div>
              </div>
            </div>

            {/* Sunset */}
            <div className="bg-white/10 rounded-lg p-2.5 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/30 flex items-center justify-center shrink-0">
                <Sunset className="w-5 h-5 text-orange-300" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-amber-200 font-medium">सूर्यास्त (Sunset)</div>
                <div className="text-sm font-bold text-white">{astronomy.sunset}</div>
              </div>
            </div>

            {/* Moonrise */}
            <div className="bg-white/10 rounded-lg p-2.5 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/30 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5 text-indigo-200" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-indigo-200 font-medium">चन्द्रोदय (Moonrise)</div>
                <div className="text-sm font-bold text-white">{astronomy.moonrise}</div>
              </div>
            </div>

            {/* Rahu Kaal */}
            <div className="bg-white/10 rounded-lg p-2.5 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-rose-300" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-rose-200 font-medium">राहुकाल (Rahu Kaal)</div>
                <div className="text-xs font-bold text-white truncate max-w-[90px]" title={astronomy.rahuKaal}>
                  {astronomy.rahuKaal.split(' - ')[0]}...
                </div>
              </div>
            </div>
          </div>

          {/* Abhijit Muhurat & Disha Shoola Highlight */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-amber-100">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              अभिजित: <strong className="text-white font-bold">{astronomy.abhijitMuhurat}</strong>
            </span>
            <span className="text-[11px] text-white/70">
              दिशाशूल: {astronomy.dishaShoola.directionNepali}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Banners: Active Festivals and Holidays on this Day */}
      {(festivals.length > 0 || holidays.length > 0) && (
        <div className="mt-4 pt-3 border-t border-white/15 space-y-2">
          {/* Festivals */}
          {festivals.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-200 flex items-center gap-1 shrink-0">
                🎉 आजका पर्व:
              </span>
              {festivals.map((fest) => (
                <span
                  key={fest.id}
                  className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
                >
                  {fest.nameNepali}
                </span>
              ))}
            </div>
          )}

          {/* Holidays */}
          {holidays.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-rose-200 flex items-center gap-1 shrink-0">
                🚩 सार्वजनिक बिदा:
              </span>
              {holidays.map((hol) => (
                <span
                  key={hol.id}
                  className="px-2.5 py-0.5 rounded-full bg-white text-red-700 font-bold text-xs shadow-xs"
                >
                  {hol.titleNepali}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
