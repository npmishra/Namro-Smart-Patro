import React from 'react';
import { Megaphone, AlertTriangle, Sparkles, Wrench, ExternalLink, X } from 'lucide-react';
import { AdminVisibilityConfig } from '../types';

interface AdminAnnouncementBannerProps {
  announcement: AdminVisibilityConfig['announcement'];
  onDismiss?: () => void;
}

export const AdminAnnouncementBanner: React.FC<AdminAnnouncementBannerProps> = ({
  announcement,
  onDismiss,
}) => {
  if (!announcement || !announcement.enabled || !announcement.textNepali) {
    return null;
  }

  const getTypeStyles = () => {
    switch (announcement.type) {
      case 'alert':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20',
          badge: 'bg-white/20 text-white',
          icon: <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />,
          label: 'जरुरी सूचना',
        };
      case 'festival':
      case 'celebration':
        return {
          bg: 'bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 text-white shadow-md shadow-amber-500/20',
          badge: 'bg-white/20 text-white',
          icon: <Sparkles className="w-4 h-4 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />,
          label: 'चाडपर्व शुभकामना',
        };
      case 'maintenance':
        return {
          bg: 'bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-md shadow-indigo-500/20',
          badge: 'bg-white/20 text-white',
          icon: <Wrench className="w-4 h-4 shrink-0" />,
          label: 'सिस्टम अपडेट',
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white dark:from-red-950 dark:via-slate-900 dark:to-slate-950 border-b border-red-500/30',
          badge: 'bg-red-600/60 text-red-100',
          icon: <Megaphone className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />,
          label: 'व्यवस्थापक सूचना',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`w-full py-2 px-3 sm:px-6 relative z-30 transition-all font-['Mukta',sans-serif] ${styles.bg}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="p-1 rounded-lg bg-white/15 backdrop-blur-xs shrink-0">
            {styles.icon}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${styles.badge}`}>
            {styles.label}
          </span>
          <p className="font-semibold truncate text-white drop-shadow-xs">
            {announcement.textNepali}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {announcement.actionText && (
            <button
              onClick={() => {
                if (announcement.actionUrl) {
                  if (announcement.actionUrl.startsWith('http')) {
                    window.open(announcement.actionUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    window.location.hash = announcement.actionUrl;
                  }
                }
              }}
              className="px-3 py-1 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1"
            >
              <span>{announcement.actionText}</span>
              {announcement.actionUrl?.startsWith('http') && <ExternalLink className="w-3 h-3" />}
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              title="बन्द गर्नुहोस्"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
