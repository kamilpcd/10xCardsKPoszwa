import type { APIRoute } from "astro";
import { createSupabaseWithAuth } from "../../../db/supabase.client";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Utworzenie instancji Supabase z obsługą ciasteczek
    const supabase = createSupabaseWithAuth({ cookies, headers: request.headers });

    // Wylogowanie użytkownika
    const { error } = await supabase.auth.signOut();

    // Obsługa błędów wylogowania
    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Wystąpił błąd podczas wylogowania",
        }),
        { status: 500 }
      );
    }

    // Zwrócenie informacji o udanym wylogowaniu
    return new Response(
      JSON.stringify({
        success: true,
        message: "Pomyślnie wylogowano",
      }),
      { status: 200 }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Wystąpił błąd podczas wylogowania. Spróbuj ponownie później.",
      }),
      { status: 500 }
    );
  }
};

// Wyłączenie prerenderingu dla endpointu API
export const prerender = false;
