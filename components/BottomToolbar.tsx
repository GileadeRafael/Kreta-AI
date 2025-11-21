
import React, { useState, useRef, useEffect } from 'react';
import type { Settings, GenerationState } from '../types';
import { Button } from './ui/Button';
import { GearIcon } from './icons/GearIcon';
import { ImagePlusIcon } from './icons/ImagePlusIcon';
import { XIcon } from './icons/XIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';

interface BottomToolbarProps {
    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    generationState: GenerationState;
    handleGenerate: (promptOverride?: string) => void;
}

const aspectRatios: Settings['aspectRatio'][] = ['1:1', '9:16', '16:9', '3:4', '4:3'];
const numImagesOptions = [1, 2, 3, 4];

export const BottomToolbar: React.FC<BottomToolbarProps> = ({ prompt, setPrompt, settings, setSettings, generationState, handleGenerate }) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setSettingsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const handleSettingChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = e.target.files;
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (event.target?.result) {
                            setImagePreviews(prev => [...prev, event.target.result as string]);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
            e.target.value = '';
        }
    };
    
    const removeImage = (indexToRemove: number) => {
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
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
            // Reset height to auto to ensure scrollHeight is calculated correctly based on content
            textarea.style.height = 'auto';
            // Set the height to scrollHeight or max limit, but default to small if empty
            const newHeight = Math.min(textarea.scrollHeight, 150);
            textarea.style.height = `${newHeight}px`;
        }
    }, [prompt]);


    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center items-center pointer-events-none" ref={wrapperRef}>
            <div className="w-full max-w-3xl flex flex-col items-center pointer-events-auto gap-3">
                
                {/* Settings Panel */}
                <div className={`w-full transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] origin-bottom ${settingsOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
                     <div className="glass-panel p-5 rounded-2xl bg-[#1c1026]/90 shadow-2xl border border-violet-500/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-violet-300 mb-3 block uppercase tracking-wider">Quantity</label>
                                <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
                                    {numImagesOptions.map(num => (
                                        <button 
                                            key={num} 
                                            onClick={() => handleSettingChange('numImages', num)} 
                                            className={`flex-1 text-sm py-2 rounded-md transition-all duration-200 font-medium ${settings.numImages === num ? 'bg-violet-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="text-xs font-bold text-violet-300 mb-3 block uppercase tracking-wider">Aspect Ratio</label>
                                <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/5 overflow-x-auto">
                                     {aspectRatios.map(ratio => (
                                        <button 
                                            key={ratio} 
                                            onClick={() => handleSettingChange('aspectRatio', ratio)} 
                                            className={`flex-1 min-w-[50px] text-xs py-2 rounded-md transition-all duration-200 font-medium ${settings.aspectRatio === ratio ? 'bg-orange-500 text-white shadow-lg' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {ratio}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Input Bar */}
                <div className="w-full relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative flex items-center gap-2 bg-[#130a1b] border border-white/10 rounded-2xl p-2 shadow-2xl">
                        <Button variant="ghost" className="w-10 h-10 p-0 rounded-xl flex-shrink-0 text-neutral-400 hover:text-violet-400 self-center" onClick={handleImageButtonClick}>
                            <ImagePlusIcon className="w-5 h-5"/>
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
                        
                        <div className="flex-grow flex flex-col justify-center">
                            {imagePreviews.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap mb-2 px-1 pt-1">
                                    {imagePreviews.map((src, index) => (
                                        <div key={index} className="relative group/img animate-fade-in-blur">
                                            <img src={src} alt={`preview ${index + 1}`} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                                            <button 
                                                onClick={() => removeImage(index)} 
                                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-all shadow-sm transform scale-75 group-hover/img:scale-100"
                                                aria-label="Remove image"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <textarea
                                ref={textareaRef}
                                value={prompt}
                                onChange={handlePromptChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Imagine something amazing..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 text-base px-2 py-2 resize-none overflow-y-auto max-h-48 focus:outline-none leading-relaxed font-medium"
                                rows={1}
                                style={{ height: '40px' }} 
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 self-center">
                            <Button 
                                variant="ghost" 
                                onClick={() => setSettingsOpen(!settingsOpen)} 
                                className={`w-10 h-10 p-0 rounded-xl flex-shrink-0 transition-colors ${settingsOpen ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'}`}
                            >
                                <GearIcon className="w-5 h-5"/>
                            </Button>
                            <Button 
                                onClick={() => handleGenerate()} 
                                variant="gradient" 
                                className="h-10 px-4 rounded-xl flex-shrink-0 flex items-center gap-2" 
                                disabled={generationState === 'GENERATING' || !prompt.trim()}
                            >
                                {generationState === 'GENERATING' ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="hidden sm:inline">Creating...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="hidden sm:inline">Generate</span>
                                        <ArrowUpIcon className="w-5 h-5"/>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="text-[10px] text-neutral-500 font-medium tracking-wide uppercase opacity-60">
                    Powered by Gemini & Imagen 3
                </div>
            </div>
        </div>
    );
};
