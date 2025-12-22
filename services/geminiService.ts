
import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (
    prompt: string, 
    aspectRatio: Settings['aspectRatio'], 
    numImages: number,
    quality: Settings['quality']
): Promise<string[]> => {
    // Verificação preventiva para evitar erro fatal do SDK no navegador
    if (!process.env.API_KEY || process.env.API_KEY === "undefined") {
      throw new Error("CHAVE_AUSENTE: A API_KEY não foi detectada no ambiente. Certifique-se de que a variável foi adicionada no Vercel e o deploy foi refeito.");
    }

    const modelName = quality === 'Standard' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';

    const generateSingle = async (): Promise<string | null> => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

            const parts = response.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
            return null;
        } catch (error: any) {
            console.error(`Engine Error:`, error);
            // Captura erro específico de chave do SDK
            if (error.message?.includes("API Key")) {
                throw new Error("CHAVE_INVALIDA: A chave configurada no Vercel foi rejeitada pela API do Google.");
            }
            throw error;
        }
    };

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
        if (!process.env.API_KEY || process.env.API_KEY === "undefined") return "Obra Zion";
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `Crie um título artístico de 3 palavras para esta descrição: "${prompt}"`,
        });
        return response.text?.trim() || "Obra Zion";
    } catch (error) {
        return "Obra Zion";
    }
};
