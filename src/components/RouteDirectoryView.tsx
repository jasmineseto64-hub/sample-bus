import React, { useState } from 'react';
import { BUS_SERVICES_DATA } from '../data/transitData';
import { transitAudio } from '../utils/audio';

interface RouteDirectoryViewProps {
  onSelectServiceToTrack: (serviceNo: string) => void;
}

export const RouteDirectoryView: React.FC<RouteDirectoryViewProps> = ({
  onSelectServiceToTrack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Trunk' | 'Express'>('All');

  const allServices = Object.values(BUS_SERVICES_DATA);

  const filtered = allServices.filter((svc) => {
    const matchesSearch =
      svc.serviceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.direction1.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.direction1.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.direction1.via.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || svc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#DFE1E6] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#40073e] text-[26px]">menu_book</span>
            <h1 className="font-display text-2xl font-bold text-[#191c21]">
              SBS Transit Route Directory
            </h1>
          </div>
          <p className="text-sm text-[#81737c] mt-1">
            Browse complete timetables, interchange terminals, and operating frequencies across Singapore.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined text-[#81737c] absolute left-3 top-2.5 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route no., terminal, or road..."
              className="pl-9 pr-4 py-2 bg-[#f2f3fa] focus:bg-white rounded-lg text-sm text-[#191c21] border border-transparent focus:border-[#40073e] focus:outline-none w-full sm:w-64 font-medium"
            />
          </div>

          <div className="flex items-center bg-[#ecedf5] p-1 rounded-lg">
            {(['All', 'Trunk', 'Express'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#40073e] text-white shadow-xs'
                    : 'text-[#4f434c] hover:text-[#191c21]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((service) => (
          <div
            key={service.serviceNo}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#DFE1E6] flex flex-col justify-between gap-4 hover:border-[#40073e] transition-all hover:shadow-md group"
          >
            <div>
              {/* Header bar of card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-10 rounded-lg bg-[#40073e] text-white font-display text-xl font-extrabold flex items-center justify-center shadow-xs">
                    {service.serviceNo}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[#191c21]">
                      {service.direction1.origin} ⇄ {service.direction1.destination}
                    </span>
                    <span className="text-[11px] text-[#9e4300] font-bold">
                      {service.category} Service
                    </span>
                  </div>
                </div>
              </div>

              {/* Via Corridor */}
              <p className="text-xs text-[#4f434c] mt-3 leading-relaxed">
                <strong className="text-[#191c21]">Key Corridor: </strong>
                {service.direction1.via}
              </p>

              {/* Timings and Frequency */}
              <div className="mt-3.5 bg-[#f2f3fa] p-3 rounded-lg grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#81737c] uppercase font-bold block">
                    Operating Hours
                  </span>
                  <span className="font-mono-nums font-semibold text-[#191c21]">
                    {service.firstBus} – {service.lastBus}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#81737c] uppercase font-bold block">
                    Peak Frequency
                  </span>
                  <span className="font-mono-nums font-semibold text-[#00875A]">
                    {service.frequency.peak}
                  </span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => {
                transitAudio.playClickSound();
                onSelectServiceToTrack(service.serviceNo);
              }}
              className="w-full py-2 bg-[#592055] hover:bg-[#40073e] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">radar</span>
              <span>Track Live Arrivals</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
