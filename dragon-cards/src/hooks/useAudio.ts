import { useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useAudio = () => {
  const isMuted = useGameStore((state) => state.isMuted);

  const playSound = useCallback((soundName: string) => {
    if (isMuted) return;
    
    // Можна використовувати локальні файли або лінки з мережі
    // Для тесту можна замінити на будь-який URL mp3
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.4;
    audio.play().catch(() => {
      // Ігноруємо помилку, якщо файл не знайдено або браузер блокує звук
    });
  }, [isMuted]);

  return {
    playClick: () => playSound('click'),
    playFlip: () => playSound('flip'),
    playWin: () => playSound('win'),
    playLose: () => playSound('lose'),
    playShuffle: () => playSound('shuffle'),
  };
};