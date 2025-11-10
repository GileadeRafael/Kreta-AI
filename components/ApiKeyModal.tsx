import React, { useState } from 'react';
import { Button } from './ui/Button';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-modal-fade-in">
      <div className="relative bg-[#1c1c1c] border border-[#2d2d3d] rounded-2xl w-full max-w-md p-8 text-center animate-modal-scale-in">
        <img 
          src="https://i.imgur.com/Q5ZTXdw.png" 
          alt="Kreta AI Logo" 
          className="w-16 h-16 mx-auto mb-4" 
        />
        <h2 className="text-2xl font-bold text-white mb-2">Enter Your Gemini API Key</h2>
        <p className="text-neutral-400 mb-6 text-sm">
          To start creating, please provide your own Google AI Studio API key.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your API key here"
            className="w-full bg-[#0a0a0f] border border-[#2d2d3d] rounded-lg text-sm px-4 py-3 mb-4 focus:ring-2 focus:ring-sky-500 text-center"
          />
          <p className="text-xs text-neutral-500 mb-6 px-4">
            Your key is stored locally in your browser and is never sent to our servers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex-1 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 text-white bg-[#2d2d3d] hover:bg-[#3f3f4d] px-4 py-2.5"
            >
              How to find my API Key?
            </a>
            <Button
              type="submit"
              variant="primary"
              className="w-full flex-1 py-2.5"
              disabled={!apiKey.trim()}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
