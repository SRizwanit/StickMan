import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import bgAudio from './audio-bg';
import {SFX} from './sfx';
import {Actor} from './Actor';
import {
  BrandTitle,
  Caption,
  PaperBackground,
  SubscribeLoop,
  Watermark,
} from './Overlays';
import {
  BRAND_IN,
  BRAND_Y,
  CAPTION_Y,
  CAPTIONS,
  CHARACTERS,
  DURATION,
  SFX_CUES,
} from './scenes';
import {H, W} from './theme';

/**
 * The whole video, designed on a 1080x1920 canvas.
 * HD / FHD / 4K compositions (Root.tsx) just scale this canvas.
 */
export const Video: React.FC = () => {
  const frame = useCurrentFrame();

  const caption = [...CAPTIONS].reverse().find((c) => frame >= c.from && frame < c.to);

  return (
    <AbsoluteFill style={{width: W, height: H, overflow: 'hidden'}}>
      <PaperBackground />

      {/* optional background sound: only if audio.mp3 existed at render time */}
      {bgAudio ? (
        <Audio
          src={bgAudio}
          loop
          volume={(f) =>
            0.35 *
            interpolate(f, [0, 20, DURATION - 30, DURATION], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      ) : null}

      {/* sound effects */}
      {SFX_CUES.map((c, i) => (
        <Sequence key={i} from={c.at}>
          <Audio src={SFX[c.name]} volume={c.volume ?? 0.8} />
        </Sequence>
      ))}

      <Watermark />
      <SubscribeLoop frame={frame} />

      {frame >= BRAND_IN && <BrandTitle frame={frame - BRAND_IN} y={BRAND_Y} />}

      {CHARACTERS.map((t) => (
        <Actor key={t.id} track={t} frame={frame} />
      ))}

      {caption && (
        <Caption
          key={caption.text}
          text={caption.text}
          frame={frame - caption.from}
          y={CAPTION_Y}
        />
      )}
    </AbsoluteFill>
  );
};
