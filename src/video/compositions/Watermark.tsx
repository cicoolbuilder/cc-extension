import React from 'react';

export const Watermark: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        right: 80,
        color: 'white',
        opacity: 0.6,
        fontSize: 30,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: 'sans-serif',
      }}
    >
      {text}
    </div>
  );
};
