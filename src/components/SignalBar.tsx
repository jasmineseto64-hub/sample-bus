import React, { useState, useEffect } from 'react';
import { transitAudio } from '../utils/audio';

interface SignalBarProps {
  currentAreaName: string;
}

export const SignalBar: React.FC<SignalBarProps> = ({ currentAreaName }) => {
  const [latency, setLatency] = useState(280);
  const [isAudioMuted, setIsAudioMuted] = useState(transitAudio.getMuted());

  // Simulate realistic network jitter for Singapore LTA DataMall feed
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(260 + Math.floor(Math.random() * 35));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    transitAudio.setMuted(nextState);
    if (!nextState) {
      transitAudio.playArrivalChime();
    }
  };

  return (
    <div className="w-full bg-[#e6e8ef] px-4 sm:px-8 py-1.5 border-b border-[#DFE1E6]">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#4f434c]">
        {/* Left: Feed status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00875A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00875A]"></span>
          </span>
          <span className="font-semibold text-[#191c21]">LTA DataMall Real-time Feed Connected</span>
          <span className="text-[#81737c]">•</span>
          <span className="font-mono-nums text-[11px] uppercase tracking-wider text-[#9e4300] font-semibold">
            Latency: {latency}ms
          </span>
        </div>

        {/* Right: GPS fix & sound controls */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#40073e]">satellite_alt</span>
            <span>GPS Fix: {currentAreaName.split('/')[0].trim()} (Accuracy ±4m)</span>
          </span>
          <button
            onClick={toggleSound}
            className="flex items-center gap-1 text-[#191c21] hover:text-[#40073e] transition-colors cursor-pointer select-none font-medium"
            title="Toggle arrival audio notifications"
          >
            <span className="material-symbols-outlined text-[16px] text-[#9e4300]">
              {isAudioMuted ? 'volume_off' : 'volume_up'}
            </span>
            <span>Audio Chimes: {isAudioMuted ? 'MUTE' : 'ON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
