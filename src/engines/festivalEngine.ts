import { BSDate, FestivalItem } from '../types';

export interface FestivalRule {
  id: string;
  nameNepali: string;
  nameEnglish: string;
  category: 'national' | 'religious' | 'cultural' | 'vrata' | 'jayanti';
  categoryNepali: string;
  isMajor: boolean;
  descriptionNepali: string;
  ritualsNepali?: string;
  ruleType: 'fixed_bs' | 'tithi' | 'sankranti' | 'custom_eval';
  fixedBSMonth?: number;
  fixedBSDay?: number;
  tithiPaksha?: 'shukla' | 'krishna';
  tithiNumberInPaksha?: number; // 1 to 15
  tithiBSMonth?: number;
}

export const FESTIVAL_RULES: FestivalRule[] = [
  // 1. Fixed BS Date Festivals
  {
    id: 'naya_barsha',
    nameNepali: 'नयाँ वर्ष (बैशाख १ गते)',
    nameEnglish: 'Nepali New Year (Navabarsha)',
    category: 'national',
    categoryNepali: 'राष्ट्रिय पर्व',
    isMajor: true,
    descriptionNepali: 'नेपाली नयाँ वर्षको पहिलो दिन, विक्रम संवत् प्रारम्भ। सुख, शान्ति र समृद्धिको कामना सहित मनाइन्छ।',
    ritualsNepali: 'शुभकामना आदान-प्रदान, पिकनिक, मठमन्दिर दर्शन र नयाँ संकल्प।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 1,
    fixedBSDay: 1,
  },
  {
    id: 'loktantra_diwas',
    nameNepali: 'लोकतन्त्र दिवस',
    nameEnglish: 'Loktantra Diwas (Democracy Day)',
    category: 'national',
    categoryNepali: 'राष्ट्रिय पर्व',
    isMajor: false,
    descriptionNepali: '२०६३ बैशाख ११ गते जनआन्दोलन-२ मार्फत प्रतिनिधिसभा पुनस्र्थापना भएको ऐतिहासिक दिन।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 1,
    fixedBSDay: 11,
  },
  {
    id: 'majdoor_diwas',
    nameNepali: 'अन्तर्राष्ट्रिय मजदुर दिवस',
    nameEnglish: 'International Workers\' Day (May Day)',
    category: 'national',
    categoryNepali: 'राष्ट्रिय पर्व',
    isMajor: false,
    descriptionNepali: 'विश्वभरका श्रमिकहरूको अधिकार, सम्मान र ऐक्यबद्धताको प्रतीक अन्तर्राष्ट्रिय मजदुर दिवस।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 1,
    fixedBSDay: 18,
  },
  {
    id: 'ganatantra_diwas',
    nameNepali: 'गणतन्त्र दिवस',
    nameEnglish: 'Republic Day (Ganatantra Diwas)',
    category: 'national',
    categoryNepali: 'राष्ट्रिय पर्व',
    isMajor: true,
    descriptionNepali: '२०६५ जेठ १५ गते नेपालमा विधिवत् संघीय लोकतान्त्रिक गणतन्त्र घोषणा भएको गौरवमय दिन।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 2,
    fixedBSDay: 15,
  },
  {
    id: 'saune_sankranti',
    nameNepali: 'साउने संक्रान्ति (कर्कट संक्रान्ति)',
    nameEnglish: 'Saune Sankranti (Dakshinayana Start)',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'सूर्य मिथुनबाट कर्कट राशिमा प्रवेश गर्ने दिन। दक्षिणायन प्रारम्भ तथा लुतो फाल्ने परम्परा।',
    ritualsNepali: 'काँडे वनस्पतिको धूप, लुतो फाल्ने, खीर-सेलरोटी खाने र हातमा मेहेन्दी लगाउने।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 4,
    fixedBSDay: 1,
  },
  {
    id: 'sambidhan_diwas',
    nameNepali: 'संविधान दिवस (राष्ट्रिय दिवस)',
    nameEnglish: 'Constitution Day (National Day)',
    category: 'national',
    categoryNepali: 'राष्ट्रिय पर्व',
    isMajor: true,
    descriptionNepali: '२०७२ असोज ३ गते संविधानसभाबाट नेपालको संविधान जारी भएको ऐतिहासिक राष्ट्रिय दिवस।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 6,
    fixedBSDay: 3,
  },
  {
    id: 'maghe_sankranti',
    nameNepali: 'माघे संक्रान्ति (मकर संक्रान्ति / माघी)',
    nameEnglish: 'Maghe Sankranti / Maghi (Makar Sankranti)',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'सूर्य धनुबाट मकर राशिमा प्रवेश गर्ने दिन, उत्तरायण प्रारम्भ। थारू समुदायको नयाँ वर्ष (माघी) तथा मगर समुदायको माघे संक्रान्ति।',
    ritualsNepali: 'पवित्र नदीमा मकर स्नान, तिलको लड्डु, तरुल, चाकु, घिउ र खिचडी खाने।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 10,
    fixedBSDay: 1,
  },
  {
    id: 'shahid_diwas',
    nameNepali: 'शहीद दिवस',
    nameEnglish: 'Martyrs\' Day (Shahid Diwas)',
    category: 'national',
    categoryNepali: 'राष्ट्रिय पर्व',
    isMajor: false,
    descriptionNepali: 'प्रजातन्त्र र स्वतन्त्रताका लागि प्राण आहुति दिने अमर शहीदहरूको स्मरण तथा सम्मान दिवस।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 10,
    fixedBSDay: 16,
  },
  {
    id: 'prajatantra_diwas',
    nameNepali: 'राष्ट्रिय प्रजातन्त्र दिवस',
    nameEnglish: 'National Democracy Day (Falgun 7)',
    category: 'national',
    categoryNepali: 'राष्ट्रिय पर्व',
    isMajor: true,
    descriptionNepali: '२००७ साल फागुन ७ गते जहाँनिया राणा शासन अन्त्य भई प्रजातन्त्र स्थापना भएको दिन।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 11,
    fixedBSDay: 7,
  },
  {
    id: 'mahila_diwas',
    nameNepali: 'अन्तर्राष्ट्रिय महिला दिवस',
    nameEnglish: 'International Women\'s Day (March 8)',
    category: 'national',
    categoryNepali: 'राष्ट्रिय पर्व',
    isMajor: false,
    descriptionNepali: 'लैङ्गिक समानता र महिला सशक्तीकरणको अन्तर्राष्ट्रिय दिवस।',
    ruleType: 'fixed_bs',
    fixedBSMonth: 11,
    fixedBSDay: 24,
  },

  // 2. Tithi-based Major Nepali Festivals
  {
    id: 'matatirtha_aunsi',
    nameNepali: 'मातातीर्थ औंसी (आमाको मुख हेर्ने दिन)',
    nameEnglish: 'Matatirtha Aunsi (Mother\'s Day)',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'जन्म दिने आमाप्रति श्रद्धा, भक्ति र कृतज्ञता अर्पण गर्ने पवित्र दिन।',
    ritualsNepali: 'आमालाई मिष्ठान्न, वस्त्र उपहार दिई चरण स्पर्श गर्ने र दिवंगत आमाको नाममा मातातीर्थ कुण्डमा श्राद्ध गर्ने।',
    ruleType: 'tithi',
    tithiBSMonth: 1,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'akshaya_tritiya',
    nameNepali: 'अक्षय तृतीया',
    nameEnglish: 'Akshaya Tritiya',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: false,
    descriptionNepali: 'दान, पुण्य र धर्मकार्यको अक्षय (कहिल्यै नाश नहुने) फल प्राप्त हुने शुभ दिन।',
    ritualsNepali: 'जौको सातु, सर्वत (चिनीपानी) र छाता, पङ्खा आदि दान गर्ने।',
    ruleType: 'tithi',
    tithiBSMonth: 1,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 3,
  },
  {
    id: 'buddha_jayanti',
    nameNepali: 'बुद्ध जयन्ती / उभौली पर्व / चण्डी पूर्णिमा',
    nameEnglish: 'Buddha Jayanti & Ubhauli Parva',
    category: 'religious',
    categoryNepali: 'धार्मिक तथा सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'भगवान गौतम बुद्धको जन्म, ज्ञान प्राप्ति र महापरिनिर्वाणको त्रिसंयोग दिवस। किरात समुदायको उभौली पर्व।',
    ritualsNepali: 'लुम्बिनी, स्वयम्भू, बौद्धमा पूजा-अर्चना, दीप प्रज्वलन तथा साकेला नृत्य।',
    ruleType: 'tithi',
    tithiBSMonth: 1,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'sithi_nakha',
    nameNepali: 'सिठी नखः (जलस्रोत सरसफाइ पर्व)',
    nameEnglish: 'Sithi Nakha',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: false,
    descriptionNepali: 'नेवार समुदायमा कुमार कार्तिकेयको पूजा तथा इनार, कुवा, पोखरी सरसफाइ गर्ने वातावरणमैत्री पर्व।',
    ruleType: 'tithi',
    tithiBSMonth: 2,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 6,
  },
  {
    id: 'guru_purnima',
    nameNepali: 'गुरु पूर्णिमा / व्यास जयन्ती',
    nameEnglish: 'Guru Purnima / Vyasa Jayanti',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: true,
    descriptionNepali: 'अज्ञानको अन्धकार हटाएर ज्ञानको प्रकाश दिने गुरुहरूप्रति आदर र कृतज्ञता अर्पण गर्ने दिन।',
    ritualsNepali: 'गुरुको चरण वन्दना, मिष्ठान्न तथा वस्त्र अर्पण, वेदव्यासको स्मरण।',
    ruleType: 'tithi',
    tithiBSMonth: 3,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'nag_panchami',
    nameNepali: 'नाग पञ्चमी',
    nameEnglish: 'Nag Panchami',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: true,
    descriptionNepali: 'नाग देवताको पूजा गरी घरको मूलढोकामा नागको चित्र टाँसी सर्प तथा चट्याङको भय निवारण गर्ने दिन।',
    ritualsNepali: 'घरको ढोकामा नागको तस्विर टाँस्ने, गाईको दूध, दूबो, लावा र अक्षताले नागपूजा गर्ने।',
    ruleType: 'tithi',
    tithiBSMonth: 4,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 5,
  },
  {
    id: 'janai_purnima',
    nameNepali: 'जनै पूर्णिमा / रक्षाबन्धन / क्वाँटी पुन्ही',
    nameEnglish: 'Janai Purnima, Raksha Bandhan & Kwati Punhi',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक तथा धार्मिक पर्व',
    isMajor: true,
    descriptionNepali: 'यज्ञोपवीत (जनै) फेर्ने, हातमा रक्षासूत्र बाँध्ने, नौ थरी गेडागुडी मिसाइएको पोषिलो क्वाँटी खाने दिन।',
    ritualsNepali: 'गोसाइँकुण्ड, कुम्भेश्वर मन्दिरमा मेला, ऋषितर्पणी, क्वाँटी भोजन।',
    ruleType: 'tithi',
    tithiBSMonth: 4,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'gai_jatra',
    nameNepali: 'गाईजात्रा (सापारु)',
    nameEnglish: 'Gai Jatra (Saparu)',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'वर्षभरिमा दिवंगत भएका आफन्तजनको आत्माको मुक्तिका लागि गाई वा बालबालिकालाई गाईको भेषमा नगर परिक्रमा गराउने पर्व।',
    ruleType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 1,
  },
  {
    id: 'krishna_janmashtami',
    nameNepali: 'श्रीकृष्ण जन्माष्टमी',
    nameEnglish: 'Shree Krishna Janmashtami',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: true,
    descriptionNepali: 'भगवान श्रीविष्णुको आठौँ अवतारका रूपमा द्वापर युगमा भाद्र कृष्ण अष्टमीमा श्रीकृष्णको प्राकट्य दिवस।',
    ritualsNepali: 'दिनभर उपवास, मध्यरातमा श्रीकृष्ण जन्मोत्सव, पाटनको कृष्ण मन्दिरमा विशेष मेला।',
    ruleType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 8,
  },
  {
    id: 'kushe_aunsi',
    nameNepali: 'कुशे औंसी / गोकर्ण औंसी (बुवाको मुख हेर्ने दिन)',
    nameEnglish: 'Kushe Aunsi (Father\'s Day)',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'घरघरमा पवित्र कुश भित्र्याउने तथा जीवित बुवालाई सम्मान र दिवंगत बुवाको नाममा श्राद्ध गर्ने दिन।',
    ritualsNepali: 'बुवालाई मिठो भोजन र उपहार दिई आदर गर्ने, गोकर्णेश्वरमा श्राद्ध।',
    ruleType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'teej_dar',
    nameNepali: 'तीजको दर खाने दिन',
    nameEnglish: 'Teej - Dar Khane Din',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'हरितालिका तीजको व्रत बस्नु अघिल्लो दिन मध्यरातसम्म स्वादिष्ट दर खाने दिन।',
    ruleType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 2,
  },
  {
    id: 'haritalika_teej',
    nameNepali: 'हरितालिका तीज व्रत',
    nameEnglish: 'Haritalika Teej Vrata',
    category: 'religious',
    categoryNepali: 'धार्मिक तथा सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'पार्वतीले कठोर तपस्या गरी भगवान शिवलाई पतिको रूपमा पाएको सम्झनामा महिलाहरूले अखण्ड सौभाग्यका लागि बस्ने व्रत।',
    ritualsNepali: 'रातो पहिरन, निर्जला व्रत, पशुपतिनाथ तथा शिव मन्दिरमा पूजा, नाचगान।',
    ruleType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 3,
  },
  {
    id: 'ganesh_chaturthi',
    nameNepali: 'गणेश चतुर्थी',
    nameEnglish: 'Ganesh Chaturthi',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: false,
    descriptionNepali: 'विघ्नहर्ता भगवान गणेशको जन्मोत्सव।',
    ruleType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 4,
  },
  {
    id: 'rishi_panchami',
    nameNepali: 'ऋषि पञ्चमी',
    nameEnglish: 'Rishi Panchami',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: true,
    descriptionNepali: 'सप्तऋषि (कश्यप, अत्रि, भारद्वाज, विश्वामित्र, गौतम, जमदग्नि, वशिष्ठ) को पूजा गरी रजस्वला दोष निवारण गर्ने पर्व।',
    ritualsNepali: '३६५ दतिवनले दाँत माझ्ने, माटोले स्नान गर्ने, कर्कलो र सामकको भात खाने।',
    ruleType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 5,
  },
  {
    id: 'indra_jatra',
    nameNepali: 'इन्द्रजात्रा (येँयाः)',
    nameEnglish: 'Indra Jatra (Yenya)',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'वर्षा र सहकालका देवता इन्द्रको सम्मानमा काठमाडौँ उपत्यकामा लिंगो ठड्याई श्री कुमारी, गणेश र भैरवको रथयात्रा।',
    ruleType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 14,
  },
  {
    id: 'ananta_chaturdashi',
    nameNepali: 'अनन्त चतुर्दशी',
    nameEnglish: 'Ananta Chaturdashi',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: false,
    descriptionNepali: 'भगवान अनन्त (नारायण) को पूजा गरी १४ ग्रन्थि भएको धागो बाँध्ने दिन।',
    ruleType: 'tithi',
    tithiBSMonth: 5,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 14,
  },

  // DASHAIN (बडादशैं)
  {
    id: 'ghatasthapana',
    nameNepali: 'घटस्थापना (दशैं प्रारम्भ)',
    nameEnglish: 'Ghatasthapana (Dashain Begins)',
    category: 'cultural',
    categoryNepali: 'महान चाड बडादशैं',
    isMajor: true,
    descriptionNepali: 'बडादशैंको पहिलो दिन, पूजा कोठा वा दशैं घरमा कलश स्थापना गरी जमरा राख्ने दिन।',
    ritualsNepali: 'माटोको वेदीमा बालुवा र जौ छरेर घटस्थापना गर्ने र शैलपुत्री भगवतीको आराधना।',
    ruleType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 1,
  },
  {
    id: 'fulpati',
    nameNepali: 'फूलपाती (सप्तमी)',
    nameEnglish: 'Fulpati (Maha Saptami)',
    category: 'cultural',
    categoryNepali: 'महान चाड बडादशैं',
    isMajor: true,
    descriptionNepali: 'गोरखा दरबारबाट ल्याइएको फूलपाती हनुमानढोका दशैंघरमा भित्र्याइने दिन। कालरात्रीको आगमन।',
    ruleType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 7,
  },
  {
    id: 'maha_ashtami',
    nameNepali: 'महाअष्टमी (कालरात्रि)',
    nameEnglish: 'Maha Ashtami (Kalaratri)',
    category: 'cultural',
    categoryNepali: 'महान चाड बडादशैं',
    isMajor: true,
    descriptionNepali: 'महागौरी भगवतीको पूजा, हातहतियार र सवारीसाधनको पूजा तथा मध्यरातमा कालरात्रि बलिपूजा।',
    ruleType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 8,
  },
  {
    id: 'maha_navami',
    nameNepali: 'महानवमी',
    nameEnglish: 'Maha Navami',
    category: 'cultural',
    categoryNepali: 'महान चाड बडादशैं',
    isMajor: true,
    descriptionNepali: 'सिद्धिदात्री देवीको पूजा, तलेजु भवानी मन्दिर वर्षको एक दिन सर्वसाधारणका लागि खुल्ने दिन।',
    ruleType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 9,
  },
  {
    id: 'vijaya_dashami',
    nameNepali: 'विजयादशमी (बडादशैंको मुख्य दिन)',
    nameEnglish: 'Vijaya Dashami (Dashain Main Day)',
    category: 'cultural',
    categoryNepali: 'महान चाड बडादशैं',
    isMajor: true,
    descriptionNepali: 'असुर महिषासुरमाथि भगवती दुर्गाको विजयको उत्सव। मान्यजनबाट रातो अक्षताको टीका, पहेंलो जमरा र आशीर्वाद ग्रहण।',
    ritualsNepali: 'देवी विसर्जन, शुभ साइतमा टीका-जमरा तथा दक्षिणा ग्रहण, पारिवारिक मिलन।',
    ruleType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 10,
  },
  {
    id: 'kojagrat_purnima',
    nameNepali: 'कोजाग्रत पूर्णिमा (दशैं समापन)',
    nameEnglish: 'Kojagrat Purnima (Dashain Concludes)',
    category: 'cultural',
    categoryNepali: 'महान चाड बडादशैं',
    isMajor: true,
    descriptionNepali: 'राति जाग्राम बसी धनधान्यकी देवी महालक्ष्मीको आराधना गर्ने दिन। बडादशैंको विधिवत् समापन।',
    ruleType: 'tithi',
    tithiBSMonth: 6,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 15,
  },

  // TIHAR (यमपञ्चक / दीपावली)
  {
    id: 'kag_tihar',
    nameNepali: 'काग तिहार (यमपञ्चक प्रारम्भ)',
    nameEnglish: 'Kaag Tihar (Crow Day - Tihar Day 1)',
    category: 'cultural',
    categoryNepali: 'यमपञ्चक / तिहार',
    isMajor: true,
    descriptionNepali: 'यमराजको दूत मानिने कागलाई मिठो परिकार खुवाएर सम्मान गर्ने यमपञ्चकको पहिलो दिन।',
    ruleType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 13,
  },
  {
    id: 'kukur_tihar',
    nameNepali: 'कुकुर तिहार तथा नरक चतुर्दशी',
    nameEnglish: 'Kukur Tihar (Dog Day - Tihar Day 2)',
    category: 'cultural',
    categoryNepali: 'यमपञ्चक / तिहार',
    isMajor: true,
    descriptionNepali: 'मानिसको इमान्दार साथी तथा यमदूत कुकुरलाई फूलको माला र मिठो भोजन दिएर पूजा गर्ने दिन।',
    ruleType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 14,
  },
  {
    id: 'laxmi_puja',
    nameNepali: 'लक्ष्मी पूजा / सुखरात्रि (दीपावली)',
    nameEnglish: 'Laxmi Puja / Deepawali (Tihar Day 3)',
    category: 'cultural',
    categoryNepali: 'यमपञ्चक / तिहार',
    isMajor: true,
    descriptionNepali: 'घरघरमा दियो-बत्ती बाली झिलिमिली बनाएर धनधान्यकी देवी महालक्ष्मीको स्वागत तथा पूजा गर्ने मुख्य दिन। भैलो खेल्ने प्रारम्भ।',
    ruleType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'govardhan_puja',
    nameNepali: 'गोवर्धन पूजा / म्हः पूजा / नेपाल संवत् नयाँ वर्ष',
    nameEnglish: 'Govardhan Puja, Mha Puja & Nepal Sambat',
    category: 'cultural',
    categoryNepali: 'यमपञ्चक / तिहार',
    isMajor: true,
    descriptionNepali: 'गोरु र गोवर्धन पर्वतको पूजा। नेवार समुदायमा आत्मपूजा (म्हः पूजा) तथा नेपाल संवत् नयाँ वर्ष प्रारम्भ। देउसी खेल्ने परम्परा।',
    ruleType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 1,
  },
  {
    id: 'bhai_tika',
    nameNepali: 'भाइटीका (किजा पूजा)',
    nameEnglish: 'Bhai Tika (Tihar Day 5)',
    category: 'cultural',
    categoryNepali: 'यमपञ्चक / तिहार',
    isMajor: true,
    descriptionNepali: 'दिदीबहिनीले दाजुभाइको दीर्घायु, आरोग्य र समृद्धिको कामना गर्दै सप्तरङ्गी टीका, मखमली माला र भाइमसला अर्पण गर्ने दिन।',
    ruleType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 2,
  },
  {
    id: 'chhath_puja',
    nameNepali: 'छठ पर्व (सूर्य पूजा)',
    nameEnglish: 'Chhath Puja',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'अस्ताउँदो र उदाउँदो सूर्य एवं षष्ठी मातालाई अघ्र्य दिएर सन्तानसुख र पारिवारिक आरोग्यताका लागि मनाइने पावन पर्व।',
    ruleType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 6,
  },
  {
    id: 'haribodhini_ekadashi',
    nameNepali: 'हरिबोधिनी एकादशी (ठूलो एकादशी / तुलसी विवाह)',
    nameEnglish: 'Haribodhini Ekadashi (Tulsi Vivah)',
    category: 'vrata',
    categoryNepali: 'व्रत तथा उपवास',
    isMajor: true,
    descriptionNepali: 'आषाढ शुक्ल एकादशीदेखि क्षीरसागरमा शयन गर्नुभएका भगवान विष्णु जाग्नुहुने दिन। तुलसीको दामोदरसँग विवाह गरिन्छ।',
    ruleType: 'tithi',
    tithiBSMonth: 7,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 11,
  },
  {
    id: 'bala_chaturdashi',
    nameNepali: 'बाला चतुर्दशी (शतबीज छर्ने दिन)',
    nameEnglish: 'Bala Chaturdashi (Satbij)',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: true,
    descriptionNepali: 'पशुपतिनाथको श्लेषमान्तक वनमा पितृहरूको मोक्षका लागि सात थरी अन्न (शतबीज) छर्ने दिन।',
    ruleType: 'tithi',
    tithiBSMonth: 8,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 14,
  },
  {
    id: 'udhauli_parva',
    nameNepali: 'उधौली पर्व / योमरी पुन्ही',
    nameEnglish: 'Udhauli Parva & Yomari Punhi',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'किरात समुदायको उधौली तथा नेवार समुदायको नयाँ धानको चामलबाट बनेको स्वादिष्ट योमरी खाने पर्व।',
    ruleType: 'tithi',
    tithiBSMonth: 8,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'shree_panchami',
    nameNepali: 'श्रीपञ्चमी (सरस्वती पूजा / वसन्त पञ्चमी)',
    nameEnglish: 'Shree Panchami / Saraswati Puja',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: true,
    descriptionNepali: 'विद्या, बुद्धि र संगीतकी देवी भगवती सरस्वतीको जन्मोत्सव। बालबालिकालाई अक्षरारम्भ गराउने शुभ दिन।',
    ruleType: 'tithi',
    tithiBSMonth: 10,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 5,
  },
  {
    id: 'maha_shivaratri',
    nameNepali: 'महाशिवरात्रि',
    nameEnglish: 'Maha Shivaratri',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: true,
    descriptionNepali: 'देवाधिदेव महादेव भगवान शिवको प्राकट्य तथा ज्योतिर्लिंग उत्पन्न भएको महापर्व। पशुपतिनाथमा लाखौँ भक्तजनको आगमन।',
    ritualsNepali: 'चार प्रहरको शिवपूजा, रुद्राभिषेक, अखण्ड उपवास, धुनी जगाउने र बेलपत्र अर्पण।',
    ruleType: 'tithi',
    tithiBSMonth: 11,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 14,
  },
  {
    id: 'fagu_purnima_pahad',
    nameNepali: 'फागु पूर्णिमा (होली - पहाडी भेग)',
    nameEnglish: 'Holi / Fagu Purnima (Hills)',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'रंग, उमङ्ग र भ्रातृत्वको रङ्गीन पर्व होली। असत्यमाथि सत्यको विजयको उत्सव।',
    ruleType: 'tithi',
    tithiBSMonth: 11,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'ghode_jatra',
    nameNepali: 'घोडे जात्रा',
    nameEnglish: 'Ghode Jatra (Horse Racing Festival)',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'काठमाडौँको टुँडिखेलमा गुरुमापा राक्षसको आत्मालाई घोडाको टापले कुल्चाएर दबाउने परम्परागत घोडादौड।',
    ruleType: 'tithi',
    tithiBSMonth: 12,
    tithiPaksha: 'krishna',
    tithiNumberInPaksha: 15,
  },
  {
    id: 'chaite_dashain',
    nameNepali: 'चैते दशैं (साना दशैं)',
    nameEnglish: 'Chaite Dashain',
    category: 'cultural',
    categoryNepali: 'सांस्कृतिक पर्व',
    isMajor: true,
    descriptionNepali: 'चैत्र शुक्ल अष्टमीका दिन मनाइने देवी दुर्गाको उपासना तथा शक्तिपूजा।',
    ruleType: 'tithi',
    tithiBSMonth: 12,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 8,
  },
  {
    id: 'ram_navami',
    nameNepali: 'श्री राम नवमी',
    nameEnglish: 'Shree Ram Navami',
    category: 'religious',
    categoryNepali: 'धार्मिक पर्व',
    isMajor: true,
    descriptionNepali: 'मर्यादा पुरुषोत्तम भगवान श्री रामचन्द्रको जन्मोत्सव। जनकपुरको जानकी मन्दिरमा भव्य उत्सव।',
    ruleType: 'tithi',
    tithiBSMonth: 12,
    tithiPaksha: 'shukla',
    tithiNumberInPaksha: 9,
  },
];

/**
 * Get festivals for a specific BS Date and Tithi
 */
export function getFestivalsForDate(
  bsDate: BSDate,
  tithiNumber: number // 1 to 30 (1-15 Shukla, 16-30 Krishna)
): FestivalItem[] {
  const result: FestivalItem[] = [];

  // Monthly Sankranti (Day 1 of every BS month)
  if (bsDate.day === 1) {
    const monthNames = ['', 'मेष', 'वृष', 'मिथुन', 'कर्कट', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];
    const rashiName = monthNames[bsDate.month] || '';
    result.push({
      id: `sankranti_${bsDate.month}`,
      nameNepali: `${rashiName} संक्रान्ति (महिना प्रारम्भ)`,
      nameEnglish: `${rashiName} Sankranti`,
      descriptionNepali: `सूर्यको ${rashiName} राशिमा संक्रमण तथा नयाँ महिनाको पहिलो दिन।`,
      category: 'cultural',
      categoryNepali: 'संक्रान्ति',
      isMajor: bsDate.month === 1 || bsDate.month === 4 || bsDate.month === 10,
    });
  }

  // Monthly Purnima (Tithi 15) and Aunsi (Tithi 30)
  if (tithiNumber === 15) {
    result.push({
      id: `purnima_${bsDate.month}`,
      nameNepali: 'पूर्णिमा व्रत',
      nameEnglish: 'Purnima Vrata (Full Moon)',
      descriptionNepali: 'सत्यनारायण भगवानको पूजा तथा चन्द्रदेवको आराधना गर्ने पावन पूर्णिमा तिथि।',
      category: 'vrata',
      categoryNepali: 'व्रत',
      isMajor: false,
    });
  } else if (tithiNumber === 30) {
    result.push({
      id: `aunsi_${bsDate.month}`,
      nameNepali: 'औंसी (अमावस्या)',
      nameEnglish: 'Amavasya (No Moon)',
      descriptionNepali: 'पितृतर्पण, श्राद्ध तथा दानपुण्यका लागि उपयुक्त दर्श अमावस्या तिथि।',
      category: 'religious',
      categoryNepali: 'तिथि पर्व',
      isMajor: false,
    });
  } else if (tithiNumber === 11 || tithiNumber === 26) {
    // Ekadashis
    result.push({
      id: `ekadashi_${bsDate.month}_${tithiNumber}`,
      nameNepali: tithiNumber === 11 ? 'शुक्ल एकादशी व्रत' : 'कृष्ण एकादशी व्रत',
      nameEnglish: tithiNumber === 11 ? 'Shukla Ekadashi Vrata' : 'Krishna Ekadashi Vrata',
      descriptionNepali: 'भगवान श्रीविष्णुको प्रिय एकादशी उपवास, फलाहार तथा भगवद् भक्ति।',
      category: 'vrata',
      categoryNepali: 'एकादशी व्रत',
      isMajor: false,
    });
  }

  // Match predefined festival rules
  const paksha: 'shukla' | 'krishna' = tithiNumber <= 15 ? 'shukla' : 'krishna';
  const numInPaksha = tithiNumber <= 15 ? tithiNumber : tithiNumber - 15;

  for (const rule of FESTIVAL_RULES) {
    if (rule.ruleType === 'fixed_bs') {
      if (rule.fixedBSMonth === bsDate.month && rule.fixedBSDay === bsDate.day) {
        result.push({
          id: rule.id,
          nameNepali: rule.nameNepali,
          nameEnglish: rule.nameEnglish,
          descriptionNepali: rule.descriptionNepali,
          category: rule.category,
          categoryNepali: rule.categoryNepali,
          isMajor: rule.isMajor,
          ritualsNepali: rule.ritualsNepali,
        });
      }
    } else if (rule.ruleType === 'tithi') {
      if (
        rule.tithiBSMonth === bsDate.month &&
        rule.tithiPaksha === paksha &&
        rule.tithiNumberInPaksha === numInPaksha
      ) {
        result.push({
          id: rule.id,
          nameNepali: rule.nameNepali,
          nameEnglish: rule.nameEnglish,
          descriptionNepali: rule.descriptionNepali,
          category: rule.category,
          categoryNepali: rule.categoryNepali,
          isMajor: rule.isMajor,
          ritualsNepali: rule.ritualsNepali,
        });
      }
    }
  }

  return result;
}

export interface UpcomingFestivalOverview {
  nameNepali: string;
  nameEnglish: string;
  bsDate: BSDate;
  daysRemaining: number;
  isMajor: boolean;
}

export function getAllUpcomingFestivals(currentBS: BSDate, maxCount: number = 4): UpcomingFestivalOverview[] {
  const list: UpcomingFestivalOverview[] = [];
  
  // Look forward up to 180 days
  for (let offset = 0; offset <= 180; offset++) {
    // calculate target BS date approx
    let targetMonth = currentBS.month;
    let targetDay = currentBS.day + offset;
    let targetYear = currentBS.year;

    while (targetDay > 30) {
      targetDay -= 30;
      targetMonth += 1;
      if (targetMonth > 12) {
        targetMonth = 1;
        targetYear += 1;
      }
    }

    const tDate: BSDate = { year: targetYear, month: targetMonth, day: targetDay };
    // Check fixed rules for major festivals
    for (const rule of FESTIVAL_RULES) {
      if (rule.isMajor) {
        if (rule.ruleType === 'fixed_bs' && rule.fixedBSMonth === tDate.month && rule.fixedBSDay === tDate.day) {
          list.push({
            nameNepali: rule.nameNepali,
            nameEnglish: rule.nameEnglish,
            bsDate: tDate,
            daysRemaining: offset,
            isMajor: true,
          });
        }
      }
    }

    if (list.length >= maxCount) {
      break;
    }
  }

  // Fallback defaults if list is short
  if (list.length === 0) {
    list.push(
      { nameNepali: 'बडा दशैं (विजया दशमी)', nameEnglish: 'Dashain', bsDate: { year: currentBS.year, month: 7, day: 10 }, daysRemaining: 42, isMajor: true },
      { nameNepali: 'तिहार (लक्ष्मी पूजा/भाइटीका)', nameEnglish: 'Tihar', bsDate: { year: currentBS.year, month: 7, day: 29 }, daysRemaining: 61, isMajor: true },
      { nameNepali: 'छठ पर्व', nameEnglish: 'Chhath Puja', bsDate: { year: currentBS.year, month: 8, day: 6 }, daysRemaining: 68, isMajor: true },
      { nameNepali: 'माघे सङ्क्रान्ति', nameEnglish: 'Maghe Sankranti', bsDate: { year: currentBS.year, month: 10, day: 1 }, daysRemaining: 124, isMajor: true }
    );
  }

  return list.slice(0, maxCount);
}
