
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini-api-key'));
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(!localStorage.getItem('gemini-api-key'));
  const [prompt, setPrompt] = useState<string>('');
  const [settings, setSettings] = useState<Settings>({
    style: 'Cinematic',
    aspectRatio: '9:16',
    creativity: 75,
    negativePrompt: '',
    numImages: 1,
    quality: 'HD',
  });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>('IDLE');
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const imageSpawnCounter = useRef(0);

  const handleApiKeySubmit = (key: string) => {
    const trimmedKey = key.trim();
    if (trimmedKey) {
      setApiKey(trimmedKey);
      localStorage.setItem('gemini-api-key', trimmedKey);
      setIsApiKeyModalOpen(false);
      showToast('API Key saved successfully!', 'success');
    } else {
      showToast('Please enter a valid API Key.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleGenerate = useCallback(async (promptOverride?: string) => {
    if (!apiKey) {
      showToast('API Key is not set. Please set it to generate images.', 'error');
      setIsApiKeyModalOpen(true);
      return;
    }

    const activePrompt = promptOverride || prompt;
    if (!activePrompt.trim()) {
      showToast('Please enter a prompt to generate an image.', 'error');
      return;
    }
    setGenerationState('GENERATING');

    const currentCounter = imageSpawnCounter.current;
    const placeholders: GeneratedImage[] = Array.from({ length: settings.numImages }).map((_, index) => {
      const spawnOffset = (currentCounter + index) * 20;
      return {
        id: crypto.randomUUID(),
        src: '',
        title: 'Generating...',
        prompt: activePrompt,
        aspectRatio: settings.aspectRatio,
        x: 100 + spawnOffset,
        y: 100 + spawnOffset,
        status: 'loading' as const,
      };
    });
    
    imageSpawnCounter.current += settings.numImages;

    setGeneratedImages(prev => [...prev, ...placeholders]);

    try {
      const images = await generateImage(apiKey, activePrompt, settings.aspectRatio, settings.numImages);
      
      let title = "Generated Image";
      if (images.length > 0) {
        title = await generateTitle(apiKey, activePrompt);
      }
      
      setGeneratedImages(prevImages => {
        const newImages = [...prevImages];
        placeholders.forEach((placeholder, index) => {
          const imageIndex = newImages.findIndex(img => img.id === placeholder.id);
          if (imageIndex !== -1 && images[index]) {
            newImages[imageIndex] = {
              ...newImages[imageIndex],
              src: `data:image/png;base64,${images[index]}`,
              title: title,
              status: 'complete' as const,
            };
          }
        });
        return newImages;
      });

      setGenerationState('COMPLETE');
      showToast('Images generated successfully!', 'success');
    } catch (error) {
      console.error('Image generation failed:', error);
      const placeholderIds = placeholders.map(p => p.id);
      setGeneratedImages(prev => prev.filter(img => !placeholderIds.includes(img.id)));
      setGenerationState('ERROR');
      showToast('Failed to generate image. Check your API key or try again.', 'error');
    }
  }, [prompt, settings, apiKey]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {isApiKeyModalOpen && <ApiKeyModal onSubmit={handleApiKeySubmit} />}

      <Header onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} hasApiKey={!!apiKey} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
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
      </div>
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
