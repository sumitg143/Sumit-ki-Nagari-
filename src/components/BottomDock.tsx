import React, { useState } from 'react';
import {
  Camera,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  Coffee,
  Car,
  Train,
  Home,
  MapPin,
  BookOpen,
  CloudRain,
  Snowflake,
} from 'lucide-react';
import { CameraPreset, TimeOfDay, FestivalMode, Resident, WeatherType } from '../types/city.ts';
import { soundEngine } from '../audio/soundEngine.ts';

interface BottomDockProps {
  lang: 'hi' | 'en';
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  festivalMode: FestivalMode;
  setFestivalMode: (fest: FestivalMode) => void;
  weather: WeatherType;
  setWeather: (w: WeatherType) => void;
  residents: Resident[];
  onSelectResident: (resident: Resident) => void;
  onOpenEbookStore?: () => void;
  onOpenGames?: () => void;
  onOpenAirport?: () => void;
  onOpenShopInterior?: () => void;
  onOpenTheater?: () => void;
}

type TabType = 'views' | 'time' | 'weather' | 'festivals' | 'residents';

export const BottomDock: React.FC<BottomDockProps> = ({
  lang,
  cameraPreset,
  setCameraPreset,
  timeOfDay,
  setTimeOfDay,
  festivalMode,
  setFestivalMode,
  weather,
  setWeather,
  residents,
  onSelectResident,
  onOpenEbookStore,
  onOpenGames,
  onOpenAirport,
  onOpenShopInterior,
  onOpenTheater,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('views');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResidents = residents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.hindiName && r.hindiName.includes(searchQuery)) ||
      r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRickshawHorn = () => {
    soundEngine.playRickshawHorn();
  };

  const handleTempleBell = () => {
    soundEngine.playTempleBell();
  };

  const handleChaiSound = () => {
    soundEngine.playChaiClink();
  };

  const handleTrainWhistle = () => {
    soundEngine.playTrainWhistle();
  };

  const views: { id: CameraPreset; icon: string; labelHi: string; labelEn: string }[] = [
    { id: 'isometric', icon: '📐', labelHi: '3D आइसोमेट्रिक', labelEn: '3D Isometric' },
    { id: 'overview', icon: '🌐', labelHi: 'पूरा नगर', labelEn: 'Overview' },
    { id: 'theater', icon: '🎬', labelHi: 'सुमित टॉकीज', labelEn: '3D Cinema' },
    { id: 'police_thana', icon: '🚨', labelHi: 'पुलिस थाना एवं जेल', labelEn: 'Police & Jail' },
    { id: 'park_pool', icon: '🏊', labelHi: 'पार्क एवं स्विमिंग पूल', labelEn: 'Park & Pool' },
    { id: 'train_ride', icon: '🚂', labelHi: 'ट्रेन की सवारी', labelEn: 'Train Ride' },
    { id: 'flight_ride', icon: '✈️', labelHi: 'विमान यात्रा', labelEn: 'Flight Ride' },
    { id: 'sumit_haveli', icon: '🏛️', labelHi: 'सुमित निवास', labelEn: 'Sumit Niwas' },
    { id: 'temple', icon: '🛕', labelHi: 'शांति मंदिर', labelEn: 'Mandir Aarti' },
    { id: 'hospital', icon: '🏥', labelHi: 'सुमित हॉस्पिटल', labelEn: 'Hospital' },
    { id: 'gym', icon: '🏋️', labelHi: 'सुमित जिम', labelEn: 'Gym' },
    { id: 'school', icon: '🏫', labelHi: 'सुमित स्कूल', labelEn: 'School' },
    { id: 'hotel', icon: '🏨', labelHi: 'सुमित होटल', labelEn: 'Hotel' },
    { id: 'restaurant', icon: '🍽️', labelHi: 'शाही रेस्टोरेंट', labelEn: 'Restaurant' },
    { id: 'medical_store', icon: '💊', labelHi: 'सुमित मेडिकल', labelEn: 'Medical' },
    { id: 'bazaar', icon: '☕', labelHi: 'बाज़ार चौक', labelEn: 'Bazaar' },
    { id: 'ebook_store', icon: '📚', labelHi: 'सोमो ई-बुक्स', labelEn: 'eBooks Store' },
    { id: 'sports_ground', icon: '⚽', labelHi: 'खेल मैदान (फुटबॉल)', labelEn: 'Sports Ground' },
    { id: 'flight', icon: '🛫', labelHi: 'हवाई दर्शन', labelEn: 'Flight Tour' },
    { id: 'station', icon: '🚉', labelHi: 'रेलवे स्टेशन', labelEn: 'Station' },
    { id: 'gaon', icon: '🌾', labelHi: 'हरि गाँव', labelEn: 'Gaon' },
    { id: 'rickshaw', icon: '🛺', labelHi: 'ऑटो सवारी', labelEn: 'Auto Ride' },
  ];

  const times: { id: TimeOfDay; icon: typeof Sun; labelHi: string; labelEn: string; color: string }[] = [
    { id: 'morning', icon: Sunrise, labelHi: 'भोर (सुबह)', labelEn: 'Morning', color: 'text-amber-400' },
    { id: 'afternoon', icon: Sun, labelHi: 'दोपहर', labelEn: 'Day', color: 'text-yellow-400' },
    { id: 'sunset', icon: Sunset, labelHi: 'संध्या (गोधूलि)', labelEn: 'Sunset', color: 'text-orange-500' },
    { id: 'night', icon: Moon, labelHi: 'रात (दीपक)', labelEn: 'Night', color: 'text-blue-400' },
  ];

  const weathers: { id: WeatherType; icon: string; labelHi: string; labelEn: string; color: string }[] = [
    { id: 'sunny', icon: '☀️', labelHi: 'धूप (Sunny)', labelEn: 'Sunny Day', color: 'text-yellow-400' },
    { id: 'rain', icon: '🌧️', labelHi: 'बारिश (Rainfall)', labelEn: 'Rain & Storm', color: 'text-blue-400' },
    { id: 'snow', icon: '❄️', labelHi: 'बर्फबारी (Snow)', labelEn: 'Snowfall', color: 'text-sky-200' },
  ];

  const festivals: { id: FestivalMode; icon: string; labelHi: string; labelEn: string }[] = [
    { id: 'none', icon: '☀️', labelHi: 'दैनिक जीवन', labelEn: 'Normal' },
    { id: 'diwali', icon: '🪔', labelHi: 'दीपावली (रोशनी)', labelEn: 'Diwali Diyas' },
    { id: 'holi', icon: '🎨', labelHi: 'होली (गुलाल)', labelEn: 'Holi Colors' },
    { id: 'patang', icon: '🪁', labelHi: 'पतंग उत्सव', labelEn: 'Kite Festival' },
  ];

  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-full px-3 flex flex-col items-center pointer-events-none transition-all duration-300"
      style={{ maxWidth: 'min(940px, 96vw)' }}
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-1 rounded-t-xl bg-slate-900/95 text-amber-300 hover:text-amber-200 border-t border-x border-amber-500/30 text-xs font-semibold shadow-md cursor-pointer transition active:scale-95"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'कंट्रोल खोलें' : 'Show Controls'}</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'कंट्रोल छिपाएँ' : 'Hide Controls'}</span>
          </>
        )}
      </button>

      {/* Main Unified Dock Panel */}
      {!isCollapsed && (
        <div className="pointer-events-auto w-full bg-slate-900/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-amber-500/30 shadow-2xl shadow-black/60 flex flex-col gap-2">
          {/* Top Bar: Tabs & Quick City Sound Actions */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pb-2 border-b border-slate-700/60">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('views')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  activeTab === 'views'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'कैमरा दृश्य' : 'Views'}</span>
              </button>
              <button
                onClick={() => setActiveTab('time')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  activeTab === 'time'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'पहर (समय)' : 'Time'}</span>
              </button>
              <button
                onClick={() => setActiveTab('weather')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  activeTab === 'weather'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'मौसम' : 'Weather'}</span>
              </button>
              <button
                onClick={() => setActiveTab('festivals')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  activeTab === 'festivals'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'उत्सव' : 'Festivals'}</span>
              </button>
              <button
                onClick={() => setActiveTab('residents')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  activeTab === 'residents'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'मोहल्ला निवासी' : 'Residents'}</span>
              </button>
            </div>

            {/* Quick Interactive City Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleRickshawHorn}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 text-[11px] font-medium transition cursor-pointer"
                title="Po-Po! Horn"
              >
                <Car className="w-3 h-3" />
                <span>{lang === 'hi' ? 'ऑटो हॉर्न' : 'Auto Horn'}</span>
              </button>
              <button
                onClick={handleTempleBell}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 hover:bg-amber-900/80 text-[11px] font-medium transition cursor-pointer"
                title="Ring Bell"
              >
                <Bell className="w-3 h-3" />
                <span>{lang === 'hi' ? 'मंदिर घंटी' : 'Bell'}</span>
              </button>
              <button
                onClick={handleChaiSound}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-950/70 border border-orange-500/40 text-orange-300 hover:bg-orange-900/80 text-[11px] font-medium transition cursor-pointer"
                title="Order Chai"
              >
                <Coffee className="w-3 h-3" />
                <span>{lang === 'hi' ? 'कुल्हड़ चाय' : 'Chai'}</span>
              </button>
              <button
                onClick={handleTrainWhistle}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-950/70 border border-blue-500/40 text-blue-300 hover:bg-blue-900/80 text-[11px] font-medium transition cursor-pointer"
                title="Train Whistle"
              >
                <Train className="w-3 h-3" />
                <span>{lang === 'hi' ? 'ट्रेन सीटी' : 'Train'}</span>
              </button>
              {onOpenEbookStore && (
                <button
                  onClick={onOpenEbookStore}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80 text-[11px] font-medium transition cursor-pointer"
                  title="Somo eBooks Store"
                >
                  <BookOpen className="w-3 h-3 text-rose-400" />
                  <span>{lang === 'hi' ? 'ई-बुक्स' : 'eBooks'}</span>
                </button>
              )}
              {onOpenGames && (
                <button
                  onClick={onOpenGames}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 hover:bg-amber-900/80 text-[11px] font-medium transition cursor-pointer"
                  title="Play Games"
                >
                  <span className="text-xs">🎮</span>
                  <span>{lang === 'hi' ? 'खेलें' : 'Games'}</span>
                </button>
              )}
              {onOpenAirport && (
                <button
                  onClick={onOpenAirport}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-950/70 border border-sky-500/40 text-sky-300 hover:bg-sky-900/80 text-[11px] font-medium transition cursor-pointer"
                  title="Airport & Flight"
                >
                  <span className="text-xs">✈️</span>
                  <span>{lang === 'hi' ? 'फ़्लाइट' : 'Flight'}</span>
                </button>
              )}
              {onOpenTheater && (
                <button
                  onClick={onOpenTheater}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80 text-[11px] font-medium transition cursor-pointer"
                  title="Sumit Talkies 3D Cinema"
                >
                  <span className="text-xs">🎬</span>
                  <span>{lang === 'hi' ? 'टॉकीज' : 'Cinema'}</span>
                </button>
              )}
              {onOpenShopInterior && (
                <button
                  onClick={onOpenShopInterior}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 font-bold text-[11px] shadow transition cursor-pointer"
                  title="View Shop & Establishment Interiors"
                >
                  <span className="text-xs">🏢</span>
                  <span>{lang === 'hi' ? 'दुकान अंदर देखें' : 'Inside Shops'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab 1: Camera Views */}
          {activeTab === 'views' && (
            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-1.5 sm:gap-2 pt-1 max-h-48 overflow-y-auto">
              {views.map((v) => {
                const active = cameraPreset === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setCameraPreset(v.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs transition cursor-pointer ${
                      active
                        ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-200 font-semibold'
                        : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-base sm:text-lg mb-0.5">{v.icon}</span>
                    <span className="truncate w-full text-center text-[11px]">
                      {lang === 'hi' ? v.labelHi : v.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Time of Day */}
          {activeTab === 'time' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {times.map((t) => {
                const IconComponent = t.icon;
                const active = timeOfDay === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTimeOfDay(t.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs transition cursor-pointer ${
                      active
                        ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-200 font-semibold'
                        : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${t.color}`} />
                    <span>{lang === 'hi' ? t.labelHi : t.labelEn}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 3: Dynamic Weather System */}
          {activeTab === 'weather' && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              {weathers.map((w) => {
                const active = weather === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setWeather(w.id)}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      active
                        ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-200 shadow'
                        : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-lg">{w.icon}</span>
                    <span className={w.color}>{lang === 'hi' ? w.labelHi : w.labelEn}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 3: Festive Mode */}
          {activeTab === 'festivals' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {festivals.map((f) => {
                const active = festivalMode === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFestivalMode(f.id);
                      if (f.id === 'diwali') {
                        soundEngine.playFirecracker();
                      }
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs transition cursor-pointer ${
                      active
                        ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-200 font-semibold'
                        : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-base">{f.icon}</span>
                    <span>{lang === 'hi' ? f.labelHi : f.labelEn}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 4: Residents Directory */}
          {activeTab === 'residents' && (
            <div className="flex flex-col gap-2 pt-1">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'hi'
                      ? 'निवासी या दूकान का नाम खोजें...'
                      : 'Search residents or shops...'
                  }
                  className="w-full bg-slate-800/90 border border-slate-700 text-slate-100 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Resident chips list */}
              <div className="flex gap-2 overflow-x-auto pb-1 max-h-24">
                {filteredResidents.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelectResident(r)}
                    className="flex-shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-500/40 text-left transition cursor-pointer"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow"
                      style={{ backgroundColor: r.colorTheme || '#d97706' }}
                    >
                      {r.isFounder ? '👑' : `#${r.houseNumber}`}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100 truncate max-w-[110px]">
                        {lang === 'hi' && r.hindiName ? r.hindiName : r.name}
                      </div>
                      <div className="text-[10px] text-amber-300/80 truncate max-w-[110px]">
                        {lang === 'hi' && r.roleHindi ? r.roleHindi : r.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
