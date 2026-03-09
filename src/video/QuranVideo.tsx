import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Series,
  useVideoConfig,
} from 'remotion';
import { OpeningScene } from './compositions/OpeningScene';
import { AyatScene } from './compositions/AyatScene';
import { TranslationScene } from './compositions/TranslationScene';
import { ClosingScene } from './compositions/ClosingScene';
import { Background } from './compositions/Background';
import { ProgressBar } from './compositions/ProgressBar';
import { Watermark } from './compositions/Watermark';

export interface QuranVideoProps {
  surah: {
    id: number;
    name_simple: string;
    name_arabic: string;
  };
  verses: Array<{
    verse_number: number;
    text_uthmani: string;
    translation: string;
    audio_url: string;
    durationInFrames: number;
  }>;
  watermark: string;
}

export const QuranVideo: React.FC<QuranVideoProps> = ({ surah, verses, watermark }) => {
  const { fps } = useVideoConfig();

  const openingDuration = 3 * fps;
  const closingDuration = 4 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: 'sans-serif' }}>
      <Background />
      <Watermark text={watermark} />
      <ProgressBar />

      <Series>
        <Series.Sequence durationInFrames={openingDuration}>
          <OpeningScene
            surahName={surah.name_simple}
            surahArabic={surah.name_arabic}
          />
        </Series.Sequence>

        {verses.map((verse, index) => (
          <Series.Sequence
            key={verse.verse_number}
            durationInFrames={verse.durationInFrames}
          >
            <AyatScene text={verse.text_uthmani} />
            <TranslationScene text={verse.translation} />
            <Audio src={verse.audio_url} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={closingDuration}>
          <ClosingScene
            surahName={surah.name_simple}
            startVerse={verses[0]?.verse_number}
            endVerse={verses[verses.length - 1]?.verse_number}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
