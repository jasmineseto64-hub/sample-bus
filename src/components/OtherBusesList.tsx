import React, { useState } from 'react';
import { BUS_SERVICES_DATA } from '../data/transitData';
import { transitAudio } from '../utils/audio';

interface OtherBusesListProps {
  currentStopCode: string;
  selectedServiceNo: string;
  onSelectService: (serviceNo: string) => void;
}

export const OtherBusesList: React.FC<OtherBusesListProps> = ({
  currentStopCode,
  selectedServiceNo,
  onSelectService,
}) => {
  const [filter, setFilter] = useState<'All' | 'Trunk' | 'Express'>('All');

  // We display services other than the selected one
  const allServiceKeys = ['14', '106', '123', '175', '147', '174', '7', '190'];
  const servicesToShow = allServiceKeys
    .filter((svcNo) => svcNo !== selectedServiceNo && BUS_SERVICES_DATA[svcNo])
    .filter((svcNo) => {
      if (filter === 'All') return true;
      return BUS_SERVICES_DATA[svcNo].category === filter;
    });

  const handleSelect = (serviceNo: string) => {
    transitAudio.playClickSound();
    onSelectService(serviceNo);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#DFE1E6] flex flex-col gap-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#f2f3fa]">
        <div>
          <h2 className="font-display text-base sm:text-lg font-bold text-[#191c21]">
            Other Buses at Stop {currentStopCode}
          </h2>
          <p className="text-xs text-[#81737c]">
            Live times for other trunk &amp; express lines arriving here
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            onClick={() => {
              transitAudio.playClickSound();
              setFilter('All');
            }}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              filter === 'All'
                ? 'bg-[#191c21] text-white shadow-xs'
                : 'bg-[#ecedf5] text-[#4f434c] hover:bg-[#e1e2e9]'
            }`}
          >
            All ({allServiceKeys.length})
          </button>
          <button
            onClick={() => {
              transitAudio.playClickSound();
              setFilter('Trunk');
            }}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'Trunk'
                ? 'bg-[#191c21] text-white shadow-xs'
                : 'bg-[#ecedf5] text-[#4f434c] hover:bg-[#e1e2e9]'
            }`}
          >
            Trunk
          </button>
          <button
            onClick={() => {
              transitAudio.playClickSound();
              setFilter('Express');
            }}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'Express'
                ? 'bg-[#191c21] text-white shadow-xs'
                : 'bg-[#ecedf5] text-[#4f434c] hover:bg-[#e1e2e9]'
            }`}
          >
            Express
          </button>
        </div>
      </div>

      {/* Bus Rows */}
      <div className="flex flex-col gap-2.5">
        {servicesToShow.map((svcNo) => {
          const service = BUS_SERVICES_DATA[svcNo];
          const dir = service.direction1;
          const [arr1, arr2] = dir.arrivals;

          return (
            <div
              key={svcNo}
              onClick={() => handleSelect(svcNo)}
              className="bg-[#f2f3fa] hover:bg-[#ecedf5] border border-transparent hover:border-[#DFE1E6] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer group shadow-2xs"
            >
              {/* Left Service Number & Route Destination */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-11 bg-[#40073e] group-hover:bg-[#592055] rounded-lg text-white font-display text-xl font-extrabold flex items-center justify-center shrink-0 shadow-sm transition-colors">
                  {svcNo}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-sm sm:text-base font-bold text-[#191c21] group-hover:text-[#40073e] transition-colors truncate">
                    {dir.destination}
                  </span>
                  <span className="text-xs text-[#81737c] truncate">
                    via {dir.via}
                  </span>
                </div>
              </div>

              {/* Right Arrival Blocks */}
              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                {/* 1st bus */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono-nums text-base font-bold ${
                        arr1.load === 'Seats Available'
                          ? 'text-[#00875A]'
                          : arr1.load === 'Standing Available'
                          ? 'text-[#9e4300]'
                          : 'text-[#DE350B]'
                      }`}
                    >
                      {arr1.etaMinutes} mins
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono-nums text-[10px] font-bold ${
                        arr1.load === 'Seats Available'
                          ? 'bg-[#E3FCEF] text-[#00875A]'
                          : arr1.load === 'Standing Available'
                          ? 'bg-[#FFF0B3] text-[#9e4300]'
                          : 'bg-[#FFEBE6] text-[#DE350B]'
                      }`}
                    >
                      {arr1.load === 'Seats Available' ? 'Seats' : arr1.load === 'Standing Available' ? 'Standing' : 'Crowded'}
                    </span>
                  </div>
                  <span className="font-mono-nums text-[10px] text-[#81737c]">
                    {arr1.vehicleType.includes('Double') ? 'DD' : 'SD'} • WAB
                  </span>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-[#d3c2cc]"></div>

                {/* 2nd bus */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-nums text-base font-semibold text-[#191c21]">
                      {arr2.etaMinutes} mins
                    </span>
                  </div>
                  <span
                    className={`font-mono-nums text-[10px] font-bold ${
                      arr2.load === 'Seats Available' ? 'text-[#00875A]' : 'text-[#9e4300]'
                    }`}
                  >
                    {arr2.load === 'Seats Available' ? 'Seats' : 'Standing'} • {arr2.vehicleType.includes('Double') ? 'DD' : 'SD'}
                  </span>
                </div>

                <span className="material-symbols-outlined text-[#81737c] group-hover:text-[#40073e] text-[20px] transition-transform group-hover:translate-x-0.5">
                  chevron_right
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
