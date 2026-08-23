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
} from 'lucide-react';
import { NewsArticle } from '../types';
import { INITIAL_NEWS_ARTICLES } from '../engines/newsEngine';

interface HomeNewsWidgetProps {
  onOpenAllNews: () => void;
  onSelectArticle?: (article: NewsArticle) => void;
}

export const HomeNewsWidget: React.FC<HomeNewsWidgetProps> = ({
  onOpenAllNews,
  onSelectArticle,
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_NEWS_ARTICLES);
  const [activeTab, setActiveTab] = useState<string>('ताजा');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('भर्खरै');

  const tabs = ['ताजा', 'राजनीति', 'अर्थ', 'खेलकुद', 'समाज'];

  const fetchLiveNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/news');
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
          setLastUpdated(new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' }));
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
    // Auto-refresh news on home page every 60 seconds
    const interval = setInterval(fetchLiveNews, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredArticles =
    activeTab === 'ताजा'
      ? articles.slice(0, 6)
      : articles
          .filter((a) => a.category.includes(activeTab) || activeTab.includes(a.category))
          .slice(0, 6);

  const mainArticle = filteredArticles[0];
  const sideArticles = filteredArticles.slice(1, 6);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 font-['Mukta',sans-serif]">
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                ताजा समाचार तथा राष्ट्रिय अपडेट
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                स्वचालित लाइभ
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              गोरखापत्र, अनलाइनखबर, सेतोपाटी, कान्तिपुर तथा बीबीसीबाट प्रत्यक्ष फिड • {lastUpdated}
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
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1"
          >
            <span>सबै समाचार</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* News Content Grid (Lead Card + Quick List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Main Lead Story (5 cols) */}
        {mainArticle && (
          <div
            onClick={() => {
              if (onSelectArticle) {
                onSelectArticle(mainArticle);
              } else {
                window.open(mainArticle.originalUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            {mainArticle.imageUrl && (
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 mb-3">
                <img
                  src={mainArticle.imageUrl}
                  alt={mainArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {mainArticle.category}
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="font-bold text-red-600 dark:text-rose-400">{mainArticle.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {mainArticle.publishedAt}
                </span>
              </div>

              <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors leading-snug line-clamp-2">
                {mainArticle.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {mainArticle.summary}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-red-600 dark:text-rose-400">
              <span>विस्तृत पढ्नुहोस्</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}

        {/* Side Headline List (7 cols) */}
        <div className="lg:col-span-7 divide-y divide-slate-100 dark:divide-slate-800/80">
          {sideArticles.map((article, idx) => (
            <div
              key={article.id || idx}
              onClick={() => {
                if (onSelectArticle) {
                  onSelectArticle(article);
                } else {
                  window.open(article.originalUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 cursor-pointer group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                  <span className="font-bold text-red-600 dark:text-rose-400">{article.source}</span>
                  <span>•</span>
                  <span>{article.publishedAt}</span>
                  {article.category && (
                    <>
                      <span>•</span>
                      <span className="text-slate-500">{article.category}</span>
                    </>
                  )}
                </div>

                <h5 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h5>
              </div>

              {article.imageUrl ? (
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
