import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Card } from '../Card/Card';
import { SoundToggle } from '../shared/SoundToggle';

export const GameField: React.FC = () => {
  const { topCards, bottomCards, status, revealedCount, handleCardClick, confirmReveal, generateInitialCards, selectedCardIndex, matchedIndices, slotMultipliers } = useGameStore();

  useEffect(() => { if (topCards.length === 0) generateInitialCards(); }, [generateInitialCards, topCards.length]);

  return (
    <div className="w-full flex flex-col items-center py-6 lg:py-20 px-2 sm:px-10 relative">
      {/* Звук на мобілці - в кутку */}
      <div className="absolute top-4 right-4 lg:hidden"><SoundToggle /></div>
      <div className="hidden lg:block absolute top-8 left-8"><SoundToggle /></div>

      <div className="w-full max-w-5xl">
        {/* ВЕРХНІЙ РЯД (6 карток в ряд завжди) */}
        <div className="grid grid-cols-6 gap-1 sm:gap-3 mb-8 sm:mb-14">
          {topCards.map((tc, i) => {
            const isMatched = status === 'result' && matchedIndices.includes(i);
            const isLost = isMatched && slotMultipliers[i] === 'LOST';
            return (
              <div key={tc.id} className={`transition-all duration-500 rounded-lg sm:rounded-xl ${isMatched ? (isLost ? 'lose-glow' : 'win-glow') : ''}`}>
                <Card card={tc} isRevealed={i < revealedCount || status === 'result'} />
              </div>
            );
          })}
        </div>

        {/* НИЖНІЙ РЯД */}
        <div className="grid grid-cols-6 gap-1 sm:gap-3">
          {bottomCards.map((bc, i) => {
            const isMatched = status === 'result' && matchedIndices.includes(i);
            const isSelected = selectedCardIndex === i;
            const isLost = isMatched && slotMultipliers[i] === 'LOST';
            const mValue = slotMultipliers[i];

            return (
              <div key={bc.id} className="flex flex-col items-center gap-2 sm:gap-6 cursor-pointer" onClick={() => handleCardClick(i)}>
                <div className={`w-full transition-all duration-300 rounded-lg sm:rounded-xl ${isSelected ? 'ring-2 lg:ring-4 ring-orange-500 scale-105' : ''} ${isMatched ? (isLost ? 'lose-glow' : 'win-glow') : ''}`}>
                  <Card card={bc} isRevealed={true} />
                </div>
                
                {/* МНОЖНИК (Менший на мобілках) */}
                <div className={`bg-black/80 px-1 sm:px-5 py-1.5 sm:py-3 rounded sm:rounded-xl border border-white/5 w-full sm:min-w-[85px] text-center transition-all ${isMatched ? (isLost ? 'border-red-500 scale-110' : 'border-green-500 scale-110') : ''}`}>
                  <span className={`font-bebas text-[10px] sm:text-2xl tracking-widest ${isMatched ? (isLost ? 'text-red-500' : 'text-[#4ade80]') : 'text-white'}`}>
                    {mValue === 'LOST' ? 'LOST' : `${mValue}X`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Кнопка Reveal по центру */}
      {status === 'arranging' && (
        <button onClick={confirmReveal} className="mt-8 sm:mt-16 bg-[#0066ff] hover:bg-blue-500 px-10 sm:px-24 py-3 sm:py-4 rounded-xl font-black text-white text-sm sm:text-xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest">
          REVEAL CARDS
        </button>
      )}
    </div>
  );
};