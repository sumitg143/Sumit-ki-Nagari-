import React, { useState } from 'react';
import { X, Sparkles, Home, Palette, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Resident, HouseStyle, MohallaType } from '../types/city.ts';
import { soundEngine } from '../audio/soundEngine.ts';

interface RegisterResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  onAddResident: (newResident: Resident) => void;
  currentResidentCount: number;
}

export const RegisterResidentModal: React.FC<RegisterResidentModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddResident,
  currentResidentCount,
}) => {
  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [handle, setHandle] = useState('');
  const [role, setRole] = useState('');
  const [houseStyle, setHouseStyle] = useState<HouseStyle>('modern_villa');
  const [mohalla, setMohalla] = useState<MohallaType>('sumit_heritage');
  const [colorTheme, setColorTheme] = useState('#d97706');
  const [signboard, setSignboard] = useState('');
  const [quote, setQuote] = useState('');

  if (!isOpen) return null;

  const houseStyles: { id: HouseStyle; nameHi: string; nameEn: string; icon: string }[] = [
    { id: 'haveli', nameHi: 'हेरिटेज हवेली', nameEn: 'Heritage Haveli', icon: '🏛️' },
    { id: 'modern_villa', nameHi: 'आधुनिक विला', nameEn: 'Modern Villa', icon: '🏡' },
    { id: 'bazaar_shop', nameHi: 'बाज़ार दूकान', nameEn: 'Bazaar Shop', icon: '🏪' },
    { id: 'chai_stall', nameHi: 'चाय टपरी', nameEn: 'Chai Tapri', icon: '☕' },
    { id: 'village_hut', nameHi: 'गाँव की कुटीर', nameEn: 'Village Mud Hut', icon: '🛖' },
  ];

  const mohallas: { id: MohallaType; nameHi: string; nameEn: string }[] = [
    { id: 'sumit_heritage', nameHi: 'सुमित हेरिटेज लेन', nameEn: 'Sumit Heritage Lane' },
    { id: 'bazaar_chowk', nameHi: 'बाज़ार चौक', nameEn: 'Bazaar Chowk' },
    { id: 'station_road', nameHi: 'स्टेशन रोड', nameEn: 'Station Road' },
    { id: 'mandir_marg', nameHi: 'मंदिर मार्ग', nameEn: 'Mandir Marg' },
    { id: 'hari_gaon', nameHi: 'हरि गाँव', nameEn: 'Hari Gaon' },
    { id: 'tech_enclave', nameHi: 'टेक एन्क्लेव', nameEn: 'Tech Enclave' },
  ];

  const colorPalette = [
    '#d97706', // Sandstone Amber
    '#ea580c', // Marigold Orange
    '#dc2626', // Terracotta Red
    '#0284c7', // Jodhpur Royal Blue
    '#16a34a', // Mustard Green
    '#9333ea', // Royal Purple
    '#0f766e', // Teal
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Determine 3D coordinates based on mohalla
    const baseCoords: Record<MohallaType, { x: number; z: number }> = {
      sumit_heritage: { x: 10 + (Math.random() * 8 - 4), z: -10 + (Math.random() * 6 - 3) },
      bazaar_chowk: { x: -18 + (Math.random() * 8 - 4), z: 8 + (Math.random() * 4 - 2) },
      station_road: { x: -14 + (Math.random() * 8 - 4), z: 22 + (Math.random() * 4 - 2) },
      mandir_marg: { x: 22 + (Math.random() * 6 - 3), z: -4 + (Math.random() * 6 - 3) },
      hari_gaon: { x: -24 + (Math.random() * 8 - 4), z: -20 + (Math.random() * 6 - 3) },
      tech_enclave: { x: 16 + (Math.random() * 6 - 3), z: -22 + (Math.random() * 6 - 3) },
    };

    const nextHouseNo = currentResidentCount + 10;
    const formattedHandle = handle.startsWith('@') ? handle : `@${handle || name.toLowerCase().replace(/\s+/g, '_')}`;

    const newResident: Resident = {
      id: `res-${Date.now()}`,
      name: name.trim(),
      hindiName: hindiName.trim() || undefined,
      handle: formattedHandle,
      role: role.trim() || 'Resident of Nagri',
      roleHindi: role.trim() ? undefined : 'नगर के सम्मानित निवासी',
      houseNumber: nextHouseNo,
      mohalla,
      houseStyle,
      colorTheme,
      quote: quote.trim() || 'Proud resident of Sumit Ki Nagri!',
      quoteHindi: 'सुमित की नगरी में मेरा नया आशियाना!',
      stories: [`Joined Sumit Ki Nagri and built a beautiful ${houseStyle.replace('_', ' ')}!`],
      namasteCount: 1,
      joinedDate: 'Today',
      position: baseCoords[mohalla],
      customSignboard: signboard.trim() || `${name.trim()} • NO. ${nextHouseNo}`,
    };

    onAddResident(newResident);
    soundEngine.playNamasteChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-black p-5 sm:p-6">
        {/* Top Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow text-white">
              🏛️
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100 font-heading">
                {lang === 'hi' ? 'स्वागत कक्ष • नागरिक बनें' : 'Swagat Kaksh • Move In'}
              </h2>
              <p className="text-xs text-amber-300/70">
                {lang === 'hi'
                  ? 'सुमित की नगरी में अपना घर या दूकान बसाएँ'
                  : 'Build your home or stall in Sumit Ki Nagri'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
          {/* Name & Hindi Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'आपका नाम (English) *' : 'Your Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'हिंदी में नाम' : 'Name in Hindi (optional)'}
              </label>
              <input
                type="text"
                value={hindiName}
                onChange={(e) => setHindiName(e.target.value)}
                placeholder="e.g. राहुल शर्मा"
                className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none font-hindi"
              />
            </div>
          </div>

          {/* Social Handle & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'हैंडल / यूजरनेम' : 'Social Handle'}
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@username"
                className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'पेशा / पद' : 'Role / Occupation'}
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Chai Enthusiast / Software Engineer"
                className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* House Style Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'घर / भवन का प्रकार चुनें:' : 'Select House Style:'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {houseStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setHouseStyle(style.id)}
                  className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                    houseStyle === style.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="text-lg">{style.icon}</span>
                  <span className="text-xs font-medium">
                    {lang === 'hi' ? style.nameHi : style.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mohalla Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'मोहल्ला / इलाका:' : 'Select Mohalla / Ward:'}</span>
            </label>
            <select
              value={mohalla}
              onChange={(e) => setMohalla(e.target.value as MohallaType)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
            >
              {mohallas.map((m) => (
                <option key={m.id} value={m.id}>
                  {lang === 'hi' ? m.nameHi : m.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Color Theme */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'घर का रंग:' : 'House Color Theme:'}</span>
            </label>
            <div className="flex items-center gap-2">
              {colorPalette.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColorTheme(col)}
                  className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                    colorTheme === col ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Custom Signboard */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'hi' ? 'नेमप्लेट / साइनबोर्ड का टेक्स्ट:' : 'Custom Signboard Text:'}
            </label>
            <input
              type="text"
              value={signboard}
              onChange={(e) => setSignboard(e.target.value)}
              placeholder="e.g. शर्मा सदन - SHARMA SADAN"
              className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>

          {/* Quote / Greeting */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'hi' ? 'आपका संदेश / सुविचार:' : 'Welcome Quote / Message:'}
            </label>
            <textarea
              rows={2}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. Always up for a cup of ginger cutting chai!"
              className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{lang === 'hi' ? 'सुमित की नगरी में घर बसाएँ' : 'Claim Your House in Nagri'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
