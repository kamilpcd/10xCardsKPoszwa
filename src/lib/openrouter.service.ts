import { z } from 'zod';
import type { 
  OpenRouterConfig,
  ModelParameters,
  RequestPayload,
  ApiResponse
} from './openrouter.types';
import { configSchema, OpenRouterError, apiResponseSchema } from './openrouter.types';
import { OpenRouterLogger } from './openrouter.logger';

export class OpenRouterService {
  private readonly logger: OpenRouterLogger;
  private readonly config: OpenRouterConfig;
  
  private currentSystemMessage?: string;
  private currentUserMessage?: string;
  private currentModelName: string = 'openai/gpt-4o-mini';
  private currentModelParameters: ModelParameters = {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };
  private currentResponseFormat?: Record<string, unknown>;

  constructor(config: Partial<OpenRouterConfig>) {
    this.logger = new OpenRouterLogger();
    
    try {
      this.config = configSchema.parse({
        apiKey: config.apiKey ?? process.env.OPENROUTER_API_KEY,
        apiUrl: config.apiUrl,
        timeout: config.timeout,
        maxRetries: config.maxRetries
      });
      
      this.logger.debug('OpenRouterService initialized', { 
        apiUrl: this.config.apiUrl,
        timeout: this.config.timeout,
        maxRetries: this.config.maxRetries
      });
    } catch (error) {
      this.logger.error('Failed to initialize OpenRouterService', error);
      throw new OpenRouterError(
        'Invalid configuration',
        'INVALID_CONFIG',
        undefined,
        error
      );
    }
  }

  public setSystemMessage(message: string): void {
    this.currentSystemMessage = message;
    this.logger.debug('System message set', { message });
  }

  public setUserMessage(message: string): void {
    this.currentUserMessage = message;
    this.logger.debug('User message set', { message });
  }

  public setModel(name: string, parameters?: ModelParameters): void {
    this.currentModelName = name;
    if (parameters) {
      this.currentModelParameters = {
        ...this.currentModelParameters,
        ...parameters
      };
    }
    this.logger.debug('Model configuration updated', { 
      model: name, 
      parameters: this.currentModelParameters 
    });
  }

  public setResponseFormat(schema: Record<string, unknown>): void {
    this.currentResponseFormat = schema;
    this.logger.debug('Response format updated', { schema });
  }

  private buildRequestPayload(): RequestPayload {
    if (!this.currentUserMessage) {
      throw new OpenRouterError(
        'User message is required',
        'MISSING_USER_MESSAGE'
      );
    }

    const messages = [];

    if (this.currentSystemMessage) {
      messages.push({
        role: 'system' as const,
        content: this.currentSystemMessage
      });
    }

    messages.push({
      role: 'user' as const,
      content: this.currentUserMessage
    });

    const payload: RequestPayload = {
      messages,
      model: this.currentModelName,
      ...this.currentModelParameters
    };

    if (this.currentResponseFormat) {
      payload.response_format = {
        type: 'json_schema',
        json_schema: this.currentResponseFormat
      };
    }

    this.logger.debug('Request payload built', payload);
    return payload;
  }

  private async executeRequest(requestPayload: RequestPayload): Promise<ApiResponse> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        this.logger.debug(`Attempt ${attempt + 1}/${this.config.maxRetries}`);
        
        const response = await fetch(`${this.config.apiUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify(requestPayload),
          signal: AbortSignal.timeout(this.config.timeout)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new OpenRouterError(
            errorData.message || `HTTP error ${response.status}`,
            'API_ERROR',
            response.status,
            errorData
          );
        }

        const data = await response.json();
        this.logger.debug('API response received', data);
        return data as ApiResponse;
      } catch (error) {
        lastError = error as Error;
        this.logger.error(`Request attempt ${attempt + 1} failed`, error);
        
        if (error instanceof OpenRouterError && error.status && error.status < 500) {
          // Nie ponawiamy dla błędów klienta (4xx)
          throw error;
        }

        // Czekamy przed kolejną próbą z wykładniczym backoff
        if (attempt < this.config.maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          this.logger.debug(`Waiting ${delay}ms before next attempt`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new OpenRouterError(
      `Failed after ${this.config.maxRetries} attempts: ${lastError?.message}`,
      'MAX_RETRIES_EXCEEDED',
      undefined,
      lastError
    );
  }

  public async sendChatMessage(message: string): Promise<ApiResponse> {
    this.logger.info('Sending chat message');
    
    try {
      this.setUserMessage(message);
      const payload = this.buildRequestPayload();
      const response = await this.executeRequest(payload);
      
      try {
        return apiResponseSchema.parse(response);
      } catch (error) {
        this.logger.error('Invalid API response format', error);
        throw new OpenRouterError(
          'Invalid API response format',
          'INVALID_RESPONSE_FORMAT',
          undefined,
          error
        );
      }
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw error;
      }
      
      this.logger.error('Failed to send chat message', error);
      throw new OpenRouterError(
        'Failed to send chat message',
        'CHAT_ERROR',
        undefined,
        error
      );
    }
  }
} 