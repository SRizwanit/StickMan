import React from 'react';
import {COLORS} from './theme';

/**
 * PROPS - things a stick-man can hold.
 * Every prop is drawn in "hand space": origin = the hand, the forearm
 * points toward +Y, so the prop continues in the arm's direction.
 */
const ink = COLORS.ink;
const sw = 5;

export const Mic: React.FC = () => (
  <g stroke={ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x={-8} y={-16} width={16} height={52} rx={8} fill="#3b3b3b" />
    <circle cx={0} cy={54} r={22} fill="#d9d9d9" />
    <path d="M-22 54 H22 M0 32 V76 M-15 40 Q0 54 -15 68 M15 40 Q0 54 15 68" fill="none" strokeWidth={2.5} />
  </g>
);

export const FlagBD: React.FC = () => (
  <g strokeLinecap="round">
    <line x1={0} y1={-10} x2={0} y2={150} stroke={ink} strokeWidth={sw} />
    <rect x={0} y={0} width={96} height={60} fill="#006A4E" stroke={ink} strokeWidth={3} />
    <circle cx={42} cy={30} r={18} fill="#F42A41" />
  </g>
);

export const FlagIN: React.FC = () => (
  <g strokeLinecap="round">
    <line x1={0} y1={-10} x2={0} y2={150} stroke={ink} strokeWidth={sw} />
    <rect x={0} y={0} width={96} height={20} fill="#FF9933" />
    <rect x={0} y={20} width={96} height={20} fill="#FFFFFF" />
    <rect x={0} y={40} width={96} height={20} fill="#138808" />
    <rect x={0} y={0} width={96} height={60} fill="none" stroke={ink} strokeWidth={3} />
    <circle cx={48} cy={30} r={7} fill="none" stroke="#000080" strokeWidth={2.5} />
  </g>
);

export const Sword: React.FC = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <line x1={-18} y1={0} x2={18} y2={0} stroke={ink} strokeWidth={8} />
    <line x1={0} y1={0} x2={0} y2={150} stroke="#1B3FD1" strokeWidth={10} />
    <line x1={0} y1={0} x2={0} y2={-30} stroke={ink} strokeWidth={9} />
  </g>
);

export const Shield: React.FC = () => (
  <g stroke={ink} strokeWidth={4}>
    <ellipse cx={0} cy={28} rx={30} ry={38} fill={COLORS.red} />
    <ellipse cx={0} cy={28} rx={14} ry={20} fill="#fff" opacity={0.35} />
  </g>
);
