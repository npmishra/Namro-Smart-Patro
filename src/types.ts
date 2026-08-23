export type CalculationMethodType =
  | 'surya_siddhanta' // शुद्ध सूर्य सिद्धान्त
  | 'ketaki' // केतकी सिद्धान्त
  | 'ketaki_nepali' // केतकी नेपाली पञ्चाङ्ग
  | 'drik' // दृक् सिद्धान्त
  | 'namro_custom'; // Namro Custom Calculation

export interface CalculationMethodInfo {
  id: CalculationMethodType;
  nameNepali: string;
  nameEnglish: string;
  description: string;
  basis: string;
  ayanamsaType: string;
  precision: 'Standard' | 'High' | 'Very High' | 'Traditional';
}

export interface LocationData {
  id: string;
  nameNepali: string;
  nameEnglish: string;
  province: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  timezone: string; // e.g. 'Asia/Kathmandu'
  timezoneOffsetMinutes: number; // +345 for Nepal (+5:45)
  isDefault?: boolean;
}

export interface BSDate {
  year: number;
  month: number; // 1 to 12
  day: number; // 1 to 32
}

export interface ADDate {
  year: number;
  month: number; // 1 to 12
  day: number; // 1 to 31
}

export interface SolarMoonPositions {
  sunLongitude: number; // 0 to 360 deg
  moonLongitude: number; // 0 to 360 deg
  sunDeclination: number;
  sunRightAscension: number;
  equationOfTimeMinutes: number;
  lunarPhasePercentage: number; // 0 - 100%
  lunarPhaseName: string;
  lunarAgeDays: number;
  sunDistanceAU: number;
  moonDistanceKm: number;
  ayanamsaDeg: number;
}

export interface SunMoonTimes {
  sunrise: string; // HH:MM AM/PM
  sunset: string; // HH:MM AM/PM
  solarNoon: string;
  dayLength: string; // e.g. "12 घण्टा ३० मिनेट"
  nightLength: string;
  moonrise: string;
  moonset: string;
  brahmaMuhurat: string; // HH:MM - HH:MM
  pradoshKaal: string;
  godhuliKaal: string;
  abhijitMuhurat: string;
  rahuKaal: string;
  yamagandaKaal: string;
  gulikaKaal: string;
  dishaShoola: {
    direction: string;
    directionNepali: string;
    remedy: string;
    remedyNepali: string;
  };
}

export interface TithiInfo {
  number: number; // 1 to 30
  nameNepali: string;
  nameEnglish: string;
  paksha: 'shukla' | 'krishna';
  pakshaNepali: string;
  endTime: string;
  percentageLeft: number;
  isSpecial: boolean;
  specialBadge?: string;
}

export interface NakshatraInfo {
  number: number; // 1 to 27
  nameNepali: string;
  nameEnglish: string;
  pada: number; // 1 to 4
  rulerNepali: string;
  endTime: string;
}

export interface YogaInfo {
  number: number; // 1 to 27
  nameNepali: string;
  nameEnglish: string;
  endTime: string;
}

export interface KaranaInfo {
  number: number; // 1 to 11
  nameNepali: string;
  nameEnglish: string;
  isVishtiBhadra: boolean;
  endTime: string;
}

export interface RashiInfo {
  sunRashiNumber: number; // 1 to 12
  sunRashiNepali: string;
  sunRashiEnglish: string;
  moonRashiNumber: number; // 1 to 12
  moonRashiNepali: string;
  moonRashiEnglish: string;
}

export interface DailyPanchang {
  bsDate: BSDate;
  adDate: ADDate;
  weekday: number; // 0=Sunday, 6=Saturday
  weekdayNepali: string;
  weekdayEnglish: string;
  calculationMethod: CalculationMethodType;
  location: LocationData;
  tithi: TithiInfo;
  nakshatra: NakshatraInfo;
  yoga: YogaInfo;
  karana: KaranaInfo;
  rashi: RashiInfo;
  astronomy: SunMoonTimes;
  positions: SolarMoonPositions;
  sankranti?: string;
  samvat: {
    bikramSambhat: number;
    shakaSambhat: number;
    nepalSambhat: number;
    kaliYugaYear: number;
    ayanamNepali: string; // उत्तरायण / दक्षिणायन
    rituNepali: string; // वसन्त, ग्रीष्म, वर्षा, शरद, हेमन्त, शिशिर
  };
  festivals: FestivalItem[];
  holidays: HolidayItem[];
  isPurnima: boolean;
  isAunsi: boolean;
  isEkadashi: boolean;
  isSankranti: boolean;
}

export interface FestivalItem {
  id: string;
  nameNepali: string;
  nameEnglish: string;
  descriptionNepali: string;
  category: 'national' | 'religious' | 'cultural' | 'vrata' | 'jayanti';
  categoryNepali: string;
  isMajor: boolean;
  colorBadge?: string;
  ritualsNepali?: string;
}

export interface HolidayItem {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  type: 'national' | 'public' | 'regional' | 'bank' | 'women_only' | 'school';
  typeNepali: string;
  isGazetted: boolean;
  applicableRegions: string[]; // ['all'] or province ids
  descriptionNepali?: string;
}

export interface CalendarDayCell {
  bsDate: BSDate;
  adDate: ADDate;
  weekday: number; // 0 to 6
  isToday: boolean;
  isCurrentMonth: boolean;
  isSaturday: boolean;
  hasHoliday: boolean;
  holidayTitle?: string;
  hasFestival: boolean;
  festivalTitle?: string;
  tithiNameNepali: string;
  tithiNumber: number;
  eventsCount: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  sourceLogo?: string;
  category: string;
  publishedAt: string;
  summary: string;
  originalUrl: string;
  imageUrl?: string;
  readTimeMinutes: number;
}

export interface PersonalEvent {
  id: string;
  title: string;
  description?: string;
  bsDate: BSDate;
  time?: string;
  category: 'birthday' | 'anniversary' | 'puja' | 'meeting' | 'reminder';
  repeat: 'none' | 'yearly_bs' | 'monthly_bs' | 'yearly_ad';
  notify: boolean;
  color: string;
  createdAt: string;
}

export interface MuhuratItem {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  descriptionNepali: string;
  suitableMonths: number[]; // BS months 1-12
  idealNakshatras: string[];
  idealTithis: string[];
  forbiddenConditions: string[];
  nextDatesBS: { bsDate: string; adDate: string; timing: string; remarks: string }[];
}

export interface VerificationTestResult {
  id: string;
  module: 'BS_AD_CONVERSION' | 'ASTRONOMY' | 'TITHI' | 'SUNRISE_SUNSET' | 'BOUNDARY_CHECKS' | 'FESTIVAL_RULES';
  title: string;
  inputDescription: string;
  expectedOutput: string;
  actualOutput: string;
  difference: string;
  tolerance: string;
  passed: boolean;
}

export interface CompanyProfile {
  companyNameNepali: string;
  companyNameEnglish: string;
  taglineNepali: string;
  taglineEnglish: string;
  shortCode: string;

  // Contact info
  phonePrimary: string;
  phoneSecondary: string;
  tollFreeNumber: string;
  emailPrimary: string;
  emailSupport: string;

  // Address info
  addressLine1Nepali: string;
  addressLine1English: string;
  districtNepali: string;
  provinceNepali: string;
  countryNepali: string;
  postalCode: string;

  // Legal & Registration
  panNumber: string;
  registrationNumber: string;
  copyrightNoticeNepali: string;

  // Web & Social
  websiteUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  whatsAppNumber: string;

  // Branding & Visual
  brandAccentColor: string;
  customLogoUrl?: string;
  customLogoEmoji?: string;
  displayOrganizationBadge: boolean;
}

export type AdminRole = 'admin' | 'user' | 'kiosk';

export interface AdminVisibilityConfig {
  version: number;
  lastUpdated: string;
  role: AdminRole;
  adminPin: string;
  isPinRequired: boolean;
  companyProfile: CompanyProfile;
  showTopMarketWeatherBar: boolean;
  showHeaderSearch: boolean;
  showHeaderLocation: boolean;
  showHeaderCalculationMethod: boolean;
  showHeaderThemeToggle: boolean;
  showHeaderAdminButton: boolean;
  showBreakingNewsTicker: boolean;
  showQuickServicesHub: boolean;
  showFloatingRadioPlayer: boolean;
  showBottomNavigation: boolean;
  showFooter: boolean;
  showDateHeroCard: boolean;
  showFestivalCountdownWidget: boolean;
  showCalendarMonthView: boolean;
  showDailyPanchangSidebar: boolean;
  showHomeDashboardWidgets: boolean;
  showHomeNewsWidget: boolean;
  showPanchangTithiBadges: boolean;
  showPanchangAstronomyTimings: boolean;
  showPanchangKaalDurmuhurat: boolean;
  enabledTabs: {
    calendar: boolean;
    panchang: boolean;
    news: boolean;
    rashifal: boolean;
    forex: boolean;
    radio: boolean;
    converter: boolean;
    muhurat: boolean;
    festivals: boolean;
    wall_calendar: boolean;
    events: boolean;
  };
  announcement: {
    enabled: boolean;
    textNepali: string;
    type: 'info' | 'alert' | 'festival' | 'celebration' | 'maintenance';
    actionText?: string;
    actionUrl?: string;
  };
  activePreset: 'custom' | 'full_portal' | 'minimal_patro' | 'media_focus' | 'vedic_astrology' | 'kiosk_display';
}

