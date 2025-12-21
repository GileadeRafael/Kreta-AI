import React from 'react';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';

interface HeaderProps {
    onClearCanvas: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearCanvas }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="relative group">
            <div className="absolute inset-0 bg-primary blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
            <img 
              src="https://i.imgur.com/dMgrGmM.png" 
              alt="Zion Frame" 
              className="w-10 h-10 relative z-10 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
            />
        </div>
        <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white uppercase">Zion Frame</h1>
            <span className="text-[9px] font-bold text-neutral-500 tracking-[0.2em] uppercase">Gerador de imagens com IA</span>
        </div>
      </div>

      <div className="pointer-events-auto flex gap-4">
        <button 
          onClick={onClearCanvas}
          className="glass-card px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-white/5 transition-all text-xs font-bold text-neutral-400 hover:text-white border-white/5"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Reset Canvas</span>
        </button>
      </div>
    </header>
  );
};