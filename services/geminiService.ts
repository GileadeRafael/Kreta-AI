import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (prompt: string, aspectRatio: Settings['aspectRatio'], numImages: number): Promise<string[]> => {
    // Sempre cria uma nova instância para garantir o uso da chave mais recente selecionada no dialog
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const generateSingle = async (): Promise<string | null> => {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: {
                    parts: [{ text: prompt }]
                },
                config: {
                    imageConfig: {
                        aspectRatio: aspectRatio,
                        imageSize: "1K" // Qualidade padrão para o modelo Pro
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
            console.error("Erro na geração individual:", error);
            // Se o erro for "Entity not found", pode ser um problema com a chave/projeto selecionado
            if (error.message?.includes("Requested entity was not found")) {
                throw new Error("KEY_RESET_REQUIRED");
            }
            return null;
        }
    };

    try {
        const promises = Array.from({ length: numImages }).map(() => generateSingle());
        const results = await Promise.all(promises);
        const images = results.filter((img): img is string => img !== null);

        if (images.length === 0) {
            throw new Error("A visão cósmica não retornou resultados. Verifique seu prompt ou conexão.");
        }

        return images;
    } catch (error: any) {
        if (error.message === "KEY_RESET_REQUIRED") throw error;
        console.error("Erro na Geração Coletiva:", error);
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