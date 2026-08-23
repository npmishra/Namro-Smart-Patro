import React, { useState, useRef, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { RADIO_STATIONS, RadioStation } from '../engines/radioEngine';

interface FloatingRadioPlayerProps {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectStation: (station: RadioStation) => void;
  onClosePlayer: () => void;
  onOpenFullRadioView: () => void;
}

export const FloatingRadioPlayer: React.FC<FloatingRadioPlayerProps> = ({
  currentStation,
  isPlaying,
  onTogglePlay,
  onSelectStation,
  onClosePlayer,
  onOpenFullRadioView,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showStationList, setShowStationList] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeStation = currentStation || RADIO_STATIONS[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!currentStation && !isPlaying) {
    return null;
  }

  return (
    <aside
      aria-label="Floating Radio Player"
      className={`fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-40 transition-all duration-300 font-['Mukta',sans-serif] ${
        isMinimized ? 'w-auto' : 'w-[94vw] sm:w-96'
      }`}
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl shadow-2xl border border-slate-700/80 p-3 sm:p-4 overflow-hidden relative">
        {/* Visual equalizer animation background when playing */}
        {isPlaying && !isMinimized && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-purple-600/10 to-amber-600/10 pointer-events-none" />
        )}

        {isMinimized ? (
          /* Minimized Compact Capsule */
          <div className="flex items-center gap-3 pr-1">
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? 'रोक्नुहोस् (Pause)' : 'बजाउनुहोस् (Play)'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div
              onClick={() => setIsMinimized(false)}
              className="cursor-pointer flex items-center gap-2"
            >
              <div className="text-xs">
                <div className="font-bold truncate max-w-[140px] text-slate-200">
                  {activeStation.nameNepali.split(' ')[0]}
                </div>
                <div className="text-[10px] text-red-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  {activeStation.frequency}
                </div>
              </div>
              <ChevronUp className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ) : (
          /* Full Floating Player Body */
          <div className="space-y-3 relative z-10">
            {/* Header / Controls */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: activeStation.logoColor }}
                  />
                  {isPlaying && (
                    <span
                      className="w-3 h-3 rounded-full absolute inset-0 animate-ping opacity-75"
                      style={{ backgroundColor: activeStation.logoColor }}
                    />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-300">
                  प्रत्यक्ष नेपाली रेडियो (Live FM)
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenFullRadioView}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="सबै स्टेशनहरू हेर्नुहोस्"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="सानो बनाउनुहोस् (Minimize)"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClosePlayer}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="बन्द गर्नुहोस् (Close)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Station Info & Playback */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setShowStationList(!showStationList)}
                  className="text-left w-full group cursor-pointer"
                >
                  <div className="text-sm font-black text-white truncate group-hover:text-red-400 transition-colors flex items-center gap-1.5">
                    <span>{activeStation.nameNepali}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="text-amber-400 font-bold">{activeStation.frequency}</span>
                    <span>•</span>
                    <span className="truncate">{activeStation.locationNepali}</span>
                  </div>
                </button>
              </div>

              {/* Big Play/Pause Button */}
              <button
                onClick={onTogglePlay}
                className="w-11 h-11 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-900/40 transition-transform active:scale-95 shrink-0 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>

            {/* Sound Equalizer Bar Simulation */}
            {isPlaying && (
              <div className="flex items-center justify-center gap-1 h-3 py-0.5">
                {[40, 80, 60, 100, 70, 90, 50, 85, 95, 65, 45, 75, 90].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-red-500 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2 pt-1 text-slate-400 text-xs">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full accent-red-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Quick Station Dropdown Overlay */}
            {showStationList && (
              <div className="bg-slate-800 rounded-2xl p-2 border border-slate-700 max-h-48 overflow-y-auto space-y-1 mt-2">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  स्टेशन रोज्नुहोस् (Select Station)
                </div>
                {RADIO_STATIONS.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => {
                      onSelectStation(station);
                      setShowStationList(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      station.id === activeStation.id
                        ? 'bg-red-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{station.nameNepali}</span>
                    <span className="text-[10px] opacity-80 shrink-0 ml-2 font-mono">
                      {station.frequency}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
