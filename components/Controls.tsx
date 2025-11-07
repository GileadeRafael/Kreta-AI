import React from 'react';
import type { Settings } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { UploadIcon } from './icons/UploadIcon';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface ControlsProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const stylePresets = [
    { name: 'Cinematic', img: 'https://picsum.photos/seed/cinematic/150' },
    { name: 'Vintage', img: 'https://picsum.photos/seed/vintage/150' },
    { name: 'Photorealistic', img: 'https://picsum.photos/seed/photorealistic/150' },
    { name: 'Anime', img: 'https://picsum.photos/seed/anime/150' },
];

export const Controls: React.FC<ControlsProps> = ({ settings, setSettings }) => {
    const handleSettingChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Card>
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                    type="text"
                    placeholder="Search Style"
                    className="w-full bg-[#0a0a0f] border border-[#2d2d3d] rounded-lg text-sm pl-10 pr-4 py-2 focus:ring-2 focus:ring-sky-500"
                />
            </div>
            <div className="flex items-center gap-2 mb-4">
                {['All', 'My Style'].map(tab => (
                    <button key={tab} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${tab === 'All' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:bg-neutral-800'}`}>
                        {tab}
                    </button>
                ))}
                <div className="flex-grow"></div>
                <Button variant="ghost" className="p-2"><UploadIcon className="w-5 h-5"/></Button>
                <Button variant="ghost" className="p-2 bg-neutral-700"><PlusIcon className="w-5 h-5"/> New Style</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {stylePresets.map(preset => (
                    <div
                        key={preset.name}
                        onClick={() => handleSettingChange('style', preset.name)}
                        className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 relative group ${settings.style === preset.name ? 'border-sky-500' : 'border-transparent hover:border-sky-500/50'}`}
                    >
                        <img src={preset.img} alt={preset.name} className="w-full h-24 object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <p className="text-sm font-medium text-white absolute bottom-2 left-3">{preset.name}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};