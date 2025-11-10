import React, { useState } from 'react';
import { Button } from './ui/Button';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
        onSubmit(apiKey);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-modal-fade-in">
      <div className="relative bg-[#1c1c1c] border border-[#2d2d3d] rounded-2xl w-full max-w-md p-8 text-center animate-modal-scale-in">
        <img 
          src="https://i.imgur.com/Q5ZTXdw.png" 
          alt="Kreta AI Logo" 
          className="w-16 h-16 mx-auto mb-4" 
        />
        <h2 className="text-2xl font-bold text-white mb-2">Use Sua Própria Chave de API</h2>
        <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
          Para usar o poder do modelo Imagen do Google, você precisa de sua própria chave. O Google exige que o faturamento esteja ativado, mas isso <strong>não significa que você será cobrado imediatamente</strong>.
          Sua conta inclui um <strong>generoso nível de uso gratuito</strong> e novos usuários geralmente recebem <strong>créditos gratuitos</strong> para começar.
          {' '}
          <a
            href="https://cloud.google.com/billing/docs/how-to/enable-billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline"
          >
            Saiba mais
          </a>.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Cole sua chave de API aqui"
            className="w-full bg-[#0a0a0f] border border-[#2d2d3d] rounded-lg text-sm px-4 py-3 mb-4 focus:ring-2 focus:ring-sky-500 text-center text-white"
          />
          <p className="text-xs text-neutral-500 mb-6 px-4">
            Sua chave é armazenada localmente em seu navegador e nunca é enviada para nossos servidores.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex-1 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 text-white bg-[#2d2d3d] hover:bg-[#3f3f4d] px-4 py-2.5"
            >
              Obter Chave de API
            </a>
            <Button
              type="submit"
              variant="primary"
              className="w-full flex-1 py-2.5"
              disabled={!apiKey.trim()}
            >
              Continuar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};