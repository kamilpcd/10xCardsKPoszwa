import { defineMiddleware } from "astro:middleware";
import { createSupabaseWithAuth } from "../db/supabase.client";

// Ścieżki publiczne - dostępne bez logowania
const PUBLIC_PATHS = ["/login", "/register", "/api/auth/login", "/api/auth/register", "/api/auth/logout"];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  // Tworzenie instancji Supabase z obsługą autentykacji
  const supabase = createSupabaseWithAuth({
    cookies,
    headers: request.headers,
  });

  // Przekazanie klienta Supabase do kontekstu
  locals.supabase = supabase;

  // Sprawdzenie sesji użytkownika
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jeśli użytkownik jest zalogowany, dodaj informacje do kontekstu
  if (user) {
    locals.user = {
      id: user.id,
      email: user.email,
    };
  }
  // Jeśli użytkownik nie jest zalogowany i próbuje uzyskać dostęp do chronionej ścieżki
  else if (!PUBLIC_PATHS.includes(url.pathname)) {
    // Przekierowanie do strony logowania
    return redirect("/login");
  }

  return next();
});
