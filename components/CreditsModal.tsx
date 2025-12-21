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
      className="fixed inset-0 bg-[#000000]/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-modal-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#111111] border border-[#a3ff12]/20 rounded-3xl w-full max-w-lg p-8 text-center animate-modal-scale-in shadow-[0_0_50px_rgba(163,255,18,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/5 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-all duration-300"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#a3ff12] to-[#b4ff3d] rounded-2xl flex items-center justify-center shadow-lg shadow-[#a3ff12]/20 mb-6 rotate-3">
             <CoinIcon className="w-10 h-10 text-black" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">Obtenha mais Créditos</h2>
        <p className="text-neutral-400 mb-8 text-sm">
           Libere sua criatividade infinita. Escolha um pacote para continuar gerando obras únicas.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {creditPacks.map((pack, index) => (
            <div
              key={index}
              className={`relative bg-black/50 border rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:border-[#a3ff12]/50 group ${
                pack.popular ? 'border-[#a3ff12] shadow-[0_0_15px_rgba(163,255,18,0.15)]' : 'border-white/5'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-2.5 left-4 bg-[#a3ff12] text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Mais Popular
                </div>
              )}
              <div className="flex items-center gap-4 text-left">
                <div className="bg-white/5 p-2.5 rounded-lg">
                    <CoinIcon className="w-6 h-6 text-[#a3ff12]" />
                </div>
                <div>
                    <span className="block text-lg font-bold text-white">{pack.credits} Créditos</span>
                    <span className="text-xs text-neutral-500">Entrega instantânea</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                  <span className="text-base font-medium text-white">{pack.price}</span>
                  <Button 
                    variant={pack.popular ? 'primary' : 'secondary'} 
                    className="py-2 px-4 rounded-lg text-xs"
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Comprar
                  </Button>
              </div>
            </div>
          ))}
        </div>
         <p className="text-[10px] text-neutral-600 mt-6 uppercase tracking-widest">
            Pagamento seguro via Suporte WhatsApp
          </p>
      </div>
    </div>
  );
};