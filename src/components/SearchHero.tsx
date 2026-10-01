import React, { useState, useRef, useEffect } from 'react';
import { POPULAR_SERVICE_NUMBERS, BUS_SERVICES_DATA, BUS_STOPS_MAP } from '../data/transitData';
import { transitAudio } from '../utils/audio';

interface SearchHeroProps {
  selectedServiceNo: string;
  onSelectService: (serviceNo: string) => void;
  direction: 1 | 2;
  onToggleDirection: (dir: 1 | 2) => void;
  currentStopCode: string;
  onSelectStop: (stopCode: string) => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  selectedServiceNo,
  onSelectService,
  direction,
  onToggleDirection,
  currentStopCode,
  onSelectStop,
}) => {
  const [searchValue, setSearchValue] = useState(selectedServiceNo);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const currentService = BUS_SERVICES_DATA[selectedServiceNo] || BUS_SERVICES_DATA['65'];
  const dir1Dest = currentService.direction1.destination;
  const dir2Dest = currentService.direction2.destination;
  const currentStop = BUS_STOPS_MAP[currentStopCode] || BUS_STOPS_MAP['09037'];

  // Keep input in sync with external selection
  useEffect(() => {
    setSearchValue(selectedServiceNo);
  }, [selectedServiceNo]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchValue.trim();
    if (BUS_SERVICES_DATA[query]) {
      transitAudio.playClickSound();
      onSelectService(query);
      setShowSuggestions(false);
    } else {
      // Find matching prefix or default
      const matched = Object.keys(BUS_SERVICES_DATA).find((s) => s.startsWith(query));
      if (matched) {
        transitAudio.playClickSound();
        onSelectService(matched);
        setSearchValue(matched);
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectChip = (serviceNo: string) => {
    transitAudio.playClickSound();
    onSelectService(serviceNo);
    setSearchValue(serviceNo);
  };

  // Filter service suggestions
  const filteredServices = Object.keys(BUS_SERVICES_DATA).filter((key) =>
    key.includes(searchValue.trim())
  );

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#DFE1E6] flex flex-col gap-4 relative overflow-hidden">
      {/* Ambient SBS Purple Hue Accent */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#592055]/10 via-[#ff8843]/10 to-transparent blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 relative z-10">
        {/* Search Input & GPS Nearest Detection Block */}
        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input Unit */}
          <div ref={searchContainerRef} className="relative flex-1">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#40073e] text-[22px]">directions_bus</span>
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Enter bus service no. (e.g. 65, 147, 190, 7)..."
                className="w-full h-13 pl-11 pr-26 rounded-lg bg-[#f2f3fa] text-[#191c21] font-display text-base font-bold uppercase tracking-tight focus:bg-white focus:ring-2 focus:ring-[#40073e] focus:outline-none transition-all placeholder:normal-case placeholder:font-normal placeholder:text-[#81737c] border border-transparent focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue('');
                      setShowSuggestions(false);
                    }}
                    className="p-1.5 hover:bg-[#ecedf5] rounded text-[#81737c] hover:text-[#191c21] transition-colors"
                    title="Clear input"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#40073e] hover:bg-[#592055] text-white px-3.5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Find</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </form>

            {/* Autocomplete dropdown */}
            {showSuggestions && filteredServices.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-[#DFE1E6] py-1 z-50 max-h-56 overflow-y-auto">
                {filteredServices.map((svc) => (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => {
                      handleSelectChip(svc);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#f2f3fa] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-7 rounded bg-[#40073e] text-white font-display font-extrabold text-sm flex items-center justify-center">
                        {svc}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-[#191c21]">
                          To {BUS_SERVICES_DATA[svc].direction1.destination}
                        </span>
                        <span className="text-[11px] text-[#81737c]">
                          {BUS_SERVICES_DATA[svc].direction1.via}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#9e4300] font-bold">
                      {BUS_SERVICES_DATA[svc].category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* GPS Nearest Detection Tag */}
          <button
            onClick={() => {
              transitAudio.playClickSound();
              onSelectStop('09037');
            }}
            className="flex items-center gap-2.5 bg-[#E3FCEF] hover:bg-[#d0f5e1] border border-[#00875A]/20 px-3.5 py-2 rounded-lg shrink-0 transition-colors text-left cursor-pointer group"
            title="Switch to nearest detected GPS stop"
          >
            <span className="material-symbols-outlined text-[#00875A] text-[20px] animate-pulse">my_location</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#00875A] uppercase font-extrabold tracking-wider leading-tight">
                Nearest Detected
              </span>
              <span className="text-xs font-semibold text-[#191c21] leading-tight">
                {currentStop.name} ({currentStop.code}) • {currentStop.distanceMetres}m
              </span>
            </div>
          </button>
        </div>

        {/* Direction Switcher */}
        <div className="flex items-center bg-[#ecedf5] p-1 rounded-lg shrink-0">
          <button
            onClick={() => {
              transitAudio.playClickSound();
              onToggleDirection(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              direction === 1
                ? 'bg-[#40073e] text-white shadow-sm font-bold'
                : 'text-[#4f434c] hover:text-[#191c21]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">east</span>
            <span className="truncate max-w-[140px] sm:max-w-none">To {dir1Dest}</span>
          </button>
          <button
            onClick={() => {
              transitAudio.playClickSound();
              onToggleDirection(2);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              direction === 2
                ? 'bg-[#40073e] text-white shadow-sm font-bold'
                : 'text-[#4f434c] hover:text-[#191c21]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">west</span>
            <span className="truncate max-w-[140px] sm:max-w-none">To {dir2Dest}</span>
          </button>
        </div>
      </div>

      {/* Popular Bus Services Pill Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 relative z-10 border-t border-[#f2f3fa]">
        <span className="text-[11px] uppercase text-[#4f434c] font-bold mr-1.5 flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-[#9e4300]">local_fire_department</span>
          Popular Services:
        </span>
        {POPULAR_SERVICE_NUMBERS.map((serviceNo) => {
          const isActive = serviceNo === selectedServiceNo;
          return (
            <button
              key={serviceNo}
              onClick={() => handleSelectChip(serviceNo)}
              className={`font-display text-[14px] px-3.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#40073e] text-white shadow-sm ring-1 ring-[#40073e]'
                  : 'bg-[#ecedf5] text-[#191c21] hover:bg-[#e1e2e9]'
              }`}
            >
              {serviceNo}
            </button>
          );
        })}
      </div>
    </div>
  );
};
