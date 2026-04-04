import type { AudioPlayer } from 'expo-audio';

/**
 * Plays an audio player from the beginning and returns a Promise that resolves
 * when the audio finishes. Seeking to position 0 ensures the audio can replay
 * after having already been played once.
 *
 * A fallback timeout resolves the promise if `didJustFinish` is never fired
 * (e.g. very short sounds, native glitches).
 */
const playAndWait = (player: AudioPlayer): Promise<void> =>
  new Promise<void>((resolve) => {
    let settled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const done = () => {
      if (settled) return;
      settled = true;
      subscription.remove();
      if (timeoutId) clearTimeout(timeoutId);
      resolve();
    };

    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) done();
    });

    // Fallback: resolve after duration + 1 s buffer (minimum 10 s)
    const seekAndPlay = async () => {
      await player.seekTo(0);
      const durationMs = player.duration > 0 ? (player.duration + 1) * 1000 : 10_000;
      timeoutId = setTimeout(done, durationMs);
      player.play();
    };

    void seekAndPlay();
  });

/**
 * A sequential audio queue.  Each call to `play()` chains after the previous
 * one so that audios never overlap.  A single animation frame is awaited
 * before each play so the UI state change that triggered the sound has time
 * to render first.
 */
export type PlayAudio = (player: AudioPlayer) => Promise<void>;

export const createAudioQueue = (): PlayAudio => {
  let chain: Promise<void> = Promise.resolve();
  let subsequentPlays = 0;

  return (player: AudioPlayer): Promise<void> => {
    chain = chain
      .then(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())))
      .then(() => playAndWait(player))
      .catch((error) => {
        subsequentPlays++;
        console.error('Error in audio queue:', error, 'Subsequent plays:', subsequentPlays);
      });

    return chain;
  };
};
