import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, RiskLevel, DragonCard } from '../types/game';
import { RISK_LEVELS, DRAGON_TYPES, MAX_BET } from '../config/gameConfig';
import { playSFX, manageBGMusic } from '../utils/audioManager';

// [Audit #3] Чесний рандом Fisher-Yates
const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

interface GameActions extends GameState {
  setBet: (amount: number) => void;
  setRisk: (risk: RiskLevel) => void;
  placeBet: () => void;
  handleCardClick: (index: number) => void;
  confirmReveal: () => Promise<void>;
  reset: () => void;
  generateInitialCards: () => void;
  toggleMute: () => void;
}

export const useGameStore = create<GameActions>()(
  persist((set, get) => {
    const genMultipliers = (risk: RiskLevel) => {
      const config = RISK_LEVELS[risk];
      let vals: (number | "LOST")[] = Array(config.lost).fill("LOST");
      while (vals.length < 6) {
        vals.push(config.multipliers[Math.floor(Math.random() * config.multipliers.length)]);
      }
      return shuffle(vals);
    };

    const genDragons = () => shuffle([...DRAGON_TYPES]).map(d => ({
      id: Math.random().toString(36).substr(2, 9),
      type: d.type,
      image: d.img,
      isRevealed: false,
      multiplier: 1
    }));

    return {
      balance: 100000, betAmount: 1, risk: 'medium', status: 'idle',
      topCards: [], bottomCards: [], revealedCount: 0, isMuted: false,
      selectedCardIndex: null, activePosition: null, matchedIndices: [],
      slotMultipliers: [],

      generateInitialCards: () => {
        const r = get().risk;
        set({ topCards: genDragons(), bottomCards: genDragons(), slotMultipliers: genMultipliers(r) });
      },

      setBet: (val) => {
        if (get().status !== 'idle' && get().status !== 'result') return;
        playSFX('touch', get().isMuted);
        set({ betAmount: Math.min(Math.max(1, val || 0), MAX_BET, get().balance) });
      },

      setRisk: (risk) => {
        // [Audit #5] Захист від зміни ризику під час гри
        if (get().status !== 'idle') return;
        playSFX('touch', get().isMuted);
        set({ risk, slotMultipliers: genMultipliers(risk) });
        get().generateInitialCards();
      },

      handleCardClick: (index) => {
        const { status, selectedCardIndex, bottomCards, isMuted } = get();
        if (status !== 'arranging') return;
        playSFX('touch', isMuted);
        if (selectedCardIndex === null) set({ selectedCardIndex: index });
        else {
          if (selectedCardIndex === index) { set({ selectedCardIndex: null }); return; }
          const newBottom = [...bottomCards];
          [newBottom[selectedCardIndex], newBottom[index]] = [newBottom[index], newBottom[selectedCardIndex]];
          set({ bottomCards: newBottom, selectedCardIndex: null });
        }
      },

      placeBet: () => {
        const { balance, betAmount, isMuted, status } = get();
        if (status !== 'idle' || balance < betAmount) return;
        manageBGMusic(isMuted);
        playSFX('opening', isMuted);
        set({ balance: balance - betAmount, status: 'arranging', revealedCount: 0, matchedIndices: [], selectedCardIndex: null });
      },

      confirmReveal: async () => {
        // [Audit #4] Захист від повторного кліку
        if (get().status !== 'arranging') return;

        set({ status: 'revealing', selectedCardIndex: null });
        const { isMuted, topCards, bottomCards, betAmount, balance, slotMultipliers } = get();
        
        for (let i = 1; i <= 6; i++) {
          await new Promise(r => setTimeout(r, 450));
          set({ revealedCount: i });
          playSFX('flip', isMuted);
        }

        const matches: number[] = [];
        let hasWin = false, hasLost = false, totalWin = 0;

        topCards.forEach((tc, i) => {
          if (tc.type === bottomCards[i].type) {
            matches.push(i);
            const m = slotMultipliers[i];
            if (m === 'LOST') hasLost = true;
            else { hasWin = true; totalWin += betAmount * (m as number); }
          }
        });

        setTimeout(() => {
          let finalPayout = 0;
          // [Audit #6] Логіка повернення ставки (Push)
          if (hasWin && hasLost) finalPayout = betAmount; 
          else if (hasWin) finalPayout = totalWin;

          if (hasWin) playSFX('win', isMuted);
          else if (hasLost || matches.length === 0) playSFX('lose', isMuted);

          set({ status: 'result', balance: balance + finalPayout, matchedIndices: matches });
        }, 500);
      },

      reset: () => {
        if (get().status !== 'result') return;
        playSFX('touch', get().isMuted);
        set({ status: 'idle', revealedCount: 0, matchedIndices: [], selectedCardIndex: null });
        get().generateInitialCards();
      },

      toggleMute: () => {
        const newM = !get().isMuted;
        set({ isMuted: newM });
        manageBGMusic(newM);
      }
    };
  }, { name: 'dragon-game-final-prod-v1' })
);