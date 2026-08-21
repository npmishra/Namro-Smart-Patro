import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Calendar,
  Clock,
  Copy,
  Check,
  Sparkles,
  Calculator,
  Hourglass,
  Cake,
} from 'lucide-react';
import { ADDate, BSDate } from '../types';
import {
  adToBs,
  bsToAd,
  formatBSDateNepali,
  getDaysInBSMonth,
  NEPALI_MONTHS,
  toNepaliDigits,
} from '../engines/calendarEngine';
import { calculateBSDateDifference, calculateADDateDifference } from '../engines/dateConverterEngine';

export const DateConverterView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bs_to_ad' | 'ad_to_bs' | 'age_calc'>('bs_to_ad');

  // BS to AD State
  const [bsYear, setBsYear] = useState<number>(2083);
  const [bsMonth, setBsMonth] = useState<number>(5);
  const [bsDay, setBsDay] = useState<number>(15);

  // AD to BS State
  const [adYear, setAdYear] = useState<number>(2026);
  const [adMonth, setAdMonth] = useState<number>(8);
  const [adDay, setAdDay] = useState<number>(31);

  // Age Calc State
  const [birthYear, setBirthYear] = useState<number>(2055);
  const [birthMonth, setBirthMonth] = useState<number>(7);
  const [birthDay, setBirthDay] = useState<number>(10);

  const [copied, setCopied] = useState(false);

  // 1. BS -> AD Result
  const convertedAD: ADDate = bsToAd({ year: bsYear, month: bsMonth, day: bsDay });
  const adDateObj = new Date(convertedAD.year, convertedAD.month - 1, convertedAD.day);
  const adDayOfWeekName = adDateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const adMonthName = adDateObj.toLocaleDateString('en-US', { month: 'long' });

  // 2. AD -> BS Result
  const convertedBS: BSDate = adToBs({ year: adYear, month: adMonth, day: adDay });
  const bsMonthInfo = NEPALI_MONTHS.find((m) => m.id === convertedBS.month);

  // 3. Age Result
  const todayNow = new Date();
  const todayAD: ADDate = { year: todayNow.getFullYear(), month: todayNow.getMonth() + 1, day: todayNow.getDate() };
  const todayBS = adToBs(todayAD);
  const ageResult = calculateBSDateDifference(
    { year: birthYear, month: birthMonth, day: birthDay },
    todayBS
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300">
              मिति रूपान्तरण तथा उमेर गणना (Date Converter & Age Calculator)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
            विक्रम संवत् र ईस्वी संवत् दुई-तर्फी रूपान्तरण
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            १९७० देखि २१०५ वि.सं. सम्मको शतप्रतिशत शुद्ध क्यालेन्डर गणना तथा उमेर विवरण
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('bs_to_ad')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bs_to_ad'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            वि.सं. ➔ ई.सं. (BS to AD)
          </button>
          <button
            onClick={() => setActiveTab('ad_to_bs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ad_to_bs'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ई.सं. ➔ वि.सं. (AD to BS)
          </button>
          <button
            onClick={() => setActiveTab('age_calc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'age_calc'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            उमेर गणना (Age Calculator)
          </button>
        </div>
      </div>

      {/* Tab 1: BS to AD */}
      {activeTab === 'bs_to_ad' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Input Box */}
          <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              विक्रम संवत् मिति छान्नुहोस् (BS Input)
            </h4>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  वर्ष (Year BS: १९७० - २१०५)
                </label>
                <input
                  type="number"
                  min={1970}
                  max={2105}
                  value={bsYear}
                  onChange={(e) => setBsYear(parseInt(e.target.value, 10) || 2083)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  महिना (Month BS)
                </label>
                <select
                  value={bsMonth}
                  onChange={(e) => setBsMonth(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold font-['Mukta',sans-serif]"
                >
                  {NEPALI_MONTHS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}. {m.nameNepali} ({m.nameEnglish})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  गते (Day BS: १ - {getDaysInBSMonth(bsYear, bsMonth)})
                </label>
                <input
                  type="number"
                  min={1}
                  max={getDaysInBSMonth(bsYear, bsMonth)}
                  value={bsDay}
                  onChange={(e) => setBsDay(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBsYear(todayBS.year);
                    setBsMonth(todayBS.month);
                    setBsDay(todayBS.day);
                  }}
                  className="w-full py-2 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                >
                  आजको मिति (Today)
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="md:col-span-7 bg-gradient-to-br from-blue-500/10 via-slate-50 to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 rounded-2xl p-5 sm:p-6 border border-blue-200 dark:border-blue-900/60 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                <span>ईस्वी संवत् रूपान्तरित मिति (Converted AD Date)</span>
                <span className="p-1 px-2.5 rounded-full bg-blue-100 dark:bg-blue-950">
                  {adDayOfWeekName}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                  {adMonthName} {convertedAD.day}, {convertedAD.year}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  ISO Format: {convertedAD.year}-{String(convertedAD.month).padStart(2, '0')}-{String(convertedAD.day).padStart(2, '0')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">वार (Weekday)</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{adDayOfWeekName}</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">महिनाको कुल दिन</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {getDaysInBSMonth(bsYear, bsMonth)} दिन
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">वि.सं. प्रारूप</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm font-['Mukta',sans-serif]">
                    {formatBSDateNepali({ year: bsYear, month: bsMonth, day: bsDay })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() =>
                  handleCopy(
                    `${adMonthName} ${convertedAD.day}, ${convertedAD.year} (${convertedAD.year}-${String(convertedAD.month).padStart(2, '0')}-${String(convertedAD.day).padStart(2, '0')})`
                  )
                }
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'कपी गरियो!' : 'मिति कपी गर्नुहोस्'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AD to BS */}
      {activeTab === 'ad_to_bs' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Input Box */}
          <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              ईस्वी संवत् मिति छान्नुहोस् (AD Input)
            </h4>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Year (AD: 1913 - 2048)
                </label>
                <input
                  type="number"
                  min={1913}
                  max={2048}
                  value={adYear}
                  onChange={(e) => setAdYear(parseInt(e.target.value, 10) || 2026)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Month (AD)
                </label>
                <select
                  value={adMonth}
                  onChange={(e) => setAdMonth(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                >
                  <option value={1}>January (01)</option>
                  <option value={2}>February (02)</option>
                  <option value={3}>March (03)</option>
                  <option value={4}>April (04)</option>
                  <option value={5}>May (05)</option>
                  <option value={6}>June (06)</option>
                  <option value={7}>July (07)</option>
                  <option value={8}>August (08)</option>
                  <option value={9}>September (09)</option>
                  <option value={10}>October (10)</option>
                  <option value={11}>November (11)</option>
                  <option value={12}>December (12)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Day (AD: 1 - 31)
                </label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={adDay}
                  onChange={(e) => setAdDay(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    setAdYear(now.getFullYear());
                    setAdMonth(now.getMonth() + 1);
                    setAdDay(now.getDate());
                  }}
                  className="w-full py-2 text-xs font-bold rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
                >
                  आजको मिति (Today)
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="md:col-span-7 bg-gradient-to-br from-purple-500/10 via-slate-50 to-white dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 rounded-2xl p-5 sm:p-6 border border-purple-200 dark:border-purple-900/60 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider">
                <span>विक्रम संवत् रूपान्तरित मिति (Converted BS Date)</span>
                <span className="p-1 px-2.5 rounded-full bg-purple-100 dark:bg-purple-950">
                  {bsMonthInfo?.nameNepali} महिना
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                  {formatBSDateNepali(convertedBS)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  वि.सं. {toNepaliDigits(convertedBS.year)} साल {bsMonthInfo?.nameNepali} महिना {toNepaliDigits(convertedBS.day)} गते
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">महिना</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm font-['Mukta',sans-serif]">
                    {bsMonthInfo?.nameNepali} ({bsMonthInfo?.nameEnglish})
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">ऋतु (Season)</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm font-['Mukta',sans-serif]">
                    {bsMonthInfo?.seasonNepali}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">ई.सं. सन्दर्भ</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {adYear}-{String(adMonth).padStart(2, '0')}-{String(adDay).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => handleCopy(formatBSDateNepali(convertedBS))}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'कपी गरियो!' : 'नेपाली मिति कपी गर्नुहोस्'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Age Calculator */}
      {activeTab === 'age_calc' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Input Box */}
          <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Cake className="w-4 h-4 text-emerald-600" />
              जन्म मिति प्रविष्ट गर्नुहोस् (Birth Date BS)
            </h4>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  जन्म वर्ष (Birth Year BS)
                </label>
                <input
                  type="number"
                  min={1970}
                  max={2100}
                  value={birthYear}
                  onChange={(e) => setBirthYear(parseInt(e.target.value, 10) || 2055)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  जन्म महिना (Birth Month BS)
                </label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold font-['Mukta',sans-serif]"
                >
                  {NEPALI_MONTHS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nameNepali}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  जन्म गते (Birth Day BS)
                </label>
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={birthDay}
                  onChange={(e) => setBirthDay(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                आजको मिति: <strong>{formatBSDateNepali(todayBS)}</strong>
              </div>
            </div>
          </div>

          {/* Age Result Card */}
          <div className="md:col-span-7 bg-gradient-to-br from-emerald-500/10 via-slate-50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 rounded-2xl p-5 sm:p-6 border border-emerald-200 dark:border-emerald-900/60 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
                तपाईंको ठ्याक्कै उमेर (Calculated Exact Age)
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-emerald-700 dark:text-emerald-400 font-['Mukta',sans-serif]">
                  {toNepaliDigits(ageResult.years)} वर्ष
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">
                  {toNepaliDigits(ageResult.months)} महिना {toNepaliDigits(ageResult.days)} दिन
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
                  <span className="text-slate-400 block text-[11px]">कुल दिन (Total Days)</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {toNepaliDigits(ageResult.totalDays)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
                  <span className="text-slate-400 block text-[11px]">कुल हप्ता (Weeks)</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {toNepaliDigits(ageResult.totalWeeks)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
                  <span className="text-slate-400 block text-[11px]">कुल घण्टा (Hours)</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {toNepaliDigits(ageResult.totalHours)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-emerald-700 dark:text-emerald-400 block text-[11px] font-bold">
                    आगामी जन्मदिन बाँकी
                  </span>
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-300 text-base">
                    {toNepaliDigits(ageResult.nextOccasionDays)} दिन
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                यो गणना विक्रम संवत्‌का ठ्याक्कै महिना दिनहरू तथा अधिवर्ष (Leap Year) को आधारमा गरिएको हो।
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
