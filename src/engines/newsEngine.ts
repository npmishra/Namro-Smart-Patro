import { NewsArticle } from '../types';

export interface RSSFeedSource {
  id: string;
  name: string;
  category: string;
  rssUrl: string;
  websiteUrl: string;
  isEnabled: boolean;
  lastFetched?: string;
  status: 'healthy' | 'warning' | 'error';
}

export const RSS_SOURCES: RSSFeedSource[] = [
  {
    id: 'setopati',
    name: 'Setopati (सेतोपाटी)',
    category: 'समसामयिक',
    rssUrl: 'https://setopati.com/feed',
    websiteUrl: 'https://setopati.com',
    isEnabled: true,
    status: 'healthy',
    lastFetched: 'Just now',
  },
  {
    id: 'ratopati',
    name: 'Ratopati (रातोपाटी)',
    category: 'राजनीति',
    rssUrl: 'https://ratopati.com/feed',
    websiteUrl: 'https://ratopati.com',
    isEnabled: true,
    status: 'healthy',
    lastFetched: 'Just now',
  },
  {
    id: 'kantipur',
    name: 'Kantipur (कान्तिपुर)',
    category: 'समसामयिक',
    rssUrl: 'https://ekantipur.com/feed',
    websiteUrl: 'https://ekantipur.com',
    isEnabled: true,
    status: 'healthy',
    lastFetched: 'Just now',
  },
  {
    id: 'bbc_nepali',
    name: 'BBC Nepali (बीबीसी नेपाली)',
    category: 'विश्व',
    rssUrl: 'https://feeds.bbci.co.uk/nepali/rss.xml',
    websiteUrl: 'https://bbc.com/nepali',
    isEnabled: true,
    status: 'healthy',
    lastFetched: 'Just now',
  },
  {
    id: 'onlinekhabar',
    name: 'OnlineKhabar (अनलाइनखबर)',
    category: 'समाज',
    rssUrl: 'https://onlinekhabar.com/feed',
    websiteUrl: 'https://onlinekhabar.com',
    isEnabled: true,
    status: 'healthy',
    lastFetched: 'Just now',
  },
  {
    id: 'gorkhapatra',
    name: 'Gorkhapatra (गोरखापत्र)',
    category: 'अर्थ / समाज',
    rssUrl: 'https://gorkhapatraonline.com/rss',
    websiteUrl: 'https://gorkhapatraonline.com',
    isEnabled: true,
    status: 'healthy',
    lastFetched: 'Just now',
  },
];

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'नेपालमा विक्रम संवत् २०८३ को पात्रो तथा शुभ साइतहरूको सार्वजनिक विमोचन',
    source: 'Gorkhapatra',
    category: 'समसामयिक',
    publishedAt: '१० मिनेट अघि',
    summary: 'नेपाल पञ्चाङ्ग निर्णायक विकास समिति तथा ज्योतिर्विद्हरूद्वारा नयाँ वर्ष २०८३ का चाडपर्व, तिथि, सूर्यग्रहण, चन्द्रग्रहण तथा शुभ मुहूर्तको विस्तृत विवरण प्रस्तुत गरिएको छ।',
    originalUrl: 'https://gorkhapatraonline.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-2',
    title: 'काठमाडौँ उपत्यकाको सम्पदा संरक्षण तथा सांस्कृतिक पर्व व्यवस्थापनमा नयाँ योजना',
    source: 'Setopati',
    category: 'समाज',
    publishedAt: '२५ मिनेट अघि',
    summary: 'पशुपतिनाथ, स्वयम्भू तथा पाटन दरबार क्षेत्रमा आउँदा चाडपर्वहरूमा भक्तजनको सहजताका लागि डिजिटल व्यवस्थापन र ट्राफिक व्यवस्थापन सुरु गरिएको छ।',
    originalUrl: 'https://setopati.com',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-3',
    title: 'नेपालको जलविद्युत् उत्पादनमा ऐतिहासिक वृद्धि, छिमेकी देशतर्फ निर्यात विस्तार',
    source: 'Ratopati',
    category: 'अर्थ',
    publishedAt: '१ घण्टा अघि',
    summary: 'वर्षायामको सुरुसँगै नेपालका प्रमुख जलविद्युत् आयोजनाहरू पूर्ण क्षमतामा सञ्चालन भई दैनिक सयौँ मेगावाट विद्युत् प्रसारण लाइनमार्फत निर्यात भइरहेको छ।',
    originalUrl: 'https://ratopati.com',
    readTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-4',
    title: 'नेपाली क्रिकेट टोलीको अन्तर्राष्ट्रिय शृङ्खलामा उत्कृष्ट प्रदर्शन',
    source: 'OnlineKhabar',
    category: 'खेलकुद',
    publishedAt: '२ घण्टा अघि',
    summary: 'नेपालले घरेलु मैदान कीर्तिपुरमा भएको रोमाञ्चक खेलमा उत्कृष्ट ब्याटिङ र बलिङको मद्दतले महत्त्वपूर्ण जित हासिल गरेको छ।',
    originalUrl: 'https://onlinekhabar.com',
    readTimeMinutes: 2,
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-5',
    title: 'आर्टिफिसियल इन्टेलिजेन्स र डिजिटल नेपाल फ्रेमवर्कमा नयाँ प्रविधि नीति',
    source: 'Kantipur',
    category: 'प्रविधि',
    publishedAt: '३ घण्टा अघि',
    summary: 'नेपाल सरकारद्वारा डिजिटल सुशासन, साइबर सुरक्षा तथा स्थानीय भाषामा एआई मोडल विकासका लागि राष्ट्रिय रणनीति कार्यान्वयनमा ल्याइएको छ।',
    originalUrl: 'https://ekantipur.com',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-6',
    title: 'विश्व जलवायु सम्मेलनमा हिमाली राष्ट्रहरूको साझा मुद्दा सशक्त रूपमा प्रस्तुत',
    source: 'BBC Nepali',
    category: 'विश्व',
    publishedAt: '४ घण्टा अघि',
    summary: 'हिमनदी पग्लिने क्रम र पर्वतीय जैविक विविधता संरक्षणका लागि अन्तर्राष्ट्रिय क्षतिपूर्ति कोष परिचालन गर्न नेपाल लगायत राष्ट्रहरूको संयुक्त पहल।',
    originalUrl: 'https://bbc.com/nepali',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  },
];
