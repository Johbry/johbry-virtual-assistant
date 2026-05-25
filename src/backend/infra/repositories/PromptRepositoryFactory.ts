/**
 * Factory para crear la implementación correcta de PromptRepository
 * Selecciona automáticamente entre Local y S3 basado en NODE_ENV
 */

import { IPromptRepository } from './IPromptRepository';
import { LocalPromptRepository } from './LocalPromptRepository';
import { S3PromptRepository } from './S3PromptRepository';

export class PromptRepositoryFactory {
  private static instance: IPromptRepository | null = null;

  /**
   * Obtiene la instancia singleton del repositorio
   * En desarrollo: LocalPromptRepository
   * En producción: S3PromptRepository
   */
  static getInstance(): IPromptRepository {
    if (this.instance) {
      return this.instance;
    }

    const environment = process.env.NODE_ENV || 'development';
    const useS3 = process.env.USE_S3_PROMPTS === 'true' || environment === 'production';

    try {
      if (useS3) {
        console.log('🔄 Usando S3PromptRepository (producción)');
        this.instance = new S3PromptRepository();
      } else {
        console.log('📁 Usando LocalPromptRepository (desarrollo)');
        this.instance = new LocalPromptRepository();
      }
    } catch (error) {
      console.error('❌ Error creando repositorio de prompts:', error);

      // Fallback a Local si S3 falla
      if (useS3) {
        console.warn('⚠️ Fallback a LocalPromptRepository');
        this.instance = new LocalPromptRepository();
      } else {
        throw error;
      }
    }

    return this.instance;
  }

  /**
   * Fuerza un repositorio específico (útil para testing)
   */
  static setInstance(repository: IPromptRepository): void {
    this.instance = repository;
  }

  /**
   * Reinicia la instancia (útil para cambiar de estrategia en runtime)
   */
  static reset(): void {
    this.instance = null;
  }
}
