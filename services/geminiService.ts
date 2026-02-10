import { GoogleGenAI, Type } from "@google/genai";
import { QuoteData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-flash-preview for fast text generation
const TEXT_MODEL = "gemini-3-flash-preview";
// Using gemini-2.5-flash-image for efficient image generation
const IMAGE_MODEL = "gemini-2.5-flash-image";

export const generateQuote = async (topic: string): Promise<QuoteData> => {
  try {
    const prompt = `Genera una frase motivadora, filosófica o estoica en Español sobre el tema: "${topic}". 
    La frase debe ser profunda, breve e impactante.
    Retorna SOLO un objeto JSON.`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "La frase motivadora" },
            author: { type: Type.STRING, description: "El autor de la frase (o 'Anónimo')" },
            category: { type: Type.STRING, description: "Una categoría breve de una palabra" }
          },
          required: ["text", "author"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response text from Gemini");
    
    return JSON.parse(jsonText) as QuoteData;
  } catch (error) {
    console.error("Error generating quote:", error);
    return {
      text: "La disciplina es el puente entre metas y logros.",
      author: "Jim Rohn",
      category: "Disciplina"
    };
  }
};

export const generateBackgroundVisual = async (quote: string): Promise<string | null> => {
  try {
    const prompt = `A minimal, abstract, high-contrast black and white artistic background image representing this concept: "${quote}". 
    Dark aesthetic, noir style, charcoal texture, smoke, or geometry. 
    Must be very dark with mostly black space. No text in the image.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
      config: {
        // Configuring specifically for image output if supported by the model wrapper logic
        // For gemini-2.5-flash-image, we prompt for an image and expect base64 data in parts
      }
    });

    // Check parts for inline data
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating visual:", error);
    return null;
  }
};