
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePirateLore = async (name: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Scrivi una breve lore (massimo 3 frasi) in italiano per un pirata leggendario di Sea of Thieves chiamato "${name}". Il tono deve essere epico ma leggermente ironico, tipico del mondo dei pirati. Deve far parte della gilda "Tocca Pelati".`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text || "La sua storia è persa nelle nebbie del Sea of Thieves...";
  } catch (error) {
    console.error("Errore generazione lore:", error);
    return "Una leggenda ancora da scrivere tra le onde del mare.";
  }
};
