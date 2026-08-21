import React, { useState, useEffect, useMemo } from 'react';
import {
  ADDate,
  BSDate,
  CalculationMethodType,
  LocationData,
  PersonalEvent,
} from './types';
import {
  adToBs,
  bsToAd,
  getCurrentNepaliDate,
  getDaysInBSMonth,
  addDaysToBSDate,
} from './engines/calendarEngine';
import {
  calculateDailyPanchang,
  getMonthlyCalendarDays,
} from './engines/panchangEngine';
import { DEFAULT_LOCATION, getLocationById } from './engines/locationEngine';
import { getStoredEvents } from './engines/eventsEngine';

// Components
import { Header } from './components/Header';
import { DateHeroCard } from './components/DateHeroCard';
import { CalendarMonthView } from './components/CalendarMonthView';
import { DailyPanchangDetail } from './components/DailyPanchangDetail';
import { YearCalendarView } from './components/YearCalendarView';
import { FestivalsHolidaysView } from './components/FestivalsHolidaysView';
import { NewsFeedView } from './components/NewsFeedView';
import { MuhuratView } from './components/MuhuratView';
import { PersonalEventsView } from './components/PersonalEventsView';
import { AdminTestLabModal } from './components/AdminTestLabModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { BottomNavigation } from './components/BottomNavigation';
import { RashifalView } from './components/RashifalView';
import { DateConverterView } from './components/DateConverterView';
import { ForexBullionView } from './components/ForexBullionView';
import { RadioPlayerView } from './components/RadioPlayerView';
import { PrintableWallCalendar } from './components/PrintableWallCalendar';
import { FestivalCountdownWidget } from './components/FestivalCountdownWidget';
import { DayDetailModal } from './components/DayDetailModal';

const SAVED_LOCATION_KEY = 'namro_smart_patro_location_id';

export function App() {
  // 1. Current Date State
  const initialToday = useMemo(() => {
    const now = new Date();
    const ad: ADDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    const bs = adToBs(ad);
    return { bs, ad };
  }, []);

  const [todayBS] = useState<BSDate>(initialToday.bs);
  const [selectedBSDate, setSelectedBSDate] = useState<BSDate>(initialToday.bs);
  const [activeYear, setActiveYear] = useState<number>(initialToday.bs.year);
  const [activeMonth, setActiveMonth] = useState<number>(initialToday.bs.month);

  // 2. Engine Settings State
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethodType>('drik');
  const [currentLocation, setCurrentLocation] = useState<LocationData>(() => {
    try {
      const savedId = localStorage.getItem(SAVED_LOCATION_KEY);
      if (savedId) {
        return getLocationById(savedId);
      }
    } catch (e) {
      // localStorage not accessible
    }
    return DEFAULT_LOCATION;
  });

  const handleLocationChange = (loc: LocationData) => {
    setCurrentLocation(loc);
    try {
      localStorage.setItem(SAVED_LOCATION_KEY, loc.id);
    } catch (e) {}
  };

  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 3. Modals State
  const [showYearView, setShowYearView] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showAdminLab, setShowAdminLab] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showDayDetailModal, setShowDayDetailModal] = useState<boolean>(false);

  // 4. Personal Events State
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>(() => getStoredEvents());

  // Dark Mode Class Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Selected Day Panchang
  const selectedPanchang = useMemo(() => {
    return calculateDailyPanchang({ bs: selectedBSDate }, currentLocation, calculationMethod);
  }, [selectedBSDate, currentLocation, calculationMethod]);

  // Monthly Calendar Matrix
  const monthlyDays = useMemo(() => {
    return getMonthlyCalendarDays(activeYear, activeMonth, currentLocation, calculationMethod);
  }, [activeYear, activeMonth, currentLocation, calculationMethod]);

  // Navigation Helpers
  const handlePrevMonth = () => {
    if (activeMonth === 1) {
      setActiveYear((y) => y - 1);
      setActiveMonth(12);
    } else {
      setActiveMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonth === 12) {
      setActiveYear((y) => y + 1);
      setActiveMonth(1);
    } else {
      setActiveMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setSelectedBSDate(todayBS);
    setActiveYear(todayBS.year);
    setActiveMonth(todayBS.month);
  };

  // Called when ANY date is clicked in calendar/search/year view
  const handleSelectDate = (date: BSDate) => {
    setSelectedBSDate(date);
    setActiveYear(date.year);
    setActiveMonth(date.month);
    setShowDayDetailModal(true);
  };

  const handlePrevDay = () => {
    const prev = addDaysToBSDate(selectedBSDate, -1);
    setSelectedBSDate(prev);
    setActiveYear(prev.year);
    setActiveMonth(prev.month);
  };

  const handleNextDay = () => {
    const next = addDaysToBSDate(selectedBSDate, 1);
    setSelectedBSDate(next);
    setActiveYear(next.year);
    setActiveMonth(next.month);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Mukta',sans-serif] selection:bg-red-500 selection:text-white transition-colors pb-20 lg:pb-12">
      {/* 1. Main Header */}
      <Header
        currentMethod={calculationMethod}
        onMethodChange={setCalculationMethod}
        currentLocation={currentLocation}
        onLocationChange={handleLocationChange}
        onOpenLocationModal={() => setShowLocationModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenAdminLab={() => setShowAdminLab(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 2. Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Prominent Date Hero Card */}
        <DateHeroCard
          panchang={selectedPanchang}
          isToday={
            selectedBSDate.year === todayBS.year &&
            selectedBSDate.month === todayBS.month &&
            selectedBSDate.day === todayBS.day
          }
          onJumpToToday={handleJumpToToday}
          onOpenPanchangDetail={() => setShowDayDetailModal(true)}
        />

        {/* Tab Content */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Festival Countdown Banner */}
            <FestivalCountdownWidget onJumpToDate={handleSelectDate} />

            {/* Year View Mode or Month Grid View */}
            {showYearView ? (
              <YearCalendarView
                year={activeYear}
                location={currentLocation}
                onChangeYear={setActiveYear}
                onSelectMonth={(m) => {
                  setActiveMonth(m);
                  setShowYearView(false);
                }}
                onSelectDate={handleSelectDate}
                onClose={() => setShowYearView(false)}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Calendar Grid (8 cols on large screen) */}
                <div className="lg:col-span-8 space-y-6">
                  <CalendarMonthView
                    currentYear={activeYear}
                    currentMonth={activeMonth}
                    selectedDate={selectedBSDate}
                    todayDate={todayBS}
                    days={monthlyDays}
                    onSelectDate={handleSelectDate}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onChangeYear={(y) => {
                      setActiveYear(y);
                      setSelectedBSDate((prev) => ({ ...prev, year: y }));
                    }}
                    onChangeMonth={(m) => {
                      setActiveMonth(m);
                      setSelectedBSDate((prev) => ({ ...prev, month: m, day: 1 }));
                    }}
                    onJumpToday={handleJumpToToday}
                    onOpenYearView={() => setShowYearView(true)}
                  />
                </div>

                {/* Right Sidebar: Selected Day Quick Panchang & Festivals (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  <DailyPanchangDetail
                    panchang={selectedPanchang}
                    onAddEvent={() => {
                      setShowDayDetailModal(false);
                      setActiveTab('events');
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'panchang' && (
          <DailyPanchangDetail
            panchang={selectedPanchang}
            onAddEvent={() => setActiveTab('events')}
          />
        )}

        {activeTab === 'rashifal' && (
          <RashifalView currentBSDate={selectedBSDate} />
        )}

        {activeTab === 'converter' && <DateConverterView />}

        {activeTab === 'forex' && <ForexBullionView />}

        {activeTab === 'radio' && <RadioPlayerView />}

        {activeTab === 'wall_calendar' && (
          <PrintableWallCalendar
            year={activeYear}
            month={activeMonth}
            location={currentLocation}
            onClose={() => setActiveTab('calendar')}
          />
        )}

        {activeTab === 'festivals' && (
          <FestivalsHolidaysView onJumpToDate={handleSelectDate} />
        )}

        {activeTab === 'news' && <NewsFeedView />}

        {activeTab === 'muhurat' && <MuhuratView />}

        {activeTab === 'events' && (
          <PersonalEventsView
            events={personalEvents}
            onUpdateEvents={setPersonalEvents}
            onJumpToDate={handleSelectDate}
          />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              नाम्रो स्मार्ट पात्रो (Namro Smart Patro)
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              स्वतन्त्र तथा पूर्ण स्वत्वाधिकारयुक्त नेपाली पात्रो तथा पञ्चाङ्ग गणना प्रणाली
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <button
              onClick={() => setShowLocationModal(true)}
              className="hover:text-red-600 dark:hover:text-rose-400 font-bold"
            >
              📍 स्थान परिवर्तन ({currentLocation.nameNepali.split(' ')[0]})
            </button>
            <span>•</span>
            <button
              onClick={() => setShowAdminLab(true)}
              className="hover:text-red-600 dark:hover:text-rose-400 font-bold"
            >
              गणना प्रयोगशाला (Laboratory)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('wall_calendar')}
              className="hover:text-red-600 dark:hover:text-rose-400 font-semibold"
            >
              भित्ते पात्रो प्रिन्ट
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('rashifal')}
              className="hover:text-red-600 dark:hover:text-rose-400 font-semibold"
            >
              दैनिक राशिफल
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('converter')}
              className="hover:text-red-600 dark:hover:text-rose-400 font-semibold"
            >
              मिति रूपान्तरण
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('forex')}
              className="hover:text-red-600 dark:hover:text-rose-400 font-semibold"
            >
              विदेशी मुद्रा/सुनचाँदी
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Mobile Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 5. Modals */}
      {/* Location Selector Modal covering all 77 districts of Nepal */}
      {showLocationModal && (
        <LocationSelectorModal
          currentLocation={currentLocation}
          onSelectLocation={handleLocationChange}
          onClose={() => setShowLocationModal(false)}
        />
      )}

      {/* Day Detail Modal when clicking ANY date in the calendar */}
      {showDayDetailModal && (
        <DayDetailModal
          panchang={selectedPanchang}
          isToday={
            selectedBSDate.year === todayBS.year &&
            selectedBSDate.month === todayBS.month &&
            selectedBSDate.day === todayBS.day
          }
          onClose={() => setShowDayDetailModal(false)}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onAddEvent={(date) => {
            setShowDayDetailModal(false);
            setActiveTab('events');
          }}
          onViewRashifal={() => {
            setShowDayDetailModal(false);
            setActiveTab('rashifal');
          }}
        />
      )}

      {showSearchModal && (
        <GlobalSearchModal
          onClose={() => setShowSearchModal(false)}
          onSelectDate={handleSelectDate}
        />
      )}

      {showAdminLab && (
        <AdminTestLabModal
          onClose={() => setShowAdminLab(false)}
          currentLocation={currentLocation}
        />
      )}
    </div>
  );
}

export default App;
