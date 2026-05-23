import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RiskLevel, DragonCard, GameState } from '../types/game';
import { RISK_LEVELS, DRAGON_TYPES, MAX_BET } from '../config/gameConfig';
import { playSFX, manageBGMusic } from '../utils/audioManager';

interface GameActions extends GameState {
  setBet: (amount: number) => void;
  setRisk: (risk: RiskLevel) => void;
  placeBet: () => void;
  handleCardClick: (index: number) => void;
  confirmReveal: () => Promise<void>;
  reset: () => void;
  generateInitialCards: () => void;
  toggleMute: () => void;
  slotMultipliers: (number | 'LOST')[];
}

export const useGameStore = create<GameActions>()(
  persist((set, get) => {
    // Генерація тільки картинок драконів
    const genDragons = () => [...DRAGON_TYPES].sort(() => Math.random() - 0.5).map(d => ({
      id: Math.random().toString(36).substr(2, 9),
      type: d.type, image: d.img, isRevealed: false, multiplier: 1
    }));

    // Генерація тільки множників (іксів)
    const genMultipliers = (risk: RiskLevel) => {
      const config = RISK_LEVELS[risk];
      let vals: (number | "LOST")[] = Array(config.lost).fill("LOST");
      while (vals.length < 6) {
        const randomMult = config.multipliers[Math.floor(Math.random() * config.multipliers.length)];
        vals.push(randomMult);
      }
      return vals.sort(() => Math.random() - 0.5);
    };

    return {
      balance: 100000, betAmount: 1, risk: 'medium', status: 'idle',
      topCards: [], bottomCards: [], revealedCount: 0, isMuted: false,
      selectedCardIndex: null, activePosition: null, matchedIndices: [],
      slotMultipliers: [],

      // Створення початкового стану
      generateInitialCards: () => {
        const risk = get().risk;
        set({ 
          topCards: genDragons(), 
          bottomCards: genDragons(), 
          slotMultipliers: genMultipliers(risk) 
        });
      },

      setBet: (val) => { 
        playSFX('touch', get().isMuted); 
        set({ betAmount: Math.min(Math.max(1, val || 0), MAX_BET, get().balance) }); 
      },

      setRisk: (risk) => {
        playSFX('touch', get().isMuted);
        // При зміні ризику генеруємо НОВІ ікси, щоб гравець бачив їх перед ставкою
        set({ risk, slotMultipliers: genMultipliers(risk) });
      },

      handleCardClick: (index: number) => {
        const { status, selectedCardIndex, bottomCards, isMuted } = get();
        if (status !== 'arranging') return;
        playSFX('touch', isMuted);
        if (selectedCardIndex === null) {
          set({ selectedCardIndex: index });
        } else {
          if (selectedCardIndex === index) { set({ selectedCardIndex: null }); return; }
          const newBottom = [...bottomCards];
          [newBottom[selectedCardIndex], newBottom[index]] = [newBottom[index], newBottom[selectedCardIndex]];
          set({ bottomCards: newBottom, selectedCardIndex: null });
        }
      },

      placeBet: () => {
        const { balance, betAmount, isMuted } = get();
        if (balance < betAmount) return;
        manageBGMusic(isMuted);
        playSFX('opening', isMuted);
        
        // ВАЖЛИВО: Тут ми НЕ викликаємо genMultipliers. 
        // Використовуються ті ікси, які вже лежать у slotMultipliers.
        set({ 
          balance: balance - betAmount, 
          status: 'arranging', 
          revealedCount: 0, 
          matchedIndices: [] 
        });
      },

      confirmReveal: async () => {
        const { isMuted, topCards, bottomCards, betAmount, balance, slotMultipliers } = get();
        set({ status: 'revealing', selectedCardIndex: null });
        
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
            const m = slotMultipliers[i]; // Порівнюємо з тими самими іксами
            if (m === 'LOST') hasLost = true;
            else { hasWin = true; totalWin += betAmount * (m as number); }
          }
        });

        setTimeout(() => {
          let newBal = balance;
          if (hasWin && hasLost) { newBal += betAmount; playSFX('touch', isMuted); }
          else if (hasWin) { newBal += totalWin; playSFX('win', isMuted); }
          else { playSFX('lose', isMuted); }
          set({ status: 'result', balance: newBal, matchedIndices: matches });
        }, 500);
      },

      reset: () => { 
        playSFX('touch', get().isMuted); 
        set({ status: 'idle', revealedCount: 0, matchedIndices: [] }); 
        get().generateInitialCards(); 
      },

      toggleMute: () => { 
        const m = !get().isMuted; 
        set({ isMuted: m }); 
        manageBGMusic(m); 
      }
    };
  }, { name: 'dragon-cards-fixed-multipliers-v12' }) // Оновлена назва версії для чистого старту
);