import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {DURATION} from './scenes';
import {FPS, H, W} from './theme';

/**
 * Same video, three exact output sizes (all 9:16):
 *   Main-HD   720 x 1280
 *   Main-FHD 1080 x 1920
 *   Main-4K  2160 x 3840
 * The 1080x1920 design is scaled with a CSS transform, so every size is pixel-exact
 * (no rounding issues like --scale would have).
 */
const Scaled: React.FC<{scale: number}> = ({scale}) => (
  <div
    style={{
      width: W,
      height: H,
      transform: `scale(${scale})`,
      transformOrigin: '0 0',
    }}
  >
    <Video />
  </div>
);

const HD: React.FC = () => <Scaled scale={720 / W} />;
const FHD: React.FC = () => <Scaled scale={1} />;
const UHD: React.FC = () => <Scaled scale={2160 / W} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main-HD" component={HD} durationInFrames={DURATION} fps={FPS} width={720} height={1280} />
    <Composition id="Main-FHD" component={FHD} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
    <Composition id="Main-4K" component={UHD} durationInFrames={DURATION} fps={FPS} width={2160} height={3840} />
  </>
);
