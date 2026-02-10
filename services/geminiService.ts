
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeIncident(alertMessage: string, deviceDetails: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise o seguinte incidente de infraestrutura de TI e forneça um diagnóstico técnico resumido:
      Incidente: ${alertMessage}
      Detalhes do Dispositivo: ${deviceDetails}
      
      Responda em Português do Brasil com:
      1. Causa Raiz Provável
      2. Ação Corretiva Recomendada (passo-a-passo)
      3. Impacto esperado se não resolvido.`,
      config: {
        temperature: 0.2,
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Falha ao obter diagnóstico da IA. Verifique a conexão.";
  }
}
