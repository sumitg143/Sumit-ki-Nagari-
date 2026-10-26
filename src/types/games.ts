export type GameType = 'cricket' | 'football' | 'ludo' | 'kanche' | 'hockey';

export interface GameInfo {
  id: GameType;
  title: string;
  titleHindi: string;
  tagline: string;
  taglineHindi: string;
  icon: string;
  color: string;
  badge: string;
}

export const NAGRI_GAMES: GameInfo[] = [
  {
    id: 'cricket',
    title: 'Gully Cricket (गली क्रिकेट)',
    titleHindi: 'सुमित नगर गली क्रिकेट प्रीमियर लीग',
    tagline: 'Step up to the pitch, time your shot, and smash sixes over the bazaar roof!',
    taglineHindi: 'क्रीज पर आएँ, टाइमिंग से बल्ला घुमाएँ और बाज़ार की छतों के पार छक्के जड़ें!',
    icon: '🏏',
    color: 'from-amber-500 to-orange-600',
    badge: 'Most Popular',
  },
  {
    id: 'football',
    title: 'Football Shootout (फुटबॉल पेनल्टी)',
    titleHindi: 'सुमित नगर फुटबॉल प्रीमियर कप • पेनल्टी शूटआउट',
    tagline: 'Aim for the top corner, curve past the diving goalie, and score breathtaking goals!',
    taglineHindi: 'गोलकीपर को छकाकर टॉप कॉर्नर में गोली की रफ्तार से गोल दागें!',
    icon: '⚽',
    color: 'from-emerald-500 to-green-700',
    badge: 'Matchday Live',
  },
  {
    id: 'ludo',
    title: 'Desi Ludo (असली लूडो)',
    titleHindi: 'देसी लूडो • चार गोटियाँ और पासा',
    tagline: 'Classic 4-player board game. Roll the dice, chase opponent tokens, and reach home!',
    taglineHindi: 'पासा फेंकें, गोटियाँ दौड़ाएँ और विरोधी की गोटी काटकर जीतें!',
    icon: '🎲',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Board Classic',
  },
  {
    id: 'kanche',
    title: 'Goli / Kanche (कंचे का खेल)',
    titleHindi: 'कंचे / अंटी का खेल • निशाना लगाओ',
    tagline: 'Aim your glass marble, pull back the power slider, and knock marbles out of the ring!',
    taglineHindi: 'अंगूठे से कंचे का सटीक निशाना लगाएँ और घेरे से कंचे बाहर निकालें!',
    icon: '🔮',
    color: 'from-blue-500 to-indigo-600',
    badge: 'Desi Nostalgia',
  },
  {
    id: 'hockey',
    title: 'Field Hockey (हॉकी पेनल्टी शूट)',
    titleHindi: 'राष्ट्रीय खेल हॉकी • पेनल्टी शूटआउट',
    tagline: 'Aim the hockey stick, curve the ball, and shoot past the goalie into the net!',
    taglineHindi: 'गोलकीपर को चकमा देकर गेंद को सीधे गोल पोस्ट में दागिए!',
    icon: '🏑',
    color: 'from-rose-500 to-pink-600',
    badge: 'National Sport',
  },
];
