export type HouseStyle =
  | 'haveli'
  | 'bazaar_shop'
  | 'chai_stall'
  | 'modern_villa'
  | 'village_hut'
  | 'temple_guest'
  | 'station_quarter';

export type MohallaType =
  | 'bazaar_chowk'
  | 'sumit_heritage'
  | 'mandir_marg'
  | 'station_road'
  | 'hari_gaon'
  | 'tech_enclave';

export interface Resident {
  id: string;
  name: string;
  hindiName?: string;
  handle: string; // e.g. @sumitgupta
  email?: string;
  role: string;
  roleHindi?: string;
  houseNumber: number;
  mohalla: MohallaType;
  houseStyle: HouseStyle;
  colorTheme: string;
  quote?: string;
  quoteHindi?: string;
  stories?: string[];
  namasteCount: number;
  joinedDate: string;
  isFounder?: boolean;
  position: { x: number; z: number };
  customSignboard?: string;
}

export interface Landmark {
  id: string;
  name: string;
  hindiName: string;
  type: 'haveli' | 'chai_stall' | 'station' | 'temple' | 'stepwell' | 'banyan_tree' | 'billboard' | 'cinema' | 'sweet_shop' | 'ebook_store' | 'hospital' | 'gym' | 'school' | 'hotel' | 'medical_store';
  description: string;
  descriptionHindi: string;
  position: { x: number; z: number };
  funActionName?: string;
  funActionHindi?: string;
}

export type WeatherType = 'sunny' | 'rain' | 'snow';

export type TimeOfDay = 'morning' | 'afternoon' | 'sunset' | 'night';
export type FestivalMode = 'none' | 'diwali' | 'holi' | 'patang';
export type CameraPreset =
  | 'overview'
  | 'isometric'
  | 'train_ride'
  | 'flight_ride'
  | 'sumit_haveli'
  | 'theater'
  | 'police_thana'
  | 'park_pool'
  | 'restaurant'
  | 'bazaar'
  | 'station'
  | 'temple'
  | 'gaon'
  | 'rickshaw'
  | 'ebook_store'
  | 'sports_ground'
  | 'flight'
  | 'hospital'
  | 'gym'
  | 'school'
  | 'hotel'
  | 'medical_store';

export type ShopInteriorType =
  | 'gym'
  | 'hospital'
  | 'medical_store'
  | 'chai_stall'
  | 'sweet_shop'
  | 'school'
  | 'hotel'
  | 'theater'
  | 'police_thana'
  | 'restaurant'
  | 'park_pool'
  | 'ebook_store'
  | 'train_coach'
  | 'airplane_cabin'
  | 'haveli';

export interface InteriorItem {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  description: string;
  descriptionHindi: string;
  icon: string;
  sound?: string;
}

export interface CityConfig {
  cityName: string;
  cityHindiName: string;
  tagline: string;
  mayor: string;
  residents: Resident[];
  lastUpdated: string;
}

export const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'res-sumit-01',
    name: 'Sumit Gupta',
    hindiName: 'सुमित गुप्ता',
    handle: '@sumitgupta',
    email: 'sumitgupta43996@gmail.com',
    role: 'Nagar Pramukh & Founder',
    roleHindi: 'नगर प्रमुख एवं संस्थापक',
    houseNumber: 1,
    mohalla: 'sumit_heritage',
    houseStyle: 'haveli',
    colorTheme: '#d97706',
    quote: 'Welcome to our living Indian city! Build your home here.',
    quoteHindi: 'हमारी अपनी नगरी में आपका सहर्ष स्वागत है! यहाँ अपना घर बसाएँ।',
    stories: [
      'Founder and visionary architect behind this digital living Nagri.',
      'Loves evening cutting chai at Sharma Ji tapri and watching the evening train pass by.',
      'Invites every friend, visitor, and dreamer to claim their piece of Mohalla.'
    ],
    namasteCount: 248,
    joinedDate: 'Inauguration Day',
    isFounder: true,
    position: { x: 0, z: -10 },
    customSignboard: 'सुमित निवास - SUMIT NIWAS'
  },
  {
    id: 'res-sharma-chai',
    name: 'Sharma Ji',
    hindiName: 'शर्मा जी चाय वाले',
    handle: '@sharmachai',
    role: 'Bazaar Chai Connoisseur',
    roleHindi: 'बाजार के चाय उस्ताद',
    houseNumber: 12,
    mohalla: 'bazaar_chowk',
    houseStyle: 'chai_stall',
    colorTheme: '#b45309',
    quote: 'Ginger elaichi cutting chai with bun muska!',
    quoteHindi: 'अदरक-इलायची वाली कड़क कुल्हड़ चाय और गरमा-गरम समोसे!',
    stories: [
      'The morning hub where all town gossip and morning news papers are shared.',
      'Sumit drinks his first cutting chai of the day right here.'
    ],
    namasteCount: 184,
    joinedDate: 'Day 1',
    position: { x: -14, z: 8 },
    customSignboard: 'शर्मा टी स्टॉल - SPECIAL CHAI'
  },
  {
    id: 'res-gupta-sweets',
    name: 'Gupta Halwai',
    hindiName: 'गुप्ता जी मिष्ठान भण्डार',
    handle: '@guptasweets',
    role: 'Master of Jalebi & Rabri',
    roleHindi: 'जलेबी एवं इमरती के कारीगर',
    houseNumber: 14,
    mohalla: 'bazaar_chowk',
    houseStyle: 'bazaar_shop',
    colorTheme: '#ea580c',
    quote: 'Crispy hot jalebis dipped in pure desi ghee.',
    quoteHindi: 'शुद्ध देशी घी की कुरकुरी जलेबी और केसरिया रबड़ी!',
    stories: [
      'Supplying freshly made laddoos to Shanti Mandir every festival.',
      'Awarded the Golden Kadhai of Sumit Ki Nagri.'
    ],
    namasteCount: 142,
    joinedDate: 'Day 2',
    position: { x: -22, z: 8 },
    customSignboard: 'गुप्ता जी मिष्ठान भण्डार'
  },
  {
    id: 'res-priya-arch',
    name: 'Priya Sharma',
    hindiName: 'प्रिया शर्मा',
    handle: '@priya_designs',
    role: 'Town Heritage Planner',
    roleHindi: 'विरासत वास्तुकार',
    houseNumber: 7,
    mohalla: 'sumit_heritage',
    houseStyle: 'modern_villa',
    colorTheme: '#0284c7',
    quote: 'Designing traditional jharokhas with contemporary light spaces.',
    quoteHindi: 'परंपरा और आधुनिकता का सुंदर संगम।',
    stories: [
      'Helped design the jharokhas of Sumit Niwas.',
      'Always working with a sketchpad on the Stepwell ghat.'
    ],
    namasteCount: 96,
    joinedDate: 'Day 3',
    position: { x: 12, z: -12 },
    customSignboard: 'प्रिया विला - PRIYA ARCHITECT'
  },
  {
    id: 'res-rajesh-auto',
    name: 'Rajesh Bhai Auto',
    hindiName: 'राजेश भाई ऑटो वाले',
    handle: '@rajesh_auto',
    role: 'Nagri Express Auto Pilot',
    roleHindi: 'नगर के सबसे तेज़ ऑटो पायलट',
    houseNumber: 21,
    mohalla: 'station_road',
    houseStyle: 'bazaar_shop',
    colorTheme: '#15803d',
    quote: 'Station se Bazaar Chowk tak sabse tez safar!',
    quoteHindi: 'स्टेशन से बाज़ार चौक मात्र ५ मिनट! मीटर चालू है।',
    stories: [
      'Drives the iconic green-yellow auto rickshaw circulating the town.',
      'Plays classic 90s Bollywood cassettes while driving.'
    ],
    namasteCount: 120,
    joinedDate: 'Day 3',
    position: { x: -8, z: 22 },
    customSignboard: 'राजेश ऑटो गैराज & टूरिस्ट सर्विस'
  },
  {
    id: 'res-pandit-ji',
    name: 'Pandit Ramakant',
    hindiName: 'पंडित रमाकांत जी',
    handle: '@ramakant_ji',
    role: 'Shanti Mandir Head Priest',
    roleHindi: 'शांति मंदिर मुख्य पुजारी',
    houseNumber: 108,
    mohalla: 'mandir_marg',
    houseStyle: 'temple_guest',
    colorTheme: '#f59e0b',
    quote: 'May peace and joy bless every house in Sumit Ki Nagri.',
    quoteHindi: 'सर्वे भवन्तु सुखिनः। नगर के हर घर में सुख-शांति रहे।',
    stories: [
      'Rings the temple bell every evening at aarti time.',
      'Tends to the sacred marigold garden and stepped water pond.'
    ],
    namasteCount: 210,
    joinedDate: 'Day 1',
    position: { x: 26, z: 4 },
    customSignboard: 'शांति निकेतन - MANDIR NIWAS'
  },
  {
    id: 'res-kisan-ramesh',
    name: 'Chaudhary Ramesh',
    hindiName: 'चौधरी रमेश',
    handle: '@kisan_ramesh',
    role: 'Village Elder & Organic Farmer',
    roleHindi: 'गाँव के वरिष्ठ कृषक',
    houseNumber: 5,
    mohalla: 'hari_gaon',
    houseStyle: 'village_hut',
    colorTheme: '#65a30d',
    quote: 'Fresh mustard greens and golden organic wheat fields.',
    quoteHindi: 'सरसों के पीले फूल और लहलहाती शुद्ध फसलें।',
    stories: [
      'Hosts the evening Panchayat under the great Banyan Tree.',
      'Grows the sweetest sugarcane in the district.'
    ],
    namasteCount: 88,
    joinedDate: 'Day 4',
    position: { x: -28, z: -26 },
    customSignboard: 'रमेश कुटीर - HARI GAON'
  },
  {
    id: 'res-ananya-coder',
    name: 'Ananya Verma',
    hindiName: 'अनन्या वर्मा',
    handle: '@ananya_code',
    role: 'Open-Source Hacker & Dreamer',
    roleHindi: 'ओपन-सोर्स डेवलपर',
    houseNumber: 42,
    mohalla: 'tech_enclave',
    houseStyle: 'modern_villa',
    colorTheme: '#9333ea',
    quote: 'Shipping 3D experiences while sipping cutting chai.',
    quoteHindi: 'चाय के साथ नए कोड और थ्री.जेएस का जादू।',
    stories: [
      'Contributed GitHub pull requests for the Nagri street lighting.',
      'Works from her rooftop overlooking the railway station.'
    ],
    namasteCount: 115,
    joinedDate: 'Day 5',
    position: { x: 18, z: -26 },
    customSignboard: 'अनन्या टेक लैब्स'
  }
];

export const INITIAL_LANDMARKS: Landmark[] = [
  {
    id: 'landmark-sumit-niwas',
    name: 'Sumit Niwas (Mayor Haveli)',
    hindiName: 'सुमित निवास (मुख्य हवेली)',
    type: 'haveli',
    description: 'The iconic heritage manor of founder Sumit Gupta. Features grand archways, Rajasthani jharokhas, and a panoramic rooftop over the bazaar.',
    descriptionHindi: 'संस्थापक सुमित गुप्ता जी की भव्य हवेली। नक्काशीदार झरोखे, मेहराब और नगर का सबसे सुंदर दृश्य।',
    position: { x: 0, z: -10 },
    funActionName: 'Send Garland & Namaste',
    funActionHindi: 'माला एवं नमस्ते अर्पित करें'
  },
  {
    id: 'landmark-chai-tapri',
    name: 'Chai Tapri at Bazaar Chowk',
    hindiName: 'शर्मा जी चाय टपरी (बाज़ार चौक)',
    type: 'chai_stall',
    description: 'The heartbeat of Sumit Ki Nagri. Boiling kadak ginger chai served in earthen kulhads with fresh samosas.',
    descriptionHindi: 'अपनी नगरी का धड़कता केंद्र। मिट्टी के कुल्हड़ में अदरक वाली कड़क चाय।',
    position: { x: -14, z: 8 },
    funActionName: 'Order Cutting Chai (चाय लो)',
    funActionHindi: 'कुल्हड़ चाय ऑर्डर करें'
  },
  {
    id: 'landmark-station',
    name: 'Sumit Nagar Junction (Railway Station)',
    hindiName: 'सुमित नगर जंक्शन (रेलवे स्टेशन)',
    type: 'station',
    description: 'Heritage railway platform with vintage station clock, ticket stall, and an animated Indian express train passing through.',
    descriptionHindi: 'विंटेज रेलवे स्टेशन, जहाँ से दैनिक एक्सप्रेस ट्रेन सीटी बजाते हुए गुज़रती है।',
    position: { x: -2, z: 32 },
    funActionName: 'Blow Train Whistle',
    funActionHindi: 'ट्रेन की सीटी बजाएँ'
  },
  {
    id: 'landmark-mandir',
    name: 'Shanti Mandir & Stepwell Ghat',
    hindiName: 'शांति मंदिर एवं बावड़ी घाट',
    type: 'temple',
    description: 'Ancient sandstone temple with a soaring shikhar, fluttering saffron flag, and glowing diyas floating on water.',
    descriptionHindi: 'प्राचीन नक्काशीदार मंदिर एवं सीढ़ीदार बावड़ी घाट, जहाँ शाम को दीप जलते हैं।',
    position: { x: 26, z: 4 },
    funActionName: 'Ring Temple Bell (घंटी बजाओ)',
    funActionHindi: 'मंदिर की घंटी बजाएँ'
  },
  {
    id: 'landmark-banyan',
    name: 'Panchayat Banyan Tree (बरगद का चबूतरा)',
    hindiName: 'विशाल बरगद वृक्ष एवं चबूतरा',
    type: 'banyan_tree',
    description: 'A 100-year-old banyan tree with aerial roots and a brick circular sitting platform where villagers gather to chat.',
    descriptionHindi: 'गाँव का केंद्र जहाँ बुजुर्ग चौपाल लगाते हैं और शांति का अनुभव होता है।',
    position: { x: -26, z: -18 },
    funActionName: 'Sit at Chaupal',
    funActionHindi: 'चौपाल में बैठें'
  },
  {
    id: 'landmark-billboard',
    name: 'Nagri Central Billboard',
    hindiName: 'नगर मुख्य स्वागत होर्डिंग',
    type: 'billboard',
    description: 'Bollywood-styled handpainted grand billboard welcoming all visitors to Sumit Ki Nagri.',
    descriptionHindi: 'हाथ से चित्रित भव्य स्वागत होर्डिंग - अपनी नगरी में आपका स्वागत है!',
    position: { x: 14, z: 18 },
    funActionName: 'Sponsor Billboard',
    funActionHindi: 'होर्डिंग पर विज्ञापन देखें'
  },
  {
    id: 'landmark-sumit-hospital',
    name: 'Sumit Multispeciality Hospital',
    hindiName: 'सुमित मल्टीस्पेशलिटी हॉस्पिटल',
    type: 'hospital',
    description: 'Premier 24x7 healthcare facility established by founder Sumit Gupta. Features advanced ICU, trauma care, ambulance fleet, and expert doctors.',
    descriptionHindi: 'संस्थापक सुमित गुप्ता द्वारा स्थापित अत्याधुनिक 24x7 अस्पताल। आधुनिक आईसीयू, आपातकालीन एम्बुलेंस और अनुभवी विशेषज्ञ डॉक्टर।',
    position: { x: 30, z: -18 },
    funActionName: 'OPD Health Checkup',
    funActionHindi: 'निःशुल्क स्वास्थ्य जाँच / OPD टोकन'
  },
  {
    id: 'landmark-sumit-gym',
    name: 'Sumit Fitness & Power Gym',
    hindiName: 'सुमित फिटनेस एवं पावर जिम',
    type: 'gym',
    description: 'State-of-the-art health and fitness club with Olympic weights, cardio arena, personal coaches, and protein juice bar.',
    descriptionHindi: 'अत्याधुनिक बॉडीबिल्डिंग एवं फिटनेस क्लब। ओलंपिक वेट्स, कार्डियो जोन, डाइट बार और निजी फिटनेस ट्रेनर।',
    position: { x: -22, z: 18 },
    funActionName: 'Workout Booster (वर्कआउट)',
    funActionHindi: 'कसरत करें एवं ऊर्जा बूस्ट'
  },
  {
    id: 'landmark-sumit-school',
    name: 'Sumit International School',
    hindiName: 'सुमित इंटरनेशनल स्कूल',
    type: 'school',
    description: 'Top-tier CBSE institution nurturing leaders of tomorrow. Equipped with modern smart labs, sports grounds, library, and yellow school bus fleet.',
    descriptionHindi: 'नगर का गौरवशाली विद्यालय। डिजिटल स्मार्ट क्लास, विज्ञान प्रयोगशाला, खेल परिसर एवं सुमित स्कूल बस सेवा।',
    position: { x: -10, z: -24 },
    funActionName: 'Ring School Bell (घंटी बजाओ)',
    funActionHindi: 'स्कूल की घंटी बजाएँ'
  },
  {
    id: 'landmark-sumit-hotel',
    name: 'Sumit Grand Heritage Hotel & Resort',
    hindiName: 'सुमित ग्रैंड हेरिटेज होटल एवं रिसॉर्ट',
    type: 'hotel',
    description: '5-star royal palace luxury hotel offering grand maharaja suites, marble fountain courtyard, multi-cuisine dining, and rooftop banquet.',
    descriptionHindi: '५-सितारा राजसी हेरिटेज होटल। भव्य फव्वारा चौक, महाराजा सुइट, शाही राजस्थानी थाली और रूफटॉप दृश्य।',
    position: { x: 4, z: -24 },
    funActionName: 'Book Royal Suite & Dining',
    funActionHindi: 'शाही थाली एवं सुइट बुक करें'
  },
  {
    id: 'landmark-sumit-medical',
    name: 'Sumit 24x7 Medical Store & Pharmacy',
    hindiName: 'सुमित 24x7 मेडिकल स्टोर एवं फार्मेसी',
    type: 'medical_store',
    description: 'Round-the-clock trusted pharmacy providing genuine medicines, emergency first aid, baby care, and home delivery across Sumit Ki Nagri.',
    descriptionHindi: 'दिन-रात खुली भरोसेमंद दवा दुकान। जीवनरक्षक औषधियाँ, प्राथमिक चिकित्सा और नगर में त्वरित होम डिलीवरी।',
    position: { x: -4, z: 15 },
    funActionName: 'First Aid & Medicine Dispenser',
    funActionHindi: 'दवाई एवं फर्स्ट-एड किट प्राप्त करें'
  }
];
