

import React, { useState, useRef, useEffect } from 'react';
import type { Settings, GenerationState } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { GearIcon } from './icons/GearIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ImagePlusIcon } from './icons/ImagePlusIcon';
import { XIcon } from './icons/XIcon';

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
            // Fix: Use a standard for-loop to iterate over the FileList, which is more type-safe.
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
            e.target.value = ''; // Allow re-selecting the same files
        }
    };
    
    const removeImage = (indexToRemove: number) => {
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to recalculate
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
        }
    }, [prompt]);


    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20" ref={wrapperRef}>
            <div className={`relative transition-all duration-300 ease-in-out ${settingsOpen ? 'mb-4' : 'mb-0'}`}>
                <div className={`absolute bottom-full w-full transition-all duration-300 ease-in-out ${settingsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                     <Card className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-neutral-400 mb-2 block">Number of Images</label>
                                <div className="flex items-center gap-2">
                                    {numImagesOptions.map(num => (
                                        <button key={num} onClick={() => handleSettingChange('numImages', num)} className={`w-full text-sm py-1.5 rounded-md transition-colors ${settings.numImages === num ? 'bg-sky-500 text-white' : 'bg-neutral-700 hover:bg-neutral-600'}`}>
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="text-xs text-neutral-400 mb-2 block">Aspect Ratio</label>
                                <div className="flex items-center gap-2">
                                     {aspectRatios.map(ratio => (
                                        <button key={ratio} onClick={() => handleSettingChange('aspectRatio', ratio)} className={`w-full text-sm py-1.5 rounded-md transition-colors ${settings.aspectRatio === ratio ? 'bg-sky-500 text-white' : 'bg-neutral-700 hover:bg-neutral-600'}`}>
                                            {ratio}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="flex items-end gap-2 bg-[#1c1c1c] border border-[#2d2d3d] rounded-2xl p-2 shadow-lg backdrop-blur-sm bg-opacity-80">
                <Button variant="ghost" className="w-10 h-10 p-0 rounded-full flex-shrink-0" onClick={handleImageButtonClick}><ImagePlusIcon className="w-5 h-5"/></Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
                
                <div className="flex-grow flex flex-col justify-center">
                    {imagePreviews.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap mb-2 px-2 pt-1">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative group">
                                    <img src={src} alt={`preview ${index + 1}`} className="w-14 h-14 rounded-md object-cover" />
                                    <button 
                                        onClick={() => removeImage(index)} 
                                        className="absolute -top-1.5 -right-1.5 bg-neutral-900 border border-neutral-700 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        <XIcon className="w-3.5 h-3.5 text-neutral-300" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Describe your vision..."
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 text-sm px-2 py-2 resize-none overflow-y-auto max-h-48 focus:outline-none"
                        rows={1}
                    />
                </div>
                
                <Button variant="ghost" onClick={() => setSettingsOpen(!settingsOpen)} className="w-10 h-10 p-0 rounded-full flex-shrink-0"><GearIcon className="w-5 h-5"/></Button>
                <Button onClick={() => handleGenerate()} variant="primary" className="w-10 h-10 rounded-full p-0 flex-shrink-0" disabled={generationState === 'GENERATING'}>
                    {generationState === 'GENERATING' ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : <ArrowUpIcon className="w-5 h-5"/>}
                </Button>
            </div>
        </div>
    );
};