import React from 'react';
import { BUS_STOPS_MAP } from '../data/transitData';
import { transitAudio } from '../utils/audio';

interface NearbyStopsProps {
  currentStopCode: string;
  onSelectStop: (stopCode: string) => void;
}

export const NearbyStops: React.FC<NearbyStopsProps> = ({
  currentStopCode,
  onSelectStop,
}) => {
  const nearbyCodes = ['09038', '08121', '09079'];

  const handleSelect = (code: string) => {
    transitAudio.playClickSound();
    onSelectStop(code);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#DFE1E6] flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1 border-b border-[#f2f3fa]">
        <h2 className="font-display text-base font-bold text-[#191c21]">
          Other Stops Near You
        </h2>
        <span className="text-[11px] text-[#81737c] font-bold uppercase tracking-wider">
          &lt; 400m Radius
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {nearbyCodes.map((code) => {
          const stop = BUS_STOPS_MAP[code];
          if (!stop) return null;
          const isSelected = stop.code === currentStopCode;

          return (
            <div
              key={code}
              onClick={() => handleSelect(code)}
              className={`p-3 rounded-lg transition-all flex items-center justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-[#ffd7f5]/25 border border-[#40073e]'
                  : 'bg-[#f2f3fa] hover:bg-[#ecedf5] border border-transparent'
              }`}
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-[#191c21] group-hover:text-[#40073e] transition-colors truncate">
                    {stop.name}
                  </span>
                  <span className="font-mono-nums text-[10px] text-[#81737c] bg-[#e1e2e9] px-1 rounded font-semibold">
                    {stop.code}
                  </span>
                </div>
                <span className="text-xs text-[#81737c] mt-0.5 truncate">
                  {stop.distanceMetres}m away • Services: {stop.services.slice(0, 5).join(', ')}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#81737c] group-hover:text-[#40073e] text-[20px] transition-transform group-hover:translate-x-1 shrink-0 ml-2">
                chevron_right
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
