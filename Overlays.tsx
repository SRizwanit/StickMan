import React from 'react';
import {Easing, interpolate, spring, useVideoConfig} from 'remotion';
import {BRAND, BRAND_A, BRAND_B, COLORS, FONT_BN, FONT_COMIC, H, W} from './theme';

/* ------------------------------------------------------------------ */
/* Paper background (static soft grain)                                */
/* ------------------------------------------------------------------ */
export const PaperBackground: React.FC = () => (
  <>
    <div style={{position: 'absolute', inset: 0, background: COLORS.paper}} />
    <svg
      width={W}
      height={H}
      style={{position: 'absolute', inset: 0, opacity: 0.12, mixBlendMode: 'multiply'}}
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  </>
);

/* ------------------------------------------------------------------ */
/* Caption: yellow box, words pop in one by one                        */
/* ------------------------------------------------------------------ */
export const Caption: React.FC<{
  text: string;
  frame: number; // frame relative to the caption start
  y: number;
}> = ({text, frame, y}) => {
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const boxIn = spring({frame, fps, config: {damping: 14, stiffness: 160}});

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: W,
        top: y,
        display: 'flex',
        justifyContent: 'center',
        transform: `scale(${0.6 + 0.4 * boxIn})`,
        opacity: boxIn,
      }}
    >
      <div
        style={{
          maxWidth: 940,
          padding: '20px 46px 26px',
          background: COLORS.yellow,
          borderRadius: 22,
          boxShadow: '0 8px 0 rgba(0,0,0,0.12)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 18px',
          fontFamily: FONT_BN,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.35,
          color: COLORS.ink,
        }}
      >
        {words.map((w, i) => {
          const p = spring({
            frame: frame - 4 - i * 5,
            fps,
            config: {damping: 11, stiffness: 190},
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 26}px) scale(${0.7 + 0.3 * p})`,
                opacity: Math.min(p * 1.5, 1),
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Brand title sticker (drops in with a bounce)                        */
/* ------------------------------------------------------------------ */
export const BrandTitle: React.FC<{frame: number; y: number}> = ({frame, y}) => {
  const {fps} = useVideoConfig();
  const drop = spring({frame, fps, config: {damping: 9, stiffness: 120, mass: 0.9}});
  const wob = Math.sin(frame / 7) * 1.2;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: W,
        top: y,
        display: 'flex',
        justifyContent: 'center',
        transform: `translateY(${(1 - drop) * -520}px) rotate(${-4 + wob}deg)`,
        opacity: frame < 0 ? 0 : 1,
      }}
    >
      <div
        style={{
          padding: '10px 46px 20px',
          background: '#fff',
          border: `10px solid ${COLORS.ink}`,
          borderRadius: 30,
          boxShadow: `14px 14px 0 ${COLORS.ink}`,
          fontFamily: FONT_COMIC,
          fontSize: 150,
          whiteSpace: 'nowrap',
          letterSpacing: 4,
          lineHeight: 1.05,
          color: COLORS.ink,
        }}
      >
        {BRAND_A}
        <span style={{color: COLORS.red}}>{BRAND_B}</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Corner watermark                                                    */
/* ------------------------------------------------------------------ */
export const Watermark: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      right: 36,
      top: 150,
      fontFamily: FONT_COMIC,
      fontSize: 46,
      letterSpacing: 2,
      color: 'rgba(0,0,0,0.38)',
    }}
  >
    {BRAND}
  </div>
);

/* ------------------------------------------------------------------ */
/* Subscribe / Follow loop (top-left, like the reference video)        */
/* cycle = 90 frames: Subscribe -> click -> Subscribed (+ bell)        */
/* ------------------------------------------------------------------ */
export const SUBSCRIBE_CYCLE = 90;
export const SUBSCRIBE_CLICK_AT = 40; // frame inside the cycle

const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
  <svg
    width={54}
    height={54}
    viewBox="0 0 24 24"
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `scale(${1 - press * 0.15})`,
    }}
  >
    <path
      d="M8 2c1 0 1.7.7 1.7 1.7V10l.9-.2c.9-.2 1.7.4 1.8 1.2l.9-.1c.9-.1 1.6.5 1.7 1.3l.7-.1c.9-.1 1.7.6 1.7 1.5v3c0 3-2.2 5.4-5.2 5.4h-1.8c-1.6 0-3-.7-3.9-2L5 15.8c-.5-.8-.3-1.700.5-2.100.6-.3 1.200-.2 1.700.2l.7.7V3.700C7.900 2.800 8.600 2 8 2z"
      fill="#fff"
      stroke="#111"
      strokeWidth={1.1}
      strokeLinejoin="round"
    />
  </svg>
);

export const SubscribeLoop: React.FC<{frame: number}> = ({frame}) => {
  const f = frame % SUBSCRIBE_CYCLE;
  const {fps} = useVideoConfig();

  const clicked = f >= SUBSCRIBE_CLICK_AT + 4;
  const pressK = interpolate(
    f,
    [SUBSCRIBE_CLICK_AT - 2, SUBSCRIBE_CLICK_AT + 2, SUBSCRIBE_CLICK_AT + 8],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const cursorX = interpolate(f, [0, SUBSCRIBE_CLICK_AT - 4], [150, 82], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const cursorY = interpolate(f, [0, SUBSCRIBE_CLICK_AT - 4], [110, 40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const bell = spring({
    frame: f - (SUBSCRIBE_CLICK_AT + 6),
    fps,
    config: {damping: 8, stiffness: 170},
  });
  const pulse = clicked ? 1 : 1 + Math.sin(f / 3) * 0.02;

  return (
    <div style={{position: 'absolute', left: 36, top: 140, width: 330, height: 150}}>
      {/* main button */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: 70,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderRadius: 14,
          background: clicked ? COLORS.gray : COLORS.red,
          color: clicked ? COLORS.ink : '#fff',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 700,
          fontSize: 34,
          transform: `scale(${pulse * (1 - pressK * 0.08)})`,
          transformOrigin: 'left center',
          boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
        }}
      >
        {clicked ? 'Subscribed' : '+ Subscribe'}
      </div>
      {/* bell */}
      <div
        style={{
          position: 'absolute',
          left: 236,
          top: 4,
          width: 62,
          height: 62,
          borderRadius: '50%',
          background: COLORS.red,
          transform: `scale(${clicked ? bell : 0})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={34} height={34} viewBox="0 0 24 24" fill="#fff">
          <path d="M12 22a2.2 2.2 0 0 0 2.2-2.2h-4.4A2.2 2.2 0 0 0 12 22zm6.6-6.2V11c0-3.2-1.7-5.800-4.600-6.500V3.800a2 2 0 0 0-4 0v.7C7.100 5.200 5.400 7.800 5.400 11v4.800L3.500 17.700V19h17v-1.300l-1.900-1.900z" />
        </svg>
      </div>
      {/* follow button */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 86,
          height: 44,
          padding: '0 22px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 10,
          background: clicked ? COLORS.gray : COLORS.blue,
          color: clicked ? COLORS.ink : '#fff',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 700,
          fontSize: 24,
        }}
      >
        {clicked ? 'Followed' : '+ Follow'}
      </div>
      <Cursor x={cursorX} y={cursorY} press={pressK} />
    </div>
  );
};
