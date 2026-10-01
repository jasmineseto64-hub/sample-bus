import React, { useState } from 'react';
import { SERVICE_ADVISORIES } from '../data/transitData';
import { ServiceAdvisory } from '../types/transit';
import { transitAudio } from '../utils/audio';

export const ServiceAlertBanner: React.FC = () => {
  const [selectedAdvisory, setSelectedAdvisory] = useState<ServiceAdvisory | null>(null);
  const mainAlert = SERVICE_ADVISORIES[0];

  return (
    <>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#DFE1E6] border-l-4 border-l-[#9e4300] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#ffdbcb] text-[#341100] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-[22px] text-[#9e4300]">info</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-display text-sm sm:text-base font-bold text-[#191c21]">
              {mainAlert.title}
            </h3>
            <p className="text-xs text-[#4f434c] mt-0.5 leading-relaxed">
              {mainAlert.shortDesc}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            transitAudio.playClickSound();
            setSelectedAdvisory(mainAlert);
          }}
          className="px-4 py-2 rounded-lg bg-[#ecedf5] hover:bg-[#e1e2e9] text-[#191c21] text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          Read Advisory
        </button>
      </div>

      {/* Advisory Modal */}
      {selectedAdvisory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFE1E6] flex flex-col gap-4 relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9e4300] text-[24px]">warning</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9e4300]">
                  LTA Transit Notice
                </span>
              </div>
              <button
                onClick={() => setSelectedAdvisory(null)}
                className="p-1 rounded-lg text-[#81737c] hover:text-[#191c21] hover:bg-[#f2f3fa] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <h2 className="font-display text-lg font-bold text-[#191c21] leading-snug">
              {selectedAdvisory.title}
            </h2>

            <div className="bg-[#f2f3fa] p-3 rounded-lg text-xs flex flex-col gap-1 text-[#4f434c]">
              <div>
                <strong className="text-[#191c21]">Effective Period: </strong>
                {selectedAdvisory.dateRange}
              </div>
              <div>
                <strong className="text-[#191c21]">Affected Services: </strong>
                <span className="font-semibold text-[#40073e]">
                  {selectedAdvisory.affectedServices.join(', ')}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#4f434c] leading-relaxed">
              {selectedAdvisory.fullDesc}
            </p>

            <div className="border-t border-[#DFE1E6] pt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedAdvisory(null)}
                className="px-4 py-2 bg-[#40073e] hover:bg-[#592055] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Acknowledge &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
