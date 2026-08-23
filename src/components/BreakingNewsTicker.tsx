import React, { useState, useEffect } from 'react';
import { Radio, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { NewsArticle } from '../types';

interface BreakingNewsTickerProps {
  onSelectArticle?: (article: NewsArticle) => void;
  onOpenAllNews?: () => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  onSelectArticle,
  onOpenAllNews,
}) => {
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live breaking news from API
  useEffect(() => {
    let isMounted = true;
    const fetchBreaking = async () => {
      try {
        const res = await fetch('/api/v1/news/breaking');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.breaking && data.breaking.length > 0 && isMounted) {
            setBreakingNews(data.breaking);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        // fallback to standard news endpoint
      }

      try {
        const res2 = await fetch('/api/v1/news');
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.articles && isMounted) {
            setBreakingNews(data2.articles.slice(0, 8));
          }
        }
      } catch (e) {}

      if (isMounted) setIsLoading(false);
    };

    fetchBreaking();
    // Re-check breaking every 60 seconds
    const interval = setInterval(fetchBreaking, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-cycle news every 5 seconds
  useEffect(() => {
    if (isPaused || breakingNews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, breakingNews.length]);

  if (isLoading || breakingNews.length === 0) {
    return null;
  }

  const currentItem = breakingNews[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + breakingNews.length) % breakingNews.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
  };

  return (
    <div
      className="bg-white dark:bg-slate-900/95 border border-red-200/80 dark:border-red-950/60 rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-xs flex items-center justify-between gap-3 overflow-hidden transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Live Badge */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-600 text-white font-black text-xs shadow-xs tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>ताजा अपडेट</span>
        </div>
      </div>

      {/* Headline Text Carousel */}
      <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700">
          {currentItem.source}
        </span>

        <span className="text-[11px] text-slate-400 font-medium shrink-0 hidden md:inline">
          {currentItem.publishedAt}
        </span>

        <button
          onClick={() => {
            if (onSelectArticle) {
              onSelectArticle(currentItem);
            } else if (onOpenAllNews) {
              onOpenAllNews();
            } else {
              window.open(currentItem.originalUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-red-600 dark:hover:text-rose-400 truncate text-left transition-colors font-['Mukta',sans-serif]"
          title={currentItem.title}
        >
          {currentItem.title}
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[11px] text-slate-400 font-medium hidden lg:inline px-1">
          {currentIndex + 1}/{breakingNews.length}
        </span>

        <button
          onClick={handlePrev}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          title="अघिल्लो समाचार"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          title="पछिल्लो समाचार"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {onOpenAllNews && (
          <button
            onClick={onOpenAllNews}
            className="ml-1 px-2.5 py-1 text-xs font-bold text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>सबै</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
