import React, { useState } from 'react';
import { BusService } from '../types/transit';
import { transitAudio } from '../utils/audio';

interface RouteTrajectoryProps {
  busService: BusService;
  direction: 1 | 2;
  currentStopCode: string;
  onOpenMapModal: () => void;
}

export const RouteTrajectory: React.FC<RouteTrajectoryProps> = ({
  busService,
  direction,
  currentStopCode,
  onOpenMapModal,
}) => {
  const [showAllStops, setShowAllStops] = useState(false);
  const dirData = direction === 1 ? busService.direction1 : busService.direction2;
  const stops = dirData.stops;

  const visibleStops = showAllStops ? stops : stops.slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#DFE1E6] flex flex-col gap-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-1 border-b border-[#f2f3fa]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#40073e] text-[20px]">alt_route</span>
          <h2 className="font-display text-base sm:text-lg font-bold text-[#191c21]">
            Route {busService.serviceNo} Trajectory
          </h2>
        </div>
        <span className="text-[11px] bg-[#ecedf5] text-[#191c21] font-bold px-2 py-0.5 rounded uppercase">
          Orchard Corridor
        </span>
      </div>

      {/* Schematic Linear Map Corridor */}
      <div className="bg-[#f2f3fa] rounded-xl p-4 relative overflow-hidden">
        <div className="flex flex-col relative pl-6">
          {/* Base vertical track line */}
          <div className="absolute left-2.5 top-3 bottom-3 w-1 bg-[#d3c2cc]/60 rounded"></div>
          {/* Active travel segment highlight */}
          <div className="absolute left-2.5 top-3 h-28 w-1 bg-[#00875A] rounded"></div>

          {/* Stops List */}
          {visibleStops.map((stop, index) => {
            const isSelected = stop.stopCode === currentStopCode || stop.isCurrent;

            return (
              <React.Fragment key={stop.stopCode}>
                {/* Live Approaching Bus bubble right before current stop */}
                {isSelected && (
                  <div className="relative flex items-center gap-2 my-2 bg-[#E3FCEF] p-2.5 rounded-lg -ml-3 mr-1 shadow-sm border border-[#00875A]/30 animate-pulse">
                    <span className="material-symbols-outlined text-[#00875A] text-[22px]">
                      directions_bus
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#00875A] font-extrabold uppercase tracking-wide">
                        Bus {busService.serviceNo} Arriving Right Now
                      </span>
                      <span className="font-mono-nums text-[11px] text-[#191c21] font-medium">
                        Speed: {dirData.currentSpeedKmh} km/h • {dirData.approachingDistanceMetres}m away
                      </span>
                    </div>
                  </div>
                )}

                {/* Stop Waypoint */}
                <div
                  className={`relative flex items-start gap-3 py-3 ${
                    stop.isPassed ? 'opacity-60' : ''
                  }`}
                >
                  {/* Waypoint Node Dot */}
                  {isSelected ? (
                    <div className="absolute -left-6 top-3.5 w-4 h-4 rounded-full bg-[#40073e] ring-4 ring-[#ffd7f5]"></div>
                  ) : stop.isPassed ? (
                    <div className="absolute -left-6 top-3.5 w-4 h-4 rounded-full bg-[#e1e2e9] border-2 border-[#81737c]"></div>
                  ) : (
                    <div className="absolute -left-6 top-3.5 w-4 h-4 rounded-full bg-white border-2 border-[#81737c]"></div>
                  )}

                  {/* Stop Details */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-mono-nums text-[10px] px-1 rounded font-bold ${
                          isSelected
                            ? 'bg-[#592055] text-white'
                            : 'text-[#81737c] bg-[#e1e2e9]'
                        }`}
                      >
                        {stop.stopCode}
                      </span>
                      <span
                        className={`font-display text-sm font-bold truncate ${
                          isSelected ? 'text-[#40073e] font-extrabold' : 'text-[#191c21]'
                        }`}
                      >
                        {stop.name}
                      </span>
                      {/* MRT Lines Badges */}
                      {stop.mrtLines && stop.mrtLines.length > 0 && (
                        <div className="flex items-center gap-1">
                          {stop.mrtLines.map((mrt) => (
                            <span
                              key={mrt.code}
                              style={{ backgroundColor: mrt.bg, color: mrt.text || '#fff' }}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded leading-none"
                            >
                              {mrt.code}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Subtitle / Timing info */}
                    {isSelected ? (
                      <span className="text-xs text-[#9e4300] font-bold mt-0.5">
                        You Are Here • {stop.platformBay || 'Platform Bay 2'}
                      </span>
                    ) : stop.departedTime ? (
                      <span className="text-[11px] text-[#81737c] mt-0.5">
                        Departed {stop.departedTime}
                      </span>
                    ) : stop.estMinutes ? (
                      <span className="text-xs text-[#4f434c] mt-0.5 font-medium">
                        Est: {stop.estMinutes}
                      </span>
                    ) : null}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Expand / Collapse All Stops button */}
        {stops.length > 5 && (
          <button
            onClick={() => {
              transitAudio.playClickSound();
              setShowAllStops(!showAllStops);
            }}
            className="w-full mt-2 py-1.5 text-xs font-bold text-[#40073e] hover:text-[#592055] bg-white hover:bg-[#ecedf5] rounded-lg transition-colors border border-[#DFE1E6] flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{showAllStops ? 'Show Key Corridor Stops Only' : `View All ${stops.length} Stops on Route`}</span>
            <span className="material-symbols-outlined text-[16px]">
              {showAllStops ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>

      {/* Singapore GIS Map preview with interactive trigger */}
      <div
        onClick={() => {
          transitAudio.playClickSound();
          onOpenMapModal();
        }}
        className="w-full h-36 bg-cover bg-center rounded-xl relative overflow-hidden flex items-end p-2.5 shadow-inner cursor-pointer group transition-transform hover:scale-[1.01]"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsU--5LU6pfnuy0JaSHyumFUQwgKCofWwbXlwM5z9oqa_xFN2JUoFiPiYFGfL1PndIzEgRElfjwlOMt41gNBwhCzCyZNwUJ6TQyHaR8RHm-YwNOP1xZDu8BoYtiDKD0av5Tpr8Jv71tySxwH77NmpIABHfdL4A2V4dUj_6HYEj6Z3PH0vW7O-YSx8M-YAHJx7C2qnQGHKN86SncQNsTkhQjvyymzAb1oYPxQsV1esNxoCrCJLGwdU3')`,
        }}
        title="Click to view interactive route map"
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
        <div className="relative z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-[#191c21] font-semibold flex items-center justify-between w-full shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#9e4300]">explore</span>
            <span>Map View: Orchard Road Corridor</span>
          </div>
          <span className="text-[11px] text-[#40073e] font-bold group-hover:underline flex items-center">
            Open Map
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </span>
        </div>
      </div>
    </div>
  );
};
