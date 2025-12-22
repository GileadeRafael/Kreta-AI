import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';
import { KeyIcon } from './components/icons/KeyIcon';

function App() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [settings, setSettings] = useState<Settings>({
    style: 'Cinematic',
    aspectRatio: '1:1',
    creativity: 75,
    negativePrompt: '',
    numImages: 1,
    quality: 'HD',
  });
  
  const [generationState, setGenerationState] = useState<GenerationState>('IDLE');
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const imageSpawnCounter = useRef(0);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    await (window as any).aistudio.openSelectKey();
    // Assume sucesso conforme diretrizes para evitar race conditions
    setHasKey(true);
  };

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);
  
  const handleClearCanvas = useCallback(() => {
    setGeneratedImages([]);
    imageSpawnCounter.current = 0;
    showToast('Canvas limpo com sucesso.', 'success');
  }, [showToast]);

  const handleGenerate = useCallback(async (promptOverride?: string) => {
    const activePrompt = promptOverride || prompt;
    if (!activePrompt.trim()) {
      showToast('Por favor, digite um prompt.', 'error');
      return;
    }

    setGenerationState('GENERATING');
    const placeholders: GeneratedImage[] = Array.from({ length: settings.numImages }).map((_, index) => {
      const startX = window.innerWidth / 2 - 160 + (Math.random() * 60 - 30);
      const startY = window.innerHeight / 2 - 200 + (Math.random() * 60 - 30);
      return {
        id: crypto.randomUUID(),
        src: '',
        title: 'Gerando...',
        prompt: activePrompt,
        aspectRatio: settings.aspectRatio,
        x: startX + (index * 40),
        y: startY + (index * 40),
        status: 'loading' as const,
      };
    });
    
    setGeneratedImages(prev => [...prev, ...placeholders]);

    try {
      const images = await generateImage(activePrompt, settings.aspectRatio, settings.numImages);
      const title = await generateTitle(activePrompt);
      
      setGeneratedImages(prevImages => {
        const newImages = [...prevImages];
        placeholders.forEach((placeholder, index) => {
          const imageIndex = newImages.findIndex(img => img.id === placeholder.id);
          if (imageIndex !== -1 && images[index]) {
            newImages[imageIndex] = {
              ...newImages[imageIndex],
              src: images[index],
              title: title,
              status: 'complete' as const,
            };
          }
        });
        return newImages;
      });

      setGenerationState('COMPLETE');
      showToast(`Imagens geradas com sucesso.`, 'success');
    } catch (error: any) {
      if (error.message === "KEY_RESET_REQUIRED") {
        setHasKey(false);
        showToast('Chave de API expirada ou inválida. Por favor, reconecte.', 'error');
      } else {
        showToast(error.message || 'Falha na conexão.', 'error');
      }
      const placeholderIds = placeholders.map(p => p.id);
      setGeneratedImages(prev => prev.filter(img => !placeholderIds.includes(img.id)));
      setGenerationState('ERROR');
    }
  }, [prompt, settings, showToast]);

  if (hasKey === null) return null; // Loading inicial

  if (!hasKey) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center p-8 glass-card rounded-[3rem] border-[#a3ff12]/20 max-w-md animate-scale-in">
          <div className="w-20 h-20 bg-[#a3ff12]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <KeyIcon className="w-10 h-10 text-[#a3ff12]" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Acesso Restrito</h1>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            Para utilizar o modelo Pro do Zion Frame, você precisa conectar sua própria chave de API faturável do Google AI Studio.
          </p>
          <button 
            onClick={handleOpenKeySelector}
            className="w-full bg-[#a3ff12] text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_30px_rgba(163,255,18,0.3)]"
          >
            Conectar Google AI Studio
          </button>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[10px] text-neutral-600 block mt-6 uppercase hover:text-white transition-colors">
            Documentação de Faturamento
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-transparent overflow-hidden text-white">
        <Header onClearCanvas={handleClearCanvas} />
        <main className="flex-1 relative z-10">
            <Generator
              prompt={prompt}
              setPrompt={setPrompt}
              settings={settings}
              setSettings={setSettings}
              generationState={generationState}
              handleGenerate={handleGenerate}
              generatedImages={generatedImages}
              setGeneratedImages={setGeneratedImages}
            />
        </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;