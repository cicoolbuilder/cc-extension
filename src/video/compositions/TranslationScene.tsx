import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';

interface Props {
  text: string;
}

export const TranslationScene: React.FC<Props> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [0, 20], [20, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 100px',
        textAlign: 'center',
        color: 'white',
        opacity,
        transform: `translateY(${translateY}px)`,
        marginTop: 350,
      }}
    >
      <div
        style={{
          fontSize: 40,
          fontFamily: 'sans-serif',
          lineHeight: 1.5,
          fontStyle: 'italic',
          color: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
