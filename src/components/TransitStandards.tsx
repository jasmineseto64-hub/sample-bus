import React from 'react';

export const TransitStandards: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#DFE1E6] flex flex-col gap-4">
      <div className="flex items-center justify-between pb-1 border-b border-[#f2f3fa]">
        <h2 className="font-display text-base sm:text-lg font-bold text-[#191c21]">
          LTA Singapore Transit Reference Standards
        </h2>
        <span className="text-[11px] text-[#81737c] uppercase font-bold tracking-wider">
          Official Guidelines
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Legend 1: Crowd Level */}
        <div className="bg-[#f2f3fa] p-4 rounded-xl flex flex-col gap-2">
          <span className="text-[11px] uppercase font-bold text-[#4f434c] tracking-wider">
            Occupancy Indicators
          </span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00875A] shrink-0"></span>
            <span className="text-xs font-semibold text-[#191c21]">Green: Seats Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFAB00] shrink-0"></span>
            <span className="text-xs font-semibold text-[#191c21]">Amber: Standing Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#DE350B] shrink-0"></span>
            <span className="text-xs font-semibold text-[#191c21]">Red: Limited Standing</span>
          </div>
        </div>

        {/* Legend 2: Vehicle Types */}
        <div className="bg-[#f2f3fa] p-4 rounded-xl flex flex-col gap-2">
          <span className="text-[11px] uppercase font-bold text-[#4f434c] tracking-wider">
            Vehicle Classifications
          </span>
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono-nums font-bold text-[#40073e]">DD</span>
            <span className="text-[#191c21] font-medium">Double Decker (~120 pax)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono-nums font-bold text-[#40073e]">SD</span>
            <span className="text-[#191c21] font-medium">Single Decker (~85 pax)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono-nums font-bold text-[#40073e]">BD</span>
            <span className="text-[#191c21] font-medium">Articulated Bendy Bus</span>
          </div>
        </div>

        {/* Legend 3: Accessibility Standards */}
        <div className="bg-[#f2f3fa] p-4 rounded-xl flex flex-col gap-2">
          <span className="text-[11px] uppercase font-bold text-[#4f434c] tracking-wider">
            Accessibility &amp; Green
          </span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#0052CC]">accessible</span>
            <span className="text-xs font-medium text-[#191c21]">WAB: Wheelchair Ramp Equipped</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#00875A]">electric_bolt</span>
            <span className="text-xs font-medium text-[#191c21]">Electric Low-Emission Fleet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#9e4300]">wifi</span>
            <span className="text-xs font-medium text-[#191c21]">On-board USB Charging Ports</span>
          </div>
        </div>

        {/* Legend 4: SimplyGo Ticketing */}
        <div className="bg-[#f2f3fa] p-4 rounded-xl flex flex-col gap-2">
          <span className="text-[11px] uppercase font-bold text-[#4f434c] tracking-wider">
            Payment &amp; Fares
          </span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#40073e]">contactless</span>
            <span className="text-xs font-medium text-[#191c21]">Contactless Bank Cards / Apple Pay</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#40073e]">credit_card</span>
            <span className="text-xs font-medium text-[#191c21]">EZ-Link / NETS FlashPay</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#9e4300]">calculate</span>
            <span className="text-xs font-semibold text-[#9e4300]">Distance Fare Applied</span>
          </div>
        </div>
      </div>
    </div>
  );
};
