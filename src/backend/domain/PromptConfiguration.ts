/**
 * Tipos e interfaces para la configuración de prompts
 */

export interface LLMConfig {
  provider: 'gemini' | 'claude' | 'openai';
  model: string;
  temperature: number;
  maxOutputTokens: number;
}

export interface PromptDefinition {
  name: string;
  description: string;
  enabled: boolean;
  content: string;
}

export interface PromptConfiguration {
  version: string;
  description?: string;
  llm: LLMConfig;
  prompts: Record<string, PromptDefinition>;
}

export interface ResolvedPromptConfig {
  promptKey: string;
  promptDefinition: PromptDefinition;
  llmConfig: LLMConfig;
  content: string;
}

/**
 * Keys de prompts disponibles (enumeración de constantes)
 */
export const PROMPT_KEYS = {
  AGENT_CHAT_PROMPT: 'AGENT_CHAT_PROMPT',
  AGENT_INTERVIEW_PROMPT: 'AGENT_INTERVIEW_PROMPT',
  AGENT_COACHING_PROMPT: 'AGENT_COACHING_PROMPT',
} as const;

export type PromptKey = typeof PROMPT_KEYS[keyof typeof PROMPT_KEYS];
