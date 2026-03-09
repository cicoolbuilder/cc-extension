import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';

interface Props {
  surahName: string;
  surahArabic: string;
}

export const OpeningScene: React.FC<Props> = ({ surahName, surahArabic }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, 60], [0.8, 1], {
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
        transform: `scale(${scale})`,
        padding: '0 50px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 20 }}>{surahName}</div>
      <div style={{ fontSize: 80, fontFamily: 'serif' }}>{surahArabic}</div>
    </AbsoluteFill>
  );
};
