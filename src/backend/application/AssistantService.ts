/**
 * Servicio que gestiona el AssistantAgent
 * Actúa como intermediario entre el servidor HTTP y el agente
 */

import { AssistantAgent } from '../domain/AssistantAgent';
import { GeminiAssistant } from '../infra/GeminiAssistant';

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  reply: string;
  error?: string;
}

export interface MessageContent {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AssistantService {
  private agent: AssistantAgent;
  private conversations: Map<string, AssistantAgent>;

  constructor(agent: AssistantAgent) {
    this.agent = agent;
    this.conversations = new Map();
  }

  /**
   * Procesa un mensaje del usuario
   */
  async processMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const agent = this.getOrCreateConversation(request.conversationId);
      const reply = await agent.processQuery(request.message);

      return { reply };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ Error en AssistantService:', errorMessage);

      return {
        reply: '',
        error: errorMessage,
      };
    }
  }

  /**
   * Obtiene o crea una conversación por ID
   */
  private getOrCreateConversation(conversationId?: string): AssistantAgent {
    // Si no hay ID de conversación, usar el agente global
    if (!conversationId) {
      return this.agent;
    }

    // Si ya existe la conversación, devolverla
    if (this.conversations.has(conversationId)) {
      return this.conversations.get(conversationId)!;
    }

    // Crear una nueva conversación
    const newAgent = this.createNewConversation();
    this.conversations.set(conversationId, newAgent);

    return newAgent;
  }

  /**
   * Crea una nueva instancia de conversación
   */
  private createNewConversation(): AssistantAgent {
    // Crear una copia con la misma configuración
    return new GeminiAssistant(
      process.env.GEMINI_API_KEY!,
      this.agent.getModel(),
      this.agent.getSystemPrompt()
    );
  }

  /**
   * Obtiene el historial de una conversación
   */
  getConversationHistory(conversationId?: string): MessageContent[] {
    const agent = conversationId && this.conversations.has(conversationId)
      ? this.conversations.get(conversationId)!
      : this.agent;

    return agent.getConversationHistory();
  }

  /**
   * Limpia una conversación
   */
  clearConversation(conversationId: string): void {
    if (this.conversations.has(conversationId)) {
      this.conversations.delete(conversationId);
    }
  }

  /**
   * Actualiza el prompt del sistema
   */
  updateSystemPrompt(prompt: string): void {
    this.agent.setSystemPrompt(prompt);
  }

  /**
   * Obtiene el prompt del sistema actual
   */
  getSystemPrompt(): string {
    return this.agent.getSystemPrompt();
  }

  /**
   * Valida la conexión del agente
   */
  async validateConnection(): Promise<boolean> {
    if (this.agent instanceof GeminiAssistant) {
      return await this.agent.validateConnection();
    }
    return true;
  }
}

/**
 * Factory para crear el servicio
 */
export function createAssistantService(systemPrompt: string): AssistantService {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno');
  }

  const geminiAgent = new GeminiAssistant(
    apiKey,
    'gemini-2.5-flash',
    systemPrompt
  );

  return new AssistantService(geminiAgent);
}
