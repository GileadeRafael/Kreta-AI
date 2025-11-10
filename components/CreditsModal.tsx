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
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-modal-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1c1c1c] border border-[#2d2d3d] rounded-2xl w-full max-w-lg p-8 text-center animate-modal-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-neutral-300 hover:text-white transition-all duration-300"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <CoinIcon className="w-16 h-16 mx-auto text-amber-400 mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Adquirir Créditos</h2>
        <p className="text-neutral-400 mb-8">
          Suas criações estão esperando. Escolha um pacote para continuar gerando imagens.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creditPacks.map((pack, index) => (
            <div
              key={index}
              className={`relative bg-neutral-800/50 border-2 rounded-xl p-6 flex flex-col items-center justify-between transition-all duration-300 ${
                pack.popular ? 'border-sky-500 scale-105' : 'border-neutral-700 hover:border-neutral-600'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <CoinIcon className="w-6 h-6 text-amber-400" />
                <span className="text-2xl font-bold text-white">{pack.credits}</span>
              </div>
              <p className="text-lg font-medium text-neutral-300 mb-6">{pack.price}</p>
              <Button 
                variant={pack.popular ? 'primary' : 'secondary'} 
                className="w-full"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                Comprar
              </Button>
            </div>
          ))}
        </div>
         <p className="text-xs text-neutral-500 mt-8">
            Você será redirecionado para o suporte para finalizar a compra.
          </p>
      </div>
    </div>
  );
};