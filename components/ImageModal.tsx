
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
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in-fast backdrop-blur-md"
            onClick={onClose}
        >
            <div 
                className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] w-full max-w-7xl h-full max-h-[92vh] flex flex-col md:flex-row relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-scale-in-fast"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visual Section */}
                <div className="flex-1 bg-black/40 flex items-center justify-center p-4 md:p-12 relative group/img">
                    <img 
                        src={image.src} 
                        alt={image.prompt} 
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] transition-transform duration-700"
                    />
                    
                    {/* Top Left Label */}
                    <div className="absolute top-8 left-8 flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-[#a3ff12] animate-pulse"></div>
                         <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Zion Frame Raw Output</span>
                    </div>
                </div>

                {/* technical Meta Section */}
                <div className="w-full md:w-96 flex-shrink-0 border-t md:border-t-0 md:border-l border-white/5 bg-black/40 p-10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-8">
                             <span className="px-3 py-1 bg-[#a3ff12]/10 text-[#a3ff12] text-[9px] font-black rounded-full uppercase tracking-widest border border-[#a3ff12]/20">Verified Asset</span>
                             <button 
                                onClick={onClose} 
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-neutral-500 hover:text-white transition-all"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Title Style */}
                        <h2 className="text-4xl font-medium text-white mb-2 leading-[0.9] uppercase tracking-tighter">
                            {image.title}
                        </h2>
                        
                        <div className="mt-10 space-y-8">
                            <div>
                                <h3 className="text-[8px] font-black text-neutral-600 mb-3 uppercase tracking-[0.3em]">Descrição do Prompt</h3>
                                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                                    <p className="text-neutral-300 text-xs leading-relaxed font-medium">"{image.prompt}"</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                    <span className="text-[7px] font-black text-neutral-600 uppercase tracking-widest block mb-1">Resolução</span>
                                    <span className="text-white text-xs font-bold uppercase tracking-tight">2048 x 2048 PX</span>
                                </div>
                                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                    <span className="text-[7px] font-black text-neutral-600 uppercase tracking-widest block mb-1">Aspect Ratio</span>
                                    <span className="text-white text-xs font-bold uppercase tracking-tight">{image.aspectRatio} Frame</span>
                                </div>
                                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                    <span className="text-[7px] font-black text-neutral-600 uppercase tracking-widest block mb-1">Modelo Gen</span>
                                    <span className="text-white text-xs font-bold uppercase tracking-tight">Gemini 3 Pro</span>
                                </div>
                                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                    <span className="text-[7px] font-black text-neutral-600 uppercase tracking-widest block mb-1">Processo</span>
                                    <span className="text-white text-xs font-bold uppercase tracking-tight">Zion Engine</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10">
                        {/* Download Button */}
                        <button 
                            onClick={handleDownload} 
                            className="w-full group relative overflow-hidden flex items-center justify-center gap-3 rounded-2xl text-xs font-black transition-all duration-500 text-black bg-[#a3ff12] hover:bg-white px-6 py-5 transform active:scale-95 shadow-[0_15px_30px_rgba(163,255,18,0.2)]"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            <span className="uppercase tracking-[0.2em]">Download</span>
                        </button>
                        <p className="text-[8px] text-neutral-600 mt-4 text-center uppercase font-bold tracking-widest">Acesso seguro criptografado</p>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-fast { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-scale-in-fast { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                .overflow-y-auto::-webkit-scrollbar { width: 4px; }
                .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
                .overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(163, 255, 18, 0.3); border-radius: 2px; }
             `}</style>
        </div>
    );
};
