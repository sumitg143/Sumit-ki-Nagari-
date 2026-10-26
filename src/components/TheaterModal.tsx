import React, { useState, useEffect, useRef } from 'react';
import { X, Film, Play, Pause, Ticket, Popcorn, Sparkles, Check, Armchair, QrCode, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../audio/soundEngine.ts';

interface TheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
}

interface Seat {
  id: string;
  row: string;
  num: number;
  tier: 'vip' | 'balcony' | 'club';
  price: number;
  status: 'available' | 'selected' | 'booked';
}

const INITIAL_SEATS: Seat[] = [
  // VIP Recliners (Row A)
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    id: `A${n}`,
    row: 'A',
    num: n,
    tier: 'vip' as const,
    price: 350,
    status: n === 3 ? ('booked' as const) : ('available' as const),
  })),
  // Balcony (Row B & C)
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    id: `B${n}`,
    row: 'B',
    num: n,
    tier: 'balcony' as const,
    price: 240,
    status: n === 2 || n === 7 ? ('booked' as const) : ('available' as const),
  })),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    id: `C${n}`,
    row: 'C',
    num: n,
    tier: 'balcony' as const,
    price: 240,
    status: n === 4 ? ('booked' as const) : ('available' as const),
  })),
  // Club (Row D & E)
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    id: `D${n}`,
    row: 'D',
    num: n,
    tier: 'club' as const,
    price: 180,
    status: n === 1 || n === 6 ? ('booked' as const) : ('available' as const),
  })),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    id: `E${n}`,
    row: 'E',
    num: n,
    tier: 'club' as const,
    price: 180,
    status: 'available' as const,
  })),
];

export const TheaterModal: React.FC<TheaterModalProps> = ({ isOpen, onClose, lang }) => {
  const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['A2']);
  const [isPlayingMovie, setIsPlayingMovie] = useState(true);
  const [hasBooked, setHasBooked] = useState(false);
  const [movieTime, setMovieTime] = useState(0);
  const [selectedSnacks, setSelectedSnacks] = useState<{ id: string; name: string; price: number }[]>([
    { id: 'popcorn', name: 'Caramel Popcorn', price: 120 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Movie Screen Canvas (Bollywood retro film simulation with projection rays)
  useEffect(() => {
    if (!isOpen) return;
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const renderMovie = () => {
      frame++;
      setMovieTime(frame);

      const w = canvas.width;
      const h = canvas.height;

      // Dark cinema background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      if (isPlayingMovie) {
        // Gradient cinematic stage
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.5, '#431407');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Moving Spotlight Rays
        ctx.save();
        ctx.globalAlpha = 0.35;
        const beamX = (Math.sin(frame * 0.03) + 1) * 0.5 * w;
        const beamGrad = ctx.createRadialGradient(beamX, 0, 10, beamX, h, 280);
        beamGrad.addColorStop(0, '#fef08a');
        beamGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();

        // Movie Title & Scene Simulation
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.fillText('सुमित की उड़ान • 3D', w / 2, h / 2 - 20);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.shadowBlur = 4;
        ctx.fillText('DIRECTED BY SUMIT GUPTA • DOLBY ATMOS 7.1', w / 2, h / 2 + 15);

        // Film Countdown circle pulsing
        const r = 24 + Math.sin(frame * 0.1) * 4;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 55, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`${(frame % 3) + 1}`, w / 2, h / 2 + 61);
      } else {
        // Paused screen
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(lang === 'hi' ? '⏸️ स्क्रीन रुकी हुई है (PAUSED)' : '⏸️ MOVIE SCREEN PAUSED', w / 2, h / 2);
      }

      animId = requestAnimationFrame(renderMovie);
    };

    renderMovie();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isPlayingMovie, lang]);

  if (!isOpen) return null;

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'booked') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  };

  const handleBookTickets = () => {
    if (selectedSeatIds.length === 0) return;
    soundEngine.playCinemaFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#e11d48', '#38bdf8', '#ffffff'],
    });

    // Mark seats as booked
    setSeats((prev) =>
      prev.map((s) => (selectedSeatIds.includes(s.id) ? { ...s, status: 'booked' } : s))
    );
    setHasBooked(true);
  };

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const ticketTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const snacksTotal = selectedSnacks.reduce((sum, sn) => sum + sn.price, 0);
  const grandTotal = ticketTotal + snacksTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div
        className="w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl shadow-black/90 flex flex-col max-h-[94vh] overflow-hidden"
        style={{ animation: 'scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-700/80 bg-gradient-to-r from-rose-950/50 via-slate-900 to-amber-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center text-xl shadow-inner">
              🎬
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-100 font-heading">
                {lang === 'hi' ? 'सुमित टॉकीज • 3D मूवी थिएटर' : 'Sumit Talkies 3D Cinema'}
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-300/80">
                {lang === 'hi'
                  ? 'रियल सीट बुकिंग, लाइव 3D स्क्रीन, पॉपकॉर्न एवं वीआईपी टिकट'
                  : 'Live 3D Cinema Screen, Recliner Seats & Ticket Booking'}
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

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {/* 1. Live Movie Screen Canvas */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-full max-w-2xl h-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-black flex items-center justify-center">
              <canvas ref={canvasRef} width={640} height={280} className="w-full h-full object-cover" />

              {/* Overlay Play/Pause Button */}
              <button
                onClick={() => setIsPlayingMovie(!isPlayingMovie)}
                className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-slate-950/75 hover:bg-slate-900 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer backdrop-blur"
              >
                {isPlayingMovie ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingMovie ? 'Pause Screen' : 'Play Screen'}</span>
              </button>

              {/* Curved Cinema Screen Label */}
              <div className="absolute top-2 left-3 px-2 py-0.5 rounded-md bg-rose-600/80 text-[10px] font-extrabold uppercase tracking-wider text-white">
                AUDITORIUM 1 • 3D DOLBY ATMOS
              </div>
            </div>

            {/* Silver Curved Screen Barrier */}
            <div className="w-3/4 h-2 bg-gradient-to-r from-slate-700 via-amber-200 to-slate-700 rounded-full shadow-lg shadow-amber-400/20" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400">
              {lang === 'hi' ? 'स्क्रीन इस तरफ है (ALL EYES THIS WAY)' : 'SCREEN THIS WAY'}
            </span>
          </div>

          {/* 2. Seat Layout Grid */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center gap-3">
            {/* Tier Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-rose-600 border border-rose-400" />
                <span className="text-slate-300">VIP Recliner (₹350)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-amber-600 border border-amber-400" />
                <span className="text-slate-300">Balcony (₹240)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-blue-600 border border-blue-400" />
                <span className="text-slate-300">Club (₹180)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-slate-700 border border-slate-600 opacity-60" />
                <span className="text-slate-400">{lang === 'hi' ? 'बुक हो चुका' : 'Booked'}</span>
              </div>
            </div>

            {/* Rows */}
            <div className="w-full flex flex-col items-center gap-2">
              {['A', 'B', 'C', 'D', 'E'].map((rowLetter) => {
                const rowSeats = seats.filter((s) => s.row === rowLetter);
                const isVip = rowLetter === 'A';

                return (
                  <div key={rowLetter} className="flex items-center gap-1 sm:gap-2">
                    <span className="w-5 text-right font-bold text-xs text-slate-400">{rowLetter}</span>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeatIds.includes(seat.id);
                        const isBooked = seat.status === 'booked';

                        return (
                          <button
                            key={seat.id}
                            disabled={isBooked}
                            onClick={() => toggleSeat(seat)}
                            className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold transition cursor-pointer relative ${
                              isBooked
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                                : isSelected
                                ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 scale-105 shadow-md shadow-emerald-500/50'
                                : seat.tier === 'vip'
                                ? 'bg-rose-700/80 hover:bg-rose-600 text-white border border-rose-500'
                                : seat.tier === 'balcony'
                                ? 'bg-amber-700/80 hover:bg-amber-600 text-white border border-amber-500'
                                : 'bg-blue-700/80 hover:bg-blue-600 text-white border border-blue-500'
                            }`}
                            title={`${seat.id} (${seat.tier.toUpperCase()}) - ₹${seat.price}`}
                          >
                            {seat.id}
                            {isBooked && (
                              <span className="absolute -top-1 -right-1 text-[8px]">👤</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Snacks & Concession Stand */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
              <Popcorn className="w-4 h-4 text-amber-400" />
              {lang === 'hi' ? 'सिनेमा स्नैक्स एवं रिफ्रेशमेंट्स' : 'Cinema Concessions & Snacks'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'popcorn', name: 'Caramel Popcorn', hindi: 'कैरमल पॉपकॉर्न', price: 120, icon: '🍿' },
                { id: 'samosa', name: 'Desi Samosa (2 pcs)', hindi: 'देशी समोसा', price: 60, icon: '🥟' },
                { id: 'cola', name: 'Cold Drink (Large)', hindi: 'ठंडी कोल्ड ड्रिंक', price: 80, icon: '🥤' },
                { id: 'chai', name: 'Cutting Masala Chai', hindi: 'मसाला चाय', price: 40, icon: '☕' },
              ].map((snack) => {
                const isChosen = selectedSnacks.some((s) => s.id === snack.id);
                return (
                  <button
                    key={snack.id}
                    onClick={() => {
                      if (isChosen) {
                        setSelectedSnacks((prev) => prev.filter((s) => s.id !== snack.id));
                      } else {
                        setSelectedSnacks((prev) => [...prev, snack]);
                      }
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isChosen
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-900 border-slate-700/70 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{snack.icon}</span>
                      <div>
                        <div className="text-[11px] font-bold leading-tight">
                          {lang === 'hi' ? snack.hindi : snack.name}
                        </div>
                        <div className="text-[10px] text-amber-400">₹{snack.price}</div>
                      </div>
                    </div>
                    {isChosen && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Generated VIP Ticket Pass (When booked or selected) */}
          {hasBooked && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-rose-950/80 border-2 border-amber-500/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-3xl">
                  🎟️
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-extrabold text-white">
                      CONFIRMED VIP TICKET
                    </span>
                    <span className="text-xs text-amber-300">#SN-TKT-7824</span>
                  </div>
                  <h3 className="text-base font-bold text-amber-100 mt-0.5">
                    सुमित की उड़ान • 3D (Sumit Ki Udaan)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Seats: <strong className="text-amber-300">{selectedSeatIds.join(', ')}</strong> • Today, 7:30 PM • Audi 1
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-slate-950 text-center">
                  <QrCode className="w-10 h-10 mx-auto" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">SCAN AT GATE</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-700/80 bg-slate-950 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">
              {lang === 'hi' ? 'सीटें:' : 'Seats:'}{' '}
              <strong className="text-white">
                {selectedSeatIds.length > 0 ? selectedSeatIds.join(', ') : 'None'}
              </strong>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-amber-300">
              ₹{grandTotal}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({selectedSeats.length} {lang === 'hi' ? 'टिकट' : 'tickets'} + {selectedSnacks.length} {lang === 'hi' ? 'स्नैक्स' : 'snacks'})
              </span>
            </div>
          </div>

          <button
            onClick={handleBookTickets}
            disabled={selectedSeatIds.length === 0}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl transition cursor-pointer ${
              selectedSeatIds.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white active:scale-95'
            }`}
          >
            <Ticket className="w-5 h-5" />
            <span>
              {hasBooked
                ? lang === 'hi'
                  ? 'टिकट कन्फर्म है! 🎉'
                  : 'Ticket Confirmed! 🎉'
                : lang === 'hi'
                ? `वीआईपी टिकट बुक करें (₹${grandTotal})`
                : `Book VIP Tickets (₹${grandTotal})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
