export type RiskLevel = 'low' | 'medium' | 'high' | 'classic';
export type GameStatus = 'idle' | 'arranging' | 'revealing' | 'result';

export interface DragonCard {
  id: string;
  type: string;
  multiplier: number | 'LOST';
  isRevealed: boolean;
  image: string;
}

export interface GameState {
  balance: number;
  betAmount: number;
  risk: RiskLevel;
  status: GameStatus;
  topCards: DragonCard[];
  bottomCards: DragonCard[];
  revealedCount: number;
  isMuted: boolean;
  selectedCardIndex: number | null;
  activePosition: number | null;
  matchedIndices: number[]; // ОБОВ'ЯЗКОВО ДОДАЙ ЦЕЙ РЯДОК
}