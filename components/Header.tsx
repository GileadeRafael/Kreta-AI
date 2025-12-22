import React from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { ZapIcon } from './icons/ZapIcon';

interface HeaderProps {
    onClearCanvas: () => void;
    isProMode: boolean;
    onTogglePro: (active: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearCanvas, isProMode, onTogglePro }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="relative group">
            <div className={`absolute inset-0 ${isProMode ? 'bg-[#a3ff12]' : 'bg-orange-500'} blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500`}></div>
            <img 
              src="https://i.imgur.com/dMgrGmM.png" 
              alt="Zion Frame" 
              className="w-10 h-10 relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
            />
        </div>
        <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white uppercase leading-none">Zion Frame</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isProMode ? 'bg-[#a3ff12] shadow-[0_0_8px_#a3ff12]' : 'bg-neutral-600'}`}></span>
                <span className="text-[8px] font-black text-neutral-500 tracking-[0.2em] uppercase">
                    {isProMode ? 'Advanced Pro Engine' : 'Standard Flash Engine'}
                </span>
            </div>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-3">
        {/* Pro Toggle */}
        <button 
          onClick={() => onTogglePro(!isProMode)}
          className={`glass-card h-10 px-4 rounded-2xl flex items-center gap-2 transition-all duration-500 group border-white/5 ${isProMode ? 'bg-[#a3ff12] border-[#a3ff12]/30' : 'hover:bg-white/5'}`}
        >
          <ZapIcon className={`w-4 h-4 transition-colors ${isProMode ? 'text-black' : 'text-[#a3ff12]'}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${isProMode ? 'text-black' : 'text-neutral-400 group-hover:text-white'}`}>
             Zion Pro
          </span>
        </button>

        <button 
          onClick={onClearCanvas}
          className="glass-card h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-white/5 transition-all text-neutral-500 hover:text-white border-white/5"
          title="Reset Canvas"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};