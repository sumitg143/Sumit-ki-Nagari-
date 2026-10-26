import React, { useState } from 'react';
import { RotateCcw, Trophy, Award, Sparkles } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine.ts';

interface HockeyGameProps {
  lang: 'hi' | 'en';
  onClose: () => void;
}

type ShotTarget = 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'center';

export const HockeyGame: React.FC<HockeyGameProps> = ({ lang, onClose }) => {
  const [selectedTarget, setSelectedTarget] = useState<ShotTarget>('top_right');
  const [power, setPower] = useState(75);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [goals, setGoals] = useState(0);
  const [history, setHistory] = useState<{ shot: ShotTarget; isGoal: boolean }[]>([]);
  const [isShooting, setIsShooting] = useState(false);
  const [goaliePos, setGoaliePos] = useState<'center' | 'left' | 'right'>('center');
  const [ballPos, setBallPos] = useState<{ x: number; y: number }>({ x: 50, y: 85 });
  const [commentary, setCommentary] = useState<string>(
    lang === 'hi'
      ? 'गोल का कोना चुनें और "हॉकी शॉट लगाओ" पर क्लिक करें!'
      : 'Choose your goal target corner and strike!'
  );
  const [gameOver, setGameOver] = useState(false);

  const handleShoot = () => {
    if (isShooting || gameOver) return;
    setIsShooting(true);

    soundEngine.playRickshawHorn(); // Hockey stick crack

    // Goalie chooses dive direction (center, left, or right)
    const goalieChoices: ('center' | 'left' | 'right')[] = ['center', 'left', 'right'];
    const goalieDive = goalieChoices[Math.floor(Math.random() * goalieChoices.length)];
    setGoaliePos(goalieDive);

    // Target coordinates in goal percent
    let targetX = 50;
    let targetY = 30;
    if (selectedTarget === 'top_left') {
      targetX = 20;
      targetY = 22;
    } else if (selectedTarget === 'top_right') {
      targetX = 80;
      targetY = 22;
    } else if (selectedTarget === 'bottom_left') {
      targetX = 22;
      targetY = 55;
    } else if (selectedTarget === 'bottom_right') {
      targetX = 78;
      targetY = 55;
    } else {
      targetX = 50;
      targetY = 40;
    }

    // Animate ball moving to target
    setBallPos({ x: targetX, y: targetY });

    setTimeout(() => {
      // Determine if Goal or Saved
      // If goalie dove same side as shot and high power wasn't used
      let isGoal = true;
      if (
        (goalieDive === 'left' && (selectedTarget === 'top_left' || selectedTarget === 'bottom_left')) ||
        (goalieDive === 'right' && (selectedTarget === 'top_right' || selectedTarget === 'bottom_right')) ||
        (goalieDive === 'center' && selectedTarget === 'center')
      ) {
        // 70% save chance if goalie guessed direction
        isGoal = power > 85 ? Math.random() > 0.4 : false;
      }

      setIsShooting(false);

      if (isGoal) {
        soundEngine.playNamasteChime();
        setGoals((g) => g + 1);
        setCommentary(
          lang === 'hi'
            ? '🥅 शानदार गोल! गेंद सीधे गोल पोस्ट की जाली में!'
            : '🥅 GOAL! Unstoppable strike right into the net!'
        );
      } else {
        setCommentary(
          lang === 'hi'
            ? '🧤 अद्भुत बचाव! मनप्रीत गोलकीपर ने डाइव लगाकर गेंद रोक ली!'
            : '🧤 SAVED! Goalkeeper pulled off a spectacular diving save!'
        );
      }

      const nextShots = shotsTaken + 1;
      setShotsTaken(nextShots);
      setHistory((prev) => [...prev, { shot: selectedTarget, isGoal }]);

      if (nextShots >= 5) {
        setGameOver(true);
      }

      // Reset ball position for next shot
      setTimeout(() => {
        setBallPos({ x: 50, y: 85 });
        setGoaliePos('center');
      }, 1000);
    }, 600);
  };

  const resetGame = () => {
    setShotsTaken(0);
    setGoals(0);
    setHistory([]);
    setGameOver(false);
    setIsShooting(false);
    setBallPos({ x: 50, y: 85 });
    setGoaliePos('center');
    setCommentary(
      lang === 'hi'
        ? 'नया पेनल्टी शूटआउट शुरू! 5 स्ट्रोक मिलेंगे।'
        : 'New 5-stroke shootout started!'
    );
  };

  return (
    <div className="flex flex-col h-full text-slate-100 p-3 sm:p-4 gap-3">
      {/* Score Header */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-rose-500/30">
        <div>
          <span className="text-xs text-rose-400 font-semibold block">
            {lang === 'hi' ? 'राष्ट्रीय खेल हॉकी • पेनल्टी शूटआउट' : 'Field Hockey Penalty Shootout'}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>{goals} / {shotsTaken} {lang === 'hi' ? 'गोल' : 'Goals'}</span>
          </div>
        </div>

        {/* 5-Shot Tracker Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] ${
                i < history.length
                  ? history[i].isGoal
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-red-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {i < history.length ? (history[i].isGoal ? '✓' : '✕') : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* 2D Goal Post & Pitch Arena */}
      <div className="relative flex-1 min-h-[240px] bg-gradient-to-b from-sky-900 via-teal-900 to-emerald-950 rounded-2xl overflow-hidden border-2 border-rose-500/30 flex items-center justify-center p-3">
        {/* Goal Netting Frame */}
        <div className="relative w-full max-w-[320px] h-[160px] bg-slate-900/40 border-4 border-white rounded-t-xl overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Net Wireframe Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Interactive Target Corners */}
          <div className="absolute inset-2 grid grid-cols-3 grid-rows-2 gap-2 z-10">
            <button
              onClick={() => setSelectedTarget('top_left')}
              className={`rounded-lg border-2 border-dashed flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                selectedTarget === 'top_left'
                  ? 'bg-rose-500/60 border-rose-400 text-white shadow-lg animate-pulse'
                  : 'border-white/40 text-white/60 hover:bg-white/20'
              }`}
            >
              बायाँ ऊपर
            </button>

            <button
              onClick={() => setSelectedTarget('center')}
              className={`rounded-lg border-2 border-dashed flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                selectedTarget === 'center'
                  ? 'bg-rose-500/60 border-rose-400 text-white shadow-lg animate-pulse'
                  : 'border-white/40 text-white/60 hover:bg-white/20'
              }`}
            >
              मध्य
            </button>

            <button
              onClick={() => setSelectedTarget('top_right')}
              className={`rounded-lg border-2 border-dashed flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                selectedTarget === 'top_right'
                  ? 'bg-rose-500/60 border-rose-400 text-white shadow-lg animate-pulse'
                  : 'border-white/40 text-white/60 hover:bg-white/20'
              }`}
            >
              दायाँ ऊपर
            </button>

            <button
              onClick={() => setSelectedTarget('bottom_left')}
              className={`rounded-lg border-2 border-dashed flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                selectedTarget === 'bottom_left'
                  ? 'bg-rose-500/60 border-rose-400 text-white shadow-lg animate-pulse'
                  : 'border-white/40 text-white/60 hover:bg-white/20'
              }`}
            >
              बायाँ नीचे
            </button>

            <div />

            <button
              onClick={() => setSelectedTarget('bottom_right')}
              className={`rounded-lg border-2 border-dashed flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                selectedTarget === 'bottom_right'
                  ? 'bg-rose-500/60 border-rose-400 text-white shadow-lg animate-pulse'
                  : 'border-white/40 text-white/60 hover:bg-white/20'
              }`}
            >
              दायाँ नीचे
            </button>
          </div>

          {/* Goalkeeper Manpreet */}
          <div
            className="absolute bottom-2 transition-all duration-300 flex flex-col items-center pointer-events-none z-20"
            style={{
              left:
                goaliePos === 'left'
                  ? '25%'
                  : goaliePos === 'right'
                  ? '75%'
                  : '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-3xl">🧤🧍‍♂️🧤</div>
            <span className="text-[9px] bg-yellow-500 text-slate-950 font-bold px-1.5 py-0.5 rounded shadow">
              मनप्रीत (Goalie)
            </span>
          </div>
        </div>

        {/* Animated Hockey Ball */}
        <div
          className="absolute w-5 h-5 rounded-full bg-white border border-slate-300 shadow-md shadow-white/80 transition-all duration-500 z-30 pointer-events-none"
          style={{
            left: `${ballPos.x}%`,
            top: `${ballPos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Striker Hockey Stick at bottom */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none z-10">
          <span className="text-3xl">🏑</span>
          <span className="text-xs bg-slate-900/90 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
            सुमित (Sumit)
          </span>
        </div>
      </div>

      {/* Power Slider */}
      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 flex items-center gap-3">
        <span className="text-xs text-slate-300 font-medium min-w-[70px]">
          {lang === 'hi' ? 'शॉट पावर:' : 'Power:'}
        </span>
        <input
          type="range"
          min={30}
          max={100}
          value={power}
          disabled={isShooting || gameOver}
          onChange={(e) => setPower(Number(e.target.value))}
          className="flex-1 accent-rose-500 cursor-pointer"
        />
        <span className="text-xs text-rose-400 font-bold w-10 text-right">
          {power}%
        </span>
      </div>

      {/* Commentary */}
      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-rose-500/20 text-xs sm:text-sm text-rose-200">
        {commentary}
      </div>

      {/* Action Button */}
      <div className="flex gap-2">
        {!gameOver ? (
          <button
            onClick={handleShoot}
            disabled={isShooting}
            className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
              isShooting
                ? 'bg-slate-800 text-slate-500'
                : 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white hover:from-rose-500 hover:to-pink-500 shadow-rose-600/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'hi' ? '🏑 हॉकी शॉट मारो (Shoot Penalty!)' : '🏑 Strike Penalty!'}</span>
          </button>
        ) : (
          <button
            onClick={resetGame}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow transition cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'hi' ? 'दोबारा खेलें (Play Again)' : 'Play Again'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
