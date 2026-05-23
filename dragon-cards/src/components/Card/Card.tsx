import React from 'react';
import type { DragonCard } from '../../types/game';

interface Props {
  card: DragonCard;
  isRevealed: boolean;
}

export const Card: React.FC<Props> = ({ card, isRevealed }) => {
  return (
    <div className="relative w-full aspect-[1/1.6] [perspective:1000px]">
      <div className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] relative ${isRevealed ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#1a2230]">
          <img src="/backface.png" alt="back" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
          <img src={card.image} alt="front" className="w-full h-full object-cover brightness-110" />
        </div>
      </div>
    </div>
  );
};