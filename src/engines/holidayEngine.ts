import { BSDate, HolidayItem } from '../types';

export interface HolidayRule {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  type: 'national' | 'public' | 'regional' | 'bank' | 'women_only' | 'school';
  typeNepali: string;
  isGazetted: boolean;
  applicableRegions: string[]; // ['all'] or province / district
  matchType: 'fixed_bs' | 'tithi' | 'custom_eval';
  fixedBSMonth?: number;
  fixedBSDay?: number;
  tithiBSMonth?: number;
  tithiPaksha?: 'shukla' | 'krishna';
  tithiNumberInPaksha?: number;
  descriptionNepali?: string;
}

export const HOLIDAY_RULES: HolidayRule[] = [
  {
    id: 'h_naya_barsha',
    titleNepali: 'नयाँ वर्ष सार्वजनिक बिदा',
    titleEnglish: 'New Year Public Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'fixed_bs',
    fixedBSMonth: 1,
    fixedBSDay: 1,
    descriptionNepali: 'विक्रम संवत् नयाँ वर्षको अवसरमा देशभर सार्वजनिक बिदा।',
  },
  {
    id: 'h_majdoor_diwas',
    titleNepali: 'अन्तर्राष्ट्रिय श्रमिक दिवस',
    titleEnglish: 'May Day Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'fixed_bs',
    fixedBSMonth: 1,
    fixedBSDay: 18,
  },
  {
    id: 'h_buddha_jayanti',
    titleNepali: 'बुद्ध जयन्ती तथा उभौली पर्व',
    titleEnglish: 'Buddha Jayanti & Ubhauli Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 1,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'h_ganatantra_diwas',
    titleNepali: 'गणतन्त्र दिवस',
    titleEnglish: 'Republic Day Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'fixed_bs',
    fixedBSMonth: 2,
    fixedBSDay: 15,
  },
  {
    id: 'h_janai_purnima',
    titleNepali: 'जनै पूर्णिमा तथा रक्षाबन्धन',
    titleEnglish: 'Janai Purnima Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 4,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'h_gai_jatra',
    titleNepali: 'गाईजात्रा (काठमाडौँ उपत्यका बिदा)',
    titleEnglish: 'Gai Jatra Holiday (Kathmandu Valley)',
    type: 'regional',
    typeNepali: 'उपत्यका सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['kathmandu', 'lalitpur', 'bhaktapur'],
    matchType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 1,
  },
  {
    id: 'h_krishna_janmashtami',
    titleNepali: 'श्रीकृष्ण जन्माष्टमी बिदा',
    titleEnglish: 'Shree Krishna Janmashtami Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 8,
  },
  {
    id: 'h_teej_women',
    titleNepali: 'हरितालिका तीज (महिला कर्मचारी बिदा)',
    titleEnglish: 'Haritalika Teej (Holiday for Women)',
    type: 'women_only',
    typeNepali: 'महिला बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 3,
  },
  {
    id: 'h_indra_jatra',
    titleNepali: 'इन्द्रजात्रा (काठमाडौँ उपत्यका बिदा)',
    titleEnglish: 'Indra Jatra Holiday',
    type: 'regional',
    typeNepali: 'उपत्यका सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['kathmandu', 'lalitpur', 'bhaktapur'],
    matchType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 14,
  },
  {
    id: 'h_sambidhan_diwas',
    titleNepali: 'संविधान दिवस (राष्ट्रिय दिवस)',
    titleEnglish: 'Constitution Day National Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'fixed_bs',
    fixedBSMonth: 6,
    fixedBSDay: 3,
  },
  // Dashain Holidays (Fulpati to Dwadashi - Saptami to Dwadashi)
  {
    id: 'h_dashain_fulpati',
    titleNepali: 'बडादशैं बिदा (फूलपाती)',
    titleEnglish: 'Dashain Holiday (Fulpati)',
    type: 'national',
    typeNepali: 'दशैं सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 7,
  },
  {
    id: 'h_dashain_ashtami',
    titleNepali: 'बडादशैं बिदा (महाअष्टमी)',
    titleEnglish: 'Dashain Holiday (Maha Ashtami)',
    type: 'national',
    typeNepali: 'दशैं सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 8,
  },
  {
    id: 'h_dashain_navami',
    titleNepali: 'बडादशैं बिदा (महानवमी)',
    titleEnglish: 'Dashain Holiday (Maha Navami)',
    type: 'national',
    typeNepali: 'दशैं सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 9,
  },
  {
    id: 'h_dashain_dashami',
    titleNepali: 'बडादशैं बिदा (विजयादशमी)',
    titleEnglish: 'Dashain Holiday (Vijaya Dashami)',
    type: 'national',
    typeNepali: 'दशैं सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 10,
  },
  {
    id: 'h_dashain_ekadashi',
    titleNepali: 'बडादशैं बिदा (एकादशी)',
    titleEnglish: 'Dashain Holiday (Ekadashi)',
    type: 'national',
    typeNepali: 'दशैं सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 11,
  },
  // Tihar Holidays (Laxmi Puja, Govardhan Puja, Bhai Tika)
  {
    id: 'h_tihar_laxmi',
    titleNepali: 'तिहार बिदा (लक्ष्मी पूजा)',
    titleEnglish: 'Tihar Holiday (Laxmi Puja)',
    type: 'national',
    typeNepali: 'तिहार सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'h_tihar_govardhan',
    titleNepali: 'तिहार बिदा (गोवर्धन पूजा / म्हः पूजा)',
    titleEnglish: 'Tihar Holiday (Govardhan & Mha Puja)',
    type: 'national',
    typeNepali: 'तिहार सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 1,
  },
  {
    id: 'h_tihar_bhai_tika',
    titleNepali: 'तिहार बिदा (भाइटीका)',
    titleEnglish: 'Tihar Holiday (Bhai Tika)',
    type: 'national',
    typeNepali: 'तिहार सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 2,
  },
  {
    id: 'h_chhath',
    titleNepali: 'छठ पर्व सार्वजनिक बिदा',
    titleEnglish: 'Chhath Puja Public Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 6,
  },
  {
    id: 'h_maghe_sankranti',
    titleNepali: 'माघे संक्रान्ति / माघी बिदा',
    titleEnglish: 'Maghe Sankranti / Maghi Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'fixed_bs',
    fixedBSMonth: 10,
    fixedBSDay: 1,
  },
  {
    id: 'h_prajatantra_diwas',
    titleNepali: 'राष्ट्रिय प्रजातन्त्र दिवस',
    titleEnglish: 'National Democracy Day',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'fixed_bs',
    fixedBSMonth: 11,
    fixedBSDay: 7,
  },
  {
    id: 'h_maha_shivaratri',
    titleNepali: 'महाशिवरात्रि सार्वजनिक बिदा',
    titleEnglish: 'Maha Shivaratri Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 11,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 14,
  },
  {
    id: 'h_mahila_diwas',
    titleNepali: 'अन्तर्राष्ट्रिय महिला दिवस बिदा',
    titleEnglish: 'International Women\'s Day Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'fixed_bs',
    fixedBSMonth: 11,
    fixedBSDay: 24,
  },
  {
    id: 'h_fagu_purnima',
    titleNepali: 'फागु पूर्णिमा (होली बिदा)',
    titleEnglish: 'Holi / Fagu Purnima Holiday',
    type: 'national',
    typeNepali: 'सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['all'],
    matchType: 'tithi',
    tithiBSMonth: 11,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'h_ghode_jatra',
    titleNepali: 'घोडे जात्रा (काठमाडौँ उपत्यका बिदा)',
    titleEnglish: 'Ghode Jatra (Valley Holiday)',
    type: 'regional',
    typeNepali: 'उपत्यका सार्वजनिक बिदा',
    isGazetted: true,
    applicableRegions: ['kathmandu', 'lalitpur', 'bhaktapur'],
    matchType: 'tithi',
    tithiBSMonth: 12,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 15,
  },
];

/**
 * Get Holidays for a specific BS Date, Tithi and Location
 */
export function getHolidaysForDate(
  bsDate: BSDate,
  tithiNumber: number,
  locationId: string = 'kathmandu'
): HolidayItem[] {
  const result: HolidayItem[] = [];
  const paksha: 'shukla' | 'krishna' = tithiNumber <= 15 ? 'shukla' : 'krishna';
  const numInPaksha = tithiNumber <= 15 ? tithiNumber : tithiNumber - 15;

  for (const rule of HOLIDAY_RULES) {
    const isRegionMatch =
      rule.applicableRegions.includes('all') || rule.applicableRegions.includes(locationId);

    if (!isRegionMatch) continue;

    if (rule.matchType === 'fixed_bs') {
      if (rule.fixedBSMonth === bsDate.month && rule.fixedBSDay === bsDate.day) {
        result.push({
          id: rule.id,
          titleNepali: rule.titleNepali,
          titleEnglish: rule.titleEnglish,
          type: rule.type,
          typeNepali: rule.typeNepali,
          isGazetted: rule.isGazetted,
          applicableRegions: rule.applicableRegions,
          descriptionNepali: rule.descriptionNepali,
        });
      }
    } else if (rule.matchType === 'tithi') {
      if (
        rule.tithiBSMonth === bsDate.month &&
        rule.tithiPaksha === paksha &&
        rule.tithiNumberInPaksha === numInPaksha
      ) {
        result.push({
          id: rule.id,
          titleNepali: rule.titleNepali,
          titleEnglish: rule.titleEnglish,
          type: rule.type,
          typeNepali: rule.typeNepali,
          isGazetted: rule.isGazetted,
          applicableRegions: rule.applicableRegions,
          descriptionNepali: rule.descriptionNepali,
        });
      }
    }
  }

  return result;
}
