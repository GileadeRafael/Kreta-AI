
import React, { useState, useRef, useCallback } from 'react';
import { Preview } from './Preview';
import type { Settings, GenerationState, GeneratedImage } from '../types';
import { BottomToolbar } from './BottomToolbar';
import { ImageModal } from './ImageModal';
import { CreditPill } from './CreditPill';
import { CreditsModal } from './CreditsModal';

interface GeneratorProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  generationState: GenerationState;
  handleGenerate: (promptOverride?: string) => void;
  generatedImages: GeneratedImage[];
  setGeneratedImages: React.Dispatch<React.SetStateAction<GeneratedImage[]>>;
  credits: number | null;
}

export const Generator: React.FC<GeneratorProps> = ({
  prompt,
  setPrompt,
  settings,
  setSettings,
  generationState,
  handleGenerate,
  generatedImages,
  setGeneratedImages,
  credits,
}) => {
  const [zoomedImage, setZoomedImage] = useState<GeneratedImage | null>(null);
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [isCreditsModalOpen, setCreditsModalOpen] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const draggedImage = useRef<{ id: string; startX: number; startY: number; mouseStartX: number; mouseStartY: number; } | null>(null);

  const handleVariateClick = (baseImage: GeneratedImage) => {
    setPrompt(baseImage.prompt);
    handleGenerate(baseImage.prompt);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const { clientX, clientY, deltaY } = e;
    const scaleFactor = 1.1;
    const newScale = deltaY < 0 ? scale * scaleFactor : scale / scaleFactor;
    const clampedScale = Math.min(Math.max(newScale, 0.1), 5);

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const mouseX = clientX - canvasRect.left;
    const mouseY = clientY - canvasRect.top;

    const newOriginX = mouseX - (mouseX - origin.x) * (clampedScale / scale);
    const newOriginY = mouseY - (mouseY - origin.y) * (clampedScale / scale);

    setScale(clampedScale);
    setOrigin({ x: newOriginX, y: newOriginY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // The image card's onMouseDown handler calls stopPropagation,
    // so this event will only fire when clicking the canvas background.
    isPanning.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.style.cursor = 'grabbing';
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOrigin(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else if (draggedImage.current) {
      const dx = (e.clientX - draggedImage.current.mouseStartX) / scale;
      const dy = (e.clientY - draggedImage.current.mouseStartY) / scale;
      const newX = draggedImage.current.startX + dx;
      const newY = draggedImage.current.startY + dy;

      setGeneratedImages(prevImages =>
        prevImages.map(img =>
          img.id === draggedImage.current?.id ? { ...img, x: newX, y: newY } : img
        )
      );
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;
    draggedImage.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  const handleImageDragStart = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const image = generatedImages.find(img => img.id === id);
    if (image) {
      draggedImage.current = {
        id,
        startX: image.x,
        startY: image.y,
        mouseStartX: e.clientX,
        mouseStartY: e.clientY,
      };
    }
  }, [generatedImages]);

  return (
    <div className="w-full h-full p-0 lg:p-0 relative" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div 
        ref={canvasRef}
        className="w-full h-full relative overflow-hidden cursor-grab"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="absolute top-0 left-0"
          style={{ transform: `translate(${origin.x}px, ${origin.y}px) scale(${scale})`, transformOrigin: '0 0' }}
        >
          <Preview
            generationState={generationState}
            generatedImages={generatedImages}
            onImageClick={(image) => setZoomedImage(image)}
            onVariateClick={handleVariateClick}
            onImageDragStart={handleImageDragStart}
          />
        </div>
      </div>

      <BottomToolbar
        prompt={prompt}
        setPrompt={setPrompt}
        settings={settings}
        setSettings={setSettings}
        generationState={generationState}
        handleGenerate={handleGenerate}
      />

      <CreditPill 
        credits={credits}
        onClick={() => setCreditsModalOpen(true)}
      />

      {zoomedImage && (
        <ImageModal
          image={zoomedImage}
          onClose={() => setZoomedImage(null)}
        />
      )}

      {isCreditsModalOpen && (
        <CreditsModal 
          onClose={() => setCreditsModalOpen(false)}
        />
      )}
    </div>
  );
};
