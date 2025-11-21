
import { GoogleGenAI } from "@google/genai";
import type { Settings } from '../types';

// Helper to get the AI client instance
const getAiClient = (apiKey: string) => {
  return new GoogleGenAI({ apiKey });
};

export const generateImage = async (prompt: string, aspectRatio: Settings['aspectRatio'], numImages: number, apiKey: string): Promise<string[]> => {
    if (!apiKey) throw new Error("API Key is required");
    
    const ai = getAiClient(apiKey);
    const generatedImages: string[] = [];
    
    try {
        // We use sequential processing (one by one) instead of parallel (Promise.all).
        // Free tier keys have strict Rate Limits (RPM). firing 4 requests at once 
        // triggers a 429 "Quota Exceeded" error immediately, even if the key is fresh.
        for (let i = 0; i < numImages; i++) {
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: prompt, // Sending prompt directly as string is supported and cleaner
                    config: {
                        imageConfig: {
                            aspectRatio: aspectRatio,
                        }
                    },
                });

                // Extract base64 data from the response parts
                let foundImage = false;
                for (const part of response.candidates?.[0]?.content?.parts || []) {
                    if (part.inlineData) {
                        generatedImages.push(part.inlineData.data);
                        foundImage = true;
                        break; // Found the image for this request
                    }
                }

                if (!foundImage) {
                   console.warn(`Request ${i+1}: No image data found in response.`);
                }

            } catch (innerError: any) {
                console.warn(`Failed to generate image ${i + 1}:`, innerError);
                // If it's a strict safety block, we might want to stop, but for connectivity/random errors, continue.
                if (innerError.message && innerError.message.includes('429')) {
                     // If we hit a rate limit during the loop, throw immediately to stop trying and alert user
                     throw innerError;
                }
            }
        }

        if (generatedImages.length > 0) {
            return generatedImages;
        } else {
            throw new Error("No images were generated. The API might be blocking the prompt or experiencing high traffic.");
        }
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw new Error(error.message || String(error));
    }
};

export const generateTitle = async (prompt: string, apiKey: string): Promise<string> => {
    if (!apiKey) return "Untitled Artwork";
    
    try {
        const ai = getAiClient(apiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create a single, concise, and artistic title (maximum 4 words) for an image generated from the following prompt. Do not provide suggestions, alternatives, or quotation marks. Just the title. Prompt: "${prompt}"`,
        });
        return response.text?.trim().replace(/"/g, '') || "Untitled Artwork";
    } catch (error) {
        console.error("Title generation failed:", error);
        return "Untitled Artwork";
    }
};
