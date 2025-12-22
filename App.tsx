
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';
import { KeyIcon } from './components/icons/KeyIcon';

// Define the global AIStudio interface to avoid conflicts and resolve TS errors
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    readonly aistudio: AIStudio;
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
      try {
        // Tenta verificar se já existe uma chave selecionada
        if (typeof window.aistudio !== 'undefined') {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } else {
          // Se o objeto não existir, provavelmente estamos em um ambiente 
          // onde a seleção manual é necessária
          setHasKey(false);
        }
      } catch (e) {
        console.warn("Aguardando inicialização do ambiente AI Studio...");
        setHasKey(false);
      }
    };
    
    // Pequeno delay para garantir que scripts externos de ambiente carreguem
    const timer = setTimeout(checkKey, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleConnectKey = async () => {
    try {
      if (typeof window.aistudio !== 'undefined') {
        await window.aistudio.openSelectKey();
        // Conforme as regras, assumimos sucesso após acionar o diálogo
        setHasKey(true);
        showToast('Seletor aberto. Conecte sua chave para ativar o Zion Frame.', 'success');
      } else {
        showToast('O sistema de conexão não está disponível neste navegador.', 'error');
      }
    } catch (e) {
      console.error("Erro ao abrir seletor:", e);
      showToast('Não foi possível abrir o seletor de chaves.', 'error');
    }
  };

  const handleClearCanvas = useCallback(() => {
    setGeneratedImages([]);
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
      showToast(`Arte gerada com sucesso.`, 'success');
    } catch (error: any) {
      let msg = error.message || 'Erro inesperado na geração.';
      // Reset key selection if the request fails with "Requested entity was not found."
      if (msg.includes("Requested entity was not found")) {
        msg = "Chave de API não encontrada ou inválida. Reconecte sua conta.";
        setHasKey(false);
      }
      showToast(msg, 'error');
      const placeholderIds = placeholders.map(p => p.id);
      setGeneratedImages(prev => prev.filter(img => !placeholderIds.includes(img.id)));
      setGenerationState('ERROR');
    }
  }, [prompt, settings, showToast]);

  // Enquanto verifica o estado inicial, mantém uma tela neutra
  if (hasKey === null) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/10 border-t-[#a3ff12] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black p-6 z-[100]">
        <div className="dot-grid opacity-20"></div>
        <div className="relative glass-card p-12 rounded-[3.5rem] border-white/10 max-w-lg text-center animate-scale-in overflow-hidden shadow-[0_0_100px_rgba(163,255,18,0.1)]">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#a3ff12]/20 blur-[80px]"></div>
          
          <div className="w-24 h-24 bg-[#a3ff12]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#a3ff12]/20 shadow-[0_0_30px_rgba(163,255,18,0.1)]">
            <KeyIcon className="w-12 h-12 text-[#a3ff12]" />
          </div>

          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
            Visão <br/><span className="text-[#a3ff12]">Zion Frame</span>
          </h1>
          
          <p className="text-neutral-400 text-sm mb-10 leading-relaxed font-medium">
            O Zion Frame requer que você conecte sua própria chave do Google AI Studio. Isso garante que cada usuário use sua própria cota gratuita de forma independente.
          </p>

          <button 
            onClick={handleConnectKey}
            className="w-full bg-[#a3ff12] hover:bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-[0_20px_40px_rgba(163,255,18,0.2)] hover:shadow-[0_0_50px_rgba(163,255,18,0.4)] pointer-events-auto"
          >
            Conectar minha API Key
          </button>

          <div className="mt-8 flex flex-col gap-3">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              className="text-[10px] text-[#a3ff12] uppercase font-bold tracking-widest hover:underline"
            >
              Não tenho uma chave? Criar no AI Studio →
            </a>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest hover:text-white transition-colors"
            >
              Sobre cotas e faturamento do Google
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
