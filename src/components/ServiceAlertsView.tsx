import React, { useState } from 'react';
import { SERVICE_ADVISORIES } from '../data/transitData';
import { ServiceAdvisory } from '../types/transit';

export const ServiceAlertsView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'warning' | 'info'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('f1-diversion-2025');

  const filtered = SERVICE_ADVISORIES.filter((a) => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex flex-col gap-6">
      {/* Title Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#DFE1E6] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9e4300] text-[28px]">warning</span>
            <h1 className="font-display text-2xl font-bold text-[#191c21]">
              Live Service Alerts &amp; Transit Advisories
            </h1>
          </div>
          <p className="text-sm text-[#81737c] mt-1">
            Real-time notifications on route diversions, road closures, and holiday operating hour adjustments.
          </p>
        </div>

        <div className="flex items-center bg-[#ecedf5] p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-[#40073e] text-white shadow-xs' : 'text-[#4f434c]'
            }`}
          >
            All Notices ({SERVICE_ADVISORIES.length})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              filter === 'warning' ? 'bg-[#40073e] text-white shadow-xs' : 'text-[#4f434c]'
            }`}
          >
            Diversions
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              filter === 'info' ? 'bg-[#40073e] text-white shadow-xs' : 'text-[#4f434c]'
            }`}
          >
            Maintenance / Info
          </button>
        </div>
      </div>

      {/* Advisories Feed */}
      <div className="flex flex-col gap-4">
        {filtered.map((advisory) => {
          const isExpanded = expandedId === advisory.id;

          return (
            <div
              key={advisory.id}
              className={`bg-white rounded-xl p-5 shadow-sm border border-[#DFE1E6] flex flex-col gap-3 transition-all ${
                advisory.severity === 'warning' ? 'border-l-4 border-l-[#9e4300]' : 'border-l-4 border-l-[#00875A]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      advisory.severity === 'warning'
                        ? 'bg-[#ffdbcb] text-[#9e4300]'
                        : 'bg-[#dce1ff] text-[#40073e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {advisory.severity === 'warning' ? 'report_problem' : 'info'}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-[#191c21]">
                      {advisory.title}
                    </h2>
                    <span className="text-xs text-[#81737c]">
                      {advisory.dateRange}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : advisory.id)}
                  className="px-3 py-1 bg-[#ecedf5] hover:bg-[#e1e2e9] text-[#191c21] rounded-lg text-xs font-bold transition-colors cursor-pointer self-start sm:self-center flex items-center gap-1"
                >
                  <span>{isExpanded ? 'Collapse' : 'Details'}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              </div>

              <p className="text-xs text-[#4f434c] leading-relaxed">
                {advisory.shortDesc}
              </p>

              {isExpanded && (
                <div className="mt-2 pt-3 border-t border-[#f2f3fa] flex flex-col gap-3 animate-fade-in">
                  <div className="bg-[#f8f9ff] p-3 rounded-lg text-xs text-[#4f434c] leading-relaxed">
                    {advisory.fullDesc}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#191c21]">
                      Affected Bus Services:
                    </span>
                    {advisory.affectedServices.map((svc) => (
                      <span
                        key={svc}
                        className="bg-[#592055] text-white px-2 py-0.5 rounded text-xs font-bold"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
