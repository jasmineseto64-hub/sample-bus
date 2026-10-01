import React, { useState } from 'react';
import { DISTANCE_FARE_TIERS } from '../data/transitData';
import { transitAudio } from '../utils/audio';

export const FaresCalculatorView: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(5.5);
  const [passengerType, setPassengerType] = useState<'adult' | 'student' | 'senior'>('adult');

  // Find applicable tier
  const tier =
    DISTANCE_FARE_TIERS.find((t) => distanceKm <= t.maxKm) ||
    DISTANCE_FARE_TIERS[DISTANCE_FARE_TIERS.length - 1];

  let fare = tier.adultCard;
  if (passengerType === 'student') fare = tier.studentCard;
  if (passengerType === 'senior') fare = tier.seniorCard;

  const cashFareEquivalent = (fare + 0.9).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex flex-col gap-6">
      {/* Title Hero */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#DFE1E6] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#40073e] text-[28px]">payments</span>
            <h1 className="font-display text-2xl font-bold text-[#191c21]">
              Fares &amp; Distance Travel Guide
            </h1>
          </div>
          <p className="text-sm text-[#81737c] mt-1">
            Official Singapore Public Transport Council (PTC) distance-based fare structure and SimplyGo ticketing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-sm border border-[#DFE1E6] flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-[#f2f3fa] pb-3">
            <span className="material-symbols-outlined text-[#9e4300] text-[22px]">calculate</span>
            <h2 className="font-display text-lg font-bold text-[#191c21]">
              Distance Fare Calculator
            </h2>
          </div>

          {/* Passenger Type Segmented Control */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-[#4f434c] tracking-wider">
              Concession / Card Category
            </label>
            <div className="grid grid-cols-3 gap-2 bg-[#ecedf5] p-1.5 rounded-xl">
              <button
                onClick={() => {
                  transitAudio.playClickSound();
                  setPassengerType('adult');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center ${
                  passengerType === 'adult'
                    ? 'bg-[#40073e] text-white shadow-xs'
                    : 'text-[#4f434c] hover:text-[#191c21]'
                }`}
              >
                <span>Adult / Bank Card</span>
                <span className="text-[10px] opacity-80 font-normal">SimplyGo / NETS</span>
              </button>

              <button
                onClick={() => {
                  transitAudio.playClickSound();
                  setPassengerType('student');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center ${
                  passengerType === 'student'
                    ? 'bg-[#40073e] text-white shadow-xs'
                    : 'text-[#4f434c] hover:text-[#191c21]'
                }`}
              >
                <span>Student Concession</span>
                <span className="text-[10px] opacity-80 font-normal">Pri / Sec / JC / Poly</span>
              </button>

              <button
                onClick={() => {
                  transitAudio.playClickSound();
                  setPassengerType('senior');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center ${
                  passengerType === 'senior'
                    ? 'bg-[#40073e] text-white shadow-xs'
                    : 'text-[#4f434c] hover:text-[#191c21]'
                }`}
              >
                <span>Senior / PWD</span>
                <span className="text-[10px] opacity-80 font-normal">60+ Years / Workfare</span>
              </button>
            </div>
          </div>

          {/* Distance Slider */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-[#4f434c] tracking-wider">
                Total Journey Distance
              </label>
              <span className="font-mono-nums text-lg font-bold text-[#40073e]">
                {distanceKm.toFixed(1)} km
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-[#40073e] cursor-pointer h-2 bg-[#ecedf5] rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-[#81737c]">
              <span>Short Trip (1-3 km)</span>
              <span>Mid Corridor (8-12 km)</span>
              <span>Cross Island (20+ km)</span>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-[#f8f9ff] border border-[#dce1ff] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-[#4f434c] tracking-wider">
                Computed Distance Fare
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-4xl font-extrabold text-[#40073e]">
                  ${fare.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-[#81737c]">SGD</span>
              </div>
              <span className="text-xs text-[#00875A] font-semibold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">savings</span>
                Saves ${(parseFloat(cashFareEquivalent) - fare).toFixed(2)} vs cash boardings
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#DFE1E6] text-xs flex flex-col gap-1">
              <div className="flex justify-between gap-4 text-[#4f434c]">
                <span>Cash Fare:</span>
                <span className="font-mono-nums font-semibold">${cashFareEquivalent}</span>
              </div>
              <div className="flex justify-between gap-4 text-[#4f434c]">
                <span>Payment Accepted:</span>
                <span className="font-bold text-[#40073e]">Contactless / SimplyGo</span>
              </div>
              <div className="flex justify-between gap-4 text-[#4f434c]">
                <span>Distance Band:</span>
                <span className="font-mono-nums font-semibold">Up to {tier.maxKm} km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: LTA Transfer Rules & Guidelines (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#DFE1E6] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00875A] text-[20px]">transfer_within_a_station</span>
              <h3 className="font-display text-base font-bold text-[#191c21]">
                Transfer Rules &amp; Distance Fare Principles
              </h3>
            </div>
            <ul className="text-xs text-[#4f434c] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00875A] text-[16px] shrink-0 mt-0.5">check</span>
                <span><strong>45-Minute Window:</strong> Up to 45 minutes between each alighting and subsequent boarding.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00875A] text-[16px] shrink-0 mt-0.5">check</span>
                <span><strong>Maximum 5 Transfers:</strong> Up to 5 transfers permitted within a single connected 2-hour journey.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00875A] text-[16px] shrink-0 mt-0.5">check</span>
                <span><strong>No Re-entry to Same Train Station:</strong> Multiple train trips are allowed, but you cannot exit and re-enter the identical MRT station.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00875A] text-[16px] shrink-0 mt-0.5">check</span>
                <span><strong>Same Card / Device:</strong> Use the identical contactless credit card or SimplyGo EZ-Link on all legs to automatically consolidate distance fares.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#DFE1E6] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0052CC] text-[20px]">accessible</span>
              <h3 className="font-display text-base font-bold text-[#191c21]">
                Wheelchair Accessible Buses (WAB)
              </h3>
            </div>
            <p className="text-xs text-[#4f434c] leading-relaxed">
              100% of SBS Transit basic trunk and feeder routes are served by Wheelchair Accessible Buses. All WABs feature mechanical fold-out ramps, dedicated priority spaces, and bell push chimes positioned for wheelchair users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
