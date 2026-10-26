import React, { useState } from 'react';
import { X, Trophy, Sparkles, ChevronRight } from 'lucide-react';
import { GameType, NAGRI_GAMES } from '../../types/games.ts';
import { CricketGame } from './CricketGame.tsx';
import { FootballGame } from './FootballGame.tsx';
import { LudoGame } from './LudoGame.tsx';
import { KancheGame } from './KancheGame.tsx';
import { HockeyGame } from './HockeyGame.tsx';

interface GamesHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  initialGame?: GameType;
}

export const GamesHubModal: React.FC<GamesHubModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialGame = 'cricket',
}) => {
  const [activeGame, setActiveGame] = useState<GameType>(initialGame);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl shadow-black/80 flex flex-col max-h-[92vh] overflow-hidden"
        style={{ animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-700/80 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-inner">
              🎮
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-100 font-heading">
                {lang === 'hi' ? 'सुमित नगर खेल मैदान (Games Arena)' : 'Sumit Nagri Sports Arena'}
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-300/80">
                {lang === 'hi'
                  ? 'क्रिकेट, फुटबॉल, लूडो, कंचे और हॉकी • असली गेम खेलें'
                  : 'Play Cricket, Football, Ludo, Marbles & Hockey in Real-Time'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Games Selector Tabs */}
        <div className="grid grid-cols-5 p-2 bg-slate-950/60 border-b border-slate-800 gap-1 sm:gap-2">
          {NAGRI_GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeGame === game.id
                  ? 'bg-gradient-to-r ' + game.color + ' text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-base sm:text-lg">{game.icon}</span>
              <span className="truncate text-[10px] sm:text-xs">
                {game.id === 'cricket'
                  ? lang === 'hi' ? 'क्रिकेट' : 'Cricket'
                  : game.id === 'football'
                  ? lang === 'hi' ? 'फुटबॉल' : 'Football'
                  : game.id === 'ludo'
                  ? lang === 'hi' ? 'लूडो' : 'Ludo'
                  : game.id === 'kanche'
                  ? lang === 'hi' ? 'कंचे' : 'Kanche'
                  : lang === 'hi' ? 'हॉकी' : 'Hockey'}
              </span>
            </button>
          ))}
        </div>

        {/* Active Game Body */}
        <div className="flex-1 overflow-y-auto">
          {activeGame === 'cricket' && <CricketGame lang={lang} onClose={onClose} />}
          {activeGame === 'football' && <FootballGame lang={lang} />}
          {activeGame === 'ludo' && <LudoGame lang={lang} onClose={onClose} />}
          {activeGame === 'kanche' && <KancheGame lang={lang} onClose={onClose} />}
          {activeGame === 'hockey' && <HockeyGame lang={lang} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};
