import React from 'react';
import { XIcon } from './icons/XIcon';
import { Button } from './ui/Button';
import { CoinIcon } from './icons/CoinIcon';

interface CreditsModalProps {
  onClose: () => void;
}

const creditPacks = [
  { credits: 500, price: 'R$24,90', popular: false },
  { credits: 1200, price: 'R$49,90', popular: true },
  { credits: 3000, price: 'R$99,90', popular: false },
];

const WHATSAPP_LINK = "https://wa.me/5516988043367";

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-[#0f0715]/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-modal-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1c1026] border border-violet-500/20 rounded-3xl w-full max-w-lg p-8 text-center animate-modal-scale-in shadow-[0_0_50px_rgba(139,92,246,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/5 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-all duration-300"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6 rotate-3">
             <CoinIcon className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Get More Credits</h2>
        <p className="text-neutral-400 mb-8 text-sm">
           Unlock your creativity. Choose a package to continue generating amazing images.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {creditPacks.map((pack, index) => (
            <div
              key={index}
              className={`relative bg-[#0f0715]/50 border rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:border-violet-500/50 group ${
                pack.popular ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'border-white/5'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-2.5 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-4 text-left">
                <div className="bg-white/5 p-2.5 rounded-lg">
                    <CoinIcon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                    <span className="block text-lg font-bold text-white">{pack.credits} Credits</span>
                    <span className="text-xs text-neutral-500">Instant delivery</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                  <span className="text-base font-medium text-white">{pack.price}</span>
                  <Button 
                    variant={pack.popular ? 'gradient' : 'secondary'} 
                    className="py-2 px-4 rounded-lg text-xs"
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy
                  </Button>
              </div>
            </div>
          ))}
        </div>
         <p className="text-[10px] text-neutral-600 mt-6 uppercase tracking-widest">
            Secure payment via WhatsApp Support
          </p>
      </div>
    </div>
  );
};