import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Compass,
  Heart,
  Briefcase,
  Activity,
  Award,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { BSDate } from '../types';
import { getDailyRashifal, RashiDailyForecast } from '../engines/rashifalEngine';
import { toNepaliDigits } from '../engines/calendarEngine';

interface RashifalViewProps {
  currentBSDate: BSDate;
}

export const RashifalView: React.FC<RashifalViewProps> = ({ currentBSDate }) => {
  const allRashis = getDailyRashifal(currentBSDate);
  const [selectedRashiId, setSelectedRashiId] = useState<string>('aries');
  const [nameLetterSearch, setNameLetterSearch] = useState('');

  const selectedRashi = allRashis.find((r) => r.id === selectedRashiId) || allRashis[0];

  // Rashi naming letters mapping (नेपाली नामाक्षर)
  const rashiLettersMap: Record<string, string> = {
    aries: 'चु, चे, चो, ला, ली, लू, ले, लो, अ',
    taurus: 'ई, ऊ, ए, ओ, वा, वी, वू, वे, वो',
    gemini: 'का, की, कू, घ, ङ, छ, के, को, हा',
    cancer: 'ही, हू, हे, हो, डा, डी, डू, डे, डो',
    leo: 'मा, मी, मू, मे, मो, टा, टी, टू, टे',
    virgo: 'टो, पा, पी, पू, ष, ण, ठ, पे, पो',
    libra: 'रा, री, रू, रे, रो, ता, ती, तू, ते',
    scorpio: 'तो, ना, नी, नू, ने, नो, या, यी, यू',
    sagittarius: 'ये, यो, भा, भी, भू, धा, फा, ढा, भे',
    capricorn: 'भो, जा, जी, खी, खू, खे, खो, गा, गी',
    aquarius: 'गू, गे, गो, सा, सी, सू, से, सो, दा',
    pisces: 'दी, दू, थ, झ, ञ, दे, दो, चा, ची',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
              दैनिक १२ राशि फल (Daily Horoscope & Astrological Insights)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
            आजको राशिफल तथा ग्रहगोचर विश्लेषण
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            वैदिक ज्योतिष शास्त्र अनुसार १२ राशिका जातकहरूको समग्र भविष्य, स्वास्थ्य, व्यापार र प्रेम राशिफल
          </p>
        </div>
      </div>

      {/* Rashi Selector Horizontal / Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
        {allRashis.map((r) => {
          const isSelected = r.id === selectedRashiId;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRashiId(r.id)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-105 z-10'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
              }`}
            >
              <span className="text-2xl">{r.symbol}</span>
              <span className="font-bold text-sm font-['Mukta',sans-serif] leading-tight">
                {r.nameNepali}
              </span>
              <span
                className={`text-[10px] ${
                  isSelected ? 'text-amber-100' : 'text-slate-400'
                }`}
              >
                {r.nameEnglish}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Selected Rashi Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {/* Top Header of Rashi */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl font-bold shadow-xs">
              {selectedRashi.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                  {selectedRashi.nameNepali} राशि ({selectedRashi.nameEnglish})
                </h4>
                <div className="flex items-center text-amber-500 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < selectedRashi.ratingStars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                नामाक्षर: <strong>{rashiLettersMap[selectedRashi.id]}</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              तत्त्व: <strong>{selectedRashi.elementNepali}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              स्वामी: <strong>{selectedRashi.rulerPlanetNepali}</strong>
            </div>
          </div>
        </div>

        {/* General Forecast */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block mb-1">
            आजको समग्र राशिफल (Overall Daily Prediction)
          </span>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {selectedRashi.forecastNepali}
          </p>
        </div>

        {/* 3 Aspects Grid: Health, Finance, Love */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Health */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
              <Activity className="w-4 h-4 text-emerald-500" />
              स्वास्थ्य तथा ऊर्जा (Health)
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedRashi.healthForecastNepali}
            </p>
          </div>

          {/* Finance */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 text-sm">
              <Briefcase className="w-4 h-4 text-blue-500" />
              व्यापार तथा धनलाभ (Finance)
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedRashi.financeForecastNepali}
            </p>
          </div>

          {/* Love & Family */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 text-sm">
              <Heart className="w-4 h-4 text-rose-500" />
              प्रेम तथा पारिवारिक सम्बन्ध (Love)
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedRashi.loveForecastNepali}
            </p>
          </div>
        </div>

        {/* Lucky Indicators Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-slate-400 block text-[11px]">शुभ अंक (Lucky Number)</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-lg">
              {toNepaliDigits(selectedRashi.luckyNumber)} ({selectedRashi.luckyNumber})
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-slate-400 block text-[11px]">शुभ रङ्ग (Lucky Color)</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-center gap-1.5 mt-0.5">
              <span
                className="w-3 h-3 rounded-full inline-block shrink-0"
                style={{ backgroundColor: selectedRashi.luckyColorHex }}
              />
              {selectedRashi.luckyColorNepali}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-slate-400 block text-[11px]">शुभ दिशा (Lucky Direction)</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
              {selectedRashi.luckyDirectionNepali}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-slate-400 block text-[11px]">भाग्य प्रतिशत (Luck Rating)</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400 text-lg">
              {toNepaliDigits(selectedRashi.ratingStars * 20)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
