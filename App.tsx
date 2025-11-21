
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Toast } from './components/ui/Toast';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateImage, generateTitle } from './services/geminiService';
import type { Settings, GenerationState, ToastInfo, GeneratedImage } from './types';

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
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const imageSpawnCounter = useRef(0);

  // Initialize API Key
  useEffect(() => {
    // 1. Check Environment Variable (Priority 1)
    const envKey = process.env.API_KEY;
    if (envKey) {
      setApiKey(envKey);
      return;
    }

    // 2. Check Local Storage (Priority 2)
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // 3. Show Modal if no key found
      setShowApiKeyModal(true);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    const cleanKey = key.trim();
    setApiKey(cleanKey);
    localStorage.setItem('gemini_api_key', cleanKey);
    setShowApiKeyModal(false);
    showToast('API Key saved successfully!', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };
  
  const handleClearCanvas = () => {
    setGeneratedImages([]);
    imageSpawnCounter.current = 0;
    showToast('Canvas cleared.', 'success');
  }

  const handleGenerate = useCallback(async (promptOverride?: string) => {
    const activePrompt = promptOverride || prompt;
    if (!activePrompt.trim()) {
      showToast('Please enter a prompt to generate an image.', 'error');
      return;
    }

    // Aggressively check for API key in local storage if state is empty
    let currentApiKey = apiKey;
    if (!currentApiKey) {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            currentApiKey = storedKey;
            setApiKey(storedKey); // Sync state
        } else if (process.env.API_KEY) {
            currentApiKey = process.env.API_KEY;
            setApiKey(currentApiKey);
        }
    }

    if (!currentApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setGenerationState('GENERATING');

    const currentCounter = imageSpawnCounter.current;
    const placeholders: GeneratedImage[] = Array.from({ length: settings.numImages }).map((_, index) => {
      const spawnOffset = (currentCounter + index) * 20;
      // Calculate center screen roughly
      const startX = window.innerWidth / 2 - 150 + (Math.random() * 40 - 20);
      const startY = window.innerHeight / 2 - 200 + (Math.random() * 40 - 20);
      
      return {
        id: crypto.randomUUID(),
        src: '',
        title: 'Thinking...',
        prompt: activePrompt,
        aspectRatio: settings.aspectRatio,
        x: startX + (index * 30),
        y: startY + (index * 30),
        status: 'loading' as const,
      };
    });
    
    imageSpawnCounter.current += settings.numImages;

    setGeneratedImages(prev => [...prev, ...placeholders]);

    try {
      const images = await generateImage(activePrompt, settings.aspectRatio, settings.numImages, currentApiKey);
      
      let title = "Creation";
      try {
         title = await generateTitle(activePrompt, currentApiKey);
      } catch (e) {
        console.warn("Title generation failed, using default");
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
      showToast(`Images generated successfully!`, 'success');
    } catch (error) {
      console.error('Image generation failed:', error);
      
      const placeholderIds = placeholders.map(p => p.id);
      setGeneratedImages(prev => prev.filter(img => !placeholderIds.includes(img.id)));
      setGenerationState('ERROR');
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      let displayMessage = 'Failed to generate image.';

      if (errorMessage.includes('SAFETY')) {
        displayMessage = 'Prompt blocked due to safety settings.';
      } else if (errorMessage.includes('No image generated')) {
        displayMessage = 'The API returned no images.';
      } else if (errorMessage.includes('403') || errorMessage.includes('401') || errorMessage.includes('API key')) {
        displayMessage = 'Invalid API Key. Please check settings.';
        setShowApiKeyModal(true);
      } else if (errorMessage.includes('429') || errorMessage.includes('Quota')) {
        displayMessage = 'API Quota Exceeded. Try again later.';
      } else {
        displayMessage = errorMessage;
      }
      
      showToast(displayMessage, 'error');
    }
  }, [prompt, settings, apiKey]);

  return (
    <div className="fixed inset-0 flex flex-col bg-transparent overflow-hidden text-white selection:bg-orange-500 selection:text-white">
        <Header onClearCanvas={handleClearCanvas} />
        
        <main className="flex-1 relative overflow-hidden">
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

      {showApiKeyModal && (
        <ApiKeyModal onSubmit={handleApiKeySubmit} />
      )}
    </div>
  );
}

export default App;
