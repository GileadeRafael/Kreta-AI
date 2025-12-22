
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';

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
  
  // Assumimos que está pronto se estiver no Vercel. 
  // O erro real será capturado na tentativa de geração.
  const [isEngineReady, setIsEngineReady] = useState<boolean>(true);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 6000);
  }, []);

  const handleSyncEngine = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setIsEngineReady(true);
        showToast('Engine Zion Sincronizada via AI Studio.', 'success');
      } catch (e) {
        showToast('Erro ao sincronizar engine.', 'error');
      }
    } else {
      showToast('No Vercel, use a aba "Environment Variables" e adicione API_KEY.', 'error');
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
      setIsEngineReady(true);
    } catch (error: any) {
      const errorMsg = error.message || '';
      let displayMsg = 'Erro na transmissão Zion.';
      
      if (errorMsg.includes("CHAVE_AUSENTE")) {
        displayMsg = "API_KEY não encontrada. No Vercel, certifique-se de que a variável se chama exatamente API_KEY.";
        setIsEngineReady(false);
      } else if (errorMsg.includes("CHAVE_INVALIDA")) {
        displayMsg = "A API_KEY no Vercel é inválida ou expirou.";
        setIsEngineReady(false);
      } else if (errorMsg.includes("401") || errorMsg.includes("API Key")) {
        displayMsg = "Acesso negado pela engine. Verifique sua chave no Vercel.";
        setIsEngineReady(false);
      }
      
      showToast(displayMsg, 'error');
      const placeholderIds = placeholders.map(p => p.id);
      setGeneratedImages(prev => prev.filter(img => !placeholderIds.includes(img.id)));
      setGenerationState('ERROR');
    }
  }, [prompt, settings, showToast]);

  return (
    <div className="fixed inset-0 flex flex-col bg-transparent overflow-hidden text-white">
        <Header 
          onClearCanvas={handleClearCanvas} 
          onSyncEngine={handleSyncEngine}
          isEngineReady={isEngineReady}
        />
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
