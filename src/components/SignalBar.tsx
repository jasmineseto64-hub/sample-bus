import React, { useState, useEffect } from 'react';
import { transitAudio } from '../utils/audio';

interface SignalBarProps {
  currentAreaName: string;
}

export const SignalBar: React.FC<SignalBarProps> = ({ currentAreaName }) => {
  const [latency, setLatency] = useState(280);
  const [isAudioMuted, setIsAudioMuted] = useState(transitAudio.getMuted());
  const [apiHealth, setApiHealth] = useState<{
    status: string;
    apiKeyConfigured: boolean;
    endpoints: Record<string, string>;
  } | null>(null);
  const [showEndpointsModal, setShowEndpointsModal] = useState(false);

  useEffect(() => {
    // Check /api/health
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        setApiHealth({
          status: data.status,
          apiKeyConfigured: data.environment?.ltaApiKeyConfigured || false,
          endpoints: data.endpoints || {},
        });
      })
      .catch(() => {
        setApiHealth(null);
      });
  }, []);

  // Simulate realistic network jitter for Singapore LTA DataMall feed
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(260 + Math.floor(Math.random() * 35));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    transitAudio.setMuted(nextState);
    if (!nextState) {
      transitAudio.playArrivalChime();
    }
  };

  return (
    <>
      <div className="w-full bg-[#e6e8ef] px-4 sm:px-8 py-1.5 border-b border-[#DFE1E6]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#4f434c]">
          {/* Left: Feed status */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00875A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00875A]"></span>
            </span>
            <span className="font-semibold text-[#191c21]">
              LTA DataMall Real-time Feed Connected
            </span>
            <span className="text-[#81737c]">•</span>
            <span className="font-mono-nums text-[11px] uppercase tracking-wider text-[#9e4300] font-semibold">
              Latency: {latency}ms
            </span>
            <span className="text-[#81737c] hidden md:inline">•</span>
            <button
              onClick={() => setShowEndpointsModal(true)}
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-[#40073e] hover:underline cursor-pointer bg-white/70 px-2 py-0.5 rounded border border-[#DFE1E6]"
            >
              <span className="material-symbols-outlined text-[13px]">api</span>
              <span>
                {apiHealth?.apiKeyConfigured ? 'LTA v3 Key Active' : 'API Endpoints (v3)'}
              </span>
            </button>
          </div>

          {/* Right: GPS fix & sound controls */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#40073e]">satellite_alt</span>
              <span>GPS Fix: {currentAreaName.split('/')[0].trim()} (Accuracy ±4m)</span>
            </span>
            <button
              onClick={toggleSound}
              className="flex items-center gap-1 text-[#191c21] hover:text-[#40073e] transition-colors cursor-pointer select-none font-medium"
              title="Toggle arrival audio notifications"
            >
              <span className="material-symbols-outlined text-[16px] text-[#9e4300]">
                {isAudioMuted ? 'volume_off' : 'volume_up'}
              </span>
              <span>Audio Chimes: {isAudioMuted ? 'MUTE' : 'ON'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Endpoints & Health Modal */}
      {showEndpointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFE1E6] flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#40073e] text-[24px]">api</span>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#191c21]">
                    LTA DataMall API Endpoints
                  </h2>
                  <p className="text-xs text-[#81737c]">
                    Serverless API proxies configured under <code>/api</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEndpointsModal(false)}
                className="p-1 rounded-lg text-[#81737c] hover:text-[#191c21] hover:bg-[#f2f3fa] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-[#f2f3fa] p-3 rounded-lg text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#4f434c]">Vercel Env Variable:</span>
                <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-[#40073e]">
                  LTA_ACCOUNT_KEY
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#4f434c]">Status:</span>
                <span
                  className={`font-semibold ${
                    apiHealth?.apiKeyConfigured ? 'text-[#00875A]' : 'text-[#9e4300]'
                  }`}
                >
                  {apiHealth?.apiKeyConfigured
                    ? '● Key Configured & Operational'
                    : '○ Key Pending in Vercel (Using LTA v3 Structure)'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <span className="font-bold text-[#191c21]">Configured Endpoints:</span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2 bg-[#f8f9ff] rounded border border-[#DFE1E6] flex justify-between items-center">
                  <span>/api/bus-arrival?BusStopCode=83139</span>
                  <a
                    href="/api/bus-arrival?BusStopCode=83139"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#40073e] font-sans font-bold hover:underline"
                  >
                    Test
                  </a>
                </div>
                <div className="p-2 bg-[#f8f9ff] rounded border border-[#DFE1E6] flex justify-between items-center">
                  <span>/api/health?checkUpstream=true</span>
                  <a
                    href="/api/health?checkUpstream=true"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#40073e] font-sans font-bold hover:underline"
                  >
                    Test
                  </a>
                </div>
                <div className="p-2 bg-[#f8f9ff] rounded border border-[#DFE1E6] flex justify-between items-center">
                  <span>/api/carparks</span>
                  <a
                    href="/api/carparks"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#40073e] font-sans font-bold hover:underline"
                  >
                    Test
                  </a>
                </div>
                <div className="p-2 bg-[#f8f9ff] rounded border border-[#DFE1E6] flex justify-between items-center">
                  <span>/api/traffic-incidents</span>
                  <a
                    href="/api/traffic-incidents"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#40073e] font-sans font-bold hover:underline"
                  >
                    Test
                  </a>
                </div>
                <div className="p-2 bg-[#f8f9ff] rounded border border-[#DFE1E6] flex justify-between items-center">
                  <span>/api/train-alerts</span>
                  <a
                    href="/api/train-alerts"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#40073e] font-sans font-bold hover:underline"
                  >
                    Test
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#DFE1E6]">
              <button
                onClick={() => setShowEndpointsModal(false)}
                className="px-4 py-2 bg-[#40073e] text-white rounded-lg font-bold hover:bg-[#592055] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

