import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (prompt: string, aspectRatio: Settings['aspectRatio'], numImages: number): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Função interna para uma única geração
    const generateSingle = async (): Promise<string | null> => {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: prompt }]
                },
                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio
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
        } catch (error) {
            console.error("Erro em uma das gerações:", error);
            return null;
        }
    };

    try {
        // Executa múltiplas gerações em paralelo de acordo com numImages
        const promises = Array.from({ length: numImages }).map(() => generateSingle());
        const results = await Promise.all(promises);
        
        // Filtra resultados nulos (falhas individuais)
        const images = results.filter((img): img is string => img !== null);

        if (images.length === 0) {
            throw new Error("A visão cósmica não retornou nenhuma imagem.");
        }

        return images;
    } catch (error: any) {
        console.error("Erro na Geração Coletiva (Gemini):", error);
        throw error;
    }
};

export const generateTitle = async (prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `Como um curador de arte IA, crie um título poético e minimalista (máximo 3 palavras) para esta imagem: "${prompt}". Retorne apenas o texto do título.`,
        });
        return response.text?.trim() || "Visão Infinita";
    } catch (error) {
        return "Sem Título";
    }
};