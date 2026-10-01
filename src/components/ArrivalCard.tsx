import React, { useState, useEffect } from 'react';
import { BusService, BusStopInfo } from '../types/transit';
import { transitAudio } from '../utils/audio';

interface ArrivalCardProps {
  busService: BusService;
  busStop: BusStopInfo;
  direction: 1 | 2;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShowFleetInfo: () => void;
}

export const ArrivalCard: React.FC<ArrivalCardProps> = ({
  busService,
  busStop,
  direction,
  isBookmarked,
  onToggleBookmark,
  onShowFleetInfo,
}) => {
  const [countdown, setCountdown] = useState(12);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastPingSec, setLastPingSec] = useState(10);
  const [alertActive, setAlertActive] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const dirData = direction === 1 ? busService.direction1 : busService.direction2;
  const [firstArrival, secondArrival, thirdArrival] = dirData.arrivals;

  // Real-time ticking countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerRefresh();
          return 15;
        }
        return prev - 1;
      });
      setLastPingSec((sec) => (sec >= 25 ? 5 : sec + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [busService.serviceNo, direction]);

  const triggerRefresh = () => {
    setIsSyncing(true);
    setLastPingSec(2);
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  const handleManualRefresh = () => {
    transitAudio.playClickSound();
    setCountdown(15);
    triggerRefresh();
  };

  const toggleAlert = () => {
    transitAudio.playClickSound();
    if (!alertActive) {
      setAlertActive(true);
      setAlertMessage('Alert active! We will chime when Service ' + busService.serviceNo + ' is 2 stops away.');
      transitAudio.playArrivalChime();
      setTimeout(() => setAlertMessage(null), 4000);
    } else {
      setAlertActive(false);
      setAlertMessage(null);
    }
  };

  const renderLoadBadge = (load: string, percent: number) => {
    if (load === 'Seats Available') {
      return (
        <div className="flex items-center justify-between bg-[#E3FCEF] px-2.5 py-1 rounded text-[#00875A] border border-[#00875A]/20">
          <span className="flex items-center gap-1 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">airline_seat_recline_normal</span>
            Seats Available
          </span>
          <span className="font-mono-nums text-[10px] font-semibold">~{percent}% Load</span>
        </div>
      );
    }
    if (load === 'Standing Available') {
      return (
        <div className="flex items-center justify-between bg-[#FFF0B3] px-2.5 py-1 rounded text-[#9e4300] border border-[#FFAB00]/30">
          <span className="flex items-center gap-1 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">person</span>
            Standing Avail
          </span>
          <span className="font-mono-nums text-[10px] font-semibold">~{percent}% Load</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between bg-[#FFEBE6] px-2.5 py-1 rounded text-[#DE350B] border border-[#DE350B]/20">
        <span className="flex items-center gap-1 text-[11px] font-bold">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          Limited Standing
        </span>
        <span className="font-mono-nums text-[10px] font-semibold">~{percent}% Load</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Bus Stop Information Header Strip */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#DFE1E6] flex items-center justify-between">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-13 h-13 rounded-lg bg-[#592055] text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
            <span className="text-[9px] uppercase leading-none font-bold text-[#ffd7f5]">BUS STOP</span>
            <span className="font-display text-base font-extrabold leading-none mt-1">
              {busStop.code}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-lg sm:text-xl font-bold text-[#191c21] truncate">
                {busStop.name}
              </span>
              <span className="bg-[#e6e8ef] text-[#4f434c] text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                {busStop.roadName}
              </span>
            </div>
            <span className="text-xs text-[#9e4300] font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              {busStop.distanceMetres}m away • ~{busStop.walkingMins} min walking distance
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleAlert}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              alertActive
                ? 'bg-[#592055] text-white shadow-sm'
                : 'text-[#40073e] hover:bg-[#f2f3fa]'
            }`}
            title="Set arrival notification alarm"
          >
            <span className="material-symbols-outlined text-[20px]">
              {alertActive ? 'notifications_active' : 'notifications'}
            </span>
            <span className="hidden sm:inline">
              {alertActive ? 'Alert Set (2 Stops)' : '2 Stops Alert'}
            </span>
          </button>

          <button
            onClick={() => {
              transitAudio.playClickSound();
              onToggleBookmark();
            }}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-[#9e4300] bg-[#ffdbcb]/40'
                : 'text-[#81737c] hover:text-[#191c21] hover:bg-[#f2f3fa]'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Stop'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isBookmarked ? 'bookmark_added' : 'bookmark'}
            </span>
          </button>
        </div>
      </div>

      {/* Alert toast if toggled */}
      {alertMessage && (
        <div className="bg-[#E3FCEF] border border-[#00875A] text-[#00875A] px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{alertMessage}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-[#00875A] hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* HERO ARRIVAL CARD: Bus 65 (Active Spotlight) */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#DFE1E6] flex flex-col">
        {/* Card Header Bar */}
        <div className="bg-[#40073e] text-white p-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#40073e] px-3.5 py-1 rounded-lg font-display text-2xl font-extrabold shadow-sm">
              {busService.serviceNo}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold">
                  {dirData.destination}
                </span>
                <span className="bg-[#ff8843] text-[#341100] text-[11px] px-2 py-0.5 rounded font-extrabold uppercase">
                  {busService.category}
                </span>
              </div>
              <span className="text-xs text-[#ffd7f5]">
                {dirData.via}
              </span>
            </div>
          </div>

          {/* Auto-refresh countdown badge */}
          <div className="flex items-center gap-1.5 bg-[#592055] px-3 py-1.5 rounded-full text-[#ffd7f5] text-xs">
            <span
              className={`material-symbols-outlined text-[15px] ${isSyncing ? 'animate-spin' : ''}`}
            >
              sync
            </span>
            <span className="font-mono-nums text-[11px]">
              Sync in <strong className="font-bold text-white">{countdown}</strong>s
            </span>
            <button
              onClick={handleManualRefresh}
              className="ml-1 hover:text-white transition-colors cursor-pointer"
              title="Refresh arrivals now"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Live Arrivals Strip (3 Predictions) */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-[#f8f9ff]">
          {/* 1st Arrival: ARRIVING */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#DFE1E6] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono-nums text-[11px] uppercase tracking-wider text-[#81737c] font-bold">
                Next Arrival
              </span>
              <span className="inline-flex items-center gap-1 bg-[#E3FCEF] text-[#00875A] px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00875A] animate-ping"></span>
                LIVE
              </span>
            </div>

            {/* Main ETA Value */}
            <div className="my-1.5 flex items-baseline gap-1.5">
              <span className="font-display text-4xl text-[#00875A] font-extrabold tracking-tight">
                {firstArrival.etaMinutes}
              </span>
              <span className="text-xs text-[#4f434c] font-semibold">
                (&lt; 1 min)
              </span>
            </div>

            {/* Badges Strip */}
            <div className="mt-2 flex flex-col gap-2">
              {renderLoadBadge(firstArrival.load, firstArrival.loadPercent)}
              <div className="flex items-center justify-between text-[#4f434c] font-mono-nums text-[11px] pt-0.5">
                <span className="flex items-center gap-1 font-semibold text-[#40073e]">
                  <span className="material-symbols-outlined text-[15px]">directions_bus</span>
                  {firstArrival.vehicleType}
                </span>
                {firstArrival.isWheelchairAccessible && (
                  <span className="flex items-center gap-0.5 text-[#0052CC] font-bold">
                    <span className="material-symbols-outlined text-[15px]">accessible</span>
                    WAB
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2nd Arrival: 8 Mins */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#DFE1E6] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono-nums text-[11px] uppercase tracking-wider text-[#81737c] font-bold">
                Subsequent
              </span>
              <span className="font-mono-nums text-[11px] text-[#81737c] font-semibold">
                2nd Bus
              </span>
            </div>

            {/* Main ETA Value */}
            <div className="my-1.5 flex items-baseline gap-1.5">
              <span className="font-display text-4xl text-[#191c21] font-extrabold tracking-tight">
                {secondArrival.etaMinutes}
              </span>
              <span className="font-display text-lg text-[#4f434c] font-bold">
                mins
              </span>
            </div>

            {/* Badges Strip */}
            <div className="mt-2 flex flex-col gap-2">
              {renderLoadBadge(secondArrival.load, secondArrival.loadPercent)}
              <div className="flex items-center justify-between text-[#4f434c] font-mono-nums text-[11px] pt-0.5">
                <span className="flex items-center gap-1 font-semibold text-[#191c21]">
                  <span className="material-symbols-outlined text-[15px]">directions_bus</span>
                  {secondArrival.vehicleType}
                </span>
                {secondArrival.isWheelchairAccessible && (
                  <span className="flex items-center gap-0.5 text-[#0052CC] font-bold">
                    <span className="material-symbols-outlined text-[15px]">accessible</span>
                    WAB
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3rd Arrival: 19 Mins */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#DFE1E6] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono-nums text-[11px] uppercase tracking-wider text-[#81737c] font-bold">
                Following
              </span>
              <span className="font-mono-nums text-[11px] text-[#81737c] font-semibold">
                3rd Bus
              </span>
            </div>

            {/* Main ETA Value */}
            <div className="my-1.5 flex items-baseline gap-1.5">
              <span className="font-display text-4xl text-[#191c21] font-extrabold tracking-tight">
                {thirdArrival.etaMinutes}
              </span>
              <span className="font-display text-lg text-[#4f434c] font-bold">
                mins
              </span>
            </div>

            {/* Badges Strip */}
            <div className="mt-2 flex flex-col gap-2">
              {renderLoadBadge(thirdArrival.load, thirdArrival.loadPercent)}
              <div className="flex items-center justify-between text-[#4f434c] font-mono-nums text-[11px] pt-0.5">
                <span className="flex items-center gap-1 font-semibold text-[#40073e]">
                  <span className="material-symbols-outlined text-[15px]">directions_bus</span>
                  {thirdArrival.vehicleType}
                </span>
                {thirdArrival.isWheelchairAccessible && (
                  <span className="flex items-center gap-0.5 text-[#0052CC] font-bold">
                    <span className="material-symbols-outlined text-[15px]">accessible</span>
                    WAB
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Micro Status Bar */}
        <div className="bg-[#f2f3fa] px-4 py-2 flex items-center justify-between text-xs text-[#4f434c] border-t border-[#DFE1E6]">
          <button
            onClick={onShowFleetInfo}
            className="flex items-center gap-1.5 hover:text-[#40073e] transition-colors cursor-pointer text-left"
            title="Click to view fleet and technical specs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00875A]">check</span>
            <span>
              Vehicle Reg:{' '}
              <strong className="font-mono-nums font-semibold text-[#191c21] underline decoration-dotted">
                {dirData.vehicleReg}
              </strong>
            </span>
          </button>
          <span className="text-xs">
            Last pinged: <strong className="font-semibold text-[#191c21]">{lastPingSec} seconds ago</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
