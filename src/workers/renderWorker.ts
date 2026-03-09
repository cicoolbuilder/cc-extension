import { Worker } from 'bullmq';
import { QuranService } from '../services/quranService';
import { RenderService } from '../services/renderService';
import { getAudioDuration } from '../utils/audio';
import dotenv from 'dotenv';

dotenv.config();

const connection = {
  host: '127.0.0.1',
  port: 6379,
};

const worker = new Worker(
  'render-queue',
  async (job) => {
    const { jobId } = job.data;
    console.log(`[Worker] Starting job: ${jobId}`);

    try {
      console.log(`[Worker] Fetching Quran data...`);
      const { surah, verses } = await QuranService.getRandomVerses();

      const fps = 30;
      const versesWithDuration = await Promise.all(
        verses.map(async (v) => {
          let duration = 5;
          if (v.audio_url) {
            duration = await getAudioDuration(v.audio_url);
          }
          return {
            ...v,
            durationInFrames: Math.ceil(duration * fps),
          };
        })
      );

      const inputProps = {
        surah,
        verses: versesWithDuration,
        watermark: 'AL-QURAN DIGITAL',
      };

      console.log(`[Worker] Rendering video...`);
      const videoUrl = await RenderService.render(jobId, inputProps);

      console.log(`[Worker] Job ${jobId} completed!`);
      return videoUrl;
    } catch (error: any) {
      console.error(`[Worker] Job ${jobId} failed:`, error.message);
      throw error;
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`[Worker] ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`[Worker] ${job?.id} has failed with ${err.message}`);
});

console.log('[Worker] Render worker started...');
