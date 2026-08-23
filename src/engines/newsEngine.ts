import { NewsArticle } from '../types';

export interface RSSFeedSource {
  id: string;
  name: string;
  category: string;
  rssUrl: string;
  websiteUrl: string;
  logoUrl?: string;
  isEnabled: boolean;
  lastFetched?: string;
  status: 'healthy' | 'warning' | 'error';
  itemCount?: number;
}

export const RSS_SOURCES: RSSFeedSource[] = [
  {
    id: 'onlinekhabar',
    name: 'OnlineKhabar (अनलाइनखबर)',
    category: 'समाज',
    rssUrl: 'https://www.onlinekhabar.com/feed',
    websiteUrl: 'https://www.onlinekhabar.com',
    isEnabled: true,
    status: 'healthy',
  },
  {
    id: 'setopati',
    name: 'Setopati (सेतोपाटी)',
    category: 'समसामयिक',
    rssUrl: 'https://setopati.com/feed',
    websiteUrl: 'https://setopati.com',
    isEnabled: true,
    status: 'healthy',
  },
  {
    id: 'ratopati',
    name: 'Ratopati (रातोपाटी)',
    category: 'राजनीति',
    rssUrl: 'https://ratopati.com/feed',
    websiteUrl: 'https://ratopati.com',
    isEnabled: true,
    status: 'healthy',
  },
  {
    id: 'kantipur',
    name: 'Kantipur (कान्तिपुर)',
    category: 'समसामयिक',
    rssUrl: 'https://ekantipur.com/feed',
    websiteUrl: 'https://ekantipur.com',
    isEnabled: true,
    status: 'healthy',
  },
  {
    id: 'bbc_nepali',
    name: 'BBC Nepali (बीबीसी नेपाली)',
    category: 'विश्व',
    rssUrl: 'https://feeds.bbci.co.uk/nepali/rss.xml',
    websiteUrl: 'https://www.bbc.com/nepali',
    isEnabled: true,
    status: 'healthy',
  },
  {
    id: 'gorkhapatra',
    name: 'Gorkhapatra (गोरखापत्र)',
    category: 'अर्थ / समाज',
    rssUrl: 'https://gorkhapatraonline.com/rss',
    websiteUrl: 'https://gorkhapatraonline.com',
    isEnabled: true,
    status: 'healthy',
  },
  {
    id: 'nagarik',
    name: 'Nagarik News (नागरिक)',
    category: 'समसामयिक',
    rssUrl: 'https://nagariknews.nagariknetwork.com/feed',
    websiteUrl: 'https://nagariknews.nagariknetwork.com',
    isEnabled: true,
    status: 'healthy',
  },
  {
    id: 'khabarhub',
    name: 'Khabarhub (खबरहब)',
    category: 'राजनीति',
    rssUrl: 'https://khabarhub.com/feed',
    websiteUrl: 'https://khabarhub.com',
    isEnabled: true,
    status: 'healthy',
  },
];

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'नेपालमा विक्रम संवत् २०८३ को पात्रो तथा शुभ साइतहरूको सार्वजनिक विमोचन',
    source: 'गोरखापत्र',
    category: 'समसामयिक',
    publishedAt: '५ मिनेट अघि',
    summary: 'नेपाल पञ्चाङ्ग निर्णायक विकास समिति तथा ज्योतिर्विद्हरूद्वारा नयाँ वर्ष २०८३ का चाडपर्व, तिथि, सूर्यग्रहण, चन्द्रग्रहण तथा शुभ मुहूर्तको विस्तृत विवरण प्रस्तुत गरिएको छ।',
    originalUrl: 'https://gorkhapatraonline.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-2',
    title: 'काठमाडौँ उपत्यकाको सम्पदा संरक्षण तथा सांस्कृतिक पर्व व्यवस्थापनमा नयाँ योजना',
    source: 'सेतोपाटी',
    category: 'समाज',
    publishedAt: '१२ मिनेट अघि',
    summary: 'पशुपतिनाथ, स्वयम्भू तथा पाटन दरबार क्षेत्रमा आउँदा चाडपर्वहरूमा भक्तजनको सहजताका लागि डिजिटल व्यवस्थापन र ट्राफिक व्यवस्थापन सुरु गरिएको छ।',
    originalUrl: 'https://setopati.com',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-3',
    title: 'नेपालको जलविद्युत् उत्पादनमा ऐतिहासिक वृद्धि, छिमेकी देशतर्फ निर्यात विस्तार',
    source: 'रातोपाटी',
    category: 'अर्थ',
    publishedAt: '२५ मिनेट अघि',
    summary: 'वर्षायामको सुरुसँगै नेपालका प्रमुख जलविद्युत् आयोजनाहरू पूर्ण क्षमतामा सञ्चालन भई दैनिक सयौँ मेगावाट विद्युत् प्रसारण लाइनमार्फत निर्यात भइरहेको छ।',
    originalUrl: 'https://ratopati.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-4',
    title: 'नेपाली क्रिकेट टोलीको अन्तर्राष्ट्रिय शृङ्खलामा उत्कृष्ट प्रदर्शन, घरेलु मैदानमा रोमाञ्चक जित',
    source: 'अनलाइनखबर',
    category: 'खेलकुद',
    publishedAt: '४० मिनेट अघि',
    summary: 'नेपालले घरेलु मैदान कीर्तिपुरमा भएको रोमाञ्चक खेलमा उत्कृष्ट ब्याटिङ र बलिङको मद्दतले महत्त्वपूर्ण जित हासिल गरेको छ।',
    originalUrl: 'https://www.onlinekhabar.com',
    readTimeMinutes: 2,
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-5',
    title: 'आर्टिफिसियल इन्टेलिजेन्स र डिजिटल नेपाल फ्रेमवर्कमा नयाँ प्रविधि नीति कार्यान्वयनमा',
    source: 'कान्तिपुर',
    category: 'प्रविधि',
    publishedAt: '१ घण्टा अघि',
    summary: 'नेपाल सरकारद्वारा डिजिटल सुशासन, साइबर सुरक्षा तथा स्थानीय भाषामा एआई मोडल विकासका लागि राष्ट्रिय रणनीति कार्यान्वयनमा ल्याइएको छ।',
    originalUrl: 'https://ekantipur.com',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-6',
    title: 'विश्व जलवायु सम्मेलनमा हिमाली राष्ट्रहरूको साझा मुद्दा सशक्त रूपमा प्रस्तुत',
    source: 'बीबीसी नेपाली',
    category: 'विश्व',
    publishedAt: '२ घण्टा अघि',
    summary: 'हिमनदी पग्लिने क्रम र पर्वतीय जैविक विविधता संरक्षणका लागि अन्तर्राष्ट्रिय क्षतिपूर्ति कोष परिचालन गर्न नेपाल लगायत राष्ट्रहरूको संयुक्त पहल।',
    originalUrl: 'https://www.bbc.com/nepali',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-7',
    title: 'नेपाल स्टक एक्सचेञ्ज (नेप्से) परिसूचकमा उत्साहजनक कारोबार, लगानीकर्ताको आकर्षण वृद्धि',
    source: 'अनलाइनखबर',
    category: 'अर्थ',
    publishedAt: '२ घण्टा अघि',
    summary: 'बैंकिङ र जलविद्युत् समूहका कम्पनीहरूको सेयर मूल्यमा आएको सुधारले समग्र सेयर बजारमा हरियाली छाएको छ।',
    originalUrl: 'https://www.onlinekhabar.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-8',
    title: 'पोखरा र अन्नपूर्ण पदमार्ग क्षेत्रमा विदेशी पर्यटकको उल्लेखनीय आगमन',
    source: 'नागरिक',
    category: 'समाज',
    publishedAt: '३ घण्टा अघि',
    summary: 'वसन्त ऋतुको आगमनसँगै हिमाली क्षेत्रमा पदयात्राका लागि आउने पर्यटकहरूको संख्यामा गत वर्षको तुलनामा ४० प्रतिशतले वृद्धि भएको पर्यटन व्यवसायीहरूले बताएका छन्।',
    originalUrl: 'https://nagariknews.nagariknetwork.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
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
  if (text.includes('राजनीति') || text.includes('संसद') || text.includes('मन्त्री') || text.includes('प्रधानमन्त्री') || text.includes('पार्टी') || text.includes('निर्वाचन') || text.includes('सरकार') || text.includes('कांग्रेस') || text.includes('एमाले') || text.includes('माओवादी')) {
    return 'राजनीति';
  }
  if (text.includes('अर्थ') || text.includes('बजेट') || text.includes('बैंक') || text.includes('नेप्से') || text.includes('सेयर') || text.includes('व्यापार') || text.includes('मुद्रा') || text.includes('सुन') || text.includes('डलर') || text.includes('उद्योग')) {
    return 'अर्थ';
  }
  if (text.includes('खेल') || text.includes('क्रिकेट') || text.includes('फुटबल') || text.includes('खेलाडी') || text.includes('विश्वकप') || text.includes('ओलम्पिक') || text.includes('प्रतियोगिता')) {
    return 'खेलकुद';
  }
  if (text.includes('प्रविधि') || text.includes('एआई') || text.includes('मोवाइल') || text.includes('कम्प्युटर') || text.includes('इन्टरनेट') || text.includes('एप') || text.includes('साइबर') || text.includes('डिजिटल')) {
    return 'प्रविधि';
  }
  if (text.includes('विश्व') || text.includes('अन्तर्राष्ट्रिय') || text.includes('अमेरिका') || text.includes('भारत') || text.includes('चीन') || text.includes('युक्रेन') || text.includes('रुस') || text.includes('गाजा') || text.includes('संयुक्त राष्ट्र')) {
    return 'विश्व';
  }
  if (text.includes('सिनेमा') || text.includes('कला') || text.includes('फिल्म') || text.includes('गीत') || text.includes('संगीत') || text.includes('अभिनेता') || text.includes('अभिनेत्री') || text.includes('मनोरञ्जन')) {
    return 'मनोरञ्जन';
  }
  if (text.includes('चाड') || text.includes('पर्व') || text.includes('दशैं') || text.includes('तिहार') || text.includes('संस्कृति') || text.includes('सम्पदा') || text.includes('पात्रो') || text.includes('मन्दिर')) {
    return 'संस्कृति';
  }
  return 'समाज';
}
