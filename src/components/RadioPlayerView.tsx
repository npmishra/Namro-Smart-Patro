import React, { useState, useRef, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RadioTower,
  ExternalLink,
  Music2,
  Headphones,
} from 'lucide-react';
import { RADIO_STATIONS, RadioStation } from '../engines/radioEngine';

export const RadioPlayerView: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<RadioStation>(RADIO_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSelectStation = (st: RadioStation) => {
    setSelectedStation(st);
    setHasError(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = st.streamUrl;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setHasError(true);
        });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setHasError(false);
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setHasError(true);
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={selectedStation.streamUrl}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300">
              नेपाली प्रत्यक्ष रेडियो (Live Nepali FM Radio)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Mukta',sans-serif]">
            नेपालका प्रमुख एफएम रेडियोहरूको प्रत्यक्ष प्रसारण
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            रेडियो नेपाल, कान्तिपुर, उज्यालो ९०, बीबीसी नेपाली तथा लोकप्रिय एफएम स्टेशनहरू
          </p>
        </div>
      </div>

      {/* Active Station Player Console */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Ambient Wave FX */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
              <RadioTower className={`w-10 h-10 ${isPlaying ? 'animate-pulse text-amber-300' : ''}`} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/80 text-white text-xs font-bold mb-2">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-white animate-ping' : 'bg-white/60'}`} />
                {isPlaying ? 'प्रत्यक्ष प्रसारण (LIVE ON AIR)' : 'पज गरिएको (PAUSED)'}
              </div>

              <h4 className="text-2xl sm:text-3xl font-extrabold font-['Mukta',sans-serif]">
                {selectedStation.nameNepali}
              </h4>
              <p className="text-xs sm:text-sm text-purple-200 mt-0.5">
                {selectedStation.frequency} • {selectedStation.locationNepali}
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white text-indigo-900 hover:scale-105 transition-transform flex items-center justify-center shadow-xl font-bold"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-indigo-900" /> : <Play className="w-7 h-7 fill-indigo-900 ml-1" />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10">
              <button onClick={() => setIsMuted(!isMuted)} className="hover:text-amber-300 transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {hasError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs text-center">
            स्टेशन प्रसारण लोड हुन सकेन वा इन्टरनेट सुस्त हुन सक्छ। कृपया पुनः प्ले थिच्नुहोस् वा अर्को स्टेशन छान्नुहोस्।
          </div>
        )}
      </div>

      {/* Station List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RADIO_STATIONS.map((st) => {
          const isCurrent = selectedStation.id === st.id;
          return (
            <div
              key={st.id}
              onClick={() => handleSelectStation(st)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isCurrent
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-700 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-xs"
                  style={{ backgroundColor: st.logoColor }}
                >
                  <Headphones className="w-6 h-6" />
                </div>

                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white font-['Mukta',sans-serif]">
                    {st.nameNepali.split('(')[0]}
                  </h5>
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold font-mono">
                    {st.frequency}
                  </div>
                  <div className="text-[10px] text-slate-400">{st.locationNepali}</div>
                </div>
              </div>

              <div>
                <button
                  className={`p-2 rounded-full ${
                    isCurrent && isPlaying
                      ? 'bg-purple-600 text-white animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isCurrent && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
