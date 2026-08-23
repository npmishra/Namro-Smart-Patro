import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Clock,
  Share2,
  Bookmark,
  BookmarkCheck,
  Check,
  Sparkles,
  Building2,
  Volume2,
  VolumeX,
  Type,
  MessageCircle,
} from 'lucide-react';
import { NewsArticle } from '../types';
import { speakNepaliText } from '../engines/newsEngine';

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
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Stop speech when modal closes or article changes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article]);

  if (!article) return null;

  const handleToggleSpeech = () => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${article.title}। ${article.source} को समाचार। ${article.summary}`;
      setIsPlayingAudio(true);
      speakNepaliText(textToRead, () => {
        setIsPlayingAudio(false);
      });
    }
  };

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

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`*${article.title}*\n\n${article.summary}\n\nविस्तृत: ${article.originalUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(article.originalUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const fontSizeClasses = {
    normal: 'text-sm sm:text-base leading-relaxed',
    large: 'text-base sm:text-lg leading-relaxed',
    xlarge: 'text-lg sm:text-xl leading-loose',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 font-['Mukta',sans-serif]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/70 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-rose-300">
              {article.category || 'समाचार'}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-red-500" />
              {article.source}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Speech Reader Button */}
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs font-bold ${
                isPlayingAudio
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title={isPlayingAudio ? 'वाचन रोक्नुहोस्' : 'समाचार सुन्नुहोस् (Audio Speech)'}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-500" />}
              <span className="hidden sm:inline">{isPlayingAudio ? 'रोक्नुहोस्' : 'सुन्नुहोस्'}</span>
            </button>

            {/* Font Size Adjuster */}
            <button
              onClick={() => {
                if (fontSize === 'normal') setFontSize('large');
                else if (fontSize === 'large') setFontSize('xlarge');
                else setFontSize('normal');
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="अक्षरको आकार परिवर्तन गर्नुहोस्"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Bookmark Toggle */}
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
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
              </button>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="समाचार सेयर गर्नुहोस्"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {article.imageUrl && (
            <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
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
              <Clock className="w-3.5 h-3.5 text-red-500" />
              {article.publishedAt}
            </span>
            <span>•</span>
            <span>पढ्न लाग्ने समय: ~{article.readTimeMinutes} मिनेट</span>
            <span>•</span>
            <span className="text-slate-500 font-bold">स्रोत: {article.source}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
            {article.title}
          </h2>

          <div
            className={`${fontSizeClasses[fontSize]} text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 font-normal`}
          >
            {article.summary}
          </div>

          {/* Social Share Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              यो समाचार आफ्ना साथीहरूसँग सेयर गर्नुहोस्:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={shareViaWhatsApp}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={shareViaFacebook}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>Facebook</span>
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 hover:bg-slate-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'कपि भयो' : 'लिङ्क कपि'}</span>
              </button>
            </div>
          </div>

          {/* Source attribution guarantee */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">प्रत्यक्ष तथा आधिकारिक समाचार स्रोत</div>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                यो समाचार {article.source} को आधिकारिक फिडमार्फत स्वचालित रूपमा सङ्कलन गरिएको हो। पूर्ण विस्तृत सामग्री तथा भिडियो विश्लेषणका लागि तलको बटन थिची मूल पोर्टलमा जान सक्नुहुन्छ।
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 flex flex-wrap items-center justify-between gap-3">
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
            <span>मूल समाचार पोर्टलमा पढ्नुहोस् ({article.source})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

