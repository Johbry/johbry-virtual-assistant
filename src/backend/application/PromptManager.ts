/**
 * Gestor centralizado de configuración y prompts
 * Proporciona una interfaz simple para acceder a la configuración
 * Abstrae la lógica de dónde viene (Local o S3)
 */

import { PromptRepositoryFactory } from '@/backend/infra/repositories/PromptRepositoryFactory';
import { IPromptRepository } from '@/backend/infra/repositories/IPromptRepository';
import {
  PromptConfiguration,
  ResolvedPromptConfig,
  PromptKey,
  LLMConfig,
} from '@/backend/domain/PromptConfiguration';

export class PromptManager {
  private static repository: IPromptRepository | null = null;

  /**
   * Obtiene la instancia del repositorio
   */
  private static getRepository(): IPromptRepository {
    if (!this.repository) {
      this.repository = PromptRepositoryFactory.getInstance();
    }
    return this.repository;
  }

  /**
   * Obtiene la configuración completa (LLM + todos los prompts)
   */
  static async getConfiguration(): Promise<PromptConfiguration> {
    const repository = this.getRepository();
    return repository.getConfiguration();
  }

  /**
   * Obtiene la configuración del LLM
   */
  static async getLLMConfig(): Promise<LLMConfig> {
    const config = await this.getConfiguration();
    return config.llm;
  }

  /**
   * Obtiene un prompt resuelto con toda su información
   */
  static async getResolvedPrompt(
    promptKey: PromptKey
  ): Promise<ResolvedPromptConfig> {
    const repository = this.getRepository();
    return repository.getResolvedPrompt(promptKey);
  }

  /**
   * Obtiene solo el contenido del prompt (el texto)
   */
  static async getPromptContent(promptKey: PromptKey): Promise<string> {
    const repository = this.getRepository();
    return repository.getPromptContent(promptKey);
  }

  /**
   * Lista todos los prompts disponibles
   */
  static async listAvailablePrompts(): Promise<PromptKey[]> {
    const repository = this.getRepository();
    return repository.listAvailablePrompts();
  }

  /**
   * Verifica si el repositorio está disponible
   */
  static async isHealthy(): Promise<boolean> {
    const repository = this.getRepository();
    return repository.isAvailable();
  }

  /**
   * Obtiene información del repositorio actual (útil para debugging)
   */
  static getRepositoryInfo(): string {
    const repo = this.getRepository();
    return repo.constructor.name;
  }

  /**
   * Reinicia el caché (útil para recargar cambios sin reiniciar)
   */
  static resetCache(): void {
    const repo = this.getRepository();
    if ('resetCache' in repo && typeof repo.resetCache === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (repo as any).resetCache();
    }
  }
}
