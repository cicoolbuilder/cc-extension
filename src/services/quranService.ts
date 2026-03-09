import axios from 'axios';

export interface Surah {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translation: string;
  audio_url: string;
}

const QURAN_API_BASE = 'https://api.quran.com/api/v4';

export class QuranService {
  private static cache: Map<string, any> = new Map();

  static async getAllSurahs(): Promise<Surah[]> {
    const cacheKey = 'all_surahs';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await axios.get(`${QURAN_API_BASE}/chapters?language=id`);
    const surahs = response.data.chapters.map((c: any) => ({
      id: c.id,
      name_simple: c.name_simple,
      name_arabic: c.name_arabic,
      verses_count: c.verses_count,
    }));

    this.cache.set(cacheKey, surahs);
    return surahs;
  }

  static async getVerses(surahId: number, startVerse: number, endVerse: number): Promise<Verse[]> {
    const cacheKey = `verses_${surahId}_${startVerse}_${endVerse}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const versesResponse = await axios.get(`${QURAN_API_BASE}/quran/verses/uthmani`, {
      params: { chapter_number: surahId }
    });

    const translationResponse = await axios.get(`${QURAN_API_BASE}/quran/translations/33`, {
        params: { chapter_number: surahId }
    });

    const allVerses = versesResponse.data.verses;
    const allTranslations = translationResponse.data.translations;

    const result: Verse[] = [];

    for (let vNum = startVerse; vNum <= endVerse; vNum++) {
      const verseKey = `${surahId}:${vNum}`;
      const v = allVerses.find((item: any) => item.verse_key === verseKey);
      const translation = allTranslations[vNum - 1];
      const audioUrl = await this.getVerseAudio(verseKey);

      if (v) {
        result.push({
          id: v.id,
          verse_number: vNum,
          verse_key: verseKey,
          text_uthmani: v.text_uthmani,
          translation: translation ? translation.text : '',
          audio_url: audioUrl,
        });
      }
    }

    this.cache.set(cacheKey, result);
    return result;
  }

  static async getVerseAudio(verseKey: string): Promise<string> {
    try {
      const response = await axios.get(`${QURAN_API_BASE}/recitations/7/by_ayah/${verseKey}`);
      if (response.data.audio_files && response.data.audio_files.length > 0) {
        let url = response.data.audio_files[0].url;
        if (!url.startsWith('http')) {
          url = `https://audio.qurancdn.com/${url}`;
        }
        return url;
      }
    } catch (e) {
      console.error(`Failed to fetch audio for ${verseKey}`);
    }
    return '';
  }

  static async getRandomVerses(): Promise<{ surah: Surah; verses: Verse[] }> {
    const surahs = await this.getAllSurahs();
    const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];

    const count = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const maxStart = Math.max(1, randomSurah.verses_count - count + 1);
    const startVerse = Math.floor(Math.random() * maxStart) + 1;
    const endVerse = Math.min(randomSurah.verses_count, startVerse + count - 1);

    const verses = await this.getVerses(randomSurah.id, startVerse, endVerse);

    return {
      surah: randomSurah,
      verses,
    };
  }
}
