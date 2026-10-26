/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { CityScene, ClickEventData } from './scene/CityScene.ts';
import { Resident, INITIAL_RESIDENTS, CameraPreset, TimeOfDay, FestivalMode, WeatherType } from './types/city.ts';
import { Navbar } from './components/Navbar.tsx';
import { BottomDock } from './components/BottomDock.tsx';
import { ResidentModal } from './components/ResidentModal.tsx';
import { RegisterResidentModal } from './components/RegisterResidentModal.tsx';
import { CityDataModal } from './components/CityDataModal.tsx';
import { TourGuideOverlay } from './components/TourGuideOverlay.tsx';
import { EbookStoreModal } from './components/EbookStoreModal.tsx';
import { GamesHubModal } from './components/games/GamesHubModal.tsx';
import { AirportModal } from './components/AirportModal.tsx';
import { ShopInteriorModal } from './components/ShopInteriorModal.tsx';
import { TheaterModal } from './components/TheaterModal.tsx';
import { GameType } from './types/games.ts';
import { ShopInteriorType } from './types/city.ts';
import { soundEngine } from './audio/soundEngine.ts';

const STORAGE_KEY = 'sumit_nagri_residents_v1';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const citySceneRef = useRef<CityScene | null>(null);

  // Residents State with LocalStorage Persistence
  const [residents, setResidents] = useState<Resident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial
    }
    return INITIAL_RESIDENTS;
  });

  // App Settings State
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [soundMuted, setSoundMuted] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [festivalMode, setFestivalMode] = useState<FestivalMode>('none');
  const [weather, setWeather] = useState<WeatherType>('sunny');

  // Modals & Interactivity State
  const [selectedObject, setSelectedObject] = useState<ClickEventData | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCityDataOpen, setIsCityDataOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [isEbookStoreOpen, setIsEbookStoreOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isAirportOpen, setIsAirportOpen] = useState(false);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [isShopInteriorOpen, setIsShopInteriorOpen] = useState(false);
  const [activeShopInteriorType, setActiveShopInteriorType] = useState<ShopInteriorType>('gym');
  const [activeGame, setActiveGame] = useState<GameType>('cricket');
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  const handleOpenShopInterior = (type: ShopInteriorType = 'gym') => {
    setActiveShopInteriorType(type);
    setIsShopInteriorOpen(true);
  };

  // Save to LocalStorage whenever residents change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(residents));
    } catch (err) {
      console.warn('Could not save to localStorage:', err);
    }
  }, [residents]);

  // Initialize Three.js CityScene once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const scene = new CityScene(
      canvasMountRef.current,
      residents,
      (clickedData) => {
        if (clickedData.type === 'ebook_store') {
          setIsEbookStoreOpen(true);
        } else if (clickedData.type === 'theater') {
          setIsTheaterOpen(true);
        } else if (clickedData.type === 'sports_ground') {
          setIsGamesOpen(true);
        } else if (clickedData.type === 'airport' || clickedData.type === 'airplane') {
          setIsAirportOpen(true);
        } else {
          setSelectedObject(clickedData);
        }
      },
      (isHovered, label) => {
        setHoverLabel(isHovered && label ? label : null);
      }
    );

    citySceneRef.current = scene;

    return () => {
      scene.destroy();
      citySceneRef.current = null;
    };
  }, []); // Run once on mount

  // Sync Residents updates with 3D Scene
  useEffect(() => {
    if (citySceneRef.current) {
      citySceneRef.current.populateCity(residents);
    }
  }, [residents]);

  // Sync Camera Presets
  const handleSetCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    if (citySceneRef.current) {
      citySceneRef.current.setCameraPreset(preset);
    }
  };

  // Sync Time of Day
  const handleSetTimeOfDay = (time: TimeOfDay) => {
    setTimeOfDay(time);
    if (citySceneRef.current) {
      citySceneRef.current.setTimeOfDay(time);
    }
  };

  // Sync Festival Mode
  const handleSetFestivalMode = (mode: FestivalMode) => {
    setFestivalMode(mode);
    if (citySceneRef.current) {
      citySceneRef.current.setFestivalMode(mode);
    }
  };

  // Sync Weather Mode
  const handleSetWeather = (w: WeatherType) => {
    setWeather(w);
    if (citySceneRef.current) {
      citySceneRef.current.setWeather(w);
    }
  };

  // Add New Resident
  const handleAddResident = (newResident: Resident) => {
    setResidents((prev) => [newResident, ...prev]);
    // Zoom camera towards their mohalla
    if (newResident.mohalla === 'bazaar_chowk') {
      handleSetCameraPreset('bazaar');
    } else if (newResident.mohalla === 'station_road') {
      handleSetCameraPreset('station');
    } else if (newResident.mohalla === 'mandir_marg') {
      handleSetCameraPreset('temple');
    } else if (newResident.mohalla === 'hari_gaon') {
      handleSetCameraPreset('gaon');
    } else {
      handleSetCameraPreset('sumit_haveli');
    }
  };

  // Increment Namaste count
  const handleIncrementNamaste = (residentId: string) => {
    setResidents((prev) =>
      prev.map((r) =>
        r.id === residentId ? { ...r, namasteCount: r.namasteCount + 1 } : r
      )
    );
    if (selectedObject?.resident?.id === residentId) {
      setSelectedObject({
        ...selectedObject,
        resident: {
          ...selectedObject.resident,
          namasteCount: selectedObject.resident.namasteCount + 1,
        },
      });
    }
  };

  // Select resident from bottom dock search
  const handleSelectResident = (resident: Resident) => {
    setSelectedObject({
      type: 'resident',
      resident: resident,
    });
    if (resident.isFounder) {
      handleSetCameraPreset('sumit_haveli');
    } else if (resident.mohalla === 'bazaar_chowk') {
      handleSetCameraPreset('bazaar');
    } else if (resident.mohalla === 'station_road') {
      handleSetCameraPreset('station');
    } else if (resident.mohalla === 'mandir_marg') {
      handleSetCameraPreset('temple');
    } else if (resident.mohalla === 'hari_gaon') {
      handleSetCameraPreset('gaon');
    }
  };

  // Import residents from JSON
  const handleImportResidents = (imported: Resident[]) => {
    setResidents(imported);
  };

  // Reset to original defaults
  const handleResetDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setResidents(INITIAL_RESIDENTS);
    handleSetCameraPreset('overview');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Container (Isolated mount ref as per Three.js guidelines) */}
      <div ref={canvasMountRef} className="absolute inset-0 z-0 w-full h-full" />

      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        residentCount={residents.length}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenCityData={() => setIsCityDataOpen(true)}
        onStartTour={() => setIsTourActive(true)}
        onOpenEbookStore={() => setIsEbookStoreOpen(true)}
        onOpenGames={() => setIsGamesOpen(true)}
        onOpenAirport={() => setIsAirportOpen(true)}
        onOpenTheater={() => setIsTheaterOpen(true)}
      />

      {/* Hover Tooltip Indicator (Clean static badge over 3D model) */}
      {hoverLabel && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-3.5 py-1.5 rounded-full bg-slate-900/90 text-amber-300 text-xs font-semibold border border-amber-500/40 shadow-xl shadow-black/50 animate-fade-in flex items-center gap-1.5">
          <span>✨</span>
          <span>{hoverLabel}</span>
          <span className="text-[10px] text-slate-400 font-normal">
            ({lang === 'hi' ? 'क्लिक करें' : 'click'})
          </span>
        </div>
      )}

      {/* Guided Cinematic Tour Overlay */}
      <TourGuideOverlay
        isActive={isTourActive}
        onClose={() => setIsTourActive(false)}
        lang={lang}
        onSetCameraPreset={handleSetCameraPreset}
      />

      {/* Unified Collapsible Bottom Dock */}
      <BottomDock
        lang={lang}
        cameraPreset={cameraPreset}
        setCameraPreset={handleSetCameraPreset}
        timeOfDay={timeOfDay}
        setTimeOfDay={handleSetTimeOfDay}
        festivalMode={festivalMode}
        setFestivalMode={handleSetFestivalMode}
        weather={weather}
        setWeather={handleSetWeather}
        residents={residents}
        onSelectResident={handleSelectResident}
        onOpenEbookStore={() => setIsEbookStoreOpen(true)}
        onOpenGames={() => setIsGamesOpen(true)}
        onOpenAirport={() => setIsAirportOpen(true)}
        onOpenShopInterior={() => handleOpenShopInterior('gym')}
        onOpenTheater={() => setIsTheaterOpen(true)}
      />

      {/* Interactive Resident / Landmark Detail Modal */}
      <ResidentModal
        data={selectedObject}
        onClose={() => setSelectedObject(null)}
        lang={lang}
        onIncrementNamaste={handleIncrementNamaste}
        onOpenEbookStore={() => setIsEbookStoreOpen(true)}
        onOpenShopInterior={(type) => handleOpenShopInterior(type)}
      />

      {/* Swagat Kaksh - Register as New Resident Modal */}
      <RegisterResidentModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        lang={lang}
        onAddResident={handleAddResident}
        currentResidentCount={residents.length}
      />

      {/* City Data & city.json Export/Import Modal */}
      <CityDataModal
        isOpen={isCityDataOpen}
        onClose={() => setIsCityDataOpen(false)}
        lang={lang}
        residents={residents}
        onImportResidents={handleImportResidents}
        onResetDefaults={handleResetDefaults}
      />

      {/* Somo eBooks Store & Built-in Reader Modal */}
      <EbookStoreModal
        isOpen={isEbookStoreOpen}
        onClose={() => setIsEbookStoreOpen(false)}
        lang={lang}
      />

      {/* Games Arena Modal (Cricket, Football, Ludo, Kanche, Hockey) */}
      <GamesHubModal
        isOpen={isGamesOpen}
        onClose={() => setIsGamesOpen(false)}
        lang={lang}
        initialGame={activeGame}
      />

      {/* Sumit International Airport & Flight Tracker Modal */}
      <AirportModal
        isOpen={isAirportOpen}
        onClose={() => setIsAirportOpen(false)}
        lang={lang}
        flightStatus={citySceneRef.current?.getAirportFlightStatus()}
        onBoardFlight={() => handleSetCameraPreset('flight_ride')}
      />

      {/* Sumit Talkies 3D Cinema Multiplex Modal */}
      <TheaterModal
        isOpen={isTheaterOpen}
        onClose={() => setIsTheaterOpen(false)}
        lang={lang}
      />

      {/* 3D Shop & Building Interior Cutaway Inspector Modal */}
      <ShopInteriorModal
        isOpen={isShopInteriorOpen}
        onClose={() => setIsShopInteriorOpen(false)}
        lang={lang}
        initialShopType={activeShopInteriorType}
      />
    </div>
  );
}
