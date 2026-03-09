import path from 'path';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import fs from 'fs';

export class RenderService {
  private static bundlePath: string | null = null;

  static async getBundle() {
    if (this.bundlePath) return this.bundlePath;

    this.bundlePath = await bundle({
      entryPoint: path.resolve('src/video/index.tsx'),
    });
    return this.bundlePath;
  }

  static async render(jobId: string, inputProps: any): Promise<string> {
    const compositionId = 'QuranVideo';
    const bundlePath = await this.getBundle();

    const outputDir = path.resolve('public/videos');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputLocation = path.join(outputDir, `quran-video-${jobId}.mp4`);

    const fps = 30;
    const openingFrames = 3 * fps;
    const closingFrames = 4 * fps;
    const verseFrames = inputProps.verses.reduce((acc: number, v: any) => acc + v.durationInFrames, 0);
    const durationInFrames = openingFrames + verseFrames + closingFrames;

    const composition = await selectComposition({
      serveUrl: bundlePath,
      id: compositionId,
      inputProps,
    });

    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
        fps,
        width: 1080,
        height: 1920,
      },
      serveUrl: bundlePath,
      outputLocation,
      inputProps,
      codec: 'h264',
    });

    return `/videos/quran-video-${jobId}.mp4`;
  }
}
