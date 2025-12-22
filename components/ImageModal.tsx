import React from 'react';
import type { GeneratedImage } from '../types';
import { XIcon } from './icons/XIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface ImageModalProps {
  image: GeneratedImage;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `${image.title.replace(/\s+/g, '_') || 'zion-frame-artifact'}.png`;
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
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-0 md:p-6 lg:p-12 animate-fade-in backdrop-blur-2xl"
            onClick={onClose}
        >
            <div 
                className="bg-[#050505] border border-white/10 w-full max-w-[1400px] h-full max-h-[900px] flex flex-col md:flex-row relative overflow-hidden shadow-[0_0_120px_rgba(0,0,0,1)] animate-scale-in md:rounded-[3.5rem]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visual Canvas Area */}
                <div className="flex-[1.8] bg-[#020202] flex items-center justify-center p-6 md:p-12 relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5 group/canvas">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#a3ff12]/10 rounded-full blur-[150px]"></div>
                    </div>

                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img 
                            src={image.src} 
                            alt={image.prompt} 
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.9)] border border-white/5 transition-transform duration-1000 group-hover/canvas:scale-[1.01]"
                        />
                    </div>
                    
                    <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                         <div className="w-2 h-2 rounded-full bg-[#a3ff12] animate-pulse shadow-[0_0_10px_#a3ff12]"></div>
                         <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Zion Artifact Pro</span>
                    </div>
                </div>

                {/* Technical Side-Panel */}
                <div className="flex-1 w-full md:max-w-[440px] flex flex-col bg-[#080808] p-10 md:p-14">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-14">
                             <div className="flex items-center gap-3">
                                <MagicWandIcon className="w-5 h-5 text-[#a3ff12]" />
                                <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">Metadata Analysis</span>
                             </div>
                             <button 
                                onClick={onClose} 
                                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-all transform hover:rotate-90"
                            >
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-6xl font-black text-white mb-6 leading-[0.85] uppercase tracking-tighter">
                                {image.title}
                            </h2>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#a3ff12]/10 border border-[#a3ff12]/20 rounded-xl">
                                <span className="text-[10px] font-black text-[#a3ff12] uppercase tracking-[0.2em]">Verified Output</span>
                            </div>
                        </div>

                        <div className="mb-12 group/prompt">
                            <h3 className="text-[10px] font-black text-neutral-600 mb-5 uppercase tracking-[0.4em] flex items-center gap-3">
                                <div className="w-1.5 h-4 bg-[#a3ff12]/30 rounded-full"></div>
                                Vision Prompt
                            </h3>
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-br from-[#a3ff12]/5 to-transparent rounded-[2rem] opacity-0 group-hover/prompt:opacity-100 transition-opacity"></div>
                                <div className="relative bg-white/[0.03] p-7 rounded-[2rem] border border-white/5 min-h-[120px]">
                                    <p className="text-neutral-300 text-sm leading-relaxed font-medium italic">
                                        "{image.prompt}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-auto">
                            {[
                                { label: 'Resolução', val: '2K (1024px)' },
                                { label: 'Ratio', val: image.aspectRatio },
                                { label: 'Model', val: 'Gemini 3 Pro' },
                                { label: 'Engine', val: 'Zion v2.5' }
                            ].map((spec, i) => (
                                <div key={i} className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 transition-colors hover:bg-white/[0.04]">
                                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest block mb-2">{spec.label}</span>
                                    <span className="text-white text-xs font-bold tracking-tight uppercase">{spec.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-14">
                            <button 
                                onClick={handleDownload} 
                                className="w-full relative group/btn overflow-hidden flex items-center justify-center gap-4 rounded-2xl py-6 transition-all duration-500 bg-[#a3ff12] hover:bg-white active:scale-95 shadow-[0_25px_50px_rgba(163,255,18,0.2)]"
                            >
                                <DownloadIcon className="w-6 h-6 text-black transition-transform duration-500 group-hover/btn:scale-110" />
                                <span className="text-xs font-black text-black uppercase tracking-[0.4em]">Export Artwork</span>
                            </button>
                            <p className="text-[9px] text-neutral-700 mt-6 text-center uppercase font-bold tracking-[0.5em]">Safe Archive Encryption Active</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; backdrop-filter: blur(0px); }
                    to { opacity: 1; backdrop-filter: blur(24px); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.97) translateY(30px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-scale-in { animation: scaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};