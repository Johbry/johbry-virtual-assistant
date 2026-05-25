/**
 * Implementación del AssistantAgent para Google Gemini
 * Utiliza la librería @google/genai para comunicarse con la API de Gemini
 */

import { AssistantAgent, GenerationConfig } from '../domain/AssistantAgent';
import { GoogleGenAI } from '@google/genai';

export class GeminiAssistant extends AssistantAgent {
  private apiKey: string;
  private client: GoogleGenAI;

  constructor(
    apiKey: string,
    model: string = 'gemini-2.5-flash',
    systemPrompt: string,
    generationConfig: GenerationConfig = {}
  ) {
    super(model, systemPrompt, generationConfig);
    this.apiKey = apiKey;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY es requerido para inicializar GeminiAssistant');
    }

    this.client = new GoogleGenAI({
      apiKey: this.apiKey,
    });
  }

  /**
   * Genera una respuesta usando la API de Gemini
   * Estructura correcta para @google/genai
   */
  async generateResponse(userMessage: string): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: userMessage,
        config: {
          systemInstruction: this.systemPrompt,
          temperature: this.generationConfig.temperature,
          maxOutputTokens: this.generationConfig.maxOutputTokens,
        },
      });

      const textResponse = response.text;

      if (!textResponse) {
        throw new Error('No se recibió respuesta de Gemini');
      }

      return textResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Error en API de Gemini:', errorMessage);
      throw new Error(`Error al generar respuesta: ${errorMessage}`);
    }
  }

  /**
   * Valida la conexión con la API de Gemini
   */
  async validateConnection(): Promise<boolean> {
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: {
          role: 'user',
          parts: [{ text: 'Hola' }],
        },
      });

      return !!response.text;
    } catch (error) {
      console.error('❌ Error validando conexión con Gemini:', error);
      return false;
    }
  }
}
