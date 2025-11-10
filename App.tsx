
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage, Canvas } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini-api-key'));
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(!localStorage.getItem('gemini-api-key'));
  
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [activeCanvasId, setActiveCanvasId] = useState<string | null>(null);
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

  const imageSpawnCounter = useRef(0);

  // Load canvases from localStorage on initial render
  useEffect(() => {
    const savedCanvases = localStorage.getItem('kreta-canvases');
    if (savedCanvases) {
      const parsedCanvases: Canvas[] = JSON.parse(savedCanvases);
      if (parsedCanvases.length > 0) {
        setCanvases(parsedCanvases);
        // Set the most recent canvas as active
        const latestCanvas = parsedCanvases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        setActiveCanvasId(latestCanvas.id);
        setGeneratedImages(latestCanvas.images);
      } else {
        handleCreateNewCanvas(); // Create a new one if saved is empty
      }
    } else {
      handleCreateNewCanvas(); // Create a new one if nothing is saved
    }
  }, []);

  // Update active canvas's images whenever generatedImages changes
  useEffect(() => {
    if (activeCanvasId) {
      setCanvases(prevCanvases => {
        const newCanvases = prevCanvases.map(canvas =>
          canvas.id === activeCanvasId ? { ...canvas, images: generatedImages } : canvas
        );
        // Check if the update is necessary to prevent infinite loops
        if (JSON.stringify(newCanvases) !== JSON.stringify(prevCanvases)) {
          return newCanvases;
        }
        return prevCanvases;
      });
    }
  }, [generatedImages, activeCanvasId]);

  // Save canvases to localStorage whenever the canvases state changes
  useEffect(() => {
    if (canvases.length > 0) {
      localStorage.setItem('kreta-canvases', JSON.stringify(canvases));
    }
  }, [canvases]);


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
  
  const handleCreateNewCanvas = () => {
    const newCanvas: Canvas = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      images: [],
    };
    setCanvases(prev => [newCanvas, ...prev]);
    setActiveCanvasId(newCanvas.id);
    setGeneratedImages([]);
    imageSpawnCounter.current = 0;
  };

  const handleSwitchCanvas = (canvasId: string) => {
    const canvas = canvases.find(c => c.id === canvasId);
    if (canvas) {
      setActiveCanvasId(canvas.id);
      setGeneratedImages(canvas.images);
      imageSpawnCounter.current = canvas.images.length;
    }
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
            canvases={canvases}
            activeCanvasId={activeCanvasId}
            handleCreateNewCanvas={handleCreateNewCanvas}
            handleSwitchCanvas={handleSwitchCanvas}
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
