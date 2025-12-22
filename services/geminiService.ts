import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (
    prompt: string, 
    aspectRatio: Settings['aspectRatio'], 
    numImages: number,
    quality: Settings['quality']
): Promise<string[]> => {
    // CRÍTICO: Instanciar apenas aqui dentro. Se process.env.API_KEY estiver vazio aqui, 
    // significa que o diálogo do AI Studio não foi concluído ou falhou.
    if (!process.env.API_KEY) {
        throw new Error("Chave de API não detectada. Por favor, reconecte sua conta.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = quality === 'Standard' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';

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
                        ...(modelName === 'gemini-3-pro-image-preview' && { imageSize: "1K" })
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
            console.error(`Erro na geração (${modelName}):`, error);
            if (error.message?.includes("Requested entity was not found")) {
                throw new Error("Projeto inválido ou sem cota. Verifique seu Google AI Studio.");
            }
            if (error.message?.includes("quota") || error.message?.includes("429")) {
                throw new Error("Cota pessoal atingida. O Google renova sua cota gratuita periodicamente.");
            }
            throw error;
        }
    };

    const promises = Array.from({ length: numImages }).map(() => generateSingle());
    const results = await Promise.all(promises);
    const images = results.filter((img): img is string => img !== null);

    if (images.length === 0) {
        throw new Error("Não foi possível gerar imagens com o prompt atual.");
    }

    return images;
};

export const generateTitle = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) return "Visão Infinita";
    
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