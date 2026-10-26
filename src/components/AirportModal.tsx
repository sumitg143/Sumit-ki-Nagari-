import React from 'react';
import { X, Plane, Compass, Navigation, Wind, Sparkles, CheckCircle2, MapPin } from 'lucide-react';
import { FlightStatus } from '../scene/models/buildAirport.ts';

interface AirportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  flightStatus?: FlightStatus;
  onBoardFlight: () => void;
}

export const AirportModal: React.FC<AirportModalProps> = ({
  isOpen,
  onClose,
  lang,
  flightStatus,
  onBoardFlight,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl bg-slate-900 border-2 border-sky-500/40 rounded-3xl shadow-2xl shadow-sky-950/80 flex flex-col max-h-[92vh] overflow-hidden"
        style={{ animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/80 bg-gradient-to-r from-sky-950/60 via-slate-900 to-sky-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-xl shadow-lg shadow-sky-500/30 text-white">
              ✈️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-sky-100 font-heading">
                {lang === 'hi'
                  ? 'सुमित इंटरनेशनल एयरपोर्ट (Terminal 1)'
                  : 'Sumit International Airport (Terminal 1)'}
              </h2>
              <p className="text-[11px] sm:text-xs text-sky-300/80">
                {lang === 'hi'
                  ? 'उड़ान संख्या: SN-777 • हवाई दर्शन एवं बोर्डिंग'
                  : 'Flight SN-777 • Scenic Sky Tour & Boarding'}
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

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto flex flex-col gap-4">
          {/* Live Flight Information Board */}
          <div className="bg-slate-950/90 rounded-2xl p-3.5 border border-sky-500/30 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'लाइव उड़ान स्थिति' : 'Live Flight Radar'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {flightStatus?.status || 'AIRBORNE • IN FLIGHT'}
              </span>
            </div>

            {/* Flight Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'hi' ? 'ऊँचाई (Altitude)' : 'Altitude'}
                </span>
                <span className="text-sm sm:text-base font-bold text-white">
                  {flightStatus ? flightStatus.altitude : '3,500'} ft
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'hi' ? 'गति (Airspeed)' : 'Airspeed'}
                </span>
                <span className="text-sm sm:text-base font-bold text-sky-300">
                  {flightStatus ? flightStatus.speedKmh : '540'} km/h
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">
                  {lang === 'hi' ? 'रनवे' : 'Runway'}
                </span>
                <span className="text-sm sm:text-base font-bold text-amber-300">
                  09 / 27
                </span>
              </div>
            </div>
          </div>

          {/* Realistic Airline Boarding Pass */}
          <div className="relative bg-gradient-to-r from-sky-900/80 via-blue-900/90 to-indigo-950 rounded-2xl p-4 border border-sky-400/40 shadow-xl overflow-hidden flex flex-col gap-3">
            {/* Cutout notch decorations */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-r border-sky-400/40" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-l border-sky-400/40" />

            <div className="flex items-center justify-between border-b border-sky-400/30 pb-2">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-sky-300" />
                <span className="text-xs font-bold text-sky-200 tracking-wider">
                  SUMIT AIRWAYS • सुमित एयरवेज
                </span>
              </div>
              <span className="text-xs font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                BOARDING PASS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-sky-300/70 block">
                  {lang === 'hi' ? 'यात्री का नाम' : 'Passenger Name'}
                </span>
                <span className="font-bold text-white text-sm">
                  सुमित गुप्ता (Sumit)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-sky-300/70 block">
                  {lang === 'hi' ? 'सीट संख्या' : 'Seat'}
                </span>
                <span className="font-bold text-amber-300 text-sm">
                  1A (Window)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-sky-300/70 block">
                  {lang === 'hi' ? 'प्रस्थान' : 'Departure'}
                </span>
                <span className="font-bold text-white text-sm">
                  सुमित नगर (SN)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-sky-300/70 block">
                  {lang === 'hi' ? 'गंतव्य' : 'Destination'}
                </span>
                <span className="font-bold text-sky-200 text-sm">
                  आकाश दर्शन (Sky)
                </span>
              </div>
            </div>

            {/* Barcode line */}
            <div className="pt-2 border-t border-dashed border-sky-400/30 flex items-center justify-between">
              <span className="text-[10px] text-sky-300/60 font-mono">
                ||| | ||||| || |||||| | |||| ||| SN-777-VVIP
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'सीट आरक्षित' : 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Action: Board the Plane & Fly in 3D */}
          <button
            onClick={() => {
              onBoardFlight();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-sky-500/30 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Plane className="w-5 h-5 animate-pulse" />
            <span>
              {lang === 'hi'
                ? '🛫 एरोप्लेन में बैठें और नगर के ऊपर उड़ें (Fly in Sky!)'
                : '🛫 Board Airplane & Fly Over Nagri (Sky Tour)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
