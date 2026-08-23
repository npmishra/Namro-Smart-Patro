import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Parser from 'rss-parser';
import {
  adToBs,
  bsToAd,
  getCurrentNepaliDate,
  getDaysInBSMonth,
  getDaysInBSYear,
  NEPALI_MONTHS,
  NEPALI_WEEKDAYS,
} from './src/engines/calendarEngine.ts';
import {
  calculateDailyPanchang,
  getMonthlyCalendarDays,
} from './src/engines/panchangEngine.ts';
import {
  DEFAULT_LOCATION,
  getLocationById,
  NEPAL_LOCATIONS,
} from './src/engines/locationEngine.ts';
import { CALCULATION_METHODS } from './src/engines/calculationMethods.ts';
import { FESTIVAL_RULES } from './src/engines/festivalEngine.ts';
import { HOLIDAY_RULES } from './src/engines/holidayEngine.ts';
import {
  INITIAL_NEWS_ARTICLES,
  RSS_SOURCES,
  RSSFeedSource,
  detectCategoryFromText,
  formatNepaliRelativeTime,
} from './src/engines/newsEngine.ts';
import { MUHURAT_CATEGORIES } from './src/engines/muhuratEngine.ts';
import {
  compareCalculationMethods,
  runAutomatedVerificationSuite,
} from './src/engines/testLabEngine.ts';
import { BSDate, CalculationMethodType, NewsArticle } from './src/types.ts';

// RSS Parser instance with custom fields for image extraction
const rssParser = new Parser({
  timeout: 6000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NamroSmartPatro/1.0',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['enclosure', 'enclosure', { keepArray: false }],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

// In-Memory Live News Cache
interface NewsCacheState {
  articles: NewsArticle[];
  lastUpdated: Date | null;
  isUpdating: boolean;
  sourceStatus: Record<string, { status: 'healthy' | 'warning' | 'error'; count: number; error?: string }>;
}

const newsCache: NewsCacheState = {
  articles: [...INITIAL_NEWS_ARTICLES],
  lastUpdated: new Date(),
  isUpdating: false,
  sourceStatus: {},
};

// Function to extract image URL from RSS item
function extractImageUrl(item: any): string | undefined {
  if (item.enclosure && item.enclosure.url && (item.enclosure.type?.startsWith('image/') || item.enclosure.url.match(/\.(jpg|jpeg|png|webp|gif)/i))) {
    return item.enclosure.url;
  }
  if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }
  if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }
  if (typeof item.mediaContent === 'string' && item.mediaContent.startsWith('http')) {
    return item.mediaContent;
  }

  // Regex extract from content/encoded or summary
  const contentToSearch = (item.contentEncoded || item.content || item.summary || '') + '';
  const imgMatch = contentToSearch.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1] && imgMatch[1].startsWith('http')) {
    return imgMatch[1];
  }

  return undefined;
}

// Clean HTML tags and entities
function cleanHtmlText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Live RSS Fetcher
async function updateLiveNewsFeed(): Promise<NewsArticle[]> {
  if (newsCache.isUpdating) {
    return newsCache.articles;
  }

  newsCache.isUpdating = true;
  const fetchedArticles: NewsArticle[] = [];

  const promises = RSS_SOURCES.filter((s) => s.isEnabled).map(async (source) => {
    try {
      const feed = await rssParser.parseURL(source.rssUrl);
      const items = feed.items || [];
      newsCache.sourceStatus[source.id] = {
        status: 'healthy',
        count: items.length,
      };

      const sourceArticles: NewsArticle[] = items.slice(0, 15).map((item, idx) => {
        const title = cleanHtmlText(item.title || 'शीर्षक उपलब्ध छैन');
        const rawContent = item.contentSnippet || item.summary || item.content || item.contentEncoded || '';
        const summary = cleanHtmlText(rawContent).slice(0, 220) || 'विस्तृत विवरणका लागि मूल समाचार स्रोत हेर्नुहोस्।';
        const img = extractImageUrl(item);
        const pubDateStr = item.pubDate || item.isoDate;
        const relativeTime = formatNepaliRelativeTime(pubDateStr);
        const category = detectCategoryFromText(title, summary);

        return {
          id: `live-${source.id}-${Date.now()}-${idx}`,
          title,
          source: source.nameNepali || source.name.split(' ')[0],
          category,
          publishedAt: relativeTime,
          summary,
          originalUrl: item.link || source.websiteUrl,
          imageUrl: img,
          readTimeMinutes: Math.max(2, Math.min(8, Math.round((summary.length + title.length) / 50))),
        };
      });

      return sourceArticles;
    } catch (err: any) {
      newsCache.sourceStatus[source.id] = {
        status: 'warning',
        count: 0,
        error: err?.message || 'Feed unreachable',
      };
      return [];
    }
  });

  try {
    const results = await Promise.allSettled(promises);
    for (const res of results) {
      if (res.status === 'fulfilled' && res.value.length > 0) {
        fetchedArticles.push(...res.value);
      }
    }

    if (fetchedArticles.length > 0) {
      // Deduplicate by title
      const seenTitles = new Set<string>();
      const deduped: NewsArticle[] = [];
      for (const art of fetchedArticles) {
        const normTitle = art.title.replace(/\s+/g, '').slice(0, 30);
        if (!seenTitles.has(normTitle)) {
          seenTitles.add(normTitle);
          deduped.push(art);
        }
      }

      // Add fallback curated items if needed
      for (const initArt of INITIAL_NEWS_ARTICLES) {
        const norm = initArt.title.replace(/\s+/g, '').slice(0, 30);
        if (!seenTitles.has(norm)) {
          deduped.push(initArt);
        }
      }

      newsCache.articles = deduped;
      newsCache.lastUpdated = new Date();
    }
  } catch (globalErr) {
    console.error('RSS Fetch error:', globalErr);
  } finally {
    newsCache.isUpdating = false;
  }

  return newsCache.articles;
}

// Initial background fetch & auto-cron every 5 minutes
updateLiveNewsFeed().catch(() => {});
setInterval(() => {
  updateLiveNewsFeed().catch(() => {});
}, 5 * 60 * 1000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS & Security headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // ==========================================
  // REST API v1 ROUTES
  // ==========================================

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      engine: 'Namro Smart Patro Proprietary Engine',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Today's Calendar & Panchang
  app.get('/api/v1/calendar/today', (req, res) => {
    const locationId = (req.query.location as string) || 'kathmandu';
    const method = (req.query.method as CalculationMethodType) || 'drik';
    const location = getLocationById(locationId);

    const { bs, ad, weekday } = getCurrentNepaliDate();
    const panchang = calculateDailyPanchang({ bs }, location, method);

    res.json({
      success: true,
      bsDate: bs,
      adDate: ad,
      weekday,
      panchang,
    });
  });

  // 3. Calendar by Date (BS or AD)
  app.get('/api/v1/calendar/date/:date', (req, res) => {
    const { date } = req.params;
    const type = (req.query.type as string) || 'bs';
    const locationId = (req.query.location as string) || 'kathmandu';
    const method = (req.query.method as CalculationMethodType) || 'drik';
    const location = getLocationById(locationId);

    const parts = date.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD' });
      return;
    }

    let bsDate: BSDate;
    if (type === 'ad') {
      bsDate = adToBs({ year: parts[0], month: parts[1], day: parts[2] });
    } else {
      bsDate = { year: parts[0], month: parts[1], day: parts[2] };
    }

    const panchang = calculateDailyPanchang({ bs: bsDate }, location, method);

    res.json({
      success: true,
      panchang,
    });
  });

  // 4. Monthly Calendar Grid
  app.get('/api/v1/calendar/month/:year/:month', (req, res) => {
    const year = parseInt(req.params.year, 10);
    const month = parseInt(req.params.month, 10);
    const locationId = (req.query.location as string) || 'kathmandu';
    const method = (req.query.method as CalculationMethodType) || 'drik';
    const location = getLocationById(locationId);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      res.status(400).json({ success: false, error: 'Invalid year or month' });
      return;
    }

    const days = getMonthlyCalendarDays(year, month, location, method);
    const monthInfo = NEPALI_MONTHS.find((m) => m.id === month);

    res.json({
      success: true,
      year,
      month,
      monthInfo,
      totalDays: getDaysInBSMonth(year, month),
      days,
    });
  });

  // 5. Yearly Overview
  app.get('/api/v1/calendar/year/:year', (req, res) => {
    const year = parseInt(req.params.year, 10);
    if (isNaN(year) || year < 1970 || year > 2110) {
      res.status(400).json({ success: false, error: 'Year out of supported range (1970 - 2110 BS)' });
      return;
    }

    const monthsSummary = NEPALI_MONTHS.map((m) => {
      const days = getDaysInBSMonth(year, m.id);
      const startAD = bsToAd({ year, month: m.id, day: 1 });
      const endAD = bsToAd({ year, month: m.id, day: days });
      return {
        month: m.id,
        nameNepali: m.nameNepali,
        nameEnglish: m.nameEnglish,
        totalDays: days,
        adRange: `${startAD.year}-${startAD.month}-${startAD.day} to ${endAD.year}-${endAD.month}-${endAD.day}`,
      };
    });

    res.json({
      success: true,
      year,
      totalDays: getDaysInBSYear(year),
      months: monthsSummary,
    });
  });

  // 6. Festivals Master List
  app.get('/api/v1/festivals', (req, res) => {
    res.json({
      success: true,
      total: FESTIVAL_RULES.length,
      festivals: FESTIVAL_RULES,
    });
  });

  // 7. Holidays Master List
  app.get('/api/v1/holidays', (req, res) => {
    res.json({
      success: true,
      total: HOLIDAY_RULES.length,
      holidays: HOLIDAY_RULES,
    });
  });

  // 8. Locations List
  app.get('/api/v1/locations', (req, res) => {
    res.json({
      success: true,
      locations: NEPAL_LOCATIONS,
    });
  });

  // 9. Calculation Methods List
  app.get('/api/v1/calculation-methods', (req, res) => {
    res.json({
      success: true,
      methods: Object.values(CALCULATION_METHODS),
    });
  });

  // 10. News & RSS Feeds (Automatic Live Aggregator)
  app.get('/api/v1/news', async (req, res) => {
    const category = req.query.category as string;
    const source = req.query.source as string;
    const search = (req.query.search as string || '').toLowerCase().trim();

    // Trigger update in background if cache is older than 5 minutes
    const now = Date.now();
    const cacheAge = newsCache.lastUpdated ? now - newsCache.lastUpdated.getTime() : Infinity;
    if (cacheAge > 5 * 60 * 1000 && !newsCache.isUpdating) {
      updateLiveNewsFeed().catch(() => {});
    }

    let articles = [...newsCache.articles];

    // Filter by Category
    if (category && category !== 'सबै') {
      articles = articles.filter(
        (a) => a.category.includes(category) || category.includes(a.category)
      );
    }

    // Filter by Source
    if (source && source !== 'all' && source !== 'सबै') {
      articles = articles.filter((a) =>
        a.source.toLowerCase().includes(source.toLowerCase()) ||
        source.toLowerCase().includes(a.source.toLowerCase())
      );
    }

    // Filter by Search Query
    if (search) {
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.summary.toLowerCase().includes(search) ||
          a.source.toLowerCase().includes(search)
      );
    }

    res.json({
      success: true,
      isLive: true,
      lastUpdated: newsCache.lastUpdated?.toISOString() || new Date().toISOString(),
      isUpdating: newsCache.isUpdating,
      total: articles.length,
      sources: RSS_SOURCES.map((s) => ({
        ...s,
        status: newsCache.sourceStatus[s.id]?.status || 'healthy',
        itemCount: newsCache.sourceStatus[s.id]?.count || 0,
      })),
      articles,
    });
  });

  // 10.1 Breaking News Live Ticker Feed
  app.get('/api/v1/news/breaking', (req, res) => {
    const breaking = newsCache.articles.slice(0, 10).map((a) => ({
      id: a.id,
      title: a.title,
      source: a.source,
      publishedAt: a.publishedAt,
      originalUrl: a.originalUrl,
      category: a.category,
    }));

    res.json({
      success: true,
      breaking,
    });
  });

  // 10.2 Force News Refresh
  app.post('/api/v1/news/refresh', async (req, res) => {
    const articles = await updateLiveNewsFeed();
    res.json({
      success: true,
      message: 'ताजा समाचार सफलतापूर्वक अपडेट भयो',
      total: articles.length,
      lastUpdated: newsCache.lastUpdated?.toISOString(),
      articles,
    });
  });

  // 11. Muhurat Categories
  app.get('/api/v1/muhurat', (req, res) => {
    res.json({
      success: true,
      muhurats: MUHURAT_CATEGORIES,
    });
  });

  // 12. Admin Laboratory Multi-Method Comparison
  app.get('/api/v1/admin/compare', (req, res) => {
    const dateParam = (req.query.date as string) || '2083-05-15';
    const locationId = (req.query.location as string) || 'kathmandu';
    const location = getLocationById(locationId);

    const parts = dateParam.split('-').map(Number);
    const bsDate: BSDate = {
      year: parts[0] || 2083,
      month: parts[1] || 5,
      day: parts[2] || 15,
    };

    const comparison = compareCalculationMethods(bsDate, location);
    res.json({
      success: true,
      bsDate,
      location,
      comparison,
    });
  });

  // 13. Admin Automated Verification Test Suite
  app.get('/api/v1/admin/test-suite', (req, res) => {
    const report = runAutomatedVerificationSuite();
    res.json({
      success: true,
      report,
    });
  });

  // ==========================================
  // Vite Dev / Production Static Handler
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Namro Smart Patro Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
