import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

export const generateImage = async (prompt: string, aspectRatio: Settings['aspectRatio'], numImages: number): Promise<string[]> => {
    // Re-instantiate to get latest key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio,
                    imageSize: '1K'
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
            throw new Error("No image was returned from the cosmic void.");
        }

        return images;
    } catch (error: any) {
        console.error("Gemini Error:", error);
        throw error;
    }
};

export const generateTitle = async (prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `As an AI art curator, create a poetic, avant-garde title (max 3 words) for: "${prompt}". Return only the title text.`,
        });
        return response.text?.trim() || "Obsidian Vision";
    } catch (error) {
        return "Untitled Flow";
    }
};