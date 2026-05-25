/**
 * Clase abstracta que define la interfaz para implementar diferentes LLMs
 * (Claude, Gemini, OpenAI, etc.)
 */

export interface GenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  [key: string]: unknown;
}

export interface MessageHistory {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AssistantAgent {
  protected model: string;
  protected systemPrompt: string;
  protected generationConfig: GenerationConfig;
  protected conversationHistory: MessageHistory[];

  constructor(
    model: string,
    systemPrompt: string,
    generationConfig: GenerationConfig = {}
  ) {
    this.model = model;
    this.systemPrompt = systemPrompt;
    this.generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 1024,
      ...generationConfig,
    };
    this.conversationHistory = [];
  }

  /**
   * Establece o actualiza el prompt del sistema
   */
  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }

  /**
   * Obtiene el prompt del sistema actual
   */
  getSystemPrompt(): string {
    return this.systemPrompt;
  }

  /**
   * Actualiza la configuración de generación
   */
  setGenerationConfig(config: GenerationConfig): void {
    this.generationConfig = { ...this.generationConfig, ...config };
  }

  /**
   * Obtiene el historial de conversación
   */
  getConversationHistory(): MessageHistory[] {
    return this.conversationHistory;
  }

  /**
   * Limpia el historial de conversación
   */
  clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Agrega un mensaje al historial
   */
  addMessageToHistory(
    role: 'user' | 'assistant' | 'system',
    content: string
  ): void {
    this.conversationHistory.push({ role, content });
  }

  /**
   * Método abstracto para procesar el prompt y generar una respuesta
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateResponse(userMessage: string): Promise<string> {
    throw new Error('generateResponse() debe ser implementado por las subclases');
  }

  /**
   * Procesa una pregunta completa (con historial)
   */
  async processQuery(userMessage: string): Promise<string> {
    this.addMessageToHistory('user', userMessage);
    const response = await this.generateResponse(userMessage);
    this.addMessageToHistory('assistant', response);
    return response;
  }

  /**
   * Obtiene el modelo actual
   */
  getModel(): string {
    return this.model;
  }

  /**
   * Cambia el modelo
   */
  setModel(model: string): void {
    this.model = model;
  }
}
