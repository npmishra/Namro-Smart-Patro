import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  ExternalLink,
  Clock,
  Rss,
  RefreshCw,
  Search,
  Bookmark,
  BookmarkCheck,
  Grid,
  List,
  Flame,
  CheckCircle2,
  AlertCircle,
  Share2,
  Filter,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { NewsArticle } from '../types';
import { INITIAL_NEWS_ARTICLES, RSS_SOURCES, RSSFeedSource } from '../engines/newsEngine';
import { NewsReaderModal } from './NewsReaderModal';

const SAVED_NEWS_STORAGE_KEY = 'namro_smart_patro_saved_news';

export const NewsFeedView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('सबै');
  const [selectedSource, setSelectedSource] = useState<string>('सबै');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_NEWS_ARTICLES);
  const [sources, setSources] = useState<RSSFeedSource[]>(RSS_SOURCES);
  const [lastUpdated, setLastUpdated] = useState<string>('भर्खरै');
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(60);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

  // Bookmarks State
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>(() => {
    try {
      const data = localStorage.getItem(SAVED_NEWS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  });

  // Modal State
  const [activeReadingArticle, setActiveReadingArticle] = useState<NewsArticle | null>(null);

  const categories = [
    'सबै',
    'समसामयिक',
    'राजनीति',
    'समाज',
    'अर्थ',
    'खेलकुद',
    'प्रविधि',
    'मनोरञ्जन',
    'विश्व',
  ];

  // Fetch Live News from API
  const fetchNews = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'सबै') params.append('category', selectedCategory);
      if (selectedSource !== 'सबै') params.append('source', selectedSource);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/v1/news?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
        if (data.sources) {
          setSources(data.sources);
        }
        setLastUpdated(
          new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' })
        );
      }
    } catch (e) {
      console.warn('Live news fetch failed, using stored feeds', e);
    } finally {
      if (!silent) setIsRefreshing(false);
      setCountdown(60);
    }
  };

  // Trigger on filter change
  useEffect(() => {
    fetchNews(false);
  }, [selectedCategory, selectedSource]);

  // Auto-refresh countdown timer
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchNews(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled, selectedCategory, selectedSource]);

  // Handle Manual Force Refresh
  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/v1/news/refresh', { method: 'POST' });
      await fetchNews(false);
    } catch (e) {
      fetchNews(false);
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = (article: NewsArticle) => {
    let updated: NewsArticle[];
    const isAlreadySaved = savedArticles.some((a) => a.title === article.title);
    if (isAlreadySaved) {
      updated = savedArticles.filter((a) => a.title !== article.title);
    } else {
      updated = [article, ...savedArticles];
    }
    setSavedArticles(updated);
    try {
      localStorage.setItem(SAVED_NEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  // Filtered Display List
  const displayArticles = (activeTab === 'saved' ? savedArticles : articles).filter((art) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.source.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-['Mukta',sans-serif]">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-rose-300 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              स्वचालित लाइभ न्युज पोर्टल (Live Automated News)
            </span>

            <span className="text-[11px] text-slate-400 font-medium">
              अपडेट: {lastUpdated}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            नेपाल तथा विश्वका ताजा मुख्य समाचारहरू
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            गोरखापत्र, अनलाइनखबर, सेतोपाटी, रातोपाटी, कान्तिपुर, नागरिक र बीबीसी नेपालीबाट सिधै स्वचालित संकलन
          </p>
        </div>

        {/* Auto Refresh Toggle & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              स्वचालित:
            </span>
            <button
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
                autoRefreshEnabled
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              {autoRefreshEnabled ? `${countdown}s` : 'रोकिएको'}
            </button>
          </div>

          <button
            onClick={handleForceRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'ताजा गर्दै...' : 'अहिले ताजा गर्नुहोस्'}</span>
          </button>
        </div>
      </div>

      {/* 2. RSS Sources Live Status Pill Strip */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Rss className="w-3.5 h-3.5 text-orange-500" />
          प्रत्यक्ष स्रोतहरू ({sources.length}):
        </span>

        <button
          onClick={() => setSelectedSource('सबै')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            selectedSource === 'सबै'
              ? 'bg-red-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          सबै स्रोत
        </button>

        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => setSelectedSource(source.name.split(' ')[0])}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
              selectedSource === source.name.split(' ')[0]
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                source.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>{source.name.split(' ')[0]}</span>
            {source.itemCount ? (
              <span className="text-[9px] opacity-70">({source.itemCount})</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* 3. Search & View Mode & Main Tab Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="समाचार खोज्नुहोस् (शीर्षक, विषय, स्रोत)..."
            className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Saved Articles Tab & Layout Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              ताजा फिड ({articles.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'saved'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>सुरक्षित ({savedArticles.length})</span>
            </button>
          </div>

          <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="ग्रिड दृश्य (Grid View)"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="सूची दृश्य (List View)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Category Tabs */}
      {activeTab === 'all' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 5. Articles List or Grid */}
      {displayArticles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            कुनै समाचार फेला परेन
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            कृपया फरक श्रेणी वा खोज शब्द प्रयोग गर्नुहोस्।
          </p>
          <button
            onClick={() => {
              setSelectedCategory('सबै');
              setSelectedSource('सबै');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100"
          >
            सबै फिल्टर रिसेट गर्नुहोस्
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayArticles.map((article) => {
            const isBookmarked = savedArticles.some((a) => a.title === article.title);

            return (
              <div
                key={article.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-red-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                {/* Thumbnail */}
                {article.imageUrl ? (
                  <div
                    onClick={() => setActiveReadingArticle(article)}
                    className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                  >
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/75 backdrop-blur-xs text-white text-[10px] font-bold">
                      {article.category || 'समाचार'}
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => setActiveReadingArticle(article)}
                    className="h-2.5 bg-gradient-to-r from-red-500 to-rose-600"
                  />
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-bold text-red-600 dark:text-rose-400">{article.source}</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" /> {article.publishedAt}
                      </span>
                    </div>

                    <h3
                      onClick={() => setActiveReadingArticle(article)}
                      className="font-bold text-base text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug cursor-pointer"
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleBookmark(article)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBookmarked
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                        title={isBookmarked ? 'सुरक्षितबाट हटाउनुहोस्' : 'पछिका लागि सुरक्षित गर्नुहोस्'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => setActiveReadingArticle(article)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>झलक</span>
                      </button>
                    </div>

                    <a
                      href={article.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-rose-400 hover:underline"
                    >
                      <span>मूल स्रोत</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Compact View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
          {displayArticles.map((article) => {
            const isBookmarked = savedArticles.some((a) => a.title === article.title);

            return (
              <div
                key={article.id}
                className="p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-bold text-red-600 dark:text-rose-400">{article.source}</span>
                    <span>•</span>
                    <span className="px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      {article.category || 'समाचार'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" /> {article.publishedAt}
                    </span>
                  </div>

                  <h3
                    onClick={() => setActiveReadingArticle(article)}
                    className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggleBookmark(article)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isBookmarked
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveReadingArticle(article)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    पढ्नुहोस्
                  </button>

                  <a
                    href={article.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 text-slate-400 transition-colors"
                    title="मूल स्रोतमा जानुहोस्"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Quick Reading Modal */}
      {activeReadingArticle && (
        <NewsReaderModal
          article={activeReadingArticle}
          onClose={() => setActiveReadingArticle(null)}
          isBookmarked={savedArticles.some((a) => a.title === activeReadingArticle.title)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}
    </div>
  );
};
