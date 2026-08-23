import { CalculationMethodType, CompanyProfile, AdminVisibilityConfig, AdminRole } from '../types';

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  companyNameNepali: 'नाम्रो स्मार्ट पात्रो',
  companyNameEnglish: 'Namro Smart Patro Pvt. Ltd.',
  taglineNepali: 'स्वतन्त्र नेपाली पात्रो, पञ्चाङ्ग, रेडियो तथा समाचार पोर्टल',
  taglineEnglish: "Nepal's Independent Digital Calendar & Vedic Panchang Portal",
  shortCode: 'NSP',

  // Contact info
  phonePrimary: '+९७७-०१-४४९८७६५',
  phoneSecondary: '+९७७-९८०१२३४५६७',
  tollFreeNumber: '१६६०-०१-९९९९९',
  emailPrimary: 'info@namrosmartpatro.com',
  emailSupport: 'support@namrosmartpatro.com',

  // Address info
  addressLine1Nepali: 'अनामनगर, काठमाडौं',
  addressLine1English: 'Anamnagar, Kathmandu',
  districtNepali: 'काठमाडौँ',
  provinceNepali: 'बागमती प्रदेश',
  countryNepali: 'नेपाल',
  postalCode: '४४६००',

  // Legal & Registration
  panNumber: '६०१२३४५६७',
  registrationNumber: '२३४५६७/०७८/०७९',
  copyrightNoticeNepali: '© २०८३ नाम्रो इन्फोटेक प्रालि। सर्वाधिकार सुरक्षित।',

  // Web & Social
  websiteUrl: 'https://namrosmartpatro.com',
  facebookUrl: 'https://facebook.com/namrosmartpatro',
  youtubeUrl: 'https://youtube.com/@namrosmartpatro',
  twitterUrl: 'https://twitter.com/namrosmartpatro',
  whatsAppNumber: '+9779801234567',

  // Branding & Visual
  brandAccentColor: '#DC2626',
  customLogoUrl: '',
  customLogoEmoji: '☀️',
  displayOrganizationBadge: true,
};

export const DEFAULT_ADMIN_CONFIG: AdminVisibilityConfig = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  role: 'admin', // default state allows easy inspection, can toggle to 'user' mode
  adminPin: '2083',
  isPinRequired: false,
  companyProfile: DEFAULT_COMPANY_PROFILE,

  // 1. Header elements
  showTopMarketWeatherBar: true,
  showHeaderSearch: true,
  showHeaderLocation: true,
  showHeaderCalculationMethod: true,
  showHeaderThemeToggle: true,
  showHeaderAdminButton: true,

  // 2. Dynamic Stream Bars
  showBreakingNewsTicker: true,
  showQuickServicesHub: true,
  showFloatingRadioPlayer: true,
  showBottomNavigation: true,
  showFooter: true,

  // 3. Home / Calendar Components
  showDateHeroCard: true,
  showFestivalCountdownWidget: true,
  showCalendarMonthView: true,
  showDailyPanchangSidebar: true,
  showHomeDashboardWidgets: true,
  showHomeNewsWidget: true,

  // 4. Granular Panchang
  showPanchangTithiBadges: true,
  showPanchangAstronomyTimings: true,
  showPanchangKaalDurmuhurat: true,

  // 5. Enabled Tabs
  enabledTabs: {
    calendar: true,
    panchang: true,
    news: true,
    rashifal: true,
    forex: true,
    radio: true,
    converter: true,
    muhurat: true,
    festivals: true,
    wall_calendar: true,
    events: true,
  },

  // 6. Announcement
  announcement: {
    enabled: false,
    textNepali: 'शुभकामना! नाम्रो स्मार्ट पात्रोमा नयाँ अपडेटहरू थपिएका छन्।',
    type: 'info',
    actionText: 'हेर्नुहोस्',
    actionUrl: '',
  },

  activePreset: 'full_portal',
};

const STORAGE_KEY = 'namro_smart_patro_admin_config_v1';
const SESSION_AUTH_KEY = 'namro_admin_authenticated';

export function getStoredAdminConfig(): AdminVisibilityConfig {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ADMIN_CONFIG,
      ...parsed,
      companyProfile: {
        ...DEFAULT_COMPANY_PROFILE,
        ...(parsed.companyProfile || {}),
      },
      enabledTabs: {
        ...DEFAULT_ADMIN_CONFIG.enabledTabs,
        ...(parsed.enabledTabs || {}),
      },
      announcement: {
        ...DEFAULT_ADMIN_CONFIG.announcement,
        ...(parsed.announcement || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load admin config', e);
    return DEFAULT_ADMIN_CONFIG;
  }
}

export function saveAdminConfig(config: AdminVisibilityConfig): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      ...config,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also attempt async sync with backend
    fetch('/api/v1/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {
      // Background sync silent catch
    });
  } catch (e) {
    console.error('Failed to save admin config', e);
  }
}

export const saveStoredAdminConfig = saveAdminConfig;

export function isSessionAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setSessionAdminAuthenticated(auth: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (auth) {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    }
  } catch (e) {}
}

export interface PresetOption {
  id: AdminVisibilityConfig['activePreset'];
  titleNepali: string;
  descriptionNepali: string;
  badge: string;
  iconColor: string;
  apply: (base: AdminVisibilityConfig) => AdminVisibilityConfig;
}

export const ADMIN_PRESETS: PresetOption[] = [
  {
    id: 'full_portal',
    titleNepali: '१. सम्पूर्ण सुपर-एप पोर्टल (Full Portal)',
    descriptionNepali: 'सबै मोड्युलहरू, लाइभ समाचार, रेडियो, सुनचाँदी, पञ्चाङ्ग र विजेटहरू सक्रिय।',
    badge: 'सिफारिस गरिएको',
    iconColor: 'bg-red-500',
    apply: (base) => ({
      ...base,
      activePreset: 'full_portal',
      showTopMarketWeatherBar: true,
      showHeaderSearch: true,
      showHeaderLocation: true,
      showHeaderCalculationMethod: true,
      showBreakingNewsTicker: true,
      showQuickServicesHub: true,
      showFloatingRadioPlayer: true,
      showBottomNavigation: true,
      showFooter: true,
      showDateHeroCard: true,
      showFestivalCountdownWidget: true,
      showCalendarMonthView: true,
      showDailyPanchangSidebar: true,
      showHomeDashboardWidgets: true,
      showHomeNewsWidget: true,
      enabledTabs: {
        calendar: true,
        panchang: true,
        news: true,
        rashifal: true,
        forex: true,
        radio: true,
        converter: true,
        muhurat: true,
        festivals: true,
        wall_calendar: true,
        events: true,
      },
    }),
  },
  {
    id: 'minimal_patro',
    titleNepali: '२. सरल तथा शुद्ध पात्रो (Minimalist Calendar)',
    descriptionNepali: 'समाचार र बाह्य विजेटहरू हटाई केवल महिना क्यालेन्डर, चाडपर्व र पञ्चाङ्ग मात्र देखाउने।',
    badge: 'क्लिन लुक',
    iconColor: 'bg-emerald-500',
    apply: (base) => ({
      ...base,
      activePreset: 'minimal_patro',
      showTopMarketWeatherBar: false,
      showBreakingNewsTicker: false,
      showQuickServicesHub: false,
      showFloatingRadioPlayer: false,
      showHomeDashboardWidgets: false,
      showHomeNewsWidget: false,
      showDateHeroCard: true,
      showFestivalCountdownWidget: true,
      showCalendarMonthView: true,
      showDailyPanchangSidebar: true,
      enabledTabs: {
        calendar: true,
        panchang: true,
        news: false,
        rashifal: false,
        forex: false,
        radio: false,
        converter: true,
        muhurat: true,
        festivals: true,
        wall_calendar: true,
        events: true,
      },
    }),
  },
  {
    id: 'media_focus',
    titleNepali: '३. समाचार तथा मिडिया केन्द्रित (News & Media Focus)',
    descriptionNepali: 'ताजा समाचार, ब्रेकिङ न्युज टिकर, प्रत्यक्ष रेडियो, विदेशी मुद्रा र क्यालेन्डर प्राथमिकता।',
    badge: 'रातोपाटी शैली',
    iconColor: 'bg-blue-500',
    apply: (base) => ({
      ...base,
      activePreset: 'media_focus',
      showTopMarketWeatherBar: true,
      showBreakingNewsTicker: true,
      showQuickServicesHub: true,
      showFloatingRadioPlayer: true,
      showHomeNewsWidget: true,
      showHomeDashboardWidgets: true,
      showDateHeroCard: true,
      showCalendarMonthView: true,
      showDailyPanchangSidebar: true,
      enabledTabs: {
        calendar: true,
        panchang: true,
        news: true,
        rashifal: true,
        forex: true,
        radio: true,
        converter: false,
        muhurat: false,
        festivals: true,
        wall_calendar: false,
        events: false,
      },
    }),
  },
  {
    id: 'vedic_astrology',
    titleNepali: '४. वैदिक पञ्चाङ्ग तथा ज्योतिष (Vedic Astrology & Muhurat)',
    descriptionNepali: 'गहन पञ्चाङ्ग, शुभ साइत, १२ राशिको राशिफल, काल/मुहूर्त र चाडपर्वहरूमा केन्द्रित।',
    badge: 'वैदिक',
    iconColor: 'bg-amber-500',
    apply: (base) => ({
      ...base,
      activePreset: 'vedic_astrology',
      showTopMarketWeatherBar: false,
      showBreakingNewsTicker: false,
      showFloatingRadioPlayer: false,
      showHomeNewsWidget: false,
      showQuickServicesHub: true,
      showDateHeroCard: true,
      showFestivalCountdownWidget: true,
      showCalendarMonthView: true,
      showDailyPanchangSidebar: true,
      showHomeDashboardWidgets: true,
      showPanchangTithiBadges: true,
      showPanchangAstronomyTimings: true,
      showPanchangKaalDurmuhurat: true,
      enabledTabs: {
        calendar: true,
        panchang: true,
        news: false,
        rashifal: true,
        forex: false,
        radio: false,
        converter: true,
        muhurat: true,
        festivals: true,
        wall_calendar: true,
        events: true,
      },
    }),
  },
  {
    id: 'kiosk_display',
    titleNepali: '५. डिजिटल टिभी/कार्यालय डिस्प्ले (Kiosk / Office Display)',
    descriptionNepali: 'कार्यालय, मन्दिर, होटल वा स्क्रिनमा डिस्प्ले गर्न उपयुक्त सफा तथा ठूलो पात्रो मोड।',
    badge: 'टिभी/किओस्क',
    iconColor: 'bg-purple-500',
    apply: (base) => ({
      ...base,
      activePreset: 'kiosk_display',
      role: 'kiosk',
      showTopMarketWeatherBar: true,
      showBreakingNewsTicker: true,
      showQuickServicesHub: false,
      showFloatingRadioPlayer: false,
      showBottomNavigation: false,
      showHomeNewsWidget: false,
      showDateHeroCard: true,
      showFestivalCountdownWidget: true,
      showCalendarMonthView: true,
      showDailyPanchangSidebar: true,
      showHomeDashboardWidgets: true,
      enabledTabs: {
        calendar: true,
        panchang: true,
        news: false,
        rashifal: true,
        forex: true,
        radio: false,
        converter: false,
        muhurat: true,
        festivals: true,
        wall_calendar: false,
        events: false,
      },
    }),
  },
];
