/**
 * Implementación local de PromptRepository
 * Lee configuración desde archivos YAML locales
 * Ideal para desarrollo
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { IPromptRepository } from './IPromptRepository';
import {
  PromptConfiguration,
  ResolvedPromptConfig,
  PromptKey,
} from '@/backend/domain/PromptConfiguration';

export class LocalPromptRepository implements IPromptRepository {
  private configDir: string;
  private configuration: PromptConfiguration | null = null;

  constructor(configDir?: string) {
    // Por defecto busca en src/config/prompts/
    this.configDir = configDir || path.join(process.cwd(), 'src/config/prompts');
  }

  async getConfiguration(): Promise<PromptConfiguration> {
    // Cachear la configuración
    if (this.configuration) {
      return this.configuration;
    }

    try {
      const configPath = this.getConfigFilePath();

      if (!fs.existsSync(configPath)) {
        throw new Error(`Archivo de configuración no encontrado: ${configPath}`);
      }

      const content = fs.readFileSync(configPath, 'utf-8');
      this.configuration = yaml.load(content) as PromptConfiguration;

      return this.configuration;
    } catch (error) {
      console.error('❌ Error cargando configuración local:', error);
      throw error;
    }
  }

  async getResolvedPrompt(promptKey: PromptKey): Promise<ResolvedPromptConfig> {
    try {
      const config = await this.getConfiguration();
      const promptDef = config.prompts[promptKey];

      if (!promptDef) {
        throw new Error(
          `Prompt "${promptKey}" no encontrado. Disponibles: ${Object.keys(config.prompts).join(', ')}`
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
        `❌ Error en LocalPromptRepository.getResolvedPrompt("${promptKey}"):`,
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
        `❌ Error cargando contenido del prompt "${promptKey}":`,
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
      console.error('❌ Error listando prompts locales:', error);
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.getConfiguration();
      return true;
    } catch {
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

  private getConfigFilePath(): string {
    const yamlPath = path.join(this.configDir, 'config.yaml');
    return yamlPath;
  }
}
