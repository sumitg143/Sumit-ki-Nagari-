import React, { useState, useEffect } from 'react';
import { RotateCcw, Award } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine.ts';

interface LudoGameProps {
  lang: 'hi' | 'en';
  onClose: () => void;
}

type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

interface Pawn {
  id: number;
  color: PlayerColor;
  step: number; // -1 = In Yard, 0-50 = On common track, 51-56 = In Home Column, 57 = Home Finish!
}

interface Player {
  color: PlayerColor;
  nameHi: string;
  nameEn: string;
  isAi: boolean;
  score: number;
}

export const LudoGame: React.FC<LudoGameProps> = ({ lang, onClose }) => {
  const [players] = useState<Player[]>([
    { color: 'red', nameHi: 'सुमित (आप)', nameEn: 'Sumit (You)', isAi: false, score: 0 },
    { color: 'green', nameHi: 'शर्मा जी (AI)', nameEn: 'Sharma Ji (AI)', isAi: true, score: 0 },
    { color: 'yellow', nameHi: 'चौधरी रमेश (AI)', nameEn: 'Ramesh (AI)', isAi: true, score: 0 },
    { color: 'blue', nameHi: 'अनन्या (AI)', nameEn: 'Ananya (AI)', isAi: true, score: 0 },
  ]);

  const [pawns, setPawns] = useState<Pawn[]>([
    // Red pawns
    { id: 1, color: 'red', step: -1 },
    { id: 2, color: 'red', step: -1 },
    // Green pawns
    { id: 3, color: 'green', step: -1 },
    { id: 4, color: 'green', step: -1 },
    // Yellow pawns
    { id: 5, color: 'yellow', step: -1 },
    { id: 6, color: 'yellow', step: -1 },
    // Blue pawns
    { id: 7, color: 'blue', step: -1 },
    { id: 8, color: 'blue', step: -1 },
  ]);

  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0); // 0 = Red
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [canRoll, setCanRoll] = useState(true);
  const [log, setLog] = useState<string>(
    lang === 'hi'
      ? 'आपकी बारी है! पासा फेंकने के लिए "पासा फेंकें" पर क्लिक करें।'
      : 'Your turn! Click "Roll Dice" to throw the dice.'
  );

  const curPlayer = players[currentPlayerIdx];

  // Roll Dice logic
  const handleRollDice = () => {
    if (!canRoll || isRolling) return;
    setIsRolling(true);
    setCanRoll(false);

    soundEngine.playRickshawHorn(); // Click/clatter sound

    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalVal);
        setIsRolling(false);
        processTurnAfterRoll(finalVal);
      }
    }, 45);
  };

  const processTurnAfterRoll = (roll: number) => {
    const playerPawns = pawns.filter((p) => p.color === curPlayer.color);

    // Find movable pawns
    const movable = playerPawns.filter((p) => {
      if (p.step === -1) return roll === 6; // Needs 6 to exit yard
      if (p.step >= 57) return false; // Already finished
      return p.step + roll <= 57;
    });

    if (movable.length === 0) {
      setLog(
        lang === 'hi'
          ? `${curPlayer.nameHi} को ${roll} मिला, कोई चाल संभव नहीं!`
          : `${curPlayer.nameEn} rolled a ${roll}, no moves possible!`
      );
      setTimeout(passTurn, 800);
    } else if (curPlayer.isAi) {
      // AI chooses pawn automatically
      setTimeout(() => {
        const chosen = movable[0];
        movePawn(chosen, roll);
      }, 700);
    } else {
      // Human turn: If only 1 movable, auto-move or let them tap
      if (movable.length === 1) {
        setTimeout(() => movePawn(movable[0], roll), 400);
      } else {
        setLog(
          lang === 'hi'
            ? `आपको ${roll} मिला! चाल चलने के लिए अपनी गोटी पर टैप करें।`
            : `You rolled a ${roll}! Tap a highlighted token to move.`
        );
      }
    }
  };

  const movePawn = (pawn: Pawn, roll: number) => {
    let nextStep = pawn.step;
    if (pawn.step === -1 && roll === 6) {
      nextStep = 0; // Starts track
    } else {
      nextStep += roll;
    }

    // Check token collision & capture (safe on step 0, 8, 21, etc.)
    let capturedOpponent = false;
    const updatedPawns = pawns.map((p) => {
      if (p.id === pawn.id) {
        return { ...p, step: nextStep };
      }
      // Check capture
      if (p.color !== pawn.color && p.step === nextStep && nextStep > 0 && nextStep < 51) {
        capturedOpponent = true;
        return { ...p, step: -1 }; // Send back to yard!
      }
      return p;
    });

    setPawns(updatedPawns);

    if (capturedOpponent) {
      soundEngine.playTrainWhistle();
      setLog(
        lang === 'hi'
          ? `💥 ज़बरदस्त! ${curPlayer.nameHi} ने विरोधी की गोटी काट दी!`
          : `💥 Captured! Opponent token knocked back to the yard!`
      );
    }

    if (roll === 6 || capturedOpponent) {
      // Bonus roll!
      setCanRoll(true);
      if (curPlayer.isAi) {
        setTimeout(handleRollDice, 1000);
      }
    } else {
      setTimeout(passTurn, 600);
    }
  };

  const passTurn = () => {
    const nextIdx = (currentPlayerIdx + 1) % players.length;
    setCurrentPlayerIdx(nextIdx);
    setDiceValue(null);
    setCanRoll(true);

    const nextPlayer = players[nextIdx];
    setLog(
      lang === 'hi'
        ? `${nextPlayer.nameHi} की बारी है...`
        : `${nextPlayer.nameEn}'s turn...`
    );

    if (nextPlayer.isAi) {
      setTimeout(handleRollDice, 900);
    }
  };

  const resetGame = () => {
    setPawns(pawns.map((p) => ({ ...p, step: -1 })));
    setCurrentPlayerIdx(0);
    setDiceValue(null);
    setCanRoll(true);
    setLog(lang === 'hi' ? 'नया लूडो खेल शुरू!' : 'New Ludo game started!');
  };

  return (
    <div className="flex flex-col h-full text-slate-100 p-3 sm:p-4 gap-3">
      {/* Top Banner & Active Turn Info */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30">
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full ${
              curPlayer.color === 'red'
                ? 'bg-red-500'
                : curPlayer.color === 'green'
                ? 'bg-emerald-500'
                : curPlayer.color === 'yellow'
                ? 'bg-amber-400'
                : 'bg-blue-500'
            } animate-pulse`}
          />
          <div>
            <span className="text-xs text-slate-400 block">
              {lang === 'hi' ? 'वर्तमान बारी' : 'Current Turn'}
            </span>
            <span className="text-sm sm:text-base font-bold text-white">
              {lang === 'hi' ? curPlayer.nameHi : curPlayer.nameEn}
            </span>
          </div>
        </div>

        {/* Dice Roller Display */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRollDice}
            disabled={!canRoll || curPlayer.isAi || isRolling}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg border-2 transition active:scale-90 ${
              !curPlayer.isAi && canRoll
                ? 'bg-amber-400 text-slate-950 border-amber-300 hover:bg-amber-300 cursor-pointer shadow-amber-500/40 animate-bounce'
                : 'bg-slate-800 text-slate-300 border-slate-700 opacity-80'
            }`}
          >
            {isRolling ? '🎲' : diceValue !== null ? diceValue : '🎲'}
          </button>
        </div>
      </div>

      {/* Realistic 2D Graphic Ludo Board */}
      <div className="relative flex-1 min-h-[260px] bg-slate-950 rounded-2xl border-2 border-emerald-600/40 p-2 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-[340px] aspect-square grid grid-cols-3 grid-rows-3 gap-1 bg-white p-1 rounded-xl shadow-2xl">
          {/* Quadrant 1: Red Yard */}
          <div className="bg-red-500 rounded-lg p-2 flex flex-col justify-between items-center relative">
            <span className="text-[10px] text-white font-bold">RED (लाल)</span>
            <div className="grid grid-cols-2 gap-2 bg-white/80 p-1.5 rounded-lg">
              {pawns
                .filter((p) => p.color === 'red')
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => diceValue && movePawn(p, diceValue)}
                    className={`w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-xs font-bold shadow ${
                      p.step === -1 ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    🔴
                  </button>
                ))}
            </div>
            <span className="text-[9px] text-red-100">सुमित</span>
          </div>

          {/* Top Track: Green Entry */}
          <div className="bg-slate-100 rounded-lg grid grid-cols-3 grid-rows-6 p-0.5 gap-0.5 text-[8px] font-bold text-center">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-center border border-slate-300 rounded ${
                  i % 3 === 1 ? 'bg-emerald-300' : 'bg-white'
                }`}
              >
                {i === 4 ? '⭐' : ''}
              </div>
            ))}
          </div>

          {/* Quadrant 2: Green Yard */}
          <div className="bg-emerald-600 rounded-lg p-2 flex flex-col justify-between items-center relative">
            <span className="text-[10px] text-white font-bold">GREEN (हरा)</span>
            <div className="grid grid-cols-2 gap-2 bg-white/80 p-1.5 rounded-lg">
              {pawns
                .filter((p) => p.color === 'green')
                .map((p) => (
                  <div
                    key={p.id}
                    className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-xs font-bold shadow"
                  >
                    🟢
                  </div>
                ))}
            </div>
            <span className="text-[9px] text-emerald-100">शर्मा जी</span>
          </div>

          {/* Left Track: Red Entry */}
          <div className="bg-slate-100 rounded-lg grid grid-cols-6 grid-rows-3 p-0.5 gap-0.5 text-[8px] font-bold text-center">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-center border border-slate-300 rounded ${
                  Math.floor(i / 6) === 1 ? 'bg-red-300' : 'bg-white'
                }`}
              >
                {i === 7 ? '⭐' : ''}
              </div>
            ))}
          </div>

          {/* Center Home Triangle */}
          <div className="bg-gradient-to-br from-red-500 via-amber-400 to-emerald-500 rounded-lg flex items-center justify-center text-lg shadow-inner">
            🏆
          </div>

          {/* Right Track: Yellow Entry */}
          <div className="bg-slate-100 rounded-lg grid grid-cols-6 grid-rows-3 p-0.5 gap-0.5 text-[8px] font-bold text-center">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-center border border-slate-300 rounded ${
                  Math.floor(i / 6) === 1 ? 'bg-amber-300' : 'bg-white'
                }`}
              >
                {i === 10 ? '⭐' : ''}
              </div>
            ))}
          </div>

          {/* Quadrant 4: Blue Yard */}
          <div className="bg-blue-600 rounded-lg p-2 flex flex-col justify-between items-center relative">
            <span className="text-[10px] text-white font-bold">BLUE (नीला)</span>
            <div className="grid grid-cols-2 gap-2 bg-white/80 p-1.5 rounded-lg">
              {pawns
                .filter((p) => p.color === 'blue')
                .map((p) => (
                  <div
                    key={p.id}
                    className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xs font-bold shadow"
                  >
                    🔵
                  </div>
                ))}
            </div>
            <span className="text-[9px] text-blue-100">अनन्या</span>
          </div>

          {/* Bottom Track: Blue Entry */}
          <div className="bg-slate-100 rounded-lg grid grid-cols-3 grid-rows-6 p-0.5 gap-0.5 text-[8px] font-bold text-center">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-center border border-slate-300 rounded ${
                  i % 3 === 1 ? 'bg-blue-300' : 'bg-white'
                }`}
              >
                {i === 13 ? '⭐' : ''}
              </div>
            ))}
          </div>

          {/* Quadrant 3: Yellow Yard */}
          <div className="bg-amber-500 rounded-lg p-2 flex flex-col justify-between items-center relative">
            <span className="text-[10px] text-slate-950 font-bold">YELLOW (पीला)</span>
            <div className="grid grid-cols-2 gap-2 bg-white/80 p-1.5 rounded-lg">
              {pawns
                .filter((p) => p.color === 'yellow')
                .map((p) => (
                  <div
                    key={p.id}
                    className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-xs font-bold shadow"
                  >
                    🟡
                  </div>
                ))}
            </div>
            <span className="text-[9px] text-amber-950">रमेश</span>
          </div>
        </div>
      </div>

      {/* Log ticker */}
      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-emerald-500/20 text-xs sm:text-sm text-emerald-200">
        {log}
      </div>

      {/* Footer Reset & Play Controls */}
      <div className="flex gap-2">
        <button
          onClick={resetGame}
          className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'रीसेट बोर्ड (Reset)' : 'Reset Board'}</span>
        </button>
      </div>
    </div>
  );
};
