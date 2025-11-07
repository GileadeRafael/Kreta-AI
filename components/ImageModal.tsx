import React from 'react';
import type { GeneratedImage } from '../types';
import { XIcon } from './icons/XIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageModalProps {
  image: GeneratedImage;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `${image.title.replace(/\s+/g, '_') || 'generated-image'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in-fast"
            onClick={onClose}
        >
             <button 
                onClick={onClose} 
                className="absolute top-6 right-6 z-20 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-neutral-300 hover:text-white transition-all duration-300" 
                aria-label="Close"
            >
                <XIcon className="w-6 h-6" />
            </button>
            <div 
                className="bg-neutral-900/50 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row relative overflow-hidden shadow-2xl shadow-black/40 animate-scale-in-fast"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image Panel */}
                <div className="flex-1 bg-black/30 flex items-center justify-center p-4 md:p-8">
                    <img 
                        src={image.src} 
                        alt={image.prompt} 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg shadow-black/50"
                    />
                </div>

                {/* Details Panel */}
                <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-t md:border-t-0 md:border-l border-white/10 bg-black/20 p-6 flex flex-col">
                    <div className="flex-1 overflow-y-auto pr-2">
                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{image.title}</h2>
                        
                        <h3 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-widest">Prompt</h3>
                        <div className="bg-black/30 p-4 rounded-lg border border-white/10 max-h-64 overflow-y-auto">
                            <p className="text-neutral-300 text-sm leading-relaxed">{image.prompt}</p>
                        </div>
                    </div>

                    <div className="pt-6 flex-shrink-0">
                        <button 
                            onClick={handleDownload} 
                            className="w-full group inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-neutral-900/50 text-white bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-500 hover:to-cyan-300 focus:ring-sky-500/50 px-4 py-3 transform hover:scale-105"
                        >
                            <DownloadIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                            <span>Download Image</span>
                        </button>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-fast { animation: fadeIn 0.3s ease-out forwards; }
                .animate-scale-in-fast { animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                
                /* Custom scrollbar for prompt */
                .overflow-y-auto::-webkit-scrollbar { width: 6px; }
                .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
                .overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
             `}</style>
        </div>
    );
};
