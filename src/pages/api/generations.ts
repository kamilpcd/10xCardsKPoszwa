import { z } from "zod";
import type { APIRoute } from "astro";
import type { CreateGenerationCommandDTO } from "../../types";
import { GenerationService } from "../../lib/generation.service";

export const prerender = false;

// Schema walidacji dla danych wejściowych
const createGenerationSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Tekst musi zawierać minimum 1000 znaków")
    .max(10000, "Tekst nie może przekraczać 10000 znaków"),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Sprawdzenie, czy użytkownik jest zalogowany
    if (!locals.user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Musisz być zalogowany, aby generować fiszki",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parsowanie body requestu
    const body = (await request.json()) as CreateGenerationCommandDTO;

    // Walidacja danych wejściowych
    const validationResult = createGenerationSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Inicjalizacja serwisu i wywołanie generacji
    const generationService = new GenerationService(locals.supabase, {
      apiKey: import.meta.env.OPENROUTER_API_KEY,
    });

    // Przekazanie ID zalogowanego użytkownika
    const result = await generationService.generateFlashcards(body.source_text, locals.user.id);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
