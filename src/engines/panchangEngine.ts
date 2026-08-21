import {
  ADDate,
  BSDate,
  CalculationMethodType,
  DailyPanchang,
  KaranaInfo,
  LocationData,
  NakshatraInfo,
  RashiInfo,
  TithiInfo,
  YogaInfo,
} from '../types';
import {
  adToBs,
  bsToAd,
  getDaysInBSMonth,
  getWeekday,
  NEPALI_WEEKDAYS,
  toNepaliDigits,
} from './calendarEngine';
import {
  calculateSunMoonPositions,
  calculateSunMoonTimes,
  formatTimeFromMinutes,
} from './astronomyEngine';
import { getFestivalsForDate } from './festivalEngine';
import { getHolidaysForDate } from './holidayEngine';

export const TITHI_NAMES = [
  { num: 1, nep: 'प्रतिपदा', eng: 'Pratipada', pak: 'shukla' },
  { num: 2, nep: 'द्वितीया', eng: 'Dwitiya', pak: 'shukla' },
  { num: 3, nep: 'तृतीया', eng: 'Tritiya', pak: 'shukla' },
  { num: 4, nep: 'चतुर्थी', eng: 'Chaturthi', pak: 'shukla' },
  { num: 5, nep: 'पञ्चमी', eng: 'Panchami', pak: 'shukla' },
  { num: 6, nep: 'षष्ठी', eng: 'Shashthi', pak: 'shukla' },
  { num: 7, nep: 'सप्तमी', eng: 'Saptami', pak: 'shukla' },
  { num: 8, nep: 'अष्टमी', eng: 'Ashtami', pak: 'shukla' },
  { num: 9, nep: 'नवमी', eng: 'Navami', pak: 'shukla' },
  { num: 10, nep: 'दशमी', eng: 'Dashami', pak: 'shukla' },
  { num: 11, nep: 'एकादशी', eng: 'Ekadashi', pak: 'shukla' },
  { num: 12, nep: 'द्वादशी', eng: 'Dwadashi', pak: 'shukla' },
  { num: 13, nep: 'त्रयोदशी', eng: 'Trayodashi', pak: 'shukla' },
  { num: 14, nep: 'चतुर्दशी', eng: 'Chaturdashi', pak: 'shukla' },
  { num: 15, nep: 'पूर्णिमा', eng: 'Purnima', pak: 'shukla' },
  { num: 16, nep: 'प्रतिपदा (कृष्ण)', eng: 'Krishna Pratipada', pak: 'krishna' },
  { num: 17, nep: 'द्वितीया (कृष्ण)', eng: 'Krishna Dwitiya', pak: 'krishna' },
  { num: 18, nep: 'तृतीया (कृष्ण)', eng: 'Krishna Tritiya', pak: 'krishna' },
  { num: 19, nep: 'चतुर्थी (कृष्ण)', eng: 'Krishna Chaturthi', pak: 'krishna' },
  { num: 20, nep: 'पञ्चमी (कृष्ण)', eng: 'Krishna Panchami', pak: 'krishna' },
  { num: 21, nep: 'षष्ठी (कृष्ण)', eng: 'Krishna Shashthi', pak: 'krishna' },
  { num: 22, nep: 'सप्तमी (कृष्ण)', eng: 'Krishna Saptami', pak: 'krishna' },
  { num: 23, nep: 'अष्टमी (कृष्ण)', eng: 'Krishna Ashtami', pak: 'krishna' },
  { num: 24, nep: 'नवमी (कृष्ण)', eng: 'Krishna Navami', pak: 'krishna' },
  { num: 25, nep: 'दशमी (कृष्ण)', eng: 'Krishna Dashami', pak: 'krishna' },
  { num: 26, nep: 'एकादशी (कृष्ण)', eng: 'Krishna Ekadashi', pak: 'krishna' },
  { num: 27, nep: 'द्वादशी (कृष्ण)', eng: 'Krishna Dwadashi', pak: 'krishna' },
  { num: 28, nep: 'त्रयोदशी (कृष्ण)', eng: 'Krishna Trayodashi', pak: 'krishna' },
  { num: 29, nep: 'चतुर्दशी (कृष्ण)', eng: 'Krishna Chaturdashi', pak: 'krishna' },
  { num: 30, nep: 'औंसी (अमावस्या)', eng: 'Amavasya (Aunsi)', pak: 'krishna' },
];

export const NAKSHATRA_NAMES = [
  { num: 1, nep: 'अश्विनी', eng: 'Ashwini', ruler: 'केतु' },
  { num: 2, nep: 'भरणी', eng: 'Bharani', ruler: 'शुक्र' },
  { num: 3, nep: 'कृत्तिका', eng: 'Krittika', ruler: 'सूर्य' },
  { num: 4, nep: 'रोहिणी', eng: 'Rohini', ruler: 'चन्द्रमा' },
  { num: 5, nep: 'मृगशिरा', eng: 'Mrigashira', ruler: 'मंगल' },
  { num: 6, nep: 'आर्द्रा', eng: 'Ardra', ruler: 'राहु' },
  { num: 7, nep: 'पुनर्वसु', eng: 'Punarvasu', ruler: 'बृहस्पति' },
  { num: 8, nep: 'पुष्य', eng: 'Pushya', ruler: 'शनि' },
  { num: 9, nep: 'अश्लेषा', eng: 'Ashlesha', ruler: 'बुध' },
  { num: 10, nep: 'मघा', eng: 'Magha', ruler: 'केतु' },
  { num: 11, nep: 'पूर्वाफाल्गुनी', eng: 'Purva Phalguni', ruler: 'शुक्र' },
  { num: 12, nep: 'उत्तराफाल्गुनी', eng: 'Uttara Phalguni', ruler: 'सूर्य' },
  { num: 13, nep: 'हस्त', eng: 'Hasta', ruler: 'चन्द्रमा' },
  { num: 14, nep: 'चित्रा', eng: 'Chitra', ruler: 'मंगल' },
  { num: 15, nep: 'स्वाती', eng: 'Swati', ruler: 'राहु' },
  { num: 16, nep: 'विशाखा', eng: 'Vishakha', ruler: 'बृहस्पति' },
  { num: 17, nep: 'अनुराधा', eng: 'Anuradha', ruler: 'शनि' },
  { num: 18, nep: 'ज्येष्ठा', eng: 'Jyeshtha', ruler: 'बुध' },
  { num: 19, nep: 'मूल', eng: 'Mula', ruler: 'केतु' },
  { num: 20, nep: 'पूर्वाषाढा', eng: 'Purvashada', ruler: 'शुक्र' },
  { num: 21, nep: 'उत्तराषाढा', eng: 'Uttarashada', ruler: 'सूर्य' },
  { num: 22, nep: 'श्रवण', eng: 'Shravana', ruler: 'चन्द्रमा' },
  { num: 23, nep: 'धनिष्ठा', eng: 'Dhanishta', ruler: 'मंगल' },
  { num: 24, nep: 'शतभिषा', eng: 'Shatabhisha', ruler: 'राहु' },
  { num: 25, nep: 'पूर्वाभाद्रपद', eng: 'Purva Bhadrapada', ruler: 'बृहस्पति' },
  { num: 26, nep: 'उत्तराभाद्रपद', eng: 'Uttara Bhadrapada', ruler: 'शनि' },
  { num: 27, nep: 'रेवती', eng: 'Revati', ruler: 'बुध' },
];

export const YOGA_NAMES = [
  { num: 1, nep: 'विष्कम्भ', eng: 'Vishkambha' },
  { num: 2, nep: 'प्रीति', eng: 'Priti' },
  { num: 3, nep: 'आयुष्मान्', eng: 'Ayushman' },
  { num: 4, nep: 'सौभाग्य', eng: 'Saubhagya' },
  { num: 5, nep: 'शोभन', eng: 'Shobhana' },
  { num: 6, nep: 'अतिगण्ड', eng: 'Atiganda' },
  { num: 7, nep: 'सुकर्मा', eng: 'Sukarma' },
  { num: 8, nep: 'धृति', eng: 'Dhriti' },
  { num: 9, nep: 'शूल', eng: 'Shoola' },
  { num: 10, nep: 'गण्ड', eng: 'Ganda' },
  { num: 11, nep: 'वृद्धि', eng: 'Vriddhi' },
  { num: 12, nep: 'ध्रुव', eng: 'Dhruva' },
  { num: 13, nep: 'व्याघात', eng: 'Vyaghata' },
  { num: 14, nep: 'हर्षण', eng: 'Harshana' },
  { num: 15, nep: 'वज्र', eng: 'Vajra' },
  { num: 16, nep: 'सिद्धि', eng: 'Siddhi' },
  { num: 17, nep: 'व्यतीपात', eng: 'Vyatipata' },
  { num: 18, nep: 'वरीयान्', eng: 'Variyan' },
  { num: 19, nep: 'परिघ', eng: 'Parigha' },
  { num: 20, nep: 'शिव', eng: 'Shiva' },
  { num: 21, nep: 'सिद्ध', eng: 'Siddha' },
  { num: 22, nep: 'साध्य', eng: 'Sadhya' },
  { num: 23, nep: 'शुभ', eng: 'Shubha' },
  { num: 24, nep: 'शुक्ल', eng: 'Shukla' },
  { num: 25, nep: 'ब्रह्म', eng: 'Brahma' },
  { num: 26, nep: 'ऐन्द्र', eng: 'Indra' },
  { num: 27, nep: 'वैधृति', eng: 'Vaidhriti' },
];

export const RASHI_NAMES = [
  { num: 1, nep: 'मेष', eng: 'Aries' },
  { num: 2, nep: 'वृष', eng: 'Taurus' },
  { num: 3, nep: 'मिथुन', eng: 'Gemini' },
  { num: 4, nep: 'कर्कट', eng: 'Cancer' },
  { num: 5, nep: 'सिंह', eng: 'Leo' },
  { num: 6, nep: 'कन्या', eng: 'Virgo' },
  { num: 7, nep: 'तुला', eng: 'Libra' },
  { num: 8, nep: 'वृश्चिक', eng: 'Scorpio' },
  { num: 9, nep: 'धनु', eng: 'Sagittarius' },
  { num: 10, nep: 'मकर', eng: 'Capricorn' },
  { num: 11, nep: 'कुम्भ', eng: 'Aquarius' },
  { num: 12, nep: 'मीन', eng: 'Pisces' },
];

const KARANA_NAMES = [
  { num: 1, nep: 'बव', eng: 'Bava', isBhadra: false },
  { num: 2, nep: 'बालव', eng: 'Balava', isBhadra: false },
  { num: 3, nep: 'कौलव', eng: 'Kaulava', isBhadra: false },
  { num: 4, nep: 'तैतिल', eng: 'Taitila', isBhadra: false },
  { num: 5, nep: 'गर', eng: 'Gara', isBhadra: false },
  { num: 6, nep: 'वणिज', eng: 'Vanija', isBhadra: false },
  { num: 7, nep: 'विष्टि (भद्रा)', eng: 'Vishti (Bhadra)', isBhadra: true },
  { num: 8, nep: 'शकुनि', eng: 'Shakuni', isBhadra: false },
  { num: 9, nep: 'चतुष्पाद', eng: 'Chatushpada', isBhadra: false },
  { num: 10, nep: 'नाग', eng: 'Naga', isBhadra: false },
  { num: 11, nep: 'किम्स्तुघ्न', eng: 'Kimstughna', isBhadra: false },
];

/**
 * Calculate full daily Panchang
 */
export function calculateDailyPanchang(
  dateInput: { bs?: BSDate; ad?: ADDate },
  location: LocationData,
  method: CalculationMethodType = 'drik'
): DailyPanchang {
  let bsDate: BSDate;
  let adDate: ADDate;

  if (dateInput.bs) {
    bsDate = dateInput.bs;
    adDate = bsToAd(bsDate);
  } else if (dateInput.ad) {
    adDate = dateInput.ad;
    bsDate = adToBs(adDate);
  } else {
    const now = new Date();
    adDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    bsDate = adToBs(adDate);
  }

  const weekday = getWeekday(adDate);
  const weekdayInfo = NEPALI_WEEKDAYS[weekday];

  // 1. Astronomy calculations
  const positions = calculateSunMoonPositions(adDate, method);
  const times = calculateSunMoonTimes(adDate, location, method);

  // 2. Tithi Calculation: (Moon Longitude - Sun Longitude) mod 360 / 12
  let elongation = positions.moonLongitude - positions.sunLongitude;
  if (elongation < 0) elongation += 360;
  const tithiFloat = elongation / 12.0;
  const tithiIndex = Math.floor(tithiFloat); // 0 to 29
  const tithiNumber = tithiIndex + 1; // 1 to 30
  const tithiData = TITHI_NAMES[tithiIndex] || TITHI_NAMES[0];

  const tithiFractionRemaining = 1.0 - (tithiFloat - tithiIndex);
  // Average Tithi duration ~ 23.6 hours
  const tithiRemainingMinutes = tithiFractionRemaining * 23.6 * 60;
  const tithiEndTime = formatTimeFromMinutes((12 * 60 + tithiRemainingMinutes) % 1440);

  const tithiInfo: TithiInfo = {
    number: tithiNumber,
    nameNepali: tithiData.nep,
    nameEnglish: tithiData.eng,
    paksha: tithiNumber <= 15 ? 'shukla' : 'krishna',
    pakshaNepali: tithiNumber <= 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष',
    endTime: tithiEndTime,
    percentageLeft: Math.round(tithiFractionRemaining * 100),
    isSpecial: tithiNumber === 11 || tithiNumber === 26 || tithiNumber === 15 || tithiNumber === 30,
    specialBadge:
      tithiNumber === 15
        ? 'पूर्णिमा'
        : tithiNumber === 30
        ? 'औंसी'
        : tithiNumber === 11 || tithiNumber === 26
        ? 'एकादशी'
        : undefined,
  };

  // 3. Nakshatra: Moon Longitude / (360/27 = 13°20' = 13.3333°)
  const nakshatraSpan = 360.0 / 27.0;
  const nakshatraFloat = positions.moonLongitude / nakshatraSpan;
  const nakshatraIndex = Math.floor(nakshatraFloat) % 27;
  const nakshatraData = NAKSHATRA_NAMES[nakshatraIndex] || NAKSHATRA_NAMES[0];
  const pada = (Math.floor((nakshatraFloat - nakshatraIndex) * 4) % 4) + 1;

  const nakshatraFractionRemaining = 1.0 - (nakshatraFloat - nakshatraIndex);
  const nakshatraRemainingMinutes = nakshatraFractionRemaining * 24.2 * 60;
  const nakshatraEndTime = formatTimeFromMinutes((12 * 60 + nakshatraRemainingMinutes) % 1440);

  const nakshatraInfo: NakshatraInfo = {
    number: nakshatraData.num,
    nameNepali: nakshatraData.nep,
    nameEnglish: nakshatraData.eng,
    pada,
    rulerNepali: nakshatraData.ruler,
    endTime: nakshatraEndTime,
  };

  // 4. Yoga: (Sun Longitude + Moon Longitude) mod 360 / 13°20'
  const yogaTotal = (positions.sunLongitude + positions.moonLongitude) % 360;
  const yogaFloat = yogaTotal / nakshatraSpan;
  const yogaIndex = Math.floor(yogaFloat) % 27;
  const yogaData = YOGA_NAMES[yogaIndex] || YOGA_NAMES[0];

  const yogaFractionRemaining = 1.0 - (yogaFloat - yogaIndex);
  const yogaRemainingMinutes = yogaFractionRemaining * 22.8 * 60;
  const yogaEndTime = formatTimeFromMinutes((12 * 60 + yogaRemainingMinutes) % 1440);

  const yogaInfo: YogaInfo = {
    number: yogaData.num,
    nameNepali: yogaData.nep,
    nameEnglish: yogaData.eng,
    endTime: yogaEndTime,
  };

  // 5. Karana: Half of Tithi (6 degrees each, 60 karanas in lunar month)
  const karanaFloat = elongation / 6.0;
  const karanaNumberInMonth = Math.floor(karanaFloat) + 1; // 1 to 60

  let karanaItem: (typeof KARANA_NAMES)[0];
  if (karanaNumberInMonth === 1) {
    karanaItem = KARANA_NAMES[10]; // Kimstughna (Shukla Pratipada first half)
  } else if (karanaNumberInMonth >= 58) {
    if (karanaNumberInMonth === 58) karanaItem = KARANA_NAMES[7]; // Shakuni
    else if (karanaNumberInMonth === 59) karanaItem = KARANA_NAMES[8]; // Chatushpada
    else karanaItem = KARANA_NAMES[9]; // Naga
  } else {
    // Repeating 7 moveable karanas
    const idx = (karanaNumberInMonth - 2) % 7;
    karanaItem = KARANA_NAMES[idx];
  }

  const karanaFractionRemaining = 1.0 - (karanaFloat - Math.floor(karanaFloat));
  const karanaEndTime = formatTimeFromMinutes((12 * 60 + karanaFractionRemaining * 11.8 * 60) % 1440);

  const karanaInfo: KaranaInfo = {
    number: karanaItem.num,
    nameNepali: karanaItem.nep,
    nameEnglish: karanaItem.eng,
    isVishtiBhadra: karanaItem.isBhadra,
    endTime: karanaEndTime,
  };

  // 6. Rashi: Sun Sign & Moon Sign
  const sunRashiIndex = Math.floor(positions.sunLongitude / 30.0) % 12;
  const moonRashiIndex = Math.floor(positions.moonLongitude / 30.0) % 12;
  const sunRashi = RASHI_NAMES[sunRashiIndex];
  const moonRashi = RASHI_NAMES[moonRashiIndex];

  const rashiInfo: RashiInfo = {
    sunRashiNumber: sunRashi.num,
    sunRashiNepali: sunRashi.nep,
    sunRashiEnglish: sunRashi.eng,
    moonRashiNumber: moonRashi.num,
    moonRashiNepali: moonRashi.nep,
    moonRashiEnglish: moonRashi.eng,
  };

  // 7. Samvat & Ritu
  // Ayanam
  const ayanamNepali = (positions.sunDeclination >= 0) ? 'उत्तरायण' : 'दक्षिणायन';

  // Ritu based on BS month
  const rituMap: Record<number, string> = {
    12: 'वसन्त ऋतु',
    1: 'वसन्त ऋतु',
    2: 'ग्रीष्म ऋतु',
    3: 'ग्रीष्म ऋतु',
    4: 'वर्षा ऋतु',
    5: 'वर्षा ऋतु',
    6: 'शरद ऋतु',
    7: 'शरद ऋतु',
    8: 'हेमन्त ऋतु',
    9: 'हेमन्त ऋतु',
    10: 'शिशिर ऋतु',
    11: 'शिशिर ऋतु',
  };

  const samvat = {
    bikramSambhat: bsDate.year,
    shakaSambhat: bsDate.year - 135,
    nepalSambhat: bsDate.year - 939,
    kaliYugaYear: bsDate.year + 3044,
    ayanamNepali,
    rituNepali: rituMap[bsDate.month] || 'वसन्त ऋतु',
  };

  // 8. Festivals and Holidays
  const festivals = getFestivalsForDate(bsDate, tithiNumber);
  const holidays = getHolidaysForDate(bsDate, tithiNumber, location.id);

  // Sankranti info if day 1
  let sankranti: string | undefined = undefined;
  if (bsDate.day === 1) {
    sankranti = `${sunRashi.nep} संक्रान्ति`;
  }

  return {
    bsDate,
    adDate,
    weekday,
    weekdayNepali: weekdayInfo.nameNepali,
    weekdayEnglish: weekdayInfo.nameEnglish,
    calculationMethod: method,
    location,
    tithi: tithiInfo,
    nakshatra: nakshatraInfo,
    yoga: yogaInfo,
    karana: karanaInfo,
    rashi: rashiInfo,
    astronomy: times,
    positions,
    sankranti,
    samvat,
    festivals,
    holidays,
    isPurnima: tithiNumber === 15,
    isAunsi: tithiNumber === 30,
    isEkadashi: tithiNumber === 11 || tithiNumber === 26,
    isSankranti: bsDate.day === 1,
  };
}

/**
 * Generate all days of a BS month with their Panchang / status indicators
 */
export function getMonthlyCalendarDays(
  bsYear: number,
  bsMonth: number,
  location: LocationData,
  method: CalculationMethodType = 'drik'
) {
  const totalDays = getDaysInBSMonth(bsYear, bsMonth);
  const days = [];

  // Today's check
  const now = new Date();
  const todayAD: ADDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  const todayBS = adToBs(todayAD);

  for (let day = 1; day <= totalDays; day++) {
    const curBS: BSDate = { year: bsYear, month: bsMonth, day };
    const curAD = bsToAd(curBS);
    const weekday = getWeekday(curAD);

    // Fast calculation for grid
    const panchang = calculateDailyPanchang({ bs: curBS }, location, method);
    const isToday = todayBS.year === curBS.year && todayBS.month === curBS.month && todayBS.day === curBS.day;

    days.push({
      bsDate: curBS,
      adDate: curAD,
      weekday,
      isToday,
      isCurrentMonth: true,
      isSaturday: weekday === 6,
      hasHoliday: panchang.holidays.length > 0 || weekday === 6,
      holidayTitle: panchang.holidays[0]?.titleNepali || (weekday === 6 ? 'साप्ताहिक बिदा' : undefined),
      hasFestival: panchang.festivals.length > 0,
      festivalTitle: panchang.festivals[0]?.nameNepali,
      tithiNameNepali: panchang.tithi.nameNepali,
      tithiNumber: panchang.tithi.number,
      eventsCount: 0,
      panchang,
    });
  }

  return days;
}
