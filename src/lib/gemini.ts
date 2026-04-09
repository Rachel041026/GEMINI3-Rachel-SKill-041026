import { GoogleGenAI, Type } from "@google/genai";
import { APIKeys, ModelConfig } from "../types";

export const getAI = (apiKey?: string) => {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

export interface ExtendedModelConfig extends ModelConfig {
  useSearch?: boolean;
  responseMimeType?: string;
  responseSchema?: any;
}

export const generateAIResponse = async (
  config: ExtendedModelConfig,
  keys: APIKeys,
  systemInstruction?: string
): Promise<string> => {
  const { provider, model, prompt, useSearch, responseMimeType, responseSchema } = config;

  if (provider === 'google') {
    const ai = getAI(keys.gemini);
    if (!ai) throw new Error("Gemini API Key is missing.");

    const response = await ai.models.generateContent({
      model: model || "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are an expert FDA 510(k) reviewer.",
        tools: useSearch ? [{ googleSearch: {} }] : undefined,
        toolConfig: useSearch ? { includeServerSideToolInvocations: true } : undefined,
        responseMimeType: responseMimeType as any,
        responseSchema: responseSchema,
      },
    });

    return response.text || "No response from Gemini.";
  }

  return `[MOCK ${provider.toUpperCase()} RESPONSE using ${model}]\n\nPrompt received: ${prompt.substring(0, 50)}...`;
};
