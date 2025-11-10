
import React from 'react';
import { CoinIcon } from './icons/CoinIcon';

interface CreditPillProps {
  credits: number | null;
  onClick: () => void;
}

export const CreditPill: React.FC<CreditPillProps> = ({ credits, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-20 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm px-4 py-2 rounded-full shadow-lg transform transition-transform hover:scale-105"
      aria-label={`Current credits: ${credits ?? 'Loading...'}. Click to get more.`}
    >
      <CoinIcon className="w-5 h-5" />
      <span>{credits ?? '...'}</span>
    </button>
  );
};
