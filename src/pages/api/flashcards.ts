import type { APIRoute } from "astro";
import { z } from "zod";
import type { CreateFlashcardsDTO } from "../../types";
import { FlashcardService, DatabaseError } from "../../lib/flashcard.service";

// Validation schema for individual flashcard
const flashcardSchema = z
  .object({
    front: z.string().max(200, "Front text cannot exceed 200 characters"),
    back: z.string().max(500, "Back text cannot exceed 500 characters"),
    source: z.enum(["ai-full", "ai-edited", "manual"] as const),
    generation_id: z.number().nullable(),
  })
  .refine(
    (data) => {
      // Validate generation_id based on source
      if (data.source === "manual" && data.generation_id !== null) {
        return false;
      }
      if ((data.source === "ai-full" || data.source === "ai-edited") && data.generation_id === null) {
        return false;
      }
      return true;
    },
    {
      message: "generation_id must be null for manual source and non-null for ai-full/ai-edited sources",
    }
  );

// Validation schema for the entire request
const createFlashcardsSchema = z.object({
  flashcards: z
    .array(flashcardSchema)
    .min(1, "At least one flashcard is required")
    .max(100, "Maximum 100 flashcards allowed per request"),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Sprawdzenie, czy użytkownik jest zalogowany
    if (!locals.user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Musisz być zalogowany, aby zapisywać fiszki",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { supabase } = locals;
    const flashcardService = new FlashcardService(supabase);

    // Parse request body
    const body = await request.json();

    // Validate input data
    const validationResult = createFlashcardsSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { flashcards } = validationResult.data as CreateFlashcardsDTO;

    // Validate that all referenced generation_ids exist
    const generationIds = flashcards.map((f) => f.generation_id).filter((id): id is number => id !== null);

    try {
      await flashcardService.validateGenerationIds(generationIds);
    } catch (error: unknown) {
      if (error instanceof DatabaseError) {
        return new Response(
          JSON.stringify({
            error: error.code,
            details: error.details,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      throw error; // Re-throw unknown errors
    }

    // Save flashcards - używamy ID zalogowanego użytkownika
    const createdFlashcards = await flashcardService.createFlashcardsInBatch(locals.user.id, flashcards);

    return new Response(JSON.stringify({ flashcards: createdFlashcards }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    // Rejestrujemy błąd bez używania console.error
    // Tutaj można zaimplementować bardziej zaawansowane logowanie
    if (error instanceof DatabaseError) {
      return new Response(
        JSON.stringify({
          error: error.code,
          details: error.details,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "INTERNAL_SERVER_ERROR",
        details: "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
