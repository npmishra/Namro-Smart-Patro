import React, { useState } from 'react';
import {
  Calendar,
  Compass,
  Star,
  ArrowLeftRight,
  Coins,
  Menu,
  Sparkles,
  Newspaper,
  Heart,
  CalendarCheck,
  Radio,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { AdminVisibilityConfig } from '../types';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  adminConfig?: AdminVisibilityConfig;
  onOpenAdminControl?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  adminConfig,
  onOpenAdminControl,
}) => {
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  if (adminConfig && !adminConfig.showBottomNavigation) {
    return null;
  }

  const allMainNavItems = [
    { id: 'calendar', labelNepali: 'पात्रो', icon: <Calendar className="w-5 h-5" /> },
    { id: 'panchang', labelNepali: 'पञ्चाङ्ग', icon: <Compass className="w-5 h-5" /> },
    { id: 'news', labelNepali: 'समाचार', icon: <Newspaper className="w-5 h-5" />, isLive: true },
    { id: 'rashifal', labelNepali: 'राशिफल', icon: <Star className="w-5 h-5" /> },
    { id: 'forex', labelNepali: 'मुद्रा/सुन', icon: <Coins className="w-5 h-5" /> },
  ];

  const allMoreItems = [
    { id: 'converter', labelNepali: 'मिति रूपान्तरण (Date Converter)', icon: <ArrowLeftRight className="w-5 h-5 text-blue-500" /> },
    { id: 'festivals', labelNepali: 'चाडपर्व तथा बिदा', icon: <Sparkles className="w-5 h-5 text-amber-500" /> },
    { id: 'radio', labelNepali: 'नेपाली प्रत्यक्ष रेडियो', icon: <Radio className="w-5 h-5 text-purple-500" /> },
    { id: 'muhurat', labelNepali: 'शुभ साइत तथा मुहूर्त', icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { id: 'events', labelNepali: 'व्यक्तिगत घटना', icon: <CalendarCheck className="w-5 h-5 text-emerald-500" /> },
    { id: 'wall_calendar', labelNepali: 'भित्ते पात्रो प्रिन्ट', icon: <Printer className="w-5 h-5 text-red-500" /> },
  ];

  // Filter based on admin configuration
  const mainNavItems = allMainNavItems.filter(
    (item) => !adminConfig || adminConfig.enabledTabs[item.id as keyof AdminVisibilityConfig['enabledTabs']] !== false
  );

  const moreItems = allMoreItems.filter(
    (item) => !adminConfig || adminConfig.enabledTabs[item.id as keyof AdminVisibilityConfig['enabledTabs']] !== false
  );

  if (mainNavItems.length === 0 && moreItems.length === 0) {
    return null;
  }

  const gridColsClass =
    mainNavItems.length >= 5
      ? 'grid-cols-6'
      : mainNavItems.length === 4
      ? 'grid-cols-5'
      : mainNavItems.length === 3
      ? 'grid-cols-4'
      : mainNavItems.length === 2
      ? 'grid-cols-3'
      : 'grid-cols-2';

  return (
    <>
      <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
        <div className={`grid ${gridColsClass} gap-1 text-center items-center`}>
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setShowMoreDrawer(false);
                }}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-red-600 dark:text-rose-400 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`relative p-1 rounded-lg ${isActive ? 'bg-red-50 dark:bg-red-950/60' : ''}`}>
                  {item.icon}
                  {item.isLive && (
                    <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-['Mukta',sans-serif]">
                  {item.labelNepali}
                </span>
              </button>
            );
          })}

          {/* More Trigger (or Admin Trigger if more items exist) */}
          {moreItems.length > 0 && (
            <button
              onClick={() => setShowMoreDrawer(!showMoreDrawer)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                showMoreDrawer || moreItems.some((m) => m.id === activeTab)
                  ? 'text-red-600 dark:text-rose-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-lg ${showMoreDrawer ? 'bg-red-50 dark:bg-red-950/60' : ''}`}>
                <Menu className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5 font-['Mukta',sans-serif]">
                थप मेन्यु
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile More Bottom Sheet Drawer */}
      {showMoreDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end">
          <div className="bg-white dark:bg-slate-900 w-full rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                थप सेवाहरू तथा औजारहरू (More Services)
              </span>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setShowMoreDrawer(false);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-colors ${
                    activeTab === item.id
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-600 dark:text-rose-400 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold font-['Mukta',sans-serif]">
                    {item.labelNepali}
                  </span>
                </button>
              ))}

              {onOpenAdminControl && (
                <button
                  onClick={() => {
                    setShowMoreDrawer(false);
                    onOpenAdminControl();
                  }}
                  className="p-3 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/30 text-left flex items-center gap-3 col-span-2 text-red-600 dark:text-rose-400 font-bold"
                >
                  <div className="p-2 rounded-xl bg-red-600 text-white shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-['Mukta',sans-serif]">
                      व्यवस्थापक नियन्त्रण (Admin Control)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      दृश्यता तथा मोड्युल अन/अफ स्विच
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
