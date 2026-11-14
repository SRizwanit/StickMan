import {loadFont as loadBangla} from '@remotion/google-fonts/HindSiliguri';
import {loadFont as loadComic} from '@remotion/google-fonts/Bangers';

// Fonts are fetched from Google Fonts at render time (GitHub runner has internet).
const bn = loadBangla('normal', {weights: ['700'], subsets: ['bengali', 'latin']});
const comic = loadComic('normal', {weights: ['400'], subsets: ['latin']});

export const FONT_BN = bn.fontFamily; // Bengali + Latin captions
export const FONT_COMIC = comic.fontFamily; // brand title

export const BRAND = 'RizwanTalks';
export const BRAND_A = 'Rizwan';
export const BRAND_B = 'Talks';

export const COLORS = {
  paper: '#FBF8F3',
  ink: '#111111',
  yellow: '#FFE600',
  red: '#E8202A',
  blue: '#1D8FE8',
  purple: '#6A1BFF',
  gray: '#EAEAEA',
};

// Canvas the whole video is designed on (9:16). HD/FHD/4K are exact multiples/fractions of it.
export const W = 1080;
export const H = 1920;
export const FPS = 30;
