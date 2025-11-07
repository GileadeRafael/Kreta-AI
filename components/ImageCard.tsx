
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { WandSparklesIcon } from './icons/WandSparklesIcon';
import type { GeneratedImage } from '../types';

interface ImageCardProps {
    image: GeneratedImage;
    onZoomClick: () => void;
    onVariateClick: () => void;
    onDragStart: (e: React.MouseEvent) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onZoomClick, onVariateClick, onDragStart }) => {
    const { src, title, prompt, aspectRatio, x, y, status } = image;
    const isLoading = status === 'loading';

    const aspectRatioMap = {
        '1:1': 'aspect-square',
        '16:9': 'aspect-video',
        '9:16': 'aspect-[9/16]',
        '4:3': 'aspect-[4/3]',
        '3:4': 'aspect-[3/4]',
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = src;
        link.download = `${title.replace(/\s+/g, '_') || 'generated-image'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className={`absolute group overflow-hidden rounded-xl ${!isLoading ? 'cursor-grab' : 'cursor-wait'} bg-[#2d2d3d]`}
            style={{ 
                left: `${x}px`, 
                top: `${y}px`, 
                width: '300px' // Define a base width for consistency
            }}
            onMouseDown={isLoading ? undefined : onDragStart}
        >
            <div className={`${aspectRatioMap[aspectRatio]} w-full overflow-hidden`}>
                {isLoading ? (
                    <div className="loading-placeholder"></div>
                ) : (
                    <img src={src} alt={prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 animate-fade-in-blur" />
                )}
            </div>
            
            {!isLoading && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <h3 className="text-white text-sm font-medium bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md max-w-[60%] truncate">{title}</h3>
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm p-1 rounded-lg pointer-events-auto">
                        <button onClick={handleDownload} className="p-1.5 hover:bg-white/20 rounded-md text-white transition-colors" aria-label="Download">
                            <DownloadIcon className="w-4 h-4"/>
                        </button>
                        <button onClick={onZoomClick} className="p-1.5 hover:bg-white/20 rounded-md text-white transition-colors" aria-label="Zoom in">
                            <ZoomInIcon className="w-4 h-4"/>
                        </button>
                        <button onClick={onVariateClick} className="p-1.5 hover:bg-white/20 rounded-md text-white transition-colors" aria-label="Generate variations">
                            <WandSparklesIcon className="w-4 h-4"/>
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <p className="text-neutral-300 text-xs line-clamp-2">{prompt}</p>
                </div>
              </>
            )}
        </div>
    );
};