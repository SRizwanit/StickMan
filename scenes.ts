/**
 * SCENES - everything you edit to change the video lives here.
 * Frames are at 30 fps (30 frames = 1 second).
 */
import {CharacterTrack} from './Actor';
import {SfxName} from './sfx';
import {SUBSCRIBE_CLICK_AT, SUBSCRIBE_CYCLE} from './Overlays';

export const DURATION = 390; // 13 seconds

export const CHARACTERS: CharacterTrack[] = [
  {
    id: 'rizwan',
    label: 'Rizwan',
    labelColor: '#6A1BFF',
    accessory: 'headphones',
    mic: true,
    groundY: 980,
    scale: 1.15,
    x: [
      {f: 0, v: -260},
      {f: 60, v: 300},
    ],
    actions: [
      {from: 0, to: 60, clip: 'walk', face: 'happy'},
      {from: 60, to: 150, clip: 'wave', face: 'happy'},
      {from: 150, to: 270, clip: 'cheer', face: 'happy'},
      {from: 270, to: DURATION, clip: 'idle', face: 'happy'},
    ],
  },
  {
    id: 'friend',
    label: 'বন্ধু',
    labelColor: '#1D8FE8',
    accessory: 'hair',
    flip: true,
    groundY: 980,
    scale: 1.15,
    x: [
      {f: 15, v: 1380},
      {f: 75, v: 770},
    ],
    actions: [
      {from: 0, to: 75, clip: 'walk', face: 'neutral'},
      {from: 75, to: 100, clip: 'idle', face: 'shock'},
      {from: 100, to: 170, clip: 'wave', face: 'happy'},
      {from: 170, to: 270, clip: 'jump', face: 'happy'},
      {from: 270, to: DURATION, clip: 'idle', face: 'smug'},
    ],
  },
];

export const CAPTIONS = [
  {from: 72, to: 150, text: 'আসসালামু আলাইকুম,'},
  {from: 150, to: DURATION, text: 'ওয়েলকাম টু রিজওয়ান টক্স।'},
];

export const BRAND_IN = 150; // frame the RizwanTalks sticker drops in
export const CAPTION_Y = 1300;
export const BRAND_Y = 320;

export type SfxCue = {at: number; name: SfxName; volume?: number};

const subscribeClicks: SfxCue[] = [];
for (let c = 0; c * SUBSCRIBE_CYCLE + SUBSCRIBE_CLICK_AT + 2 < DURATION; c++) {
  subscribeClicks.push({
    at: c * SUBSCRIBE_CYCLE + SUBSCRIBE_CLICK_AT + 2,
    name: 'click',
    volume: 0.5,
  });
}

export const SFX_CUES: SfxCue[] = [
  {at: 0, name: 'whoosh', volume: 0.7},
  {at: 15, name: 'whoosh', volume: 0.5},
  {at: 60, name: 'thud', volume: 0.5},
  {at: 75, name: 'pop', volume: 0.8}, // friend notices
  {at: 76, name: 'pop', volume: 0.9}, // "আসসালামু আলাইকুম,"
  {at: 150, name: 'boing', volume: 0.8}, // brand sticker drops
  {at: 160, name: 'ding', volume: 0.7},
  {at: 166, name: 'pop', volume: 0.9}, // second caption
  {at: 180, name: 'boing', volume: 0.6}, // friend jump
  {at: 214, name: 'boing', volume: 0.5},
  {at: 270, name: 'tada', volume: 0.7},
  ...subscribeClicks,
];
