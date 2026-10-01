import React, { useState } from 'react';
import { transitAudio } from '../utils/audio';

export type ActiveTab = 'bus-arrival' | 'route-directory' | 'fares-travel-guide' | 'service-alerts';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentArea: string;
  onSelectArea: (area: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenFeedback: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  currentArea,
  onSelectArea,
  favoritesCount,
  onOpenFavorites,
  onOpenFeedback,
  onOpenHelp,
}) => {
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'ZH' | 'MS' | 'TA'>('EN');

  const areas = [
    'Dhoby Ghaut / Orchard Area, Singapore',
    'Somerset & Orchard Corridor',
    'Bras Basah & Bugis Junction',
    'Chinatown & Clarke Quay',
    'HarbourFront & VivoCity',
    'Tampines Central Interchange',
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(24,27,32,0.06)] border-b border-[#DFE1E6]">
      {/* Top Telemetry & Civic Header Strip */}
      <div className="bg-[#f2f3fa] px-4 sm:px-8 py-1 hidden lg:block border-b border-[#e1e2e9]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#4f434c]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-semibold text-[#191c21]">
              <span className="material-symbols-outlined text-[16px] text-[#00875A]">check_circle</span>
              All Bus Services Normal
            </span>
            <div className="relative">
              <button
                onClick={() => setShowAreaDropdown(!showAreaDropdown)}
                className="flex items-center gap-1 text-[#4f434c] hover:text-[#191c21] transition-colors cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[16px] text-[#9e4300]">location_on</span>
                <span>{currentArea}</span>
                <span className="material-symbols-outlined text-[14px] text-[#81737c] group-hover:text-[#191c21]">expand_more</span>
              </button>
              {showAreaDropdown && (
                <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-[#DFE1E6] py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#81737c] border-b border-[#DFE1E6]">
                    Select Transit Precinct
                  </div>
                  {areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        onSelectArea(area);
                        setShowAreaDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f2f3fa] transition-colors flex items-center justify-between ${
                        area === currentArea ? 'text-[#40073e] font-bold bg-[#ffd7f5]/30' : 'text-[#191c21]'
                      }`}
                    >
                      <span>{area}</span>
                      {area === currentArea && (
                        <span className="material-symbols-outlined text-[14px] text-[#40073e]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:18002872727" className="hover:text-[#191c21] transition-colors">
              Emergency Hotline: <strong className="font-semibold text-[#191c21]">1800-287-2727</strong>
            </a>
            <span className="text-[#d3c2cc]">|</span>
            <button
              onClick={onOpenFeedback}
              className="hover:text-[#191c21] transition-colors cursor-pointer"
            >
              Feedback
            </button>
            <span className="text-[#d3c2cc]">|</span>
            <button
              onClick={onOpenHelp}
              className="hover:text-[#191c21] transition-colors cursor-pointer"
            >
              Search Help
            </button>
            <span className="text-[#d3c2cc]">|</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'EN' | 'ZH' | 'MS' | 'TA')}
              className="bg-transparent font-medium cursor-pointer text-[#191c21] focus:outline-none"
              aria-label="Language selection"
            >
              <option value="EN">English (SG)</option>
              <option value="ZH">中文 (华语)</option>
              <option value="MS">Melayu</option>
              <option value="TA">தமிழ்</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main SBS Transit Branding & Tab Navigation Bar */}
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Lockup */}
        <div
          onClick={() => {
            transitAudio.playClickSound();
            onTabChange('bus-arrival');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Logo with clean fallback */}
          <div className="flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1VP_1VimwvmvL9H88lDDEDrw-DlMcC7iszAFN4VAYKnDKjTyF8rBTnlL5-9Bd6H7TpJLqT8NNeImcBi7H3qwCrZj1Vrkt9jrKIMpfKlSm6jPAcFNwtpW4H6IkpAHNfwQ3tT_jEvtqA6uutkBn4SMqIDIV-_Lb7dhMhYQv5IsoRcSVNoNwTN50mSCtLf0eE2Ty7u9819S7kDdS3D1SV0dAVxdIm0nFt7PSMqVSE6j31cGJxO-4truXhGINo"
              alt="SBS Transit Live Bus Tracker Logo"
              className="h-8 w-auto object-contain hidden sm:block"
              onError={(e) => {
                // if fails, graceful hide
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Custom SVG logo backup matching Image 1 */}
            <div className="w-9 h-9 rounded-xl bg-[#40073e] flex items-center justify-center text-white shadow-sm shrink-0 sm:hidden">
              <span className="material-symbols-outlined text-[22px]">directions_bus</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg sm:text-xl font-extrabold text-[#40073e] leading-tight tracking-tight">
                SBS Transit
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#9e4300] font-bold leading-none">
                Live Bus Arrival Portal
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => {
              transitAudio.playClickSound();
              onTabChange('bus-arrival');
            }}
            className={`transition-all rounded-lg px-3.5 py-1.5 text-sm font-bold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bus-arrival'
                ? 'bg-[#592055] text-white shadow-sm ring-1 ring-[#592055]'
                : 'text-[#4f434c] hover:text-[#191c21] hover:bg-[#f2f3fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">directions_bus</span>
            <span>Bus Arrival</span>
          </button>

          <button
            onClick={() => {
              transitAudio.playClickSound();
              onTabChange('route-directory');
            }}
            className={`transition-all rounded-lg px-3.5 py-1.5 text-sm font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'route-directory'
                ? 'bg-[#592055] text-white shadow-sm ring-1 ring-[#592055]'
                : 'text-[#4f434c] hover:text-[#191c21] hover:bg-[#f2f3fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">map</span>
            <span>Route Directory</span>
          </button>

          <button
            onClick={() => {
              transitAudio.playClickSound();
              onTabChange('fares-travel-guide');
            }}
            className={`transition-all rounded-lg px-3.5 py-1.5 text-sm font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'fares-travel-guide'
                ? 'bg-[#592055] text-white shadow-sm ring-1 ring-[#592055]'
                : 'text-[#4f434c] hover:text-[#191c21] hover:bg-[#f2f3fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">payments</span>
            <span>Fares &amp; Travel Guide</span>
          </button>

          <button
            onClick={() => {
              transitAudio.playClickSound();
              onTabChange('service-alerts');
            }}
            className={`transition-all rounded-lg px-3.5 py-1.5 text-sm font-semibold flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === 'service-alerts'
                ? 'bg-[#592055] text-white shadow-sm ring-1 ring-[#592055]'
                : 'text-[#4f434c] hover:text-[#191c21] hover:bg-[#f2f3fa]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px] text-[#9e4300]">warning</span>
            <span>Service Alerts</span>
            <span className="w-2 h-2 rounded-full bg-[#DE350B] animate-pulse"></span>
          </button>
        </nav>

        {/* Right Action Icons: Favorites & Commuter Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenFavorites}
            className="p-2 text-[#4f434c] hover:text-[#40073e] hover:bg-[#f2f3fa] rounded-lg transition-colors cursor-pointer relative"
            title="Saved Bus Stops & Routes"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9e4300] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenFavorites}
            className="w-8 h-8 rounded-full bg-[#40073e] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-sm text-white"
            title="Commuter Account & Preferences"
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="md:hidden flex items-center border-t border-[#DFE1E6] bg-white px-2 py-1 overflow-x-auto gap-1">
        <button
          onClick={() => {
            transitAudio.playClickSound();
            onTabChange('bus-arrival');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-xs font-bold text-center whitespace-nowrap ${
            activeTab === 'bus-arrival' ? 'bg-[#592055] text-white' : 'text-[#4f434c]'
          }`}
        >
          Arrivals
        </button>
        <button
          onClick={() => {
            transitAudio.playClickSound();
            onTabChange('route-directory');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold text-center whitespace-nowrap ${
            activeTab === 'route-directory' ? 'bg-[#592055] text-white' : 'text-[#4f434c]'
          }`}
        >
          Routes
        </button>
        <button
          onClick={() => {
            transitAudio.playClickSound();
            onTabChange('fares-travel-guide');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold text-center whitespace-nowrap ${
            activeTab === 'fares-travel-guide' ? 'bg-[#592055] text-white' : 'text-[#4f434c]'
          }`}
        >
          Fares
        </button>
        <button
          onClick={() => {
            transitAudio.playClickSound();
            onTabChange('service-alerts');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold text-center whitespace-nowrap flex items-center justify-center gap-1 ${
            activeTab === 'service-alerts' ? 'bg-[#592055] text-white' : 'text-[#4f434c]'
          }`}
        >
          <span>Alerts</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#DE350B]"></span>
        </button>
      </div>
    </header>
  );
};
