import React, { useState } from 'react';
import { BusService } from '../types/transit';

interface MapModalProps {
  busService: BusService;
  isOpen: boolean;
  onClose: () => void;
  onSelectStop: (stopCode: string) => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  busService,
  isOpen,
  onClose,
  onSelectStop,
}) => {
  const [activePin, setActivePin] = useState<string | null>('09037');
  const [mapLayer, setMapLayer] = useState<'corridor' | 'transit'>('corridor');

  if (!isOpen) return null;

  const pins = [
    { code: '09212', name: 'Royal Plaza On Scotts', x: 22, y: 35, passed: true },
    { code: '09037', name: 'Opp Mandarin Gallery (Selected)', x: 42, y: 48, current: true },
    { code: '08121', name: 'Somerset Station (NS23)', x: 56, y: 54, upcoming: true },
    { code: '08057', name: 'Dhoby Ghaut Stn (NS/NE/CC)', x: 74, y: 62, upcoming: true },
    { code: '04239', name: 'Clarke Quay Stn (NE5)', x: 86, y: 76, upcoming: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#DFE1E6] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#40073e] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px]">map</span>
            <div>
              <h2 className="font-display text-lg font-bold">
                Route {busService.serviceNo} Interactive Corridor Map
              </h2>
              <p className="text-xs text-[#ffd7f5]">
                Orchard Road Corridor to {busService.direction1.destination} • Real-time GPS Tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-black/30 rounded-lg p-1 flex items-center text-xs">
              <button
                onClick={() => setMapLayer('corridor')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  mapLayer === 'corridor' ? 'bg-white text-[#40073e] font-bold' : 'text-white'
                }`}
              >
                Orchard Corridor
              </button>
              <button
                onClick={() => setMapLayer('transit')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  mapLayer === 'transit' ? 'bg-white text-[#40073e] font-bold' : 'text-white'
                }`}
              >
                MRT Overlays
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Map Canvas Area */}
        <div className="relative w-full h-[450px] bg-slate-900 overflow-hidden select-none">
          {/* Base Map Graphic */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85 transition-opacity"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsU--5LU6pfnuy0JaSHyumFUQwgKCofWwbXlwM5z9oqa_xFN2JUoFiPiYFGfL1PndIzEgRElfjwlOMt41gNBwhCzCyZNwUJ6TQyHaR8RHm-YwNOP1xZDu8BoYtiDKD0av5Tpr8Jv71tySxwH77NmpIABHfdL4A2V4dUj_6HYEj6Z3PH0vW7O-YSx8M-YAHJx7C2qnQGHKN86SncQNsTkhQjvyymzAb1oYPxQsV1esNxoCrCJLGwdU3')`,
            }}
          />

          {/* SVG Vector Route Polyline Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline
              points="140,157 280,216 380,243 510,279 600,342"
              fill="none"
              stroke="#592055"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />
            <polyline
              points="140,157 280,216"
              fill="none"
              stroke="#00875A"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>

          {/* Interactive Bus Stops Pins */}
          {pins.map((pin) => {
            const isCurrent = pin.code === '09037';
            const isActive = activePin === pin.code;

            return (
              <div
                key={pin.code}
                onClick={() => {
                  setActivePin(pin.code);
                  onSelectStop(pin.code);
                }}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg transition-transform group-hover:scale-125 ${
                    isCurrent
                      ? 'bg-[#40073e] text-white ring-4 ring-[#ffd7f5]'
                      : pin.passed
                      ? 'bg-slate-300 text-slate-700 border-2 border-slate-500'
                      : 'bg-white text-[#40073e] border-2 border-[#40073e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">directions_bus</span>
                </div>

                {/* Popover Callout */}
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white/95 backdrop-blur-md p-2 rounded-lg shadow-xl text-left border border-[#DFE1E6] transition-all pointer-events-none z-30 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                  }`}
                >
                  <div className="font-mono-nums text-[10px] font-bold text-[#81737c]">
                    STOP {pin.code}
                  </div>
                  <div className="text-xs font-bold text-[#191c21] leading-tight">
                    {pin.name}
                  </div>
                  <div className="text-[10px] text-[#00875A] font-semibold mt-1">
                    {isCurrent ? 'Current Stop • Bay 2' : pin.passed ? 'Departed' : 'Upcoming Stop'}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Live Approaching Bus Floating Marker */}
          <div
            style={{ left: '38%', top: '44%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="flex items-center gap-1.5 bg-[#00875A] text-white px-2.5 py-1 rounded-full shadow-lg text-[11px] font-bold animate-bounce">
              <span className="material-symbols-outlined text-[16px]">directions_bus</span>
              <span>Bus {busService.serviceNo} (24 km/h)</span>
            </div>
          </div>

          {/* Legend Overlay */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg text-xs text-[#191c21] shadow-md border border-[#DFE1E6] flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#40073e] ring-2 ring-[#ffd7f5]"></span>
              <span className="font-semibold">Selected Stop (Opp Mandarin Gallery)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#00875A]"></span>
              <span className="font-semibold">Live Approaching Vehicle (110m away)</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#f2f3fa] p-3 px-5 flex items-center justify-between text-xs text-[#4f434c]">
          <span>
            Click on any stop waypoint to switch your active tracking view.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#40073e] text-white rounded-lg font-bold hover:bg-[#592055] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
