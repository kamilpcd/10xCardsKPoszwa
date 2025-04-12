import { z } from 'zod';
import type { APIRoute } from 'astro';
import type { CreateGenerationCommandDTO } from '../../types';
import { GenerationService } from '../../lib/generation.service';

export const prerender = false;

// Schema walidacji dla danych wejściowych
const createGenerationSchema = z.object({
  source_text: z.string()
    .min(1000, 'Tekst musi zawierać minimum 1000 znaków')
    .max(10000, 'Tekst nie może przekraczać 10000 znaków')
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parsowanie body requestu
    const body = await request.json() as CreateGenerationCommandDTO;

    // Walidacja danych wejściowych
    const validationResult = createGenerationSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request data',
        details: validationResult.error.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Inicjalizacja serwisu i wywołanie generacji
    const generationService = new GenerationService(locals.supabase);
    const result = await generationService.generateFlashcards(body.source_text);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in generations endpoint:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 