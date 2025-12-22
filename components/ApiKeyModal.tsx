
import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
  onCancel: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit, onCancel }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length > 10) {
        onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[110] flex items-center justify-center p-6 backdrop-blur-3xl animate-fade-in">
      <div 
        className="relative bg-[#050505] border border-white/10 rounded-[3rem] w-full max-w-lg p-12 text-center shadow-[0_0_150px_rgba(163,255,18,0.1)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/20 blur-[100px]"></div>
        
        <button 
            onClick={onCancel}
            className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors p-2"
        >
            <XIcon className="w-6 h-6" />
        </button>

        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
          <KeyIcon className="w-10 h-10 text-primary" />
        </div>

        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Sync Zion Grid</h2>
        <p className="text-neutral-400 mb-10 text-sm leading-relaxed font-medium">
          Insira sua chave do Google AI Studio abaixo. <br/>
          Sua chave é armazenada <span className="text-white">apenas localmente</span> em seu navegador.
        </p>

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="group relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500"></div>
            <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole seu Token aqui..."
                className="relative w-full bg-black/50 border border-white/10 rounded-2xl text-sm px-6 py-5 focus:ring-1 focus:ring-primary/50 text-center text-white placeholder-neutral-700 outline-none transition-all"
                autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={apiKey.trim().length < 10}
            className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.4em] transition-all transform active:scale-95 disabled:opacity-20 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-primary"
          >
            Sincronizar
          </button>
          
          <div className="mt-8">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black text-neutral-600 uppercase tracking-widest hover:text-primary transition-colors"
            >
              Ainda não tem uma chave? Clique aqui
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
