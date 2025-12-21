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
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    }, [prompt]);

    return (
        <div className="fixed bottom-10 left-0 right-0 z-50 px-4 flex flex-col items-center gap-6 pointer-events-none">
            
            {/* Aspect Ratio Quick Selection */}
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto ${settingsOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-90 pointer-events-none'}`}>
                <div className="glass-card px-4 py-2 rounded-2xl flex gap-2 border-white/10 bg-black/80">
                    {aspectRatios.map(ratio => (
                        <button 
                            key={ratio} 
                            onClick={() => handleSettingChange('aspectRatio', ratio)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${settings.aspectRatio === ratio ? 'bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Command Capsule */}
            <div className="w-full max-w-2xl pointer-events-auto relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                
                <div className="relative glass-card rounded-[1.8rem] p-3 flex items-end gap-3 border-white/10 bg-black shadow-2xl overflow-hidden">
                    <button 
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className={`p-4 rounded-2xl transition-all ${settingsOpen ? 'bg-primary text-white' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <GearIcon className="w-5 h-5" />
                    </button>

                    <div className="flex-grow pb-1">
                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Descreva sua visão artística..."
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-600 text-sm font-semibold py-3 px-1 resize-none focus:outline-none min-h-[48px] max-h-[140px] leading-relaxed"
                            rows={1}
                        />
                    </div>

                    <button 
                        onClick={() => handleGenerate()} 
                        disabled={generationState === 'GENERATING' || !prompt.trim()}
                        className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl text-white shadow-xl disabled:opacity-30 disabled:grayscale hover:scale-[1.03] active:scale-95 transition-all group/btn"
                    >
                        {generationState === 'GENERATING' ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                        ) : (
                            <ArrowUpIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            <div className="text-[9px] uppercase font-black tracking-[0.5em] text-neutral-600">
                Neural Interface <span className="text-primary/50 mx-2">●</span> Obsidian Edition
            </div>
        </div>
    );
};