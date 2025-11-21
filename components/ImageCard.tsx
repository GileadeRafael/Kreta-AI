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

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = src;
        link.download = `${title.replace(/\s+/g, '_') || 'generated-image'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className={`absolute group rounded-2xl overflow-hidden ${!isLoading ? 'cursor-grab active:cursor-grabbing' : 'cursor-wait'} shadow-2xl transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]`}
            style={{ 
                left: `${x}px`, 
                top: `${y}px`, 
                width: '320px',
                backgroundColor: '#1c1026',
                border: '1px solid rgba(255,255,255,0.05)'
            }}
            onMouseDown={isLoading ? undefined : onDragStart}
        >
            <div className={`${aspectRatioMap[aspectRatio]} w-full overflow-hidden relative`}>
                {isLoading ? (
                    <div className="loading-placeholder absolute inset-0"></div>
                ) : (
                    <img src={src} alt={prompt} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 animate-fade-in-blur" />
                )}
                
                {/* Gradient Overlay */}
                 {!isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0715] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                 )}
            </div>
            
            {!isLoading && (
              <>
                {/* Top Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-[-10px] group-hover:translate-y-0">
                    <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-lg">
                        <button onClick={onVariateClick} className="p-2 hover:bg-violet-500 rounded-full text-white transition-colors" title="Variate">
                            <WandSparklesIcon className="w-4 h-4"/>
                        </button>
                        <button onClick={onZoomClick} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors" title="Zoom">
                            <ZoomInIcon className="w-4 h-4"/>
                        </button>
                        <button onClick={handleDownload} className="p-2 hover:bg-orange-500 rounded-full text-white transition-colors" title="Download">
                            <DownloadIcon className="w-4 h-4"/>
                        </button>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[10px] group-hover:translate-y-0 pointer-events-none">
                    <h3 className="text-white text-base font-bold mb-1 drop-shadow-md truncate">{title}</h3>
                    <p className="text-neutral-300 text-xs line-clamp-2 font-medium leading-relaxed drop-shadow-md">{prompt}</p>
                </div>
              </>
            )}
        </div>
    );
};