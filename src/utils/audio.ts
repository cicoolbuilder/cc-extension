import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function getAudioDuration(url: string): Promise<number> {
  try {
    const { stdout } = await execPromise(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${url}"`
    );
    return parseFloat(stdout);
  } catch (error) {
    console.error(`Error getting duration for ${url}:`, error);
    return 5; // Fallback
  }
}
