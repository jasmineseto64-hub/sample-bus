/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { SignalBar } from './components/SignalBar';
import { SearchHero } from './components/SearchHero';
import { ArrivalCard } from './components/ArrivalCard';
import { OtherBusesList } from './components/OtherBusesList';
import { RouteTrajectory } from './components/RouteTrajectory';
import { NearbyStops } from './components/NearbyStops';
import { ServiceAlertBanner } from './components/ServiceAlertBanner';
import { TransitStandards } from './components/TransitStandards';
import { RouteDirectoryView } from './components/RouteDirectoryView';
import { FaresCalculatorView } from './components/FaresCalculatorView';
import { ServiceAlertsView } from './components/ServiceAlertsView';
import { MapModal } from './components/MapModal';
import { FleetInfoModal } from './components/FleetInfoModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { FeedbackModal } from './components/FeedbackModal';
import { SearchHelpModal } from './components/SearchHelpModal';
import { Footer } from './components/Footer';
import { BUS_SERVICES_DATA, BUS_STOPS_MAP } from './data/transitData';
import { transitAudio } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bus-arrival');
  const [selectedServiceNo, setSelectedServiceNo] = useState<string>('65');
  const [direction, setDirection] = useState<1 | 2>(1);
  const [currentStopCode, setCurrentStopCode] = useState<string>('09037');
  const [currentArea, setCurrentArea] = useState<string>('Dhoby Ghaut / Orchard Area, Singapore');

  // Bookmarks
  const [bookmarkedStops, setBookmarkedStops] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_bookmarks');
      return saved ? JSON.parse(saved) : ['09037'];
    } catch {
      return ['09037'];
    }
  });

  // Modals
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('sbs_bookmarks', JSON.stringify(bookmarkedStops));
    } catch {
      // ignore
    }
  }, [bookmarkedStops]);

  const toggleBookmarkCurrentStop = () => {
    setBookmarkedStops((prev) =>
      prev.includes(currentStopCode)
        ? prev.filter((c) => c !== currentStopCode)
        : [...prev, currentStopCode]
    );
  };

  const removeBookmark = (code: string) => {
    setBookmarkedStops((prev) => prev.filter((c) => c !== code));
  };

  const handleSelectService = (serviceNo: string) => {
    if (BUS_SERVICES_DATA[serviceNo]) {
      setSelectedServiceNo(serviceNo);
    }
  };

  const handleSelectStop = (stopCode: string) => {
    if (BUS_STOPS_MAP[stopCode]) {
      setCurrentStopCode(stopCode);
    }
  };

  const currentService = BUS_SERVICES_DATA[selectedServiceNo] || BUS_SERVICES_DATA['65'];
  const currentStop = BUS_STOPS_MAP[currentStopCode] || BUS_STOPS_MAP['09037'];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#191c21] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentArea={currentArea}
        onSelectArea={setCurrentArea}
        favoritesCount={bookmarkedStops.length}
        onOpenFavorites={() => {
          transitAudio.playClickSound();
          setIsFavoritesOpen(true);
        }}
        onOpenFeedback={() => {
          transitAudio.playClickSound();
          setIsFeedbackOpen(true);
        }}
        onOpenHelp={() => {
          transitAudio.playClickSound();
          setIsHelpOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="w-full pt-22 sm:pt-24 bg-[#F4F5F7] flex-1">
        {activeTab === 'bus-arrival' && (
          <div className="flex flex-col w-full">
            {/* Live Signal Telemetry Bar */}
            <SignalBar currentAreaName={currentArea} />

            {/* Primary App Workstation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex flex-col gap-6">
              {/* Top Search & Quick Selector Hero Strip */}
              <SearchHero
                selectedServiceNo={selectedServiceNo}
                onSelectService={handleSelectService}
                direction={direction}
                onToggleDirection={setDirection}
                currentStopCode={currentStopCode}
                onSelectStop={handleSelectStop}
              />

              {/* Main Workspace Split: Left (Arrival Cards) & Right (Schematic Corridor) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Spotlight Bus Service + Other Services (7 Columns) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <ArrivalCard
                    busService={currentService}
                    busStop={currentStop}
                    direction={direction}
                    isBookmarked={bookmarkedStops.includes(currentStopCode)}
                    onToggleBookmark={toggleBookmarkCurrentStop}
                    onShowFleetInfo={() => {
                      transitAudio.playClickSound();
                      setIsFleetModalOpen(true);
                    }}
                  />

                  <OtherBusesList
                    currentStopCode={currentStop.code}
                    selectedServiceNo={selectedServiceNo}
                    onSelectService={handleSelectService}
                  />
                </div>

                {/* Right Column: Live Route Corridor Schematic & Nearby Stops (5 Columns) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <RouteTrajectory
                    busService={currentService}
                    direction={direction}
                    currentStopCode={currentStop.code}
                    onOpenMapModal={() => setIsMapModalOpen(true)}
                  />

                  <NearbyStops
                    currentStopCode={currentStop.code}
                    onSelectStop={handleSelectStop}
                  />
                </div>
              </div>

              {/* Service Alert Banner (Formula 1 Grand Prix notice) */}
              <ServiceAlertBanner />

              {/* Singapore Transit Reference Standards */}
              <TransitStandards />
            </div>
          </div>
        )}

        {activeTab === 'route-directory' && (
          <RouteDirectoryView
            onSelectServiceToTrack={(serviceNo) => {
              setSelectedServiceNo(serviceNo);
              setActiveTab('bus-arrival');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'fares-travel-guide' && <FaresCalculatorView />}

        {activeTab === 'service-alerts' && <ServiceAlertsView />}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          transitAudio.playClickSound();
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Modals & Drawers */}
      <MapModal
        busService={currentService}
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectStop={handleSelectStop}
      />

      <FleetInfoModal
        busService={currentService}
        isOpen={isFleetModalOpen}
        onClose={() => setIsFleetModalOpen(false)}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        bookmarkedStops={bookmarkedStops}
        onRemoveBookmark={removeBookmark}
        onSelectStop={handleSelectStop}
        onSelectService={handleSelectService}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <SearchHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
