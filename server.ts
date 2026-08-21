import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
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
import { INITIAL_NEWS_ARTICLES, RSS_SOURCES } from './src/engines/newsEngine.ts';
import { MUHURAT_CATEGORIES } from './src/engines/muhuratEngine.ts';
import {
  compareCalculationMethods,
  runAutomatedVerificationSuite,
} from './src/engines/testLabEngine.ts';
import { BSDate, CalculationMethodType } from './src/types.ts';

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
    const { date } = req.params; // e.g. 2083-05-15 or 2026-08-31
    const type = (req.query.type as string) || 'bs'; // 'bs' or 'ad'
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

  // 10. News & RSS Feeds
  app.get('/api/v1/news', (req, res) => {
    const category = req.query.category as string;
    let articles = INITIAL_NEWS_ARTICLES;
    if (category && category !== 'सबै') {
      articles = articles.filter((a) => a.category.includes(category) || category.includes(a.category));
    }
    res.json({
      success: true,
      sources: RSS_SOURCES,
      total: articles.length,
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
