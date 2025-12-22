import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (
    prompt: string, 
    aspectRatio: Settings['aspectRatio'], 
    numImages: number,
    isProMode: boolean = false
): Promise<string[]> => {
    // Se o usuário não estiver no modo Pro, usamos a chave de ambiente injetada (process.env.API_KEY)
    // Se estiver no modo Pro, o SDK usará a chave selecionada no diálogo do AI Studio
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Decidimos o modelo com base no modo
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
            
            // Tratamento específico para quando a chave do sistema atinge limite
            if (error.message?.includes("quota") || error.message?.includes("429")) {
                throw new Error("LIMITE_SISTEMA");
            }
            
            // Se o modo Pro falhar por falta de chave selecionada
            if (isProMode && error.message?.includes("API key")) {
                throw new Error("PRO_KEY_REQUIRED");
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