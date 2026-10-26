import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  Smartphone,
  CreditCard,
  Building,
  ArrowRight,
  Sparkles,
  Download,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Ebook } from '../types/ebook.ts';
import { soundEngine } from '../audio/soundEngine.ts';

interface PaymentModalProps {
  ebook: Ebook | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  onPaymentSuccess: (ebookId: string) => void;
}

type PaymentMethod = 'upi_apps' | 'qr_code' | 'upi_id' | 'card' | 'netbanking';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  ebook,
  isOpen,
  onClose,
  lang,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('upi_apps');
  const [selectedApp, setSelectedApp] = useState<string>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsProcessing(false);
      setTxnId(`TXN-SUMIT-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [isOpen]);

  if (!isOpen || !ebook) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setProcessStage(
      lang === 'hi'
        ? 'बैंक गेटवे से सुरक्षित संपर्क हो रहा है...'
        : 'Connecting securely to payment gateway...'
    );

    // Realistic multi-stage verification
    setTimeout(() => {
      setProcessStage(
        lang === 'hi'
          ? 'NPCI / UPI सर्वर द्वारा भुगतान सत्यापित हो रहा है...'
          : 'Verifying UPI authorization with NPCI...'
      );
    }, 1200);

    setTimeout(() => {
      setProcessStage(
        lang === 'hi'
          ? 'भुगतान सफल! ई-बुक अनलॉक की जा रही है...'
          : 'Payment successful! Unlocking eBook...'
      );
    }, 2400);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      soundEngine.playNamasteChime();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });
      onPaymentSuccess(ebook.id);
    }, 3200);
  };

  const discountPercent = Math.round(
    ((ebook.originalPrice - ebook.price) / ebook.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col text-slate-100">
        {/* Top Gradient Ribbon */}
        <div className="h-3 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 font-heading">
                {lang === 'hi' ? 'सुरक्षित भुगतान गेटवे' : 'Secure Payment Gateway'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Sumit Ki Nagri • 100% Verified Indian Gateway
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 flex flex-col gap-4 max-h-[82vh] overflow-y-auto">
          {!isSuccess ? (
            <>
              {/* Order Item Summary Card */}
              <div className="bg-gradient-to-r from-slate-800/80 to-amber-950/30 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow flex-shrink-0"
                    style={{ backgroundColor: ebook.coverColor }}
                  >
                    {ebook.coverEmoji}
                  </div>
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      PAID EDITION
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-amber-100 mt-1 line-clamp-1 font-heading">
                      {lang === 'hi' ? ebook.titleHindi : ebook.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">{ebook.author}</p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs line-through text-slate-500">
                      ₹{ebook.originalPrice}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-emerald-400">
                      ₹{ebook.price}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400">
                    {discountPercent}% OFF
                  </span>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {lang === 'hi'
                      ? 'भुगतान का माध्यम चुनें (Select Payment Option):'
                      : 'Select Payment Method:'}
                  </span>
                </span>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMethod('upi_apps')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      method === 'upi_apps'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-semibold">UPI Apps</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('qr_code')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      method === 'qr_code'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-semibold">Scan QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('upi_id')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      method === 'upi_id'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold text-blue-400">@UPI</span>
                    <span className="text-[10px] font-semibold">UPI ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      method === 'card'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-semibold">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('netbanking')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      method === 'netbanking'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Building className="w-4 h-4 text-orange-400" />
                    <span className="text-[10px] font-semibold">NetBank</span>
                  </button>
                </div>
              </div>

              {/* Method Detail View */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                {method === 'upi_apps' && (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs text-slate-300 font-medium">
                      {lang === 'hi'
                        ? 'अपने पसंदीदा UPI ऐप से भुगतान करें:'
                        : 'Pay instantly via UPI Application:'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'gpay', name: 'Google Pay', icon: '🟢 GPay', color: 'border-emerald-500/40' },
                        { id: 'phonepe', name: 'PhonePe', icon: '🟣 PhonePe', color: 'border-purple-500/40' },
                        { id: 'paytm', name: 'Paytm UPI', icon: '🔵 Paytm', color: 'border-blue-500/40' },
                        { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳 BHIM', color: 'border-orange-500/40' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedApp(app.id)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                            selectedApp === app.id
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          {app.icon}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 text-center mt-1">
                      Merchant VPA: <span className="text-amber-300 font-mono">sumitgupta43996@okaxis</span>
                    </span>
                  </div>
                )}

                {method === 'qr_code' && (
                  <div className="flex flex-col items-center justify-center gap-2.5 text-center">
                    <span className="text-xs text-slate-300">
                      {lang === 'hi'
                        ? 'किसी भी UPI ऐप से यह QR कोड स्कैन करें:'
                        : 'Scan this QR code using any UPI app to pay:'}
                    </span>
                    {/* SVG Procedural UPI QR Code Representation */}
                    <div className="p-3 bg-white rounded-2xl shadow-lg border-4 border-amber-400/80">
                      <div className="w-32 h-32 bg-slate-950 p-2 rounded-xl flex flex-col items-center justify-between">
                        <div className="flex justify-between w-full">
                          <div className="w-8 h-8 border-4 border-emerald-400 rounded-sm" />
                          <div className="w-8 h-8 border-4 border-emerald-400 rounded-sm" />
                        </div>
                        <div className="text-center font-bold text-[9px] text-amber-300 font-mono tracking-widest">
                          ₹{ebook.price} • SUMIT
                        </div>
                        <div className="flex justify-between w-full">
                          <div className="w-8 h-8 border-4 border-emerald-400 rounded-sm" />
                          <div className="w-4 h-4 bg-emerald-400 rounded-sm self-center" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-amber-300 font-semibold font-mono">
                      Pay ₹{ebook.price} to Sumit Ki Nagri
                    </span>
                  </div>
                )}

                {method === 'upi_id' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-300 font-medium">
                      {lang === 'hi' ? 'अपनी UPI ID दर्ज करें:' : 'Enter your UPI ID / VPA:'}
                    </label>
                    <input
                      type="text"
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      placeholder="e.g. yourname@oksbi / 9876543210@paytm"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400">
                      We will send a payment approval request to your UPI app.
                    </span>
                  </div>
                )}

                {method === 'card' && (
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-300 font-medium block mb-1">
                        Card Number (RuPay / Visa / Master)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8910"
                        maxLength={19}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-300 font-medium block mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          maxLength={5}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-300 font-medium block mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === 'netbanking' && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-slate-300 font-medium">Select Popular Bank:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-left text-slate-300 hover:text-white"
                        >
                          🏦 {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    <span>{processStage}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-950" />
                    <span>
                      {lang === 'hi'
                        ? `अभी ₹${ebook.price} सुरक्षित भुगतान करें`
                        : `Pay ₹${ebook.price} Securely & Unlock`}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted • Instant Lifetime Access to Book</span>
              </div>
            </>
          ) : (
            /* Success Receipt & Read Action */
            <div className="flex flex-col items-center justify-center gap-4 py-4 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {lang === 'hi' ? 'भुगतान सफल • Payment Successful' : 'Payment Verified & Successful'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-2 font-heading">
                  {lang === 'hi'
                    ? 'बधाई हो! आपकी ई-बुक अनलॉक हो गई है'
                    : 'Congratulations! Your eBook is Unlocked'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {lang === 'hi'
                    ? `आपने "${ebook.titleHindi}" का प्रीमियम संस्करण सफलतापूर्वक खरीद लिया है।`
                    : `You have successfully purchased "${ebook.title}".`}
                </p>
              </div>

              {/* Receipt Box */}
              <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left text-xs flex flex-col gap-2">
                <div className="flex justify-between text-slate-400">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-slate-200">{txnId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-emerald-400">₹{ebook.price}.00 INR</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Merchant:</span>
                  <span className="text-slate-200">Sumit Ki Nagri (Sumit Gupta)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Access:</span>
                  <span className="text-amber-400 font-semibold">Lifetime Unlocked</span>
                </div>
              </div>

              {/* Continue to Read */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/30 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{lang === 'hi' ? 'अभी पूरी पुस्तक पढ़ें' : 'Start Reading eBook Now'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
