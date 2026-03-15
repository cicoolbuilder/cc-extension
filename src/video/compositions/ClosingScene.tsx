import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';

interface Props {
  surahName: string;
  startVerse: number;
  endVerse: number;
}

export const ClosingScene: React.FC<Props> = ({ surahName, startVerse, endVerse }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        opacity,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 50, fontWeight: 'bold' }}>Qur'an Surah {surahName}</div>
      <div style={{ fontSize: 40, marginTop: 10 }}>Ayat {startVerse}{endVerse > startVerse ? ` - ${endVerse}` : ''}</div>
      <div
        style={{
          fontSize: 30,
          marginTop: 50,
          opacity: 0.7,
          fontStyle: 'italic',
        }}
      >
        Mishary Rashid Alafasy
      </div>
    </AbsoluteFill>
  );
};
