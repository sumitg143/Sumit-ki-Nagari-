import React from 'react';
import { Volume2, VolumeX, Users, PlusCircle, FileCode, Compass, Sparkles, BookOpen } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine.ts';
import cityLogoImg from '../assets/images/sumit_city_logo_1792857780764.jpg';

interface NavbarProps {
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
  residentCount: number;
  onOpenRegister: () => void;
  onOpenCityData: () => void;
  onStartTour: () => void;
  onOpenEbookStore: () => void;
  onOpenGames: () => void;
  onOpenAirport: () => void;
  onOpenTheater?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  soundMuted,
  setSoundMuted,
  residentCount,
  onOpenRegister,
  onOpenCityData,
  onStartTour,
  onOpenEbookStore,
  onOpenGames,
  onOpenAirport,
  onOpenTheater,
}) => {
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundEngine.setMuted(next);
    if (!next) {
      soundEngine.startAmbient();
      soundEngine.playNamasteChime();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none p-3 sm:p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto">
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-900/85 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-amber-500/30 shadow-lg shadow-black/40">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-lg shadow-amber-500/25 flex-shrink-0 overflow-hidden ring-2 ring-amber-400/50">
            <img
              src={cityLogoImg}
              alt="सुमित की नगरी आधिकारिक राजमुद्रा"
              className="w-full h-full object-cover rounded-full shadow-inner"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg font-bold text-amber-100 tracking-wide font-heading">
                {lang === 'hi' ? 'सुमित की नगरी' : 'Sumit Ki Nagri'}
              </h1>
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {lang === 'hi' ? 'अपनी नगरी' : 'Apni Nagri 3D'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-200/70 hidden sm:block">
              {lang === 'hi'
                ? 'संस्थापक: सुमित गुप्ता • 3D डिजिटल नगर'
                : 'Founder: Sumit Gupta • Living 3D Indian Town'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-900/85 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-slate-700/60 shadow-lg shadow-black/40">
          {/* Residents Counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 text-amber-300 text-xs font-medium border border-amber-500/20">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {residentCount}{' '}
              <span className="hidden md:inline">
                {lang === 'hi' ? 'नागरिक' : 'residents'}
              </span>
            </span>
          </div>

          {/* Guided Tour Button */}
          <button
            onClick={onStartTour}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 hover:border-amber-500/40 transition cursor-pointer"
            title={lang === 'hi' ? 'नगरी दर्शन (टूर)' : 'Guided Tour'}
          >
            <Compass className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden md:inline">
              {lang === 'hi' ? 'नगरी दर्शन' : 'City Tour'}
            </span>
          </button>

          {/* Somo eBooks Store Button */}
          <button
            onClick={onOpenEbookStore}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-950/80 to-purple-950/80 hover:from-rose-900 hover:to-purple-900 text-rose-200 text-xs font-medium border border-rose-500/40 transition cursor-pointer shadow-sm shadow-rose-950"
            title="Somo eBooks Store"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">
              {lang === 'hi' ? 'सोमो ई-बुक्स' : 'Somo eBooks'}
            </span>
          </button>

          {/* Games Arena Button */}
          <button
            onClick={onOpenGames}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-orange-950/80 hover:from-amber-900 hover:to-orange-900 text-amber-200 text-xs font-medium border border-amber-500/40 transition cursor-pointer shadow-sm"
            title={lang === 'hi' ? 'खेल मैदान (क्रिकेट, लूडो, कंचे, हॉकी)' : 'Games Arena (Cricket, Ludo, Marbles, Hockey)'}
          >
            <span className="text-sm">🎮</span>
            <span className="hidden md:inline">
              {lang === 'hi' ? 'खेल मैदान' : 'Games Arena'}
            </span>
          </button>

          {/* Airport & Flight Button */}
          <button
            onClick={onOpenAirport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-950/80 to-blue-950/80 hover:from-sky-900 hover:to-blue-900 text-sky-200 text-xs font-medium border border-sky-500/40 transition cursor-pointer shadow-sm"
            title={lang === 'hi' ? 'सुमित इंटरनेशनल एयरपोर्ट एवं फ़्लाइट' : 'Airport & Flight'}
          >
            <span className="text-sm">✈️</span>
            <span className="hidden lg:inline">
              {lang === 'hi' ? 'एयरपोर्ट' : 'Airport'}
            </span>
          </button>

          {/* 3D Cinema Theater Button */}
          {onOpenTheater && (
            <button
              onClick={onOpenTheater}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-950/80 to-red-950/80 hover:from-rose-900 hover:to-red-900 text-rose-200 text-xs font-medium border border-rose-500/40 transition cursor-pointer shadow-sm"
              title={lang === 'hi' ? 'सुमित 3D टॉकीज (सिनेमा हॉल)' : 'Sumit 3D Cinema Theater'}
            >
              <span className="text-sm">🎬</span>
              <span className="hidden lg:inline">
                {lang === 'hi' ? '3D टॉकीज' : '3D Cinema'}
              </span>
            </button>
          )}

          {/* city.json Data Button */}
          <button
            onClick={onOpenCityData}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 hover:border-amber-500/40 transition cursor-pointer"
            title="city.json"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden lg:inline">city.json</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition cursor-pointer"
            title="Change Language"
          >
            {lang === 'hi' ? 'English' : 'हिंदी'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 sm:p-2 rounded-xl border transition cursor-pointer ${
              !soundMuted
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {!soundMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Become Resident Button */}
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-95 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>{lang === 'hi' ? 'नागरिक बनें' : 'Join Nagri'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
