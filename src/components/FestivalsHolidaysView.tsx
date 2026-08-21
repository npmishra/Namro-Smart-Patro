import React, { useState } from 'react';
import {
  Sparkles,
  Flag,
  Search,
  Filter,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { BSDate } from '../types';
import { FESTIVAL_RULES, FestivalRule } from '../engines/festivalEngine';
import { HOLIDAY_RULES, HolidayRule } from '../engines/holidayEngine';
import { NEPALI_MONTHS, toNepaliDigits } from '../engines/calendarEngine';

interface FestivalsHolidaysViewProps {
  onJumpToDate?: (bsDate: BSDate) => void;
}

export const FestivalsHolidaysView: React.FC<FestivalsHolidaysViewProps> = ({
  onJumpToDate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'festivals' | 'holidays'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFestivalModal, setSelectedFestivalModal] = useState<FestivalRule | null>(null);

  // Filter festivals
  const filteredFestivals = FESTIVAL_RULES.filter((f) => {
    const matchesMonth =
      selectedMonth === 'all' ||
      f.fixedBSMonth === selectedMonth ||
      f.tithiBSMonth === selectedMonth;

    const matchesCategory =
      selectedCategory === 'all' || f.category === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      f.nameNepali.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.descriptionNepali.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMonth && matchesCategory && matchesSearch;
  });

  // Filter holidays
  const filteredHolidays = HOLIDAY_RULES.filter((h) => {
    const matchesMonth =
      selectedMonth === 'all' || h.fixedBSMonth === selectedMonth || h.tithiBSMonth === selectedMonth;

    const matchesSearch =
      !searchQuery ||
      h.titleNepali.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.descriptionNepali && h.descriptionNepali.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMonth && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'सबै वर्ग' },
    { id: 'national', label: 'राष्ट्रिय पर्व' },
    { id: 'religious', label: 'धार्मिक पर्व' },
    { id: 'cultural', label: 'सांस्कृतिक पर्व' },
    { id: 'vrata', label: 'व्रत / एकादशी' },
    { id: 'jayanti', label: 'जयन्ती' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
              चाडपर्व तथा सार्वजनिक बिदा (Festivals & Holidays)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
            नेपाली चाडपर्व, जात्रा तथा राष्ट्रिय बिदाहरू
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            वैदिक तिथि नियम तथा राष्ट्रिय पात्रोका सम्पूर्ण चाडपर्व तथा बिदाहरूको विस्तृत तालिका
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            सबै ({filteredFestivals.length + filteredHolidays.length})
          </button>
          <button
            onClick={() => setActiveSubTab('festivals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'festivals'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            चाडपर्व ({filteredFestivals.length})
          </button>
          <button
            onClick={() => setActiveSubTab('holidays')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'holidays'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            सरकारी बिदा ({filteredHolidays.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="चाडपर्व वा बिदा खोज्नुहोस् (e.g. दशैं, तीज, ल्होसार)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Month Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))
              }
              aria-label="महिना अनुसार फिल्टर गर्नुहोस् (Filter by Month)"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-red-500 font-['Mukta',sans-serif]"
            >
              <option value="all">सबै महिना (All Months)</option>
              {NEPALI_MONTHS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nameNepali} ({m.nameEnglish})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="वर्ग अनुसार फिल्टर गर्नुहोस् (Filter by Category)"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-red-500 font-['Mukta',sans-serif]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Festivals Grid */}
      {(activeSubTab === 'all' || activeSubTab === 'festivals') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              प्रमुख चाडपर्वहरू ({filteredFestivals.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFestivals.map((fest) => {
              const monthNum = fest.fixedBSMonth || fest.tithiBSMonth;
              const monthName = monthNum
                ? NEPALI_MONTHS.find((m) => m.id === monthNum)?.nameNepali
                : '';

              return (
                <div
                  key={fest.id}
                  onClick={() => setSelectedFestivalModal(fest)}
                  className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h5 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-['Mukta',sans-serif]">
                        {fest.nameNepali}
                      </h5>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold shrink-0">
                        {fest.isMajor ? 'प्रमुख पर्व' : 'पर्व'}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
                      {monthName} {fest.fixedBSDay ? `${toNepaliDigits(fest.fixedBSDay)} गते` : ''}
                      {fest.tithiNumberInPaksha ? ` (तिथि: ${toNepaliDigits(fest.tithiNumberInPaksha)})` : ''}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {fest.descriptionNepali}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] font-medium">{fest.nameEnglish}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                      विवरण <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Holidays Grid */}
      {(activeSubTab === 'all' || activeSubTab === 'holidays') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-500" />
              सार्वजनिक बिदाहरू ({filteredHolidays.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHolidays.map((hol) => {
              const monthNum = hol.fixedBSMonth || hol.tithiBSMonth;
              const monthName = monthNum
                ? NEPALI_MONTHS.find((m) => m.id === monthNum)?.nameNepali
                : '';

              return (
                <div
                  key={hol.id}
                  className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h5 className="font-bold text-base text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                        {hol.titleNepali}
                      </h5>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 font-bold shrink-0">
                        {hol.typeNepali}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-red-600 dark:text-rose-400 mb-2">
                      {monthName} {hol.fixedBSDay ? `${toNepaliDigits(hol.fixedBSDay)} गते` : ''}
                    </div>

                    {hol.descriptionNepali && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {hol.descriptionNepali}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] font-medium">{hol.titleEnglish}</span>
                    <span className="text-red-600 dark:text-rose-400 font-semibold">
                      {hol.isGazetted ? 'राजपत्र मान्यता प्राप्त' : 'स्थानीय'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Festival Detail Modal */}
      {selectedFestivalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  पर्वको परिचय र शास्त्रोक्त विधि
                </span>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
                  {selectedFestivalModal.nameNepali}
                </h4>
                <p className="text-xs text-slate-400">{selectedFestivalModal.nameEnglish}</p>
              </div>
              <button
                onClick={() => setSelectedFestivalModal(null)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">पर्व वर्ग:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedFestivalModal.categoryNepali}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">महत्त्व:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedFestivalModal.isMajor ? 'अत्यन्त महत्त्वपूर्ण (प्रमुख पर्व)' : 'नियमित वैदिक पर्व'}
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                विस्तृत विवरण तथा धार्मिक मान्यता:
              </h5>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedFestivalModal.descriptionNepali}
              </p>
            </div>

            {selectedFestivalModal.ritualsNepali && (
              <div>
                <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                  पूजन तथा परम्परागत विधि:
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedFestivalModal.ritualsNepali}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedFestivalModal(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              >
                बन्द गर्नुहोस् (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
