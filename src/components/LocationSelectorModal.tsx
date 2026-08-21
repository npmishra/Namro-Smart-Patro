import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  MapPin,
  Compass,
  Navigation,
  Check,
  Globe,
  Mountain,
  Clock,
  Sparkles,
} from 'lucide-react';
import { LocationData } from '../types';
import {
  NEPAL_LOCATIONS,
  PROVINCES_NEPAL,
  findNearestLocation,
} from '../engines/locationEngine';
import { toNepaliDigits } from '../engines/calendarEngine';

interface LocationSelectorModalProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onClose: () => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  currentLocation,
  onSelectLocation,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Filter locations based on province tab and search query
  const filteredLocations = useMemo(() => {
    return NEPAL_LOCATIONS.filter((loc) => {
      // Province match
      if (selectedProvince !== 'all') {
        const provObj = PROVINCES_NEPAL.find((p) => p.id === selectedProvince);
        if (provObj) {
          if (selectedProvince === 'intl') {
            if (loc.province !== 'अन्तर्राष्ट्रिय') return false;
          } else {
            if (!loc.province.includes(provObj.nameNepali.replace(' प्रदेश', ''))) {
              return false;
            }
          }
        }
      }

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        loc.nameNepali.toLowerCase().includes(q) ||
        loc.nameEnglish.toLowerCase().includes(q) ||
        loc.province.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedProvince]);

  // GPS Auto-detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsMessage('तपाईंको ब्राउजरमा GPS सुविधा उपलब्ध छैन।');
      return;
    }

    setIsDetectingGPS(true);
    setGpsMessage('तपाईंको GPS स्थान पत्ता लगाउँदैछ...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGPS(false);
        const { latitude, longitude } = pos.coords;
        const nearest = findNearestLocation(latitude, longitude);
        setGpsMessage(`नजिकको स्थान पत्ता लाग्यो: ${nearest.nameNepali}`);
        setTimeout(() => {
          onSelectLocation(nearest);
          onClose();
        }, 600);
      },
      (err) => {
        setIsDetectingGPS(false);
        setGpsMessage('स्थान अनुमति पाउन सकिएन। कृपया सूचीबाट स्थान छान्नुहोस्।');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div
      id="location-selector-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                नेपालका ७७ जिल्ला तथा प्रमुख शहरहरू
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-1 font-['Mukta',sans-serif]">
              स्थान छनोट गर्नुहोस् (Select Location)
            </h3>
            <p className="text-xs text-rose-100 mt-0.5">
              सूर्योदय, सूर्यास्त तथा पञ्चाङ्ग गणना तपाईंको आफ्नै जिल्ला/स्थान अनुसार ठ्याक्कै मिलान हुनेछ।
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
            title="बन्द गर्नुहोस्"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & GPS Auto-detect Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="जिल्ला, शहर वा प्रदेश खोज्नुहोस् (उदा: पोखरा, झापा, धनगढी, इलाम)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  मेटाउनुहोस्
                </button>
              )}
            </div>

            {/* GPS Button */}
            <button
              onClick={handleDetectGPS}
              disabled={isDetectingGPS}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs disabled:opacity-50"
              title="GPS बाट स्थान पत्ता लगाउनुहोस्"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingGPS ? 'animate-spin' : ''}`} />
              <span>{isDetectingGPS ? 'पत्ता लगाउँदै...' : 'GPS स्थान'}</span>
            </button>
          </div>

          {/* GPS feedback message */}
          {gpsMessage && (
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{gpsMessage}</span>
            </div>
          )}

          {/* Province Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {PROVINCES_NEPAL.map((prov) => {
              const isSelected = selectedProvince === prov.id;
              return (
                <button
                  key={prov.id}
                  onClick={() => setSelectedProvince(prov.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {prov.nameNepali}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locations List Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 max-h-[55vh] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>जम्मा स्थानहरू: {toNepaliDigits(filteredLocations.length)} वटा भेटिए</span>
            <span>हालको स्थान: <strong className="text-red-600 dark:text-rose-400">{currentLocation.nameNepali}</strong></span>
          </div>

          {filteredLocations.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Compass className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-bold">कुनै पनि स्थान भेटिएन</p>
              <p className="text-xs mt-1">कृपया हिज्जे जाँच गर्नुहोस् वा प्रदेश परिवर्तन गर्नुहोस्।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredLocations.map((loc) => {
                const isCurrent = currentLocation.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-100 ring-2 ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-red-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-red-600' : 'text-slate-400'}`} />
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {loc.nameNepali}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {loc.nameEnglish}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                          {loc.province}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Mountain className="w-3 h-3" />
                          {toNepaliDigits(loc.elevationMeters)}m
                        </span>
                        <span>•</span>
                        <span>
                          {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>नेपालका सबै जिल्लाहरू तथा प्रवासी नेपाली समुदाय समेटिएको छ</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 transition-colors"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
