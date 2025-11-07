import React from 'react';

export const Header: React.FC = () => {
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
        </div>
      </div>
    </header>
  );
};