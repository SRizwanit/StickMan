import React from 'react';
import {COLORS} from './theme';

/**
 * FACES - all facial expressions of the stick-man.
 * Drawn around the head centre (0,0). Head radius is 60.
 */
export type Expression =
  | 'neutral'
  | 'happy'
  | 'angry'
  | 'shock'
  | 'cry'
  | 'smug';

const ink = COLORS.ink;

export const Face: React.FC<{expression: Expression; frame: number}> = ({
  expression,
  frame,
}) => {
  // blink every ~3.2s for 4 frames
  const blink = frame % 96 < 4;
  const eyeRy = blink ? 1 : 7;
  const sw = 5;

  switch (expression) {
    case 'happy':
      return (
        <g fill="none" stroke={ink} strokeWidth={sw} strokeLinecap="round">
          <path d="M-32 -6 Q-23 -20 -14 -6" />
          <path d="M14 -6 Q23 -20 32 -6" />
          <path d="M-26 14 Q0 56 26 14 Z" fill={ink} />
          <path d="M-12 32 Q0 42 12 32" fill="#FF7B8A" stroke="none" />
        </g>
      );

    case 'angry':
      return (
        <g fill={ink} stroke={ink} strokeWidth={sw} strokeLinecap="round">
          <ellipse cx={-21} cy={-4} rx={6.5} ry={eyeRy - 1} />
          <ellipse cx={21} cy={-4} rx={6.5} ry={eyeRy - 1} />
          <line x1={-36} y1={-26} x2={-9} y2={-12} fill="none" />
          <line x1={36} y1={-26} x2={9} y2={-12} fill="none" />
          <path d="M-20 34 Q0 16 20 34" fill="none" />
        </g>
      );

    case 'shock':
      return (
        <g stroke={ink} strokeWidth={sw} strokeLinecap="round">
          <circle cx={-22} cy={-6} r={13} fill="#fff" />
          <circle cx={22} cy={-6} r={13} fill="#fff" />
          <circle cx={-22} cy={-6} r={4} fill={ink} />
          <circle cx={22} cy={-6} r={4} fill={ink} />
          <path d="M-38 -30 Q-22 -42 -8 -30" fill="none" />
          <path d="M8 -30 Q22 -42 38 -30" fill="none" />
          <ellipse cx={0} cy={32} rx={11} ry={16} fill={ink} />
        </g>
      );

    case 'cry': {
      const drop = ((frame * 5) % 60) / 60; // 0..1 falling loop
      return (
        <g fill="none" stroke={ink} strokeWidth={sw} strokeLinecap="round">
          <path d="M-32 -8 Q-23 4 -14 -8" />
          <path d="M14 -8 Q23 4 32 -8" />
          <path d="M-22 40 Q0 14 22 40 Z" fill={ink} />
          <g fill={COLORS.blue} stroke="none" opacity={1 - drop * 0.6}>
            <ellipse cx={-26} cy={4 + drop * 46} rx={5} ry={8} />
            <ellipse cx={26} cy={4 + ((drop + 0.5) % 1) * 46} rx={5} ry={8} />
          </g>
        </g>
      );
    }

    case 'smug':
      return (
        <g stroke={ink} strokeWidth={sw} strokeLinecap="round">
          <circle cx={-21} cy={-2} r={6.5} fill={ink} />
          <circle cx={21} cy={-2} r={6.5} fill={ink} />
          <line x1={-32} y1={-8} x2={-10} y2={-8} />
          <line x1={10} y1={-8} x2={32} y2={-8} />
          <path d="M-18 26 Q6 34 26 14" fill="none" />
        </g>
      );

    case 'neutral':
    default:
      return (
        <g fill={ink} stroke={ink} strokeWidth={sw} strokeLinecap="round">
          <ellipse cx={-21} cy={-4} rx={6.5} ry={eyeRy} />
          <ellipse cx={21} cy={-4} rx={6.5} ry={eyeRy} />
          <line x1={-14} y1={28} x2={14} y2={28} fill="none" />
        </g>
      );
  }
};
