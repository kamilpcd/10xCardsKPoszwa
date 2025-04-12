import crypto from 'crypto';
import type { SupabaseClient } from '../db/supabase.client';
import type { FlashcardProposalDTO, GenerationResponseDTO } from '../types';
import { DEFAULT_USER_ID } from '../db/supabase.client';

export class GenerationService {
  constructor(private readonly supabase: SupabaseClient) {}

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
        model: 'openrouter-test', // TODO: Make configurable
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
    // Symulacja opóźnienia odpowiedzi API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Implementacja integracji z Openrouter.ai
    // Mock odpowiedzi AI
    return [
      {
        front: "Co to jest TypeScript?",
        back: "TypeScript to typowany nadzbiór JavaScript, który kompiluje się do czystego JavaScript.",
        source: "ai-full"
      },
      {
        front: "Jakie są główne zalety TypeScript?",
        back: "Statyczne typowanie, wsparcie dla nowoczesnych funkcji JS, lepsze wsparcie IDE, wykrywanie błędów podczas kompilacji.",
        source: "ai-full"
      }
    ];
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
        model: 'openrouter-test',
        error_code: error.code || 'UNKNOWN',
        error_message: error.message || 'Unknown error occurred',
        source_text_hash: this.calculateTextHash(sourceText),
        source_text_length: sourceText.length
      });
    } catch (logError) {
      console.error('Failed to log generation error:', logError);
    }
  }
} 