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
        link.download = `${title.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className={`absolute group rounded-2xl overflow-hidden glass-card transition-all duration-500 ${!isLoading ? 'cursor-grab active:cursor-grabbing hover:z-20 hover:scale-[1.05] shadow-2xl' : 'cursor-wait animate-pulse'}`}
            style={{ 
                left: `${x}px`, 
                top: `${y}px`, 
                width: '320px',
                borderColor: isLoading ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                boxShadow: isLoading ? '0 0 40px rgba(139, 92, 246, 0.1)' : '0 20px 50px rgba(0,0,0,0.5)'
            }}
            onMouseDown={isLoading ? undefined : onDragStart}
        >
            {/* High-definition Glow on Hover */}
            {!isLoading && (
                <div className="absolute -inset-px bg-gradient-to-br from-primary/30 to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
            )}

            <div className={`${aspectRatioMap[aspectRatio]} w-full overflow-hidden relative bg-black`}>
                {isLoading ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 animate-pulse flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                             <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                             <span className="text-[9px] font-black tracking-[0.3em] text-primary/80 uppercase">Manifestando</span>
                        </div>
                    </div>
                ) : (
                    <img src={src} alt={prompt} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
            
            {!isLoading && (
              <>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-500 z-10">
                    <button onClick={handleDownload} className="p-2.5 bg-black/60 backdrop-blur-xl rounded-xl text-white hover:bg-secondary transition-colors border border-white/10 shadow-lg">
                        <DownloadIcon className="w-4 h-4"/>
                    </button>
                    <button onClick={onZoomClick} className="p-2.5 bg-black/60 backdrop-blur-xl rounded-xl text-white hover:bg-primary transition-colors border border-white/10 shadow-lg">
                        <ZoomInIcon className="w-4 h-4"/>
                    </button>
                </div>

                <div className="p-5 relative z-10 opacity-0 group-hover:opacity-100 translate-y-[10px] group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white text-base font-black mb-1 futuristic-gradient-text uppercase tracking-tight">{title}</h3>
                    <p className="text-neutral-400 text-[9px] line-clamp-1 font-bold uppercase tracking-[0.15em] opacity-80">{prompt}</p>
                </div>
              </>
            )}
        </div>
    );
};