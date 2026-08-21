import React, { useState } from 'react';
import {
  Newspaper,
  ExternalLink,
  Clock,
  Rss,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { NewsArticle } from '../types';
import { INITIAL_NEWS_ARTICLES, RSS_SOURCES } from '../engines/newsEngine';

export const NewsFeedView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('सबै');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_NEWS_ARTICLES);

  const categories = ['सबै', 'समसामयिक', 'राजनीति', 'समाज', 'अर्थ', 'खेलकुद', 'प्रविधि', 'विश्व'];

  const filteredArticles =
    selectedCategory === 'सबै'
      ? articles
      : articles.filter((a) => a.category.includes(selectedCategory) || selectedCategory.includes(a.category));

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300">
              ताजा समाचार तथा राष्ट्रिय अपडेटहरू (News & RSS)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
            नेपाली प्रमुख सञ्चारमाध्यमका ताजा समाचार
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            गोरखापत्र, सेतोपाटी, रातोपाटी, अनलाइनखबर, कान्तिपुर तथा बीबीसी नेपालीबाट प्रत्यक्ष
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          <span>{isRefreshing ? 'ताजा गर्दै...' : 'अपडेट गर्नुहोस्'}</span>
        </button>
      </div>

      {/* RSS Sources Status Pill Strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <Rss className="w-3.5 h-3.5 text-orange-500" /> स्रोतहरू:
        </span>
        {RSS_SOURCES.map((source) => (
          <a
            key={source.id}
            href={source.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {source.name.split(' ')[0]}
          </a>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            {/* Thumbnail */}
            {article.imageUrl && (
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/75 backdrop-blur-xs text-white text-[10px] font-bold">
                  {article.category}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-red-600 dark:text-rose-400">{article.source}</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {article.publishedAt}
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug font-['Mukta',sans-serif]">
                  {article.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  पढ्न लाग्ने: ~{article.readTimeMinutes} मिनेट
                </span>

                <a
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-rose-400 hover:underline"
                >
                  <span>पूरै समाचार</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
