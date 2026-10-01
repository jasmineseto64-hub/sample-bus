import React from 'react';
import { BusService } from '../types/transit';

interface FleetInfoModalProps {
  busService: BusService;
  isOpen: boolean;
  onClose: () => void;
}

export const FleetInfoModal: React.FC<FleetInfoModalProps> = ({
  busService,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const vehicle = busService.direction1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFE1E6] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#40073e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">directions_bus</span>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#191c21]">
                Vehicle Telemetry &amp; Fleet Data
              </h2>
              <p className="text-xs text-[#81737c]">
                Assigned Bus Service {busService.serviceNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#81737c] hover:text-[#191c21] hover:bg-[#f2f3fa] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Fleet Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#f2f3fa] p-3 rounded-lg flex flex-col">
            <span className="text-[#81737c] font-semibold">Registration Number</span>
            <span className="font-mono-nums text-sm font-bold text-[#191c21] mt-0.5">
              {vehicle.vehicleReg.split('(')[0].trim()}
            </span>
          </div>

          <div className="bg-[#f2f3fa] p-3 rounded-lg flex flex-col">
            <span className="text-[#81737c] font-semibold">Bus Model</span>
            <span className="font-bold text-[#191c21] mt-0.5">
              {vehicle.vehicleModel}
            </span>
          </div>

          <div className="bg-[#f2f3fa] p-3 rounded-lg flex flex-col">
            <span className="text-[#81737c] font-semibold">Classification</span>
            <span className="font-bold text-[#40073e] mt-0.5">
              Double Decker (120 Pax)
            </span>
          </div>

          <div className="bg-[#f2f3fa] p-3 rounded-lg flex flex-col">
            <span className="text-[#81737c] font-semibold">Depot Assignment</span>
            <span className="font-bold text-[#191c21] mt-0.5">
              Bedok North Depot (BNDEP)
            </span>
          </div>

          <div className="bg-[#f2f3fa] p-3 rounded-lg flex flex-col">
            <span className="text-[#81737c] font-semibold">Emission Standard</span>
            <span className="font-bold text-[#00875A] mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">eco</span>
              Euro V EEV Clean Diesel
            </span>
          </div>

          <div className="bg-[#f2f3fa] p-3 rounded-lg flex flex-col">
            <span className="text-[#81737c] font-semibold">Accessibility (WAB)</span>
            <span className="font-bold text-[#0052CC] mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">accessible</span>
              Manual Fold-out Ramp
            </span>
          </div>
        </div>

        {/* Features list */}
        <div className="border border-[#DFE1E6] rounded-xl p-3.5 flex flex-col gap-2">
          <span className="text-xs font-bold text-[#191c21]">On-board Commuter Amenities</span>
          <div className="grid grid-cols-2 gap-2 text-xs text-[#4f434c]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#00875A]">check</span>
              High-Capacity Air-Conditioning
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#00875A]">check</span>
              High-Definition Upper Deck CCTV
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#00875A]">check</span>
              Dual USB-A Fast Charging at Seats
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#00875A]">check</span>
              Audio Visual Next Stop Announcer
            </span>
          </div>
        </div>

        {/* Close */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#40073e] hover:bg-[#592055] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close Specs
          </button>
        </div>
      </div>
    </div>
  );
};
