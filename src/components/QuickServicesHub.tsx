import React from 'react';
import {
  Calendar,
  Compass,
  Star,
  ArrowLeftRight,
  Coins,
  Radio,
  Newspaper,
  Heart,
  CalendarCheck,
  Printer,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { AdminVisibilityConfig } from '../types';

interface QuickServicesHubProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  adminConfig?: AdminVisibilityConfig;
}

export const QuickServicesHub: React.FC<QuickServicesHubProps> = ({
  activeTab,
  onTabChange,
  adminConfig,
}) => {
  if (adminConfig && !adminConfig.showQuickServicesHub) {
    return null;
  }

  const allServices = [
    {
      id: 'calendar',
      labelNepali: 'पात्रो',
      sublabel: 'दैनिक क्यालेन्डर',
      icon: <Calendar className="w-5 h-5 text-red-600 dark:text-rose-400" />,
      badge: null,
      bgLight: 'bg-red-50 hover:bg-red-100/80 dark:bg-red-950/40 dark:hover:bg-red-900/50',
    },
    {
      id: 'panchang',
      labelNepali: 'पञ्चाङ्ग',
      sublabel: 'तिथि, नक्षत्र, योग',
      icon: <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      badge: null,
      bgLight: 'bg-amber-50 hover:bg-amber-100/80 dark:bg-amber-950/40 dark:hover:bg-amber-900/50',
    },
    {
      id: 'news',
      labelNepali: 'ताजा समाचार',
      sublabel: 'प्रत्यक्ष लाइभ फिड',
      icon: <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      badge: 'लाइभ',
      bgLight: 'bg-blue-50 hover:bg-blue-100/80 dark:bg-blue-950/40 dark:hover:bg-blue-900/50',
    },
    {
      id: 'rashifal',
      labelNepali: 'राशिफल',
      sublabel: 'दैनिक/मासिक भाग्य',
      icon: <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      badge: null,
      bgLight: 'bg-purple-50 hover:bg-purple-100/80 dark:bg-purple-950/40 dark:hover:bg-purple-900/50',
    },
    {
      id: 'forex',
      labelNepali: 'सुनचाँदी/मुद्रा',
      sublabel: 'NRB विनिमय दर',
      icon: <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      badge: null,
      bgLight: 'bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50',
    },
    {
      id: 'radio',
      labelNepali: 'प्रत्यक्ष रेडियो',
      sublabel: 'नेपाली एफएम/अनलाइन',
      icon: <Radio className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
      badge: 'FM',
      bgLight: 'bg-orange-50 hover:bg-orange-100/80 dark:bg-orange-950/40 dark:hover:bg-orange-900/50',
    },
    {
      id: 'converter',
      labelNepali: 'मिति रूपान्तरण',
      sublabel: 'BS ↔ AD कन्भर्टर',
      icon: <ArrowLeftRight className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      badge: null,
      bgLight: 'bg-cyan-50 hover:bg-cyan-100/80 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50',
    },
    {
      id: 'muhurat',
      labelNepali: 'शुभ साइत',
      sublabel: 'विवाह, गृहप्रवेश',
      icon: <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      badge: null,
      bgLight: 'bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/50',
    },
    {
      id: 'festivals',
      labelNepali: 'चाडपर्व तथा बिदा',
      sublabel: '२०८३ का चाडपर्व',
      icon: <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
      badge: null,
      bgLight: 'bg-yellow-50 hover:bg-yellow-100/80 dark:bg-yellow-950/40 dark:hover:bg-yellow-900/50',
    },
    {
      id: 'events',
      labelNepali: 'मेरा घटना',
      sublabel: 'व्यक्तिगत नोट/स्मृति',
      icon: <CalendarCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      badge: null,
      bgLight: 'bg-teal-50 hover:bg-teal-100/80 dark:bg-teal-950/40 dark:hover:bg-teal-900/50',
    },
    {
      id: 'wall_calendar',
      labelNepali: 'भित्ते पात्रो',
      sublabel: 'प्रिन्ट योग्य क्यालेन्डर',
      icon: <Printer className="w-5 h-5 text-slate-700 dark:text-slate-300" />,
      badge: 'HD',
      bgLight: 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700',
    },
  ];

  const services = allServices.filter(
    (srv) => !adminConfig || adminConfig.enabledTabs[srv.id as keyof AdminVisibilityConfig['enabledTabs']] !== false
  );

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 font-['Mukta',sans-serif]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-4 rounded-full bg-red-600" />
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            स्मार्ट सेवा तथा सुविधाहरू (All-in-One Services)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          सबै सुविधाहरू एकै ठाउँमा ({services.length} उपलब्ध)
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5 sm:gap-3">
        {services.map((srv) => {
          const isActive = activeTab === srv.id;

          return (
            <button
              key={srv.id}
              onClick={() => onTabChange(srv.id)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group ${
                isActive
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20 scale-[1.02]'
                  : `border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 ${srv.bgLight}`
              }`}
            >
              {/* Badge if available */}
              {srv.badge && (
                <span
                  className={`absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-wide ${
                    srv.badge === 'लाइभ'
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {srv.badge}
                </span>
              )}

              <div
                className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
                  isActive ? 'bg-white/20 text-white' : ''
                }`}
              >
                {React.cloneElement(srv.icon as React.ReactElement, {
                  className: `w-5 h-5 ${
                    isActive ? 'text-white' : ''
                  }`,
                })}
              </div>

              <span
                className={`text-xs font-black mt-1.5 text-center leading-tight ${
                  isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {srv.labelNepali}
              </span>

              <span
                className={`text-[9px] text-center hidden md:block mt-0.5 truncate max-w-full ${
                  isActive ? 'text-white/80' : 'text-slate-400'
                }`}
              >
                {srv.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
