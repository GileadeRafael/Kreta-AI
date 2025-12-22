import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';

function App() {
  const [isProMode, setIsProMode] = useState(false);
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

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);
  
  const handleClearCanvas = useCallback(() => {
    setGeneratedImages([]);
    imageSpawnCounter.current = 0;
    showToast('Canvas limpo com sucesso.', 'success');
  }, [showToast]);

  const handleTogglePro = async (active: boolean) => {
    if (active) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        try {
          await (window as any).aistudio.openSelectKey();
          setIsProMode(true);
          showToast('Modo Zion Pro Ativado', 'success');
        } catch (e) {
          setIsProMode(false);
        }
      } else {
        setIsProMode(true);
        showToast('Modo Zion Pro Ativado', 'success');
      }
    } else {
      setIsProMode(false);
      showToast('Retornando ao Modo Standard', 'success');
    }
  };

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
      const images = await generateImage(activePrompt, settings.aspectRatio, settings.numImages, isProMode);
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
      showToast(`${isProMode ? 'Pro' : 'Standard'} Engine: Arte finalizada.`, 'success');
    } catch (error: any) {
      let errorMsg = 'Falha na conexão orbital.';
      
      if (error.message === "PRO_KEY_REQUIRED") {
        errorMsg = 'O modo Pro requer uma chave faturável ativa.';
        setIsProMode(false);
      } else if (error.message === "QUOTA_EXCEEDED") {
        errorMsg = 'Limite de uso atingido. Tente novamente em alguns minutos ou use o modo Pro.';
      } else {
        errorMsg = error.message || errorMsg;
      }

      showToast(errorMsg, 'error');
      const placeholderIds = placeholders.map(p => p.id);
      setGeneratedImages(prev => prev.filter(img => !placeholderIds.includes(img.id)));
      setGenerationState('ERROR');
    }
  }, [prompt, settings, isProMode, showToast]);

  return (
    <div className="fixed inset-0 flex flex-col bg-transparent overflow-hidden text-white">
        <Header 
            onClearCanvas={handleClearCanvas} 
            isProMode={isProMode} 
            onTogglePro={handleTogglePro} 
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