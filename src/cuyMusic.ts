/**
 * Background music for the cuy story, generated with Web Audio like the game's other sounds, so
 * there is no file to download. A step sequencer plays sixteenth notes at 120 BPM: five bars for
 * each ten-second scene, in a style that follows the story. A huayno with quena and charango in
 * the Andes, a polka on the accordion in Prague, a chase with synth bass in Berlin, soft bells on
 * the night flight, koto and taiko in Tokyo, and a happy huayno in a major key for the way home.
 */

const STEP_SECONDS = 0.125;
const STEPS_PER_BAR = 16;
const BARS_PER_SCENE = 5;
const STEPS_PER_SCENE = STEPS_PER_BAR * BARS_PER_SCENE;
const LOOKAHEAD_SECONDS = 0.3;
const TIMER_MS = 50;
const MASTER_VOLUME = 0.55;
const FADE_SECONDS = 0.4;

type Lead = 'quena' | 'accordion' | 'synth' | 'bell' | 'koto';

interface Style {
  /** Sixteen tokens a bar: a note such as "A4" starts, "-" holds it, "." is a rest. */
  melody: string[];
  lead: Lead;
  /** One chord a bar, low notes first; the bass plays the first. */
  chords: string[][];
  /** Per step: R the root an octave down, F its fifth, r the root. */
  bass: string;
  bassSound: 'soft' | 'synth';
  /** Per step: x strums the chord, a plays its next note. */
  comp: string;
  compSound: 'charango' | 'accordion' | 'koto' | 'bell';
  /** Per step: K kick, S snare, H hat, B bombo, T taiko. */
  drums: string[];
}

const A_MINOR = ['A3', 'C4', 'E4'];
const C_MAJOR = ['C4', 'E4', 'G4'];
const G_MAJOR = ['G3', 'B3', 'D4'];
const G_SEVEN = ['G3', 'B3', 'F4'];
const F_MAJOR = ['F3', 'A3', 'C4'];
const E_MAJOR = ['E3', 'G#3', 'B3'];

const HUAYNO = [
  'E5 - A5 G5 E5 - D5 - C5 - D5 E5 A4 - - -',
  'C5 - D5 E5 G5 - E5 D5 C5 - A4 - G4 - - -',
  'E5 - A5 G5 E5 - D5 - C5 - D5 E5 G5 - E5 -',
  'D5 - C5 D5 A4 - - - A4 - - - . . . .',
];
const BOMBO = 'B...B.B.B...B.B.';
const SHAKER = '..H...H...H...H.';

const STYLES = {
  andesSoft: {
    melody: HUAYNO,
    lead: 'quena',
    chords: [A_MINOR, G_MAJOR, C_MAJOR, A_MINOR],
    bass: 'R.......F.......',
    bassSound: 'soft',
    comp: '..x...x...x...x.',
    compSound: 'charango',
    drums: ['B.......B.......'],
  },
  andes: {
    melody: HUAYNO,
    lead: 'quena',
    chords: [A_MINOR, G_MAJOR, C_MAJOR, A_MINOR],
    bass: 'R.......F...R...',
    bassSound: 'soft',
    comp: 'x.x.x.x.x.x.x.x.',
    compSound: 'charango',
    drums: [BOMBO, SHAKER],
  },
  prague: {
    melody: [
      'G4 - C5 - E5 - C5 - G5 - E5 - C5 - - -',
      'F5 - D5 - B4 - D5 - G5 - F5 - D5 - - -',
      'E5 - G5 - C6 - G5 - E5 - G5 - C6 - - -',
      'D5 E5 F5 D5 B4 - G4 - B4 - - - . . . .',
    ],
    lead: 'accordion',
    chords: [C_MAJOR, G_SEVEN, C_MAJOR, G_SEVEN],
    bass: 'R.......F.......',
    bassSound: 'soft',
    comp: '....x.......x...',
    compSound: 'accordion',
    drums: ['K...S...K...S...'],
  },
  berlin: {
    melody: [
      'A4 - - C5 E5 - A5 - G5 - E5 - D5 - E5 -',
      'F5 - - E5 D5 - C5 - D5 - - - E5 - - -',
      'A4 - - C5 E5 - A5 - B5 - A5 - G5 - E5 -',
      'F5 - E5 - D5 - C5 - B4 - G#4 - A4 - - -',
    ],
    lead: 'synth',
    chords: [A_MINOR, F_MAJOR, A_MINOR, E_MAJOR],
    bass: 'R.RrR.RrR.RrR.Rr',
    bassSound: 'synth',
    comp: '................',
    compSound: 'charango',
    drums: ['K...K...K...K...', '..H...H...H...H.', '....S.......S...'],
  },
  night: {
    melody: [
      'E5 - - - - - - - D5 - - - C5 - - -',
      'D5 - - - - - - - - - - - . . . .',
      'C5 - - - - - - - A4 - - - G4 - - -',
      'A4 - - - - - - - - - - - . . . .',
    ],
    lead: 'bell',
    chords: [A_MINOR, G_MAJOR, F_MAJOR, A_MINOR],
    bass: 'R...............',
    bassSound: 'soft',
    comp: 'a.a.a.a.a.a.a.a.',
    compSound: 'bell',
    drums: [],
  },
  tokyo: {
    melody: [
      'E5 - F5 - A5 - - - B5 - A5 - F5 - E5 -',
      'C5 - - - B4 - - - A4 - B4 - E4 - - -',
      'A4 - B4 - C5 - E5 - F5 - E5 - C5 - B4 -',
      'A4 - F4 - E4 - - - . . . . . . . .',
    ],
    lead: 'koto',
    chords: [['E3', 'B3'], ['A3', 'E4'], ['F3', 'C4'], ['E3', 'B3']],
    bass: 'R...............',
    bassSound: 'soft',
    comp: '....x.......x...',
    compSound: 'koto',
    drums: ['T.......T...T...', '....H.......H...'],
  },
  home: {
    melody: [
      'G5 - C6 A5 G5 - E5 - D5 - E5 G5 C5 - - -',
      'E5 - G5 A5 C6 - A5 G5 E5 - D5 - D5 - - -',
      'G5 - C6 A5 G5 - E5 - D5 - E5 G5 A5 - G5 -',
      'E5 - D5 E5 C5 - - - C5 - - - . . . .',
    ],
    lead: 'quena',
    chords: [C_MAJOR, G_MAJOR, A_MINOR, C_MAJOR],
    bass: 'R.......F...R...',
    bassSound: 'soft',
    comp: 'x.x.x.x.x.x.x.x.',
    compSound: 'charango',
    drums: [BOMBO, SHAKER],
  },
} satisfies Record<string, Style>;

/** The style of each scene, in story order. */
const SCENE_STYLES: (keyof typeof STYLES)[] = [
  'andesSoft', 'andes', 'andes', 'andes',
  'prague', 'prague',
  'berlin', 'berlin',
  'night',
  'tokyo', 'tokyo', 'tokyo',
  'home', 'home', 'home',
];

/** The music stops on a final chord as "¡FIN!" comes up: six seconds into the last scene. */
const FINAL_STEP = (SCENE_STYLES.length - 1) * STEPS_PER_SCENE + 3 * STEPS_PER_BAR;
/** The wind takes the chullo three seconds into the second scene. */
const WHOOSH_STEP = STEPS_PER_SCENE + 24;
/** The earthquake in Tokyo, two seconds into the tenth scene. */
const RUMBLE_STEP = 9 * STEPS_PER_SCENE + 16;
const RUMBLE_SECONDS = 4.5;

const NOTE_STEPS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function frequency(note: string): number {
  const [, name, accidental, octave] = /^([A-G])([#b]?)(\d)$/.exec(note) ?? ['', 'A', '', '4'];
  const midi = (Number(octave) + 1) * 12 + NOTE_STEPS[name] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0);

  return 440 * 2 ** ((midi - 69) / 12);
}

/** A bar's notes as [step, note, length in steps]. */
function parseBar(bar: string): [number, string, number][] {
  const tokens = bar.split(' ');
  const notes: [number, string, number][] = [];

  tokens.forEach((token, step) => {
    if (token === '-' || token === '.') return;

    let length = 1;

    while (tokens[step + length] === '-') length++;
    notes.push([step, token, length]);
  });

  return notes;
}

export interface CuyMusic {
  stop(): void;
  setMuted(muted: boolean): void;
}

/** Starts the music, optionally part of the way in; call it from a click, or browsers keep it silent. */
export function startCuyMusic(fromSeconds = 0): CuyMusic {
  let ac: AudioContext;

  try {
    ac = new AudioContext();
  } catch {
    return { stop() {}, setMuted() {} };
  }

  const audio = ac;
  const master = audio.createGain();
  const limiter = audio.createDynamicsCompressor();
  const noise = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
  const samples = noise.getChannelData(0);

  for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1;

  master.gain.value = MASTER_VOLUME;
  master.connect(limiter).connect(audio.destination);

  const tone = (type: OscillatorType, hz: number, time: number, seconds: number, into: AudioNode) => {
    const oscillator = audio.createOscillator();

    oscillator.type = type;
    oscillator.frequency.value = hz;
    oscillator.connect(into);
    oscillator.start(time);
    oscillator.stop(time + seconds + 0.05);

    return oscillator;
  };

  /** A gain that swells in and holds, then fades at the end of the note. */
  const held = (time: number, seconds: number, peak: number, attack = 0.03, release = 0.06) => {
    const gain = audio.createGain();

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(peak, time + attack);
    gain.gain.setValueAtTime(peak, time + Math.max(attack, seconds - release));
    gain.gain.linearRampToValueAtTime(0, time + seconds);
    gain.connect(master);

    return gain;
  };

  /** A gain that strikes and dies away, like a plucked string or a drum. */
  const struck = (time: number, peak: number, decay: number, into: AudioNode = master) => {
    const gain = audio.createGain();

    gain.gain.setValueAtTime(peak, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
    gain.connect(into);

    return gain;
  };

  const filter = (type: BiquadFilterType, hz: number, into: AudioNode) => {
    const node = audio.createBiquadFilter();

    node.type = type;
    node.frequency.value = hz;
    node.connect(into);

    return node;
  };

  const noiseBurst = (time: number, seconds: number, into: AudioNode) => {
    const source = audio.createBufferSource();

    source.buffer = noise;
    source.loop = true;
    source.connect(into);
    source.start(time);
    source.stop(time + seconds);

    return source;
  };

  const lead = (kind: Lead, hz: number, time: number, seconds: number) => {
    switch (kind) {
      case 'quena': {
        // A breathy flute with a little vibrato once the note settles.
        const gain = held(time, seconds, 0.12, 0.04);
        const flute = tone('sine', hz, time, seconds, gain);
        const vibrato = audio.createOscillator();
        const depth = audio.createGain();

        tone('triangle', hz, time, seconds, struck(time, 0.05, seconds + 0.01, gain));
        vibrato.frequency.value = 5.5;
        depth.gain.setValueAtTime(0, time);
        depth.gain.linearRampToValueAtTime(hz * 0.008, time + Math.min(0.25, seconds));
        vibrato.connect(depth).connect(flute.frequency);
        vibrato.start(time);
        vibrato.stop(time + seconds + 0.05);
        noiseBurst(time, 0.06, filter('bandpass', hz * 2, struck(time, 0.04, 0.06)));
        break;
      }
      case 'accordion': {
        const reeds = filter('lowpass', 1700, held(time, seconds, 0.05));

        tone('sawtooth', hz, time, seconds, reeds);
        tone('sawtooth', hz * 1.004, time, seconds, reeds);
        break;
      }
      case 'synth':
        tone('square', hz, time, seconds, filter('lowpass', 2200, held(time, seconds, 0.055, 0.01)));
        break;
      case 'bell':
        tone('sine', hz, time, 1.6, struck(time, 0.12, 1.6));
        tone('sine', hz * 2, time, 0.8, struck(time, 0.03, 0.8));
        break;
      case 'koto':
        tone('triangle', hz, time, 0.9, struck(time, 0.16, 0.9));
        tone('sawtooth', hz * 2, time, 0.2, filter('lowpass', 3000, struck(time, 0.02, 0.2)));
        break;
    }
  };

  const comp = (kind: Style['compSound'], hz: number, time: number) => {
    switch (kind) {
      case 'charango':
        tone('square', hz * 2, time, 0.25, filter('lowpass', 2600, struck(time, 0.025, 0.25)));
        break;
      case 'accordion':
        tone('sawtooth', hz, time, 0.2, filter('lowpass', 1400, held(time, 0.2, 0.03, 0.01, 0.05)));
        break;
      case 'koto':
        tone('triangle', hz * 2, time, 0.6, struck(time, 0.06, 0.6));
        break;
      case 'bell':
        tone('sine', hz * 2, time, 1, struck(time, 0.045, 1));
        break;
    }
  };

  const bass = (kind: Style['bassSound'], hz: number, time: number, seconds: number) => {
    if (kind === 'synth') {
      tone('sawtooth', hz, time, seconds, filter('lowpass', 650, held(time, seconds, 0.09, 0.005, 0.03)));
    } else {
      tone('triangle', hz, time, seconds, held(time, seconds, 0.2, 0.01, 0.08));
    }
  };

  /** A sine that drops in pitch: the body of every drum. */
  const thump = (time: number, from: number, to: number, peak: number, decay: number) => {
    const oscillator = tone('sine', from, time, decay, struck(time, peak, decay));

    oscillator.frequency.setValueAtTime(from, time);
    oscillator.frequency.exponentialRampToValueAtTime(to, time + decay * 0.5);
  };

  const drum = (hit: string, time: number) => {
    switch (hit) {
      case 'K':
        thump(time, 140, 45, 0.6, 0.3);
        break;
      case 'B':
        thump(time, 100, 55, 0.5, 0.35);
        noiseBurst(time, 0.08, filter('lowpass', 400, struck(time, 0.15, 0.08)));
        break;
      case 'T':
        thump(time, 110, 60, 0.6, 0.6);
        noiseBurst(time, 0.15, filter('lowpass', 800, struck(time, 0.25, 0.15)));
        break;
      case 'S':
        noiseBurst(time, 0.12, filter('highpass', 1500, struck(time, 0.18, 0.12)));
        break;
      case 'H':
        noiseBurst(time, 0.05, filter('highpass', 7000, struck(time, 0.07, 0.04)));
        break;
    }
  };

  const whoosh = (time: number) => {
    const band = audio.createBiquadFilter();
    const gain = held(time, 1.6, 0.3, 0.5, 0.9);

    band.type = 'bandpass';
    band.Q.value = 1.5;
    band.frequency.setValueAtTime(300, time);
    band.frequency.exponentialRampToValueAtTime(2500, time + 0.7);
    band.frequency.exponentialRampToValueAtTime(300, time + 1.6);
    band.connect(gain);
    noiseBurst(time, 1.6, band);
  };

  const rumble = (time: number) => {
    noiseBurst(time, RUMBLE_SECONDS, filter('lowpass', 140, held(time, RUMBLE_SECONDS, 0.7, 0.3, 1.2)));
    thump(time, 70, 35, 0.6, 1.2);
  };

  const finalChord = (time: number) => {
    for (const note of ['C4', 'E4', 'G4', 'C5']) {
      lead('bell', frequency(note), time, 2);
      tone('triangle', frequency(note), time, 2.5, struck(time, 0.08, 2.5));
    }
    lead('quena', frequency('C6'), time, 1.6);
    thump(time, 100, 50, 0.7, 0.8);
  };

  const parsed = Object.fromEntries(
    Object.entries(STYLES).map(([name, style]) => [name, style.melody.map(parseBar)]),
  ) as Record<keyof typeof STYLES, [number, string, number][][]>;
  let arpeggio = 0;

  const playStep = (step: number, time: number) => {
    if (step === WHOOSH_STEP) whoosh(time);
    if (step === RUMBLE_STEP) rumble(time);
    if (step === FINAL_STEP) finalChord(time);
    if (step >= FINAL_STEP) return;

    const name = SCENE_STYLES[Math.floor(step / STEPS_PER_SCENE)];
    const style: Style = STYLES[name];
    const barInScene = Math.floor((step % STEPS_PER_SCENE) / STEPS_PER_BAR);
    const phrase = barInScene % style.melody.length;
    const beat = step % STEPS_PER_BAR;
    const chord = style.chords[phrase % style.chords.length];
    const root = frequency(chord[0]);

    for (const [at, note, length] of parsed[name][phrase]) {
      if (at === beat) lead(style.lead, frequency(note), time, length * STEP_SECONDS * 0.95);
    }

    const bassHit = style.bass[beat];

    if (bassHit === 'R') bass(style.bassSound, root / 2, time, STEP_SECONDS * 3);
    if (bassHit === 'F') bass(style.bassSound, (root * 3) / 4, time, STEP_SECONDS * 3);
    if (bassHit === 'r') bass(style.bassSound, root, time, STEP_SECONDS);

    if (style.comp[beat] === 'x') {
      // Strummed: each string a moment after the last.
      chord.forEach((note, index) => comp(style.compSound, frequency(note), time + index * 0.012));
    }
    if (style.comp[beat] === 'a') comp(style.compSound, frequency(chord[arpeggio++ % chord.length]), time);

    for (const pattern of style.drums) drum(pattern[beat], time);
  };

  const start = audio.currentTime + 0.05 - fromSeconds;
  let next = Math.ceil(fromSeconds / STEP_SECONDS);

  const timer = window.setInterval(() => {
    while (next <= FINAL_STEP && start + next * STEP_SECONDS < audio.currentTime + LOOKAHEAD_SECONDS) {
      try {
        playStep(next, Math.max(audio.currentTime, start + next * STEP_SECONDS));
      } catch {
        // A note that fails to play is skipped; the story goes on.
      }
      next++;
    }
  }, TIMER_MS);

  void audio.resume();

  return {
    stop() {
      window.clearInterval(timer);
      master.gain.cancelScheduledValues(audio.currentTime);
      master.gain.setValueAtTime(master.gain.value, audio.currentTime);
      master.gain.linearRampToValueAtTime(0, audio.currentTime + FADE_SECONDS);
      window.setTimeout(() => void audio.close(), (FADE_SECONDS + 0.1) * 1000);
    },
    setMuted(muted) {
      master.gain.cancelScheduledValues(audio.currentTime);
      master.gain.setValueAtTime(master.gain.value, audio.currentTime);
      master.gain.linearRampToValueAtTime(muted ? 0 : MASTER_VOLUME, audio.currentTime + 0.1);
    },
  };
}
