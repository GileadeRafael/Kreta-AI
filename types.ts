
export type GenerationState = 'IDLE' | 'GENERATING' | 'COMPLETE' | 'ERROR';

export interface Settings {
  style: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  creativity: number;
  negativePrompt: string;
  numImages: number;
  quality: 'Standard' | 'HD' | '4K';
}

export interface ToastInfo {
  message: string;
  type: 'success' | 'error';
}

export interface GeneratedImage {
  id: string;
  src: string;
  title: string;
  prompt: string;
  aspectRatio: Settings['aspectRatio'];
  x: number;
  y: number;
  status?: 'loading' | 'complete';
}

export interface Canvas {
  id: string;
  title: string;
  createdAt: string;
  images: GeneratedImage[];
}