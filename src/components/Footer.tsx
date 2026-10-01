import React from 'react';

interface FooterProps {
  onSelectTab: (tab: 'bus-arrival' | 'route-directory' | 'fares-travel-guide' | 'service-alerts') => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenFeedback }) => {
  return (
    <footer className="w-full bg-[#f2f3fa] mt-10 border-t border-[#DFE1E6] shadow-[0_1px_8px_rgba(24,27,32,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display text-lg font-bold text-[#40073e]">
                SBS Transit
              </span>
            </div>
            <p className="text-xs text-[#4f434c] leading-relaxed">
              Singapore's premier public transport operator delivering reliable, safe, and commuter-centric bus and rail services across the nation.
            </p>
          </div>

          {/* Commuter Services */}
          <div>
            <div className="font-display text-sm font-bold text-[#191c21] mb-2">
              Commuter Services
            </div>
            <ul className="space-y-1.5 text-xs text-[#4f434c]">
              <li>
                <button
                  onClick={() => onSelectTab('bus-arrival')}
                  className="hover:text-[#191c21] transition-colors text-left"
                >
                  Next Bus Predictions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('route-directory')}
                  className="hover:text-[#191c21] transition-colors text-left"
                >
                  First &amp; Last Bus Timings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('route-directory')}
                  className="hover:text-[#191c21] transition-colors text-left"
                >
                  Interchange Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('fares-travel-guide')}
                  className="hover:text-[#191c21] transition-colors text-left"
                >
                  Wheelchair Accessible Buses (WAB)
                </button>
              </li>
            </ul>
          </div>

          {/* Fares & Concessions */}
          <div>
            <div className="font-display text-sm font-bold text-[#191c21] mb-2">
              Fares &amp; Concessions
            </div>
            <ul className="space-y-1.5 text-xs text-[#4f434c]">
              <li>
                <button
                  onClick={() => onSelectTab('fares-travel-guide')}
                  className="hover:text-[#191c21] transition-colors text-left"
                >
                  Distance Fares Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('fares-travel-guide')}
                  className="hover:text-[#191c21] transition-colors text-left"
                >
                  SimplyGo Transit Ticketing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('fares-travel-guide')}
                  className="hover:text-[#191c21] transition-colors text-left"
                >
                  Student &amp; Senior Concessions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFeedback}
                  className="hover:text-[#191c21] transition-colors text-left"
                >
                  Refunds &amp; Claims Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Public Assistance */}
          <div>
            <div className="font-display text-sm font-bold text-[#191c21] mb-2">
              Public Assistance
            </div>
            <div className="text-xs text-[#4f434c] space-y-1.5 leading-relaxed">
              <p>
                <strong className="text-[#191c21]">Toll-Free Hotline:</strong>{' '}
                <a href="tel:18002872727" className="hover:underline">1800-287-2727</a>
              </p>
              <p>
                <strong className="text-[#191c21]">Operating Hours:</strong> 7:30am - 8:00pm Daily
              </p>
              <p>
                <strong className="text-[#191c21]">Lost &amp; Found:</strong>{' '}
                <a href="tel:+6563837211" className="hover:underline">+65 6383 7211</a>
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Integration Note */}
        <div className="pt-4 border-t border-[#d3c2cc]/60 flex flex-col md:flex-row items-center justify-between text-[#81737c] text-xs gap-3">
          <p>© 2025 SBS Transit Ltd. Singapore Land Transport Authority (LTA) Partner. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#191c21] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#191c21] cursor-pointer">Terms of Use</span>
            <span className="text-[#00875A] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]"></span>
              LTA DataMall Integration Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
