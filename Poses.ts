/**
 * POSES + CLIPS  (the "animation library" of the stick-man)
 * ---------------------------------------------------------
 * Angle convention (same as SVG rotate): 0 = limb hangs straight down,
 * positive = clockwise on screen.
 *   - screen-LEFT  limbs: positive = swing outward (left), 180 = straight up
 *   - screen-RIGHT limbs: negative = swing outward (right), -180 = straight up
 *   - *Fore / *Shin are RELATIVE to the upper limb.
 *   - lean: torso rotation (positive = top leans right)
 * hipX / hipY move the whole body (px, negative Y = up).
 *
 * A clip is a function of time `t` (seconds since the action started)
 * returning only the values it changes; the rest comes from BASE.
 */

export type Pose = {
  hipX: number;
  hipY: number;
  lean: number;
  head: number;
  lArm: number;
  lFore: number;
  rArm: number;
  rFore: number;
  lLeg: number;
  lShin: number;
  rLeg: number;
  rShin: number;
};

export const BASE: Pose = {
  hipX: 0,
  hipY: 0,
  lean: 0,
  head: 0,
  lArm: 14,
  lFore: 6,
  rArm: -14,
  rFore: -6,
  lLeg: 5,
  lShin: 0,
  rLeg: -5,
  rShin: 0,
};

export type ClipName =
  | 'idle'
  | 'walk'
  | 'wave'
  | 'cheer'
  | 'jump'
  | 'punch'
  | 'hit'
  | 'fall';

export type ClipContext = {holdingMic: boolean};

const TAU = Math.PI * 2;
const ease = (p: number) => 1 - Math.pow(1 - Math.min(Math.max(p, 0), 1), 3);

/** right hand holds a microphone near the chest */
const micArm = (c: ClipContext): Partial<Pose> =>
  c.holdingMic ? {rArm: -38, rFore: -105} : {};

type Clip = (t: number, c: ClipContext) => Partial<Pose>;

export const CLIPS: Record<ClipName, Clip> = {
  idle: (t, c) => {
    const s = Math.sin(t * TAU * 0.9);
    return {
      hipY: s * 3,
      lean: s * 1.2,
      head: Math.sin(t * TAU * 0.45) * 3,
      lArm: 14 + s * 3,
      rArm: -14 - s * 3,
      ...micArm(c),
    };
  },

  walk: (t, c) => {
    const p = t * TAU * 1.8;
    const s = Math.sin(p);
    const k = Math.cos(p);
    return {
      hipY: -Math.abs(s) * 14,
      lean: 4,
      head: Math.sin(p * 2) * 2,
      lLeg: 32 * s,
      rLeg: -32 * s,
      lShin: 28 * Math.max(0, k),
      rShin: 28 * Math.max(0, -k),
      lArm: 14 - 28 * s,
      rArm: -14 + 28 * s,
      ...micArm(c),
    };
  },

  // screen-left arm waves, right arm (mic) stays down
  wave: (t, c) => {
    const s = Math.sin(t * TAU * 2.4);
    const b = Math.sin(t * TAU * 1.1);
    return {
      hipY: b * 3,
      lean: -2 + b * 1.5,
      head: -4 + s * 2,
      lArm: 100 + s * 3,
      lFore: 65 + 28 * s,
      ...micArm(c),
    };
  },

  cheer: (t) => {
    const p = t * TAU * 2.2;
    const a = Math.abs(Math.sin(p));
    return {
      hipY: -a * 60,
      head: Math.sin(p) * 3,
      lArm: 100 + Math.sin(p * 2) * 8,
      lFore: 60,
      rArm: -100 - Math.sin(p * 2) * 8,
      rFore: -60,
      lLeg: 16 - a * 10,
      rLeg: -16 + a * 10,
      lShin: 20 * (1 - a),
      rShin: -20 * (1 - a),
    };
  },

  jump: (t) => {
    const p = t * TAU * 1.5;
    const a = Math.abs(Math.sin(p));
    return {
      hipY: -a * 80,
      lean: Math.sin(p) * 2,
      lArm: 100 + 40 * Math.sin(p),
      rArm: -(100 + 40 * Math.sin(p)),
      lFore: 15,
      rFore: -15,
      lLeg: 10 + a * 12,
      rLeg: -10 - a * 12,
      lShin: 45 * a,
      rShin: -45 * a,
    };
  },

  // right arm jabs
  punch: (t) => {
    const e = Math.max(0, Math.sin(t * TAU * 1.8));
    return {
      lean: 6 * e,
      lArm: 40,
      lFore: 70,
      rArm: -35 - 55 * e,
      rFore: -100 * (1 - e),
      hipX: 14 * e,
    };
  },

  // knocked back, shaking
  hit: (t) => {
    const d = Math.exp(-t * 3);
    return {
      lean: -Math.sin(t * 40) * 10 * d - 6,
      hipX: Math.sin(t * 50) * 8 * d - 10,
      head: Math.sin(t * 45) * 8 * d,
      lArm: 50 + Math.sin(t * 30) * 12 * d,
      rArm: -50 - Math.sin(t * 30) * 12 * d,
      lFore: 25,
      rFore: -25,
    };
  },

  // falls to the left and stays down
  fall: (t) => {
    const p = ease(t / 0.6);
    return {
      lean: -82 * p,
      hipY: 70 * p,
      hipX: -50 * p,
      head: -12 * p,
      lArm: 14 + 100 * p,
      rArm: -14 - 40 * p,
      lLeg: 5 + 25 * p,
      rLeg: -5 - 15 * p,
    };
  },
};

export function poseAt(clip: ClipName, t: number, ctx: ClipContext): Pose {
  return {...BASE, ...CLIPS[clip](Math.max(0, t), ctx)};
}

/** linear blend between two poses (k=0 -> a, k=1 -> b) used for smooth clip changes */
export function blendPose(a: Pose, b: Pose, k: number): Pose {
  const out = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((key) => {
    out[key] = a[key] + (b[key] - a[key]) * k;
  });
  return out;
}
