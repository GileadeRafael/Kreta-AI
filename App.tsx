
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';
import { ApiKeyModal } from './components/ApiKeyModal';

function App() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const [prompt, setPrompt] = useState<string>('');
  const [settings, setSettings] = useState<Settings>({
    style: 'Cinematic',
    aspectRatio: '9:16',
    creativity: 75,
    negativePrompt: '',
    numImages: 1,
    quality: 'HD',
  });
  
  const [generationState, setGenerationState] = useState<GenerationState>('IDLE');
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const imageSpawnCounter = useRef(0);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };
  
  const handleClearCanvas = () => {
    setGeneratedImages([]);
    imageSpawnCounter.current = 0;
    showToast('Canvas cleared.', 'success');
  }

  const handleApiKeySubmit = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('gemini-api-key', newApiKey);
    setIsApiKeyModalOpen(false);
    showToast('API Key saved successfully!', 'success');
  };

  const handleChangeApiKey = () => {
    setApiKey(null);
    localStorage.removeItem('gemini-api-key');
    setIsApiKeyModalOpen(true);
  };

  const handleGenerate = useCallback(async (promptOverride?: string) => {
    const activePrompt = promptOverride || prompt;
    if (!apiKey) {
      showToast('Please set your API Key before generating.', 'error');
      setIsApiKeyModalOpen(true);
      return;
    }
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
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('API key not valid')) {
        showToast('Your API key is invalid. Please check and enter it again.', 'error');
        handleChangeApiKey();
      } else {
        showToast('Failed to generate image. Please check your prompt or try again later.', 'error');
      }
    }
  }, [prompt, settings, apiKey]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {isApiKeyModalOpen && <ApiKeyModal onSubmit={handleApiKeySubmit} />}
      <Header onClearCanvas={handleClearCanvas} onChangeApiKey={handleChangeApiKey} />
      <div className="flex flex-1 overflow-hidden">
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
