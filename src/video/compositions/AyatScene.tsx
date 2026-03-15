import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';

interface Props {
  text: string;
}

export const AyatScene: React.FC<Props> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 80px',
        textAlign: 'center',
        color: 'white',
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 90,
          fontFamily: 'serif',
          lineHeight: 1.8,
          direction: 'rtl',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
