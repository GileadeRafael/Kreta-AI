
import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (
    prompt: string, 
    aspectRatio: Settings['aspectRatio'], 
    numImages: number,
    quality: Settings['quality']
): Promise<string[]> => {
    // A chave é injetada automaticamente em process.env.API_KEY pelo sistema aistudio
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        throw new Error("API Key não encontrada. Por favor, reconecte sua conta.");
    }

    const modelName = quality === 'Standard' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';

    const generateSingle = async (): Promise<string | null> => {
        try {
            // Criamos a instância aqui para garantir que pegamos a chave mais recente
            const ai = new GoogleGenAI({ apiKey });
            
            const imageSize = quality === '4K' ? '4K' : (quality === 'HD' ? '2K' : '1K');

            const response = await ai.models.generateContent({
                model: modelName,
                contents: {
                    parts: [{ text: prompt }]
                },
                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio,
                        ...(modelName === 'gemini-3-pro-image-preview' && { imageSize })
                    }
                },
            });

            // Itera pelas partes para encontrar a imagem (conforme diretrizes)
            const parts = response.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
            return null;
        } catch (error: any) {
            console.error(`Erro na geração:`, error);
            throw error;
        }
    };

    const results = await Promise.all(
        Array.from({ length: numImages }).map(() => generateSingle())
    );
    
    const images = results.filter((img): img is string => img !== null);

    if (images.length === 0) {
        throw new Error("Não foi possível gerar imagens. Tente um prompt diferente.");
    }

    return images;
};

export const generateTitle = async (prompt: string): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "Arte Zion";
    
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `Responda com apenas 3 palavras: um título artístico para "${prompt}"`,
        });
        return response.text?.trim() || "Arte Zion";
    } catch (error) {
        return "Arte Zion";
    }
};
