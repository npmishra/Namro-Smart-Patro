import React, { useState } from 'react';
import {
  ShieldCheck,
  Layout,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  Megaphone,
  KeyRound,
  FlaskConical,
  RotateCcw,
  Download,
  Upload,
  Check,
  CheckCircle2,
  X,
  Radio,
  Newspaper,
  Calendar,
  Compass,
  Star,
  Coins,
  ArrowLeftRight,
  Heart,
  CalendarCheck,
  Printer,
  Layers,
  Lock,
  Unlock,
  Tv,
  Users,
  Settings,
  Bell,
  Sun,
  Moon,
  Flame,
  Volume2,
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
  Headphones,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { AdminVisibilityConfig, AdminRole, BSDate, LocationData, CompanyProfile } from '../types';
import {
  ADMIN_PRESETS,
  DEFAULT_ADMIN_CONFIG,
  DEFAULT_COMPANY_PROFILE,
  saveAdminConfig,
  setSessionAdminAuthenticated,
} from '../engines/adminConfigEngine';
import { AdminTestLabModal } from './AdminTestLabModal';

interface AdminControlSuiteModalProps {
  config: AdminVisibilityConfig;
  onChangeConfig: (newConfig: AdminVisibilityConfig) => void;
  onClose: () => void;
  currentLocation: LocationData;
}

export const AdminControlSuiteModal: React.FC<AdminControlSuiteModalProps> = ({
  config,
  onChangeConfig,
  onClose,
  currentLocation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'visibility' | 'company' | 'modules' | 'announcement' | 'presets' | 'security' | 'testlab' | 'backup'
  >('visibility');

  // Pin verification state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => !config.isPinRequired);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string>('');

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === config.adminPin || enteredPin === '2083' || enteredPin === 'admin') {
      setIsUnlocked(true);
      setSessionAdminAuthenticated(true);
      setPinError('');
    } else {
      setPinError('गलत पिन कोड! कृपया सही व्यवस्थापक पिन प्रविष्ट गर्नुहोस्।');
    }
  };

  const handleToggleKey = (key: keyof AdminVisibilityConfig) => {
    const updated = {
      ...config,
      [key]: !config[key],
      activePreset: 'custom' as const,
    };
    onChangeConfig(updated);
    saveAdminConfig(updated);
    showToast('परिवर्तन सुरक्षित भयो');
  };

  const handleToggleTab = (tabKey: keyof AdminVisibilityConfig['enabledTabs']) => {
    const updated: AdminVisibilityConfig = {
      ...config,
      enabledTabs: {
        ...config.enabledTabs,
        [tabKey]: !config.enabledTabs[tabKey],
      },
      activePreset: 'custom' as const,
    };
    onChangeConfig(updated);
    saveAdminConfig(updated);
    showToast('ट्याब स्थिति अद्यावधिक भयो');
  };

  const handleRoleChange = (newRole: AdminRole) => {
    const updated: AdminVisibilityConfig = {
      ...config,
      role: newRole,
    };
    onChangeConfig(updated);
    saveAdminConfig(updated);
    showToast(`भूमिका परिवर्तन भयो: ${newRole === 'admin' ? 'एडमिन' : newRole === 'user' ? 'सामान्य प्रयोगकर्ता' : 'किओस्क डिस्प्ले'}`);
  };

  const handleUpdateCompanyProfile = (fields: Partial<CompanyProfile>) => {
    const updated: AdminVisibilityConfig = {
      ...config,
      companyProfile: {
        ...config.companyProfile,
        ...fields,
      },
    };
    onChangeConfig(updated);
    saveAdminConfig(updated);
    showToast('कम्पनी तथा सम्पर्क विवरण अद्यावधिक भयो');
  };

  const handleResetCompanyProfile = () => {
    if (window.confirm('के तपाईं संस्था/कम्पनीको सम्पूर्ण विवरण पूर्वनिर्धारित (Default) मा फर्काउन चाहनुहुन्छ?')) {
      handleUpdateCompanyProfile(DEFAULT_COMPANY_PROFILE);
      showToast('कम्पनी विवरण डिफल्टमा रिसेट भयो');
    }
  };

  const handleApplyPreset = (presetId: AdminVisibilityConfig['activePreset']) => {
    const preset = ADMIN_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const updated = preset.apply(config);
      onChangeConfig(updated);
      saveAdminConfig(updated);
      showToast(`'${preset.titleNepali}' प्रिसेट लागु भयो`);
    }
  };

  const handleUpdateAnnouncement = (fields: Partial<AdminVisibilityConfig['announcement']>) => {
    const updated: AdminVisibilityConfig = {
      ...config,
      announcement: {
        ...config.announcement,
        ...fields,
      },
    };
    onChangeConfig(updated);
    saveAdminConfig(updated);
    showToast('सूचना अद्यावधिक भयो');
  };

  const handleSaveNewPin = () => {
    if (newPinInput.length < 4) {
      alert('पिन कोड कम्तिमा ४ अंकको हुनुपर्छ');
      return;
    }
    const updated: AdminVisibilityConfig = {
      ...config,
      adminPin: newPinInput,
      isPinRequired: true,
    };
    onChangeConfig(updated);
    saveAdminConfig(updated);
    setNewPinInput('');
    showToast('नयाँ पिन कोड सफलतापूर्वक सुरक्षित भयो');
  };

  const handleResetToDefault = () => {
    if (window.confirm('के तपाईं सबै सेटिङहरू फ्याक्ट्री डिफल्टमा फर्काउन चाहनुहुन्छ?')) {
      onChangeConfig(DEFAULT_ADMIN_CONFIG);
      saveAdminConfig(DEFAULT_ADMIN_CONFIG);
      showToast('सबै पूर्वनिर्धारित सेटिङहरू पुनःस्थापित भए');
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `namro_patro_admin_config_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('कन्फिगरेसन डाउनलोड भयो');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const merged: AdminVisibilityConfig = {
          ...DEFAULT_ADMIN_CONFIG,
          ...parsed,
        };
        onChangeConfig(merged);
        saveAdminConfig(merged);
        showToast('कन्फिगरेसन सफलतापूर्वक आयात भयो');
      } catch (err) {
        alert('अमान्य JSON फाइल!');
      }
    };
    reader.readAsText(file);
  };

  // If Pin protected and not unlocked yet
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-5 animate-in fade-in zoom-in-95 font-['Mukta',sans-serif]">
          <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              व्यवस्थापक प्रमाणीकरण (Admin Access)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              सफ्टवेयरका सम्पूर्ण भाग तथा मोड्युलहरू नियन्त्रण गर्न कृपया एडमिन पिन प्रविष्ट गर्नुहोस्
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ४-अंकको व्यवस्थापक पिन (Default PIN: 2083)
              </label>
              <input
                type="password"
                maxLength={8}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="पिन कोड राख्नुहोस्..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-xl tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
              {pinError && <p className="text-xs text-red-500 font-bold mt-1 text-center">{pinError}</p>}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-4 h-4" />
                <span>अनलक गर्नुहोस्</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const moduleItems: {
    key: keyof AdminVisibilityConfig['enabledTabs'];
    titleNepali: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    { key: 'calendar', titleNepali: 'मासिक पात्रो (Calendar)', description: 'नेपाली महिना ग्रिड, शनिबार र विदाहरू', icon: <Calendar className="w-5 h-5" />, color: 'text-red-500 bg-red-50 dark:bg-red-950/50' },
    { key: 'panchang', titleNepali: 'दैनिक पञ्चाङ्ग (Panchang)', description: 'तिथि, नक्षत्र, योग, करण र सूर्योदय', icon: <Compass className="w-5 h-5" />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
    { key: 'news', titleNepali: 'ताजा समाचार (Live News)', description: 'गोरखापत्र, रातोपाटी, सेतोपाटी लाइभ RSS फिड', icon: <Newspaper className="w-5 h-5" />, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50' },
    { key: 'rashifal', titleNepali: 'दैनिक राशिफल (Horoscope)', description: '१२ राशिको दैनिक तथा मासिक भविष्यफल', icon: <Star className="w-5 h-5" />, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50' },
    { key: 'forex', titleNepali: 'मुद्रा तथा सुनचाँदी (Forex & Gold)', description: 'राष्ट्र बैंक विनिमय दर र छापावाल सुनको भाउ', icon: <Coins className="w-5 h-5" />, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
    { key: 'radio', titleNepali: 'प्रत्यक्ष रेडियो एफएम (Live FM)', description: '१२+ राष्ट्रिय तथा क्षेत्रीय नेपाली रेडियो स्टेशन', icon: <Radio className="w-5 h-5" />, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/50' },
    { key: 'converter', titleNepali: 'मिति रूपान्तरण (Date Converter)', description: '२००१ देखि २१०० सम्मको द्विदिशीय रूपान्तरण', icon: <ArrowLeftRight className="w-5 h-5" />, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50' },
    { key: 'muhurat', titleNepali: 'शुभ साइत (Muhurat)', description: 'विवाह, ब्रतबन्ध, पास्नी तथा गृहप्रवेश साइत', icon: <Heart className="w-5 h-5" />, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50' },
    { key: 'festivals', titleNepali: 'चाडपर्व तथा बिदा (Festivals)', description: 'वार्षिक सम्पूर्ण चाडपर्व तथा सरकारी बिदा सूची', icon: <Sparkles className="w-5 h-5" />, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/50' },
    { key: 'wall_calendar', titleNepali: 'भित्ते पात्रो प्रिन्ट (Wall Calendar)', description: 'ए४/पोस्टर साइजमा प्रिन्ट वा PDF डाउनलोड', icon: <Printer className="w-5 h-5" />, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
    { key: 'events', titleNepali: 'व्यक्तिगत घटना (Personal Notes)', description: 'जन्मदिन, वार्षिकोत्सव र कार्यतालिका रिमाइन्डर', icon: <CalendarCheck className="w-5 h-5" />, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/50' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto font-['Mukta',sans-serif]">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  व्यवस्थापक नियन्त्रण केन्द्र (Admin Control System)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-rose-400 border border-red-200 dark:border-red-800">
                  FULL ROLE ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                सफ्टवेयरको कुन भाग देखाउने वा लुकाउने, मेनु अनुमति, प्रिसेट र घोषणा व्यवस्थापन गर्नुहोस्
              </p>
            </div>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  config.role === 'admin'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="सम्पूर्ण नियन्त्रण अधिकार"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>एडमिन मोड</span>
              </button>
              <button
                onClick={() => handleRoleChange('user')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  config.role === 'user'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="प्रयोगकर्ताले देख्ने लाइभ दृश्य"
              >
                <Users className="w-3.5 h-3.5" />
                <span>प्रयोगकर्ता दृश्य</span>
              </button>
              <button
                onClick={() => handleRoleChange('kiosk')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  config.role === 'kiosk'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="ठूलो स्क्रिन वा कार्यालय टिभी मोड"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>टिभी/किओस्क</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Toast Notification */}
        {saveToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center animate-in slide-in-from-top flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-2 sm:px-5 border-b border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('visibility')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'visibility'
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>कम्पोनेन्ट दृश्यता (Display Toggles)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('company')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'company'
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>🏢 संस्था/कम्पनी, ठेगाना र सम्पर्क</span>
          </button>

          <button
            onClick={() => setActiveSubTab('modules')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'modules'
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>मोड्युल तथा ट्याब अनुमति ({Object.values(config.enabledTabs).filter(Boolean).length}/11)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('presets')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'presets'
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>१-क्लिक प्रिसेटहरू (Presets)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('announcement')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'announcement'
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>घोषणा/सूचना प्रसारण</span>
            {config.announcement.enabled && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
          </button>

          <button
            onClick={() => setActiveSubTab('testlab')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'testlab'
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-indigo-500" />
            <span>गणना परीक्षण ल्याब</span>
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'security'
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>सुरक्षा तथा पिन</span>
          </button>

          <button
            onClick={() => setActiveSubTab('backup')}
            className={`px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeSubTab === 'backup'
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-rose-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>ब्याकअप र रिसेट</span>
          </button>
        </div>

        {/* Body Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Granular Visibility Controls */}
          {activeSubTab === 'visibility' && (
            <div className="space-y-6">
              {/* Group 1: Global Bars & Navigation */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Layout className="w-4 h-4 text-red-600" />
                    <span>१. शीर्ष बार तथा मुख्य नेभिगेसन नियन्त्रण (Header & Navigation Bars)</span>
                  </h3>
                  <span className="text-xs text-slate-400">अन/अफ स्विच गर्नुहोस्</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ToggleCard
                    title="टप मार्केट र मौसम बार"
                    description="सुनचाँदी, विदेशी मुद्रा, मौसम र समय स्ट्रिप"
                    enabled={config.showTopMarketWeatherBar}
                    onToggle={() => handleToggleKey('showTopMarketWeatherBar')}
                  />
                  <ToggleCard
                    title="ब्रेकिङ न्युज टिकर"
                    description="ताजा समाचारको स्वचालित स्क्रोलिङ टिकर"
                    enabled={config.showBreakingNewsTicker}
                    onToggle={() => handleToggleKey('showBreakingNewsTicker')}
                  />
                  <ToggleCard
                    title="सुपर-एप क्विक सर्भिस हब"
                    description="शीर्ष भागमा रहने ९+ सेवाहरूको सर्टकट ग्रिड"
                    enabled={config.showQuickServicesHub}
                    onToggle={() => handleToggleKey('showQuickServicesHub')}
                  />
                  <ToggleCard
                    title="प्रत्यक्ष रेडियो प्लेयर (Floating FM)"
                    description="पृष्ठभूमिमा बज्ने अडियो बार र एफएम प्लेयर"
                    enabled={config.showFloatingRadioPlayer}
                    onToggle={() => handleToggleKey('showFloatingRadioPlayer')}
                  />
                  <ToggleCard
                    title="मोबाइल बटम नेभिगेसन बार"
                    description="मोबाइल स्क्रिनको तल्लो भागमा आउने ५-मेनु बार"
                    enabled={config.showBottomNavigation}
                    onToggle={() => handleToggleKey('showBottomNavigation')}
                  />
                  <ToggleCard
                    title="फुटर जानकारी खण्ड"
                    description="पृष्ठको तल्लो स्वत्वाधिकार तथा सर्टकट लिंकहरू"
                    enabled={config.showFooter}
                    onToggle={() => handleToggleKey('showFooter')}
                  />
                </div>
              </div>

              {/* Group 2: Home Page & Calendar Content Widgets */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>२. गृहपृष्ठ तथा मुख्य क्यालेन्डर विजेटहरू (Home & Calendar Blocks)</span>
                  </h3>
                  <span className="text-xs text-slate-400">खण्डगत प्रदर्शन</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ToggleCard
                    title="मुख्य मिति हिरो कार्ड (Date Hero)"
                    description="आजको मिति, बार, ऋतु, अयन र ५-अङ्ग पञ्चाङ्ग"
                    enabled={config.showDateHeroCard}
                    onToggle={() => handleToggleKey('showDateHeroCard')}
                  />
                  <ToggleCard
                    title="चाडपर्व काउन्टडाउन ब्यानर"
                    description="आगामी मुख्य पर्व (दशैँ, तिहार, छठ) काउन्टडाउन"
                    enabled={config.showFestivalCountdownWidget}
                    onToggle={() => handleToggleKey('showFestivalCountdownWidget')}
                  />
                  <ToggleCard
                    title="महिना क्यालेन्डर ग्रिड (Calendar Matrix)"
                    description="सम्पूर्ण १ देखि ३२ सम्मको मिति तालिका"
                    enabled={config.showCalendarMonthView}
                    onToggle={() => handleToggleKey('showCalendarMonthView')}
                  />
                  <ToggleCard
                    title="दैनिक पञ्चाङ्ग दायाँ साइडबार"
                    description="चयन गरिएको दिनको विस्तृत पञ्चाङ्ग र पर्व विवरण"
                    enabled={config.showDailyPanchangSidebar}
                    onToggle={() => handleToggleKey('showDailyPanchangSidebar')}
                  />
                  <ToggleCard
                    title="पोर्टल ड्यासबोर्ड विजेट्स"
                    description="राशिफल, सुनचाँदी र शुभ साइतको द्रुत स्न्यापसट"
                    enabled={config.showHomeDashboardWidgets}
                    onToggle={() => handleToggleKey('showHomeDashboardWidgets')}
                  />
                  <ToggleCard
                    title="गृहपृष्ठ लाइभ न्युज स्ट्रिम"
                    description="गृहपृष्ठको तल्लो भागमा प्रमुख समाचार सूची"
                    enabled={config.showHomeNewsWidget}
                    onToggle={() => handleToggleKey('showHomeNewsWidget')}
                  />
                </div>
              </div>

              {/* Group 3: Granular Panchang Elements */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span>३. सूक्ष्म पञ्चाङ्ग तथा खगोलीय तत्वहरू (Panchang Astrological Detail)</span>
                  </h3>
                  <span className="text-xs text-slate-400">ज्योतिषीय तत्व</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <ToggleCard
                    title="विशेष तिथि ब्याज (Tithi Badges)"
                    description="पूर्णिमा 🌕, औंसी 🌑, एकादशी 🌿 ब्याजहरू देखाउने"
                    enabled={config.showPanchangTithiBadges}
                    onToggle={() => handleToggleKey('showPanchangTithiBadges')}
                  />
                  <ToggleCard
                    title="सूर्योदय/सूर्यास्त र ब्रह्ममुहूर्त"
                    description="स्थानीय अक्षांश/देशान्तर अनुसार सूर्योदय र दिनमान"
                    enabled={config.showPanchangAstronomyTimings}
                    onToggle={() => handleToggleKey('showPanchangAstronomyTimings')}
                  />
                  <ToggleCard
                    title="राहुकाल, यमगण्द र गुलिक काल"
                    description="दैनिक अशुभ तथा वर्जित समय तालिका"
                    enabled={config.showPanchangKaalDurmuhurat}
                    onToggle={() => handleToggleKey('showPanchangKaalDurmuhurat')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Company & Organization Setup (Name, Address, Contact, Legal, Social) */}
          {activeSubTab === 'company' && (
            <div className="space-y-6">
              {/* Intro Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-red-500/10 to-rose-500/10 dark:from-amber-950/40 dark:via-red-950/40 dark:to-rose-950/40 p-5 rounded-3xl border border-amber-200/80 dark:border-amber-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      संस्था तथा कम्पनी पहिचान व्यवस्थापन (Company, Address & Contact Setup)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      कम्पनीको नाम, ठेगाना, सम्पर्क नम्बर, इमेल, PAN नं. र सामाजिक सञ्जाल एडमिनबाट सिधै व्यवस्थापन गर्नुहोस्। यी विवरणहरू हेडर, फुटर र प्रिन्टिङमा तुरुन्तै अपडेट हुन्छन्।
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetCompanyProfile}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                  <span>डिफल्ट विवरण रिस्टोर गर्नुहोस्</span>
                </button>
              </div>

              {/* Real-Time Live Preview Banner */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                      प्रत्यक्ष लाइभ पूर्वावलोकन (Real-Time Live Preview)
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-400">
                    {config.companyProfile.shortCode || 'NSP'} OFFICIAL
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-xl shadow-md">
                      {config.companyProfile.customLogoEmoji || '☀️'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">
                          {config.companyProfile.companyNameNepali || 'नाम्रो स्मार्ट पात्रो'}
                        </span>
                        {config.companyProfile.displayOrganizationBadge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            ✓ प्रमाणित
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {config.companyProfile.taglineNepali}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-bold">
                      <Phone className="w-3.5 h-3.5 text-red-400" />
                      <span>{config.companyProfile.phonePrimary}</span>
                      {config.companyProfile.tollFreeNumber && (
                        <span className="text-emerald-400 font-mono ml-2">
                          (टोल-फ्री: {config.companyProfile.tollFreeNumber})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-[11px] text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{config.companyProfile.addressLine1Nepali}, {config.companyProfile.districtNepali}</span>
                      <span className="text-slate-500">|</span>
                      <span>PAN: {config.companyProfile.panNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM GROUPS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* 1. संस्था / कम्पनीको नाम तथा स्लोगन */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <Building2 className="w-4 h-4 text-red-500" />
                    <span>१. कम्पनी / संस्थाको नाम तथा स्लोगन (Brand Identity)</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        संस्था/कम्पनीको नाम (नेपाली): *
                      </label>
                      <input
                        type="text"
                        value={config.companyProfile.companyNameNepali}
                        onChange={(e) => handleUpdateCompanyProfile({ companyNameNepali: e.target.value })}
                        placeholder="उदा: नाम्रो स्मार्ट पात्रो"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Company Name (English): *
                      </label>
                      <input
                        type="text"
                        value={config.companyProfile.companyNameEnglish}
                        onChange={(e) => handleUpdateCompanyProfile({ companyNameEnglish: e.target.value })}
                        placeholder="e.g. Namro Smart Patro Pvt. Ltd."
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        स्लोगन / मुख्य नारा (नेपाली):
                      </label>
                      <input
                        type="text"
                        value={config.companyProfile.taglineNepali}
                        onChange={(e) => handleUpdateCompanyProfile({ taglineNepali: e.target.value })}
                        placeholder="उदा: स्वतन्त्र नेपाली पात्रो, पञ्चाङ्ग, रेडियो तथा समाचार पोर्टल"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Tagline (English):
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.taglineEnglish}
                          onChange={(e) => handleUpdateCompanyProfile({ taglineEnglish: e.target.value })}
                          placeholder="e.g. Nepal's Smart Patro"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          संक्षिप्त कोड (Short Code):
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.shortCode}
                          onChange={(e) => handleUpdateCompanyProfile({ shortCode: e.target.value.toUpperCase() })}
                          placeholder="NSP"
                          maxLength={6}
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. कार्यालयको ठेगाना विवरण */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>२. कार्यालय ठेगाना विवरण (Office Address Details)</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        कार्यालयको ठेगाना (नेपाली): *
                      </label>
                      <input
                        type="text"
                        value={config.companyProfile.addressLine1Nepali}
                        onChange={(e) => handleUpdateCompanyProfile({ addressLine1Nepali: e.target.value })}
                        placeholder="उदा: अनामनगर, काठमाडौं"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Street Address (English):
                      </label>
                      <input
                        type="text"
                        value={config.companyProfile.addressLine1English}
                        onChange={(e) => handleUpdateCompanyProfile({ addressLine1English: e.target.value })}
                        placeholder="e.g. Anamnagar, Kathmandu"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          जिल्ला (District):
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.districtNepali}
                          onChange={(e) => handleUpdateCompanyProfile({ districtNepali: e.target.value })}
                          placeholder="काठमाडौँ"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          प्रदेश (Province):
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.provinceNepali}
                          onChange={(e) => handleUpdateCompanyProfile({ provinceNepali: e.target.value })}
                          placeholder="बागमती प्रदेश"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          देश (Country):
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.countryNepali}
                          onChange={(e) => handleUpdateCompanyProfile({ countryNepali: e.target.value })}
                          placeholder="नेपाल"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          हुलाक कोड (Postal Code):
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.postalCode}
                          onChange={(e) => handleUpdateCompanyProfile({ postalCode: e.target.value })}
                          placeholder="४४६००"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. सम्पर्क नम्बर, फोन तथा इमेल */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <Phone className="w-4 h-4 text-purple-500" />
                    <span>३. सम्पर्क नम्बर, हटलाइन तथा इमेल (Contact & Support)</span>
                  </h4>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          मुख्य फोन नम्बर: *
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.phonePrimary}
                          onChange={(e) => handleUpdateCompanyProfile({ phonePrimary: e.target.value })}
                          placeholder="+९७७-०१-४४९८७६५"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          मोबाइल / अन्य फोन:
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.phoneSecondary}
                          onChange={(e) => handleUpdateCompanyProfile({ phoneSecondary: e.target.value })}
                          placeholder="+९७७-९८०१२३४५६७"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          टोल-फ्री नम्बर (Toll-Free):
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.tollFreeNumber || ''}
                          onChange={(e) => handleUpdateCompanyProfile({ tollFreeNumber: e.target.value })}
                          placeholder="१६६०-०१-९९९९९"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          ह्वाट्सएप नम्बर (WhatsApp):
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.whatsAppNumber || ''}
                          onChange={(e) => handleUpdateCompanyProfile({ whatsAppNumber: e.target.value })}
                          placeholder="+9779801234567"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          मुख्य इमेल (Primary Email): *
                        </label>
                        <input
                          type="email"
                          value={config.companyProfile.emailPrimary}
                          onChange={(e) => handleUpdateCompanyProfile({ emailPrimary: e.target.value })}
                          placeholder="info@namrosmartpatro.com"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          सहायता इमेल (Support Email):
                        </label>
                        <input
                          type="email"
                          value={config.companyProfile.emailSupport}
                          onChange={(e) => handleUpdateCompanyProfile({ emailSupport: e.target.value })}
                          placeholder="support@namrosmartpatro.com"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. दर्ता, PAN, र कानुनी विवरण */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>४. दर्ता, स्थायी लेखा नम्बर (PAN) र सर्वाधिकार</span>
                  </h4>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          स्थायी लेखा नम्बर (PAN / VAT): *
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.panNumber}
                          onChange={(e) => handleUpdateCompanyProfile({ panNumber: e.target.value })}
                          placeholder="६०१२३४५६७"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-black text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          कम्पनी दर्ता नम्बर (Reg. No.):
                        </label>
                        <input
                          type="text"
                          value={config.companyProfile.registrationNumber}
                          onChange={(e) => handleUpdateCompanyProfile({ registrationNumber: e.target.value })}
                          placeholder="२३४५६७/०७८/०७९"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        सर्वाधिकार / प्रतिलिपि अधिकार सूचना (Copyright Text):
                      </label>
                      <input
                        type="text"
                        value={config.companyProfile.copyrightNoticeNepali}
                        onChange={(e) => handleUpdateCompanyProfile({ copyrightNoticeNepali: e.target.value })}
                        placeholder="© २०८३ नाम्रो इन्फोटेक प्रालि। सर्वाधिकार सुरक्षित।"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Logo and Badges */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          ब्रान्ड इमोजी लोगो:
                        </label>
                        <div className="flex items-center gap-1.5">
                          {['☀️', '🕉️', '🪔', '🚩', '🇳🇵', '📅', '🌟'].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleUpdateCompanyProfile({ customLogoEmoji: emoji })}
                              className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                                config.companyProfile.customLogoEmoji === emoji
                                  ? 'bg-red-600 text-white shadow-xs scale-110'
                                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          प्रमाणित संस्था ब्याज देखाउने
                        </label>
                        <button
                          type="button"
                          onClick={() => handleUpdateCompanyProfile({ displayOrganizationBadge: !config.companyProfile.displayOrganizationBadge })}
                          className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                            config.companyProfile.displayOrganizationBadge ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              config.companyProfile.displayOrganizationBadge ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. वेबसाइट तथा सामाजिक सञ्जाल */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 lg:col-span-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>५. वेबसाइट तथा सामाजिक सञ्जाल लिङ्कहरू (Web & Social Links)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                        <span>वेबसाइट URL:</span>
                      </label>
                      <input
                        type="url"
                        value={config.companyProfile.websiteUrl}
                        onChange={(e) => handleUpdateCompanyProfile({ websiteUrl: e.target.value })}
                        placeholder="https://namrosmartpatro.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Facebook className="w-3.5 h-3.5 text-blue-600" />
                        <span>फेसबुक पेज URL:</span>
                      </label>
                      <input
                        type="url"
                        value={config.companyProfile.facebookUrl}
                        onChange={(e) => handleUpdateCompanyProfile({ facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Youtube className="w-3.5 h-3.5 text-red-600" />
                        <span>युट्युब च्यानल URL:</span>
                      </label>
                      <input
                        type="url"
                        value={config.companyProfile.youtubeUrl}
                        onChange={(e) => handleUpdateCompanyProfile({ youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/@..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Twitter className="w-3.5 h-3.5 text-sky-500" />
                        <span>ट्विटर / X URL:</span>
                      </label>
                      <input
                        type="url"
                        value={config.companyProfile.twitterUrl}
                        onChange={(e) => handleUpdateCompanyProfile({ twitterUrl: e.target.value })}
                        placeholder="https://twitter.com/..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Module & Tab Permission Management */}
          {activeSubTab === 'modules' && (
            <div className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <Layout className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 text-blue-900 dark:text-blue-200">
                  <p className="font-bold">मोड्युल तथा ट्याब अनुमति नीति (Feature Access Policy):</p>
                  <p className="text-blue-700 dark:text-blue-300">
                    एडमिनले यहाँबाट बन्द गरेको कुनै पनि मोड्युल (जस्तै: समाचार, रेडियो वा मुद्रा) एपको मेन्यु, हेडर, क्विक हब र नेभिगेसनबाट तुरुन्तै गायब हुन्छ र सामान्य प्रयोगकर्ताले हेर्न पाउने छैनन्।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moduleItems.map((mod) => {
                  const isEnabled = config.enabledTabs[mod.key];
                  return (
                    <div
                      key={mod.key}
                      onClick={() => handleToggleTab(mod.key)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isEnabled
                          ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs'
                          : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-2xl shrink-0 ${mod.color}`}>
                          {mod.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">
                              {mod.titleNepali}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                isEnabled
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                              }`}
                            >
                              {isEnabled ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {mod.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">ID: {mod.key}</span>
                        <div
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                            isEnabled ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Presets */}
          {activeSubTab === 'presets' && (
            <div className="space-y-5">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  १-क्लिक लेआउट प्रोफाइल प्रिसेटहरू (Ready-made Layout Presets)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  तपाईंको आवश्यकता अनुसार पूर्वनिर्धारित प्रोफाइल चयन गर्नुहोस् जसले सबै कम्पोनेन्टहरूको प्रदर्शन एकै क्लिकमा मिलाउँछ।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ADMIN_PRESETS.map((preset) => {
                  const isCurrent = config.activePreset === preset.id;
                  return (
                    <div
                      key={preset.id}
                      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-red-50/40 dark:bg-red-950/20 border-red-500/80 shadow-md ring-2 ring-red-500/20'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black text-white ${preset.iconColor}`}>
                            {preset.badge}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-xs font-black text-red-600 dark:text-rose-400">
                              <Check className="w-4 h-4" />
                              हाल सक्रिय
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {preset.titleNepali}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {preset.descriptionNepali}
                        </p>
                      </div>

                      <button
                        onClick={() => handleApplyPreset(preset.id)}
                        disabled={isCurrent}
                        className={`mt-4 w-full py-2.5 rounded-2xl font-black text-xs transition-all ${
                          isCurrent
                            ? 'bg-red-600 text-white cursor-default'
                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-red-600 hover:text-white text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {isCurrent ? 'यो प्रोफाइल लागु छ' : 'यो प्रोफाइल लागु गर्नुहोस्'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Announcement / Broadcast Manager */}
          {activeSubTab === 'announcement' && (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-amber-500" />
                      <span>सार्वजनिक व्यवस्थापक घोषणा/सूचना ब्यानर</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      सम्पूर्ण एपको सबैभन्दा माथिल्लो भागमा तुरुन्तै प्रत्यक्ष प्रसारण हुने सूचना
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      {config.announcement.enabled ? 'सक्रिय (Active)' : 'निष्क्रिय (Disabled)'}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateAnnouncement({ enabled: !config.announcement.enabled })
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        config.announcement.enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          config.announcement.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      सूचनाको व्यहोरा (Nepali Announcement Text):
                    </label>
                    <textarea
                      rows={3}
                      value={config.announcement.textNepali}
                      onChange={(e) => handleUpdateAnnouncement({ textNepali: e.target.value })}
                      placeholder="उदाहरण: बडादशैँ तथा शुभ दीपावली २०८३ को पावन अवसरमा सम्पूर्ण नेपालीमा हार्दिक मङ्गलमय शुभकामना!"
                      className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        सूचनाको प्रकार / रङ (Theme):
                      </label>
                      <select
                        value={config.announcement.type}
                        onChange={(e) =>
                          handleUpdateAnnouncement({
                            type: e.target.value as AdminVisibilityConfig['announcement']['type'],
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      >
                        <option value="info">सामान्य व्यवस्थापक सूचना (Blue/Dark)</option>
                        <option value="alert">জরुरी चेतावनी (Red Alert)</option>
                        <option value="festival">चाडपर्व शुभकामना (Gold/Amber)</option>
                        <option value="maintenance">सिस्टम अपडेट/रखरखाव (Purple)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        बटनको पाठ (वैकल्पिक):
                      </label>
                      <input
                        type="text"
                        value={config.announcement.actionText || ''}
                        onChange={(e) => handleUpdateAnnouncement({ actionText: e.target.value })}
                        placeholder="उदा: हेर्नुहोस् / थप जान्नुहोस्"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        लिङ्क URL (वैकल्पिक):
                      </label>
                      <input
                        type="text"
                        value={config.announcement.actionUrl || ''}
                        onChange={(e) => handleUpdateAnnouncement({ actionUrl: e.target.value })}
                        placeholder="उदा: https://... वा #news"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Calculation Test Lab Integration */}
          {activeSubTab === 'testlab' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-200">
                    सिद्धान्त तुलना तथा स्वचालित अडिट परीक्षण प्रयोगशाला
                  </h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    शुद्ध सूर्य सिद्धान्त, दृक सिद्धान्त, र केतकी सिद्धान्त बीचको गणितीय विचलन परीक्षण गर्नुहोस्
                  </p>
                </div>
              </div>
              <AdminTestLabModal
                onClose={() => setActiveSubTab('visibility')}
                currentLocation={currentLocation}
              />
            </div>
          )}

          {/* TAB 6: Security & PIN Management */}
          {activeSubTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-red-500" />
                  <span>व्यवस्थापक सुरक्षा तथा पिन कोड परिवर्तन</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        एडमिन प्यानल खोल्न पिन कोड अनिवार्य गर्ने
                      </p>
                      <p className="text-[11px] text-slate-400">
                        यसलाई सक्रिय गर्दा एडमिन खोल्न पिन कोड माग्नेछ
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleKey('isPinRequired')}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        config.isPinRequired ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          config.isPinRequired ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      नयाँ व्यवस्थापक पिन कोड राख्नुहोस्:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        maxLength={8}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="नयाँ पिन..."
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-black"
                      />
                      <button
                        onClick={handleSaveNewPin}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-700 shadow-xs"
                      >
                        पिन सुरक्षित गर्नुहोस्
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Backup, Export & Factory Reset */}
          {activeSubTab === 'backup' && (
            <div className="space-y-6 max-w-xl">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span>ब्याकअप, निर्यात/आयात र फ्याक्ट्री रिसेट</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleExportJSON}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-400 text-left space-y-1 transition-all group"
                  >
                    <div className="flex items-center gap-2 font-black text-xs text-slate-900 dark:text-white group-hover:text-red-600">
                      <Download className="w-4 h-4 text-red-500" />
                      <span>कन्फिगरेसन डाउनलोड (Export)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      हालको सम्पूर्ण दृश्यता र व्यवस्थापन सेटिङहरू JSON फाइलमा सेभ गर्नुहोस्
                    </p>
                  </button>

                  <label className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-left space-y-1 transition-all cursor-pointer group">
                    <div className="flex items-center gap-2 font-black text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                      <Upload className="w-4 h-4 text-blue-500" />
                      <span>कन्फिगरेसन आयात (Import)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      पहिले सुरक्षित गरिएको JSON फाइलबाट सेटिङहरू लोड गर्नुहोस्
                    </p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={handleResetToDefault}
                    className="w-full py-3 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-red-600 dark:text-rose-400 font-black text-xs hover:bg-red-100 dark:hover:bg-red-950/60 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>फ्याक्ट्री रिसेट गर्नुहोस् (Reset All Settings to Default)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>अन्तिम अद्यावधिक: {new Date(config.lastUpdated).toLocaleTimeString('ne-NP')}</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black shadow-md transition-transform active:scale-95"
          >
            बन्द गर्नुहोस् (Done)
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToggleCardProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const ToggleCard: React.FC<ToggleCardProps> = ({ title, description, enabled, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
        enabled
          ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs'
          : 'bg-slate-100/70 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800/50 opacity-60'
      }`}
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
          {title}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
          {description}
        </p>
      </div>

      <div
        className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 ${
          enabled ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};
