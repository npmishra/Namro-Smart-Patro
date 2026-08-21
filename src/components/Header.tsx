import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Compass,
  Search,
  Moon,
  Sun,
  MapPin,
  Sparkles,
  ChevronDown,
  FlaskConical,
  Star,
  ArrowLeftRight,
  Coins,
  Radio,
  Printer,
  Heart,
  CalendarCheck,
  Newspaper,
} from 'lucide-react';
import { CalculationMethodType, LocationData } from '../types';
import { CALCULATION_METHODS } from '../engines/calculationMethods';
import { NEPAL_LOCATIONS } from '../engines/locationEngine';
import { toNepaliDigits } from '../engines/calendarEngine';

interface HeaderProps {
  currentMethod: CalculationMethodType;
  onMethodChange: (method: CalculationMethodType) => void;
  currentLocation: LocationData;
  onLocationChange: (loc: LocationData) => void;
  onOpenSearch: () => void;
  onOpenAdminLab: () => void;
  onOpenLocationModal?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMethod,
  onMethodChange,
  currentLocation,
  onLocationChange,
  onOpenSearch,
  onOpenAdminLab,
  onOpenLocationModal,
  isDarkMode,
  onToggleDarkMode,
  activeTab,
  onTabChange,
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showMethodMenu, setShowMethodMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const mins = now.getMinutes();
      const secs = now.getSeconds();
      const period = hours >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
      const hours12 = hours % 12 || 12;

      const nepTime = `${toNepaliDigits(hours12)}:${toNepaliDigits(
        mins < 10 ? '0' + mins : mins
      )}:${toNepaliDigits(secs < 10 ? '0' + secs : secs)} ${period}`;
      setCurrentTimeStr(nepTime);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const methodInfo = CALCULATION_METHODS[currentMethod];

  const primaryNavItems = [
    { id: 'calendar', label: 'पात्रो' },
    { id: 'panchang', label: 'पञ्चाङ्ग' },
    { id: 'rashifal', label: 'राशिफल' },
    { id: 'converter', label: 'मिति रूपान्तरण' },
    { id: 'forex', label: 'विदेशी मुद्रा' },
    { id: 'festivals', label: 'पर्व/बिदा' },
  ];

  const secondaryNavItems = [
    { id: 'radio', label: 'प्रत्यक्ष रेडियो', icon: <Radio className="w-4 h-4 text-purple-500" /> },
    { id: 'muhurat', label: 'शुभ साइत', icon: <Heart className="w-4 h-4 text-rose-500" /> },
    { id: 'news', label: 'ताजा समाचार', icon: <Newspaper className="w-4 h-4 text-blue-500" /> },
    { id: 'events', label: 'मेरा घटनाहरू', icon: <CalendarCheck className="w-4 h-4 text-emerald-500" /> },
    { id: 'wall_calendar', label: 'भित्ते पात्रो प्रिन्ट', icon: <Printer className="w-4 h-4 text-red-500" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <div
            id="brand-logo"
            onClick={() => onTabChange('calendar')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 p-0.5 shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-1.5">
                <svg viewBox="0 0 512 512" className="w-full h-full text-amber-400 fill-current">
                  <path d="M210,180 A80,80 0 1,0 330,300 A95,95 0 0,1 210,180 Z" />
                  <circle cx="256" cy="235" r="28" className="fill-red-600" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 font-['Mukta',sans-serif]">
                  नाम्रो <span className="text-red-600 dark:text-rose-500">स्मार्ट</span> पात्रो
                </h1>
                <span className="hidden xl:inline-flex px-2 py-0.5 text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 rounded-full border border-red-200 dark:border-red-800/60">
                  PROPRIETARY
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Namro Smart Patro — Nepali Calendar & Panchang
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* More Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  secondaryNavItems.some((n) => n.id === activeTab)
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>थप</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50 animate-in fade-in zoom-in-95">
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setShowMoreMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors ${
                        activeTab === item.id
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-rose-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Controls & Quick Dropdowns */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live Clock Badge (Desktop) */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentTimeStr}</span>
            </div>

            {/* Location Selector */}
            <div className="relative">
              <button
                id="btn-location-selector"
                onClick={() => {
                  if (onOpenLocationModal) {
                    onOpenLocationModal();
                  } else {
                    setShowLocationMenu(!showLocationMenu);
                  }
                  setShowMethodMenu(false);
                  setShowMoreMenu(false);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
                title="स्थान छनोट (Change Location / 77 Districts)"
              >
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate max-w-[80px] sm:max-w-[120px] font-bold">
                  {currentLocation.nameNepali.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {showLocationMenu && !onOpenLocationModal && (
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span>नेपाल तथा अन्तर्राष्ट्रिय स्थान</span>
                  </div>
                  {NEPAL_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onLocationChange(loc);
                        setShowLocationMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors ${
                        currentLocation.id === loc.id
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-rose-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{loc.nameNepali}</div>
                        <div className="text-[10px] text-slate-400">{loc.province} • {loc.elevationMeters}m</div>
                      </div>
                      {currentLocation.id === loc.id && (
                        <span className="text-red-600 dark:text-rose-400 text-xs font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Siddhanta Calculation Method Selector */}
            <div className="relative">
              <button
                id="btn-method-selector"
                onClick={() => {
                  setShowMethodMenu(!showMethodMenu);
                  setShowLocationMenu(false);
                  setShowMoreMenu(false);
                }}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/60 transition-colors"
                title="पात्रो गणना पद्धति (Calculation Method)"
              >
                <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="hidden sm:inline truncate max-w-[100px]">{methodInfo.nameNepali.split(' ')[0]}</span>
                <span className="sm:hidden">पद्धति</span>
                <ChevronDown className="w-3 h-3 text-amber-500 shrink-0" />
              </button>

              {showMethodMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span>पात्रो गणना पद्धति (Siddhanta)</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">Active: {methodInfo.precision}</span>
                  </div>
                  <div className="space-y-1.5 mt-2 max-h-80 overflow-y-auto pr-1">
                    {Object.values(CALCULATION_METHODS).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onMethodChange(m.id);
                          setShowMethodMenu(false);
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer border text-xs transition-all ${
                          currentMethod === m.id
                            ? 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-transparent text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className={currentMethod === m.id ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}>
                              {currentMethod === m.id ? '◉' : '○'}
                            </span>
                            {m.nameNepali}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {m.precision}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Global Search Button */}
            <button
              id="btn-global-search"
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              title="मिति तथा पर्व खोज्नुहोस् (Search Date/Festival)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin Calculation Lab Button */}
            <button
              id="btn-open-admin-lab"
              onClick={onOpenAdminLab}
              className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 transition-colors"
              title="गणना प्रयोगशाला तथा टेस्ट बेन्चमार्क (Admin Test Lab)"
            >
              <FlaskConical className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
