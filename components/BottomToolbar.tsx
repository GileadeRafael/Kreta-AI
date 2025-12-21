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
            
            {/* Aspect Ratio Quick Selection */}
            <div className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto ${settingsOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                <div className="glass-card px-3 py-1.5 rounded-2xl flex gap-1.5 border-white/10 bg-black/90 shadow-2xl">
                    {aspectRatios.map(ratio => (
                        <button 
                            key={ratio} 
                            onClick={() => handleSettingChange('aspectRatio', ratio)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${settings.aspectRatio === ratio ? 'bg-[#a3ff12] text-black shadow-[0_0_15px_rgba(163,255,18,0.4)]' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Command Capsule */}
            <div className="w-full max-w-2xl pointer-events-auto relative group">
                {/* Glow Background Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                
                <div className="relative glass-card rounded-[2rem] p-2 flex items-center gap-2 border-white/10 bg-black shadow-2xl">
                    {/* Settings Trigger */}
                    <button 
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${settingsOpen ? 'bg-[#a3ff12] text-black' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                        title="Configurações"
                    >
                        <GearIcon className="w-5 h-5" />
                    </button>

                    {/* Textarea Wrapper */}
                    <div className="flex-grow min-h-[48px] flex items-center py-1">
                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Descreva sua visão artística..."
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-600 text-sm font-medium px-1 resize-none focus:outline-none max-h-[160px] leading-relaxed overflow-y-auto align-middle"
                            rows={1}
                        />
                    </div>

                    {/* Generate Button - Neon Green Update */}
                    <button 
                        onClick={() => handleGenerate()} 
                        disabled={generationState === 'GENERATING' || !prompt.trim()}
                        className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#a3ff12] rounded-2xl text-black shadow-[0_0_20px_rgba(163,255,18,0.4)] disabled:opacity-20 disabled:grayscale hover:scale-[1.05] active:scale-95 transition-all group/btn hover:shadow-[0_0_30px_rgba(163,255,18,0.6)]"
                    >
                        {generationState === 'GENERATING' ? (
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            <ArrowUpIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Subtitle / Version */}
            <div className="text-[9px] uppercase font-bold tracking-[0.4em] text-neutral-600 select-none">
                Zion Frame <span className="text-[#a3ff12]/40 mx-1">●</span> v2.5 Stable
            </div>
        </div>
    );
};