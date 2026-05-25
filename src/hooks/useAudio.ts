import { useGameStore } from '../store/useGameStore';
import { playSFX } from '../utils/audioManager';

export const useAudio = () => {
  const isMuted = useGameStore((state) => state.isMuted);

  return {
    playFlip: () => playSFX('flip', isMuted),
    playWin: () => playSFX('win', isMuted),
    playLose: () => playSFX('lose', isMuted),
    playTouch: () => playSFX('touch', isMuted),
  };
};