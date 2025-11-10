
import React from 'react';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';
import { KeyIcon } from './icons/KeyIcon';

interface HeaderProps {
    onClearCanvas: () => void;
    onShowApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearCanvas, onShowApiKeyModal }) => {
  return (
    <header className="flex-shrink-0 z-50 w-full bg-[#1c1c1c] border-b border-[#2d2d3d]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <img 
              src="https://i.imgur.com/Q5ZTXdw.png" 
              alt="Kreta AI Logo" 
              className="w-7 h-7" 
            />
            <span className="font-medium text-white">Kreta AI</span>
            <span className="text-xs text-neutral-400 bg-[#2d2d3d] px-2 py-1 rounded-md">v. 1.0</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClearCanvas} className="py-1.5 px-3 text-xs">
                <TrashIcon className="w-4 h-4 mr-1.5"/>
                Clear Canvas
            </Button>
            <Button variant="ghost" onClick={onShowApiKeyModal} className="py-1.5 px-3 text-xs">
                <KeyIcon className="w-4 h-4 mr-1.5"/>
                Change API Key
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
