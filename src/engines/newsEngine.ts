import { NewsArticle } from '../types';

export interface RSSFeedSource {
  id: string;
  name: string;
  nameNepali: string;
  category: string;
  rssUrl: string;
  websiteUrl: string;
  logoText: string;
  logoBg: string;
  isEnabled: boolean;
  lastFetched?: string;
  status: 'healthy' | 'warning' | 'error';
  itemCount?: number;
  descriptionNepali?: string;
}

export const RSS_SOURCES: RSSFeedSource[] = [
  {
    id: 'onlinekhabar',
    name: 'OnlineKhabar',
    nameNepali: 'अनलाइनखबर',
    category: 'समाज',
    rssUrl: 'https://www.onlinekhabar.com/feed',
    websiteUrl: 'https://www.onlinekhabar.com',
    logoText: 'OK',
    logoBg: 'bg-red-600 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'नेपालको अग्रणी अनलाइन समाचार पोर्टल',
  },
  {
    id: 'setopati',
    name: 'Setopati',
    nameNepali: 'सेतोपाटी',
    category: 'समसामयिक',
    rssUrl: 'https://setopati.com/feed',
    websiteUrl: 'https://setopati.com',
    logoText: 'SP',
    logoBg: 'bg-blue-600 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'डिजिटल पत्रिका तथा विचार मञ्च',
  },
  {
    id: 'ratopati',
    name: 'Ratopati',
    nameNepali: 'रातोपाटी',
    category: 'राजनीति',
    rssUrl: 'https://ratopati.com/feed',
    websiteUrl: 'https://ratopati.com',
    logoText: 'RP',
    logoBg: 'bg-rose-600 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'राजनीतिक तथा समसामयिक विश्लेषण',
  },
  {
    id: 'kantipur',
    name: 'Kantipur',
    nameNepali: 'कान्तिपुर',
    category: 'समसामयिक',
    rssUrl: 'https://ekantipur.com/feed',
    websiteUrl: 'https://ekantipur.com',
    logoText: 'KP',
    logoBg: 'bg-indigo-700 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'नेपालको राष्ट्रिय दैनिक',
  },
  {
    id: 'bbc_nepali',
    name: 'BBC Nepali',
    nameNepali: 'बीबीसी नेपाली',
    category: 'विश्व',
    rssUrl: 'https://feeds.bbci.co.uk/nepali/rss.xml',
    websiteUrl: 'https://www.bbc.com/nepali',
    logoText: 'BBC',
    logoBg: 'bg-red-800 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'अन्तर्राष्ट्रिय तथा खोजमूलक समाचार',
  },
  {
    id: 'gorkhapatra',
    name: 'Gorkhapatra',
    nameNepali: 'गोरखापत्र',
    category: 'अर्थ / समाज',
    rssUrl: 'https://gorkhapatraonline.com/rss',
    websiteUrl: 'https://gorkhapatraonline.com',
    logoText: 'GP',
    logoBg: 'bg-emerald-700 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'नेपालको जेठो सरकारी राष्ट्रिय दैनिक',
  },
  {
    id: 'nagarik',
    name: 'Nagarik News',
    nameNepali: 'नागरिक',
    category: 'समसामयिक',
    rssUrl: 'https://nagariknews.nagariknetwork.com/feed',
    websiteUrl: 'https://nagariknews.nagariknetwork.com',
    logoText: 'NN',
    logoBg: 'bg-amber-600 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'नागरिक नेटवर्कको डिजिटल संस्करण',
  },
  {
    id: 'khabarhub',
    name: 'Khabarhub',
    nameNepali: 'खबरहब',
    category: 'राजनीति',
    rssUrl: 'https://khabarhub.com/feed',
    websiteUrl: 'https://khabarhub.com',
    logoText: 'KH',
    logoBg: 'bg-sky-600 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'नेपाल तथा विश्वका ताजा अपडेटहरू',
  },
  {
    id: 'baahrakhari',
    name: 'Baahrakhari',
    nameNepali: 'बाह्रखरी',
    category: 'विचार',
    rssUrl: 'https://baahrakhari.com/feed',
    websiteUrl: 'https://baahrakhari.com',
    logoText: '१२',
    logoBg: 'bg-purple-700 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'विचार, साहित्य र विशेष रिपोर्टिङ',
  },
  {
    id: 'ujyaalo',
    name: 'Ujyaalo Online',
    nameNepali: 'उज्यालो अनलाइन',
    category: 'समाज',
    rssUrl: 'https://ujyaaloonline.com/feed',
    websiteUrl: 'https://ujyaaloonline.com',
    logoText: 'UO',
    logoBg: 'bg-orange-600 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'रेडियो तथा सामुदायिक समाचार नेटवर्क',
  },
  {
    id: 'arthasansar',
    name: 'Artha Sansar',
    nameNepali: 'अर्थसंसार',
    category: 'अर्थ',
    rssUrl: 'https://arthasansar.com/feed',
    websiteUrl: 'https://arthasansar.com',
    logoText: 'AS',
    logoBg: 'bg-teal-700 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'सेयर बजार, बैंकिङ र अर्थतन्त्र',
  },
  {
    id: 'hamrokhelkud',
    name: 'Hamro Khelkud',
    nameNepali: 'हाम्रो खेलकुद',
    category: 'खेलकुद',
    rssUrl: 'https://hamrokhelkud.com/feed',
    websiteUrl: 'https://hamrokhelkud.com',
    logoText: 'HK',
    logoBg: 'bg-green-600 text-white',
    isEnabled: true,
    status: 'healthy',
    descriptionNepali: 'नेपाली खेलकुदको आधिकारिक मञ्च',
  },
];

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'विक्रम संवत् २०८३ को पात्रो तथा राष्ट्रिय शुभ साइतहरूको आधिकारिक विमोचन',
    source: 'गोरखापत्र',
    category: 'संस्कृति',
    publishedAt: '३ मिनेट अघि',
    summary: 'नेपाल पञ्चाङ्ग निर्णायक विकास समिति तथा वरिष्ठ ज्योतिर्विद्हरूद्वारा नयाँ वर्षका सम्पूर्ण चाडपर्व, सूर्यग्रहण, चन्द्रग्रहण, व्रत तथा विवाह–व्रतबन्धका शुभ मुहूर्तहरूको सूची जारी गरिएको छ।',
    originalUrl: 'https://gorkhapatraonline.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-2',
    title: 'काठमाडौँ उपत्यकाको सांस्कृतिक सम्पदा संरक्षण तथा जात्रा व्यवस्थापनमा नयाँ प्रविधि प्रयोग',
    source: 'सेतोपाटी',
    category: 'समाज',
    publishedAt: '१० मिनेट अघि',
    summary: 'पशुपतिनाथ, स्वयम्भू, पाटन तथा भक्तपुर दरबार क्षेत्रमा आउँदा प्रमुख चाडपर्वहरूमा भक्तजनको सहजताका लागि डिजिटल नक्सा, प्रत्यक्ष भीड अनुगमन र ट्राफिक व्यवस्थापन सुरु गरिएको छ।',
    originalUrl: 'https://setopati.com',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-3',
    title: 'नेपालको जलविद्युत् उत्पादनमा ऐतिहासिक रेकर्ड, अन्तरदेशीय प्रसारणमार्फत छिमेकी मुलुकतर्फ निर्यात',
    source: 'रातोपाटी',
    category: 'अर्थ',
    publishedAt: '१८ मिनेट अघि',
    summary: 'नेपालका प्रमुख नदी बेसिनहरूमा निर्माण सम्पन्न भएका जलविद्युत् आयोजनाहरूबाट उत्पादित स्वच्छ ऊर्जा अन्तरदेशीय ग्रिडमार्फत उच्च दरमा निर्यात भई विदेशी मुद्रा आर्जनमा ठूलो टेवा पुगेको छ।',
    originalUrl: 'https://ratopati.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-4',
    title: 'नेपाली राष्ट्रिय क्रिकेट टोलीको उत्कृष्ट प्रदर्शन, रोमाञ्चक खेलमा अन्तर्राष्ट्रिय प्रतिद्वन्द्वी पराजित',
    source: 'हाम्रो खेलकुद',
    category: 'खेलकुद',
    publishedAt: '२८ मिनेट अघि',
    summary: 'त्रिवि क्रिकेट मैदान कीर्तिपुरमा हजारौँ दर्शकमाझ भएको रोमाञ्चक खेलमा नेपाली खेलाडीहरूको सानदार ब्याटिङ र उत्कृष्ट स्पिन आक्रमणले नेपाललाई ऐतिहासिक जित दिलाएको छ।',
    originalUrl: 'https://hamrokhelkud.com',
    readTimeMinutes: 2,
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-5',
    title: 'आर्टिफिसियल इन्टेलिजेन्स (एआई) र डिजिटल नेपाल फ्रेमवर्क २.० राष्ट्रिय नीति पारित',
    source: 'कान्तिपुर',
    category: 'प्रविधि',
    publishedAt: '४५ मिनेट अघि',
    summary: 'नेपाल सरकारले डिजिटल सुशासन, साइबर सुरक्षा, स्थानीय भाषामा एआई मोडल विकास तथा दुर्गम भेगमा उच्च गतिको इन्टरनेट विस्तार गर्ने दीर्घकालीन कार्ययोजना स्वीकृत गरेको छ।',
    originalUrl: 'https://ekantipur.com',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-6',
    title: 'नेपाल स्टक एक्सचेञ्ज (नेप्से) परिसूचकमा उल्लेख्य सुधार, जलविद्युत् र बैंकिङ क्षेत्रमा आकर्षण',
    source: 'अर्थसंसार',
    category: 'अर्थ',
    publishedAt: '१ घण्टा अघि',
    summary: 'आजको सेयर बजारमा लगानीकर्ताहरूको मनोबल उच्च देखिएको छ। समग्र नेप्से परिसूचक दोहोरो अंकले बढ्दै दैनिक कारोबार रकममा उत्साहजनक वृद्धि दर्ता भएको छ।',
    originalUrl: 'https://arthasansar.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-7',
    title: 'विश्व जलवायु सम्मेलनमा हिमाली राष्ट्रहरूको साझा माग: पर्वतीय पारिस्थितिकी जोगाउन क्षतिपूर्ति कोष',
    source: 'बीबीसी नेपाली',
    category: 'विश्व',
    publishedAt: '१ घण्टा अघि',
    summary: 'हिमनदी पग्लिने जोखिम र जलवायु संकटबाट प्रभावित पर्वतीय समुदायको जीविकोपार्जन संरक्षणका लागि नेपाल लगायत हिमाली राष्ट्रहरूले अन्तर्राष्ट्रिय मञ्चमा सशक्त आवाज उठाएका छन्।',
    originalUrl: 'https://www.bbc.com/nepali',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-8',
    title: 'अन्नपूर्ण, सगरमाथा तथा मनास्लु पदमार्ग क्षेत्रमा वसन्तकालीन विदेशी पर्यटकको उत्साहजनक आगमन',
    source: 'नागरिक',
    category: 'समाज',
    publishedAt: '२ घण्टा अघि',
    summary: 'नेपालका प्रमुख पदयात्रा मार्गहरूमा युरोप, अमेरिका तथा एसियाली मुलुकहरूबाट आउने पदयात्री तथा पर्वतारोहीहरूको संख्यामा गत वर्षभन्दा ३५ प्रतिशतले वृद्धि भएको पर्यटन बोर्डले जनाएको छ।',
    originalUrl: 'https://nagariknews.nagariknetwork.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-9',
    title: 'संसदको चालु अधिवेशनमा महत्त्वपूर्ण विकास तथा नागरिक अधिकारसम्बन्धी विधेयकमाथि छलफल',
    source: 'अनलाइनखबर',
    category: 'राजनीति',
    publishedAt: '२ घण्टा अघि',
    summary: 'प्रतिनिधिसभा र राष्ट्रियसभामा सार्वजनिक सरोकारका कानुनहरू निर्माण प्रक्रिया द्रुत गतिमा अघि बढाइएको छ। दलहरूबीच सहमति जुटाउने प्रयास जारी छ।',
    originalUrl: 'https://www.onlinekhabar.com',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-10',
    title: 'नेपाली मौलिक लोकसंस्कृति र चलचित्र क्षेत्रमा नयाँ पुस्ताको सिर्जनात्मक तरंग',
    source: 'बाह्रखरी',
    category: 'मनोरञ्जन',
    publishedAt: '३ घण्टा अघि',
    summary: 'नेपाली मौलिक कथावस्तुमा आधारित अन्तर्राष्ट्रिय फिल्म फेस्टिभलहरूमा नेपाली चलचित्रले विभिन्न विधामा अवार्ड तथा प्रशंसा प्राप्त गर्न सफल भएका छन्।',
    originalUrl: 'https://baahrakhari.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-11',
    title: 'सामुदायिक रेडियोहरूको राष्ट्रिय महाधिवेशन: सूचनाको हक र गाउँगाउँमा सञ्चारको पहुँच',
    source: 'उज्यालो अनलाइन',
    category: 'समाज',
    publishedAt: '३ घण्टा अघि',
    summary: 'विपद् व्यवस्थापन, स्थानीय भाषामा समाचार सम्प्रेषण र नागरिक सशक्तीकरणमा स्थानीय एफएम रेडियोहरूको भूमिका थप सुदृढ बनाउने प्रतिबद्धता व्यक्त।',
    originalUrl: 'https://ujyaaloonline.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-12',
    title: 'नेपालमा विद्युतीय सवारीसाधन (EV) को प्रयोगमा व्यापक वृद्धि, चार्जिङ पूर्वाधार विस्तार तीव्र',
    source: 'खबरहब',
    category: 'प्रविधि',
    publishedAt: '४ घण्टा अघि',
    summary: 'राजमार्ग तथा प्रमुख सहरहरूमा फास्ट चार्जिङ स्टेशनहरूको सञ्जाल फैलिएसँगै इन्धन आयातमा कमी र वातावरण संरक्षणमा सकारात्मक प्रभाव देखिन थालेको छ।',
    originalUrl: 'https://khabarhub.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop&q=80',
  },
];

// Helper to convert date string to Nepali relative time string
export function formatNepaliRelativeTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return 'भर्खरै';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'भर्खरै';
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'भर्खरै';
    if (diffMins < 60) return `${diffMins} मिनेट अघि`;
    if (diffHours < 24) return `${diffHours} घण्टा अघि`;
    if (diffDays === 1) return 'हिजो';
    if (diffDays < 30) return `${diffDays} दिन अघि`;
    return d.toLocaleDateString('ne-NP');
  } catch (e) {
    return 'भर्खरै';
  }
}

// Auto categorize news by keywords
export function detectCategoryFromText(title: string, content: string): string {
  const text = (title + ' ' + content).toLowerCase();
  if (
    text.includes('राजनीति') ||
    text.includes('संसद') ||
    text.includes('मन्त्री') ||
    text.includes('प्रधानमन्त्री') ||
    text.includes('पार्टी') ||
    text.includes('निर्वाचन') ||
    text.includes('सरकार') ||
    text.includes('कांग्रेस') ||
    text.includes('एमाले') ||
    text.includes('माओवादी') ||
    text.includes('विधेयक')
  ) {
    return 'राजनीति';
  }
  if (
    text.includes('अर्थ') ||
    text.includes('बजेट') ||
    text.includes('बैंक') ||
    text.includes('नेप्से') ||
    text.includes('सेयर') ||
    text.includes('व्यापार') ||
    text.includes('मुद्रा') ||
    text.includes('सुन') ||
    text.includes('डलर') ||
    text.includes('उद्योग') ||
    text.includes('राजस्व') ||
    text.includes('कारोबार')
  ) {
    return 'अर्थ';
  }
  if (
    text.includes('खेल') ||
    text.includes('क्रिकेट') ||
    text.includes('फुटबल') ||
    text.includes('खेलाडी') ||
    text.includes('विश्वकप') ||
    text.includes('ओलम्पिक') ||
    text.includes('प्रतियोगिता') ||
    text.includes('च्याम्पियन')
  ) {
    return 'खेलकुद';
  }
  if (
    text.includes('प्रविधि') ||
    text.includes('एआई') ||
    text.includes('मोवाइल') ||
    text.includes('कम्प्युटर') ||
    text.includes('इन्टरनेट') ||
    text.includes('एप') ||
    text.includes('साइबर') ||
    text.includes('डिजिटल') ||
    text.includes('विद्युतीय') ||
    text.includes('चार्ज')
  ) {
    return 'प्रविधि';
  }
  if (
    text.includes('विश्व') ||
    text.includes('अन्तर्राष्ट्रिय') ||
    text.includes('अमेरिका') ||
    text.includes('भारत') ||
    text.includes('चीन') ||
    text.includes('युक्रेन') ||
    text.includes('रुस') ||
    text.includes('गाजा') ||
    text.includes('संयुक्त राष्ट्र') ||
    text.includes('जलवायु')
  ) {
    return 'विश्व';
  }
  if (
    text.includes('सिनेमा') ||
    text.includes('कला') ||
    text.includes('फिल्म') ||
    text.includes('गीत') ||
    text.includes('संगीत') ||
    text.includes('अभिनेता') ||
    text.includes('अभिनेत्री') ||
    text.includes('मनोरञ्जन') ||
    text.includes('चलचित्र')
  ) {
    return 'मनोरञ्जन';
  }
  if (
    text.includes('चाड') ||
    text.includes('पर्व') ||
    text.includes('दशैं') ||
    text.includes('तिहार') ||
    text.includes('संस्कृति') ||
    text.includes('सम्पदा') ||
    text.includes('पात्रो') ||
    text.includes('मन्दिर') ||
    text.includes('पञ्चाङ्ग') ||
    text.includes('साइत')
  ) {
    return 'संस्कृति';
  }
  return 'समाज';
}

const LOCAL_NEWS_STORAGE_KEY = 'namro_smart_patro_cached_news';

/**
 * Get stored cached news from localStorage or fallback to INITIAL_NEWS_ARTICLES
 */
export function getCachedNews(): NewsArticle[] {
  try {
    const raw = localStorage.getItem(LOCAL_NEWS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return INITIAL_NEWS_ARTICLES;
}

/**
 * Save articles to local storage
 */
export function saveNewsToCache(articles: NewsArticle[]): void {
  try {
    localStorage.setItem(LOCAL_NEWS_STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {}
}

/**
 * Text to Speech in Nepali/Hindi
 */
export function speakNepaliText(text: string, onEnd?: () => void): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return () => {};
  }

  window.speechSynthesis.cancel();
  const clean = text.replace(/<[^>]*>?/gm, ' ').slice(0, 350);
  const utterance = new SpeechSynthesisUtterance(clean);

  // Try to find Nepali or Hindi voice
  const voices = window.speechSynthesis.getVoices();
  const nepaliVoice = voices.find((v) => v.lang.startsWith('ne') || v.lang.startsWith('hi'));
  if (nepaliVoice) {
    utterance.voice = nepaliVoice;
  }
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

