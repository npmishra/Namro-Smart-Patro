import { toNepaliDigits } from './calendarEngine';

export interface CurrencyRate {
  currencyCode: string; // 'USD', 'EUR', etc.
  currencyNameNepali: string;
  currencyNameEnglish: string;
  symbol: string;
  flagEmoji: string;
  unit: number;
  buyRateNPR: number;
  sellRateNPR: number;
  changeStatus: 'up' | 'down' | 'same';
}

export interface BullionRate {
  id: string;
  metalNameNepali: string;
  metalNameEnglish: string;
  purity: string;
  ratePerTolaNPR: number;
  ratePer10GramNPR: number;
  changeNPR: number;
  changeType: 'up' | 'down' | 'same';
}

export const FOREX_RATES: CurrencyRate[] = [
  {
    currencyCode: 'USD',
    currencyNameNepali: 'अमेरिकी डलर',
    currencyNameEnglish: 'US Dollar',
    symbol: '$',
    flagEmoji: '🇺🇸',
    unit: 1,
    buyRateNPR: 135.40,
    sellRateNPR: 136.00,
    changeStatus: 'up',
  },
  {
    currencyCode: 'EUR',
    currencyNameNepali: 'युरोपियन युरो',
    currencyNameEnglish: 'European Euro',
    symbol: '€',
    flagEmoji: '🇪🇺',
    unit: 1,
    buyRateNPR: 147.20,
    sellRateNPR: 147.85,
    changeStatus: 'down',
  },
  {
    currencyCode: 'GBP',
    currencyNameNepali: 'युके पाउन्ड स्टर्लिङ',
    currencyNameEnglish: 'UK Pound Sterling',
    symbol: '£',
    flagEmoji: '🇬🇧',
    unit: 1,
    buyRateNPR: 172.50,
    sellRateNPR: 173.26,
    changeStatus: 'up',
  },
  {
    currencyCode: 'AUD',
    currencyNameNepali: 'अस्ट्रेलियन डलर',
    currencyNameEnglish: 'Australian Dollar',
    symbol: 'A$',
    flagEmoji: '🇦🇺',
    unit: 1,
    buyRateNPR: 88.10,
    sellRateNPR: 88.49,
    changeStatus: 'up',
  },
  {
    currencyCode: 'CAD',
    currencyNameNepali: 'क्यानेडियन डलर',
    currencyNameEnglish: 'Canadian Dollar',
    symbol: 'C$',
    flagEmoji: '🇨🇦',
    unit: 1,
    buyRateNPR: 98.45,
    sellRateNPR: 98.88,
    changeStatus: 'same',
  },
  {
    currencyCode: 'JPY',
    currencyNameNepali: 'जापानी येन (१०)',
    currencyNameEnglish: 'Japanese Yen (10)',
    symbol: '¥',
    flagEmoji: '🇯🇵',
    unit: 10,
    buyRateNPR: 9.15,
    sellRateNPR: 9.19,
    changeStatus: 'down',
  },
  {
    currencyCode: 'INR',
    currencyNameNepali: 'भारतीय रुपैयाँ (१००)',
    currencyNameEnglish: 'Indian Rupee (100)',
    symbol: '₹',
    flagEmoji: '🇮🇳',
    unit: 100,
    buyRateNPR: 160.00,
    sellRateNPR: 160.15,
    changeStatus: 'same',
  },
  {
    currencyCode: 'QAR',
    currencyNameNepali: 'कतार रियाल',
    currencyNameEnglish: 'Qatari Riyal',
    symbol: 'QR',
    flagEmoji: '🇶🇦',
    unit: 1,
    buyRateNPR: 37.15,
    sellRateNPR: 37.31,
    changeStatus: 'up',
  },
  {
    currencyCode: 'AED',
    currencyNameNepali: 'युएई दिराम',
    currencyNameEnglish: 'UAE Dirham',
    symbol: 'AED',
    flagEmoji: '🇦🇪',
    unit: 1,
    buyRateNPR: 36.86,
    sellRateNPR: 37.03,
    changeStatus: 'up',
  },
  {
    currencyCode: 'MYR',
    currencyNameNepali: 'मलेसियन रिंगिट',
    currencyNameEnglish: 'Malaysian Ringgit',
    symbol: 'RM',
    flagEmoji: '🇲🇾',
    unit: 1,
    buyRateNPR: 30.60,
    sellRateNPR: 30.74,
    changeStatus: 'down',
  },
  {
    currencyCode: 'SAR',
    currencyNameNepali: 'साउदी रियाल',
    currencyNameEnglish: 'Saudi Riyal',
    symbol: 'SR',
    flagEmoji: '🇸🇦',
    unit: 1,
    buyRateNPR: 36.10,
    sellRateNPR: 36.26,
    changeStatus: 'same',
  },
  {
    currencyCode: 'KRW',
    currencyNameNepali: 'दक्षिण कोरियाली वोन (१००)',
    currencyNameEnglish: 'South Korean Won (100)',
    symbol: '₩',
    flagEmoji: '🇰🇷',
    unit: 100,
    buyRateNPR: 9.85,
    sellRateNPR: 9.89,
    changeStatus: 'down',
  },
];

export const BULLION_RATES: BullionRate[] = [
  {
    id: 'fine_gold',
    metalNameNepali: 'छापावाल सुन (Fine Gold)',
    metalNameEnglish: 'Fine Gold 24K',
    purity: '९९.९% (24 Karat)',
    ratePerTolaNPR: 168500,
    ratePer10GramNPR: 144460,
    changeNPR: 500,
    changeType: 'up',
  },
  {
    id: 'tejabi_gold',
    metalNameNepali: 'तेजाबी सुन (Tejabi Gold)',
    metalNameEnglish: 'Tejabi Gold 22K',
    purity: '९१.६% (22 Karat)',
    ratePerTolaNPR: 167800,
    ratePer10GramNPR: 143860,
    changeNPR: 500,
    changeType: 'up',
  },
  {
    id: 'silver',
    metalNameNepali: 'शुद्ध चाँदी (Fine Silver)',
    metalNameEnglish: 'Fine Silver',
    purity: '९९.९% Pure',
    ratePerTolaNPR: 2150,
    ratePer10GramNPR: 1843,
    changeNPR: 15,
    changeType: 'down',
  },
];
