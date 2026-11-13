// Off until the player turns it on, because a whole class plays at once. The notes are
// generated here, so there are no sound files to download on school Wi-Fi.
const STORAGE_KEY = 'llama-journey.sound';
const VOLUME = 0.08;
const FADE_SECONDS = 0.02;

const FLIGHT_VOLUME = 0.3;
const FLIGHT_LOW_HZ = 350;
const FLIGHT_HIGH_HZ = 1300;
const WING_BEATS_PER_SECOND = 4.5;
const WING_BEAT_DEPTH = 0.4;

const C5 = 523;
const E5 = 659;
const G5 = 784;
const C6 = 1047;
const G4 = 392;
const E4 = 330;

type Note = [frequency: number, seconds: number];

const SOUNDS = {
  switchOn: [[G5, 0.08]],
  right: [[E5, 0.09], [G5, 0.14]],
  wrong: [[G4, 0.1], [E4, 0.18]],
  arrive: [[C5, 0.1], [E5, 0.1], [G5, 0.1], [C6, 0.22]],
  finish: [[G4, 0.1], [C5, 0.1], [E5, 0.1], [G5, 0.1], [C6, 0.3]],
} satisfies Record<string, Note[]>;

let on = readStored();
let context: AudioContext | null = null;

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    // Storage can be blocked, as in some private tabs. Sound simply starts off.
    return false;
  }
}

// Phones only start audio during a tap, but the flight's sound begins between taps. So for a
// player who turned sound on during an earlier visit, every tap makes sure audio is running.
window.addEventListener('pointerup', () => {
  if (on) {
    try {
      context ??= new AudioContext();
      void context.resume();
    } catch {
      // Sound is optional, so it must never stop the game.
    }
  }
});

export function soundIsOn(): boolean {
  return on;
}

export function toggleSound(): void {
  on = !on;

  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // The game still works, it just forgets.
  }

  playSound('switchOn');
}

/**
 * Air rushing past while the wings beat: filtered noise that swells and rises in the middle of the
 * flight, then dies away. Returns a function that cuts it short, for when the player skips ahead.
 */
export function playFlight(seconds: number): () => void {
  if (!on) {
    return () => {};
  }

  try {
    context ??= new AudioContext();
    void context.resume();

    const now = context.currentTime;
    const end = now + seconds;
    const noise = context.createBufferSource();
    const samples = new Float32Array(context.sampleRate);

    for (let index = 0; index < samples.length; index++) {
      samples[index] = Math.random() * 2 - 1;
    }

    noise.buffer = context.createBuffer(1, samples.length, context.sampleRate);
    noise.buffer.copyToChannel(samples, 0);
    noise.loop = true;

    const air = context.createBiquadFilter();

    air.type = 'bandpass';
    air.Q.value = 1.2;
    air.frequency.setValueAtTime(FLIGHT_LOW_HZ, now);
    air.frequency.linearRampToValueAtTime(FLIGHT_HIGH_HZ, now + seconds / 2);
    air.frequency.linearRampToValueAtTime(FLIGHT_LOW_HZ, end);

    const swell = context.createGain();

    swell.gain.setValueAtTime(0, now);
    swell.gain.linearRampToValueAtTime(FLIGHT_VOLUME, now + seconds / 2);
    swell.gain.linearRampToValueAtTime(0, end);

    // Beats at the speed the wings flap on screen.
    const wings = context.createGain();
    const beat = context.createOscillator();
    const beatDepth = context.createGain();

    wings.gain.value = 1 - WING_BEAT_DEPTH;
    beat.frequency.value = WING_BEATS_PER_SECOND;
    beatDepth.gain.value = WING_BEAT_DEPTH;
    beat.connect(beatDepth).connect(wings.gain);
    noise.connect(air).connect(wings).connect(swell).connect(context.destination);
    noise.start(now);
    beat.start(now);
    noise.stop(end);
    beat.stop(end);

    const audio = context;

    return () => {
      const cut = audio.currentTime;

      // A short fade, because stopping noise dead makes a click.
      swell.gain.cancelScheduledValues(cut);
      swell.gain.setValueAtTime(swell.gain.value, cut);
      swell.gain.linearRampToValueAtTime(0, cut + FADE_SECONDS);
    };
  } catch {
    return () => {};
  }
}

/** Plays one short tune, if sound is on. A phone without working audio just stays silent. */
export function playSound(name: keyof typeof SOUNDS): void {
  if (!on) {
    return;
  }

  try {
    // Phones only allow audio after a tap, so this first runs when the player taps the button.
    context ??= new AudioContext();
    void context.resume();

    let start = context.currentTime;

    for (const [frequency, seconds] of SOUNDS[name] as Note[]) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(VOLUME, start);
      gain.gain.setValueAtTime(VOLUME, start + seconds - FADE_SECONDS);
      gain.gain.linearRampToValueAtTime(0, start + seconds);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + seconds);
      start += seconds;
    }
  } catch {
    // Sound is optional, so it must never stop the game.
  }
}
