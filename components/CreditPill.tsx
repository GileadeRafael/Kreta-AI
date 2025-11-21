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
      className="fixed top-5 right-28 z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600/90 to-orange-500/90 backdrop-blur-md border border-white/10 text-white font-bold text-xs px-4 py-2 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.3)] transform transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]"
      aria-label={`Current credits: ${credits ?? 'Loading...'}. Click to get more.`}
    >
      <CoinIcon className="w-4 h-4 text-white" />
      <span>{credits ?? '...'}</span>
    </button>
  );
};