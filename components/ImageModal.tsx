
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
        link.download = `${image.title.replace(/\s+/g, '_') || 'zion-artifact'}.png`;
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
            className="fixed inset-0 bg-black/98 z-[60] flex items-center justify-center p-0 md:p-6 animate-fade-in backdrop-blur-3xl"
            onClick={onClose}
        >
            <div 
                className="bg-[#050505] border border-primary/20 w-full max-w-[1300px] h-full max-h-[850px] flex flex-col md:flex-row relative overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] animate-scale-in md:rounded-[3rem]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-[1.5] bg-[#020202] flex items-center justify-center p-6 md:p-10 relative overflow-hidden border-b md:border-b-0 md:border-r border-primary/10">
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[180px]"></div>
                    </div>

                    <img 
                        src={image.src} 
                        alt={image.prompt} 
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.9)] border border-primary/10"
                    />
                    
                    <div className="absolute top-8 left-8 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-primary/20">
                         <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#a3ff12]"></div>
                         <span className="text-[9px] font-black text-white uppercase tracking-[0.5em]">Artifact Alpha 7</span>
                    </div>
                </div>

                <div className="flex-1 w-full md:max-w-[400px] flex flex-col bg-[#050505] p-10 md:p-12 overflow-y-auto">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-12">
                             <div className="flex items-center gap-3">
                                <MagicWandIcon className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Vision Data</span>
                             </div>
                             <button 
                                onClick={onClose} 
                                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-primary hover:text-black rounded-full text-neutral-400 transition-all transform hover:rotate-90"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-5xl font-black text-white mb-4 leading-none uppercase tracking-tighter">
                                {image.title}
                            </h2>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">Engine Output Verified</span>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-[9px] font-black text-neutral-600 mb-4 uppercase tracking-[0.4em] flex items-center gap-3">
                                <div className="w-1.5 h-3 bg-primary rounded-full"></div>
                                Neural Prompt
                            </h3>
                            <div className="bg-white/[0.03] p-6 rounded-[1.5rem] border border-primary/5">
                                <p className="text-neutral-300 text-sm leading-relaxed font-medium italic">
                                    "{image.prompt}"
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-10">
                            {[
                                { label: 'Resolução', val: 'Native High' },
                                { label: 'Ratio', val: image.aspectRatio },
                                { label: 'Neural Model', val: 'Gemini Pro' },
                                { label: 'Environment', val: 'Zion Grid' }
                            ].map((spec, i) => (
                                <div key={i} className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                    <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest block mb-1">{spec.label}</span>
                                    <span className="text-white text-[10px] font-bold uppercase">{spec.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={handleDownload} 
                                className="w-full flex items-center justify-center gap-4 rounded-xl py-5 transition-all duration-300 bg-primary hover:bg-white text-black active:scale-95 shadow-[0_20px_40px_rgba(163,255,18,0.2)]"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Exportar Obra</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
