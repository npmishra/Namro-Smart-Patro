import React from 'react';
import { X, ExternalLink, Clock, Share2, Bookmark, BookmarkCheck, Check, Sparkles, Building2 } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (article: NewsArticle) => void;
}

export const NewsReaderModal: React.FC<NewsReaderModalProps> = ({
  article,
  onClose,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.summary,
          url: article.originalUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title}\n${article.originalUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 font-['Mukta',sans-serif]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-rose-300">
              {article.category || 'समाचार'}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {article.source}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(article)}
                className={`p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title={isBookmarked ? 'सुरक्षितबाट हटाउनुहोस्' : 'पछिका लागि सुरक्षित गर्नुहोस्'}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="समाचार सेयर गर्नुहोस्"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {article.imageUrl && (
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {article.publishedAt}
            </span>
            <span>•</span>
            <span>पढ्न लाग्ने समय: ~{article.readTimeMinutes} मिनेट</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
            {article.title}
          </h2>

          <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {article.summary}
          </div>

          <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-4 rounded-2xl text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">प्रत्यक्ष समाचार स्रोत (Direct Feed)</div>
              <p className="mt-0.5 text-blue-600 dark:text-blue-300">
                यो समाचार {article.source} को आधिकारिक फिडमार्फत स्वचालित रूपमा सङ्कलन गरिएको हो। पूर्ण विस्तृत समाचार, तस्बिर तथा विश्लेषणका लागि मूल स्रोतमा हेर्नुहोस्।
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            बन्द गर्नुहोस्
          </button>

          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>मूल समाचार पढ्नुहोस् ({article.source})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
