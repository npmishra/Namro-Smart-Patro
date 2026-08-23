import React, { useState } from 'react';
import {
  Star,
  Coins,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { DailyPanchang, BSDate, AdminVisibilityConfig } from '../types';
import { RASHI_DATA, getDailyForecastForRashi } from '../engines/rashifalEngine';
import { BULLION_RATES, FOREX_RATES } from '../engines/forexBullionEngine';
import { toNepaliDigits, formatBSDateNepali } from '../engines/calendarEngine';
import { getAllUpcomingFestivals } from '../engines/festivalEngine';

interface HomeDashboardWidgetsProps {
  panchang: DailyPanchang;
  onOpenRashifal: () => void;
  onOpenForex: () => void;
  onOpenMuhurat: () => void;
  onOpenFestivals: () => void;
  onJumpToDate?: (date: BSDate) => void;
  adminConfig?: AdminVisibilityConfig;
}

export const HomeDashboardWidgets: React.FC<HomeDashboardWidgetsProps> = ({
  panchang,
  onOpenRashifal,
  onOpenForex,
  onOpenMuhurat,
  onOpenFestivals,
  onJumpToDate,
  adminConfig,
}) => {
  const [selectedRashiId, setSelectedRashiId] = useState<string>('aries');
  const selectedForecast = getDailyForecastForRashi(selectedRashiId, panchang.bsDate);

  const fineGold = BULLION_RATES.find((b) => b.id === 'fine_gold') || BULLION_RATES[0];
  const silver = BULLION_RATES.find((b) => b.id === 'silver') || BULLION_RATES[2];
  const topCurrencies = FOREX_RATES.slice(0, 4);
  const upcomingFestivals = getAllUpcomingFestivals(panchang.bsDate, 4);

  const showRashifal = adminConfig ? adminConfig.showRashifalWidget : true;
  const showForex = adminConfig ? adminConfig.showForexSummaryWidget : true;
  const showFestivals = adminConfig ? adminConfig.showUpcomingFestivalsWidget : true;

  if (!showRashifal && !showForex && !showFestivals) {
    return null;
  }

  const activeWidgetCount = [showRashifal, showForex, showFestivals].filter(Boolean).length;
  const gridColsClass =
    activeWidgetCount === 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : activeWidgetCount === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 max-w-2xl mx-auto';

  return (
    <div className={`grid ${gridColsClass} gap-5 font-['Mukta',sans-serif]`}>
      {/* 1. Daily Horoscope (आजको राशिफल) Widget */}
      {showRashifal && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
                  <Star className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    आजको राशिफल (Horoscope)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {formatBSDateNepali(panchang.bsDate, false)} को भविष्यफल
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenRashifal}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5"
              >
                सबै १२ राशि <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rashi Selector Pill Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
              {RASHI_DATA.map((r) => {
                const isSelected = r.id === selectedRashiId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRashiId(r.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{r.symbol}</span>
                    <span>{r.nameNepali}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Rashi Summary */}
            <div className="bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl p-3.5 border border-purple-100 dark:border-purple-900/40 space-y-2 mt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedForecast.symbol}</span>
                  <span className="text-base font-black text-purple-950 dark:text-purple-200">
                    {selectedForecast.nameNepali} ({selectedForecast.nameEnglish})
                  </span>
                </div>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: selectedForecast.ratingStars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                {selectedForecast.forecastNepali}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-purple-200/60 dark:border-purple-800/40 text-[11px]">
                <div>
                  <span className="text-slate-400">शुभ अंक:</span>{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {toNepaliDigits(selectedForecast.luckyNumber)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">शुभ रङ्ग:</span>{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedForecast.luckyColorNepali.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenRashifal}
            className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-xl transition-colors text-center"
          >
            विस्तृत राशिफल तथा वार्षिक भविष्यफल पढ्नुहोस् →
          </button>
        </div>
      )}

      {/* 2. Live Bullion & Forex Snapshot (सुनचाँदी तथा विदेशी मुद्रा) */}
      {showForex && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
                  <Coins className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    सुनचाँदी तथा विदेशी मुद्रा
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    नेपाल सुनचाँदी महासंघ तथा राष्ट्र बैंक दर
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenForex}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
              >
                सम्पूर्ण दर <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bullion Row */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300">
                  छापावाल सुन (तोला)
                </div>
                <div className="text-sm font-black text-amber-950 dark:text-amber-100 mt-0.5">
                  रु. {toNepaliDigits(fineGold.ratePerTolaNPR.toLocaleString('en-IN'))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  चाँदी प्रति तोला
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100 mt-0.5">
                  रु. {toNepaliDigits(silver.ratePerTolaNPR.toLocaleString('en-IN'))}
                </div>
              </div>
            </div>

            {/* Mini Forex Table */}
            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {topCurrencies.map((c) => (
                <div key={c.currencyCode} className="py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-slate-900 dark:text-white">
                      {c.currencyCode}
                    </span>
                    <span className="text-[11px] text-slate-400">{c.currencyNameNepali.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">खरिद: {toNepaliDigits(c.buyRateNPR.toFixed(2))}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      रु. {toNepaliDigits(c.sellRateNPR.toFixed(2))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenForex}
            className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-xl transition-colors text-center"
          >
            मुद्रा क्यालकुलेटर तथा ऐतिहासिक दरहरू हेर्नुहोस् →
          </button>
        </div>
      )}

      {/* 3. Upcoming Festivals & Subha Muhurat Snapshot */}
      {showFestivals && (
        <div className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 ${activeWidgetCount === 3 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    आसन्न मुख्य चाडपर्वहरू
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    नजिकिँदै गरेका नेपाली चाडपर्वहरू
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenFestivals}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5"
              >
                सबै चाडपर्व <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {upcomingFestivals.map((fest, idx) => (
                <div
                  key={idx}
                  onClick={() => onJumpToDate && onJumpToDate(fest.bsDate)}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                >
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {fest.nameNepali}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatBSDateNepali(fest.bsDate, false)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black ${
                        fest.daysRemaining === 0
                          ? 'bg-red-600 text-white animate-bounce'
                          : fest.daysRemaining <= 7
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {fest.daysRemaining === 0
                        ? 'आज !'
                        : `${toNepaliDigits(fest.daysRemaining)} दिन बाँकी`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onOpenMuhurat}
              className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl transition-colors text-center"
            >
              शुभ साइत / मुहूर्त →
            </button>
            <button
              onClick={onOpenFestivals}
              className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors text-center shadow-xs"
            >
              वार्षिक बिदा सूची →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
