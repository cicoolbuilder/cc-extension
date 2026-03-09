import express from 'express';
import { Queue } from 'bullmq';
import path from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const connection = {
  host: '127.0.0.1',
  port: 6379,
};

const renderQueue = new Queue('render-queue', { connection });

app.use(express.json());
app.use('/videos', express.static(path.resolve('public/videos')));

app.get('/api/generate-quran-video', async (req, res) => {
  try {
    const jobId = uuidv4();
    await renderQueue.add('render-job', { jobId }, { jobId });

    res.json({
      status: 'processing',
      job_id: jobId,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/video-status/:job_id', async (req, res) => {
  const { job_id } = req.params;
  const job = await renderQueue.getJob(job_id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const state = await job.getState();

  if (state === 'completed') {
    return res.json({
      status: 'completed',
      video_url: `${process.env.BASE_URL}${job.returnvalue}`,
    });
  } else if (state === 'failed') {
    return res.json({
      status: 'failed',
      error: job.failedReason,
    });
  } else {
    return res.json({
      status: 'processing',
    });
  }
});

app.listen(port, () => {
  console.log(`API Server listening at http://localhost:${port}`);
});
