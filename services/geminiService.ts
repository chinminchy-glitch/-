
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export const analyzeWithAI = async (text: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure your environment is configured correctly.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `分析以下計畫描述並提供深度稽核報告：\n\n${text}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from AI.");
    }

    return resultText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
