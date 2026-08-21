import React, { useState } from 'react';
import {
  Coins,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  RefreshCw,
  Calculator,
  Flame,
  Scale,
  TrendingUp,
} from 'lucide-react';
import {
  BULLION_RATES,
  CurrencyRate,
  FOREX_RATES,
} from '../engines/forexBullionEngine';
import { toNepaliDigits } from '../engines/calendarEngine';

export const ForexBullionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forex' | 'bullion'>('forex');

  // Forex Converter State
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');

  // Bullion Converter State
  const [tolaAmount, setTolaAmount] = useState<number>(1);
  const [selectedMetalId, setSelectedMetalId] = useState<string>('fine_gold');

  const selectedCurrency =
    FOREX_RATES.find((c) => c.currencyCode === selectedCurrencyCode) || FOREX_RATES[0];
  const selectedMetal =
    BULLION_RATES.find((m) => m.id === selectedMetalId) || BULLION_RATES[0];

  const calculatedNPR =
    (convertAmount / selectedCurrency.unit) * selectedCurrency.buyRateNPR;
  const calculatedMetalPrice = tolaAmount * selectedMetal.ratePerTolaNPR;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
              विदेशी मुद्रा तथा सुनचाँदी दर (Forex & Bullion Market)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
            नेपाल राष्ट्र बैंक विनिमय दर तथा सुनचाँदी बजार मूल्य
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            नेपाल राष्ट्र बैंक (NRB) तथा नेपाल सुनचाँदी व्यवसायी महासंघद्वारा निर्धारित आधिकारिक दरहरू
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('forex')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'forex'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            मुद्रा विनिमय दर (Forex)
          </button>
          <button
            onClick={() => setActiveTab('bullion')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bullion'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            सुनचाँदी दर (Gold & Silver)
          </button>
        </div>
      </div>

      {/* Tab 1: Forex */}
      {activeTab === 'forex' && (
        <div className="space-y-6">
          {/* Currency Converter Tool Card */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-slate-50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 rounded-2xl p-5 sm:p-6 border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-emerald-600" />
              मुद्रा रूपान्तरण क्यालकुलेटर (Live Currency Converter)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Input Amount */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  विदेशी रकम (Foreign Amount)
                </label>
                <input
                  type="number"
                  min={1}
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-base"
                />
              </div>

              {/* Currency Selector */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  मुद्रा (Select Currency)
                </label>
                <select
                  value={selectedCurrencyCode}
                  onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm"
                >
                  {FOREX_RATES.map((c) => (
                    <option key={c.currencyCode} value={c.currencyCode}>
                      {c.flagEmoji} {c.currencyCode} - {c.currencyNameNepali}
                    </option>
                  ))}
                </select>
              </div>

              {/* Equivalent NPR */}
              <div className="sm:col-span-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block font-medium">
                  नेपाली रुपैयाँ बराबर (NPR Value)
                </span>
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-['Mukta',sans-serif]">
                  रु. {calculatedNPR.toLocaleString('ne-NP', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Rates Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                नेपाल राष्ट्र बैंक विदेशी मुद्रा विनिमय दर सूची (NRB Rates)
              </span>
              <span className="text-xs text-slate-400">प्रति १ एकाइ (INR र JPY बाहेक)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 sm:p-4">मुद्रा (Currency)</th>
                    <th className="p-3 sm:p-4">एकाइ (Unit)</th>
                    <th className="p-3 sm:p-4">खरिद दर (Buying NPR)</th>
                    <th className="p-3 sm:p-4">बिक्री दर (Selling NPR)</th>
                    <th className="p-3 sm:p-4 text-center">अवस्था</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {FOREX_RATES.map((curr) => (
                    <tr
                      key={curr.currencyCode}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3 sm:p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-lg">{curr.flagEmoji}</span>
                        <div>
                          <div>{curr.currencyNameNepali}</div>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">
                            {curr.currencyCode} ({curr.currencyNameEnglish})
                          </span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {toNepaliDigits(curr.unit)}
                      </td>
                      <td className="p-3 sm:p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        रु. {curr.buyRateNPR.toFixed(2)}
                      </td>
                      <td className="p-3 sm:p-4 font-mono font-bold text-slate-900 dark:text-white">
                        रु. {curr.sellRateNPR.toFixed(2)}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        {curr.changeStatus === 'up' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
                            <ArrowUpRight className="w-3.5 h-3.5" /> वृद्धि
                          </span>
                        )}
                        {curr.changeStatus === 'down' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-rose-500">
                            <ArrowDownRight className="w-3.5 h-3.5" /> गिरावट
                          </span>
                        )}
                        {curr.changeStatus === 'same' && (
                          <span className="inline-flex items-center text-[10px] font-bold text-slate-400">
                            <Minus className="w-3.5 h-3.5" /> स्थिर
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bullion (Gold & Silver) */}
      {activeTab === 'bullion' && (
        <div className="space-y-6">
          {/* Bullion Converter Tool Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-50 to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 rounded-2xl p-5 sm:p-6 border border-amber-200 dark:border-amber-900/60 shadow-xs">
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Scale className="w-4 h-4 text-amber-600" />
              सुनचाँदी मूल्य क्यालकुलेटर (Tola / Gram Price Calculator)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Tola Input */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  तौल तोलामा (Weight in Tola)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0.1}
                  value={tolaAmount}
                  onChange={(e) => setTolaAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-base"
                />
              </div>

              {/* Metal Selector */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  धातुको प्रकार (Select Metal)
                </label>
                <select
                  value={selectedMetalId}
                  onChange={(e) => setSelectedMetalId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm font-['Mukta',sans-serif]"
                >
                  {BULLION_RATES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.metalNameNepali}
                    </option>
                  ))}
                </select>
              </div>

              {/* Calculated Price */}
              <div className="sm:col-span-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block font-medium">
                  कुल बजार मूल्य (Total Amount NPR)
                </span>
                <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400 font-['Mukta',sans-serif]">
                  रु. {calculatedMetalPrice.toLocaleString('ne-NP')}
                </span>
              </div>
            </div>
          </div>

          {/* Bullion Rates Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BULLION_RATES.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {b.purity}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 font-['Mukta',sans-serif]">
                      {b.metalNameNepali}
                    </h4>
                    <p className="text-xs text-slate-400">{b.metalNameEnglish}</p>
                  </div>

                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                    <Flame className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">प्रति तोला दर:</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                      रु. {b.ratePerTolaNPR.toLocaleString('ne-NP')}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">प्रति १० ग्राम दर:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      रु. {b.ratePer10GramNPR.toLocaleString('ne-NP')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>अघिल्लो दिन भन्दा:</span>
                  <span
                    className={`font-bold flex items-center gap-0.5 ${
                      b.changeType === 'up'
                        ? 'text-emerald-600'
                        : b.changeType === 'down'
                        ? 'text-rose-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {b.changeType === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
                    {b.changeType === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
                    रु. {b.changeNPR} {b.changeType === 'up' ? 'बढेको' : 'घटेको'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
