import type { APIRoute } from 'astro';
import { createSupabaseWithAuth } from '../../../db/supabase.client';
import { z } from 'zod';

// Schema walidacji danych rejestracji
const registerSchema = z.object({
  email: z.string().email({ message: "Wprowadź poprawny adres email" }),
  password: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    // Pobieranie danych z żądania
    const data = await request.json();
    
    // Walidacja danych wejściowych
    const validationResult = registerSchema.safeParse(data);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          errors: validationResult.error.flatten().fieldErrors 
        }),
        { status: 400 }
      );
    }
    
    const { email, password } = validationResult.data;
    
    // Utworzenie instancji Supabase z obsługą ciasteczek
    const supabase = createSupabaseWithAuth({ cookies, headers: request.headers });
    
    // Rejestracja użytkownika
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/login`,
      }
    });
    
    // Obsługa błędów rejestracji
    if (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message 
        }),
        { status: 400 }
      );
    }
    
    // Weryfikacja adresu email może być wymagana (zależy od konfiguracji Supabase)
    const emailConfirmationRequired = authData.user?.identities?.length === 0;
    
    // Zwrócenie informacji o udanej rejestracji
    return new Response(
      JSON.stringify({
        success: true,
        user: authData.user,
        message: emailConfirmationRequired
          ? "Wysłaliśmy link weryfikacyjny na Twój adres email. Proszę sprawdź swoją skrzynkę."
          : "Rejestracja zakończona sukcesem. Jesteś teraz zalogowany."
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Błąd podczas rejestracji:", err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Wystąpił błąd podczas rejestracji. Spróbuj ponownie później." 
      }),
      { status: 500 }
    );
  }
};

// Wyłączenie prerenderingu dla endpointu API
export const prerender = false; 