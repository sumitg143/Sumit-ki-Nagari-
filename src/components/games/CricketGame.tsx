import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Volume2, Trophy, Flame } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine.ts';

interface CricketGameProps {
  lang: 'hi' | 'en';
  onClose: () => void;
}

type ShotType = 'drive' | 'pull' | 'six' | 'defend';

interface BallResult {
  ballNum: number;
  shot: ShotType;
  runs: number;
  isWicket: boolean;
  wicketType?: string;
  commentaryHi: string;
  commentaryEn: string;
}

export const CricketGame: React.FC<CricketGameProps> = ({ lang, onClose }) => {
  const [target] = useState(20); // Chase 20 runs in 6 balls
  const [totalBalls] = useState(6);
  const [currentBall, setCurrentBall] = useState(0);
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [history, setHistory] = useState<BallResult[]>([]);

  // Ball Delivery State
  const [isBowling, setIsBowling] = useState(false);
  const [ballDeliveryProgress, setBallDeliveryProgress] = useState(0); // 0 to 1
  const [ballType, setBallType] = useState<'fast' | 'yorker' | 'spin' | 'bouncer'>('fast');
  const [timingMeter, setTimingMeter] = useState(50); // 0 to 100 oscillating
  const [commentary, setCommentary] = useState<string>(
    lang === 'hi'
      ? 'क्रीज पर सुमित भाई तैयार! गेंदबाज रन-अप ले रहा है।'
      : 'Sumit is at the crease! Bowler is marking his run-up.'
  );
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Timing oscillating loop
  useEffect(() => {
    let forward = true;
    const interval = setInterval(() => {
      setTimingMeter((prev) => {
        if (prev >= 95) forward = false;
        if (prev <= 5) forward = true;
        return forward ? prev + 4 : prev - 4;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Handle bowling sequence
  const startDelivery = () => {
    if (isBowling || gameOver) return;
    setIsBowling(true);
    setBallDeliveryProgress(0);

    const types: ('fast' | 'yorker' | 'spin' | 'bouncer')[] = ['fast', 'yorker', 'spin', 'bouncer'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    setBallType(chosenType);

    let progress = 0;
    const animInterval = setInterval(() => {
      progress += 0.08;
      setBallDeliveryProgress(Math.min(progress, 1));
      if (progress >= 1) {
        clearInterval(animInterval);
      }
    }, 40);
  };

  // User plays shot
  const playShot = (shot: ShotType) => {
    if (!isBowling || ballDeliveryProgress < 0.4 || gameOver) {
      if (!isBowling) {
        setCommentary(
          lang === 'hi'
            ? 'पहले गेंद फेंकने के लिए "गेंद फेंको (Bowl)" दबाएँ!'
            : 'Click "Bowl Delivery" first!'
        );
      }
      return;
    }

    setIsBowling(false);

    // Calculate quality from timing meter (sweet spot: 45 to 65)
    const timingDiff = Math.abs(timingMeter - 55);
    let runs = 0;
    let isWicket = false;
    let wicketType = '';
    let comHi = '';
    let comEn = '';

    soundEngine.playRickshawHorn(); // Bat crack impact sound

    if (timingDiff <= 8) {
      // PERFECT TIMING!
      if (shot === 'six') {
        runs = 6;
        comHi = '🚀 गगनचुंबी छक्का! गेंद बाज़ार की छतों के पार गिरी!';
        comEn = '🚀 MASSIVE SIX! Ball flies clean over the bazaar rooftops!';
      } else if (shot === 'drive' || shot === 'pull') {
        runs = 4;
        comHi = '🏏 क्या कड़क शॉट है! गेंद गोली की रफ्तार से बाउंड्री पार!';
        comEn = '🏏 Crack of the willow! Smashed to the boundary rope!';
      } else {
        runs = 2;
        comHi = 'सटीक प्लेसमेंट! दौड़कर दो रन पूरे किए।';
        comEn = 'Clean tap and agile running for 2 runs.';
      }
    } else if (timingDiff <= 22) {
      // GOOD TIMING
      if (shot === 'six') {
        // High risk: caught or 4
        if (Math.random() > 0.4) {
          runs = 4;
          comHi = 'शानदार टाइमिंग! गेंद वन-बाउंस चार रन!';
          comEn = 'One-bounce four over extra cover!';
        } else {
          isWicket = true;
          wicketType = 'Caught at Long-on';
          comHi = 'हवा में गेंद... और फील्डर ने आसान कैच लपका! आउट!';
          comEn = 'In the air and taken cleanly at deep midwicket! Wicket!';
        }
      } else if (shot === 'drive') {
        runs = 2;
        comHi = 'कवर की दिशा में खूबसूरत ड्राइव, दो रन मिले!';
        comEn = 'Classy cover drive into the deep gap, 2 runs.';
      } else if (shot === 'pull') {
        runs = 3;
        comHi = 'गहराई में फील्डर का पीछा, तीन रन चुराए!';
        comEn = 'Deep fielder chases, brilliant 3 runs.';
      } else {
        runs = 1;
        comHi = 'संभलकर खेला गया डिफेन्स, सिंगल पूरा!';
        comEn = 'Soft defensive push into the gap for a single.';
      }
    } else {
      // POOR TIMING / MISTIMED
      if (ballType === 'yorker' || ballType === 'bouncer') {
        isWicket = true;
        wicketType = ballType === 'yorker' ? 'Clean Bowled' : 'Edged to Keeper';
        comHi = ballType === 'yorker' ? '💥 गिल्लियां बिखर गईं! क्लीन बोल्ड!' : 'गेंद बल्ले का किनारा लेकर विकेटकीपर के दस्तानों में!';
        comEn = ballType === 'yorker' ? '💥 Rattled the timber! Clean bowled!' : 'Thick outside edge flies straight to wicket-keeper!';
      } else {
        runs = 0;
        comHi = 'गेंद बल्ले पर नहीं आई! डॉट बॉल!';
        comEn = 'Beaten for pace! Dot ball.';
      }
    }

    const nextBalls = currentBall + 1;
    const nextScore = score + runs;
    const nextWickets = wickets + (isWicket ? 1 : 0);

    const result: BallResult = {
      ballNum: nextBalls,
      shot,
      runs,
      isWicket,
      wicketType,
      commentaryHi: comHi,
      commentaryEn: comEn,
    };

    setScore(nextScore);
    setWickets(nextWickets);
    setCurrentBall(nextBalls);
    setHistory((prev) => [...prev, result]);
    setCommentary(lang === 'hi' ? comHi : comEn);

    // Check Win / Loss
    if (nextScore >= target) {
      setWon(true);
      setGameOver(true);
      setCommentary(
        lang === 'hi'
          ? '🎉 बधाई! सुमित की नगरी ने ऐतिहासिक जीत दर्ज की!'
          : '🎉 VICTORY! Sumit Ki Nagri chased the target in style!'
      );
      soundEngine.playNamasteChime();
    } else if (nextWickets >= 2 || nextBalls >= totalBalls) {
      setWon(nextScore >= target);
      setGameOver(true);
      setCommentary(
        nextScore >= target
          ? lang === 'hi' ? '🎉 जीत गए!' : '🎉 You Won!'
          : lang === 'hi' ? 'हार गए! मैच समाप्त हुआ।' : 'Target missed! Better luck next over!'
      );
    }
  };

  const restartGame = () => {
    setCurrentBall(0);
    setScore(0);
    setWickets(0);
    setHistory([]);
    setGameOver(false);
    setWon(false);
    setIsBowling(false);
    setBallDeliveryProgress(0);
    setCommentary(
      lang === 'hi'
        ? 'नया मैच शुरू! पहली गेंद के लिए तैयार रहें।'
        : 'New match! Ready for the opening delivery.'
    );
  };

  return (
    <div className="flex flex-col h-full text-slate-100 p-3 sm:p-4 gap-3">
      {/* Scoreboard Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-amber-500/30">
        <div>
          <span className="text-xs text-amber-400 font-semibold block uppercase tracking-wider">
            {lang === 'hi' ? 'सुमित इलेवन बनाम बाज़ार रॉयल्स' : 'Sumit XI vs Bazaar Royals'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {score}/{wickets}
            </span>
            <span className="text-xs text-slate-400">
              ({currentBall}/{totalBalls} {lang === 'hi' ? 'गेंदें' : 'balls'})
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">
            {lang === 'hi' ? 'लक्ष्य (Target)' : 'Target'}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-amber-300">
            {target} <span className="text-xs text-slate-400">({target - score > 0 ? target - score : 0} {lang === 'hi' ? 'चाहिए' : 'needed'})</span>
          </span>
        </div>
      </div>

      {/* 2D Animated Cricket Stadium Pitch Canvas */}
      <div className="relative flex-1 min-h-[220px] bg-gradient-to-b from-sky-900 via-emerald-900 to-emerald-950 rounded-2xl overflow-hidden border border-emerald-500/30 flex flex-col items-center justify-center p-4">
        {/* Pitch Clay Strip */}
        <div className="relative w-48 sm:w-56 h-full bg-gradient-to-b from-amber-700/80 to-amber-800/90 rounded-md border-x-2 border-white/40 flex flex-col justify-between items-center py-3">
          {/* Bowling End */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-1 bg-white/70 mb-1" />
            <div className="text-2xl animate-bounce">🏃‍♂️</div>
            <span className="text-[10px] text-amber-200 font-bold">
              {ballType.toUpperCase()} BALL
            </span>
          </div>

          {/* Animated Cricket Ball */}
          {isBowling && (
            <div
              className="absolute w-4 h-4 rounded-full bg-red-600 border border-white shadow-md shadow-red-500/80 transition-all duration-75"
              style={{
                top: `${ballDeliveryProgress * 75 + 10}%`,
                left: `calc(50% + ${Math.sin(ballDeliveryProgress * Math.PI * 3) * (ballType === 'spin' ? 24 : 6)}px)`,
                transform: `scale(${1 + ballDeliveryProgress * 0.8})`,
              }}
            />
          )}

          {/* Batting Crease End */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-1 bg-white mb-1" />
            <div className="flex items-center gap-1 text-2xl">
              <span>🏏</span>
              <span>🧍‍♂️</span>
            </div>
            <span className="text-[10px] text-white font-bold bg-amber-600/80 px-2 py-0.5 rounded-full mt-1">
              सुमित गुप्ता (Sumit)
            </span>
          </div>
        </div>

        {/* Timing Meter Guide */}
        <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700 flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-300">
            <span>{lang === 'hi' ? 'शॉट टाइमिंग मीटर' : 'Shot Timing Meter'}</span>
            <span className="text-amber-400">
              {Math.abs(timingMeter - 55) < 10
                ? lang === 'hi' ? '🔥 सटीक (PERFECT!)' : '🔥 PERFECT!'
                : lang === 'hi' ? 'मध्यम' : 'Good'}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 bottom-0 w-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow"
              style={{ left: `${timingMeter}%` }}
            />
            {/* Sweet Spot Marker */}
            <div className="absolute top-0 bottom-0 left-[45%] w-[20%] bg-emerald-500/40 border-x border-emerald-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Commentary Box */}
      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/20 text-xs sm:text-sm text-amber-200 font-medium">
        {commentary}
      </div>

      {/* Controls: Bowl Delivery / Shot Action Buttons */}
      {!gameOver ? (
        <div className="flex flex-col gap-2">
          {!isBowling ? (
            <button
              onClick={startDelivery}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-orange-500/30 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>⚾</span>
              <span>{lang === 'hi' ? 'गेंद फेंको (Bowl Next Delivery)' : 'Bowl Next Delivery'}</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => playShot('six')}
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow active:scale-95 transition cursor-pointer flex flex-col items-center"
              >
                <span>🚀 छक्का (Lofted Six)</span>
                <span className="text-[10px] text-red-200">High Risk, 6 Runs</span>
              </button>

              <button
                onClick={() => playShot('drive')}
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow active:scale-95 transition cursor-pointer flex flex-col items-center"
              >
                <span>🏏 कवर ड्राइव (Drive)</span>
                <span className="text-[10px] text-blue-200">Safe, 2-4 Runs</span>
              </button>

              <button
                onClick={() => playShot('pull')}
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm shadow active:scale-95 transition cursor-pointer flex flex-col items-center"
              >
                <span>💥 पुल शॉट (Pull)</span>
                <span className="text-[10px] text-slate-900">Power, 1-4 Runs</span>
              </button>

              <button
                onClick={() => playShot('defend')}
                className="py-2.5 px-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm shadow active:scale-95 transition cursor-pointer flex flex-col items-center"
              >
                <span>🛡️ डिफेन्स (Defend)</span>
                <span className="text-[10px] text-slate-300">0-1 Run, No Out</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={restartGame}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow active:scale-98 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'hi' ? 'दोबारा खेलें (Play Again)' : 'Play Again'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
