import React from 'react';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';

interface HeaderProps {
    onClearCanvas: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearCanvas }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0715] via-[#0f0715]/80 to-transparent pointer-events-none" />
      <div className="mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
                <div className="absolute inset-0 bg-violet-500 blur-lg opacity-40 rounded-full"></div>
                <img 
                src="https://i.imgur.com/Q5ZTXdw.png" 
                alt="Kreta AI Logo" 
                className="w-9 h-9 relative z-10 drop-shadow-md" 
                />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white leading-none">Kreta AI</span>
                <span className="text-[10px] text-violet-400 font-medium tracking-wider uppercase">Creative Suite</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClearCanvas} className="py-2 px-4 text-xs border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full">
                <TrashIcon className="w-4 h-4 mr-2 text-neutral-400 group-hover:text-red-400 transition-colors"/>
                <span className="text-neutral-300">Clear</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};