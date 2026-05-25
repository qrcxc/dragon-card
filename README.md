# 🐉 Dragon Cards — iGaming Demo

A high-performance, responsive iGaming product built with React 18, TypeScript, and Zustand.

## 🚀 Improvements implemented after technical audit:

- **Fair RNG**: Implemented Fisher-Yates shuffle algorithm for unbiased card and multiplier distribution.
- **State Integrity**: Added guards to prevent state manipulation (risk changes during rounds, re-triggering reveal).
- **Performance**: Optimized re-renders using Zustand selectors and `useShallow`.
- **Payout Logic**: Standardized "Stake Return" (Push) rule for mixed results.
- **Clean Architecture**: Decoupled game logic from UI components.

## 🛠 Tech Stack

- **Vite + React**
- **TypeScript** (Strict Mode)
- **Zustand** (Persistence & State Management)
- **Tailwind CSS** (PostCSS Build Pipeline)

## 📦 Installation

1. `npm install`
2. `npm run dev`
