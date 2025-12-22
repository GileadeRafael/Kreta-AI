
import React, { useState, useRef, useEffect } from 'react';
import type { Settings, GenerationState } from '../types';
import { GearIcon } from './icons/GearIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';

interface BottomToolbarProps {
    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    generationState: GenerationState;
    handleGenerate: (promptOverride?: string) => void;
}

const aspectRatios: Settings['aspectRatio'][] = ['1:1', '9:16', '16:9', '4:3', '3:4'];
const qualities: Settings['quality'][] = ['Standard', 'HD'];
const imageCounts = [1, 2, 3, 4];

export const BottomToolbar: React.FC<BottomToolbarProps> = ({ prompt, setPrompt, settings, setSettings, generationState, handleGenerate }) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSettingChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
        }
    }

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        }
    }, [prompt]);

    return (
        <div className="fixed bottom-10 left-0 right-0 z-50 px-4 flex flex-col items-center gap-4 pointer-events-none">
            
            <div className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto ${settingsOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                <div className="glass-card p-6 rounded-[2.5rem] flex flex-col gap-6 border-primary/10 bg-black/95 shadow-[0_40px_80px_-15px_rgba(0,0,0,1)] min-w-[360px]">
                    
                    <div>
                        <span className="text-[9px] font-black text-neutral-600 tracking-[0.3em] uppercase mb-3 block ml-1">Fidelidade Zion</span>
                        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl">
                            {qualities.map(q => (
                                <button 
                                    key={q} 
                                    onClick={() => handleSettingChange('quality', q)}
                                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${settings.quality === q ? 'bg-primary text-black shadow-[0_0_20px_rgba(163,255,18,0.3)]' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    {q === 'Standard' ? 'FLASH (Veloz)' : 'PRO (Supremo)'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <span className="text-[9px] font-black text-neutral-600 tracking-[0.3em] uppercase mb-3 block ml-1">Escala Geométrica</span>
                            <div className="flex gap-1.5 bg-white/5 p-1 rounded-2xl">
                                {aspectRatios.map(ratio => (
                                    <button 
                                        key={ratio} 
                                        onClick={() => handleSettingChange('aspectRatio', ratio)}
                                        className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${settings.aspectRatio === ratio ? 'bg-primary text-black' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-2">
                            <span className="text-[9px] font-black text-neutral-600 tracking-[0.3em] uppercase mb-3 block ml-1">Iterações de Rede</span>
                            <div className="flex gap-1.5 bg-white/5 p-1 rounded-2xl">
                                {imageCounts.map(count => (
                                    <button 
                                        key={count} 
                                        onClick={() => handleSettingChange('numImages', count)}
                                        className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${settings.numImages === count ? 'bg-primary text-black' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {count}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl pointer-events-auto relative group">
                <div className="absolute -inset-1 bg-primary/10 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                
                <div className="relative glass-card rounded-[2.2rem] p-2.5 flex items-center gap-3 border-primary/20 bg-black/90 shadow-2xl backdrop-blur-3xl">
                    <button 
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${settingsOpen ? 'bg-primary text-black shadow-[0_0_20px_rgba(163,255,18,0.4)] rotate-90' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                        title="Configurações"
                    >
                        <GearIcon className="w-6 h-6" />
                    </button>

                    <div className="flex-grow min-h-[48px] flex items-center py-1">
                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Descreva sua visão no Zion Frame..."
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-700 text-sm font-semibold px-2 resize-none focus:outline-none max-h-[160px] leading-relaxed overflow-y-auto align-middle"
                            rows={1}
                        />
                    </div>

                    <button 
                        onClick={() => handleGenerate()} 
                        disabled={generationState === 'GENERATING' || !prompt.trim()}
                        className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary rounded-2xl text-black shadow-[0_0_30px_rgba(163,255,18,0.5)] disabled:opacity-20 hover:scale-[1.05] active:scale-95 transition-all"
                    >
                        {generationState === 'GENERATING' ? (
                            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            <ArrowUpIcon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            <div className="text-[8px] uppercase font-black tracking-[0.8em] text-neutral-700 select-none">
                Zion Frame <span className="text-primary/40 mx-2">●</span> Pure Engine v3.0
            </div>
        </div>
    );
};
