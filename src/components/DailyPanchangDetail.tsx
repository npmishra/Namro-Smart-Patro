import React from 'react';
import {
  Compass,
  Sunrise,
  Sunset,
  Moon,
  Clock,
  Sparkles,
  ShieldAlert,
  CalendarCheck,
  CheckCircle,
  HelpCircle,
  Share2,
  Printer,
  ChevronRight,
  Info,
} from 'lucide-react';
import { DailyPanchang } from '../types';
import {
  formatADDateEnglish,
  formatBSDateNepali,
  toNepaliDigits,
} from '../engines/calendarEngine';
import { CALCULATION_METHODS } from '../engines/calculationMethods';

interface DailyPanchangDetailProps {
  panchang: DailyPanchang;
  onAddEvent?: () => void;
}

export const DailyPanchangDetail: React.FC<DailyPanchangDetailProps> = ({
  panchang,
  onAddEvent,
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
    positions,
    samvat,
    sankranti,
    festivals,
    holidays,
    calculationMethod,
    location,
  } = panchang;

  const methodInfo = CALCULATION_METHODS[calculationMethod];

  return (
    <div className="space-y-6">
      {/* Header Bar of the Detail Pane */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300">
              दैनिक विस्तृत पञ्चाङ्ग (Daily Panchang)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {location.nameNepali} ({toNepaliDigits(location.elevationMeters)}m)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
            {formatBSDateNepali(bsDate, true)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            ई.सं. {formatADDateEnglish(adDate)} • {weekdayNepali} ({weekdayEnglish})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onAddEvent && (
            <button
              onClick={onAddEvent}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>घटना थप्नुहोस् (Add Event)</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Angas (पञ्च अङ्ग) Complete Breakdown Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            पञ्चाङ्गका मुख्य पाँच अङ्ग (The 5 Limbs)
          </h4>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {methodInfo.nameNepali} अनुसार
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* 1. Tithi */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              १. तिथि (Tithi)
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{tithi.nameNepali}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold">
                {tithi.pakshaNepali}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>समाप्ति समय:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{tithi.endTime} सम्म</span>
            </div>
          </div>

          {/* 2. Vara (Day) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              २. वार (Day / Vara)
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{weekdayNepali}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {weekdayEnglish}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>स्वामिनी:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {weekdayNepali.replace('वार', '')} ग्रह
              </span>
            </div>
          </div>

          {/* 3. Nakshatra */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              ३. नक्षत्र (Nakshatra)
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{nakshatra.nameNepali}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold">
                चरण {toNepaliDigits(nakshatra.pada)}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>समाप्ति:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{nakshatra.endTime} (स्वामी: {nakshatra.rulerNepali})</span>
            </div>
          </div>

          {/* 4. Yoga */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              ४. योग (Yoga)
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {yoga.nameNepali} ({yoga.nameEnglish})
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>समाप्ति समय:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{yoga.endTime} सम्म</span>
            </div>
          </div>

          {/* 5. Karana */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              ५. करण (Karana)
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{karana.nameNepali}</span>
              {karana.isVishtiBhadra ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold">
                  भद्रा (अशुभ)
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">
                  शुभ करण
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>समाप्ति समय:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{karana.endTime} सम्म</span>
            </div>
          </div>

          {/* 6. Rashi & Planetary Placement */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              राशि (Sun & Moon Signs)
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>चन्द्र: {rashi.moonRashiNepali}</span>
              <span>सूर्य: {rashi.sunRashiNepali}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>अयनांश:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{positions.ayanamsaDeg}° (लाहिरी)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auspicious & Inauspicious Muhurats Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auspicious Timings (शुभ मुहूर्त तथा बेला) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            शुभ मुहूर्त तथा पवित्र समय (Auspicious Timings)
          </h4>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">अभिजित मुहूर्त:</span>
              <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{astronomy.abhijitMuhurat}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">अमृत काल (Amrit Kaal):</span>
              <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{astronomy.amritKaal}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">ब्रह्म मुहूर्त:</span>
              <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{astronomy.brahmaMuhurat}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">गोधूलि मुहूर्त:</span>
              <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{astronomy.godhuliMuhurat}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">विजय मुहूर्त:</span>
              <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{astronomy.vijayaMuhurat}</span>
            </div>
          </div>
        </div>

        {/* Inauspicious Timings (अशुभ समय तथा दोष) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h4 className="text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            वर्जित तथा अशुभ समय (Inauspicious Timings)
          </h4>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50">
              <span className="font-bold text-rose-950 dark:text-rose-200">राहुकाल (Rahu Kaal):</span>
              <span className="font-extrabold text-rose-800 dark:text-rose-300">{astronomy.rahuKaal}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50">
              <span className="font-bold text-rose-950 dark:text-rose-200">यमगण्ड (Yamaganda):</span>
              <span className="font-extrabold text-rose-800 dark:text-rose-300">{astronomy.yamaganda}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50">
              <span className="font-bold text-rose-950 dark:text-rose-200">गुलिक काल (Gulika):</span>
              <span className="font-extrabold text-rose-800 dark:text-rose-300">{astronomy.gulikaKaal}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50">
              <span className="font-bold text-rose-950 dark:text-rose-200">दुर्मुहूर्त:</span>
              <span className="font-extrabold text-rose-800 dark:text-rose-300">{astronomy.durmuhurat}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50">
              <span className="font-bold text-rose-950 dark:text-rose-200">दिशाशूल (Disha Shoola):</span>
              <span className="font-extrabold text-rose-800 dark:text-rose-300">
                {astronomy.dishaShoola.directionNepali} ({astronomy.dishaShoola.remedyNepali})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Samvat and Astronomy Scientific Parameters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Info className="w-4 h-4 text-slate-500" />
          खगोलीय तथा युग संवत् विवरण (Astronomical & Samvat Reference)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px]">विक्रम संवत्</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{toNepaliDigits(samvat.bikramSambhat)}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px]">शक संवत्</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{toNepaliDigits(samvat.shakaSambhat)}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px]">नेपाल संवत्</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{toNepaliDigits(samvat.nepalSambhat)}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px]">कलि संवत्</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{toNepaliDigits(samvat.kaliYugaYear)}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px]">सूर्य अयन</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{samvat.ayanamNepali}</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px]">ऋतु</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{samvat.rituNepali}</span>
          </div>
        </div>

        {/* Calculation method info banner */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
          <Compass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>गणना पद्धति: {methodInfo.nameNepali} ({methodInfo.nameEnglish})</strong>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
              {methodInfo.description} (शुद्ध अयनांश: {positions.ayanamsaDeg}°, सूर्य देशान्तर: {positions.sunLongitude.toFixed(2)}°, चन्द्र देशान्तर: {positions.moonLongitude.toFixed(2)}°)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
