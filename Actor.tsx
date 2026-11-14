import React from 'react';
import {Easing, interpolate} from 'remotion';
import {blendPose, ClipName, poseAt} from './Poses';
import {Expression} from './Faces';
import {Accessory, Stickman, THIGH, SHIN} from './Stickman';
import {Mic} from './Props';
import {COLORS, FONT_BN} from './theme';

/**
 * ACTOR - puts a Stickman on the timeline.
 * Reads a CharacterTrack (see scenes.ts): where he is at each frame,
 * which clip he plays, which face he wears, and blends smoothly
 * between two consecutive clips.
 */
export type Action = {
  from: number;
  to: number;
  clip: ClipName;
  face: Expression;
};

export type CharacterTrack = {
  id: string;
  label: string; // name tag above the head
  labelColor?: string;
  accessory?: Accessory;
  mic?: boolean;
  flip?: boolean; // mirror the character (faces left)
  groundY: number; // y of the hip when standing
  scale: number;
  x: {f: number; v: number}[]; // x keyframes (px, hip centre)
  actions: Action[];
};

const BLEND_FRAMES = 6;
const FPS = 30;

export const Actor: React.FC<{track: CharacterTrack; frame: number}> = ({
  track,
  frame,
}) => {
  const ctx = {holdingMic: !!track.mic};
  const idx = Math.max(
    0,
    track.actions.findIndex((a) => frame >= a.from && frame < a.to)
  );
  const cur = track.actions[idx];
  const prev = idx > 0 ? track.actions[idx - 1] : null;

  const tNow = (frame - cur.from) / FPS;
  let pose = poseAt(cur.clip, tNow, ctx);
  if (prev) {
    const k = Math.min((frame - cur.from) / BLEND_FRAMES, 1);
    if (k < 1) {
      const prevPose = poseAt(prev.clip, (prev.to - prev.from) / FPS, ctx);
      pose = blendPose(prevPose, pose, k);
    }
  }

  const x = interpolate(
    frame,
    track.x.map((k) => k.f),
    track.x.map((k) => k.v),
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }
  );

  const s = track.scale;
  const sx = track.flip ? -1 : 1;
  const feetY = track.groundY + (THIGH + SHIN) * s;
  // shadow shrinks while the body is in the air
  const air = Math.min(Math.max(-pose.hipY / 80, 0), 1);

  return (
    <>
      {/* ground shadow */}
      <div
        style={{
          position: 'absolute',
          left: x - 130 * s,
          top: feetY - 14 * s,
          width: 260 * s,
          height: 30 * s,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.13)',
          transform: `scale(${1 - air * 0.45})`,
        }}
      />
      {/* character */}
      <div
        style={{
          position: 'absolute',
          left: x - 350,
          top: track.groundY - 450,
          width: 700,
          height: 900,
          transform: `scale(${s * sx}, ${s})`,
          transformOrigin: '350px 450px',
        }}
      >
        <Stickman
          uid={track.id}
          pose={pose}
          expression={cur.face}
          frame={frame}
          accessory={track.accessory}
          rightHand={track.mic ? <Mic /> : undefined}
        />
      </div>
      {/* name tag (never mirrored) */}
      <div
        style={{
          position: 'absolute',
          left: x - 200 + pose.hipX * s * sx,
          width: 400,
          top: track.groundY + (pose.hipY - 256) * s - 72,
          textAlign: 'center',
          fontFamily: FONT_BN,
          fontWeight: 700,
          fontSize: 40,
          color: track.labelColor ?? COLORS.purple,
          WebkitTextStroke: '8px #fff',
          paintOrder: 'stroke fill',
          letterSpacing: 1,
        }}
      >
        {track.label}
      </div>
    </>
  );
};
