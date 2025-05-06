import type { APIRoute } from "astro";
import { createSupabaseWithAuth } from "../../../db/supabase.client";
import { z } from "zod";

// Schema walidacji danych logowania
const loginSchema = z.object({
  email: z.string().email({ message: "Wprowadź poprawny adres email" }),
  password: z.string().min(6, { message: "Hasło musi mieć co najmniej 6 znaków" }),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Pobieranie danych z żądania
    const data = await request.json();

    // Walidacja danych wejściowych
    const validationResult = loginSchema.safeParse(data);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
        }),
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Utworzenie instancji Supabase z obsługą ciasteczek
    const supabase = createSupabaseWithAuth({ cookies, headers: request.headers });

    // Logowanie użytkownika
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Obsługa błędów logowania
    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Nieprawidłowy email lub hasło",
        }),
        { status: 401 }
      );
    }

    // Zwrócenie informacji o udanym logowaniu
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      }),
      { status: 200 }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Wystąpił błąd podczas logowania. Spróbuj ponownie później.",
      }),
      { status: 500 }
    );
  }
};

// Wyłączenie prerenderingu dla endpointu API
export const prerender = false;
