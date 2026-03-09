import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 1000], [1, 1.2], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0c1410',
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle, rgba(20,40,30,1) 0%, rgba(10,20,15,1) 100%)',
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.1,
          backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </AbsoluteFill>
  );
};
