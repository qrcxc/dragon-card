import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { GameField } from './components/GameField/GameField';
import { useGameStore } from './store/useGameStore';
import { manageBGMusic } from './utils/audioManager';

function App() {
  const { isMuted, balance } = useGameStore();

  useEffect(() => {
    const start = () => { manageBGMusic(isMuted); window.removeEventListener('mousedown', start); };
    window.addEventListener('mousedown', start);
    return () => window.removeEventListener('mousedown', start);
  }, [isMuted]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-screen bg-[#0b0f16] overflow-x-hidden relative text-white">
      {/* ФОН (фіксований) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <img src="/dragon-bg.png" alt="bg" className="w-full h-full object-cover" />
      </div>

      {/* 1. МОБІЛЬНИЙ БАЛАНС (Завжди зверху) */}
      <div className="lg:hidden sticky top-0 z-50 w-full bg-[#1c2536]/90 backdrop-blur-md py-3 px-4 flex justify-between items-center border-b border-white/5 shadow-xl">
        <span className="text-white font-black italic text-sm tracking-tighter uppercase">Dragon Cards</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Balance:</span>
          <span className="font-mono font-bold text-sm text-[#4ade80] tracking-tight">
            {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* 2. ДЕСКТОРНИЙ САЙДБАР (Зліва) */}
      <div className="hidden lg:block relative z-20 w-80 bg-[#151d2c] border-r border-white/5 h-screen shrink-0">
        <Sidebar />
      </div>

      {/* 3. ОСНОВНА ЗОНА (Скролабельна на мобілці) */}
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto lg:overflow-hidden custom-scroll">
        
        {/* Картки зверху */}
        <div className="w-full flex-1">
          <GameField />
        </div>

        {/* ПАНЕЛЬ СТАВОК ВНИЗУ (Тільки для мобілок) */}
        <div className="lg:hidden w-full bg-[#151d2c] border-t border-white/10 shrink-0 pb-10">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;