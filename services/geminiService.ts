
import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (
    prompt: string, 
    aspectRatio: Settings['aspectRatio'], 
    numImages: number,
    quality: Settings['quality']
): Promise<string[]> => {
    // The API key must be obtained from process.env.API_KEY
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        throw new Error("Você precisa conectar sua API Key antes de gerar imagens.");
    }

    const modelName = quality === 'Standard' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';

    const generateSingle = async (): Promise<string | null> => {
        try {
            // Create a new GoogleGenAI instance right before making an API call to ensure it uses the up-to-date key
            const ai = new GoogleGenAI({ apiKey });
            
            // Configure imageSize based on quality for gemini-3-pro-image-preview
            let imageSize: "1K" | "2K" | "4K" | undefined = undefined;
            if (modelName === 'gemini-3-pro-image-preview') {
                imageSize = quality === '4K' ? '4K' : (quality === 'HD' ? '2K' : '1K');
            }

            const response = await ai.models.generateContent({
                model: modelName,
                contents: {
                    parts: [{ text: prompt }]
                },
                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio,
                        ...(imageSize && { imageSize })
                    }
                },
            });

            // Iterate through all parts to find the image part as per guidelines
            const candidates = response.candidates?.[0]?.content?.parts || [];
            for (const part of candidates) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
            return null;
        } catch (error: any) {
            console.error(`Erro na geração (${modelName}):`, error);
            
            if (error.message?.includes("quota") || error.message?.includes("429")) {
                throw new Error("Cota de uso excedida no Google AI Studio. Tente novamente em alguns minutos ou alterne para outro projeto.");
            }
            
            throw error;
        }
    };

    try {
        const promises = Array.from({ length: numImages }).map(() => generateSingle());
        const results = await Promise.all(promises);
        const images = results.filter((img): img is string => img !== null);

        if (images.length === 0) {
            throw new Error("A IA não conseguiu processar este prompt. Tente algo mais descritivo.");
        }

        return images;
    } catch (error: any) {
        throw error;
    }
};

export const generateTitle = async (prompt: string): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "Obra Digital";
    
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `Crie um título artístico muito curto (3 palavras) para: "${prompt}". Retorne apenas o título.`,
        });
        // Access text property directly (not as a method)
        return response.text?.trim() || "Obra Digital";
    } catch (error) {
        return "Obra Digital";
    }
};
