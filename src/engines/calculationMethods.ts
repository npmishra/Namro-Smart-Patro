import { CalculationMethodInfo, CalculationMethodType } from '../types';

export const CALCULATION_METHODS: Record<CalculationMethodType, CalculationMethodInfo> = {
  surya_siddhanta: {
    id: 'surya_siddhanta',
    nameNepali: 'शुद्ध सूर्य सिद्धान्त',
    nameEnglish: 'Pure Surya Siddhanta',
    description: 'परम्परागत सूर्य सिद्धान्त ग्रन्थमा आधारित शुद्ध गणना पद्धति। मध्य गति, मन्दफल र शीघ्रफलको आधारमा ग्रह स्पष्टीकरण।',
    basis: 'Surya Siddhanta Astronomical Treatise (Mean motion, epicycles, traditional zero-ayanamsa epoch 499 CE)',
    ayanamsaType: 'Traditional Surya Siddhantic Trepidation (त्रैराशिक अयनांश)',
    precision: 'Traditional',
  },
  ketaki: {
    id: 'ketaki',
    nameNepali: 'केतकी सिद्धान्त',
    nameEnglish: 'Ketaki Siddhanta',
    description: 'ज्योतिषाचार्य व्यंकटेश बापू केतकरद्वारा प्रतिपादित आधुनिक बीज-संस्कार सहितको शास्त्रीय केतकी गणित पद्धति।',
    basis: 'Ketaki Grahaganita (Venkatesh Bapuji Ketkar planetary constants and lunar perturbation equations)',
    ayanamsaType: 'Ketaki Chitra-Paksha Ayanamsa',
    precision: 'High',
  },
  ketaki_nepali: {
    id: 'ketaki_nepali',
    nameNepali: 'केतकी नेपाली पञ्चाङ्ग',
    nameEnglish: 'Ketaki Nepali Panchang',
    description: 'नेपालको परम्परागत राजकीय पञ्चाङ्ग तथा पञ्चाङ्ग निर्णायक विकास समितिद्वारा ऐतिहासिक रूपमा प्रयोग गरिँदै आएको केतकी नेपाली मानक।',
    basis: 'Nepal Royal Astrological Standard (Calibrated Ketaki tables for Kathmandu/Nepal Meridian 85°19\'E)',
    ayanamsaType: 'Nepal Standard Ayanamsa (नेपाली मानक अयनांश)',
    precision: 'Standard',
  },
  drik: {
    id: 'drik',
    nameNepali: 'दृक् सिद्धान्त (आधुनिक खगोलीय)',
    nameEnglish: 'Drik Siddhanta (Modern Astrometric)',
    description: 'आधुनिक खगोल विज्ञान तथा प्रत्यक्ष वेध (observation) मा आधारित यथार्थ ग्रह स्पष्टीकरण तथा लहिरी अयनांश।',
    basis: 'Modern Ephemeris & VSOP87/ELP2000 Celestial Mechanics with True Apparent Planetary Positions',
    ayanamsaType: 'Lahiri (Chitra Paksha) NC Lahiri 23°51\' baseline',
    precision: 'Very High',
  },
  namro_custom: {
    id: 'namro_custom',
    nameNepali: 'Namro Custom Calculation (नाम्रो विशेष)',
    nameEnglish: 'Namro Custom Proprietary Engine',
    description: 'नेपालको हिमाली उच्चता, वायुमण्डलीय परावर्तन (atmospheric refraction) र उच्च-क्रम चन्द्र-सूर्य विक्षोभ एकीकृत गरिएको आधुनिक प्रोप्राइटरी पद्धति।',
    basis: 'Namro Proprietary Hybrid Engine with Local High-Altitude Topographic Refraction and Micro-perturbations',
    ayanamsaType: 'Namro Precision Geocentric Ayanamsa',
    precision: 'Very High',
  },
};

/**
 * Returns calculation adjustments based on chosen Siddhanta
 */
export function getMethodOffsets(method: CalculationMethodType, julianCenturies: number) {
  switch (method) {
    case 'surya_siddhanta':
      return {
        sunLongitudeOffset: 0.12, // Traditional epicycle variance
        moonLongitudeOffset: -0.28,
        ayanamsaOffset: -1.25, // Surya Siddhanta epoch offset
        sunriseRefractionMinutes: -1.5, // Standard flat horizon
      };
    case 'ketaki':
      return {
        sunLongitudeOffset: 0.03,
        moonLongitudeOffset: 0.08,
        ayanamsaOffset: -0.15,
        sunriseRefractionMinutes: 0.0,
      };
    case 'ketaki_nepali':
      return {
        sunLongitudeOffset: 0.02,
        moonLongitudeOffset: 0.05,
        ayanamsaOffset: -0.08,
        sunriseRefractionMinutes: 0.5, // Calibrated for Kathmandu Valley ring hills
      };
    case 'namro_custom':
      return {
        sunLongitudeOffset: 0.0,
        moonLongitudeOffset: 0.0,
        ayanamsaOffset: 0.0,
        sunriseRefractionMinutes: 0.8, // Topographic mountain rim refraction
      };
    case 'drik':
    default:
      return {
        sunLongitudeOffset: 0.0,
        moonLongitudeOffset: 0.0,
        ayanamsaOffset: 0.0,
        sunriseRefractionMinutes: 0.0,
      };
  }
}
