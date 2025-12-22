
import React from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { KeyIcon } from './icons/KeyIcon';

interface HeaderProps {
    onClearCanvas: () => void;
    onSyncEngine: () => void;
    isEngineReady: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onClearCanvas, onSyncEngine, isEngineReady }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-start pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="relative group">
            <div className={`absolute inset-0 bg-[#a3ff12] blur-xl transition-all duration-500 ${isEngineReady ? 'opacity-20 group-hover:opacity-40' : 'opacity-0'}`}></div>
            <img 
              src="https://i.imgur.com/dMgrGmM.png" 
              alt="Zion Frame" 
              className="w-10 h-10 relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
            />
        </div>
        <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white uppercase leading-none">Zion Frame</h1>
            <div className="flex items-center gap-2 mt-1.5">
                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isEngineReady ? 'bg-[#a3ff12] shadow-[0_0_8px_#a3ff12]' : 'bg-red-500 animate-pulse shadow-[0_0_8px_red]'}`}></span>
                <span className="text-[8px] font-black text-neutral-500 tracking-[0.2em] uppercase">
                    {isEngineReady ? 'Engine Active' : 'Sync Required'}
                </span>
            </div>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-3">
        {!isEngineReady && (
          <button 
            onClick={onSyncEngine}
            className="bg-primary text-black h-12 px-6 flex items-center gap-3 rounded-2xl hover:bg-white transition-all shadow-[0_10px_30px_rgba(163,255,18,0.2)] animate-float"
          >
            <KeyIcon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sincronizar Zion</span>
          </button>
        )}
        
        <button 
          onClick={onClearCanvas}
          className="glass-card h-12 px-5 flex items-center gap-3 rounded-2xl hover:bg-white/5 transition-all text-neutral-400 hover:text-white border-white/5 group"
          title="Limpar Grid"
        >
          <TrashIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Limpar Grid</span>
        </button>
      </div>
    </header>
  );
};
