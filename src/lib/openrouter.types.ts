import { z } from 'zod';

export interface ModelParameters {
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface RequestPayload {
  messages: Array<{
    role: 'system' | 'user';
    content: string;
  }>;
  model: string;
  response_format?: {
    type: 'json_schema';
    json_schema: Record<string, unknown>;
  };
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export const apiResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        role: z.string(),
        content: z.string()
      })
    })
  ).min(1, 'API response must contain at least one choice')
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;

export const configSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  apiUrl: z.string().url().optional().default('https://openrouter.ai/api/v1'),
  timeout: z.number().positive().optional().default(30000),
  maxRetries: z.number().int().positive().optional().default(3)
});

export type OpenRouterConfig = z.infer<typeof configSchema>;

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
} 