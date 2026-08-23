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
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  TrendingUp,
  LayoutTemplate,
  Check,
} from 'lucide-react';
import { NewsArticle } from '../types';
import {
  INITIAL_NEWS_ARTICLES,
  RSS_SOURCES,
  RSSFeedSource,
  getCachedNews,
  saveNewsToCache,
  speakNepaliText,
} from '../engines/newsEngine';
import { NewsReaderModal } from './NewsReaderModal';

const SAVED_NEWS_STORAGE_KEY = 'namro_smart_patro_saved_news';
const SOURCES_CONFIG_STORAGE_KEY = 'namro_smart_patro_sources_config';

const TRENDING_TOPICS = [
  '#बजेट२०८३',
  '#नेपालक्रिकेट',
  '#नेप्सेअपडेट',
  '#पञ्चाङ्गविमोचन',
  '#विद्युत्निर्यात',
  '#एआईनीति',
  '#पदयात्रापर्यटन',
  '#सम्पदाजात्रा',
];

export const NewsFeedView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('सबै');
  const [selectedSource, setSelectedSource] = useState<string>('सबै');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'headline'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>(() => getCachedNews());
  const [sources, setSources] = useState<RSSFeedSource[]>(RSS_SOURCES);
  const [lastUpdated, setLastUpdated] = useState<string>('भर्खरै');
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [refreshIntervalSec, setRefreshIntervalSec] = useState<number>(60);
  const [countdown, setCountdown] = useState<number>(60);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [playingArticleId, setPlayingArticleId] = useState<string | null>(null);
  const [showSourceManager, setShowSourceManager] = useState<boolean>(false);

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
    'अर्थ',
    'समाज',
    'खेलकुद',
    'प्रविधि',
    'मनोरञ्जन',
    'विश्व',
    'संस्कृति',
    'विचार',
  ];

  // Fetch Live News from Engine API
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
          saveNewsToCache(data.articles);
        }
        if (data.sources) {
          setSources(data.sources);
        }
        setLastUpdated(
          new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' })
        );
      }
    } catch (e) {
      console.warn('Live news fetch fallback to local cache', e);
    } finally {
      if (!silent) setIsRefreshing(false);
      setCountdown(refreshIntervalSec);
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
          return refreshIntervalSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled, refreshIntervalSec, selectedCategory, selectedSource]);

  // Force news refresh
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

  // Speech Audio playback handler
  const handleToggleSpeech = (article: NewsArticle) => {
    if (playingArticleId === article.id) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingArticleId(null);
    } else {
      setPlayingArticleId(article.id);
      const textToRead = `${article.title}। ${article.source}। ${article.summary}`;
      speakNepaliText(textToRead, () => {
        setPlayingArticleId(null);
      });
    }
  };

  // Filtered Display List
  const displayArticles = (activeTab === 'saved' ? savedArticles : articles).filter((art) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.source.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q)
    );
  });

  const leadHeroArticle = displayArticles.length > 0 ? displayArticles[0] : null;
  const secondaryArticles = displayArticles.length > 1 ? displayArticles.slice(1) : [];

  return (
    <div className="space-y-6 font-['Mukta',sans-serif]">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-rose-300 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              लाइभ स्वचालित समाचार नेटवर्क (Live Aggregator)
            </span>

            <span className="text-[11px] text-slate-400 font-medium">
              पछिल्लो सिङ्क: {lastUpdated}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            नेपाल तथा विश्वका ताजा मुख्य समाचारहरू
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            गोरखापत्र, अनलाइनखबर, सेतोपाटी, रातोपाटी, कान्तिपुर, नागरिक, बीबीसी नेपाली, बाह्रखरी तथा उज्यालोबाट प्रत्यक्ष
          </p>
        </div>

        {/* Auto Refresh Toggle & Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          {/* Sync speed dropdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              सिङ्क:
            </span>
            <select
              value={autoRefreshEnabled ? refreshIntervalSec : 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val === 0) {
                  setAutoRefreshEnabled(false);
                } else {
                  setAutoRefreshEnabled(true);
                  setRefreshIntervalSec(val);
                  setCountdown(val);
                }
              }}
              className="bg-transparent font-bold text-xs text-red-600 dark:text-rose-400 focus:outline-none cursor-pointer"
            >
              <option value={30} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">३० सेकेन्ड ({countdown}s)</option>
              <option value={60} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">१ मिनेट ({countdown}s)</option>
              <option value={180} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">३ मिनेट ({countdown}s)</option>
              <option value={300} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">५ मिनेट ({countdown}s)</option>
              <option value={0} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">अटो-सिङ्क बन्द</option>
            </select>
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

      {/* 2. Trending Topics Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="flex items-center gap-1 text-xs font-black text-red-600 dark:text-rose-400 shrink-0 px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/40">
          <Flame className="w-3.5 h-3.5" />
          ट्रेन्डिङ:
        </span>
        {TRENDING_TOPICS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSearchQuery(tag.replace('#', ''))}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-red-400 dark:hover:border-red-500 hover:text-red-600 transition-colors whitespace-nowrap"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 3. RSS Sources Live Status Pill Strip */}
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
          सबै स्रोतहरू
        </button>

        {sources.map((source) => {
          const isSelected =
            selectedSource === source.name.split(' ')[0] ||
            selectedSource === source.nameNepali;

          return (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.nameNepali || source.name.split(' ')[0])}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                isSelected
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  source.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{source.nameNepali || source.name.split(' ')[0]}</span>
              {source.itemCount ? (
                <span className="text-[9px] opacity-70">({source.itemCount})</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* 4. Search & View Mode & Main Tab Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="समाचार खोज्नुहोस् (शीर्षक, विषय, नेता, खेलकुद)..."
            className="w-full pl-9.5 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
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
            <button
              onClick={() => setViewMode('headline')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'headline'
                  ? 'bg-white dark:bg-slate-900 text-red-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="हेडलाइन मात्र (Headlines View)"
            >
              <LayoutTemplate className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Category Tabs */}
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

      {/* 6. Lead Hero Story Banner (When in Grid Mode & not filtered by search) */}
      {viewMode === 'grid' && activeTab === 'all' && !searchQuery.trim() && leadHeroArticle && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {leadHeroArticle.imageUrl && (
              <div
                onClick={() => setActiveReadingArticle(leadHeroArticle)}
                className="lg:col-span-7 relative h-64 sm:h-80 overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer group"
              >
                <img
                  src={leadHeroArticle.imageUrl}
                  alt={leadHeroArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  मुख्य समाचार (Lead Story)
                </span>
              </div>
            )}

            <div className={`${leadHeroArticle.imageUrl ? 'lg:col-span-5' : 'lg:col-span-12'} p-6 space-y-3.5 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="font-black text-red-600 dark:text-rose-400 px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/50">
                    {leadHeroArticle.source}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    {leadHeroArticle.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-red-500" /> {leadHeroArticle.publishedAt}
                  </span>
                </div>

                <h3
                  onClick={() => setActiveReadingArticle(leadHeroArticle)}
                  className="text-lg sm:text-xl font-black text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-rose-400 transition-colors leading-snug cursor-pointer"
                >
                  {leadHeroArticle.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {leadHeroArticle.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSpeech(leadHeroArticle)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-colors ${
                      playingArticleId === leadHeroArticle.id
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {playingArticleId === leadHeroArticle.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-red-500" />}
                    <span>{playingArticleId === leadHeroArticle.id ? 'वाचन रोक्नुहोस्' : 'सुन्नुहोस्'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleBookmark(leadHeroArticle)}
                    className={`p-2 rounded-xl border transition-colors ${
                      savedArticles.some((a) => a.title === leadHeroArticle.title)
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {savedArticles.some((a) => a.title === leadHeroArticle.title) ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setActiveReadingArticle(leadHeroArticle)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>विस्तृत पढ्नुहोस्</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Articles Feed Display */}
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
            const isPlaying = playingArticleId === article.id;

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
                      <span className="font-black text-red-600 dark:text-rose-400 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/50">
                        {article.source}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-red-500" /> {article.publishedAt}
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
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleSpeech(article)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isPlaying
                            ? 'bg-red-500 text-white border-red-600 animate-pulse'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                        }`}
                        title={isPlaying ? 'वाचन रोक्नुहोस्' : 'समाचार सुन्नुहोस् (Audio Speech)'}
                      >
                        {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

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
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveReadingArticle(article)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>झलक</span>
                      </button>

                      <a
                        href={article.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-rose-400 hover:underline"
                      >
                        <span>स्रोत</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
          {displayArticles.map((article) => {
            const isBookmarked = savedArticles.some((a) => a.title === article.title);
            const isPlaying = playingArticleId === article.id;

            return (
              <div
                key={article.id}
                className="p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-black text-red-600 dark:text-rose-400 px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/50">
                      {article.source}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      {article.category || 'समाचार'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-red-500" /> {article.publishedAt}
                    </span>
                  </div>

                  <h3
                    onClick={() => setActiveReadingArticle(article)}
                    className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors cursor-pointer leading-snug"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggleSpeech(article)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isPlaying
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                    title={isPlaying ? 'वाचन रोक्नुहोस्' : 'समाचार सुन्नुहोस्'}
                  >
                    {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

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
      ) : (
        /* Headlines Only Mode */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-3 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayArticles.map((article, idx) => (
              <div
                key={article.id}
                onClick={() => setActiveReadingArticle(article)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-red-50/60 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/80 transition-all cursor-pointer flex items-start gap-3 group"
              >
                <span className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-rose-400 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                    <span className="font-bold text-red-600 dark:text-rose-400">{article.source}</span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Independent Ownership & Aggregation Transparency Note */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 border border-red-100 dark:border-slate-800 flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <div className="font-bold text-slate-900 dark:text-white text-sm">
            नाम्रो स्मार्ट पात्रो समाचार नेटवर्क: पूर्ण स्वतन्त्र, प्रत्यक्ष र निष्पक्ष एग्रिगेशन इन्जिन
          </div>
          <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
            यो समाचार प्रणाली नेपालका प्रमुख राष्ट्रिय तथा स्थानीय मिडिया संस्थाहरूको खुला आरएसएस (RSS) फिडबाट स्वतः संकलित हुन्छ। हामी पत्रकारिताको आचारसंहिता, स्रोतको मूल स्वत्वाधिकार तथा प्रत्यक्ष क्रेडिटलाई उच्च सम्मान गर्दछौँ।
          </p>
        </div>
      </div>

      {/* 9. Quick Reading Modal */}
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

