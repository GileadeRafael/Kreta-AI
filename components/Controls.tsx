
import React from 'react';
import type { Canvas } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PlusIcon } from './icons/PlusIcon';

interface ControlsProps {
  canvases: Canvas[];
  activeCanvasId: string | null;
  onCreateNewCanvas: () => void;
  onSwitchCanvas: (id: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({ canvases, activeCanvasId, onCreateNewCanvas, onSwitchCanvas }) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-semibold text-white">My Canvases</h2>
                <Button variant="primary" onClick={onCreateNewCanvas} className="py-1.5 px-3 text-xs">
                    <PlusIcon className="w-4 h-4 mr-1.5"/>
                    New Canvas
                </Button>
            </div>
            <div className="flex-grow overflow-y-auto -mr-2 pr-2">
                <div className="space-y-2">
                    {canvases.map(canvas => (
                        <button
                            key={canvas.id}
                            onClick={() => onSwitchCanvas(canvas.id)}
                            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 border-2 ${activeCanvasId === canvas.id ? 'bg-sky-500/10 border-sky-500' : 'bg-neutral-800/50 border-transparent hover:bg-neutral-700/70'}`}
                        >
                            <p className="text-sm font-medium text-white">{formatDate(canvas.createdAt)}</p>
                            <p className="text-xs text-neutral-400">{canvas.images.length} image{canvas.images.length !== 1 ? 's' : ''}</p>
                        </button>
                    ))}
                </div>
            </div>
        </Card>
    );
};
