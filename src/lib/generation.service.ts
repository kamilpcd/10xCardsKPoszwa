import crypto from 'crypto';
import type { SupabaseClient } from '../db/supabase.client';
import type { FlashcardProposalDTO, GenerationResponseDTO } from '../types';
import { DEFAULT_USER_ID } from '../db/supabase.client';
import { OpenRouterService } from './openrouter.service';
import { OpenRouterError } from './openrouter.types';

export class GenerationService {
  private readonly openRouter: OpenRouterService;
  private readonly flashcardsSchema = {
    name: "flashcards",
    schema: {
      type: "object",
      properties: {
        flashcards: {
          type: "array",
          items: {
            type: "object",
            properties: {
              front: { type: "string" },
              back: { type: "string" }
            },
            required: ["front", "back"]
          }
        }
      },
      required: ["flashcards"]
    }
  }

  constructor(
    private readonly supabase: SupabaseClient,
    openRouterConfig?: { apiKey?: string; apiUrl?: string }
  ) {
    this.openRouter = new OpenRouterService(openRouterConfig ?? {});
    this.openRouter.setModel('openai/gpt-4o-mini', {
      temperature: 0.7,
      top_p: 1
    });
    this.openRouter.setResponseFormat(this.flashcardsSchema);
  }

  async generateFlashcards(sourceText: string): Promise<GenerationResponseDTO> {
    try {
      const startTime = Date.now();
      const sourceTextHash = this.calculateTextHash(sourceText);

      // 1. Wywołanie serwisu AI
      const proposals = await this.callAIService(sourceText);

      // 2. Zapis metadanych generacji
      const generationId = await this.saveGenerationMetadata({
        sourceText,
        sourceTextHash,
        generatedCount: proposals.length,
        durationMs: Date.now() - startTime
      });

      return {
        generation_id: generationId,
        flashcards_proposals: proposals,
        generated_count: proposals.length
      };
    } catch (error) {
      await this.logGenerationError(error, sourceText);
      throw error;
    }
  }

  private async saveGenerationMetadata(data: {
    sourceText: string;
    sourceTextHash: string;
    generatedCount: number;
    durationMs: number;
  }): Promise<number> {
    const { data: generation, error: dbError } = await this.supabase
      .from('generations')
      .insert({
        user_id: DEFAULT_USER_ID,
        model: 'openai/gpt-4o-mini', // TODO: Make configurable
        source_text_hash: data.sourceTextHash,
        source_text_length: data.sourceText.length,
        generated_count: data.generatedCount,
        generation_duration: data.durationMs
      })
      .select("id")
      .single();

      if (dbError) {
        console.error('Supabase error details:', dbError);
        throw new Error(`Failed to create generation record: ${dbError.message}`);
      }
      if (!generation) {
        throw new Error('Failed to create generation record: No data returned');
      }

    return generation.id;
  }

  private async callAIService(sourceText: string): Promise<FlashcardProposalDTO[]> {
    try {
      this.openRouter.setSystemMessage(
        'You are an AI assistant specialized in creating high-quality flashcards from provided text. Generate concise, clear, and effective flashcards that capture key concepts and knowledge. Each flashcard should have a front (question/prompt) and back (answer/explanation). Focus on important facts, definitions, concepts, and relationships.'
      );

      const response = await this.openRouter.sendChatMessage(
        'Generate flashcards from the following text:\n\n' + sourceText
      );

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI service');
      }

      const parsedContent = JSON.parse(content);
      return parsedContent.flashcards.map((card: { front: string; back: string }) => ({
        ...card,
        source: 'ai-full'
      }));
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw error;
      }
      throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateTextHash(text: string): string {
    return crypto
      .createHash('md5')
      .update(text)
      .digest('hex');
  }

  private async logGenerationError(error: any, sourceText: string): Promise<void> {
    try {
      await this.supabase.from('generation_error_logs').insert({
        user_id: DEFAULT_USER_ID,
        model: error instanceof OpenRouterError ? 'openrouter-gpt4' : 'unknown',
        error_code: error instanceof OpenRouterError ? error.code : 'UNKNOWN',
        error_message: error.message || 'Unknown error occurred',
        source_text_hash: this.calculateTextHash(sourceText),
        source_text_length: sourceText.length
      });
    } catch (logError) {
      console.error('Failed to log generation error:', logError);
    }
  }
} 