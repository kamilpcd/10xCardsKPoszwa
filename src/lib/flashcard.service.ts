import type { SupabaseClient } from '../db/supabase.client';
import type { CreateFlashcardDTO, FlashcardDTO } from '../types';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Custom error class for database-related errors
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class FlashcardService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Validates that all provided generation IDs exist in the database
   * 
   * @param generationIds - Array of generation IDs to validate
   * @throws {DatabaseError} When one or more generation IDs don't exist
   * @returns Promise that resolves when all IDs are valid
   */
  async validateGenerationIds(generationIds: readonly number[]): Promise<void> {
    if (generationIds.length === 0) return;

    const uniqueGenerationIds = [...new Set(generationIds)];

    const { count } = await this.supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .in("id", uniqueGenerationIds);

    if (count !== uniqueGenerationIds.length) {
      throw new DatabaseError(
        "Invalid generation IDs",
        "INVALID_GENERATION_ID",
        "One or more generation_ids do not exist"
      );
    }
  }

  /**
   * Creates multiple flashcards in a single batch operation
   * 
   * @param userId - ID of the user creating the flashcards
   * @param flashcards - Array of flashcard data to create
   * @throws {DatabaseError} When the database operation fails or foreign key constraint is violated
   * @returns Promise resolving to array of created flashcards
   */
  async createFlashcardsInBatch(
    userId: string,
    flashcards: readonly CreateFlashcardDTO[]
  ): Promise<FlashcardDTO[]> {
    const flashcardsWithUserId = flashcards.map(flashcard => ({
      ...flashcard,
      user_id: userId
    }));

    const { data, error } = await this.supabase
      .from('flashcards')
      .insert(flashcardsWithUserId)
      .select('id, front, back, source, generation_id, created_at, updated_at');

    if (error) {
      console.error('Error creating flashcards:', error);
      
      // Handle foreign key violation
      if (error instanceof PostgrestError && error.code === '23503' && error.details?.includes('generation_id')) {
        throw new DatabaseError(
          'Invalid generation reference',
          error.code,
          'One or more generation_ids reference non-existent generations'
        );
      }
      throw new DatabaseError(
        'Failed to create flashcards',
        'CREATE_FLASHCARDS_ERROR',
        error.message
      );
    }

    return data as FlashcardDTO[];
  }
} 