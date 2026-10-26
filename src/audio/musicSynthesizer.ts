/**
 * Somo Music Synthesizer - Procedural Web Audio API Music Generator
 * Generates rich, multi-layered music tracks for:
 * Romantic, Love, Sadness, and Pyara (Sweet/Cute) moods.
 * 100% zero external dependencies, works offline, never breaks, never 404s.
 */

export type MusicMood = 'romantic' | 'love' | 'sadness' | 'pyara';

export interface MusicTrack {
  id: string;
  title: string;
  titleHindi: string;
  artist: string;
  mood: MusicMood;
  description: string;
  descriptionHindi: string;
  duration: string;
  tempo: number; // BPM
  key: string;
  coverEmoji: string;
}

export const TRACK_LIST: MusicTrack[] = [
  {
    id: 'track-romantic-1',
    title: 'Dil Ki Baatein (दिल की बातें)',
    titleHindi: 'दिल की बातें • रुहानी धुन',
    artist: 'Somo Music • Sumit',
    mood: 'romantic',
    description: 'Dreamy romantic melody with soft acoustic guitar arpeggios, gentle warmth, and soulful pads.',
    descriptionHindi: 'दिल को छू लेने वाली रोमांटिक धुन, कोमल गिटार और प्यार भरे सुर।',
    duration: '3:45',
    tempo: 78,
    key: 'F Major',
    coverEmoji: '💖',
  },
  {
    id: 'track-love-1',
    title: 'Pehli Mohabbat (पहली मोहब्बत)',
    titleHindi: 'पहली मोहब्बत • सच्चा प्यार',
    artist: 'Somo Music • Sumit',
    mood: 'love',
    description: 'Deep, passionate love song with soulful Bollywood-style acoustic chords and emotional flute leads.',
    descriptionHindi: 'सच्चे प्यार और मोहब्बत का अहसास जगाने वाला भावुक संगीत।',
    duration: '4:12',
    tempo: 84,
    key: 'C Major',
    coverEmoji: '🌹',
  },
  {
    id: 'track-sadness-1',
    title: 'Teri Yaadein & Barish (तेरी यादें)',
    titleHindi: 'तेरी यादें • विरह और तन्हाई',
    artist: 'Somo Music • Sumit',
    mood: 'sadness',
    description: 'Melancholic piano with slow violin swells and subtle rain atmosphere, capturing deep longing.',
    descriptionHindi: 'आँखों में नमी और दिल की तन्हाई बयां करती उदास, सुकून देने वाली धुन।',
    duration: '4:30',
    tempo: 64,
    key: 'A Minor',
    coverEmoji: '🌧️',
  },
  {
    id: 'track-pyara-1',
    title: 'Chai Aur Tum (चाय और तुम)',
    titleHindi: 'चाय और तुम • प्यारी मुस्कान',
    artist: 'Somo Music • Sumit',
    mood: 'pyara',
    description: 'Sweet, cozy lofi acoustic chimes with cheerful warmth and gentle nostalgic beats.',
    descriptionHindi: 'कुल्हड़ चाय की चुस्की जैसी मीठी, प्यारी और मन को खुश करने वाली धुन।',
    duration: '3:15',
    tempo: 92,
    key: 'D Major',
    coverEmoji: '🌸',
  },
  {
    id: 'track-romantic-2',
    title: 'Khamosh Raat (खामोश रात का नशा)',
    titleHindi: 'खामोश रात • चांदनी और तुम',
    artist: 'Somo Music • Sumit',
    mood: 'romantic',
    description: 'Late night quiet romance under the stars with soft Rhodes piano and ambient night breeze.',
    descriptionHindi: 'रात के सन्नाटे में तारों की छांव में गूंजती प्रेम की मधुर तान।',
    duration: '3:50',
    tempo: 72,
    key: 'G Major',
    coverEmoji: '✨',
  },
  {
    id: 'track-sadness-2',
    title: 'Adhoori Dastaan (अधूरी दास्तान)',
    titleHindi: 'अधूरी दास्तान • बिछड़े लम्हे',
    artist: 'Somo Music • Sumit',
    mood: 'sadness',
    description: 'Deeply moving piano ballad in minor keys reflecting lost moments and unspoken goodbyes.',
    descriptionHindi: 'टूटे ख्वाबों और अनकही बातों की याद दिलाती भावुक संगीत रचना।',
    duration: '4:05',
    tempo: 60,
    key: 'D Minor',
    coverEmoji: '🥀',
  },
  {
    id: 'track-love-2',
    title: 'Bepanah Ishq (बेपनाह इश्क)',
    titleHindi: 'बेपनाह इश्क • तेरे संग जीना',
    artist: 'Somo Music • Sumit',
    mood: 'love',
    description: 'Warm harmonium tones intertwined with passionate melodious acoustic strings.',
    descriptionHindi: 'हारमोनियम और गिटार की जुगलबंदी से उपजी रूहानी मोहब्बत।',
    duration: '4:20',
    tempo: 80,
    key: 'E Minor',
    coverEmoji: '❤️',
  },
  {
    id: 'track-pyara-2',
    title: 'Pyaari Muskaan (प्यारी सी मुस्कान)',
    titleHindi: 'प्यारी सी मुस्कान • बचपन की यादें',
    artist: 'Somo Music • Sumit',
    mood: 'pyara',
    description: 'Playful ukulele and sweet music-box bells that bring an instant warm smile to your face.',
    descriptionHindi: 'चेहरे पर हल्की मुस्कान ला देने वाली चंचल, नटखट और प्यारी धुन।',
    duration: '2:55',
    tempo: 100,
    key: 'C Major',
    coverEmoji: '🧸',
  },
];

class MusicSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrack: MusicTrack = TRACK_LIST[0];
  private masterGain: GainNode | null = null;
  private musicVolume: number = 0.65;
  private isMuted: boolean = false;
  private intervalId: number | null = null;
  private step: number = 0;
  private onTrackChangeCallbacks: ((track: MusicTrack) => void)[] = [];
  private onPlaybackChangeCallbacks: ((isPlaying: boolean) => void)[] = [];
  private onTimeUpdateCallbacks: ((currentTime: number, progress: number) => void)[] = [];
  private trackSeconds: number = 0;
  private totalTrackSeconds: number = 225; // ~3:45 default

  private initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getTrackList(): MusicTrack[] {
    return TRACK_LIST;
  }

  public getCurrentTrack(): MusicTrack {
    return this.currentTrack;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.musicVolume;
  }

  public setVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.musicVolume, this.ctx.currentTime, 0.05);
    }
  }

  public subscribeTrackChange(cb: (track: MusicTrack) => void) {
    this.onTrackChangeCallbacks.push(cb);
  }

  public subscribePlaybackChange(cb: (isPlaying: boolean) => void) {
    this.onPlaybackChangeCallbacks.push(cb);
  }

  public subscribeTimeUpdate(cb: (currentTime: number, progress: number) => void) {
    this.onTimeUpdateCallbacks.push(cb);
  }

  public playTrack(track: MusicTrack) {
    this.initAudio();
    this.currentTrack = track;
    this.step = 0;
    this.trackSeconds = 0;
    const parts = track.duration.split(':');
    this.totalTrackSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

    this.onTrackChangeCallbacks.forEach((cb) => cb(this.currentTrack));

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.onPlaybackChangeCallbacks.forEach((cb) => cb(true));
      this.startSequence();
    }
  }

  public togglePlay() {
    this.initAudio();
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public play() {
    this.initAudio();
    this.isPlaying = true;
    this.onPlaybackChangeCallbacks.forEach((cb) => cb(true));
    this.startSequence();
  }

  public pause() {
    this.isPlaying = false;
    this.onPlaybackChangeCallbacks.forEach((cb) => cb(false));
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public nextTrack() {
    const idx = TRACK_LIST.findIndex((t) => t.id === this.currentTrack.id);
    const nextIdx = (idx + 1) % TRACK_LIST.length;
    this.playTrack(TRACK_LIST[nextIdx]);
  }

  public prevTrack() {
    const idx = TRACK_LIST.findIndex((t) => t.id === this.currentTrack.id);
    const prevIdx = (idx - 1 + TRACK_LIST.length) % TRACK_LIST.length;
    this.playTrack(TRACK_LIST[prevIdx]);
  }

  public selectMood(mood: MusicMood) {
    const track = TRACK_LIST.find((t) => t.mood === mood);
    if (track) {
      this.playTrack(track);
    }
  }

  /**
   * Musical sequencing engine
   */
  private startSequence() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }

    const bpm = this.currentTrack.tempo;
    const beatInterval = (60 / bpm / 2) * 1000; // 8th note intervals

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      this.playNoteStep(this.currentTrack.mood, this.step);
      this.step = (this.step + 1) % 64;

      // Track time progress
      this.trackSeconds += beatInterval / 1000;
      if (this.trackSeconds >= this.totalTrackSeconds) {
        this.trackSeconds = 0;
        this.nextTrack(); // Auto loop to next song
      }
      const progress = Math.min(1, this.trackSeconds / this.totalTrackSeconds);
      this.onTimeUpdateCallbacks.forEach((cb) => cb(this.trackSeconds, progress));
    }, beatInterval);
  }

  private playNoteStep(mood: MusicMood, step: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    switch (mood) {
      case 'romantic':
        this.synthesizeRomantic(step, now);
        break;
      case 'love':
        this.synthesizeLove(step, now);
        break;
      case 'sadness':
        this.synthesizeSadness(step, now);
        break;
      case 'pyara':
        this.synthesizePyara(step, now);
        break;
    }
  }

  /**
   * 💖 Romantic: Lush maj7 chords, picked guitar arpeggios, warm mellow bass, gentle vibraphone
   */
  private synthesizeRomantic(step: number, now: number) {
    // Chords: Fmaj7 (F, A, C, E) -> Am7 (A, C, E, G) -> Dm7 (D, F, A, C) -> Bbmaj7 (Bb, D, F, A)
    const chordIdx = Math.floor(step / 16) % 4;
    const chords = [
      { bass: 87.31, chord: [349.23, 440.0, 523.25, 659.25] }, // Fmaj7
      { bass: 110.0, chord: [329.63, 440.0, 523.25, 659.25] }, // Am7
      { bass: 73.42, chord: [293.66, 349.23, 440.0, 523.25] }, // Dm7
      { bass: 116.54, chord: [349.23, 466.16, 587.33, 698.46] }, // Bbmaj7
    ];

    const currentChord = chords[chordIdx];

    // Bass note every 8 steps
    if (step % 8 === 0) {
      this.triggerTone(currentChord.bass, 'triangle', now, 0.9, 0.22);
    }

    // Arpeggio notes (picked guitar feel)
    const noteInChord = currentChord.chord[step % 4];
    this.triggerTone(noteInChord, 'sine', now, 0.45, 0.12);

    // Occasional gentle high chime melody
    if (step % 4 === 2) {
      const melodyNotes = [659.25, 783.99, 880.0, 1046.5];
      const mNote = melodyNotes[(step * 3) % melodyNotes.length];
      this.triggerTone(mNote, 'sine', now + 0.05, 0.7, 0.08);
    }

    // Soft warm pad swell every 16 steps
    if (step % 16 === 0) {
      currentChord.chord.forEach((freq) => {
        this.triggerTone(freq * 0.5, 'sine', now, 2.5, 0.04);
      });
    }
  }

  /**
   * 🌹 Love (इश्क): Soulful Indian acoustic guitar & warm harmonium tones
   */
  private synthesizeLove(step: number, now: number) {
    // Chords: C (C, E, G) -> G (G, B, D) -> Am (A, C, E) -> F (F, A, C)
    const chordIdx = Math.floor(step / 16) % 4;
    const chords = [
      { bass: 130.81, notes: [261.63, 329.63, 392.0, 523.25] }, // C
      { bass: 98.0, notes: [246.94, 293.66, 392.0, 493.88] }, // G
      { bass: 110.0, notes: [220.0, 261.63, 329.63, 440.0] }, // Am
      { bass: 87.31, notes: [220.0, 261.63, 349.23, 440.0] }, // F
    ];
    const current = chords[chordIdx];

    // Harmonium chord drone
    if (step % 16 === 0) {
      this.triggerTone(current.bass, 'sawtooth', now, 2.2, 0.08, 0.04);
      this.triggerTone(current.notes[0], 'triangle', now, 2.0, 0.06);
    }

    // Acoustic picked pattern
    const pickFreq = current.notes[step % current.notes.length];
    this.triggerTone(pickFreq, 'triangle', now, 0.35, 0.14);

    // Heartbeat percussion
    if (step % 8 === 0 || step % 8 === 3) {
      this.triggerPercussion('heartbeat', now);
    }

    // Expressive Indian flute/violin melodic ornaments
    if (step % 8 === 4) {
      const solo = [523.25, 587.33, 659.25, 783.99, 880.0];
      const sNote = solo[(step + chordIdx) % solo.length];
      this.triggerTone(sNote, 'sine', now, 0.8, 0.12, 0.03);
    }
  }

  /**
   * 🌧️ Sadness (उदासी): Melancholic minor piano, weeping strings, gentle ambient rain
   */
  private synthesizeSadness(step: number, now: number) {
    // Deep emotional progression: Am -> F -> Dm -> Em
    const chordIdx = Math.floor(step / 16) % 4;
    const chords = [
      { bass: 55.0, melody: [220.0, 261.63, 329.63, 440.0, 523.25] }, // Am
      { bass: 43.65, melody: [174.61, 220.0, 261.63, 349.23, 440.0] }, // F
      { bass: 36.71, melody: [146.83, 174.61, 220.0, 293.66, 349.23] }, // Dm
      { bass: 41.2, melody: [164.81, 196.0, 246.94, 329.63, 392.0] }, // Em
    ];
    const current = chords[chordIdx];

    // Deep piano bass strike
    if (step % 16 === 0) {
      this.triggerTone(current.bass * 2, 'triangle', now, 3.2, 0.25);
    }

    // Slow emotional crying piano note
    if (step % 4 === 0) {
      const note = current.melody[(step / 4) % current.melody.length];
      this.triggerTone(note, 'sine', now, 1.2, 0.18);
    }

    // Rain drop ambient high frequency ping
    if (step % 6 === 2) {
      const dropFreq = 1200 + Math.random() * 800;
      this.triggerTone(dropFreq, 'sine', now, 0.12, 0.03);
    }
  }

  /**
   * 🌸 Pyara (प्यारा): Sweet lofi chimes, cheerful ukulele, cozy nostalgic vibes
   */
  private synthesizePyara(step: number, now: number) {
    // Upbeat major pentatonic: D -> A -> Bm -> G
    const chordIdx = Math.floor(step / 16) % 4;
    const chords = [
      { bass: 146.83, notes: [293.66, 369.99, 440.0, 587.33] }, // D
      { bass: 110.0, notes: [277.18, 329.63, 440.0, 554.37] }, // A
      { bass: 123.47, notes: [246.94, 293.66, 369.99, 493.88] }, // Bm
      { bass: 98.0, notes: [246.94, 293.66, 392.0, 587.33] }, // G
    ];
    const current = chords[chordIdx];

    // Bouncy bass
    if (step % 4 === 0 || step % 4 === 2) {
      this.triggerTone(current.bass, 'triangle', now, 0.25, 0.16);
    }

    // Ukulele rhythm strum
    if (step % 2 === 1) {
      current.notes.forEach((freq, idx) => {
        this.triggerTone(freq, 'sine', now + idx * 0.015, 0.25, 0.07);
      });
    }

    // Sweet music-box bell on top
    if (step % 8 === 4) {
      const bells = [880.0, 987.77, 1108.73, 1174.66];
      const bellNote = bells[(step * 2) % bells.length];
      this.triggerTone(bellNote, 'sine', now, 0.6, 0.1);
    }

    // Soft snap/percussion
    if (step % 4 === 2) {
      this.triggerPercussion('snap', now);
    }
  }

  private triggerTone(
    freq: number,
    type: OscillatorType,
    startTime: number,
    duration: number,
    volume: number,
    filterFreq?: number
  ) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    if (filterFreq) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, startTime);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  private triggerPercussion(type: 'heartbeat' | 'snap', startTime: number) {
    if (!this.ctx || !this.masterGain) return;

    if (type === 'heartbeat') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, startTime);
      osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.1);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    } else {
      // Snap / soft click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, startTime);
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.05);
    }
  }
}

export const musicSynthesizer = new MusicSynthesizer();
