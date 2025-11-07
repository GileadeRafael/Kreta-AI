
import React from 'react';
import type { GenerationState, GeneratedImage } from '../types';
import { ImageCard } from './ImageCard';

interface PreviewProps {
    generationState: GenerationState;
    generatedImages: GeneratedImage[];
    onImageClick: (image: GeneratedImage) => void;
    onVariateClick: (image: GeneratedImage) => void;
    onImageDragStart: (id: string, e: React.MouseEvent) => void;
}

export const Preview: React.FC<PreviewProps> = ({ generatedImages, onImageClick, onVariateClick, onImageDragStart }) => {
    return (
        <div className="w-full h-full relative" style={{ width: '500vw', height: '500vh' }}>
            {generatedImages.map((image) => (
                <ImageCard
                    key={image.id}
                    image={image}
                    onZoomClick={() => onImageClick(image)}
                    onVariateClick={() => onVariateClick(image)}
                    onDragStart={(e) => onImageDragStart(image.id, e)}
                />
            ))}
        </div>
    );
};