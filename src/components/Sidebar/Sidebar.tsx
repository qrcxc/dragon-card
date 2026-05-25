import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '../../store/useGameStore';

export const Sidebar: React.FC = () => {
  const { balance, betAmount, risk, status } = useGameStore(
    useShallow((s) => ({
      balance: s.balance,
      betAmount: s.betAmount,
      risk: s.risk,
      status: s.status,
    }))
  );

  const { setBet, setRisk, placeBet, reset } = useGameStore();
  const isLocked = status === 'revealing' || status === 'arranging';

  return (
    <div className="flex flex-col h-full p-6 text-white font-sans bg-panel shrink-0">
      <div className="flex flex-col gap-8">
        <h1 className="font-black italic text-xl tracking-tighter uppercase">Dragon Cards</h1>
        
        <section className="space-y-3">
          <div className="flex justify-between items-end text-slate-500 uppercase text-[10px] font-bold">
            <span>Bet Amount</span><span>Max Bet: 1000.00 $</span>
          </div>
          <div className="flex items-center bg-dark-bg rounded-lg p-1.5 border border-white/5 h-14 focus-within:border-accent-blue">
            <input type="number" value={betAmount} onChange={(e) => setBet(Number(e.target.value))} disabled={isLocked} className="bg-transparent w-full px-3 font-bold text-lg outline-none text-white" />
            <div className="flex gap-1 pr-1">
              {['1/2', 'x2', 'Max'].map(l => (
                <button key={l} onClick={() => setBet(l==='1/2'?betAmount/2:l==='x2'?betAmount*2:1000)} disabled={isLocked} className="bg-[#242f42] text-[10px] font-black px-3 py-2 rounded uppercase text-slate-400 hover:text-white transition-colors">{l}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-300">Risk</h2>
          <div className="grid grid-cols-4 gap-2">
            {(['low', 'medium', 'high', 'classic'] as const).map(r => (
              <button key={r} onClick={() => setRisk(r)} disabled={isLocked} className={`py-2 rounded text-[10px] font-black uppercase transition-all border ${risk === r ? 'bg-dark-bg text-risk-active border-risk-active/40 shadow-lg' : 'bg-dark-bg text-slate-600 border-transparent'}`}>{r}</button>
            ))}
          </div>
        </section>

        <button onClick={status === 'result' ? reset : placeBet} disabled={status === 'revealing'} className="w-full bg-accent-blue hover:brightness-110 py-4 rounded-xl font-bold text-white uppercase tracking-widest active:scale-95 transition-all shadow-xl disabled:opacity-50">
          {status === 'result' ? 'Play Again' : 'Place Bet'}
        </button>
      </div>

      <div className="mt-auto bg-[#1c2536] p-5 rounded-xl border border-white/5 flex items-center justify-between shadow-inner">
        <span className="text-slate-500 font-bold text-[11px] uppercase tracking-widest">Balance:</span>
        <span className="text-lg font-bold font-mono text-[#4ade80]">{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
};