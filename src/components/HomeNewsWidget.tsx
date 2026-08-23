import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Flame,
  Clock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Volume2,
  VolumeX,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Building2,
  Quote,
} from 'lucide-react';
import { NewsArticle, AdminVisibilityConfig } from '../types';
import { INITIAL_NEWS_ARTICLES, getCachedNews, saveNewsToCache, speakNepaliText } from '../engines/newsEngine';

interface HomeNewsWidgetProps {
  onOpenAllNews: () => void;
  onSelectArticle?: (article: NewsArticle) => void;
  adminConfig?: AdminVisibilityConfig;
}

export const HomeNewsWidget: React.FC<HomeNewsWidgetProps> = ({
  onOpenAllNews,
  onSelectArticle,
  adminConfig,
}) => {
  if (adminConfig && !adminConfig.showNewsSectionOnHome) {
    return null;
  }
  const [articles, setArticles] = useState<NewsArticle[]>(() => getCachedNews());
  const [activeTab, setActiveTab] = useState<string>('ताजा');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('भर्खरै');
  const [playingArticleId, setPlayingArticleId] = useState<string | null>(null);

  const tabs = ['ताजा', 'राजनीति', 'अर्थ', 'खेलकुद', 'समाज', 'विचार'];

  const fetchLiveNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/news');
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
          saveNewsToCache(data.articles);
          setLastUpdated(
            new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' })
          );
        }
      }
    } catch (e) {
      // Keep existing
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
    const interval = setInterval(fetchLiveNews, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSpeech = (e: React.MouseEvent, article: NewsArticle) => {
    e.stopPropagation();
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

  const filteredArticles =
    activeTab === 'ताजा'
      ? articles
      : articles.filter(
          (a) => a.category.includes(activeTab) || activeTab.includes(a.category)
        );

  const mainArticle = filteredArticles[0] || articles[0];
  const sideArticles = (filteredArticles.length > 1 ? filteredArticles.slice(1, 6) : articles.slice(1, 6));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 font-['Mukta',sans-serif]">
      {/* Widget Header with Ratopati/NepaliPatro Style Signature */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-500/20">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                ताजा समाचार तथा राष्ट्रिय अपडेट
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                लाइभ फिड
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              गोरखापत्र, रातोपाटी, अनलाइनखबर, सेतोपाटी, कान्तिपुर तथा बीबीसीबाट सिधै संकलित • {lastUpdated}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLiveNews}
            disabled={isLoading}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            title="समाचार ताजा गर्नुहोस्"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-red-500' : ''}`} />
          </button>

          <button
            onClick={onOpenAllNews}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>सबै समाचार पोर्टल</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* News Content Grid (Lead Card + Quick Editorial List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Main Lead Story (6 cols) */}
        {mainArticle && (
          <div
            onClick={() => {
              if (onSelectArticle) {
                onSelectArticle(mainArticle);
              } else {
                window.open(mainArticle.originalUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            className="lg:col-span-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              {mainArticle.imageUrl && (
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-inner">
                  <img
                    src={mainArticle.imageUrl}
                    alt={mainArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-black shadow-xs flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    प्रमुख समाचार
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="font-black text-red-600 dark:text-rose-400 px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/50">
                  {mainArticle.source}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-red-500" /> {mainArticle.publishedAt}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors leading-snug">
                {mainArticle.title}
              </h4>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {mainArticle.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={(e) => handleToggleSpeech(e, mainArticle)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                  playingArticleId === mainArticle.id
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title="अडियो सुन्नुहोस्"
              >
                {playingArticleId === mainArticle.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-red-500" />}
                <span>{playingArticleId === mainArticle.id ? 'रोक्नुहोस्' : 'सुन्नुहोस्'}</span>
              </button>

              <span className="text-xs font-bold text-red-600 dark:text-rose-400 flex items-center gap-1 group-hover:underline">
                <span>विस्तृत पढ्नुहोस्</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}

        {/* Secondary Editorial Stories List (6 cols) */}
        <div className="lg:col-span-6 space-y-2.5 flex flex-col justify-between">
          {sideArticles.map((art, idx) => (
            <div
              key={art.id || idx}
              onClick={() => {
                if (onSelectArticle) {
                  onSelectArticle(art);
                } else {
                  window.open(art.originalUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-red-50/50 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/80 transition-all cursor-pointer group flex items-start gap-3"
            >
              {art.imageUrl ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 font-bold flex items-center justify-center shrink-0 text-xs">
                  {idx + 1}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                  <span className="font-bold text-red-600 dark:text-rose-400">{art.source}</span>
                  <span>•</span>
                  <span>{art.publishedAt}</span>
                </div>

                <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h5>
              </div>

              <button
                onClick={(e) => handleToggleSpeech(e, art)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 shrink-0 self-center"
                title="अडियो सुन्नुहोस्"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

