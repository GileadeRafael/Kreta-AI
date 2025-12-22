import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (
    prompt: string, 
    aspectRatio: Settings['aspectRatio'], 
    numImages: number,
    isProMode: boolean
): Promise<string[]> => {
    // Se estiver no Pro Mode, assume que a chave vem do seletor do AI Studio (injetada no process.env.API_KEY)
    // Se não, usa a chave padrão do desenvolvedor
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const modelName = isProMode ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    const generateSingle = async (): Promise<string | null> => {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: {
                    parts: [{ text: prompt }]
                },
                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio,
                        ...(isProMode && { imageSize: "1K" })
                    }
                },
            });

            const candidates = response.candidates?.[0]?.content?.parts || [];
            for (const part of candidates) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
            return null;
        } catch (error: any) {
            console.error(`Erro no modelo ${modelName}:`, error);
            
            if (error.message?.includes("Requested entity was not found")) {
                throw new Error("PRO_KEY_REQUIRED");
            }
            if (error.message?.includes("429") || error.message?.includes("quota")) {
                throw new Error("QUOTA_EXCEEDED");
            }
            return null;
        }
    };

    try {
        const promises = Array.from({ length: numImages }).map(() => generateSingle());
        const results = await Promise.all(promises);
        const images = results.filter((img): img is string => img !== null);

        if (images.length === 0) {
            throw new Error("A IA não conseguiu processar sua visão no momento. Tente um prompt diferente.");
        }

        return images;
    } catch (error: any) {
        throw error;
    }
};

export const generateTitle = async (prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `Crie um título poético (3 palavras max) para: "${prompt}". Retorne apenas o texto.`,
        });
        return response.text?.trim() || "Visão Infinita";
    } catch (error) {
        return "Sem Título";
    }
};