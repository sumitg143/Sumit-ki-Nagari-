import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Trophy, Target, Sparkles } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine.ts';

interface KancheGameProps {
  lang: 'hi' | 'en';
  onClose: () => void;
}

interface Marble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isStriker?: boolean;
  isOut?: boolean;
}

export const KancheGame: React.FC<KancheGameProps> = ({ lang, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [aimAngle, setAimAngle] = useState(270); // Degrees (270 = straight up)
  const [power, setPower] = useState(65); // 10 to 100
  const [shotsLeft, setShotsLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [commentary, setCommentary] = useState<string>(
    lang === 'hi'
      ? 'निशाना साधें और "कंचा चलाओ" पर क्लिक करें!'
      : 'Aim your marble and release the shot!'
  );

  // Marbles state
  const marblesRef = useRef<Marble[]>([]);
  const ringRadius = 110; // Pixels from center
  const centerPos = { x: 175, y: 155 };

  // Initialize marbles inside ring
  const initMarbles = () => {
    const list: Marble[] = [];
    const colors = ['#38bdf8', '#22c55e', '#ef4444', '#a855f7', '#facc15', '#06b6d4', '#f97316'];

    // 7 target marbles scattered in center ring
    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * Math.PI * 2;
      const rad = 25 + (i % 2) * 35;
      list.push({
        id: i,
        x: centerPos.x + Math.cos(ang) * rad,
        y: centerPos.y + Math.sin(ang) * rad,
        vx: 0,
        vy: 0,
        radius: 9,
        color: colors[i],
        isOut: false,
      });
    }

    // Striker at bottom rim
    list.push({
      id: 99,
      x: centerPos.x,
      y: centerPos.y + ringRadius - 10,
      vx: 0,
      vy: 0,
      radius: 12,
      color: '#ffffff', // Big white glass striker
      isStriker: true,
      isOut: false,
    });

    marblesRef.current = list;
  };

  useEffect(() => {
    initMarbles();
  }, []);

  // Flick striker
  const handleFlick = () => {
    if (isSimulating || shotsLeft <= 0) return;

    setIsSimulating(true);
    setShotsLeft((prev) => prev - 1);

    soundEngine.playRickshawHorn(); // Click strike sound

    const rad = (aimAngle * Math.PI) / 180;
    const speed = (power / 100) * 16;

    const striker = marblesRef.current.find((m) => m.isStriker);
    if (striker) {
      striker.vx = Math.cos(rad) * speed;
      striker.vy = Math.sin(rad) * speed;
    }

    setCommentary(
      lang === 'hi'
        ? 'कंचा छूटा... निशाना जा लगा!'
        : 'Striker released! Rolling towards the target...'
    );
  };

  // Physics animation loop
  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const friction = 0.965;
      let anyMoving = false;

      // Update positions
      const list = marblesRef.current;
      for (let i = 0; i < list.length; i++) {
        const m = list[i];
        if (Math.abs(m.vx) > 0.05 || Math.abs(m.vy) > 0.05) {
          anyMoving = true;
          m.x += m.vx;
          m.y += m.vy;
          m.vx *= friction;
          m.vy *= friction;

          // Check if marble knocked out of ring
          const distFromCenter = Math.hypot(m.x - centerPos.x, m.y - centerPos.y);
          if (distFromCenter > ringRadius && !m.isOut && !m.isStriker) {
            m.isOut = true;
            setScore((s) => s + 50);
            soundEngine.playChaiClink(); // Clink sound
            setCommentary(
              lang === 'hi'
                ? '🎯 क्या निशाना है! कंचा घेरे से बाहर निकाल दिया (+50 अंक)!'
                : '🎯 Brilliant hit! Marble knocked out of the ring (+50 pts)!'
            );
          }
        } else {
          m.vx = 0;
          m.vy = 0;
        }
      }

      // Collisions between marbles
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const m1 = list[i];
          const m2 = list[j];
          const dx = m2.x - m1.x;
          const dy = m2.y - m1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = m1.radius + m2.radius;

          if (dist < minDist && dist > 0) {
            // Elastic 2D bounce
            const nx = dx / dist;
            const ny = dy / dist;
            const kx = m1.vx - m2.vx;
            const ky = m1.vy - m2.vy;
            const p = 2 * (nx * kx + ny * ky) / 2;

            m1.vx -= p * nx;
            m1.vy -= p * ny;
            m2.vx += p * nx;
            m2.vy += p * ny;

            // Separate overlap
            const overlap = (minDist - dist) / 2;
            m1.x -= nx * overlap;
            m1.y -= ny * overlap;
            m2.x += nx * overlap;
            m2.y += ny * overlap;
          }
        }
      }

      // Check if simulation ended
      if (!anyMoving && isSimulating) {
        setIsSimulating(false);
        // Reset striker to bottom rim
        const striker = list.find((m) => m.isStriker);
        if (striker) {
          striker.x = centerPos.x;
          striker.y = centerPos.y + ringRadius - 10;
          striker.vx = 0;
          striker.vy = 0;
        }
      }

      // ==========================================
      // RENDER CANVAS
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sandy ground
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Chalk Ring
      ctx.beginPath();
      ctx.arc(centerPos.x, centerPos.y, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner sand shade
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(centerPos.x, centerPos.y, ringRadius - 2, 0, Math.PI * 2);
      ctx.fill();

      // Aim Line (when not simulating)
      if (!isSimulating && shotsLeft > 0) {
        const striker = list.find((m) => m.isStriker);
        if (striker) {
          const rad = (aimAngle * Math.PI) / 180;
          const aimLen = (power / 100) * 80;
          ctx.beginPath();
          ctx.moveTo(striker.x, striker.y);
          ctx.lineTo(striker.x + Math.cos(rad) * aimLen, striker.y + Math.sin(rad) * aimLen);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Target pointer
          ctx.beginPath();
          ctx.arc(
            striker.x + Math.cos(rad) * aimLen,
            striker.y + Math.sin(rad) * aimLen,
            4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = '#ef4444';
          ctx.fill();
        }
      }

      // Render Marbles
      for (const m of list) {
        if (m.isOut) continue;

        // Shadow
        ctx.beginPath();
        ctx.arc(m.x + 2, m.y + 3, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fill();

        // Marble body
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.fill();

        // Glass highlight
        ctx.beginPath();
        ctx.arc(m.x - m.radius * 0.3, m.y - m.radius * 0.3, m.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.fill();
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [aimAngle, power, isSimulating, shotsLeft]);

  const resetGame = () => {
    initMarbles();
    setShotsLeft(5);
    setScore(0);
    setIsSimulating(false);
    setCommentary(
      lang === 'hi'
        ? 'नया खेल शुरू! कंचे घेरे में सज चुके हैं।'
        : 'New round! Marbles set in the ring.'
    );
  };

  return (
    <div className="flex flex-col h-full text-slate-100 p-3 sm:p-4 gap-3">
      {/* Score Header */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-amber-500/30">
        <div>
          <span className="text-xs text-amber-400 font-semibold block">
            {lang === 'hi' ? 'देसी कंचे / अंटी का खेल' : 'Desi Kanche / Marbles'}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>{score} {lang === 'hi' ? 'अंक' : 'Pts'}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">
            {lang === 'hi' ? 'बचे हुए कंचे/चांस' : 'Strikes Left'}
          </span>
          <span className="text-lg font-bold text-amber-300">
            {shotsLeft} / 5
          </span>
        </div>
      </div>

      {/* Physics Canvas */}
      <div className="relative flex-1 min-h-[260px] bg-amber-950 rounded-2xl overflow-hidden border-2 border-amber-600/40 flex items-center justify-center p-1">
        <canvas
          ref={canvasRef}
          width={350}
          height={310}
          className="rounded-xl shadow-inner max-w-full h-auto"
        />
      </div>

      {/* Aim & Power Controls */}
      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 font-medium min-w-[70px]">
            {lang === 'hi' ? 'निशाना (Aim):' : 'Aim Angle:'}
          </span>
          <input
            type="range"
            min={210}
            max={330}
            value={aimAngle}
            disabled={isSimulating || shotsLeft <= 0}
            onChange={(e) => setAimAngle(Number(e.target.value))}
            className="flex-1 accent-amber-500 cursor-pointer"
          />
          <span className="text-xs text-amber-400 font-bold w-10 text-right">
            {aimAngle}°
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 font-medium min-w-[70px]">
            {lang === 'hi' ? 'ताकत (Power):' : 'Power:'}
          </span>
          <input
            type="range"
            min={20}
            max={100}
            value={power}
            disabled={isSimulating || shotsLeft <= 0}
            onChange={(e) => setPower(Number(e.target.value))}
            className="flex-1 accent-orange-500 cursor-pointer"
          />
          <span className="text-xs text-orange-400 font-bold w-10 text-right">
            {power}%
          </span>
        </div>
      </div>

      {/* Commentary */}
      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/20 text-xs sm:text-sm text-amber-200">
        {commentary}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {shotsLeft > 0 ? (
          <button
            onClick={handleFlick}
            disabled={isSimulating}
            className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
              isSimulating
                ? 'bg-slate-800 text-slate-500'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-orange-500 shadow-orange-500/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'hi' ? '🔮 कंचा चलाओ (Strike Marble!)' : '🔮 Strike Marble!'}</span>
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
