import React, { memo } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { ZoomInIcon } from './icons/ZoomInIcon';
import type { GeneratedImage } from '../types';

interface ImageCardProps {
    image: GeneratedImage;
    onZoomClick: () => void;
    onVariateClick: () => void;
    onDragStart: (e: React.MouseEvent) => void;
}

export const ImageCard: React.FC<ImageCardProps> = memo(({ image, onZoomClick, onVariateClick, onDragStart }) => {
    const { id, src, title, prompt, aspectRatio, x, y, status } = image;
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
            id={`card-${id}`}
            className={`absolute group rounded-2xl overflow-hidden glass-card transition-shadow duration-500 ${!isLoading ? 'cursor-grab active:cursor-grabbing hover:z-20 hover:scale-[1.01] shadow-2xl' : 'cursor-wait animate-pulse'}`}
            style={{ 
                transform: `translate3d(${x}px, ${y}px, 0)`,
                width: '320px',
                borderColor: isLoading ? 'rgba(163, 255, 18, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isLoading ? '0 0 40px rgba(163, 255, 18, 0.1)' : '0 20px 50px rgba(0,0,0,0.4)',
                willChange: 'transform'
            }}
            onMouseDown={isLoading ? undefined : onDragStart}
        >
            {!isLoading && (
                <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 pointer-events-none select-none">
                    <h3 className="text-neutral-300 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 truncate leading-tight">
                        {title}
                    </h3>
                    <p className="text-neutral-500 text-[9px] font-medium truncate opacity-70">
                        "{prompt}"
                    </p>
                </div>
            )}

            <div className={`${aspectRatioMap[aspectRatio]} w-full overflow-hidden relative bg-black/40`}>
                {isLoading ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#a3ff12]/5 via-secondary/5 to-[#a3ff12]/5 animate-pulse flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                             <div className="w-8 h-8 border-2 border-[#a3ff12]/10 border-t-[#a3ff12] rounded-full animate-spin"></div>
                             <span className="text-[8px] font-black tracking-[0.3em] text-[#a3ff12]/80 uppercase">Gerando</span>
                        </div>
                    </div>
                ) : (
                    <img src={src} alt={prompt} className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-1000 group-hover:scale-105" />
                )}
                
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button 
                        onClick={handleDownload} 
                        className="p-3 bg-black/60 backdrop-blur-xl rounded-xl text-white hover:bg-secondary transition-all hover:scale-110 border border-white/10 shadow-lg"
                        title="Download"
                    >
                        <DownloadIcon className="w-5 h-5"/>
                    </button>
                    <button 
                        onClick={onZoomClick} 
                        className="p-3 bg-black/60 backdrop-blur-xl rounded-xl text-white hover:bg-[#a3ff12] hover:text-black transition-all hover:scale-110 border border-white/10 shadow-lg"
                        title="Expandir"
                    >
                        <ZoomInIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>

            {!isLoading && (
                <div className="px-4 py-1.5 flex justify-between items-center bg-black/20 pointer-events-none select-none">
                     <span className="text-[7px] font-bold text-neutral-600 uppercase tracking-widest">{aspectRatio} FRAME</span>
                     <div className="w-1 h-1 rounded-full bg-[#a3ff12]/30 animate-pulse"></div>
                </div>
            )}
        </div>
    );
});