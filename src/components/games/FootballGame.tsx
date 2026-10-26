import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Award, Zap, Shield, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../audio/soundEngine.ts';

interface FootballGameProps {
  lang: 'hi' | 'en';
}

type TargetSpot = 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'center';

export const FootballGame: React.FC<FootballGameProps> = ({ lang }) => {
  const [selectedSpot, setSelectedSpot] = useState<TargetSpot>('top_right');
  const [power, setPower] = useState(65);
  const [isPowerCycling, setIsPowerCycling] = useState(true);
  const [isShooting, setIsShooting] = useState(false);
  const [lastResult, setLastResult] = useState<'goal' | 'saved' | 'miss' | null>(null);
  const [score, setScore] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [goaliePos, setGoaliePos] = useState<TargetSpot>('center');
  const [streak, setStreak] = useState(0);

  // Power bar oscillation
  useEffect(() => {
    if (!isPowerCycling || isShooting) return;
    const interval = setInterval(() => {
      setPower((prev) => {
        const next = prev + 5;
        return next > 95 ? 30 : next;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [isPowerCycling, isShooting]);

  const handleShoot = () => {
    if (isShooting) return;
    setIsShooting(true);
    setIsPowerCycling(false);

    soundEngine.playWhistle();

    // Randomize goalie dive direction
    const spots: TargetSpot[] = ['top_left', 'top_right', 'bottom_left', 'bottom_right', 'center'];
    const randomGoalie = spots[Math.floor(Math.random() * spots.length)];
    setGoaliePos(randomGoalie);

    setTimeout(() => {
      setShotsTaken((prev) => prev + 1);

      // Outcome calculation:
      // If power is extreme (>92), small chance of hitting the post/miss
      if (power > 92 && Math.random() < 0.3) {
        setLastResult('miss');
        setStreak(0);
      } else if (randomGoalie === selectedSpot) {
        // Goalie saves it!
        setLastResult('saved');
        setStreak(0);
      } else {
        // GOAAAL!
        setLastResult('goal');
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        soundEngine.playGoalCheer();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ffffff'],
        });
      }

      setTimeout(() => {
        setIsShooting(false);
        setIsPowerCycling(true);
      }, 1200);
    }, 700);
  };

  const resetGame = () => {
    setScore(0);
    setShotsTaken(0);
    setStreak(0);
    setLastResult(null);
    setIsShooting(false);
    setIsPowerCycling(true);
  };

  return (
    <div className="flex flex-col h-full select-none text-slate-100 p-3 sm:p-4 gap-3 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950">
      {/* Top Match Bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <div>
            <h3 className="text-sm font-bold text-amber-200">
              {lang === 'hi' ? 'सुमित नगर पेनल्टी शूटआउट' : 'Sumit Nagri Penalty Shootout'}
            </h3>
            <p className="text-[10px] text-slate-400">
              {lang === 'hi' ? 'गोलकीपर को छका कर गोल दागिए' : 'Beat the keeper and strike the net'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              {lang === 'hi' ? 'गोल / प्रयास' : 'Goals / Shots'}
            </span>
            <div className="text-base font-extrabold text-emerald-400">
              {score} / {shotsTaken}
            </div>
          </div>
          {streak > 1 && (
            <div className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold text-amber-300 animate-pulse">
              🔥 {streak}x {lang === 'hi' ? 'लगातार' : 'Streak'}
            </div>
          )}
          <button
            onClick={resetGame}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Football Goal Pitch View */}
      <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-900/40 via-emerald-950 to-emerald-900 border-2 border-emerald-600/50 flex flex-col items-center justify-between p-3 shadow-inner">
        {/* Goal Post Frame */}
        <div className="relative w-72 sm:w-96 h-36 sm:h-44 border-4 border-slate-100 rounded-t-xl bg-slate-950/40 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Net Grid Pattern */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* 5 Clickable Target Zones */}
          <button
            onClick={() => setSelectedSpot('top_left')}
            className={`absolute top-2 left-2 w-14 h-12 rounded-lg border-2 border-dashed transition flex items-center justify-center text-xs font-bold cursor-pointer ${
              selectedSpot === 'top_left'
                ? 'border-amber-400 bg-amber-400/30 text-amber-200 shadow-lg'
                : 'border-slate-500/60 bg-slate-800/30 text-slate-400 hover:border-slate-300'
            }`}
          >
            ↖ Top L
          </button>

          <button
            onClick={() => setSelectedSpot('top_right')}
            className={`absolute top-2 right-2 w-14 h-12 rounded-lg border-2 border-dashed transition flex items-center justify-center text-xs font-bold cursor-pointer ${
              selectedSpot === 'top_right'
                ? 'border-amber-400 bg-amber-400/30 text-amber-200 shadow-lg'
                : 'border-slate-500/60 bg-slate-800/30 text-slate-400 hover:border-slate-300'
            }`}
          >
            ↗ Top R
          </button>

          <button
            onClick={() => setSelectedSpot('bottom_left')}
            className={`absolute bottom-2 left-2 w-14 h-12 rounded-lg border-2 border-dashed transition flex items-center justify-center text-xs font-bold cursor-pointer ${
              selectedSpot === 'bottom_left'
                ? 'border-amber-400 bg-amber-400/30 text-amber-200 shadow-lg'
                : 'border-slate-500/60 bg-slate-800/30 text-slate-400 hover:border-slate-300'
            }`}
          >
            ↙ Low L
          </button>

          <button
            onClick={() => setSelectedSpot('bottom_right')}
            className={`absolute bottom-2 right-2 w-14 h-12 rounded-lg border-2 border-dashed transition flex items-center justify-center text-xs font-bold cursor-pointer ${
              selectedSpot === 'bottom_right'
                ? 'border-amber-400 bg-amber-400/30 text-amber-200 shadow-lg'
                : 'border-slate-500/60 bg-slate-800/30 text-slate-400 hover:border-slate-300'
            }`}
          >
            ↘ Low R
          </button>

          <button
            onClick={() => setSelectedSpot('center')}
            className={`absolute w-14 h-12 rounded-lg border-2 border-dashed transition flex items-center justify-center text-xs font-bold cursor-pointer ${
              selectedSpot === 'center'
                ? 'border-amber-400 bg-amber-400/30 text-amber-200 shadow-lg'
                : 'border-slate-500/60 bg-slate-800/30 text-slate-400 hover:border-slate-300'
            }`}
          >
            🎯 Center
          </button>

          {/* Goalkeeper Character */}
          <div
            className={`absolute bottom-1 transition-all duration-500 ease-out flex flex-col items-center pointer-events-none ${
              goaliePos === 'top_left'
                ? '-translate-x-24 -translate-y-8 rotate-[-20deg]'
                : goaliePos === 'top_right'
                ? 'translate-x-24 -translate-y-8 rotate-[20deg]'
                : goaliePos === 'bottom_left'
                ? '-translate-x-24 translate-y-1 rotate-[-35deg]'
                : goaliePos === 'bottom_right'
                ? 'translate-x-24 translate-y-1 rotate-[35deg]'
                : 'translate-x-0 translate-y-0'
            }`}
          >
            {/* Goalie Gloves */}
            <div className="flex gap-4 -mb-1">
              <span className="text-base animate-bounce">🧤</span>
              <span className="text-base animate-bounce">🧤</span>
            </div>
            {/* Goalie Head */}
            <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-600 shadow" />
            {/* Goalie Jersey */}
            <div className="w-7 h-8 rounded-md bg-rose-600 border border-rose-800 flex items-center justify-center text-[9px] font-bold text-white shadow">
              1
            </div>
          </div>

          {/* Animated Football */}
          <div
            className={`absolute text-2xl transition-all duration-500 pointer-events-none ${
              isShooting
                ? selectedSpot === 'top_left'
                  ? 'top-4 left-6 scale-75 rotate-[360deg]'
                  : selectedSpot === 'top_right'
                  ? 'top-4 right-6 scale-75 rotate-[360deg]'
                  : selectedSpot === 'bottom_left'
                  ? 'bottom-4 left-6 scale-75 rotate-[360deg]'
                  : selectedSpot === 'bottom_right'
                  ? 'bottom-4 right-6 scale-75 rotate-[360deg]'
                  : 'top-12 scale-75 rotate-[360deg]'
                : 'bottom-[-20px] scale-100'
            }`}
          >
            ⚽
          </div>
        </div>

        {/* Penalty Spot Line on grass */}
        <div className="w-full flex items-center justify-center relative mt-1">
          <div className="w-4 h-4 rounded-full bg-white/80 shadow border border-slate-300" />
        </div>

        {/* Result Splash Notification */}
        {lastResult && (
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-2xl font-black text-lg sm:text-xl shadow-2xl animate-bounce border ${
              lastResult === 'goal'
                ? 'bg-emerald-500 text-white border-emerald-300'
                : lastResult === 'saved'
                ? 'bg-rose-600 text-white border-rose-300'
                : 'bg-amber-600 text-white border-amber-300'
            }`}
          >
            {lastResult === 'goal' && (lang === 'hi' ? '🎉 गोल! GOAAAL!' : '🎉 GOAAAL!')}
            {lastResult === 'saved' && (lang === 'hi' ? '🧤 शानदार सेव!' : '🧤 GREAT SAVE!')}
            {lastResult === 'miss' && (lang === 'hi' ? '🥅 गोलपोस्ट पर लगी!' : '🥅 HIT THE POST!')}
          </div>
        )}
      </div>

      {/* Power Bar & Shoot Controls */}
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1 text-amber-300">
            <Zap className="w-3.5 h-3.5" />
            {lang === 'hi' ? 'किक पॉवर (Power)' : 'Kick Power'}
          </span>
          <span className="text-slate-300 font-mono font-bold">{power}%</span>
        </div>

        {/* Power meter slider */}
        <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-75 ${
              power < 60
                ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                : power < 85
                ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                : 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
            }`}
            style={{ width: `${power}%` }}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleShoot}
          disabled={isShooting}
          className={`w-full py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
            isShooting
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white active:scale-[0.98]'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>
            {isShooting
              ? lang === 'hi'
                ? 'शॉट मारा जा रहा है...'
                : 'Striking...'
              : lang === 'hi'
              ? `⚽ किक मारें (${selectedSpot.replace('_', ' ').toUpperCase()})`
              : `⚽ STRIKE SHOT (${selectedSpot.replace('_', ' ').toUpperCase()})`}
          </span>
        </button>
      </div>
    </div>
  );
};
