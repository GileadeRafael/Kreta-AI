
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';
import { KeyIcon } from './components/icons/KeyIcon';

// Declare aistudio globally following guidelines
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Fix: All declarations of 'aistudio' must have identical modifiers. Adding '?' to match environment.
    aistudio?: AIStudio;
  }
}

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
    quality: 'Standard',
  });
  
  const [generationState, setGenerationState] = useState<GenerationState>('IDLE');
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  // Use only aistudio.hasSelectedApiKey for key checking as per guidelines
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.warn("AI Studio Key check failed", e);
          setHasKey(false);
        }
      } else {
        setHasKey(false);
      }
    };
    
    const timer = setTimeout(checkKey, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // GUIDELINE: Assume the key selection was successful after triggering openSelectKey() and proceed to the app.
        setHasKey(true);
        showToast('Conectado à Zion Grid.', 'success');
      } catch (e) {
        showToast('Erro ao abrir seletor de chave.', 'error');
      }
    }
  };

  const handleClearCanvas = useCallback(() => {
    setGeneratedImages([]);
    showToast('Canvas resetado.', 'success');
  }, [showToast]);

  const handleGenerate = useCallback(async (promptOverride?: string) => {
    const activePrompt = promptOverride || prompt;
    if (!activePrompt.trim()) {
      showToast('O que devemos criar hoje?', 'error');
      return;
    }

    setGenerationState('GENERATING');
    const placeholders: GeneratedImage[] = Array.from({ length: settings.numImages }).map((_, index) => ({
      id: crypto.randomUUID(),
      src: '',
      title: 'Materializando...',
      prompt: activePrompt,
      aspectRatio: settings.aspectRatio,
      x: window.innerWidth / 2 - 160 + (index * 40),
      y: window.innerHeight / 2 - 200 + (index * 40),
      status: 'loading' as const,
    }));
    
    setGeneratedImages(prev => [...prev, ...placeholders]);

    try {
      const images = await generateImage(activePrompt, settings.aspectRatio, settings.numImages, settings.quality);
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
    } catch (error: any) {
      let msg = error.message || 'Erro na transmissão de dados.';
      // GUIDELINE: If the request fails with "Requested entity was not found.", reset key state
      if (msg.includes("Requested entity was not found")) {
        msg = "Sessão expirada. Por favor, selecione sua chave novamente.";
        setHasKey(false);
      }
      showToast(msg, 'error');
      const placeholderIds = placeholders.map(p => p.id);
      setGeneratedImages(prev => prev.filter(img => !placeholderIds.includes(img.id)));
      setGenerationState('ERROR');
    }
  }, [prompt, settings, showToast]);

  if (hasKey === null) {
    return <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-white/5 border-t-primary rounded-full animate-spin"></div>
    </div>;
  }

  if (!hasKey) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black p-6 z-[100]">
        <div className="dot-grid opacity-30"></div>
        <div className="relative glass-card p-12 rounded-[3.5rem] border-white/10 max-w-lg text-center animate-scale-in overflow-hidden shadow-[0_0_120px_rgba(163,255,18,0.15)]">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 blur-[100px]"></div>
          
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-2xl">
            <KeyIcon className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Ative o <br/><span className="futuristic-gradient-text">Zion Frame</span>
          </h1>
          
          <p className="text-neutral-400 text-sm mb-12 leading-relaxed font-medium">
            Para iniciar a geração, conecte sua chave de acesso paga do Google AI Studio.
          </p>

          <button 
            onClick={handleConnectKey}
            className="w-full bg-primary hover:bg-white text-black font-black py-6 rounded-2xl uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-[0_20px_50px_rgba(163,255,18,0.3)] hover:shadow-[0_0_60px_rgba(163,255,18,0.5)] cursor-pointer relative z-50"
          >
            Conectar Zion Key
          </button>

          <div className="mt-10 flex flex-col gap-4">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-primary uppercase font-black tracking-widest hover:underline"
            >
              Configurar Faturamento (ai.google.dev/gemini-api/docs/billing) →
            </a>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-neutral-500 uppercase font-black tracking-widest hover:text-white"
            >
              Obter chave no AI Studio →
            </a>
          </div>
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
