import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';

function App() {
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };
  
  const handleClearCanvas = () => {
    setGeneratedImages([]);
    imageSpawnCounter.current = 0;
    showToast('Canvas limpo com sucesso.', 'success');
  }

  const handleGenerate = useCallback(async (promptOverride?: string) => {
    const activePrompt = promptOverride || prompt;
    if (!activePrompt.trim()) {
      showToast('Por favor, digite um prompt para gerar uma imagem.', 'error');
      return;
    }

    setGenerationState('GENERATING');

    const currentCounter = imageSpawnCounter.current;
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
    
    imageSpawnCounter.current += settings.numImages;
    setGeneratedImages(prev => [...prev, ...placeholders]);

    try {
      const images = await generateImage(activePrompt, settings.aspectRatio, settings.numImages);
      
      let title = "Obra de Zion";
      try {
         title = await generateTitle(activePrompt);
      } catch (e) {
        console.warn("Falha ao gerar título");
      }
      
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
          } else if (imageIndex !== -1) {
            newImages.splice(imageIndex, 1);
          }
        });
        return newImages;
      });

      setGenerationState('COMPLETE');
      showToast(`Imagem gerada com sucesso.`, 'success');
    } catch (error: any) {
      console.error('Falha na geração:', error);
      const placeholderIds = placeholders.map(p => p.id);
      setGeneratedImages(prev => prev.filter(img => !placeholderIds.includes(img.id)));
      setGenerationState('ERROR');
      
      showToast(error.message || 'Houve um erro na transmissão.', 'error');
    }
  }, [prompt, settings]);

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
        
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;