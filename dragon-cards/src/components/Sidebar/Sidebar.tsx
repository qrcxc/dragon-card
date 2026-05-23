import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const Sidebar: React.FC = () => {
  const { balance, betAmount, setBet, risk, setRisk, placeBet, status, reset } = useGameStore();
  const isLocked = status === 'revealing' || status === 'arranging';

  return (
    <div className="flex flex-col p-6 text-white font-sans">
      <div className="flex flex-col gap-6 lg:gap-8">
        <h1 className="hidden lg:block font-black italic text-xl tracking-tighter uppercase">Dragon Cards</h1>
        
        {/* BET AMOUNT */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-end text-slate-500 uppercase text-[10px] font-bold">
            <span>Bet Amount</span><span className="hidden sm:inline">Max Bet: 1000.00 $</span>
          </div>
          <div className="flex items-center bg-[#0b0f16] rounded-lg p-1.5 border border-white/5 h-14 focus-within:border-[#0066ff]">
            <input type="number" value={betAmount} onChange={(e) => setBet(Number(e.target.value))} disabled={isLocked} className="bg-transparent w-full px-3 font-bold text-lg outline-none text-white" />
            <div className="flex gap-1 pr-1">
              {['1/2', 'x2', 'Max'].map(l => (
                <button key={l} onClick={() => setBet(l==='1/2'?betAmount/2:l==='x2'?betAmount*2:1000)} disabled={isLocked} className="bg-[#242f42] text-[10px] font-black px-2 sm:px-3 py-2 rounded text-slate-400 hover:text-white uppercase transition-colors">{l}</button>
              ))}
            </div>
          </div>
        </section>

        {/* RISK */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold text-slate-300">Risk</h2>
          <div className="grid grid-cols-4 gap-2">
            {(['low', 'medium', 'high', 'classic'] as const).map(r => (
              <button key={r} onClick={() => setRisk(r)} disabled={isLocked} className={`py-2.5 rounded-md text-[10px] font-black uppercase transition-all border ${risk === r ? 'bg-[#1a2230] text-[#f59e0b] border-[#f59e0b]/40 shadow-lg' : 'bg-[#1a2230] text-slate-600'}`}>{r}</button>
            ))}
          </div>
        </section>

        {/* Кнопка Place Bet */}
        <button 
          onClick={status === 'result' ? reset : placeBet} 
          disabled={status === 'revealing'} 
          className="w-full bg-[#0066ff] hover:bg-blue-500 py-4 rounded-xl font-bold text-white uppercase tracking-widest active:scale-95 transition-all shadow-xl"
        >
          {status === 'result' ? 'Play Again' : 'Place Bet'}
        </button>
      </div>

      {/* Баланс (тільки для десктопа) */}
      <div className="hidden lg:flex mt-auto bg-[#1c2536] p-5 rounded-xl border border-white/5 items-center justify-between shadow-inner mt-10">
        <span className="text-slate-500 font-bold text-[11px] uppercase tracking-widest">Balance:</span>
        <span className="text-lg font-bold font-mono text-[#4ade80]">{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
};