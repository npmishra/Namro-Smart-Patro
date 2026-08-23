import { BSDate, RashiInfo } from '../types';
import { toNepaliDigits } from './calendarEngine';

export interface RashiDailyForecast {
  id: string; // 'aries', 'taurus', etc.
  num: number;
  nameNepali: string;
  nameEnglish: string;
  symbol: string;
  elementNepali: string; // अग्नि, पृथ्वी, वायु, जल
  rulerPlanetNepali: string; // मंगल, शुक्र, आदि
  forecastNepali: string;
  healthForecastNepali: string;
  financeForecastNepali: string;
  loveForecastNepali: string;
  luckyNumber: number;
  luckyColorNepali: string;
  luckyColorHex: string;
  luckyDirectionNepali: string;
  ratingStars: number; // 1 to 5
}

export const RASHI_DATA: Omit<RashiDailyForecast, 'forecastNepali' | 'healthForecastNepali' | 'financeForecastNepali' | 'loveForecastNepali' | 'luckyNumber' | 'luckyColorNepali' | 'luckyColorHex' | 'luckyDirectionNepali' | 'ratingStars'>[] = [
  { id: 'aries', num: 1, nameNepali: 'मेष', nameEnglish: 'Aries', symbol: '♈', elementNepali: 'अग्नि (Fire)', rulerPlanetNepali: 'मंगल (Mars)' },
  { id: 'taurus', num: 2, nameNepali: 'वृष', nameEnglish: 'Taurus', symbol: '♉', elementNepali: 'पृथ्वी (Earth)', rulerPlanetNepali: 'शुक्र (Venus)' },
  { id: 'gemini', num: 3, nameNepali: 'मिथुन', nameEnglish: 'Gemini', symbol: '♊', elementNepali: 'वायु (Air)', rulerPlanetNepali: 'बुध (Mercury)' },
  { id: 'cancer', num: 4, nameNepali: 'कर्कट', nameEnglish: 'Cancer', symbol: '♋', elementNepali: 'जल (Water)', rulerPlanetNepali: 'चन्द्रमा (Moon)' },
  { id: 'leo', num: 5, nameNepali: 'सिंह', nameEnglish: 'Leo', symbol: '♌', elementNepali: 'अग्नि (Fire)', rulerPlanetNepali: 'सूर्य (Sun)' },
  { id: 'virgo', num: 6, nameNepali: 'कन्या', nameEnglish: 'Virgo', symbol: '♍', elementNepali: 'पृथ्वी (Earth)', rulerPlanetNepali: 'बुध (Mercury)' },
  { id: 'libra', num: 7, nameNepali: 'तुला', nameEnglish: 'Libra', symbol: '♎', elementNepali: 'वायु (Air)', rulerPlanetNepali: 'शुक्र (Venus)' },
  { id: 'scorpio', num: 8, nameNepali: 'वृश्चिक', nameEnglish: 'Scorpio', symbol: '♏', elementNepali: 'जल (Water)', rulerPlanetNepali: 'मंगल (Mars)' },
  { id: 'sagittarius', num: 9, nameNepali: 'धनु', nameEnglish: 'Sagittarius', symbol: '♐', elementNepali: 'अग्नि (Fire)', rulerPlanetNepali: 'बृहस्पति (Jupiter)' },
  { id: 'capricorn', num: 10, nameNepali: 'मकर', nameEnglish: 'Capricorn', symbol: '♑', elementNepali: 'पृथ्वी (Earth)', rulerPlanetNepali: 'शनि (Saturn)' },
  { id: 'aquarius', num: 11, nameNepali: 'कुम्भ', nameEnglish: 'Aquarius', symbol: '♒', elementNepali: 'वायु (Air)', rulerPlanetNepali: 'शनि (Saturn)' },
  { id: 'pisces', num: 12, nameNepali: 'मीन', nameEnglish: 'Pisces', symbol: '♓', elementNepali: 'जल (Water)', rulerPlanetNepali: 'बृहस्पति (Jupiter)' },
];

const DAILY_PREDICTIONS: Record<string, { forecast: string; health: string; finance: string; love: string; number: number; color: string; colorHex: string; direction: string; stars: number }> = {
  aries: {
    forecast: 'आजको दिन उत्साहजनक रहनेछ। रोकिएका कामहरूमा प्रगति हुनेछ। नयाँ कार्य शुभारम्भ गर्नका लागि शुभ समय छ। मित्र तथा अग्रजहरूको सहयोग प्राप्त हुनेछ।',
    health: 'शारीरिक स्फूर्ति र ऊर्जा उच्च रहनेछ। खानपानमा सन्तुलन कायम राख्नुहोला।',
    finance: 'आर्थिक स्थिति सबल रहनेछ। लगानीबाट मनग्य लाभ प्राप्त हुने संकेत छ।',
    love: 'दाम्पत्य जीवनमा मधुरता छाउनेछ। पारिवारिक जमघटले मन प्रसन्न बनाउनेछ।',
    number: 9,
    color: 'रातो (Red)',
    colorHex: '#ef4444',
    direction: 'पूर्व (East)',
    stars: 5,
  },
  taurus: {
    forecast: 'धैर्य र लगनशीलताले जटिल समस्याहरू समाधान हुनेछन्। बोलीको प्रभाव बढ्नेछ। सामाजिक क्षेत्रमा प्रतिष्ठा वृद्धि हुनेछ।',
    health: 'सामान्य घाँटी वा टाउको दुखाइको सम्भावना रहेकाले आराममा ध्यान दिनुहोस्।',
    finance: 'स्थिर सम्पत्ति तथा बचतमा वृद्धि हुनेछ। अनावश्यक खर्च नियन्त्रणमा रहनेछ।',
    love: 'जीवनसाथीसँगको सम्बन्धमा विश्वास र सद्भाव बढ्नेछ। नयाँ यात्राको योग छ।',
    number: 6,
    color: 'सेतो / गुलाबी (Pink)',
    colorHex: '#ec4899',
    direction: 'दक्षिण-पूर्व (South-East)',
    stars: 4,
  },
  gemini: {
    forecast: 'बौद्धिक तथा सिर्जनात्मक कार्यमा सफलता मिल्नेछ। विद्यार्थीहरूका लागि अध्ययनमा राम्रो प्रगति हुने समय छ। नयाँ अवसरहरू हात पर्नेछन्।',
    health: 'मानसिक शान्ति कायम रहनेछ। योग तथा ध्यान लाभदायक हुनेछ।',
    finance: 'आम्दानीका नयाँ स्रोतहरू पहिचान हुनेछन्। साझेदारी व्यवसायमा राम्रो नाफा मिल्नेछ।',
    love: 'सञ्चार माध्यमबाट शुभ समाचार सुन्न पाइनेछ। प्रेम सम्बन्ध प्रगाढ बन्नेछ।',
    number: 5,
    color: 'हरियो (Green)',
    colorHex: '#10b981',
    direction: 'उत्तर (North)',
    stars: 4,
  },
  cancer: {
    forecast: 'मनमा धार्मिक तथा परोपकारी भावना जागृत हुनेछ। परिवारमा शुभ कार्यको चर्चा चल्नेछ। कार्यक्षेत्रमा सहकर्मीहरूको सहयोग पाइनेछ।',
    health: 'पानीजन्य रोगहरूबाट जोगिनुहोला। चिसोबाट सावधान रहनु उपयुक्त हुन्छ।',
    finance: 'पारिवारिक सुखसुविधाका साधन खरिदमा खर्च हुन सक्छ। धन आगमन सामान्य रहनेछ।',
    love: 'आत्मीय सम्बन्धमा गहिराइ आउनेछ। पुराना असमझदारीहरू हट्नेछन्।',
    number: 2,
    color: 'मोतीया / सेतो (Silver/White)',
    colorHex: '#94a3b8',
    direction: 'उत्तर-पश्चिम (North-West)',
    stars: 4,
  },
  leo: {
    forecast: 'आत्मविश्वास र नेतृत्व क्षमतामा वृद्धि हुनेछ। प्रशासनिक तथा सरकारी कामहरूमा सफलता मिल्नेछ। समाजमा मान-सम्मान बढ्नेछ।',
    health: 'शरीरमा फुर्ती रहनेछ। नियमित व्यायामलाई निरन्तरता दिनुहोस्।',
    finance: 'दीर्घकालीन लगानीबाट उच्च प्रतिफल प्राप्त हुनेछ। व्यापारमा नयाँ सम्झौता हुनेछ।',
    love: 'प्रियजनसँग रमाइलो समय बित्नेछ। पारिवारिक वातावरण सौहार्दपूर्ण रहनेछ।',
    number: 1,
    color: 'सुनौलो / पहेँलो (Gold/Yellow)',
    colorHex: '#f59e0b',
    direction: 'पूर्व (East)',
    stars: 5,
  },
  virgo: {
    forecast: 'योजनाबद्ध ढंगले अगाडि बढ्दा सबै काम समयमै सम्पन्न हुनेछन्। अनुसन्धान तथा प्राविधिक क्षेत्रमा सफलता मिल्नेछ।',
    health: 'पाचन प्रणालीमा सुधार आउनेछ। हरिया सागसब्जीको प्रयोग बढाउनुहोस्।',
    finance: 'आर्थिक कारोबारमा सावधानी अपनाउनु राम्रो हुनेछ। अनावश्यक ऋणबाट बच्नुहोस्।',
    love: 'परस्पर समझदारीले सम्बन्ध सुदृढ हुनेछ। सानातिना विवादलाई बेवास्ता गर्नुहोस्।',
    number: 7,
    color: 'गाढा हरियो (Dark Green)',
    colorHex: '#059669',
    direction: 'उत्तर (North)',
    stars: 4,
  },
  libra: {
    forecast: 'कला, साहित्य तथा मनोरञ्जन क्षेत्रमा मन लाग्नेछ। वैदेशिक कार्यहरूमा प्रगति हुनेछ। नयाँ मित्रहरूसँगको भेटघाट फलदायी रहनेछ।',
    health: 'स्वास्थ्य सामान्यतया राम्रो रहनेछ। आँखाको नियमित हेरचाह गर्नुहोस्।',
    finance: 'सौन्दर्य र विलासिताका वस्तुहरूमा लगानी हुन सक्छ। धन प्राप्ति राम्रो छ।',
    love: 'दाम्पत्य जीवनमा रोमान्स र खुसीयाली छाउनेछ। उपहार आदानप्रदान हुन सक्छ।',
    number: 6,
    color: 'आसमानी निलो (Sky Blue)',
    colorHex: '#38bdf8',
    direction: 'पश्चिम (West)',
    stars: 5,
  },
  scorpio: {
    forecast: 'कडा परिश्रमको उचित फल प्राप्त हुनेछ। गोप्य योजनाहरू सफल हुनेछन्। शत्रुहरूमाथि विजय प्राप्त हुने बलियो योग छ।',
    health: 'ऊर्जावान् महसुस हुनेछ। भारी व्यायाम गर्दा सावधानी अपनाउनुहोला।',
    finance: 'अचानक धन लाभ वा पुरानो रोकिएको रकम फिर्ता आउने सम्भावना छ।',
    love: 'सम्बन्धमा इमानदारी र स्पष्टता आवश्यक छ। शंका उपशंकाबाट टाढा रहनुहोला।',
    number: 9,
    color: 'मरुन / रातो (Maroon)',
    colorHex: '#991b1b',
    direction: 'दक्षिण (South)',
    stars: 4,
  },
  sagittarius: {
    forecast: 'धार्मिक यात्रा वा आध्यात्मिक चिन्तनमा समय बित्नेछ। उच्च शिक्षा तथा वैदेशिक अवसरहरू प्राप्त हुनेछन्। गुरुजनको आशीर्वाद मिल्नेछ।',
    health: 'कलेजो तथा कम्मरको दुखाइबाट राहत मिल्नेछ। प्रशस्त पानी पिउनुहोला।',
    finance: 'आर्थिक संकलनमा वृद्धि हुनेछ। परोपकार तथा दानपुण्यमा खर्च हुनेछ।',
    love: 'परिवारमा खुसीको माहोल रहनेछ। जीवनसाथीबाट भरपुर साथ र समर्थन मिल्नेछ।',
    number: 3,
    color: 'पहेँलो (Yellow)',
    colorHex: '#eab308',
    direction: 'उत्तर-पूर्व (North-East)',
    stars: 5,
  },
  capricorn: {
    forecast: 'कर्मक्षेत्रमा नयाँ जिम्मेवारी प्राप्त हुनेछ। धैर्यपूर्वक काम गर्दा ठूला उपलब्धिहरू हासिल हुनेछन्। अभिभावकको सहयोग पाइनेछ।',
    health: 'जोर्नी तथा हाडजोर्नीको समस्यामा सुधार आउनेछ। आरामलाई प्राथमिकता दिनुहोस्।',
    finance: 'स्थिर तथा सुरक्षित लगानीमा ध्यान दिनुहोस्। व्यापार व्यवसायमा क्रमिक सुधार हुनेछ।',
    love: 'सम्बन्धमा गम्भीरता र परिपक्वता देखिनेछ। पारिवारिक दायित्व पूरा हुनेछ।',
    number: 8,
    color: 'नीलो / कालो (Navy Blue)',
    colorHex: '#1e3a8a',
    direction: 'पश्चिम (West)',
    stars: 4,
  },
  aquarius: {
    forecast: 'सामाजिक कार्य तथा संगठनमा प्रतिष्ठा वृद्धि हुनेछ। नयाँ दृष्टिकोण र नवीन विचारहरूले कार्य सम्पादनमा सहजता ल्याउनेछ।',
    health: 'पर्याप्त निद्रा र ध्यानले मानसिक तनाव कम हुनेछ। स्फूर्ति बढ्नेछ।',
    finance: 'मित्रहरूको सहयोगमा आर्थिक उपार्जनका नयाँ बाटा खुल्नेछन्।',
    love: 'प्रेम सम्बन्धमा नयाँपन आउनेछ। खुला संवादले सम्बन्ध थप आत्मीय बन्नेछ।',
    number: 4,
    color: 'बैजनी / नीलो (Purple/Blue)',
    colorHex: '#7c3aed',
    direction: 'पश्चिम (West)',
    stars: 4,
  },
  pisces: {
    forecast: 'कल्पनाशीलता र सिर्जनशीलता उच्च रहनेछ। शुभचिन्तकहरूको सल्लाहले ठूला निर्णय लिन सजिलो हुनेछ। अध्यात्ममा रुचि बढ्नेछ।',
    health: 'पैताला तथा खुट्टाको दुखाइमा आराम मिल्नेछ। बिहानी पैदल यात्रा लाभदायक हुनेछ।',
    finance: 'आर्थिक सन्तुलन कायम रहनेछ। धार्मिक तथा सामाजिक काममा खर्च हुनेछ।',
    love: 'भावनात्मक सम्बन्धमा न्यानोपन आउनेछ। जीवनसाथीको पूर्ण सहयोग प्राप्त हुनेछ।',
    number: 3,
    color: 'हल्का पहेँलो / सुनौलो (Light Yellow)',
    colorHex: '#fde047',
    direction: 'उत्तर-पूर्व (North-East)',
    stars: 5,
  },
};

/**
 * Get daily rashifal forecast for all 12 rashis for a specific date
 */
export function getDailyRashifal(bsDate: BSDate): RashiDailyForecast[] {
  return RASHI_DATA.map((r) => {
    const p = DAILY_PREDICTIONS[r.id];
    return {
      ...r,
      forecastNepali: p.forecast,
      healthForecastNepali: p.health,
      financeForecastNepali: p.finance,
      loveForecastNepali: p.love,
      luckyNumber: p.number,
      luckyColorNepali: p.color,
      luckyColorHex: p.colorHex,
      luckyDirectionNepali: p.direction,
      ratingStars: p.stars,
    };
  });
}

/**
 * Get daily rashifal forecast for a single rashi by id
 */
export function getDailyForecastForRashi(rashiId: string, bsDate: BSDate): RashiDailyForecast {
  const rashi = RASHI_DATA.find((r) => r.id === rashiId) || RASHI_DATA[0];
  const p = DAILY_PREDICTIONS[rashi.id] || DAILY_PREDICTIONS['aries'];
  return {
    ...rashi,
    forecastNepali: p.forecast,
    healthForecastNepali: p.health,
    financeForecastNepali: p.finance,
    loveForecastNepali: p.love,
    luckyNumber: p.number,
    luckyColorNepali: p.color,
    luckyColorHex: p.colorHex,
    luckyDirectionNepali: p.direction,
    ratingStars: p.stars,
  };
}
