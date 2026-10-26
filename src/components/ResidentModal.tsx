import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Coffee,
  Bell,
  Car,
  Train,
  Share2,
  Check,
  BookOpen,
  Activity,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClickEventData } from '../scene/CityScene.ts';
import { soundEngine } from '../audio/soundEngine.ts';
import { ShopInteriorType } from '../types/city.ts';

interface ResidentModalProps {
  data: ClickEventData | null;
  onClose: () => void;
  lang: 'hi' | 'en';
  onIncrementNamaste: (residentId: string) => void;
  onOpenEbookStore?: () => void;
  onOpenShopInterior?: (shopType: ShopInteriorType) => void;
}

export const ResidentModal: React.FC<ResidentModalProps> = ({
  data,
  onClose,
  lang,
  onIncrementNamaste,
  onOpenEbookStore,
  onOpenShopInterior,
}) => {
  const [copied, setCopied] = useState(false);
  const [actionDone, setActionDone] = useState(false);

  if (!data) return null;

  const resident = data.resident;

  const handleNamaste = () => {
    soundEngine.playNamasteChime();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ea580c', '#ef4444', '#10b981'],
    });
    if (resident) {
      onIncrementNamaste(resident.id);
    }
  };

  const handleActionClick = () => {
    setActionDone(true);
    setTimeout(() => setActionDone(false), 2000);

    if (data.action === 'honk' || data.type === 'rickshaw') {
      soundEngine.playRickshawHorn();
    } else if (data.action === 'bell' || data.action === 'temple_aarti' || data.type === 'temple') {
      soundEngine.playTempleBell();
      confetti({ particleCount: 50, spread: 70, colors: ['#f59e0b', '#ea580c', '#fef08a'] });
    } else if (data.action === 'chai' || (resident && resident.houseStyle === 'chai_stall')) {
      soundEngine.playChaiClink();
    } else if (data.action === 'train' || data.type === 'station') {
      soundEngine.playTrainWhistle();
    } else if (data.action === 'hospital' || data.type === 'hospital') {
      soundEngine.playHospitalSiren();
      confetti({ particleCount: 30, spread: 50, colors: ['#ef4444', '#10b981', '#38bdf8'] });
    } else if (data.action === 'gym' || data.type === 'gym') {
      soundEngine.playGymDumbbellClink();
      confetti({ particleCount: 30, spread: 50, colors: ['#f59e0b', '#f97316', '#e2e8f0'] });
    } else if (data.action === 'school' || data.type === 'school') {
      soundEngine.playSchoolBell();
      confetti({ particleCount: 30, spread: 50, colors: ['#fbbf24', '#3b82f6', '#10b981'] });
    } else if (data.action === 'hotel' || data.type === 'hotel') {
      soundEngine.playHotelConciergeBell();
      confetti({ particleCount: 35, spread: 60, colors: ['#f59e0b', '#e11d48', '#fbbf24'] });
    } else if (data.action === 'medical_store' || data.type === 'medical_store') {
      soundEngine.playPharmacyChime();
      confetti({ particleCount: 30, spread: 50, colors: ['#22c55e', '#10b981', '#38bdf8'] });
    } else if (data.action === 'police_siren' || data.type === 'police_thana') {
      soundEngine.playPoliceSiren();
      confetti({ particleCount: 45, spread: 65, colors: ['#ef4444', '#3b82f6', '#ffffff'] });
    } else if (data.action === 'park_pool' || data.type === 'park_pool') {
      soundEngine.playPoolSplash();
      confetti({ particleCount: 40, spread: 60, colors: ['#06b6d4', '#38bdf8', '#4ade80'] });
    } else {
      soundEngine.playNamasteChime();
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getMohallaLabel = (mohalla: string) => {
    switch (mohalla) {
      case 'sumit_heritage':
        return lang === 'hi' ? 'सुमित हेरिटेज लेन' : 'Sumit Heritage Lane';
      case 'bazaar_chowk':
        return lang === 'hi' ? 'बाज़ार चौक' : 'Bazaar Chowk';
      case 'station_road':
        return lang === 'hi' ? 'स्टेशन रोड' : 'Station Road';
      case 'mandir_marg':
        return lang === 'hi' ? 'मंदिर मार्ग' : 'Mandir Marg';
      case 'hari_gaon':
        return lang === 'hi' ? 'हरि गाँव' : 'Hari Gaon';
      case 'tech_enclave':
        return lang === 'hi' ? 'टेक एन्क्लेव' : 'Tech Enclave';
      default:
        return mohalla;
    }
  };

  const getObjectIcon = () => {
    if (resident?.isFounder) return '👑';
    if (data.type === 'police_thana') return '🚨';
    if (data.type === 'theater') return '🎬';
    if (data.type === 'park_pool') return '🏊';
    if (data.type === 'hospital') return '🏥';
    if (data.type === 'gym') return '🏋️';
    if (data.type === 'school') return '🏫';
    if (data.type === 'hotel') return '🏨';
    if (data.type === 'restaurant') return '🍽️';
    if (data.type === 'medical_store') return '💊';
    if (data.type === 'rickshaw') return '🛺';
    if (data.type === 'temple') return '🛕';
    if (data.type === 'station') return '🚂';
    if (data.type === 'ebook_store') return '📚';
    if (data.type === 'airport' || data.type === 'airplane') return '✈️';
    return '🏡';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col">
        {/* Header Ribbon */}
        <div className="h-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600" />

        <div className="p-5 sm:p-6 flex flex-col gap-4">
          {/* Top Title & Close Button */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
                style={{
                  backgroundColor: resident?.colorTheme || '#d97706',
                  color: '#ffffff',
                }}
              >
                {getObjectIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-amber-100 font-heading">
                    {lang === 'hi'
                      ? resident?.hindiName || data.titleHindi || data.title
                      : resident?.name || data.title}
                  </h2>
                  {resident?.isFounder && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                      {lang === 'hi' ? 'संस्थापक' : 'Founder / Mayor'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-300/80 font-medium">
                  {lang === 'hi'
                    ? resident?.roleHindi || resident?.role || data.descriptionHindi
                    : resident?.role || data.description}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Badges / Location */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {resident && (
              <>
                <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {getMohallaLabel(resident.mohalla)}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                  {lang === 'hi' ? 'मकान संख्या' : 'House'} #{resident.houseNumber}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {resident.handle}
                </span>
              </>
            )}
            {!resident && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'hi' ? 'सुमित की नगरी का गौरव' : 'Pride of Sumit Ki Nagri'}
              </span>
            )}
          </div>

          {/* Signboard preview */}
          {resident?.customSignboard && (
            <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-950/60 to-orange-950/60 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-between">
              <span>{lang === 'hi' ? 'घर की नेमप्लेट:' : 'Nameplate:'}</span>
              <span className="font-hindi text-sm text-amber-300">
                {resident.customSignboard}
              </span>
            </div>
          )}

          {/* Quote / Bio */}
          {(resident?.quote || resident?.quoteHindi) && (
            <blockquote className="italic p-3 rounded-xl bg-slate-800/60 border-l-4 border-amber-500 text-xs text-slate-300">
              "{lang === 'hi' && resident.quoteHindi ? resident.quoteHindi : resident.quote}"
            </blockquote>
          )}

          {/* Detailed Stories */}
          {resident?.stories && resident.stories.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-400">
                {lang === 'hi' ? 'निवासी की कहानी:' : 'Town Tales:'}
              </span>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {resident.stories.map((s, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Landmark Description if not resident */}
          {!resident && (
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
              {lang === 'hi' && data.descriptionHindi
                ? data.descriptionHindi
                : data.description}
            </p>
          )}

          {/* Establishment Feature Highlights for Sumit's Institutions */}
          {data.type === 'hospital' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200">
                <span className="font-bold block text-red-300">🚑 24x7 इमरजेंसी</span>
                <span>आईसीयू, ऑक्सीजन व एम्बुलेंस सेवा</span>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-200">
                <span className="font-bold block text-teal-300">👨‍⚕️ विशेषज्ञ डॉक्टर</span>
                <span>निःशुल्क परामर्श एवं ओपीडी</span>
              </div>
            </div>
          )}

          {data.type === 'gym' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200">
                <span className="font-bold block text-amber-300">⚡ 24x7 फिटनेस</span>
                <span>ओलंपिक वेट्स एवं क्रॉसफिट जोन</span>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-200">
                <span className="font-bold block text-orange-300">🥤 न्यूट्रिशन बार</span>
                <span>प्रोटीन शेक एवं पर्सनल ट्रेनर</span>
              </div>
            </div>
          )}

          {data.type === 'school' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200">
                <span className="font-bold block text-blue-300">📚 सीबीएसई मान्यता</span>
                <span>स्मार्ट क्लास एवं कंप्यूटर लैब</span>
              </div>
              <div className="p-2.5 rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-yellow-200">
                <span className="font-bold block text-yellow-300">🚌 स्कूल बस सेवा</span>
                <span>सुरक्षित परिवहन एवं खेल मैदान</span>
              </div>
            </div>
          )}

          {data.type === 'hotel' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200">
                <span className="font-bold block text-amber-300">👑 ५-स्टार हेरिटेज</span>
                <span>महाराजा सुइट व फव्वारा प्रांगण</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200">
                <span className="font-bold block text-rose-300">🍽️ शाही राजस्थानी थाली</span>
                <span>रूफटॉप डाइनिंग एवं बैंक्वेट</span>
              </div>
            </div>
          )}

          {data.type === 'medical_store' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-green-950/40 border border-green-500/30 text-green-200">
                <span className="font-bold block text-green-300">🌿 100% असली दवाइयाँ</span>
                <span>एलोपैथिक, आयुर्वेदिक व सर्जिकल</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                <span className="font-bold block text-emerald-300">🛵 सुपरफ़ास्ट डिलीवरी</span>
                <span>नगर भर में त्वरित होम डिलीवरी</span>
              </div>
            </div>
          )}

          {data.type === 'police_thana' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200">
                <span className="font-bold block text-blue-300">🚨 24x7 पुलिस गश्त</span>
                <span>थाना प्रभारी: विक्रम राठौर • 100% सुरक्षा</span>
              </div>
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200">
                <span className="font-bold block text-red-300">🔒 सेंट्रल जेल हवालात</span>
                <span>चोर हिरासत में बंद • अपराध मुक्त नगर</span>
              </div>
            </div>
          )}

          {data.type === 'park_pool' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                <span className="font-bold block text-emerald-300">🎪 बच्चों का झूला व स्लाइड</span>
                <span>हवा में लहराता सेफ झूला व हरियाली</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                <span className="font-bold block text-cyan-300">🏊 स्विमिंग पूल व रीडिंग</span>
                <span>तरणताल, डाइविंग व सोमो ई-बुक्स</span>
              </div>
            </div>
          )}

          {data.type === 'temple' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200">
                <span className="font-bold block text-amber-300">🪔 संध्या महा आरती</span>
                <span>पंडित जी द्वारा पावन आरती व कपूर दीप</span>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-200">
                <span className="font-bold block text-orange-300">🔔 पवित्र पीतल घंटी</span>
                <span>सुख-शांति, समृद्धि एवं मनोकामना पूर्ण</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            {/* Say Namaste button */}
            {resident && (
              <button
                onClick={handleNamaste}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition cursor-pointer"
              >
                <span>🙏</span>
                <span>
                  {lang === 'hi' ? 'नमस्ते भेजें' : 'Say Namaste'} ({resident.namasteCount})
                </span>
              </button>
            )}

            {/* Somo eBooks Store Action */}
            {data.type === 'ebook_store' && onOpenEbookStore && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEbookStore();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/40 active:scale-95 transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'hi' ? 'ई-बुक स्टोर खोलें' : 'Open eBook Store'}</span>
              </button>
            )}

            {/* Contextual fun action */}
            {data.type !== 'ebook_store' && (data.action || resident?.houseStyle === 'chai_stall') && (
              <button
                onClick={handleActionClick}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  actionDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                }`}
              >
                {data.type === 'police_thana' || data.action === 'police_siren' ? (
                  <>
                    <span className="text-sm">🚨</span>
                    <span>{actionDone ? (lang === 'hi' ? 'सायरन अलर्ट जारी!' : 'Siren Sounded!') : (lang === 'hi' ? 'सायरन बजाएँ व गश्त देखें' : 'Sound Police Siren')}</span>
                  </>
                ) : data.type === 'park_pool' || data.action === 'park_pool' ? (
                  <>
                    <span className="text-sm">🏊</span>
                    <span>{actionDone ? (lang === 'hi' ? 'छलांग लगाई! Splash!' : 'Splashed!') : (lang === 'hi' ? 'पूल में छलांग लगाएँ' : 'Splash in Pool')}</span>
                  </>
                ) : data.type === 'temple' || data.action === 'temple_aarti' || data.action === 'bell' ? (
                  <>
                    <span className="text-sm">🪔</span>
                    <span>{actionDone ? (lang === 'hi' ? 'आरती संपन्न! हर-हर महादेव!' : 'Aarti Blessed!') : (lang === 'hi' ? 'आरती करें व घंटी बजाएँ' : 'Perform Aarti & Bell')}</span>
                  </>
                ) : data.type === 'hospital' || data.action === 'hospital' ? (
                  <>
                    <Activity className="w-4 h-4 text-red-400" />
                    <span>{actionDone ? (lang === 'hi' ? 'OPD टोकन जारी!' : 'OPD Token Ready!') : (lang === 'hi' ? 'स्वास्थ्य जाँच / OPD टोकन' : 'OPD Health Token')}</span>
                  </>
                ) : data.type === 'gym' || data.action === 'gym' ? (
                  <>
                    <span className="text-sm">🏋️</span>
                    <span>{actionDone ? (lang === 'hi' ? 'ऊर्जा बूस्टेड!' : 'Workout Boosted!') : (lang === 'hi' ? 'वर्कआउट बूस्ट करें' : 'Power Workout')}</span>
                  </>
                ) : data.type === 'school' || data.action === 'school' ? (
                  <>
                    <span className="text-sm">🔔</span>
                    <span>{actionDone ? (lang === 'hi' ? 'घंटी बजी!' : 'Bell Rang!') : (lang === 'hi' ? 'स्कूल घंटी बजाएँ' : 'Ring School Bell')}</span>
                  </>
                ) : data.type === 'hotel' || data.action === 'hotel' ? (
                  <>
                    <span className="text-sm">🛎️</span>
                    <span>{actionDone ? (lang === 'hi' ? 'शाही स्वागत!' : 'Suite Booked!') : (lang === 'hi' ? 'शाही सुइट व थाली' : 'Royal Suite & Dining')}</span>
                  </>
                ) : data.type === 'medical_store' || data.action === 'medical_store' ? (
                  <>
                    <span className="text-sm">💊</span>
                    <span>{actionDone ? (lang === 'hi' ? 'दवा प्राप्त हुई!' : 'Medicine Dispensed!') : (lang === 'hi' ? 'प्राथमिक चिकित्सा व दवा' : 'Dispense Medicine')}</span>
                  </>
                ) : data.action === 'honk' ? (
                  <>
                    <Car className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'hi' ? 'हॉर्न बजाओ!' : 'Honk Horn!'}</span>
                  </>
                ) : data.action === 'bell' ? (
                  <>
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'hi' ? 'घंटी बजाओ!' : 'Ring Bell!'}</span>
                  </>
                ) : data.action === 'chai' || resident?.houseStyle === 'chai_stall' ? (
                  <>
                    <Coffee className="w-4 h-4 text-orange-400" />
                    <span>{lang === 'hi' ? 'कुल्हड़ चाय लो!' : 'Order Chai!'}</span>
                  </>
                ) : data.action === 'train' ? (
                  <>
                    <Train className="w-4 h-4 text-blue-400" />
                    <span>{lang === 'hi' ? 'ट्रेन सीटी!' : 'Blow Whistle!'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'hi' ? 'शुभकामनाएँ!' : 'Send Blessings!'}</span>
                  </>
                )}
              </button>
            )}

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Enter Inside 3D Interior Button */}
          {onOpenShopInterior && (
            <button
              onClick={() => {
                const getShopType = (): ShopInteriorType => {
                  if (data.type === 'hospital') return 'hospital';
                  if (data.type === 'gym') return 'gym';
                  if (data.type === 'medical_store') return 'medical_store';
                  if (data.type === 'school') return 'school';
                  if (data.type === 'hotel') return 'hotel';
                  if (data.type === 'station') return 'train_coach';
                  if (data.type === 'ebook_store') return 'ebook_store';
                  if (data.type === 'airport' || data.type === 'airplane') return 'airplane_cabin';
                  if (resident?.houseStyle === 'chai_stall') return 'chai_stall';
                  if (resident?.id === 'res-gupta-sweets') return 'sweet_shop';
                  if (resident?.isFounder || data.title?.includes('Haveli') || data.titleHindi?.includes('हवेली')) return 'haveli';
                  return 'chai_stall';
                };
                const st = getShopType();
                onClose();
                onOpenShopInterior(st);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-500/25 hover:from-amber-500/35 hover:to-orange-500/30 text-amber-200 border border-amber-500/40 text-xs sm:text-sm font-bold shadow transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <span className="text-base">🏢</span>
              <span>
                {lang === 'hi'
                  ? 'दुकान / भवन के अंदर 3D दृश्य देखें (Enter Inside!)'
                  : 'View 3D Interior & Inventory (Enter Inside!)'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
