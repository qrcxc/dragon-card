import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '../../store/useGameStore';
import { Card } from '../Card/Card';
import { SoundToggle } from '../shared/SoundToggle';

export const GameField: React.FC = () => {
  const { topCards, bottomCards, status, revealedCount, selectedCardIndex, matchedIndices, slotMultipliers } = useGameStore(
    useShallow((s) => ({
      topCards: s.topCards,
      bottomCards: s.bottomCards,
      status: s.status,
      revealedCount: s.revealedCount,
      selectedCardIndex: s.selectedCardIndex,
      matchedIndices: s.matchedIndices,
      slotMultipliers: s.slotMultipliers
    }))
  );

  const { handleCardClick, confirmReveal, generateInitialCards } = useGameStore();

  useEffect(() => { if (topCards.length === 0) generateInitialCards(); }, [generateInitialCards, topCards.length]);

  return (
    <div className="w-full flex flex-col items-center py-6 lg:pt-24 px-4 lg:px-10 relative flex-1">
      <div className="absolute top-4 left-4 lg:hidden z-40"><SoundToggle /></div>
      <div className="hidden lg:block absolute top-8 left-8 z-40"><SoundToggle /></div>
      
      <div className="w-full max-w-5xl z-10">
        <div className="grid grid-cols-6 gap-1 lg:gap-4 mb-8 lg:mb-14">
          {topCards.map((tc, i) => (
            <div key={tc.id} className={`card-wrapper rounded-lg lg:rounded-xl transition-all duration-500 ${status === 'result' && matchedIndices.includes(i) ? (slotMultipliers[i] === 'LOST' ? 'lose-glow' : 'win-glow') : ''}`}>
              <Card card={tc} isRevealed={i < revealedCount || status === 'result'} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-1 lg:gap-4">
          {bottomCards.map((bc, i) => {
            const isMatched = status === 'result' && matchedIndices.includes(i);
            const isSelected = selectedCardIndex === i;
            const isLost = isMatched && slotMultipliers[i] === 'LOST';
            return (
              <div key={bc.id} className="flex flex-col items-center gap-3 lg:gap-6 cursor-pointer" onClick={() => handleCardClick(i)}>
                <div className={`w-full card-wrapper rounded-lg lg:rounded-xl transition-all duration-300 ${isSelected ? 'ring-2 lg:ring-4 ring-orange-500 scale-105 shadow-2xl' : ''} ${isMatched ? (isLost ? 'lose-glow' : 'win-glow') : ''}`}>
                  <Card card={bc} isRevealed={true} />
                </div>
                <div className={`bg-black/80 px-1 lg:px-5 py-1.5 lg:py-3 rounded sm:rounded-xl border border-white/5 w-full sm:min-w-[85px] text-center transition-all ${isMatched ? (isLost ? 'border-red-500 scale-110' : 'border-green-500 scale-110') : ''}`}>
                  <span className={`font-bebas text-[11px] lg:text-2xl tracking-widest leading-none ${isMatched ? (isLost ? 'text-red-500' : 'text-[#4ade80]') : 'text-white'}`}>
                    {slotMultipliers[i] === 'LOST' ? 'LOST' : `${slotMultipliers[i]}X`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {status === 'arranging' && (
        <button onClick={confirmReveal} className="mt-10 lg:mt-16 bg-accent-blue hover:bg-blue-500 px-12 lg:px-24 py-3 lg:py-4 rounded-xl font-black text-white text-sm lg:text-xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest">REVEAL CARDS</button>
      )}
    </div>
  );
};