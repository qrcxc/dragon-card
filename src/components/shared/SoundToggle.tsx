import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const SoundToggle: React.FC = () => {
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleMute = useGameStore((state) => state.toggleMute);

  return (
    <button 
      onClick={toggleMute}
      className="p-2.5 bg-sidebar-bg/50 rounded-lg border border-white/5 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
      title={isMuted ? "Увімкнути звук" : "Вимкнути звук"}
    >
      {isMuted ? (
        <span className="text-xl">🔇</span>
      ) : (
        <span className="text-xl">🔊</span>
      )}
    </button>
  );
};