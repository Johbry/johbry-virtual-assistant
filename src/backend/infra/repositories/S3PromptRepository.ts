/**
 * Implementación S3 de PromptRepository
 * Lee configuración YAML desde AWS S3
 * Ideal para producción
 */

import {
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import yaml from 'js-yaml';
import { IPromptRepository } from './IPromptRepository';
import {
  PromptConfiguration,
  ResolvedPromptConfig,
  PromptKey,
} from '@/backend/domain/PromptConfiguration';

export class S3PromptRepository implements IPromptRepository {
  private s3Client: S3Client;
  private bucket: string;
  private configKey: string;
  private configuration: PromptConfiguration | null = null;

  constructor(
    bucket: string = process.env.PROMPT_BUCKET!,
    configKey: string = process.env.PROMPT_CONFIG_KEY || 'prompts/config.yaml'
  ) {
    if (!bucket) {
      throw new Error('PROMPT_BUCKET no está configurada en variables de entorno');
    }

    this.bucket = bucket;
    this.configKey = configKey;

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
    });

    console.log(
      `📦 S3PromptRepository inicializado: s3://${bucket}/${configKey}`
    );
  }

  async getConfiguration(): Promise<PromptConfiguration> {
    // Cachear la configuración
    if (this.configuration) {
      return this.configuration;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: this.configKey,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error('Respuesta vacía de S3');
      }

      const content = await response.Body.transformToString();
      this.configuration = yaml.load(content) as PromptConfiguration;

      return this.configuration;
    } catch (error) {
      console.error('❌ Error cargando configuración de S3:', error);
      throw error;
    }
  }

  async getResolvedPrompt(promptKey: PromptKey): Promise<ResolvedPromptConfig> {
    try {
      const config = await this.getConfiguration();
      const promptDef = config.prompts[promptKey];

      if (!promptDef) {
        throw new Error(
          `Prompt "${promptKey}" no encontrado en S3. Disponibles: ${Object.keys(config.prompts).join(', ')}`
        );
      }

      return {
        promptKey,
        promptDefinition: promptDef,
        llmConfig: config.llm,
        content: promptDef.content,
      };
    } catch (error) {
      console.error(
        `❌ Error en S3PromptRepository.getResolvedPrompt("${promptKey}"):`,
        error
      );
      throw error;
    }
  }

  async getPromptContent(promptKey: PromptKey): Promise<string> {
    try {
      const resolved = await this.getResolvedPrompt(promptKey);
      return resolved.content;
    } catch (error) {
      console.error(
        `❌ Error cargando contenido del prompt "${promptKey}" de S3:`,
        error
      );
      throw error;
    }
  }

  async listAvailablePrompts(): Promise<PromptKey[]> {
    try {
      const config = await this.getConfiguration();
      return Object.keys(config.prompts) as PromptKey[];
    } catch (error) {
      console.error('❌ Error listando prompts en S3:', error);
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.getConfiguration();
      return true;
    } catch (error) {
      console.error('❌ S3PromptRepository no disponible:', error);
      return false;
    }
  }

  /**
   * Reinicia el caché de configuración
   * Útil para recargar cambios sin reiniciar
   */
  resetCache(): void {
    this.configuration = null;
  }
}
