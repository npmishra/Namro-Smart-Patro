import { BSDate, ADDate } from '../types';

export const NEPALI_MONTHS = [
  { id: 1, nameNepali: 'बैशाख', nameEnglish: 'Baisakh', shortNepali: 'बै', shortEnglish: 'Bai', seasonNepali: 'वसन्त (Spring)', gregorianMapping: 'Apr - May' },
  { id: 2, nameNepali: 'जेठ', nameEnglish: 'Jestha', shortNepali: 'जे', shortEnglish: 'Jes', seasonNepali: 'ग्रीष्म (Summer)', gregorianMapping: 'May - Jun' },
  { id: 3, nameNepali: 'असार', nameEnglish: 'Ashadh', shortNepali: 'अ', shortEnglish: 'Ash', seasonNepali: 'ग्रीष्म (Summer)', gregorianMapping: 'Jun - Jul' },
  { id: 4, nameNepali: 'साउन', nameEnglish: 'Shrawan', shortNepali: 'सा', shortEnglish: 'Shr', seasonNepali: 'वर्षा (Monsoon)', gregorianMapping: 'Jul - Aug' },
  { id: 5, nameNepali: 'भदौ', nameEnglish: 'Bhadra', shortNepali: 'भ', shortEnglish: 'Bha', seasonNepali: 'वर्षा (Monsoon)', gregorianMapping: 'Aug - Sep' },
  { id: 6, nameNepali: 'असोज', nameEnglish: 'Ashwin', shortNepali: 'अ', shortEnglish: 'Ash', seasonNepali: 'शरद् (Autumn)', gregorianMapping: 'Sep - Oct' },
  { id: 7, nameNepali: 'कात्तिक', nameEnglish: 'Kartik', shortNepali: 'का', shortEnglish: 'Kar', seasonNepali: 'शरद् (Autumn)', gregorianMapping: 'Oct - Nov' },
  { id: 8, nameNepali: 'मंसीर', nameEnglish: 'Mangsir', shortNepali: 'मं', shortEnglish: 'Man', seasonNepali: 'हेमन्त (Pre-Winter)', gregorianMapping: 'Nov - Dec' },
  { id: 9, nameNepali: 'पुष', nameEnglish: 'Poush', shortNepali: 'पु', shortEnglish: 'Pou', seasonNepali: 'हेमन्त (Pre-Winter)', gregorianMapping: 'Dec - Jan' },
  { id: 10, nameNepali: 'माघ', nameEnglish: 'Magh', shortNepali: 'मा', shortEnglish: 'Mag', seasonNepali: 'शिशिर (Winter)', gregorianMapping: 'Jan - Feb' },
  { id: 11, nameNepali: 'फागुन', nameEnglish: 'Falgun', shortNepali: 'फा', shortEnglish: 'Fal', seasonNepali: 'शिशिर (Winter)', gregorianMapping: 'Feb - Mar' },
  { id: 12, nameNepali: 'चैत', nameEnglish: 'Chaitra', shortNepali: 'चै', shortEnglish: 'Cha', seasonNepali: 'वसन्त (Spring)', gregorianMapping: 'Mar - Apr' },
];

export const NEPALI_WEEKDAYS = [
  { id: 0, nameNepali: 'आइतबार', nameEnglish: 'Sunday', shortNepali: 'आइत', shortEnglish: 'Sun' },
  { id: 1, nameNepali: 'सोमबार', nameEnglish: 'Monday', shortNepali: 'सोम', shortEnglish: 'Mon' },
  { id: 2, nameNepali: 'मंगलबार', nameEnglish: 'Tuesday', shortNepali: 'मंगल', shortEnglish: 'Tue' },
  { id: 3, nameNepali: 'बुधबार', nameEnglish: 'Wednesday', shortNepali: 'बुध', shortEnglish: 'Wed' },
  { id: 4, nameNepali: 'बिहीबार', nameEnglish: 'Thursday', shortNepali: 'बिही', shortEnglish: 'Thu' },
  { id: 5, nameNepali: 'शुक्रबार', nameEnglish: 'Friday', shortNepali: 'शुक्र', shortEnglish: 'Fri' },
  { id: 6, nameNepali: 'शनिबार', nameEnglish: 'Saturday', shortNepali: 'शनि', shortEnglish: 'Sat' },
];

export const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toNepaliDigits(num: number | string): string {
  const str = String(num);
  return str.replace(/[0-9]/g, (d) => NEPALI_DIGITS[parseInt(d, 10)]);
}

export function toEnglishDigits(nepaliStr: string): string {
  let result = nepaliStr;
  NEPALI_DIGITS.forEach((d, idx) => {
    result = result.split(d).join(String(idx));
  });
  return result;
}

// Master BS Calendar Month Lengths (1970 BS to 2105 BS)
// 12 months array per year [Baisakh, Jestha, Ashadh, Shrawan, Bhadra, Ashwin, Kartik, Mangsir, Poush, Magh, Falgun, Chaitra]
export const BS_MONTH_DAYS: Record<number, number[]> = {
  1970: [31, 31, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1971: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  1972: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  1973: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  1974: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  1975: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  1976: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  1977: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  1978: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1979: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  1980: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  1981: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1982: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  1983: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  1984: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  1985: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  1986: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  1987: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1988: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  1989: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  1990: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  1991: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1992: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  1993: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  1994: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1995: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  1996: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  1997: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 31],
  1998: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  1999: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2001: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2005: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2009: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2012: [31, 31, 31, 32, 31, 31, 29, 30, 29, 30, 30, 30],
  2013: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2016: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2017: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2018: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2020: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2021: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2022: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2025: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2026: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2027: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2028: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2029: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2030: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2031: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2032: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2033: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2034: [31, 31, 32, 31, 31, 31, 29, 30, 30, 29, 30, 30],
  2035: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2036: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2037: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2038: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2039: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2040: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2041: [31, 31, 31, 32, 31, 31, 29, 30, 29, 30, 30, 30],
  2042: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2043: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2044: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2045: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2046: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2047: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2048: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2049: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2050: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2051: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2052: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2053: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 30, 30],
  2054: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2055: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2056: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2057: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2058: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2059: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2060: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2061: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2062: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 30, 30],
  2063: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2064: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2065: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2066: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2067: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2068: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2069: [31, 31, 31, 32, 31, 31, 29, 30, 29, 30, 30, 30],
  2070: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2071: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2072: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2073: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2074: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2080: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2082: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2084: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2085: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2086: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2087: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2088: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2089: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2090: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2091: [31, 31, 31, 32, 31, 31, 29, 30, 29, 30, 30, 30],
  2092: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2093: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2094: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2095: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2096: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2097: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2098: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2099: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2100: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
  2101: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2102: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2103: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 30, 30],
  2104: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2105: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
};

// Base Anchor Point: 2000 BS Baisakh 1 = 1943 AD April 14 (Wednesday, Day 3 of week)
const BASE_BS_YEAR = 2000;
const BASE_AD_TIMESTAMP = Date.UTC(1943, 3, 14); // Months 0-indexed in JS Date: 3 = April

/**
 * Get the number of days in a specific BS month
 */
export function getDaysInBSMonth(bsYear: number, bsMonth: number): number {
  if (bsMonth < 1 || bsMonth > 12) return 30;
  
  if (BS_MONTH_DAYS[bsYear]) {
    return BS_MONTH_DAYS[bsYear][bsMonth - 1];
  }

  // Fallback for years beyond pre-calculated range: Solar astronomical approximations
  const standardPattern = [31, 31, 32, 31, 31, 30, 30, 29, 30, 29, 30, 30];
  return standardPattern[bsMonth - 1];
}

/**
 * Total days in a BS year
 */
export function getDaysInBSYear(bsYear: number): number {
  let total = 0;
  for (let m = 1; m <= 12; m++) {
    total += getDaysInBSMonth(bsYear, m);
  }
  return total;
}

/**
 * Convert Bikram Sambat Date to Gregorian (AD) Date
 */
export function bsToAd(bsDate: BSDate): ADDate {
  let totalDaysOffset = 0;

  if (bsDate.year >= BASE_BS_YEAR) {
    for (let y = BASE_BS_YEAR; y < bsDate.year; y++) {
      totalDaysOffset += getDaysInBSYear(y);
    }
    for (let m = 1; m < bsDate.month; m++) {
      totalDaysOffset += getDaysInBSMonth(bsDate.year, m);
    }
    totalDaysOffset += (bsDate.day - 1);
  } else {
    for (let y = bsDate.year; y < BASE_BS_YEAR; y++) {
      totalDaysOffset -= getDaysInBSYear(y);
    }
    for (let m = 1; m < bsDate.month; m++) {
      totalDaysOffset += getDaysInBSMonth(bsDate.year, m);
    }
    totalDaysOffset += (bsDate.day - 1);
  }

  const targetAdTime = BASE_AD_TIMESTAMP + totalDaysOffset * 86400000;
  const targetDate = new Date(targetAdTime);

  return {
    year: targetDate.getUTCFullYear(),
    month: targetDate.getUTCMonth() + 1,
    day: targetDate.getUTCDate(),
  };
}

/**
 * Convert Gregorian (AD) Date to Bikram Sambat Date
 */
export function adToBs(adDate: ADDate): BSDate {
  const targetAdTime = Date.UTC(adDate.year, adDate.month - 1, adDate.day);
  let daysDiff = Math.floor((targetAdTime - BASE_AD_TIMESTAMP) / 86400000);

  if (daysDiff >= 0) {
    let bsYear = BASE_BS_YEAR;
    while (true) {
      const yearDays = getDaysInBSYear(bsYear);
      if (daysDiff < yearDays) break;
      daysDiff -= yearDays;
      bsYear++;
    }

    let bsMonth = 1;
    while (bsMonth <= 12) {
      const monthDays = getDaysInBSMonth(bsYear, bsMonth);
      if (daysDiff < monthDays) break;
      daysDiff -= monthDays;
      bsMonth++;
    }

    const bsDay = daysDiff + 1;
    return { year: bsYear, month: bsMonth, day: bsDay };
  } else {
    let bsYear = BASE_BS_YEAR - 1;
    daysDiff = Math.abs(daysDiff);

    while (true) {
      const yearDays = getDaysInBSYear(bsYear);
      if (daysDiff <= yearDays) break;
      daysDiff -= yearDays;
      bsYear--;
    }

    let daysRemainingInYear = getDaysInBSYear(bsYear) - daysDiff;
    let bsMonth = 1;
    while (bsMonth <= 12) {
      const monthDays = getDaysInBSMonth(bsYear, bsMonth);
      if (daysRemainingInYear < monthDays) break;
      daysRemainingInYear -= monthDays;
      bsMonth++;
    }

    const bsDay = daysRemainingInYear + 1;
    return { year: bsYear, month: bsMonth, day: bsDay };
  }
}

/**
 * Calculate weekday from AD Date: 0 = Sunday, 6 = Saturday
 */
export function getWeekday(adDate: ADDate): number {
  const d = new Date(Date.UTC(adDate.year, adDate.month - 1, adDate.day));
  return d.getUTCDay();
}

/**
 * Validate BS Date
 */
export function isValidBSDate(bsDate: BSDate): boolean {
  if (bsDate.year < 1970 || bsDate.year > 2110) return false;
  if (bsDate.month < 1 || bsDate.month > 12) return false;
  const maxDays = getDaysInBSMonth(bsDate.year, bsDate.month);
  if (bsDate.day < 1 || bsDate.day > maxDays) return false;
  return true;
}

/**
 * Add or subtract days from a BS Date
 */
export function addDaysToBSDate(bsDate: BSDate, days: number): BSDate {
  const ad = bsToAd(bsDate);
  const targetAdTime = Date.UTC(ad.year, ad.month - 1, ad.day) + days * 86400000;
  const newAd = new Date(targetAdTime);
  return adToBs({
    year: newAd.getUTCFullYear(),
    month: newAd.getUTCMonth() + 1,
    day: newAd.getUTCDate(),
  });
}

/**
 * Format BS Date as Nepali string (e.g., "१५ भदौ २०८३")
 */
export function formatBSDateNepali(bsDate: BSDate, withDayName?: boolean): string {
  const monthInfo = NEPALI_MONTHS.find((m) => m.id === bsDate.month);
  const monthName = monthInfo ? monthInfo.nameNepali : '';
  const dayStr = toNepaliDigits(bsDate.day);
  const yearStr = toNepaliDigits(bsDate.year);
  
  if (withDayName) {
    const ad = bsToAd(bsDate);
    const w = getWeekday(ad);
    const dayName = NEPALI_WEEKDAYS[w].nameNepali;
    return `${dayName}, ${dayStr} ${monthName} ${yearStr}`;
  }
  return `${dayStr} ${monthName} ${yearStr}`;
}

/**
 * Format AD Date string (e.g., "31 Aug 2026")
 */
export function formatADDateEnglish(adDate: ADDate): string {
  const d = new Date(Date.UTC(adDate.year, adDate.month - 1, adDate.day));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * Get current Nepali Date based on system/mock time
 */
export function getCurrentNepaliDate(): { bs: BSDate; ad: ADDate; weekday: number } {
  // Current time anchor for the system
  const now = new Date();
  const adDate: ADDate = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
  const bsDate = adToBs(adDate);
  const weekday = getWeekday(adDate);

  return { bs: bsDate, ad: adDate, weekday };
}
