
import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (
    prompt: string, 
    aspectRatio: Settings['aspectRatio'], 
    numImages: number,
    quality: Settings['quality']
): Promise<string[]> => {
    // Model selection based on requested quality
    const modelName = quality === 'Standard' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';

    const generateSingle = async (): Promise<string | null> => {
        try {
            // ALWAYS create a new GoogleGenAI instance right before making an API call to use the latest key
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // imageSize is only supported for gemini-3-pro-image-preview
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

            // Iterate through all parts to find the image part as per guidelines
            const parts = response.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
            return null;
        } catch (error: any) {
            console.error(`Engine Error:`, error);
            throw error;
        }
    };

    // Parallel generation requests
    const results = await Promise.all(
        Array.from({ length: numImages }).map(() => generateSingle())
    );
    
    const images = results.filter((img): img is string => img !== null);

    if (images.length === 0) {
        throw new Error("A rede neural não conseguiu processar sua visão. Tente outro prompt.");
    }

    return images;
};

export const generateTitle = async (prompt: string): Promise<string> => {
    try {
        // ALWAYS create a new GoogleGenAI instance right before making an API call
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `Crie um título artístico de 3 palavras para esta descrição: "${prompt}"`,
        });
        // Correctly access text property (not a method)
        return response.text?.trim() || "Obra Zion";
    } catch (error) {
        console.error("Title Generation Error:", error);
        return "Obra Zion";
    }
};
