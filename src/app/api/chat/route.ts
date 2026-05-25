/**
 * Endpoint API de Next.js para procesar mensajes del chat
 * POST /api/chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAssistantService } from '@/backend/application/AssistantService';
import { PromptManager } from '@/backend/application/PromptManager';
import { PromptKey } from '@/backend/domain/PromptConfiguration';

// Crear el servicio una sola vez (singleton)
let assistantService: ReturnType<typeof createAssistantService> | null = null;

/**
 * Inicializa el servicio de asistente
 * Carga el prompt y configuración del repositorio (Local o S3)
 */
async function initializeService(): Promise<ReturnType<typeof createAssistantService>> {
  if (!assistantService) {
    try {
      console.log(
        `📚 Cargando configuración desde: ${PromptManager.getRepositoryInfo()}`
      );
      // Obtener el prompt key desde variables de entorno
      // Usar AGENT_CHAT_PROMPT por defecto
      const promptKey = (process.env.PROMPT_KEY ||
        'AGENT_CHAT_PROMPT') as PromptKey;

      // Obtener el prompt del repositorio (Local o S3)
      const promptContent = await PromptManager.getPromptContent(promptKey);
      const llmConfig = await PromptManager.getLLMConfig();

      console.log(`⚙️ Modelo LLM: ${llmConfig.provider} - ${llmConfig.model}`);
      console.log(`✅ Prompt cargado: "${promptKey}"`);

      assistantService = createAssistantService(promptContent);
      console.log('✅ AssistantService inicializado');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Error inicializando AssistantService:', errorMessage);
      throw error;
    }
  }
  return assistantService;
}

/**
 * Maneja GET requests (health check)
 */
export async function GET() {
  try {
    const service = await initializeService();
    const isConnected = await service.validateConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Servidor no conectado a Gemini API',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'API del agente activa ✅',
      connected: true,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error en health check:', errorMessage);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Error verificando conexión',
      },
      { status: 503 }
    );
  }
}

/**
 * Maneja POST requests (enviar mensaje)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId } = body;

    // Validar entrada
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'El mensaje es requerido y debe ser un texto válido.' },
        { status: 400 }
      );
    }

    // Inicializar servicio
    const service = await initializeService();

    // Procesar mensaje
    const result = await service.processMessage({
      message: message.trim(),
      conversationId,
    });

    // Si hay error, devolverlo
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Respuesta exitosa
    return NextResponse.json(
      { reply: result.reply },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error en /api/chat:', errorMessage);

    return NextResponse.json(
      { error: 'Hubo un error al procesar tu solicitud. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
