import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (prompt: string, aspectRatio: Settings['aspectRatio'], numImages: number): Promise<string[]> => {
    // Inicializa com a chave de API do ambiente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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

        const images: string[] = [];
        const candidates = response.candidates?.[0]?.content?.parts || [];

        for (const part of candidates) {
            if (part.inlineData) {
                images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            }
        }

        if (images.length === 0) {
            throw new Error("A visão cósmica não retornou nenhuma imagem.");
        }

        return images;
    } catch (error: any) {
        console.error("Erro na Geração (Gemini):", error);
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