import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Heart,
  Star,
  Clock,
  Search,
  ExternalLink,
  PlusCircle,
  Volume2,
  VolumeX,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Ebook, EbookCategory, INITIAL_EBOOKS } from '../types/ebook.ts';
import { PaymentModal } from './PaymentModal.tsx';
import { soundEngine } from '../audio/soundEngine.ts';

const PURCHASES_KEY = 'sumit_purchased_ebooks_v1';

interface EbookStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
}

export const EbookStoreModal: React.FC<EbookStoreModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [ebooks, setEbooks] = useState<Ebook[]>(INITIAL_EBOOKS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasedIds, setPurchasedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PURCHASES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Active book reader state
  const [readingBook, setReadingBook] = useState<Ebook | null>(null);
  const [previewBook, setPreviewBook] = useState<Ebook | null>(null);
  const [paymentBook, setPaymentBook] = useState<Ebook | null>(null);

  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  // Add Book Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleHindi, setNewTitleHindi] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<EbookCategory>('romantic_love');
  const [newPrice, setNewPrice] = useState(99);
  const [newCoverEmoji, setNewCoverEmoji] = useState('💖');
  const [newTagline, setNewTagline] = useState('');
  const [newStoryContent, setNewStoryContent] = useState('');

  // Persist purchases
  useEffect(() => {
    try {
      localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchasedIds));
    } catch (e) {
      console.warn('Could not save purchases to localStorage', e);
    }
  }, [purchasedIds]);

  if (!isOpen) return null;

  const isPurchased = (bookId: string) => purchasedIds.includes(bookId);

  const filteredBooks = ebooks.filter((b) => {
    if (activeCategory === 'my_books') {
      return isPurchased(b.id);
    }
    const matchesCategory =
      activeCategory === 'all' || b.category === activeCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.titleHindi.includes(searchQuery) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { id: string; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'all', labelHi: 'सभी पुस्तकें', labelEn: 'All Books', icon: '📚' },
    { id: 'my_books', labelHi: `मेरी खरीदी पुस्तकें (${purchasedIds.length})`, labelEn: `My Purchases (${purchasedIds.length})`, icon: '✅' },
    { id: 'romantic_love', labelHi: 'रोमांटिक & लव', labelEn: 'Romantic & Love', icon: '💖' },
    { id: 'emotional_sad', labelHi: 'उदासी & विरह', labelEn: 'Sadness & Longing', icon: '🌧️' },
    { id: 'pyari_kahani', labelHi: 'प्यारी कहानियाँ', labelEn: 'Sweet Stories', icon: '☕' },
    { id: 'poetry_shayari', labelHi: 'शायरी & ग़ज़ल', labelEn: 'Poetry & Shayari', icon: '📜' },
    { id: 'hindi_sahitya', labelHi: 'हिंदी साहित्य', labelEn: 'Hindi Literature', icon: '🌾' },
  ];

  const handleBookClick = (book: Ebook) => {
    if (isPurchased(book.id)) {
      // Already paid -> open reader
      setReadingBook(book);
      setCurrentChapterIdx(0);
      soundEngine.playNamasteChime();
    } else {
      // Paid version -> open preview & buy modal
      setPreviewBook(book);
      soundEngine.playChaiClink();
    }
  };

  const handleStartPayment = (book: Ebook) => {
    setPreviewBook(null);
    setPaymentBook(book);
  };

  const handlePaymentSuccess = (bookId: string) => {
    if (!purchasedIds.includes(bookId)) {
      setPurchasedIds([...purchasedIds, bookId]);
    }
    const target = ebooks.find((b) => b.id === bookId);
    if (target) {
      setReadingBook(target);
      setCurrentChapterIdx(0);
    }
  };

  const handleCloseReader = () => {
    stopSpeech();
    setReadingBook(null);
  };

  const handleLikeBook = (bookId: string) => {
    soundEngine.playNamasteChime();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
    setEbooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, likes: b.likes + 1 } : b))
    );
    if (readingBook && readingBook.id === bookId) {
      setReadingBook({ ...readingBook, likes: readingBook.likes + 1 });
    }
  };

  // Text-To-Speech (Listen to eBook)
  const toggleSpeech = () => {
    if (!readingBook) return;

    if (isSpeaking) {
      stopSpeech();
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const chapter = readingBook.chapters[currentChapterIdx];
        const utterance = new SpeechSynthesisUtterance(chapter.content);
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          setIsSpeaking(false);
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleDownloadStory = () => {
    if (!readingBook) return;
    const chapter = readingBook.chapters[currentChapterIdx];
    const text = `${readingBook.titleHindi} (${readingBook.title})\nAuthor: ${readingBook.author}\n\n${chapter.titleHindi}\n\n${chapter.content}\n\n-- Curated at Somo eBooks (https://github.com/sumitg143/Somo-eBooks.git) --`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${readingBook.title.replace(/\s+/g, '_')}_Chapter_${currentChapterIdx + 1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add new book submit
  const handleAddNewBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBook: Ebook = {
      id: `ebook-${Date.now()}`,
      title: newTitle.trim(),
      titleHindi: newTitleHindi.trim() || newTitle.trim(),
      author: newAuthor.trim() || 'Sumit Gupta (@sumitg143)',
      category: newCategory,
      coverColor: '#d97706',
      coverEmoji: newCoverEmoji || '📖',
      price: newPrice || 99,
      originalPrice: (newPrice || 99) * 3,
      isPaid: true,
      tagline: newTagline.trim() || 'A new heartfelt story in Somo eBooks.',
      taglineHindi: newTagline.trim() || 'सोमो ई-बुक्स में नई दिल को छू लेने वाली रचना।',
      description: newTagline.trim(),
      descriptionHindi: newTagline.trim(),
      readTime: '6 min',
      rating: 5.0,
      likes: 12,
      pages: 18,
      publishedYear: '2026',
      repoUrl: 'https://github.com/sumitg143/Somo-eBooks.git',
      chapters: [
        {
          id: 'c1',
          title: 'Chapter 1: The Beginning',
          titleHindi: 'अध्याय १: शुरुआत',
          content: newStoryContent.trim() || 'कहानी का खूबसूरत आरम्भ...',
        },
      ],
    };

    setEbooks([newBook, ...ebooks]);
    setIsAddBookOpen(false);
    soundEngine.playNamasteChime();
    confetti({ particleCount: 50 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-black flex flex-col text-slate-100">
        {/* Ribbon Top */}
        <div className="h-2.5 bg-gradient-to-r from-rose-600 via-amber-500 to-purple-600" />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 via-amber-500 to-purple-600 flex items-center justify-center text-xl shadow text-white flex-shrink-0">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-amber-100 font-heading">
                  {lang === 'hi' ? 'सोमो ई-बुक स्टोर (Paid Store)' : 'Somo eBooks Store'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  🔒 Paid & Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'hi'
                  ? 'पेमेंट करें और तुरंत संपूर्ण ई-बुक व ऑडियो अनलॉक करें'
                  : 'Pay securely to unlock full stories & audiobooks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* GitHub Repo Link */}
            <a
              href="https://github.com/sumitg143/Somo-eBooks.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="GitHub Repository"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>

            {/* Add Book Button */}
            <button
              onClick={() => setIsAddBookOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
              <span>{lang === 'hi' ? 'किताब जोड़ें' : 'Publish'}</span>
            </button>

            {/* Close */}
            <button
              onClick={() => {
                handleCloseReader();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content: Storefront OR Active Reader View */}
        {!readingBook ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
            {/* Payment Notice Banner */}
            <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/60 border border-emerald-500/30 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-emerald-300 block">
                    {lang === 'hi'
                      ? '100% सुरक्षित भुगतान गेटवे (UPI, QR, Cards, NetBanking)'
                      : 'Secure Indian Checkout Gateway'}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {lang === 'hi'
                      ? 'किसी भी ई-बुक को बाय करने पर पहले पेमेंट सुरक्षित होगा, फिर तुरंत पूरी किताब और ऑडियो खुलेगा।'
                      : 'Payment must be completed first to unlock the complete story and audio narration.'}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 hidden md:block">
                <span className="text-amber-400 font-bold font-mono">
                  {purchasedIds.length} Unlocked
                </span>
              </div>
            </div>

            {/* Search & Categories Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'hi'
                      ? 'कहानी, शायरी या लेखक खोजें...'
                      : 'Search stories, shayari, or author...'
                  }
                  className="w-full bg-slate-800/90 border border-slate-700 text-slate-100 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Creator Tag */}
              <div className="flex items-center gap-1.5 text-xs text-amber-300/90 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Curated by Sumit Gupta • @sumitg143</span>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c) => {
                const active = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{lang === 'hi' ? c.labelHi : c.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {filteredBooks.map((book) => {
                const purchased = isPurchased(book.id);
                const discount = Math.round(
                  ((book.originalPrice - book.price) / book.originalPrice) * 100
                );

                return (
                  <div
                    key={book.id}
                    className={`bg-slate-800/60 hover:bg-slate-800/90 border rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between group shadow-lg ${
                      purchased
                        ? 'border-emerald-500/50 shadow-emerald-950/20'
                        : 'border-slate-700/70 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex flex-col gap-2.5">
                      {/* Top Row: Cover Icon, Status Badge & Rating */}
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                          style={{ backgroundColor: book.coverColor }}
                        >
                          {book.coverEmoji}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {purchased ? (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{lang === 'hi' ? 'खरीदा हुआ' : 'Purchased'}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                              <Lock className="w-3 h-3" />
                              <span>PAID VERSION</span>
                            </span>
                          )}

                          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold bg-slate-900/80 px-2 py-0.5 rounded-lg border border-amber-500/20">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{book.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Book Title & Author */}
                      <div>
                        <h3 className="text-sm font-bold text-amber-100 group-hover:text-amber-300 transition font-heading">
                          {lang === 'hi' ? book.titleHindi : book.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{book.author}</p>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2 italic">
                        "{lang === 'hi' ? book.taglineHindi : book.tagline}"
                      </p>

                      {/* Price Tag Row */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 mt-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-emerald-400">
                            ₹{book.price}
                          </span>
                          <span className="text-xs line-through text-slate-500">
                            ₹{book.originalPrice}
                          </span>
                          <span className="text-[10px] font-bold text-amber-400">
                            {discount}% OFF
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {book.pages} pages
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Read if purchased, or Buy Button */}
                    <div className="pt-3 mt-2 flex items-center gap-2">
                      {purchased ? (
                        <button
                          onClick={() => handleBookClick(book)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow active:scale-95"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'अभी पढ़ें (Unlocked)' : 'Read Now'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBookClick(book)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-orange-500/20 active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>
                            {lang === 'hi'
                              ? `बाय करें • ₹${book.price}`
                              : `Buy Now • ₹${book.price}`}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => handleLikeBook(book.id)}
                        className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border border-slate-600 transition cursor-pointer"
                        title="Like"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Interactive Reader View (Unlocked after Payment) */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Reader Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCloseReader}
                  className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition cursor-pointer font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'वापस स्टोर' : 'Back to Store'}</span>
                </button>
                <span className="text-slate-600">|</span>
                <span className="font-bold text-amber-200 truncate max-w-[200px] sm:max-w-xs font-heading">
                  {lang === 'hi' ? readingBook.titleHindi : readingBook.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  Paid & Unlocked
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Speech Synthesis Audio Button */}
                <button
                  onClick={toggleSpeech}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-slate-800 text-amber-300 border-amber-500/30 hover:bg-slate-700'
                  }`}
                  title="Listen with Text-to-Speech"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? (lang === 'hi' ? 'रोकें' : 'Stop') : (lang === 'hi' ? 'सुनें' : 'Listen')}</span>
                </button>

                {/* Reader Theme (Dark / Sepia / Light) */}
                <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg">
                  <button
                    onClick={() => setReaderTheme('dark')}
                    className={`w-6 h-6 rounded text-xs font-bold transition cursor-pointer ${
                      readerTheme === 'dark' ? 'bg-slate-950 text-white' : 'text-slate-400'
                    }`}
                    title="Dark mode"
                  >
                    🌙
                  </button>
                  <button
                    onClick={() => setReaderTheme('sepia')}
                    className={`w-6 h-6 rounded text-xs font-bold transition cursor-pointer ${
                      readerTheme === 'sepia' ? 'bg-amber-100 text-amber-950' : 'text-slate-400'
                    }`}
                    title="Sepia mode"
                  >
                    📜
                  </button>
                  <button
                    onClick={() => setReaderTheme('light')}
                    className={`w-6 h-6 rounded text-xs font-bold transition cursor-pointer ${
                      readerTheme === 'light' ? 'bg-white text-slate-900' : 'text-slate-400'
                    }`}
                    title="Light mode"
                  >
                    ☀️
                  </button>
                </div>

                {/* Font Size */}
                <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg text-slate-300">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`text-[10px] font-bold ${fontSize === 'sm' ? 'text-amber-400' : ''}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('md')}
                    className={`text-xs font-bold ${fontSize === 'md' ? 'text-amber-400' : ''}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`text-sm font-bold ${fontSize === 'lg' ? 'text-amber-400' : ''}`}
                  >
                    A+
                  </button>
                </div>

                {/* Download */}
                <button
                  onClick={handleDownloadStory}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                  title="Download Chapter as TXT"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chapter Tabs */}
            {readingBook.chapters.length > 1 && (
              <div className="flex items-center gap-2 px-5 py-2 bg-slate-900 border-b border-slate-800 overflow-x-auto">
                {readingBook.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      stopSpeech();
                      setCurrentChapterIdx(idx);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      currentChapterIdx === idx
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'hi' ? ch.titleHindi : ch.title}
                  </button>
                ))}
              </div>
            )}

            {/* Reader Content Body */}
            <div
              className={`flex-1 overflow-y-auto p-6 sm:p-10 transition-colors duration-200 ${
                readerTheme === 'sepia'
                  ? 'bg-[#fbf0d9] text-[#432818]'
                  : readerTheme === 'light'
                  ? 'bg-white text-slate-900'
                  : 'bg-slate-900 text-slate-100'
              }`}
            >
              <div className="max-w-2xl mx-auto flex flex-col gap-5">
                {/* Chapter Title */}
                <div className="pb-4 border-b border-current/20">
                  <span className="text-xs uppercase tracking-widest opacity-60 font-semibold">
                    {readingBook.author} • Somo eBooks Paid Edition
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold mt-1 font-heading">
                    {lang === 'hi'
                      ? readingBook.chapters[currentChapterIdx].titleHindi
                      : readingBook.chapters[currentChapterIdx].title}
                  </h1>
                </div>

                {/* Story Text */}
                <div
                  className={`leading-relaxed whitespace-pre-line font-hindi ${
                    fontSize === 'sm'
                      ? 'text-sm sm:text-base leading-7'
                      : fontSize === 'lg'
                      ? 'text-lg sm:text-xl leading-9'
                      : 'text-base sm:text-lg leading-8'
                  }`}
                >
                  {readingBook.chapters[currentChapterIdx].content}
                </div>

                {/* Footer of Chapter */}
                <div className="pt-8 pb-4 flex items-center justify-between border-t border-current/20 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLikeBook(readingBook.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/40 font-bold transition cursor-pointer hover:bg-rose-500/30"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                      <span>{readingBook.likes} likes</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (currentChapterIdx > 0) {
                          setCurrentChapterIdx(currentChapterIdx - 1);
                        }
                      }}
                      disabled={currentChapterIdx === 0}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 disabled:opacity-30 text-white transition cursor-pointer"
                    >
                      {lang === 'hi' ? 'पिछला अध्याय' : 'Prev Chapter'}
                    </button>
                    <button
                      onClick={() => {
                        if (currentChapterIdx < readingBook.chapters.length - 1) {
                          setCurrentChapterIdx(currentChapterIdx + 1);
                        } else {
                          handleCloseReader();
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold transition cursor-pointer"
                    >
                      {currentChapterIdx < readingBook.chapters.length - 1
                        ? lang === 'hi'
                          ? 'अगला अध्याय'
                          : 'Next Chapter'
                        : lang === 'hi'
                        ? 'समाप्त'
                        : 'Finish'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Book Preview & Purchase Modal (Triggered before payment) */}
        {previewBook && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow"
                    style={{ backgroundColor: previewBook.coverColor }}
                  >
                    {previewBook.coverEmoji}
                  </div>
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      🔒 PAID VERSION
                    </span>
                    <h3 className="text-base font-bold text-amber-100 mt-1 font-heading">
                      {lang === 'hi' ? previewBook.titleHindi : previewBook.title}
                    </h3>
                    <p className="text-xs text-slate-400">{previewBook.author}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewBook(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tagline & Sample Teaser */}
              <blockquote className="italic p-3 rounded-xl bg-slate-800/60 border-l-4 border-amber-500 text-xs text-slate-300">
                "{lang === 'hi' ? previewBook.taglineHindi : previewBook.tagline}"
              </blockquote>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 flex flex-col gap-2">
                <span className="font-semibold text-amber-300 text-[11px] uppercase tracking-wider">
                  {lang === 'hi' ? 'किताब की झलक (Sample Preview):' : 'Sample Preview:'}
                </span>
                <p className="line-clamp-4 leading-relaxed font-hindi">
                  {previewBook.samplePreviewHindi || previewBook.samplePreview || previewBook.description}
                </p>
                <div className="text-[11px] text-amber-400/90 flex items-center gap-1 mt-1 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'hi'
                      ? 'संपूर्ण अध्याय, ऑडियोबुक और डाउनलोड करने के लिए पेमेंट पूरा करें।'
                      : 'Pay first to unlock the complete book and audio narration.'}
                  </span>
                </div>
              </div>

              {/* Price & Buy Now Button */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-emerald-400">
                      ₹{previewBook.price}
                    </span>
                    <span className="text-xs line-through text-slate-500">
                      ₹{previewBook.originalPrice}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartPayment(previewBook)}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'बाय करें (Pay & Unlock)' : 'Pay & Unlock Now'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real Payment Gateway Modal */}
        <PaymentModal
          ebook={paymentBook}
          isOpen={paymentBook !== null}
          onClose={() => setPaymentBook(null)}
          lang={lang}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Add Story Modal */}
        {isAddBookOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-amber-200 font-heading">
                  {lang === 'hi' ? 'अपनी ई-बुक / कहानी जोड़ें' : 'Publish to Somo eBooks'}
                </h3>
                <button
                  onClick={() => setIsAddBookOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNewBook} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'hi' ? 'शीर्षक (Title in Hindi & English) *' : 'Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitleHindi}
                    onChange={(e) => {
                      setNewTitleHindi(e.target.value);
                      if (!newTitle) setNewTitle(e.target.value);
                    }}
                    placeholder="e.g. पहली बारिश की वो शाम"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {lang === 'hi' ? 'लेखक का नाम' : 'Author'}
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Sumit Gupta / You"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {lang === 'hi' ? 'मूल्य (Price ₹ INR)' : 'Price ₹'}
                    </label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(parseInt(e.target.value, 10) || 99)}
                      placeholder="99"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'hi' ? 'श्रेणी (Category)' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EbookCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="romantic_love">रोमांटिक & लव</option>
                    <option value="emotional_sad">उदासी & विरह</option>
                    <option value="pyari_kahani">प्यारी कहानी</option>
                    <option value="poetry_shayari">शायरी व ग़ज़ल</option>
                    <option value="hindi_sahitya">हिंदी साहित्य</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'hi' ? 'कहानी की पहली दास्तान / अध्याय *' : 'Story Content *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newStoryContent}
                    onChange={(e) => setNewStoryContent(e.target.value)}
                    placeholder="अपनी खूबसूरत प्रेम कहानी, विरह, या कविता यहाँ लिखें..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none font-hindi"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow transition cursor-pointer mt-1"
                >
                  {lang === 'hi' ? 'सोमो ई-बुक्स में प्रकाशित करें' : 'Publish to Somo eBooks'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
