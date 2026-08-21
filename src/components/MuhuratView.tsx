import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Home,
  Briefcase,
  Baby,
  Scroll,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { MuhuratItem } from '../types';
import { MUHURAT_CATEGORIES } from '../engines/muhuratEngine';
import { NEPALI_MONTHS } from '../engines/calendarEngine';

export const MuhuratView: React.FC = () => {
  const [selectedMuhuratId, setSelectedMuhuratId] = useState<string>('vivaha');

  const selectedMuhurat =
    MUHURAT_CATEGORIES.find((m) => m.id === selectedMuhuratId) || MUHURAT_CATEGORIES[0];

  const iconsMap: Record<string, React.ReactNode> = {
    vivaha: <Heart className="w-5 h-5 text-rose-500" />,
    bratabandha: <Scroll className="w-5 h-5 text-amber-500" />,
    pasni: <Baby className="w-5 h-5 text-blue-500" />,
    griha_pravesh: <Home className="w-5 h-5 text-emerald-500" />,
    business_start: <Briefcase className="w-5 h-5 text-purple-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
              शुभ साइत तथा मुहूर्त निर्णय (Auspicious Timings)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
            विवाह, व्रतबन्ध, पास्नी, गृहप्रवेश तथा व्यापार साइतहरू
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            ज्योतिष शास्त्र र मुहूर्त चिन्तामणि ग्रन्थ अनुसार निर्णीत विशुद्ध शुभ साइत
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {MUHURAT_CATEGORIES.map((m) => {
          const isSelected = selectedMuhuratId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMuhuratId(m.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                isSelected
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                {iconsMap[m.id] || <Sparkles className="w-5 h-5 text-amber-500" />}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-sm text-slate-900 dark:text-white truncate font-['Mukta',sans-serif]">
                  {m.titleNepali.split(' ')[0]} {m.titleNepali.split(' ')[1]}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{m.titleEnglish.split(' ')[0]}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Muhurat Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {/* Title and Intro */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              {iconsMap[selectedMuhurat.id]}
            </span>
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                {selectedMuhurat.titleNepali}
              </h4>
              <p className="text-xs text-slate-400 font-medium">{selectedMuhurat.titleEnglish}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            {selectedMuhurat.descriptionNepali}
          </p>
        </div>

        {/* Requirements & Ideal Combinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Suitable Months */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              उत्तम महिनाहरू:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedMuhurat.suitableMonths.map((mNum) => {
                const mInfo = NEPALI_MONTHS.find((m) => m.id === mNum);
                return (
                  <span
                    key={mNum}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-600"
                  >
                    {mInfo?.nameNepali}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Ideal Nakshatras */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              शुभ नक्षत्रहरू:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedMuhurat.idealNakshatras.map((n) => (
                <span
                  key={n}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Forbidden Conditions */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
            <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              वर्जित तथा त्याज्य दोष:
            </span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              {selectedMuhurat.forbiddenConditions.map((cond, idx) => (
                <li key={idx} className="flex items-center gap-1">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{cond}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming Dates in 2083 BS */}
        <div className="space-y-3 pt-2">
          <h5 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            २०८३ का आगामी मुख्य शुभ साइतहरू (Upcoming Auspicious Dates)
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {selectedMuhurat.nextDatesBS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-amber-400 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-amber-700 dark:text-amber-400 font-['Mukta',sans-serif]">
                    {item.bsDate}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">({item.adDate})</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>साइत समय: {item.timing}</span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  विशेषता: {item.remarks}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
