import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Sparkles, Volume2 } from 'lucide-react';
import { CameraPreset } from '../types/city.ts';
import { soundEngine } from '../audio/soundEngine.ts';

interface TourStep {
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  preset: CameraPreset;
  soundAction?: () => void;
  emoji: string;
}

interface TourGuideOverlayProps {
  isActive: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  onSetCameraPreset: (preset: CameraPreset) => void;
}

export const TourGuideOverlay: React.FC<TourGuideOverlayProps> = ({
  isActive,
  onClose,
  lang,
  onSetCameraPreset,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TourStep[] = [
    {
      titleHi: 'सुमित की नगरी में आपका स्वागत है!',
      titleEn: 'Welcome to Sumit Ki Nagri!',
      descHi: 'यह एक जीवंत 3D भारतीय नगर सिमुलेशन है। यहाँ संस्थापक सुमित गुप्ता के नाम से अस्पताल, स्कूल, जिम, होटल और मेडिकल स्टोर स्थित हैं।',
      descEn: 'A living 3D interactive Indian town simulation featuring modern civic institutions and heritage mohallas established by Sumit.',
      preset: 'overview',
      emoji: '👑',
    },
    {
      titleHi: 'सुमित निवास (मुख्य हवेली)',
      titleEn: 'Sumit Niwas (Mayor Haveli)',
      descHi: 'संस्थापक और नगर प्रमुख सुमित गुप्ता जी की भव्य राजस्थानी हवेली। नक्काशीदार झरोखे, छत पर छतरी मंडप और गेंदे के फूलों का तोरण द्वार।',
      descEn: 'The grand heritage sandstone haveli of founder and mayor Sumit Gupta with ornate jharokha balconies and rooftop chhatri.',
      preset: 'sumit_haveli',
      soundAction: () => soundEngine.playNamasteChime(),
      emoji: '🏛️',
    },
    {
      titleHi: 'सुमित मल्टीस्पेशलिटी हॉस्पिटल',
      titleEn: 'Sumit Multispeciality Hospital',
      descHi: '24x7 आपातकालीन सेवा, आधुनिक आईसीयू, एम्बुलेंस बे और नागरिकों के लिए निःशुल्क ओपीडी स्वास्थ्य परामर्श केंद्र।',
      descEn: 'State-of-the-art 24x7 trauma care centre, ICU, ambulance fleet, and free citizen OPD checkup clinic.',
      preset: 'hospital',
      soundAction: () => soundEngine.playHospitalSiren(),
      emoji: '🏥',
    },
    {
      titleHi: 'सुमित फिटनेस एवं जिम',
      titleEn: 'Sumit Fitness & Power Gym',
      descHi: 'आधुनिक बॉडीबिल्डिंग व स्ट्रेंथ ट्रेनिंग सेंटर। भारी डम्बल, कार्डियो जोन, क्रॉसफिट और न्यूट्रिशन प्रोटीन बार।',
      descEn: 'High-energy fitness powerhouse with heavy free-weights, Olympic dumbbells, CrossFit arena, and nutrition bar.',
      preset: 'gym',
      soundAction: () => soundEngine.playGymDumbbellClink(),
      emoji: '🏋️',
    },
    {
      titleHi: 'सुमित इंटरनेशनल स्कूल',
      titleEn: 'Sumit International School',
      descHi: 'घंटाघर, भारतीय तिरंगा ध्वज और स्कूल बस से सुसज्जित विद्या मंदिर। स्मार्ट क्लासरूम एवं खेल मैदान।',
      descEn: 'Premier academy campus with iconic clock/bell tower, Indian tricolor flag, yellow school buses, and playgrounds.',
      preset: 'school',
      soundAction: () => soundEngine.playSchoolBell(),
      emoji: '🏫',
    },
    {
      titleHi: 'सुमित ग्रैंड हेरिटेज होटल',
      titleEn: 'Sumit Grand Heritage Hotel & Resort',
      descHi: 'शाही 5-स्टार राजस्थानी महल होटल। लाल कालीन प्रवेश, फव्वारा प्रांगण, महाराजा सुइट और शाही थाली डाइनिंग।',
      descEn: '5-Star royal palace resort with welcoming fountain courtyard, red carpet, heritage suites, and Rajasthani dining.',
      preset: 'hotel',
      soundAction: () => soundEngine.playHotelConciergeBell(),
      emoji: '🏨',
    },
    {
      titleHi: 'सुमित 24x7 मेडिकल स्टोर एवं फार्मेसी',
      titleEn: 'Sumit 24x7 Medical Store & Pharmacy',
      descHi: 'दिन-रात खुली विश्वसनीय औषधालय। सभी जीवनरक्षक दवाइयाँ, प्राथमिक चिकित्सा किट और नगर भर में सुपरफ़ास्ट होम डिलीवरी।',
      descEn: 'Round-the-clock trusted pharmacy stocked with life-saving medicines, first aid supplies, and instant city home delivery.',
      preset: 'medical_store',
      soundAction: () => soundEngine.playPharmacyChime(),
      emoji: '💊',
    },
    {
      titleHi: 'सोमो ई-बुक स्टोर (Somo eBooks)',
      titleEn: 'Somo eBooks Store & Library',
      descHi: 'रोमान्टिक, लव, सैडनेस और प्यारी कहानियों का विशाल संग्रह। डिजिटल पाठक ऑनलाइन पुस्तकें पढ़ सकते हैं।',
      descEn: 'Somo eBooks collection curated by Sumit. Romantic, love, and emotional stories with digital reader support.',
      preset: 'ebook_store',
      soundAction: () => soundEngine.playNamasteChime(),
      emoji: '📚',
    },
    {
      titleHi: 'सुमित खेल मैदान (Games Arena)',
      titleEn: 'Sports Ground & Games Arena',
      descHi: 'गली क्रिकेट, देसी लूडो, कंचे (मार्वल्स) और फील्ड हॉकी का 3D खेल मैदान जहाँ नागरिक वास्तविक गेम खेल सकते हैं!',
      descEn: 'Playable Gully Cricket, Desi Ludo, Kanche (Marbles), and Field Hockey with real interactive gameplay!',
      preset: 'sports_ground',
      emoji: '🏏',
    },
    {
      titleHi: 'सुमित इंटरनेशनल एयरपोर्ट',
      titleEn: 'Sumit International Airport',
      descHi: 'रनवे, एटीसी टावर और आकाश में उड़ता 3D हवाई जहाज। यात्री फ़्लाइट में बैठ कर नगर का विहंगम दृश्य देख सकते हैं।',
      descEn: 'Runway, ATC tower, and animated passenger plane with flight cockpit camera view over Sumit Ki Nagri.',
      preset: 'flight',
      emoji: '✈️',
    },
    {
      titleHi: 'शर्मा जी चाय टपरी (बाज़ार चौक)',
      titleEn: 'Chai Tapri at Bazaar Chowk',
      descHi: 'खौलती हुई अदरक-इलायची वाली कड़क चाय, कुल्हड़ और शाम की गरमा-गरम महफ़िल।',
      descEn: 'The heartbeat of the town. Steaming kadak ginger chai brewed in brass kettles and served in earthen kulhads.',
      preset: 'bazaar',
      soundAction: () => soundEngine.playChaiClink(),
      emoji: '☕',
    },
    {
      titleHi: 'सुमित नगर जंक्शन (रेलवे स्टेशन एवं ट्रेन सवारी)',
      titleEn: 'Sumit Nagar Junction (Railway & Train Ride)',
      descHi: 'विंटेज रेलवे स्टेशन, नदी पर बना रेलवे पुल और डिब्बे में सवार होकर पूरे शहर की सैर करने की सुविधा!',
      descEn: 'Heritage railway platform, river bridge, and train ride mode where you can sit inside the coach as it moves!',
      preset: 'train_ride',
      soundAction: () => soundEngine.playTrainWhistle(),
      emoji: '🚂',
    },
    {
      titleHi: 'पवित्र नदी, सीढ़ीदार घाट एवं पुल',
      titleEn: 'Pavitra River, Ghat Steps & Stone Bridges',
      descHi: 'शहर से बहती नीली कल-कल नदी, शांति मंदिर का स्नान घाट, तैरते दीप और पानी पर बंधी पारंपरिक देसी लकड़ी की नाव।',
      descEn: 'Flowing blue river with temple ghat stone steps, floating diyas, stone bridges, and traditional country boat.',
      preset: 'temple',
      emoji: '🌊',
    },
    {
      titleHi: '3D हाई-डिटेल आइसोमेट्रिक विहंगम दृश्य',
      titleEn: 'High-Detail 3D Isometric View',
      descHi: 'पूरा शहर, सभी दुकानें, सड़क, रेलवे, नदी, हवाई अड्डा और चलते हुए लोग 45° स्पष्ट आइसोमेट्रिक कोण से देखें!',
      descEn: 'Inspect the entire city with crystal clarity: shops, streets, flowing river, train, airport, and active citizens in 3D isometric view!',
      preset: 'isometric',
      emoji: '📐',
    },
  ];

  useEffect(() => {
    if (isActive) {
      const step = steps[currentStep];
      onSetCameraPreset(step.preset);
      if (step.soundAction) {
        step.soundAction();
      }
    }
  }, [currentStep, isActive]);

  if (!isActive) return null;

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full px-4 max-w-lg pointer-events-none animate-slide-down">
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-amber-500/50 rounded-3xl p-5 shadow-2xl shadow-black text-slate-100 flex flex-col gap-3">
        {/* Step Indicator & Close */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'hi' ? 'सुमित की नगरी दर्शन' : 'City Tour'} • {currentStep + 1} / {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">{current.emoji}</span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-amber-200 font-heading">
              {lang === 'hi' ? current.titleHi : current.titleEn}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {lang === 'hi' ? current.descHi : current.descEn}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-300 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'hi' ? 'पिछला' : 'Prev'}</span>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[180px] px-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all flex-shrink-0 ${
                  i === currentStep ? 'w-4 bg-amber-400' : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold transition shadow cursor-pointer active:scale-95"
          >
            <span>
              {currentStep === steps.length - 1
                ? lang === 'hi'
                  ? 'समाप्त'
                  : 'Finish'
                : lang === 'hi'
                ? 'आगे बढ़ें'
                : 'Next'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
