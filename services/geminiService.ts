import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (
    prompt: string, 
    aspectRatio: Settings['aspectRatio'], 
    numImages: number,
    quality: Settings['quality']
): Promise<string[]> => {
    // Instanciação dinâmica: garante que use a chave selecionada pelo usuário no momento
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Define o modelo baseado na qualidade escolhida pelo usuário
    // Ambos usam a cota do usuário
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
                throw new Error("Sua chave de API parece inválida ou o projeto não tem faturamento/cota ativada.");
            }
            if (error.message?.includes("quota") || error.message?.includes("429")) {
                throw new Error("Sua cota pessoal no Google AI Studio foi atingida. Tente novamente em alguns minutos.");
            }
            
            throw error;
        }
    };

    try {
        const promises = Array.from({ length: numImages }).map(() => generateSingle());
        const results = await Promise.all(promises);
        const images = results.filter((img): img is string => img !== null);

        if (images.length === 0) {
            throw new Error("A IA não retornou resultados. Tente ajustar seu prompt.");
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