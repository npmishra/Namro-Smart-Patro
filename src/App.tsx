import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ADDate,
  BSDate,
  CalculationMethodType,
  LocationData,
  PersonalEvent,
  NewsArticle,
  AdminVisibilityConfig,
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
import { RADIO_STATIONS, RadioStation } from './engines/radioEngine';
import { getStoredAdminConfig, saveStoredAdminConfig } from './engines/adminConfigEngine';

// Components
import { AdminAnnouncementBanner } from './components/AdminAnnouncementBanner';
import { AdminControlSuiteModal } from './components/AdminControlSuiteModal';
import { TopMarketWeatherBar } from './components/TopMarketWeatherBar';
import { Header } from './components/Header';
import { QuickServicesHub } from './components/QuickServicesHub';
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
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { HomeDashboardWidgets } from './components/HomeDashboardWidgets';
import { HomeNewsWidget } from './components/HomeNewsWidget';
import { NewsReaderModal } from './components/NewsReaderModal';
import { FloatingRadioPlayer } from './components/FloatingRadioPlayer';

const SAVED_LOCATION_KEY = 'namro_smart_patro_location_id';

export function App() {
  // 1. Admin Visibility & Role Configuration
  const [adminConfig, setAdminConfig] = useState<AdminVisibilityConfig>(() => getStoredAdminConfig());
  const [showAdminControlSuite, setShowAdminControlSuite] = useState<boolean>(false);

  const handleUpdateAdminConfig = (newConfig: AdminVisibilityConfig) => {
    setAdminConfig(newConfig);
    saveStoredAdminConfig(newConfig);
  };

  // Keyboard shortcut for quick Admin Access: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowAdminControlSuite((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 2. Current Date State
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

  // 3. Engine Settings State
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

  // 4. Modals State
  const [showYearView, setShowYearView] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showAdminLab, setShowAdminLab] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showDayDetailModal, setShowDayDetailModal] = useState<boolean>(false);
  const [selectedReaderArticle, setSelectedReaderArticle] = useState<NewsArticle | null>(null);

  // 5. Personal Events State
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>(() => getStoredEvents());

  // 6. Global Radio State (for background listening while browsing)
  const [activeRadioStation, setActiveRadioStation] = useState<RadioStation | null>(RADIO_STATIONS[0]);
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(false);
  const [showFloatingRadio, setShowFloatingRadio] = useState<boolean>(false);
  const globalAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggleRadioPlay = () => {
    if (!globalAudioRef.current) return;
    if (isRadioPlaying) {
      globalAudioRef.current.pause();
      setIsRadioPlaying(false);
    } else {
      globalAudioRef.current
        .play()
        .then(() => {
          setIsRadioPlaying(true);
          setShowFloatingRadio(true);
        })
        .catch(() => {
          setIsRadioPlaying(false);
        });
    }
  };

  const handleSelectRadioStation = (station: RadioStation) => {
    setActiveRadioStation(station);
    setShowFloatingRadio(true);
    if (globalAudioRef.current) {
      globalAudioRef.current.pause();
      globalAudioRef.current.src = station.streamUrl;
      globalAudioRef.current.load();
      globalAudioRef.current
        .play()
        .then(() => setIsRadioPlaying(true))
        .catch(() => setIsRadioPlaying(false));
    }
  };

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
      {/* Background Global Audio Element for FM Radio */}
      <audio
        ref={globalAudioRef}
        src={activeRadioStation ? activeRadioStation.streamUrl : ''}
        onEnded={() => setIsRadioPlaying(false)}
        onError={() => setIsRadioPlaying(false)}
      />

      {/* Admin Controlled Emergency Announcement Banner */}
      <AdminAnnouncementBanner config={adminConfig} />

      {/* 1. Top Live Market & Weather Ticker Bar */}
      {adminConfig.showTopMarketWeatherBar && (
        <TopMarketWeatherBar
          currentLocation={currentLocation}
          onOpenForex={() => setActiveTab('forex')}
          onOpenLocation={() => setShowLocationModal(true)}
          onOpenNews={() => setActiveTab('news')}
        />
      )}

      {/* 2. Main Sticky Header */}
      {adminConfig.showHeader && (
        <Header
          currentMethod={calculationMethod}
          onMethodChange={setCalculationMethod}
          currentLocation={currentLocation}
          onLocationChange={handleLocationChange}
          onOpenLocationModal={() => setShowLocationModal(true)}
          onOpenSearch={() => setShowSearchModal(true)}
          onOpenAdminLab={() => setShowAdminLab(true)}
          onOpenAdminControl={() => setShowAdminControlSuite(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          adminConfig={adminConfig}
        />
      )}

      {/* 3. Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Live Breaking News Ticker (Automatic Updates) */}
        {adminConfig.showNewsTicker && (
          <BreakingNewsTicker
            onSelectArticle={(art) => setSelectedReaderArticle(art)}
            onOpenAllNews={() => setActiveTab('news')}
          />
        )}

        {/* Super-App Quick Services Hub */}
        <QuickServicesHub
          activeTab={activeTab}
          onTabChange={setActiveTab}
          adminConfig={adminConfig}
        />

        {/* Prominent Date Hero Card */}
        {adminConfig.showHeroDateBanner && (
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
        )}

        {/* Tab Content */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Festival Countdown Banner */}
            {adminConfig.showFestivalCountdownWidget && (
              <FestivalCountdownWidget onJumpToDate={handleSelectDate} />
            )}

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
                  {adminConfig.showPanchangOverview && (
                    <DailyPanchangDetail
                      panchang={selectedPanchang}
                      onAddEvent={() => {
                        setShowDayDetailModal(false);
                        setActiveTab('events');
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Home Portal Widgets: Quick Rashifal, Bullion/Forex snapshot, and Upcoming Festivals */}
            {!showYearView && (
              <HomeDashboardWidgets
                panchang={selectedPanchang}
                onOpenRashifal={() => setActiveTab('rashifal')}
                onOpenForex={() => setActiveTab('forex')}
                onOpenMuhurat={() => setActiveTab('muhurat')}
                onOpenFestivals={() => setActiveTab('festivals')}
                onJumpToDate={handleSelectDate}
                adminConfig={adminConfig}
              />
            )}

            {/* Portal Homepage Live News Updates Section */}
            {!showYearView && (
              <HomeNewsWidget
                onOpenAllNews={() => setActiveTab('news')}
                onSelectArticle={(art) => setSelectedReaderArticle(art)}
                adminConfig={adminConfig}
              />
            )}
          </div>
        )}

        {activeTab === 'panchang' && adminConfig.enabledTabs.panchang && (
          <DailyPanchangDetail
            panchang={selectedPanchang}
            onAddEvent={() => setActiveTab('events')}
          />
        )}

        {activeTab === 'rashifal' && adminConfig.enabledTabs.rashifal && (
          <RashifalView currentBSDate={selectedBSDate} />
        )}

        {activeTab === 'converter' && adminConfig.enabledTabs.converter && (
          <DateConverterView />
        )}

        {activeTab === 'forex' && adminConfig.enabledTabs.forex && (
          <ForexBullionView />
        )}

        {activeTab === 'radio' && adminConfig.enabledTabs.radio && (
          <RadioPlayerView />
        )}

        {activeTab === 'wall_calendar' && adminConfig.enabledTabs.wall_calendar && (
          <PrintableWallCalendar
            year={activeYear}
            month={activeMonth}
            location={currentLocation}
            onClose={() => setActiveTab('calendar')}
          />
        )}

        {activeTab === 'festivals' && adminConfig.enabledTabs.festivals && (
          <FestivalsHolidaysView onJumpToDate={handleSelectDate} />
        )}

        {activeTab === 'news' && adminConfig.enabledTabs.news && (
          <NewsFeedView />
        )}

        {activeTab === 'muhurat' && adminConfig.enabledTabs.muhurat && (
          <MuhuratView />
        )}

        {activeTab === 'events' && adminConfig.enabledTabs.events && (
          <PersonalEventsView
            events={personalEvents}
            onUpdateEvents={setPersonalEvents}
            onJumpToDate={handleSelectDate}
          />
        )}
      </main>

      {/* 4. Persistent Background Floating FM Radio Player */}
      {showFloatingRadio && (
        <FloatingRadioPlayer
          currentStation={activeRadioStation}
          isPlaying={isRadioPlaying}
          onTogglePlay={handleToggleRadioPlay}
          onSelectStation={handleSelectRadioStation}
          onClosePlayer={() => {
            if (globalAudioRef.current) {
              globalAudioRef.current.pause();
            }
            setIsRadioPlaying(false);
            setShowFloatingRadio(false);
          }}
          onOpenFullRadioView={() => setActiveTab('radio')}
        />
      )}

      {/* 5. Footer */}
      {adminConfig.showFooter && (
        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs py-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center justify-center sm:justify-start gap-2">
                <span>नाम्रो स्मार्ट पात्रो (Namro Smart Patro)</span>
                {adminConfig.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-rose-300 text-[10px] font-black">
                    👑 ADMIN ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                स्वतन्त्र तथा पूर्ण स्वत्वाधिकारयुक्त नेपाली पात्रो, पञ्चाङ्ग, रेडियो तथा लाइभ समाचार पोर्टल
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <button
                onClick={() => setShowAdminControlSuite(true)}
                className="px-2.5 py-1 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-red-700 dark:text-rose-300 font-black border border-red-200 dark:border-red-800/60 flex items-center gap-1 transition-transform active:scale-95"
              >
                🔐 व्यवस्थापक नियन्त्रण (Admin Control)
              </button>
              <span>•</span>
              <button
                onClick={() => setShowLocationModal(true)}
                className="hover:text-red-600 dark:hover:text-rose-400 font-bold"
              >
                📍 स्थान ({currentLocation.nameNepali.split(' ')[0]})
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('news')}
                className="hover:text-red-600 dark:hover:text-rose-400 font-bold flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                ताजा समाचार
              </button>
              <span>•</span>
              <button
                onClick={() => setShowAdminLab(true)}
                className="hover:text-red-600 dark:hover:text-rose-400 font-bold"
              >
                गणना प्रयोगशाला
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('wall_calendar')}
                className="hover:text-red-600 dark:hover:text-rose-400 font-semibold"
              >
                भित्ते पात्रो
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* 6. Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        adminConfig={adminConfig}
        onOpenAdminControl={() => setShowAdminControlSuite(true)}
      />

      {/* 7. Modals */}
      {/* Comprehensive Admin Control Suite Modal */}
      {showAdminControlSuite && (
        <AdminControlSuiteModal
          currentConfig={adminConfig}
          onSaveConfig={handleUpdateAdminConfig}
          onClose={() => setShowAdminControlSuite(false)}
          onOpenTestLab={() => setShowAdminLab(true)}
        />
      )}

      {/* Quick Article Reader Modal */}
      {selectedReaderArticle && (
        <NewsReaderModal
          article={selectedReaderArticle}
          onClose={() => setSelectedReaderArticle(null)}
        />
      )}

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
