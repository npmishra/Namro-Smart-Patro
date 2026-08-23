import React from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Youtube,
  Twitter,
  MessageCircle,
  FileText,
  ShieldCheck,
  X,
  ExternalLink,
  Copy,
  Check,
  Headphones,
} from 'lucide-react';
import { CompanyProfile } from '../types';

interface CompanyContactModalProps {
  profile: CompanyProfile;
  onClose: () => void;
}

export const CompanyContactModal: React.FC<CompanyContactModalProps> = ({ profile, onClose }) => {
  const [copiedKey, setCopiedKey] = React.useState<string>('');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-['Mukta',sans-serif]">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header Hero */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 text-white flex items-start justify-between">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wide">
              <span>{profile.customLogoEmoji || '☀️'}</span>
              <span>{profile.shortCode || 'NSP'} OFFICIAL</span>
              {profile.displayOrganizationBadge && (
                <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">
                  प्रमाणित
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {profile.companyNameNepali}
            </h2>
            <p className="text-sm font-semibold text-rose-100">{profile.companyNameEnglish}</p>
            <p className="text-xs text-white/85 leading-relaxed pt-1">{profile.taglineNepali}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/25 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[68vh] overflow-y-auto">
          {/* Quick Action Grid: Call, Email, WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`tel:${profile.phonePrimary}`}
              className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/60 flex flex-col items-center text-center gap-1.5 hover:scale-[1.02] transition-transform group"
            >
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs group-hover:bg-red-700">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">सिधा फोन गर्नुहोस्</span>
              <span className="text-[11px] font-bold text-red-600 dark:text-rose-400">
                {profile.phonePrimary}
              </span>
            </a>

            <a
              href={`mailto:${profile.emailPrimary}`}
              className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex flex-col items-center text-center gap-1.5 hover:scale-[1.02] transition-transform group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">इमेल पठाउनुहोस्</span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 truncate max-w-full">
                {profile.emailPrimary}
              </span>
            </a>

            {profile.whatsAppNumber && (
              <a
                href={`https://wa.me/${profile.whatsAppNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex flex-col items-center text-center gap-1.5 hover:scale-[1.02] transition-transform group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">ह्वाट्सएप च्याट</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {profile.whatsAppNumber}
                </span>
              </a>
            )}
          </div>

          {/* 1. Office Location & Address */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>कार्यालय तथा ठेगाना विवरण (Office Address)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block font-bold">ठेगाना (नेपाली):</span>
                <span className="font-black text-slate-900 dark:text-white text-sm">
                  {profile.addressLine1Nepali}, {profile.districtNepali}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {profile.provinceNepali}, {profile.countryNepali} (हुलाक कोड: {profile.postalCode})
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block font-bold">Address (English):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {profile.addressLine1English}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {profile.districtNepali}, {profile.countryNepali} - {profile.postalCode}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Contact Phone & Toll-free Numbers */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Headphones className="w-4 h-4 text-purple-500" />
              <span>सम्पर्क टेलिफोन तथा हटलाइन (Phone & Support)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">मुख्य फोन:</span>
                  <span className="font-black text-slate-900 dark:text-white">{profile.phonePrimary}</span>
                </div>
                <button
                  onClick={() => handleCopy(profile.phonePrimary, 'phonePrimary')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                >
                  {copiedKey === 'phonePrimary' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {profile.phoneSecondary && (
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">मोबाइल / अन्य:</span>
                    <span className="font-black text-slate-900 dark:text-white">{profile.phoneSecondary}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.phoneSecondary, 'phoneSecondary')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                  >
                    {copiedKey === 'phoneSecondary' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {profile.tollFreeNumber && (
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">टोल-फ्री हटलाइन:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{profile.tollFreeNumber}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.tollFreeNumber, 'tollFreeNumber')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                  >
                    {copiedKey === 'tollFreeNumber' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Legal, PAN & Registration */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>दर्ता, स्थायी लेखा नम्बर (PAN) र कानुनी पहिचान</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">स्थायी लेखा नम्बर (PAN / VAT):</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white text-sm tracking-wider">
                    {profile.panNumber}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(profile.panNumber, 'pan')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                >
                  {copiedKey === 'pan' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">कम्पनी दर्ता नम्बर:</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                    {profile.registrationNumber}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(profile.registrationNumber, 'reg')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                >
                  {copiedKey === 'reg' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 4. Social Media & Website */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>वेबसाइट तथा सामाजिक सञ्जाल लिङ्कहरू</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-700 dark:text-slate-300 hover:text-red-600 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>वेबसाइट खोल्नुहोस्</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              {profile.facebookUrl && (
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200 dark:border-blue-800/60"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-600 fill-current" />
                  <span>फेसबुक पेज</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              {profile.youtubeUrl && (
                <a
                  href={profile.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-red-200 dark:border-red-800/60"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-600 fill-current" />
                  <span>युट्युब च्यानल</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}

              {profile.twitterUrl && (
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Twitter className="w-3.5 h-3.5 text-sky-500 fill-current" />
                  <span>ट्विटर / X</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 truncate max-w-sm">
            {profile.copyrightNoticeNepali}
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black transition-colors"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
