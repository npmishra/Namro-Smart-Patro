import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Coins,
  CloudSun,
  Clock,
  ChevronRight,
  Flame,
  Globe2,
  Sparkles,
} from 'lucide-react';
import { BULLION_RATES, FOREX_RATES } from '../engines/forexBullionEngine';
import { toNepaliDigits } from '../engines/calendarEngine';
import { LocationData } from '../types';

interface TopMarketWeatherBarProps {
  currentLocation: LocationData;
  onOpenForex: () => void;
  onOpenLocation: () => void;
  onOpenNews?: () => void;
}

export const TopMarketWeatherBar: React.FC<TopMarketWeatherBarProps> = ({
  currentLocation,
  onOpenForex,
  onOpenLocation,
  onOpenNews,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const mins = now.getMinutes();
      const secs = now.getSeconds();
      const period = hours >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
      const hours12 = hours % 12 || 12;

      const nepTime = `${toNepaliDigits(hours12)}:${toNepaliDigits(
        mins < 10 ? '0' + mins : mins
      )}:${toNepaliDigits(secs < 10 ? '0' + secs : secs)} ${period}`;
      setTimeStr(nepTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fineGold = BULLION_RATES.find((b) => b.id === 'fine_gold') || BULLION_RATES[0];
  const silver = BULLION_RATES.find((b) => b.id === 'silver') || BULLION_RATES[2];
  const usd = FOREX_RATES.find((f) => f.currencyCode === 'USD') || FOREX_RATES[0];
  const eur = FOREX_RATES.find((f) => f.currencyCode === 'EUR') || FOREX_RATES[1];
  const qatar = FOREX_RATES.find((f) => f.currencyCode === 'QAR') || FOREX_RATES[3];

  return (
    <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800/80 select-none font-['Mukta',sans-serif]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        {/* Left: Quick Live Market Ticker */}
        <div className="flex items-center gap-4 shrink-0 text-[11px] font-medium">
          {/* Gold Rate */}
          <button
            onClick={onOpenForex}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors group cursor-pointer"
            title="सुनचाँदी तथा विदेशी मुद्रा दर हेर्नुहोस्"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-slate-400">सुन:</span>
            <span className="font-bold text-amber-300">
              रु. {toNepaliDigits(fineGold.ratePerTolaNPR.toLocaleString('en-IN'))}
            </span>
            <span className="text-[10px] text-slate-500">/तोला</span>
          </button>

          {/* Silver Rate */}
          <button
            onClick={onOpenForex}
            className="hidden sm:flex items-center gap-1.5 hover:text-slate-100 transition-colors group cursor-pointer"
            title="चाँदीको दर"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
            <span className="text-slate-400">चाँदी:</span>
            <span className="font-bold text-slate-100">
              रु. {toNepaliDigits(silver.ratePerTolaNPR.toLocaleString('en-IN'))}
            </span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* USD Rate */}
          <button
            onClick={onOpenForex}
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors group cursor-pointer"
            title="अमेरिकी डलर विनिमय दर"
          >
            <span className="text-emerald-400 font-bold">$ USD:</span>
            <span className="font-semibold text-slate-200">
              रु. {toNepaliDigits(usd.sellRateNPR.toFixed(2))}
            </span>
          </button>

          {/* EUR Rate */}
          <button
            onClick={onOpenForex}
            className="hidden md:flex items-center gap-1.5 hover:text-blue-400 transition-colors group cursor-pointer"
            title="युरो विनिमय दर"
          >
            <span className="text-blue-400 font-bold">€ EUR:</span>
            <span className="font-semibold text-slate-200">
              रु. {toNepaliDigits(eur.sellRateNPR.toFixed(2))}
            </span>
          </button>

          {/* QAR Rate */}
          <button
            onClick={onOpenForex}
            className="hidden lg:flex items-center gap-1.5 hover:text-purple-400 transition-colors group cursor-pointer"
            title="कतार रियाल दर"
          >
            <span className="text-purple-400 font-bold">QAR:</span>
            <span className="font-semibold text-slate-200">
              रु. {toNepaliDigits(qatar.sellRateNPR.toFixed(2))}
            </span>
          </button>
        </div>

        {/* Right: Weather & Running Clock */}
        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          {/* Location & Weather */}
          <button
            onClick={onOpenLocation}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="स्थान परिवर्तन गर्नुहोस्"
          >
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{currentLocation.nameNepali.split(' ')[0]}</span>
            <span className="text-amber-300 font-bold">२२°C</span>
          </button>

          {/* Live Nepali Time */}
          <div className="hidden xs:flex items-center gap-1 text-slate-400 px-1.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[10px]">
            <Clock className="w-3 h-3 text-red-400" />
            <span className="font-bold text-slate-200">{timeStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
