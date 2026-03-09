import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { QuranVideo, QuranVideoProps } from './QuranVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QuranVideo"
        component={QuranVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          surah: {
            id: 1,
            name_simple: 'Al-Fatihah',
            name_arabic: 'الفاتحة',
          },
          verses: [],
          watermark: 'AL-QURAN DIGITAL',
        } as QuranVideoProps}
      />
    </>
  );
};

registerRoot(RemotionRoot);
