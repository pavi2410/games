import { load, save } from "../../lib/storage";

const MUTE_KEY = "ms:muted";

let ctx: AudioContext | null = null;
let muted = load(MUTE_KEY, false);

/** Lazily created on first user gesture (autoplay policies). */
function ac(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Single enveloped oscillator blip. */
function blip(freq: number, dur = 0.06, type: OscillatorType = "square", vol = 0.04, when = 0) {
  const c = ac();
  if (!c || muted) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  get muted() {
    return muted;
  },
  toggle(): boolean {
    muted = !muted;
    save(MUTE_KEY, muted);
    return muted;
  },
  /** Pitch rises with flood-fill size. */
  reveal: (opened: number) => blip(440 + Math.min(opened, 24) * 22, 0.07),
  flag: (on: boolean) => (on ? blip(660, 0.06) : blip(440, 0.06)),
  chord: () => blip(520, 0.05, "square", 0.03),
  boom() {
    const c = ac();
    if (!c || muted) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  },
  win: () => {
    blip(523, 0.09);
    blip(659, 0.09, "square", 0.04, 0.1);
    blip(784, 0.14, "square", 0.04, 0.2);
  },
};
