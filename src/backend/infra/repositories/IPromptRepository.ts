/**
 * Interfaz abstracta para obtener configuración de prompts y LLM
 * Permite implementaciones diferentes (Local, S3, etc.)
 */

import {
  PromptConfiguration,
  ResolvedPromptConfig,
  PromptKey,
} from '@/backend/domain/PromptConfiguration';

export interface IPromptRepository {
  /**
   * Obtiene la configuración completa (LLM + todos los prompts)
   */
  getConfiguration(): Promise<PromptConfiguration>;

  /**
   * Obtiene un prompt específico resuelto
   */
  getResolvedPrompt(promptKey: PromptKey): Promise<ResolvedPromptConfig>;

  /**
   * Lista todas las claves de prompts disponibles
   */
  listAvailablePrompts(): Promise<PromptKey[]>;

  /**
   * Obtiene solo el contenido del prompt por su clave
   */
  getPromptContent(promptKey: PromptKey): Promise<string>;

  /**
   * Verifica si el repositorio está disponible
   */
  isAvailable(): Promise<boolean>;
}
