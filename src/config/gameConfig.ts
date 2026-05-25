import type { RiskLevel } from '../types/game';

export const MAX_BET = 1000;

export const DRAGON_TYPES = [
  { type: 'fire', img: '/dragons/fire.png' },
  { type: 'frost', img: '/dragons/frost.png' },
  { type: 'storm', img: '/dragons/storm.png' },
  { type: 'earth', img: '/dragons/earth.png' },
  { type: 'shadow', img: '/dragons/shadow.png' },
  { type: 'empty', img: '/dragons/empty.png' },
] as const;

export const RISK_LEVELS: Record<RiskLevel, { lost: number; multipliers: number[] }> = {
  low: { lost: 1, multipliers: [1, 1.2, 1.5, 2, 2.5] },
  medium: { lost: 2, multipliers: [1.5, 2, 3, 5, 8] },
  high: { lost: 3, multipliers: [5, 10, 20, 25, 50] },
  classic: { lost: 4, multipliers: [10, 20, 35, 50, 100] },
};