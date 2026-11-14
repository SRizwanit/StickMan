import React, {ReactNode} from 'react';
import {Pose} from './Poses';
import {Expression, Face} from './Faces';
import {COLORS} from './theme';

/**
 * STICKMAN - the rigged character (pure drawing, no timeline logic).
 * Give it a Pose + Expression and it draws itself as an SVG,
 * centred on the hip, with a "boiling line" hand-drawn wobble.
 *
 * Skeleton (px): torso 140, upper-arm 82, fore-arm 76, thigh 98, shin 98, head r=60
 */
export const TORSO = 140;
export const UPPER = 82;
export const FORE = 76;
export const THIGH = 98;
export const SHIN = 98;
export const HEAD_R = 60;
const SHOULDER_Y = -118;

export type Accessory = 'none' | 'headphones' | 'hair' | 'cap';

export type StickmanProps = {
  uid: string; // unique per character (SVG filter id)
  pose: Pose;
  expression: Expression;
  frame: number;
  accessory?: Accessory;
  leftHand?: ReactNode; // drawn at the end of the screen-left forearm
  rightHand?: ReactNode; // drawn at the end of the screen-right forearm
  strokeWidth?: number;
  wobble?: boolean;
};

const ink = COLORS.ink;

const Accessories: React.FC<{type: Accessory}> = ({type}) => {
  switch (type) {
    case 'headphones':
      return (
        <g fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round">
          <path d="M-60 -2 A60 60 0 0 1 60 -2" />
          <rect x={-70} y={-16} width={20} height={42} rx={9} fill={COLORS.red} />
          <rect x={50} y={-16} width={20} height={42} rx={9} fill={COLORS.red} />
        </g>
      );
    case 'hair':
      return (
        <g fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round">
          <path d="M-8 -60 Q-22 -88 -34 -78" />
          <path d="M2 -61 Q4 -96 -6 -104" />
          <path d="M14 -59 Q32 -88 46 -76" />
        </g>
      );
    case 'cap':
      return (
        <g stroke={ink} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
          <path d="M-58 -22 A58 58 0 0 1 58 -22 Z" fill={COLORS.blue} />
          <path d="M-8 -26 L72 -26 Q76 -14 62 -14 L-8 -14 Z" fill={COLORS.blue} />
        </g>
      );
    default:
      return null;
  }
};

export const Stickman: React.FC<StickmanProps> = ({
  uid,
  pose: p,
  expression,
  frame,
  accessory = 'none',
  leftHand,
  rightHand,
  strokeWidth = 7,
  wobble = true,
}) => {
  const seed = (Math.floor(frame / 3) % 7) + 1; // new noise every 3 frames
  const filterId = `wob-${uid}`;

  return (
    <svg
      width={700}
      height={900}
      viewBox="-350 -450 700 900"
      style={{overflow: 'visible', display: 'block'}}
    >
      {wobble && (
        <defs>
          <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="2"
              seed={seed}
              result="n"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="n"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      )}

      <g filter={wobble ? `url(#${filterId})` : undefined}>
        <g
          transform={`translate(${p.hipX} ${p.hipY})`}
          stroke={ink}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* LEFT LEG (screen-left) */}
          <g transform={`rotate(${p.lLeg})`}>
            <line y2={THIGH} />
            <g transform={`translate(0 ${THIGH}) rotate(${p.lShin})`}>
              <line y2={SHIN} />
              <line x1={0} y1={SHIN} x2={-24} y2={SHIN + 2} />
            </g>
          </g>
          {/* RIGHT LEG */}
          <g transform={`rotate(${p.rLeg})`}>
            <line y2={THIGH} />
            <g transform={`translate(0 ${THIGH}) rotate(${p.rShin})`}>
              <line y2={SHIN} />
              <line x1={0} y1={SHIN} x2={24} y2={SHIN + 2} />
            </g>
          </g>

          {/* TORSO + ARMS + HEAD */}
          <g transform={`rotate(${p.lean})`}>
            <line y1={0} y2={-TORSO} />

            <g transform={`translate(0 ${SHOULDER_Y}) rotate(${p.lArm})`}>
              <line y2={UPPER} />
              <g transform={`translate(0 ${UPPER}) rotate(${p.lFore})`}>
                <line y2={FORE} />
                {leftHand && <g transform={`translate(0 ${FORE})`}>{leftHand}</g>}
              </g>
            </g>

            <g transform={`translate(0 ${SHOULDER_Y}) rotate(${p.rArm})`}>
              <line y2={UPPER} />
              <g transform={`translate(0 ${UPPER}) rotate(${p.rFore})`}>
                <line y2={FORE} />
                {rightHand && <g transform={`translate(0 ${FORE})`}>{rightHand}</g>}
              </g>
            </g>

            {/* HEAD */}
            <g transform={`translate(0 ${-TORSO}) rotate(${p.head})`}>
              <g transform={`translate(0 ${-HEAD_R + 4})`}>
                <circle r={HEAD_R} fill="#fff" />
                <Face expression={expression} frame={frame} />
                <Accessories type={accessory} />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
