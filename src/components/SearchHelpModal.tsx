import React from 'react';

interface SearchHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchHelpModal: React.FC<SearchHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFE1E6] flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#40073e] text-[24px]">help</span>
            <h2 className="font-display text-lg font-bold text-[#191c21]">
              Singapore Bus Wayfinding Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#81737c] hover:text-[#191c21] hover:bg-[#f2f3fa] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="text-xs text-[#4f434c] space-y-3 leading-relaxed">
          <div className="bg-[#f2f3fa] p-3 rounded-lg">
            <strong className="text-[#191c21] block mb-1">1. Bus Stop 5-Digit Codes</strong>
            Every bus stop in Singapore has a unique 5-digit numerical code (e.g. <code>09037</code> for Opp Mandarin Gallery, <code>08121</code> for Somerset Station). You can enter either the stop code or the bus service number into the search bar.
          </div>

          <div className="bg-[#f2f3fa] p-3 rounded-lg">
            <strong className="text-[#191c21] block mb-1">2. Understanding Occupancy / Crowd Colors</strong>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong className="text-[#00875A]">Green (Seats Available):</strong> High chance of securing a seat upon boarding.</li>
              <li><strong className="text-[#9e4300]">Amber (Standing Available):</strong> Seating full, ample standing space remaining.</li>
              <li><strong className="text-[#DE350B]">Red (Limited Standing):</strong> Heavily crowded, boarding may be difficult. Subsequent bus is recommended.</li>
            </ul>
          </div>

          <div className="bg-[#f2f3fa] p-3 rounded-lg">
            <strong className="text-[#191c21] block mb-1">3. Direction Switcher</strong>
            Buses in Singapore generally run between two interchange terminals (Direction 1 &amp; Direction 2), or as a loop service. Use the switcher at the top to toggle between travel directions.
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#DFE1E6]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#40073e] text-white rounded-lg font-bold hover:bg-[#592055] transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
