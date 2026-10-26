import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { X, Sparkles, Volume2, Info, Eye, Layers } from 'lucide-react';
import { ShopInteriorType, InteriorItem } from '../types/city.ts';
import { soundEngine } from '../audio/soundEngine.ts';

interface ShopInteriorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  initialShopType?: ShopInteriorType;
}

export interface InteriorSceneDef {
  type: ShopInteriorType;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  icon: string;
  accentColor: string;
  items: InteriorItem[];
}

export const INTERIOR_DEFS: Record<ShopInteriorType, InteriorSceneDef> = {
  gym: {
    type: 'gym',
    titleHi: 'सुमित फिटनेस एवं पावर जिम (अंदर का दृश्य)',
    titleEn: 'Sumit Fitness & Power Gym (Interior)',
    subtitleHi: 'अत्याधुनिक वर्कआउट एरीना, वेटलिफ्टिंग एवं कार्डियो ज़ोन',
    subtitleEn: 'State-of-the-art weights arena, dumbbells, bench press & cardio',
    icon: '🏋️',
    accentColor: '#f59e0b',
    items: [
      {
        id: 'gym-dumbbells',
        name: 'Olympic Dumbbell Rack (5kg - 35kg)',
        nameHindi: 'ओलंपिक डम्बल रैक (५ से ३५ कि.ग्रा.)',
        category: 'Weights',
        description: 'Solid steel hex dumbbells for heavy bicep curls and shoulder presses.',
        descriptionHindi: 'हैवी बाइसेप्स और शोल्डर प्रेस के लिए सॉलिड स्टील डम्बल रैक।',
        icon: '💪',
      },
      {
        id: 'gym-bench',
        name: 'Olympic Bench Press Station',
        nameHindi: 'ओलंपिक बेंच प्रेस स्टेशन',
        category: 'Chest Press',
        description: 'Heavy-duty steel rack with 100kg loaded Olympic barbell and safety catches.',
        descriptionHindi: '१०० किलो लोडेड बारबेल के साथ चेस्ट वर्कआउट बेंच प्रेस।',
        icon: '🏋️',
      },
      {
        id: 'gym-treadmill',
        name: 'Cardio Pro Treadmill with Display',
        nameHindi: 'डिजिटल कार्डियो ट्रेडमिल',
        category: 'Cardio',
        description: 'High-speed running deck with incline controls and heart-rate sensors.',
        descriptionHindi: 'हार्ट-रेट सेंसर और स्पीड कंट्रोल युक्त आधुनिक रनिंग ट्रेडमिल।',
        icon: '🏃',
      },
      {
        id: 'gym-protein',
        name: 'NutriPower Whey Protein & Shakers',
        nameHindi: 'व्हे प्रोटीन एवं शेकर बॉटल रैक',
        category: 'Nutrition Bar',
        description: 'Premium imported protein tubs, BCAA boosters, and chilled hydration bottles.',
        descriptionHindi: 'प्रीमियम व्हे प्रोटीन, बीसीएए और एनर्जी ड्रिंक्स की शेल्फ।',
        icon: '🥤',
      },
    ],
  },
  hospital: {
    type: 'hospital',
    titleHi: 'सुमित मल्टीस्पेशलिटी हॉस्पिटल (आईसीयू एवं वार्ड)',
    titleEn: 'Sumit Multispeciality Hospital (ICU & Ward)',
    subtitleHi: '24x7 इमरजेंसी ट्रॉमा केयर, आधुनिक आईसीयू एवं डॉक्टर कक्ष',
    subtitleEn: '24x7 emergency trauma care, ICU beds & doctor consultation',
    icon: '🏥',
    accentColor: '#ef4444',
    items: [
      {
        id: 'hosp-bed',
        name: 'Motorized ICU Emergency Bed',
        nameHindi: 'मोटराइज्ड आईसीयू इमरजेंसी बेड',
        category: 'Patient Care',
        description: 'Multi-position electronic critical care bed with ergonomic orthopedic mattress.',
        descriptionHindi: 'रिमोट नियंत्रित आधुनिक अस्पताल बेड, मरीज के आराम हेतु विशेष गद्दे के साथ।',
        icon: '🛏️',
      },
      {
        id: 'hosp-ecg',
        name: 'Vital Signs & ECG Cardiac Monitor',
        nameHindi: 'लाइव ईसीजी कार्डियक मॉनिटर',
        category: 'Diagnostics',
        description: 'Continuous real-time tracking of pulse rate (72 bpm), SpO2, and blood pressure.',
        descriptionHindi: 'धड़कन, ऑक्सीजन और ब्लड प्रेशर की 24x7 लाइव डिजिटल ट्रैकिंग।',
        icon: '💓',
      },
      {
        id: 'hosp-iv',
        name: 'Saline IV Drip Stand & Infusion Pump',
        nameHindi: 'आईवी ड्रिप स्टैंड एवं सेलाइन बोतल',
        category: 'Medication',
        description: 'Precision intravenous saline drip and emergency medicine infusion regulator.',
        descriptionHindi: 'मरीज को निरंतर ग्लूकोज एवं दवा चढ़ाने हेतु स्टैंड।',
        icon: '🧪',
      },
      {
        id: 'hosp-desk',
        name: 'Doctor Consultation Desk & Stethoscope',
        nameHindi: 'डॉक्टर परामर्श डेस्क एवं स्टेथोस्कोप',
        category: 'OPD Clinic',
        description: 'Physician desk with Littmann stethoscope, digital prescription pad, and X-ray viewer.',
        descriptionHindi: 'वरिष्ठ चिकित्सक की परामर्श मेज, स्टेथोस्कोप एवं एक्स-रे व्यूअर।',
        icon: '👨‍⚕️',
      },
    ],
  },
  medical_store: {
    type: 'medical_store',
    titleHi: 'सुमित 24x7 मेडिकल स्टोर (फार्मेसी)',
    titleEn: 'Sumit 24x7 Medical Store & Pharmacy',
    subtitleHi: 'जीवनरक्षक दवाइयाँ, प्राथमिक चिकित्सा, सिरप एवं बेबी केयर',
    subtitleEn: 'Genuine medicines, blister packs, cough syrups & first aid kits',
    icon: '💊',
    accentColor: '#10b981',
    items: [
      {
        id: 'med-shelves',
        name: 'Medicine Wall Shelves (A-Z Dispenser)',
        nameHindi: 'औषधि रैक (ए से जेड मेडिसिन शेल्व्स)',
        category: 'Stock',
        description: 'Over 5,000 certified pharmaceutical tablets, syrups, and injectables organized alphabetically.',
        descriptionHindi: '५००० से अधिक प्रामाणिक एलोपैथिक एवं आयुर्वेदिक दवाओं का सुसज्जित रैक।',
        icon: '📦',
      },
      {
        id: 'med-firstaid',
        name: 'Red Cross Emergency First-Aid Kit',
        nameHindi: 'रेड क्रॉस प्राथमिक चिकित्सा किट',
        category: 'First Aid',
        description: 'Equipped with sterile cotton gauze, antiseptic Betadine, burn cream, and surgical scissors.',
        descriptionHindi: 'बैंडेज, एंटीसेप्टिक लोशन, दर्दनिवारक स्प्रे और आवश्यक मरहम किट।',
        icon: '🩹',
      },
      {
        id: 'med-billing',
        name: 'Computerized Billing & Scanner Counter',
        nameHindi: 'कंप्यूटरीकृत बिलिंग एवं बारकोड स्कैनर',
        category: 'Counter',
        description: 'High-speed digital GST billing terminal with thermal receipt printer and barcode reader.',
        descriptionHindi: 'त्वरित पक्का बिल एवं ऑनलाइन भुगतान हेतु कंप्यूटर टर्मिनल।',
        icon: '💻',
      },
      {
        id: 'med-coldstorage',
        name: 'Vaccine Cold Storage Refrigerator',
        nameHindi: 'वैक्सीन एवं इंसुलिन रेफ्रिजरेटर',
        category: 'Cold Chain',
        description: 'Temperature-controlled refrigerator (2°C - 8°C) preserving life-saving vaccines and insulin.',
        descriptionHindi: '२ से ८ डिग्री तापमान में इंसुलिन व टीके सुरक्षित रखने वाला फ्रिज।',
        icon: '❄️',
      },
    ],
  },
  chai_stall: {
    type: 'chai_stall',
    titleHi: 'शर्मा जी चाय टपरी (अंदर का भट्ठी दृश्य)',
    titleEn: 'Sharma Ji Chai Tapri (Kitchen & Counter)',
    subtitleHi: 'उबलती अदरक-इलायची चाय, मिट्टी के कुल्हड़ और गरमा-गरम समोसे',
    subtitleEn: 'Boiling ginger-cardamom tea, clay kulhads & crispy fresh samosas',
    icon: '☕',
    accentColor: '#d97706',
    items: [
      {
        id: 'chai-kettle',
        name: 'Boiling Brass Chai Kettle (पीतल की केतली)',
        nameHindi: 'उबलती पीतल की चाय केतली',
        category: 'Stove',
        description: 'Classic heavy brass handi brewing Assam tea leaves with crushed fresh ginger and green cardamom.',
        descriptionHindi: 'अदरक, दालचीनी और हरी इलायची के साथ खौलती कड़क चाय।',
        icon: '🫖',
      },
      {
        id: 'chai-kulhad',
        name: 'Earthen Clay Kulhads Stack (मिट्टी के कुल्हड़)',
        nameHindi: 'देसी मिट्टी के कुल्हड़ों का चट्टा',
        category: 'Crockery',
        description: 'Handmade terracotta cups infusing that authentic earthy fragrance (सौंधी महक) into every sip.',
        descriptionHindi: 'कुम्हार के चाक पर बने मिट्टी के कुल्हड़, जो चाय को सौंधी खुशबू देते हैं।',
        icon: '🏺',
      },
      {
        id: 'chai-samosa',
        name: 'Hot Crispy Samosas & Mint Chutney',
        nameHindi: 'गरमा-गरम समोसे एवं हरी चटनी',
        category: 'Snacks',
        description: 'Crispy fried triangular samosas stuffed with spiced potatoes, served with tangy tamarind chutney.',
        descriptionHindi: 'आलू-मटर भरे कुरकुरे समोसे और पुदीने-धनिया की तीखी चटनी।',
        icon: '🥟',
      },
      {
        id: 'chai-rusk',
        name: 'Parle-G & Rusk Glass Jars',
        nameHindi: 'पारले-जी बिस्कुट व रस्क के शीशे के मर्तबान',
        category: 'Dipping',
        description: 'Vintage glass cookie jars loaded with crisp milk rusks and everyone\'s favorite golden biscuits.',
        descriptionHindi: 'चाय में डुबोकर खाने वाले कुरकुरे इलायची रस्क और बिस्कुट।',
        icon: '🍪',
      },
    ],
  },
  sweet_shop: {
    type: 'sweet_shop',
    titleHi: 'गुप्ता जी मिष्ठान भण्डार (अंदर का दृश्य)',
    titleEn: 'Gupta Halwai Sweet Shop (Kitchen & Counter)',
    subtitleHi: 'शुद्ध देशी घी की जलेबियाँ, मोतीचूर लड्डू, रबड़ी व काजू कतली',
    subtitleEn: 'Pure desi ghee jalebis, motichoor laddoos, rabri & kaju katli',
    icon: '🍬',
    accentColor: '#ea580c',
    items: [
      {
        id: 'sweet-kadhai',
        name: 'Grand Brass Kadhai with Simmering Chashni',
        nameHindi: 'विशाल पीतल की कड़ाही व चाशनी',
        category: 'Cooking',
        description: 'Huge artisanal kadhai for frying crispy spiral jalebis in bubbling pure cow desi ghee.',
        descriptionHindi: 'देशी घी में गरमा-गरम जलेबी तलने और चाशनी में डुबोने की भारी कड़ाही।',
        icon: '🥘',
      },
      {
        id: 'sweet-jalebi',
        name: 'Crispy Golden Saffron Jalebis',
        nameHindi: 'केसरिया कुरकुरी रसीली जलेबी',
        category: 'Sweets',
        description: 'Thin, crispy, and dripping with saffron syrup, fresh off the hot kadhai.',
        descriptionHindi: 'केसर की खुशबू और रसीली मिठास से भरपूर गरमा-गरम जलेबी।',
        icon: '🍥',
      },
      {
        id: 'sweet-laddoo',
        name: 'Royal Motichoor Laddoos Pyramid',
        nameHindi: 'मोतीचूर के लड्‌डू का थाल',
        category: 'Sweets',
        description: 'Fine gram flour pearls cooked in ghee and garnished with pistachios and silver varak.',
        descriptionHindi: 'बारीक बूंदी, पिस्ता और चाँदी के वर्क से सजे भगवान के भोग वाले लड्डू।',
        icon: '🟡',
      },
      {
        id: 'sweet-scale',
        name: 'Vintage Brass Weighing Scale (तराजू)',
        nameHindi: 'पारंपरिक पीतल का तराजू एवं बाट',
        category: 'Counter',
        description: 'Traditional twin-pan brass scale used to measure 1/2kg and 1kg sweet boxes with golden ribbons.',
        descriptionHindi: 'आधा किलो और एक किलो मिठाई के डिब्बों को तौलने का प्रामाणिक तराजू।',
        icon: '⚖️',
      },
    ],
  },
  school: {
    type: 'school',
    titleHi: 'सुमित इंटरनेशनल स्कूल (स्मार्ट क्लासरूम)',
    titleEn: 'Sumit International School (Smart Classroom)',
    subtitleHi: 'डिजिटल ब्लैकबोर्ड, विद्यार्थी डेस्क, विज्ञान ग्लोब व पुस्तकालय',
    subtitleEn: 'Digital blackboard, student desks, science globe & library',
    icon: '🏫',
    accentColor: '#3b82f6',
    items: [
      {
        id: 'school-board',
        name: 'School Blackboard: "सुमित स्कूल - स्वागतम्"',
        nameHindi: 'क्लासरूम श्यामपट्ट (ब्लैकबोर्ड)',
        category: 'Teaching',
        description: 'Chalkboard displaying today\'s date, Hindi thought of the day, and mathematical formulas.',
        descriptionHindi: 'आज का सुविचार: "विद्या सर्वस्य भूषणम्" - चौक से लिखा मुख्य ब्लैकबोर्ड।',
        icon: '📋',
      },
      {
        id: 'school-desk',
        name: 'Solid Wood Student Twin Desks',
        nameHindi: 'लकड़ी की विद्यार्थी डेस्क व बेंच',
        category: 'Furniture',
        description: 'Ergonomic wooden dual desks with pencil grooves and storage shelves for school satchels.',
        descriptionHindi: 'किताबें और बस्ता रखने की जगह वाली साफ-सुथरी लकड़ी की बेंच।',
        icon: '🪑',
      },
      {
        id: 'school-globe',
        name: 'Rotating World Geographic Globe',
        nameHindi: 'घूमने वाला पृथ्वी का ग्लोब',
        category: 'Science',
        description: 'Detailed geographic globe illustrating continents, oceans, and India\'s majestic borders.',
        descriptionHindi: 'भूगोल और विज्ञान समझाने हेतु शिक्षक की टेबल पर रखा ग्लोब।',
        icon: '🌍',
      },
      {
        id: 'school-bell',
        name: 'Period Recess Brass Gong Bell',
        nameHindi: 'स्कूल की पीतल की घंटी (टन-टन)',
        category: 'Bell',
        description: 'Traditional brass school bell rung with a wooden mallet to announce class intervals and lunch recess.',
        descriptionHindi: 'हर पीरियड और लंच ब्रेक की सूचना देने वाली ऐतिहासिक पीतल की घंटी।',
        icon: '🔔',
      },
    ],
  },
  hotel: {
    type: 'hotel',
    titleHi: 'सुमित ग्रैंड हेरिटेज होटल (महाराजा सुइट)',
    titleEn: 'Sumit Grand Heritage Hotel (Maharaja Suite)',
    subtitleHi: 'शाही राजसी सुइट, चांदी की थाली, फव्वारा दृश्य व झूमर',
    subtitleEn: 'Royal suite, silver maharaja dining thali & crystal chandelier',
    icon: '🏨',
    accentColor: '#f59e0b',
    items: [
      {
        id: 'hotel-thali',
        name: 'Royal Maharaja Silver Dining Thali',
        nameHindi: 'शाही महाराजा रजत थाली',
        category: 'Fine Dining',
        description: '36-dish Rajasthani feast including Dal Baati Churma, Gatta Curry, Ker Sangri, and sweet Kheer.',
        descriptionHindi: 'दाल-बाटी-चूरमा, गट्टे की सब्जी, केर सांगरी और केसरिया खीर की शाही थाली।',
        icon: '🍽️',
      },
      {
        id: 'hotel-chandelier',
        name: 'Crystal Glass Royal Chandelier',
        nameHindi: 'भव्य क्रिस्टल झूमर',
        category: 'Decor',
        description: 'Multi-tiered sparkling glass chandelier bathing the heritage suite in golden ambient warmth.',
        descriptionHindi: 'हॉल की छत से लटकता स्वर्णिम रोशनी बिखेरता नक्काशीदार झूमर।',
        icon: '✨',
      },
      {
        id: 'hotel-bell',
        name: 'Brass Concierge Service Bell',
        nameHindi: 'स्वागत कक्ष की घंटी (दरबारी बेल)',
        category: 'Service',
        description: 'Polished counter bell on marble front desk for 24x7 Maharaja room service and luggage valet.',
        descriptionHindi: '२४ घंटे कक्ष सेवा एवं स्वागत हेतु रिसेप्शन पर रखी घंटी।',
        icon: '🛎️',
      },
      {
        id: 'hotel-sofa',
        name: 'Carved Teakwood Silk Sofa with Cushions',
        nameHindi: 'नक्काशीदार सागवान का मखमली सोफा',
        category: 'Living',
        description: 'Handcrafted heritage couch upholstered in crimson Banarasi brocade silk with zardozi cushions.',
        descriptionHindi: 'शाही आराम हेतु बनारसी सिल्क से सुसज्जित राजस्थानी सोफा।',
        icon: '🛋️',
      },
    ],
  },
  ebook_store: {
    type: 'ebook_store',
    titleHi: 'सोमो ई-बुक्स स्टोर एवं लाइब्रेरी (अंदर का दृश्य)',
    titleEn: 'Somo eBooks Store & Library (Interior)',
    subtitleHi: 'हजारों ज्ञानवर्धक पुस्तकें, पठन डेस्क, रीडिंग लैंप व आरामकुर्सी',
    subtitleEn: 'Thousands of Hindi & English titles, reading lamps & armchairs',
    icon: '📚',
    accentColor: '#ec4899',
    items: [
      {
        id: 'book-shelves',
        name: 'Mahogany Oak Multi-Tier Bookshelves',
        nameHindi: 'शीशम की विशाल पुस्तक शेल्व्स',
        category: 'Library',
        description: 'Stacked with timeless classics of Munshi Premchand, Tagore, science, coding, and history.',
        descriptionHindi: 'प्रेमचंद, टैगोर, विज्ञान, कोडिंग और इतिहास की अनमोल पुस्तकों का खजाना।',
        icon: '📖',
      },
      {
        id: 'book-lamp',
        name: 'Emerald Green Banker\'s Desk Lamp',
        nameHindi: 'हरित बैंकर रीडिंग लैंप',
        category: 'Study',
        description: 'Soft warm reading illumination casting gentle light across open manuscripts and note pads.',
        descriptionHindi: 'अध्ययन मेज पर रखी सुकूनदेह पीली रोशनी देने वाली विंटेज टेबल लैंप।',
        icon: '💡',
      },
      {
        id: 'book-chair',
        name: 'Tufted Leather Reader\'s Armchair',
        nameHindi: 'मखमली पठन आरामकुर्सी',
        category: 'Comfort',
        description: 'Deep wingback armchair designed for uninterrupted hours of immersive book reading.',
        descriptionHindi: 'शांत मन से घंटों किताबें पढ़ने हेतु अत्यंत आरामदायक सोफा कुर्सी।',
        icon: '🪑',
      },
    ],
  },
  train_coach: {
    type: 'train_coach',
    titleHi: 'सुमित एक्सप्रेस ट्रेन कोच (अंदर का दृश्य)',
    titleEn: 'Sumit Express Train Coach (Inside View)',
    subtitleHi: 'भारतीय रेल एसी कोच, नीली कुशन सीटें, खिड़की का विहंगम दृश्य',
    subtitleEn: 'Indian Railways coach interior, cushioned berths & scenic window',
    icon: '🚂',
    accentColor: '#1d4ed8',
    items: [
      {
        id: 'train-berth',
        name: 'Blue Cushioned Passenger Sleeper Berths',
        nameHindi: 'नीली गद्देदार यात्री बर्थ (सीटें)',
        category: 'Seating',
        description: 'Comfortable sleeper seats with fold-down upper berths and soft headrests.',
        descriptionHindi: 'सफर के आराम हेतु भारतीय रेल की क्लासिक नीली कुशन सीटें।',
        icon: '💺',
      },
      {
        id: 'train-window',
        name: 'Panoramic Train Window with River View',
        nameHindi: 'विहंगम ट्रेन खिड़की (नदी व शहर का दृश्य)',
        category: 'Window',
        description: 'Large tinted glass window looking directly out over the flowing river, bridges, and city streets.',
        descriptionHindi: 'ट्रेन की खिड़की जहाँ से बाहर भागते पेड़, नदी, पुल और शहर का नजारा दिखता है।',
        icon: '🪟',
      },
      {
        id: 'train-luggage',
        name: 'Overhead Chrome Luggage Rack',
        nameHindi: 'ऊपरी सामान रैक एवं सूटकेस',
        category: 'Storage',
        description: 'Sturdy stainless-steel luggage rack holding passenger VIP suitcases and traveling bags.',
        descriptionHindi: 'यात्रियों के बैग और सूटकेस सुरक्षित रखने का मजबूत रैक।',
        icon: '🧳',
      },
      {
        id: 'train-chai',
        name: 'Railway Chai Glasses on Foldout Table',
        nameHindi: 'फोल्डिंग टेबल पर चाय के गिलास',
        category: 'Refreshment',
        description: '"गर्म चाय, चाय!" - railway station chai glasses and snacks served right at your seat.',
        descriptionHindi: 'सीट के पास छोटी टेबल पर रखी गरमा-गरम चाय और पानी की बोतल।',
        icon: '🍵',
      },
    ],
  },
  airplane_cabin: {
    type: 'airplane_cabin',
    titleHi: 'सुमित एयरवेज विमान केबिन एवं कॉकपिट',
    titleEn: 'Sumit Airways Aircraft Cabin & Cockpit',
    subtitleHi: 'पायलट फ्लाइट कंट्रोल, एवियोनिक्स स्क्रीन, यात्री सीटें व आकाश दृश्य',
    subtitleEn: 'Cockpit instruments, avionics screens, passenger seats & cloud view',
    icon: '✈️',
    accentColor: '#0284c7',
    items: [
      {
        id: 'plane-cockpit',
        name: 'Pilot Flight Deck & Digital Avionics PFD',
        nameHindi: 'पायलट कॉकपिट एवं डिजिटल एवियोनिक्स',
        category: 'Flight Deck',
        description: 'Primary Flight Display (PFD) showing altitude, artificial horizon, airspeed, and GPS course.',
        descriptionHindi: 'विमान की ऊँचाई, दिशा और गति दर्शाने वाली डिजिटल पायलट स्क्रीन।',
        icon: '🎛️',
      },
      {
        id: 'plane-yoke',
        name: 'Dual Flight Control Yoke & Throttles',
        nameHindi: 'फ्लाइट कंट्रोल योक एवं थ्रॉटल लीवर्स',
        category: 'Controls',
        description: 'Twin control yokes and dual-engine thrust levers steering the Boeing/Airbus jet.',
        descriptionHindi: 'हवाई जहाज को मोड़ने और इंजन की ताकत बढ़ाने वाले मुख्य हैंडल्स।',
        icon: '🎮',
      },
      {
        id: 'plane-seats',
        name: 'Luxury Leather Passenger Seats (Row 1A)',
        nameHindi: 'आरामदायक लेदर पैसेंजर सीटें (रो 1A)',
        category: 'Cabin',
        description: 'Reclining premium seats with seatbelt buckle, tray table, and personal AC vent.',
        descriptionHindi: 'सिटबेल्ट, फोल्डेबल मील ट्रे और एसी वेंट युक्त वीआईपी सीटें।',
        icon: '💺',
      },
      {
        id: 'plane-sky',
        name: 'Aircraft Oval Window Overlooking Clouds',
        nameHindi: 'अंडाकार विमान खिड़की (आसमान व बादल)',
        category: 'View',
        description: 'Crystal-clear aerial view of fluffy white clouds, the winding blue river, and Sumit Ki Nagri below.',
        descriptionHindi: 'हजारों फीट ऊपर से बादलों और नीचे चमकती नदी व पूरे शहर का भव्य दर्शन।',
        icon: '☁️',
      },
    ],
  },
  haveli: {
    type: 'haveli',
    titleHi: 'सुमित निवास (मुख्य हवेली का भीतरी प्रांगण)',
    titleEn: 'Sumit Niwas (Mayor Haveli Interior)',
    subtitleHi: 'संस्थापक सुमित गुप्ता का भव्य राजसी कक्ष, नक्काशीदार झरोखे',
    subtitleEn: 'Founder Sumit Gupta\'s grand manor, carved jharokhas & royal hall',
    icon: '🏛️',
    accentColor: '#d97706',
    items: [
      {
        id: 'haveli-throne',
        name: 'Nagar Pramukh Carved Teakwood Seat',
        nameHindi: 'नगर प्रमुख की नक्काशीदार राजसी कुर्सी',
        category: 'Hall',
        description: 'Founder Sumit Gupta\'s official chair with golden embroidered crest and velvet armrests.',
        descriptionHindi: 'संस्थापक सुमित गुप्ता जी की स्वर्ण जड़ित आधिकारिक प्रमुख कुर्सी।',
        icon: '👑',
      },
      {
        id: 'haveli-jharokha',
        name: 'Rajasthani Carved Sandstone Jharokha',
        nameHindi: 'नक्काशीदार बलुआ पत्थर का झरोखा',
        category: 'Architecture',
        description: 'Intricately pierced stone lattice window overlooking the bustling central bazaar chowk.',
        descriptionHindi: 'बाजार चौक और रेलवे स्टेशन का सुंदर नजारा दिखाने वाला पारंपरिक झरोखा।',
        icon: '🪟',
      },
      {
        id: 'haveli-carpet',
        name: 'Hand-Knotted Kashmiri Silk Carpet',
        nameHindi: 'हाथ से बुना कश्मीरी रेशमी कालीन',
        category: 'Floor',
        description: 'Antique Persian-patterned silk rug covering the cool marble courtyard floor.',
        descriptionHindi: 'संगमरमर के फर्श पर बिछा पारंपरिक सुंदर रेशमी कालीन।',
        icon: '🧶',
      },
    ],
  },
  theater: {
    type: 'theater',
    titleHi: 'सुमित टॉकीज • 3D सिनेमा (अंदर का दृश्य)',
    titleEn: 'Sumit Talkies 3D Cinema (Auditorium Interior)',
    subtitleHi: 'कर्व्ड 4K सिल्वर स्क्रीन, वीआईपी रिक्लाइनर सीटें एवं डॉल्बी एटमॉस',
    subtitleEn: 'Curved 4K Silver Screen, VIP Recliner Seats & Dolby Atmos 7.1',
    icon: '🎬',
    accentColor: '#e11d48',
    items: [
      {
        id: 'theater-screen',
        name: 'Curved 4K Silver Screen',
        nameHindi: 'चांदी का विशाल 4K कर्व्ड पर्दा',
        category: 'Projection',
        description: 'Giant perforated silver screen for hyper-real 3D movie immersion with dual laser projectors.',
        descriptionHindi: 'लेजर प्रोजेक्टर युक्त विशाल 3D सिल्वर स्क्रीन।',
        icon: '📽️',
      },
      {
        id: 'theater-recliners',
        name: 'Plush Leather Recliner Seats',
        nameHindi: 'मखमली लाल वीआईपी रिक्लाइनर सीटें',
        category: 'Seating',
        description: 'Motorized leather recliners with personal cup holders, snack tables, and leg rests.',
        descriptionHindi: 'निजी कप होल्डर और स्नैक टेबल युक्त मोटर चालित रिक्लाइनर सीटें।',
        icon: '🛋️',
      },
      {
        id: 'theater-popcorn',
        name: 'Fresh Buttery Caramel Popcorn',
        nameHindi: 'मक्खनदार कैरमल पॉपकॉर्न एवं कोल्ड ड्रिंक',
        category: 'Concessions',
        description: 'Freshly popped jumbo corn kernels tossed in golden caramel syrup and sea salt butter.',
        descriptionHindi: 'शुद्ध मक्खन और कैरमल में भुना कुरकुरा पॉपकॉर्न।',
        icon: '🍿',
      },
    ],
  },
  police_thana: {
    type: 'police_thana',
    titleHi: 'सुमित पुलिस थाना एवं सेंट्रल जेल (अंदर का दृश्य)',
    titleEn: 'Sumit Police Thana & Lock-Up (Interior)',
    subtitleHi: 'थानाध्यक्ष कक्ष, २४x७ एफआईआर रजिस्टर एवं सेंट्रल जेल हवालात',
    subtitleEn: 'Inspector Desk, 24x7 FIR Register & Central Jail Lock-Up',
    icon: '🚨',
    accentColor: '#1e3a8a',
    items: [
      {
        id: 'police-desk',
        name: 'Inspector In-Charge Desk',
        nameHindi: 'थानाध्यक्ष की सागौन की मेज व अशोक स्तंभ',
        category: 'Office',
        description: 'Officer desk with Indian national emblem, case stamps, and wireless walkie-talkie.',
        descriptionHindi: 'थाना प्रभारी की आधिकारिक मेज, मोहरें और वायरलेस सेट।',
        icon: '👮',
      },
      {
        id: 'police-fir',
        name: 'Digital 24x7 FIR Register',
        nameHindi: '२४x७ डिजिटल एफआईआर केस रजिस्टर',
        category: 'Records',
        description: 'Instant computerized First Information Report logging with secure town citizen protection.',
        descriptionHindi: 'नागरिकों की सुरक्षा हेतु त्वरित एफआईआर दर्ज करने का रजिस्टर।',
        icon: '📋',
      },
      {
        id: 'police-jail',
        name: 'Central Lock-Up Steel Cell',
        nameHindi: 'हवालात की मजबूत लोहे की सलाखें',
        category: 'Lock-Up',
        description: 'Reinforced carbon steel prison cell keeping captured lawbreakers securely behind bars.',
        descriptionHindi: 'पकड़े गए अपराधियों को रखने हेतु सुरक्षित लोहे की हवालात।',
        icon: '🔒',
      },
    ],
  },
  restaurant: {
    type: 'restaurant',
    titleHi: 'सुमित हेरिटेज शाही रेस्टोरेंट (डायनिंग हॉल)',
    titleEn: 'Sumit Heritage Royal Restaurant (Dining Hall)',
    subtitleHi: 'शाही महाराजा थाली, तंदूरी नान, दाल मखनी एवं केसरिया कुल्हड़ लस्सी',
    subtitleEn: 'Royal Maharaja Thali, Tandoori Naan, Dal Makhani & Saffron Lassi',
    icon: '🍽️',
    accentColor: '#d97706',
    items: [
      {
        id: 'restaurant-thali',
        name: 'Shahi Maharaja Thali (12 Delicacies)',
        nameHindi: 'शाही महाराजा थाली (१२ पारंपरिक पकवान)',
        category: 'Cuisine',
        description: 'Grand royal thali with paneer tikka, dal makhani, fragrant jeera rice, butter naan, and gulab jamun.',
        descriptionHindi: 'शाही पनीर, दाल मखनी, तंदूरी नान और केसरिया गुलाब जामुन की भव्य थाली।',
        icon: '🍛',
      },
      {
        id: 'restaurant-table',
        name: 'Rosewood Dining Table with Brass Lamps',
        nameHindi: 'शीशम की डायनिंग टेबल व पीतल के दीप',
        category: 'Dining',
        description: 'Carved Sheesham dining table laid with polished stainless steel katoris and linen napkins.',
        descriptionHindi: 'पारंपरिक नक्काशीदार शीशम की डाइनिंग टेबल।',
        icon: '🪑',
      },
      {
        id: 'restaurant-lassi',
        name: 'Malai Kesar Kulhad Lassi',
        nameHindi: 'मलाईदार केसरिया कुल्हड़ लस्सी',
        category: 'Beverage',
        description: 'Thick churned sweet curd garnished with roasted pistachios, almonds, and saffron strands.',
        descriptionHindi: 'पिस्ता-बादाम से सजी गाढ़ी कुल्हड़ लस्सी।',
        icon: '🥛',
      },
    ],
  },
  park_pool: {
    type: 'park_pool',
    titleHi: 'सुमित पार्क, झूला एवं स्विमिंग पूल (अंदर का दृश्य)',
    titleEn: 'Sumit Park, Swings & Swimming Pool (Interior)',
    subtitleHi: 'बच्चों का झूला, ओलंपिक स्विमिंग पूल, डाइविंग बोर्ड व सोमो रीडिंग कॉर्नर',
    subtitleEn: 'Children Swings, Olympic Pool, Spring Diving Board & Book Corner',
    icon: '🏊',
    accentColor: '#06b6d4',
    items: [
      {
        id: 'park-swings',
        name: 'Twin A-Frame Swings (झूला)',
        nameHindi: 'बच्चों का मजबूत स्टील का झूला',
        category: 'Playground',
        description: 'High-swinging playground swings with smooth bearing oscillation and child-safe bucket seats.',
        descriptionHindi: 'हवा में लहराता बच्चों का प्रिय सुरक्षित झूला।',
        icon: '🎪',
      },
      {
        id: 'pool-water',
        name: 'Turquoise Swimming Pool Basin',
        nameHindi: 'साफ नीले पानी का स्विमिंग पूल',
        category: 'Pool',
        description: 'Filtered crystal-clear swimming pool with underwater LED illumination and splash lanes.',
        descriptionHindi: 'अत्याधुनिक फिल्टर और साफ पानी वाला तरणताल।',
        icon: '🌊',
      },
      {
        id: 'park-bench',
        name: 'Reading Bench with Somo eBooks',
        nameHindi: 'सोमो ई-बुक्स पढ़ने की छायादार बेंच',
        category: 'Leisure',
        description: 'Weatherproof wooden garden bench under Gulmohar trees for leisurely reading Somo digital novels.',
        descriptionHindi: 'शांत वातावरण में बैठकर सोमो की डिजिटल पुस्तकें पढ़ने का स्थान।',
        icon: '📖',
      },
    ],
  },
};

export const ShopInteriorModal: React.FC<ShopInteriorModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialShopType = 'gym',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [currentShop, setCurrentShop] = useState<ShopInteriorType>(initialShopType);
  const [selectedItem, setSelectedItem] = useState<InteriorItem | null>(null);

  // Sync initial type when opening
  useEffect(() => {
    if (initialShopType) {
      setCurrentShop(initialShopType);
      const def = INTERIOR_DEFS[initialShopType];
      if (def && def.items.length > 0) {
        setSelectedItem(def.items[0]);
      }
    }
  }, [initialShopType, isOpen]);

  const sceneDef = INTERIOR_DEFS[currentShop] || INTERIOR_DEFS.gym;

  // Set default selected item if none
  useEffect(() => {
    if (sceneDef.items.length > 0 && (!selectedItem || !sceneDef.items.find(i => i.id === selectedItem.id))) {
      setSelectedItem(sceneDef.items[0]);
    }
  }, [currentShop, sceneDef]);

  // Three.js Cutaway 3D Interior Viewer
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    let animId = 0;
    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep modern slate studio

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.2, 50);
    // Isometric isometric corner cutaway angle
    camera.position.set(7.5, 6.0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    controls.target.set(0, 1.2, 0);

    // Warm Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Build Cutaway Room Box (Floor + Back Wall + Left Wall, open Front & Right for clear view)
    const roomGroup = new THREE.Group();

    // Floor
    const floorGeo = new THREE.PlaneGeometry(6, 6);
    let floorCol = 0x334155;
    if (currentShop === 'gym') floorCol = 0x111827; // Dark rubber gym mats
    if (currentShop === 'hospital') floorCol = 0xf8fafc; // Clean white hospital tiles
    if (currentShop === 'medical_store') floorCol = 0xe2e8f0;
    if (currentShop === 'chai_stall') floorCol = 0x78350f; // Warm terracotta bricks
    if (currentShop === 'sweet_shop') floorCol = 0x9a3412;
    if (currentShop === 'hotel') floorCol = 0xfef08a; // Polished marble
    if (currentShop === 'train_coach') floorCol = 0x1e3a8a;

    const floorMat = new THREE.MeshStandardMaterial({ color: floorCol, roughness: 0.6 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Back Wall
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), backWallMat);
    backWall.position.set(0, 2, -3);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), backWallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-3, 2, 0);
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // Dynamic Props inside room according to currentShop
    const dynamicActors: { update: (time: number) => void }[] = [];

    if (currentShop === 'gym') {
      // 1. Dumbbell Rack along back wall
      const rack = new THREE.Group();
      rack.position.set(-1.2, 0, -2.4);
      const rackStand = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 0.8, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 })
      );
      rackStand.position.y = 0.4;
      rack.add(rackStand);

      // Multiple colored dumbbells on rack
      [-1.1, -0.5, 0.1, 0.7, 1.1].forEach((dx, i) => {
        const db = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.35, 8),
          new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xf59e0b : 0xef4444, metalness: 0.7 })
        );
        db.rotation.x = Math.PI / 2;
        db.position.set(dx, 0.85, 0);
        rack.add(db);
      });
      roomGroup.add(rack);

      // 2. Bench Press in center
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.4, 1.8),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 })
      );
      bench.position.set(0.8, 0.2, -0.4);
      roomGroup.add(bench);

      // Barbell
      const barbell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
      );
      barbell.rotation.z = Math.PI / 2;
      barbell.position.set(0.8, 1.1, -0.4);
      roomGroup.add(barbell);

      // 3. Animated Bodybuilder doing curls
      const lifter = new THREE.Group();
      lifter.position.set(-0.8, 0, 0.8);
      const lifterBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.7, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b })
      );
      lifterBody.position.y = 0.95;
      const lifterHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xaf7a48 })
      );
      lifterHead.position.y = 1.45;

      const leftArm = new THREE.Group();
      leftArm.position.set(-0.35, 1.2, 0);
      const lDumb = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0x111827 }));
      lDumb.rotation.x = Math.PI / 2;
      lDumb.position.y = -0.3;
      leftArm.add(lDumb);

      lifter.add(lifterBody, lifterHead, leftArm);
      roomGroup.add(lifter);

      dynamicActors.push({
        update: (time) => {
          leftArm.rotation.x = 0.5 + Math.sin(time * 4) * 0.7;
          barbell.position.y = 1.1 + Math.sin(time * 3) * 0.25;
        },
      });
    } else if (currentShop === 'hospital') {
      // 1. Hospital Bed with Patient
      const bed = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.6, 2.4),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9 })
      );
      bed.position.set(-0.6, 0.3, -0.6);
      roomGroup.add(bed);

      // Blue blanket
      const blanket = new THREE.Mesh(
        new THREE.BoxGeometry(1.18, 0.15, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x0284c7 })
      );
      blanket.position.set(-0.6, 0.65, -0.2);
      roomGroup.add(blanket);

      // 2. ECG Cardiac Monitor
      const ecgStand = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.4, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      );
      ecgStand.position.set(0.6, 0.7, -1.8);

      const ecgScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.4, 0.3),
        new THREE.MeshBasicMaterial({ color: 0x10b981 }) // Glowing green pulse
      );
      ecgScreen.position.set(0.6, 1.2, -1.58);
      roomGroup.add(ecgStand, ecgScreen);

      // 3. IV Saline Stand
      const ivPole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
      );
      ivPole.position.set(-1.6, 1.1, -1.6);
      const ivBottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.7 })
      );
      ivBottle.position.set(-1.6, 2.0, -1.6);
      roomGroup.add(ivPole, ivBottle);

      // Doctor standing by bed
      const doc = new THREE.Group();
      doc.position.set(0.8, 0, 0.4);
      const docBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.3), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      docBody.position.y = 0.95;
      const docHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color: 0xaf7a48 }));
      docHead.position.y = 1.45;
      doc.add(docBody, docHead);
      roomGroup.add(doc);

      dynamicActors.push({
        update: (time) => {
          // Subtle pulse flicker on ECG
          ecgScreen.scale.x = 0.95 + Math.sin(time * 6) * 0.1;
        },
      });
    } else if (currentShop === 'chai_stall') {
      // 1. Stove with boiling kettle
      const stove = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      );
      stove.position.set(-1.2, 0.4, -1.8);

      const kettle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.35, 0.5, 12),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 }) // Brass
      );
      kettle.position.set(-1.2, 1.05, -1.8);
      roomGroup.add(stove, kettle);

      // 2. Kulhad clay cups stacked on counter
      const counter = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.9, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x78350f })
      );
      counter.position.set(0.4, 0.45, -1.8);
      roomGroup.add(counter);

      [-0.4, 0, 0.4].forEach((cx, i) => {
        const stack = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.08, 0.35, 8),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 })
        );
        stack.position.set(0.4 + cx, 1.05, -1.8);
        roomGroup.add(stack);
      });

      // 3. Samosa tray
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.06, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
      );
      tray.position.set(0.4, 0.93, -1.2);
      roomGroup.add(tray);

      dynamicActors.push({
        update: (time) => {
          // Kettle subtle steam bounce
          kettle.position.y = 1.05 + Math.sin(time * 8) * 0.01;
        },
      });
    } else {
      // Default / Other: Furniture & Display Tables
      const table = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.8, 1.2),
        new THREE.MeshStandardMaterial({ color: 0xb45309 })
      );
      table.position.set(0, 0.4, -0.6);
      roomGroup.add(table);

      // Accent prop
      const prop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 })
      );
      prop.position.set(0, 1.1, -0.6);
      roomGroup.add(prop);
    }

    scene.add(roomGroup);

    // Animation Loop
    const clock = new THREE.Clock();
    const tick = () => {
      const time = clock.getElapsedTime();
      dynamicActors.forEach((a) => a.update(time));
      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
    };
  }, [isOpen, currentShop]);

  if (!isOpen) return null;

  const handlePlaySound = () => {
    if (currentShop === 'gym') soundEngine.playGymDumbbellClink();
    else if (currentShop === 'hospital') soundEngine.playHospitalSiren();
    else if (currentShop === 'chai_stall') soundEngine.playChaiClink();
    else if (currentShop === 'medical_store') soundEngine.playPharmacyChime();
    else if (currentShop === 'school') soundEngine.playSchoolBell();
    else if (currentShop === 'hotel') soundEngine.playHotelConciergeBell();
    else if (currentShop === 'train_coach') soundEngine.playTrainWhistle();
    else if (currentShop === 'theater') soundEngine.playCinemaFanfare();
    else if (currentShop === 'police_thana') soundEngine.playPoliceSiren();
    else if (currentShop === 'park_pool') soundEngine.playPoolSplash();
    else if (currentShop === 'restaurant') soundEngine.playChaiClink();
    else soundEngine.playNamasteChime();
  };

  const shopTabs: { id: ShopInteriorType; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'theater', labelHi: 'सुमित टॉकीज', labelEn: '3D Cinema', icon: '🎬' },
    { id: 'police_thana', labelHi: 'पुलिस थाना', labelEn: 'Police & Jail', icon: '🚨' },
    { id: 'restaurant', labelHi: 'शाही रेस्टोरेंट', labelEn: 'Restaurant', icon: '🍽️' },
    { id: 'park_pool', labelHi: 'पार्क एवं पूल', labelEn: 'Park & Pool', icon: '🏊' },
    { id: 'gym', labelHi: 'सुमित जिम', labelEn: 'Gym', icon: '🏋️' },
    { id: 'hospital', labelHi: 'हॉस्पिटल', labelEn: 'Hospital', icon: '🏥' },
    { id: 'medical_store', labelHi: 'मेडिकल स्टोर', labelEn: 'Pharmacy', icon: '💊' },
    { id: 'chai_stall', labelHi: 'चाय टपरी', labelEn: 'Chai Stall', icon: '☕' },
    { id: 'sweet_shop', labelHi: 'मिष्ठान भण्डार', labelEn: 'Sweets', icon: '🍬' },
    { id: 'school', labelHi: 'सुमित स्कूल', labelEn: 'School', icon: '🏫' },
    { id: 'hotel', labelHi: 'ग्रैंड होटल', labelEn: 'Hotel', icon: '🏨' },
    { id: 'ebook_store', labelHi: 'ई-बुक्स स्टोर', labelEn: 'eBooks', icon: '📚' },
    { id: 'train_coach', labelHi: 'ट्रेन कोच', labelEn: 'Train Coach', icon: '🚂' },
    { id: 'airplane_cabin', labelHi: 'विमान केबिन', labelEn: 'Plane Cabin', icon: '✈️' },
    { id: 'haveli', labelHi: 'सुमित निवास', labelEn: 'Sumit Niwas', icon: '🏛️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl shadow-black/80 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
              style={{ backgroundColor: `${sceneDef.accentColor}25`, border: `1px solid ${sceneDef.accentColor}60` }}
            >
              {sceneDef.icon}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 font-heading">
                {lang === 'hi' ? sceneDef.titleHi : sceneDef.titleEn}
              </h2>
              <p className="text-xs text-amber-300/80">
                {lang === 'hi' ? sceneDef.subtitleHi : sceneDef.subtitleEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlaySound}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition cursor-pointer"
              title="Sound"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Navigation: Select Shop / Building to inspect */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-950/70 border-b border-slate-800 scrollbar-none">
          {shopTabs.map((tab) => {
            const active = currentShop === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentShop(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body: Left 3D Cutaway View, Right Item Shelf & Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          {/* 3D Cutaway Room Canvas */}
          <div className="md:col-span-7 relative h-72 sm:h-96 md:h-auto min-h-[300px] bg-slate-950 flex flex-col justify-between p-2">
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />
            {/* View controls hint badge */}
            <div className="absolute top-3 left-3 pointer-events-none px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? '3D कटअवे दृश्य • घुमाकर देखें' : '3D Cutaway • Drag to orbit'}</span>
            </div>
            <div className="absolute bottom-3 left-3 pointer-events-none px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[10px] text-slate-400">
              {lang === 'hi' ? 'सामान पर क्लिक करें' : 'Click items on right to inspect'}
            </div>
          </div>

          {/* Right Panel: Items in Stock / Interactive Equipment List */}
          <div className="md:col-span-5 p-3.5 sm:p-4 bg-slate-900 flex flex-col gap-3 border-t md:border-t-0 md:border-l border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'दुकान का सामान एवं उपकरण' : 'Inventory & Equipment'}</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {sceneDef.items.length} {lang === 'hi' ? 'सामान' : 'items'}
              </span>
            </div>

            {/* Item Cards List */}
            <div className="flex flex-col gap-2 max-h-56 md:max-h-64 overflow-y-auto pr-1">
              {sceneDef.items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      handlePlaySound();
                    }}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 text-white shadow'
                        : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-100 truncate">
                          {lang === 'hi' ? item.nameHindi : item.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-amber-300 font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {lang === 'hi' ? item.descriptionHindi : item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Item Detailed Inspector Box */}
            {selectedItem && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex flex-col gap-1.5 mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedItem.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-200">
                      {lang === 'hi' ? selectedItem.nameHindi : selectedItem.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">{selectedItem.category}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'hi' ? selectedItem.descriptionHindi : selectedItem.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
