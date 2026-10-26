export type EbookCategory =
  | 'romantic_love'
  | 'emotional_sad'
  | 'pyari_kahani'
  | 'hindi_sahitya'
  | 'poetry_shayari'
  | 'motivation';

export interface EbookChapter {
  id: string;
  title: string;
  titleHindi: string;
  content: string;
}

export interface Ebook {
  id: string;
  title: string;
  titleHindi: string;
  author: string;
  category: EbookCategory;
  coverColor: string;
  coverEmoji: string;
  tagline: string;
  taglineHindi: string;
  description: string;
  descriptionHindi: string;
  readTime: string;
  rating: number;
  likes: number;
  pages: number;
  publishedYear: string;
  repoUrl?: string;
  price: number; // In ₹ INR (e.g. 99)
  originalPrice: number; // In ₹ INR (e.g. 299)
  isPaid: boolean;
  samplePreview?: string;
  samplePreviewHindi?: string;
  chapters: EbookChapter[];
}

export const INITIAL_EBOOKS: Ebook[] = [
  {
    id: 'ebook-ishq-adhoora',
    title: 'Ek Adhoori Prem Kahani (Paid Edition)',
    titleHindi: 'एक अधूरी प्रेम कहानी (प्रीमियम संस्करण)',
    author: 'Sumit Gupta (@sumitg143)',
    category: 'romantic_love',
    coverColor: '#e11d48',
    coverEmoji: '🌹',
    price: 99,
    originalPrice: 299,
    isPaid: true,
    tagline: 'When two souls meet under the monsoon rain of the old bazaar.',
    taglineHindi: 'पुरानी नगरी की बारिश और दो दिलों की अनकही दास्तान।',
    description: 'A touching romantic journey of unspoken confessions, sweet glances at the local chai tapri, and love that transcends distance and time.',
    descriptionHindi: 'एक भावुक प्रेम कहानी जो दिल की गहराइयों को छू जाती है। बाज़ार चौक की चाय टपरी की पहली मुलाक़ात और कभी न भूलने वाले लम्हे।',
    samplePreview: 'Experience the rain-soaked streets of Sumit Ki Nagri and the eternal bond of two lovers...',
    samplePreviewHindi: 'शाम की हल्की बारिश और शर्मा जी की चाय टपरी पर दो अजनबियों की वो पहली नज़र जिसने पूरी दास्तान बदल दी...',
    readTime: '12 min',
    rating: 4.9,
    likes: 342,
    pages: 48,
    publishedYear: '2026',
    repoUrl: 'https://github.com/sumitg143/Somo-eBooks.git',
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: The First Glimpse at Chai Tapri',
        titleHindi: 'अध्याय १: चाय टपरी पर पहली नज़र',
        content: `शाम की हल्की बारिश शुरू हो चुकी थी। सुमित नगर के बाज़ार चौक में शर्मा जी की चाय टपरी पर कुल्हड़ की खुशबू हवा में तैर रही थी। 

सब लोग बारिश से बचने के लिए टपरी की टिन की छत के नीचे सिमट रहे थे। तभी नीली छतरी लिए वो आई। चेहरे पर बारिश की नन्हीं बूँदें और आँखों में एक मासूम सा सुकून। उसने शर्मा जी से बस इतना कहा - "भैया, एक कड़क अदरक वाली चाय।"

उस एक आवाज़ में कुछ ऐसा था जिसने उस शाम का पूरा वक़्त ही थाम दिया। सुमित ने अपनी गर्म चाय का कुल्हड़ हाथ में थामे उसकी तरफ देखा। जब दोनों की नज़रें मिलीं, तो बाज़ार का सारा शोर जैसे एक सन्नाटे में बदल गया। प्यार कभी योजना बनाकर नहीं आता; वो बस अचानक किसी बारिश की बूँद की तरह दिल पर गिरता है और रूह तक भीगो देता है।`
      },
      {
        id: 'c2',
        title: 'Chapter 2: Letters Never Sent',
        titleHindi: 'अध्याय २: वो ख़त जो कभी भेजे न गए',
        content: `दिन हफ़्तों में और हफ़्ते महीनों में बदल गए। शाम को चार बजे का मतलब सिर्फ़ एक था - टपरी पर मिलना। कोई बड़ी बातें नहीं होती थीं, बस ज़िन्दगी के छोटे-छोटे किस्से।

"तुम्हें पता है सुमित, जब मैं परेशान होती हूँ तो मुझे सिर्फ़ बादलों को देखना पसंद है," उसने एक शाम कहा था। 

सुमित ने अपनी डायरी के पन्नों में हर उस शाम को दर्ज कर लिया था। उसने कई ख़त लिखे, जिनमें वो सब बातें थीं जो वो सामने बोलने की हिम्मत नहीं जुटा पाता था। वो ख़त आज भी उसकी मेज़ की दराज़ में महफ़ूज़ हैं, जैसे कोई पवित्र अमानत। प्यार का सबसे खूबसूरत पहलू इज़हार नहीं, बल्कि उस अहसास की सादगी में छुपा होता है।`
      },
      {
        id: 'c3',
        title: 'Chapter 3: The Promise of the Station',
        titleHindi: 'अध्याय ३: स्टेशन का वादा और अलविदा',
        content: `सुमित नगर जंक्शन का प्लेटफॉर्म नंबर एक। शाम की एक्सप्रेस ट्रेन सीटी बजाते हुए धीरे-धीरे आगे बढ़ रही थी।

"क्या तुम वापस आओगी?" सुमित ने पूछा।
उसने खिड़की से हाथ बाहर निकाला और सुमित की हथेली को छुआ। "जहाँ यादें इतनी सच्ची हों, वहाँ इंसान कभी हमेशा के लिए दूर नहीं जाता। सुमित की नगरी मेरी भी तो है।"

ट्रेन धुआं छोड़ते हुए दूर ओझल हो गई, लेकिन उसकी मुस्कान और वो वादा हमेशा के लिए दिल में बस गया। प्रेम कभी अधूरा नहीं होता; अगर वो सच्चा है, तो वो हवा के हर झोंके और हर गिरती बारिश में ज़िंदा रहता है।`
      }
    ]
  },
  {
    id: 'ebook-barish-chai',
    title: 'Barish, Chai Aur Tum (Premium)',
    titleHindi: 'बारिश, चाय और तुम (प्रीमियम संस्करण)',
    author: 'Sumit Gupta (@sumitg143)',
    category: 'pyari_kahani',
    coverColor: '#d97706',
    coverEmoji: '☕',
    price: 49,
    originalPrice: 199,
    isPaid: true,
    tagline: 'Cozy moments, sweet smiles and nostalgia in the city.',
    taglineHindi: 'गर्म चाय की मिठास और ज़िन्दगी के सबसे प्यारे लम्हे।',
    description: 'A collection of heartwarming, sweet and cozy tales about friendship, chai, little happiness and innocent affection in Indian town life.',
    descriptionHindi: 'दोस्ती, अपनेपन और चाय की चुस्की के साथ ज़िन्दगी के प्यारे पलों की खूबसूरत कहानियाँ।',
    samplePreview: 'Discover the pure bliss of small things, rooftop chats under stars, and steaming tea...',
    samplePreviewHindi: 'ज़िन्दगी में सबसे बड़ी खुशियाँ अक्सर सबसे छोटी चीज़ों में छिपी होती हैं...',
    readTime: '8 min',
    rating: 4.8,
    likes: 289,
    pages: 36,
    publishedYear: '2026',
    repoUrl: 'https://github.com/sumitg143/Somo-eBooks.git',
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: The Magic of Earthen Kulhad',
        titleHindi: 'अध्याय १: कुल्हड़ की खुशबू',
        content: `ज़िन्दगी में सबसे बड़ी खुशियाँ अक्सर सबसे छोटी चीज़ों में छिपी होती हैं। सुमित की नगरी में सुबह की शुरुआत चिड़ियों की चहचहाहट और कुल्हड़ की सोंधी महक के साथ होती है।

चाय सिर्फ़ एक पेय नहीं है, ये एक जज़्बात है। जब आप अपने किसी ख़ास दोस्त के साथ बैठते हैं और दो कुल्हड़ आमने-सामने होते हैं, तो दुनिया की सारी फ़िक्रें उस भाप के साथ उड़ जाती हैं। "एक घूँट तुम लो, एक घूँट मैं लूँ" - ये साझापन ही तो प्यार की असली परिभाषा है।`
      },
      {
        id: 'c2',
        title: 'Chapter 2: The Roof Under The Stars',
        titleHindi: 'अध्याय २: तारों भरी छत',
        content: `रात को जब सुमित निवास की छत पर ठंडी हवा चलती है, तो पूरा नगर शांत दिखाई देता है। दूर रेलवे स्टेशन की बत्तियाँ टिमटिमाती हैं।

हाथ में गुनगुनी चाय और कानों में बजता हुआ कोई पुराना सुर। उस पल में लगता है कि ज़िन्दगी कितनी ख़ूबसूरत है जब आपके पास अपने लोग हों, सुकून हो और दिल में किसी का प्यारा सा ख्याल हो।`
      }
    ]
  },
  {
    id: 'ebook-dard-yaadein',
    title: 'Toote Khwabon Ki Goonj (Paid Novel)',
    titleHindi: 'टूटे ख्वाबों की गूँज (प्रीमियम संस्करण)',
    author: 'Sumit Gupta (@sumitg143)',
    category: 'emotional_sad',
    coverColor: '#0284c7',
    coverEmoji: '🌧️',
    price: 149,
    originalPrice: 399,
    isPaid: true,
    tagline: 'When silence speaks louder than words in deep heartache.',
    taglineHindi: 'ख़ामोशी, विरह और दिल के टूटने की सच्ची दास्तान।',
    description: 'An emotional and deeply poetic novella exploring the bittersweet beauty of heartbreak, letting go, and finding solace in self-discovery.',
    descriptionHindi: 'दिल की तन्हाई, बिछड़े हमसफ़र और यादों के साये में जीने की मार्मिक दास्तान।',
    samplePreview: 'A profound exploration of grief, unexpressed longing, and the journey toward inner light...',
    samplePreviewHindi: 'बाज़ार चौक के कोने वाली वो लकड़ी की बेंच और सन्नाटे में गूँजती पुरानी यादें...',
    readTime: '15 min',
    rating: 4.9,
    likes: 410,
    pages: 52,
    publishedYear: '2026',
    repoUrl: 'https://github.com/sumitg143/Somo-eBooks.git',
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: The Empty Bench',
        titleHindi: 'अध्याय १: बाज़ार की वो ख़ाली बेंच',
        content: `कुछ जगहें ऐसी होती हैं जहाँ इंसान जब भी जाता है, कोई ख़ास चेहरा याद आ ही जाता है। बाज़ार चौक के कोने वाली वो लकड़ी की बेंच आज भी वैसी ही है, बस आज उस पर बैठने वाला एक शख्स ग़ायब है।

उदासी कोई कमज़ोरी नहीं है; ये इस बात का सबूत है कि आपने किसी से बेइंतहा मोहब्बत की थी। जब रात गहरी होती है और सन्नाटा फैलता है, तो दिल के पुराने ज़ख़्म भी एक संगीत की तरह गूँजते हैं।`
      },
      {
        id: 'c2',
        title: 'Chapter 2: Healing with Time',
        titleHindi: 'अध्याय २: वक़्त का मरहम',
        content: `दर्द चाहे कितना भी गहरा क्यों न हो, वक़्त धीरे-धीरे सब कुछ संभाल लेता है। टूटे ख्वाब बिखरते ज़रूर हैं, लेकिन उन्हीं बिखरे टुकड़ों से इंसान एक नया रास्ता तराशता है। 

सुमित ने अपनी कलम उठाई और उस दर्द को अल्फ़ाज़ों में ढाल दिया। जब आप अपनी पीड़ा को शब्दों में पिरो देते हैं, तो वो सिर्फ़ आपकी नहीं रह जाती, वो हर उस दिल की आवाज़ बन जाती है जिसने कभी किसी को खोया है।`
      }
    ]
  },
  {
    id: 'ebook-shayari-ishq',
    title: 'Shayari-e-Ishq & Mohabbat (Full Diwan)',
    titleHindi: 'शायरी-ए-इश्क • संपूर्ण दीवान (Paid)',
    author: 'Sumit Gupta (@sumitg143)',
    category: 'poetry_shayari',
    coverColor: '#7c3aed',
    coverEmoji: '📜',
    price: 99,
    originalPrice: 299,
    isPaid: true,
    tagline: 'Soulful couplets of romance, longing and passion.',
    taglineHindi: 'इश्क, मोहब्बत और जज़्बातों की रूहानी शायरी।',
    description: 'A rich compilation of romantic sher, ghazals and poems celebrating the beauty of Indian romance, eye contact and poetic silence.',
    descriptionHindi: 'रोमांटिक शेर, ग़ज़लें और नज़्मों का अनूठा संग्रह।',
    samplePreview: 'Dive into mesmerizing ghazals and romantic couplets that touch the very core of your heart...',
    samplePreviewHindi: 'तेरी आँखों के समंदर में डूब जाने को जी चाहता है...',
    readTime: '10 min',
    rating: 5.0,
    likes: 520,
    pages: 60,
    publishedYear: '2026',
    repoUrl: 'https://github.com/sumitg143/Somo-eBooks.git',
    chapters: [
      {
        id: 'c1',
        title: 'Part 1: Pehli Nazar Ke Sher',
        titleHindi: 'भाग १: पहली नज़र के शेर',
        content: `॥ शायरी-ए-इश्क ॥

"तेरी आँखों के समंदर में डूब जाने को जी चाहता है,
इस अजनबी शहर में तुझे अपना बनाने को जी चाहता है।"

"चाय की चुस्की में जो मिठास तेरी बातों की है,
वो लज़्ज़त दुनिया के किसी शहद में कहाँ।"

"हम तो फ़ना हो गए उनकी एक नज़र के सदके,
जो मुस्कुरा कर गुज़रे थे हमारी नगरी से कल शाम।"

"इश्क वो नहीं जो दुनिया को दिखाया जाए,
इश्क वो है जो खामोशी से सीने में छुपाया जाए।"

"तू हवा का झोंका है और मैं कोई सूखा पत्ता,
तू जहाँ ले जाए, मैं वहीं उड़ जाने को तैयार हूँ।"`
      },
      {
        id: 'c2',
        title: 'Part 2: Virah & Intezaar',
        titleHindi: 'भाग २: विरह और इंतज़ार',
        content: `॥ इंतज़ार के साये ॥

"तेरी यादों का दिया रात भर जलता रहा,
दिल की चौखट पर कोई चुपके से रोता रहा।"

"फासले चाहे कितने भी हों हमारे दरमियाँ,
जब भी हवा छूती है, लगता है तूने छुआ है।"

"वो जो वादा था किसी शाम स्टेशन पर मिलने का,
हम आज भी हर ट्रेन के आने पर चौंक जाते हैं।"

"अधूरी कहानियाँ ही अक्सर मुकम्मल होती हैं,
क्योंकि वो कभी किसी की यादों से रुख़्सत नहीं होतीं।"`
      }
    ]
  },
  {
    id: 'ebook-gaon-pagdandi',
    title: 'Gaon Ki Pagdandi (Collector Edition)',
    titleHindi: 'गाँव की कच्ची पगडंडी (विशेष संस्करण)',
    author: 'Sumit Gupta (@sumitg143)',
    category: 'hindi_sahitya',
    coverColor: '#16a34a',
    coverEmoji: '🌾',
    price: 79,
    originalPrice: 249,
    isPaid: true,
    tagline: 'Memories of mustard fields, clay stoves and pure innocence.',
    taglineHindi: 'सरसों के खेत, चूल्हे की रोटी और गाँव की माटी की खुशबू।',
    description: 'A nostalgic journey back to rural India—the golden fields of Hari Gaon, stories under the old banyan tree, and unhurried peace.',
    descriptionHindi: 'गाँव की सादगी, बचपन की यादें और बरगद के चबूतरे की अनसुनी कहानियाँ।',
    samplePreview: 'The fragrant earthen soil of Hari Gaon and life under the 100-year-old banyan tree...',
    samplePreviewHindi: 'हरि गाँव के बीचों-बीच खड़ा वो सौ साल पुराना बरगद सिर्फ़ एक पेड़ नहीं, गाँव का सबसे बड़ा गवाह है...',
    readTime: '11 min',
    rating: 4.9,
    likes: 215,
    pages: 42,
    publishedYear: '2026',
    repoUrl: 'https://github.com/sumitg143/Somo-eBooks.git',
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: The Banyan Tree Chaupal',
        titleHindi: 'अध्याय १: बरगद का चबूतरा',
        content: `हरि गाँव के बीचों-बीच खड़ा वो सौ साल पुराना बरगद सिर्फ़ एक पेड़ नहीं, गाँव का सबसे बड़ा गवाह है। उसने पीढ़ियों को बचपन से बुढ़ापे तक पहुँचते देखा है।

शाम को जब चौधरी रमेश जी अपनी हुक्के की नली थामे चबूतरे पर बैठते हैं, तो बच्चे उनके इर्द-गिर्द इकट्ठा हो जाते हैं। कहानियाँ राजा-रानी की नहीं, बल्कि उस माटी की होती हैं जिसने सबको जीवन दिया है। सादगी में जो आनंद है, वो शहर की ऊंची इमारतों में ढूँढने से भी नहीं मिलता।`
      }
    ]
  }
];
