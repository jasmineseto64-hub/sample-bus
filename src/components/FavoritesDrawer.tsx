import React from 'react';
import { BUS_STOPS_MAP, BUS_SERVICES_DATA } from '../data/transitData';
import { transitAudio } from '../utils/audio';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedStops: string[];
  onRemoveBookmark: (stopCode: string) => void;
  onSelectStop: (stopCode: string) => void;
  onSelectService: (serviceNo: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedStops,
  onRemoveBookmark,
  onSelectStop,
  onSelectService,
}) => {
  if (!isOpen) return null;

  const quickServices = ['65', '14', '106', '147'];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#DFE1E6]">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#DFE1E6] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#40073e] text-[24px]">bookmark</span>
            <div>
              <h2 className="font-display text-lg font-bold text-[#191c21]">
                My Saved Transit Hubs
              </h2>
              <p className="text-xs text-[#81737c]">
                Quick access to your frequently tracked stops and routes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#81737c] hover:text-[#191c21] hover:bg-[#ecedf5] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5">
          {/* Saved Bus Stops */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase text-[#4f434c] tracking-wider">
              Bookmarked Bus Stops ({bookmarkedStops.length})
            </span>

            {bookmarkedStops.length === 0 ? (
              <div className="bg-[#f2f3fa] p-4 rounded-xl text-center text-xs text-[#81737c]">
                No bus stops bookmarked yet. Tap the bookmark icon on any bus stop card to pin it here.
              </div>
            ) : (
              bookmarkedStops.map((code) => {
                const stop = BUS_STOPS_MAP[code] || {
                  code,
                  name: `Stop ${code}`,
                  roadName: 'Singapore',
                  distanceMetres: 200,
                  walkingMins: 3,
                  services: ['65', '14'],
                };

                return (
                  <div
                    key={code}
                    className="p-3 bg-[#f2f3fa] hover:bg-[#ecedf5] rounded-xl flex items-center justify-between border border-[#DFE1E6] transition-colors"
                  >
                    <div
                      onClick={() => {
                        transitAudio.playClickSound();
                        onSelectStop(code);
                        onClose();
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono-nums text-[10px] bg-[#592055] text-white px-1.5 py-0.5 rounded font-bold">
                          {stop.code}
                        </span>
                        <span className="text-xs font-bold text-[#191c21]">
                          {stop.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#81737c] block mt-0.5">
                        {stop.roadName} • Services: {stop.services.slice(0, 4).join(', ')}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveBookmark(code)}
                      className="p-1 text-[#81737c] hover:text-[#DE350B] transition-colors ml-2"
                      title="Remove bookmark"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Pinned Services */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase text-[#4f434c] tracking-wider">
              Quick Pin Routes
            </span>
            <div className="grid grid-cols-2 gap-2">
              {quickServices.map((svcNo) => {
                const svc = BUS_SERVICES_DATA[svcNo];
                if (!svc) return null;

                return (
                  <button
                    key={svcNo}
                    onClick={() => {
                      transitAudio.playClickSound();
                      onSelectService(svcNo);
                      onClose();
                    }}
                    className="p-3 bg-[#f8f9ff] hover:bg-[#ecedf5] border border-[#DFE1E6] rounded-xl text-left transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="w-9 h-8 rounded-lg bg-[#40073e] text-white font-display text-sm font-bold flex items-center justify-center shrink-0">
                      {svcNo}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#191c21] truncate">
                        {svc.direction1.destination}
                      </span>
                      <span className="text-[10px] text-[#81737c]">
                        {svc.frequency.peak}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DFE1E6] bg-[#f8f9ff] flex items-center justify-between text-xs text-[#81737c]">
          <span>Preferences stored locally</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#40073e] text-white rounded-lg font-bold hover:bg-[#592055] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
