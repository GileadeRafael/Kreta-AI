
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';
import { KeyIcon } from './components/icons/KeyIcon';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
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

  useEffect(() => {
    const checkKey = async () => {
      // Prioridade 1: Chave injetada via Env Var (Vercel)
      const envKey = process.env.API_KEY;
      if (envKey && envKey !== "undefined" && envKey !== "") {
        setHasKey(true);
        return;
      }

      // Prioridade 2: Ambiente AI Studio
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          setHasKey(false);
        }
      } else {
        // Se não houver process.env no carregamento inicial, mantemos bloqueado
        // mas permitimos o desbloqueio manual pelo botão para ambientes externos
        setHasKey(false);
      }
    };
    
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasKey(true);
        showToast('Zion Engine Sincronizada com AI Studio.', 'success');
      } catch (e) {
        showToast('Falha ao conectar chave.', 'error');
      }
    } else {
      // No Vercel, se o usuário clica no botão, permitimos a entrada
      // A validação real acontecerá na primeira chamada de API usando process.env.API_KEY
      setHasKey(true);
      showToast('Acessando Zion Grid via Environment Variables...', 'success');
    }
  };

  const handleClearCanvas = useCallback(() => {
    setGeneratedImages([]);
    showToast('Grid Zion resetado.', 'success');
  }, [showToast]);

  const handleGenerate = useCallback(async (promptOverride?: string) => {
    const activePrompt = promptOverride || prompt;
    if (!activePrompt.trim()) {
      showToast('Defina sua visão para começar.', 'error');
      return;
    }

    setGenerationState('GENERATING');
    const placeholders: GeneratedImage[] = Array.from({ length: settings.numImages }).map((_, index) => ({
      id: crypto.randomUUID(),
      src: '',
      title: 'Decodificando...',
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
      let msg = error.message || 'Erro na transmissão Zion.';
      
      // Tratamento de erro de chave inválida ou não configurada
      if (msg.includes("401") || msg.includes("API key not valid") || msg.includes("Requested entity was not found")) {
        msg = "Chave API não detectada ou inválida no Vercel. Verifique suas Environment Variables.";
        setHasKey(false);
      }
      
      showToast(msg, 'error');
      const placeholderIds = placeholders.map(p => p.id);
      setGeneratedImages(prev => prev.filter(img => !placeholderIds.includes(img.id)));
      setGenerationState('ERROR');
    }
  }, [prompt, settings, showToast]);

  if (hasKey === null) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black p-6 z-[100]">
        <div className="dot-grid opacity-40"></div>
        <div className="relative glass-card p-12 rounded-[3.5rem] border-primary/10 max-w-lg text-center animate-scale-in overflow-hidden shadow-[0_0_100px_rgba(163,255,18,0.15)]">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px]"></div>
          
          <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-primary/20 shadow-inner">
            <KeyIcon className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Zion Frame <br/><span className="text-primary">System Lock</span>
          </h1>
          
          <p className="text-neutral-400 text-sm mb-12 leading-relaxed font-medium">
            Se você configurou a <code>API_KEY</code> no Vercel, clique abaixo para forçar a inicialização da engine.
          </p>

          <button 
            onClick={handleConnectKey}
            className="w-full bg-primary hover:bg-white text-black font-black py-6 rounded-2xl uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-[0_20px_50px_rgba(163,255,18,0.2)] hover:shadow-[0_0_60px_rgba(163,255,18,0.4)] cursor-pointer relative z-50"
          >
            Sincronizar Zion Engine
          </button>

          <div className="mt-10 flex flex-col gap-4">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="text-[10px] text-primary uppercase font-black tracking-widest hover:underline"
            >
              Documentação de Faturamento →
            </a>
          </div>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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
