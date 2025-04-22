# Specyfikacja modułu autentykacji i rejestracji

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### Strony i layouty

- Utworzenie dedykowanych stron Astro:

  - `/src/pages/login.astro` – Strona logowania
  - `/src/pages/register.astro` – Strona rejestracji
  - `/src/pages/password-recovery.astro` – Strona odzyskiwania hasła

- Używamy jednego głównego layoutu (`/src/layouts/Layout.astro`), który zawiera przycisk logowania/wylogowania oraz inne elementy nawigacyjne. Layout ten jest stosowany zarówno dla stron publicznych (przed logowaniem), jak i dla zalogowanych użytkowników.

### Komponenty i logika klient-side

- Utworzenie komponentów React obsługujących interaktywne formularze:

  - `LoginForm.tsx` – formularz logowania (pola: email, password)
  - `RegisterForm.tsx` – formularz rejestracji (pola: email, password, confirmPassword)
  - `PasswordRecoveryForm.tsx` – formularz odzyskiwania hasła (pole: email oraz ewentualnie pola resetu hasła)

- Podział odpowiedzialności:
  - Strony Astro odpowiadają za strukturę strony, routing i integrację z backendem autentykacji.
  - Komponenty React odpowiadają za logikę interaktywną, walidację po stronie klienta oraz wyświetlanie komunikatów błędów.

### Walidacja i komunikaty błędów

- Walidacja danych odbywa się na dwóch poziomach:

  - Po stronie klienta – szybka walidacja (np. sprawdzenie formatu emaila, zgodność hasła z potwierdzeniem, minimalna długość hasła) z wykorzystaniem stanów React do śledzenia błędów.
  - Po stronie serwera – pełna walidacja przy pomocy biblioteki `zod` w endpointach API.

- Komunikaty błędów:
  - Błędy walidacji są wyświetlane bezpośrednio przy odpowiednich polach formularza lub w formie alertu/modal.
  - Przykłady scenariuszy:
    - Nieprawidłowy format emaila
    - Niezgodność haseł podczas rejestracji
    - Nieudane logowanie (np. niepoprawne hasło lub brak konta)
    - Problemy przy wysyłaniu linku do resetu hasła

## 2. LOGIKA BACKENDOWA

### Struktura endpointów API

Endpointy zostaną utworzone w katalogu `/src/pages/api/auth/` i obejmą następujące pliki:

- `register.ts` – obsługa rejestracji użytkownika przy użyciu metody POST
- `login.ts` – obsługa logowania użytkownika przy użyciu metody POST
- `logout.ts` – obsługa wylogowywania użytkownika przy użyciu metody POST
- `password-recovery.ts` – przyjmowanie żądania resetu hasła (np. wysłanie email z linkiem resetującym)
- `reset-password.ts` – obsługa faktycznego resetu hasła po otrzymaniu poprawnego tokenu

### Modele danych i walidacja

- Modele danych będą definiowane w kontraktach (np. w `/src/types.ts`), z polami takimi jak `email`, `password` oraz `confirmPassword` (dla rejestracji).

- Walidacja wejściowych danych wykonywana będzie przy użyciu `zod`:
  - Sprawdzenie poprawnego formatu emaila
  - Weryfikacja długości hasła
  - Dopasowanie pola `password` do `confirmPassword`

### Obsługa wyjątków

- Każdy endpoint API będzie opakowany w mechanizm `try/catch`:
  - W przypadku błędów walidacji zwracane będą odpowiednie kody 400 z czytelnymi komunikatami.
  - Błędy serwera będą logowane oraz zwracane z kodem 500.
  - Użycie wczesnych zwrotów (early return) dla uproszczenia logiki i uniknięcia zagnieżdżonych instrukcji warunkowych.

### Renderowanie stron server-side

- Konfiguracja Astro (`astro.config.mjs`) wskazuje tryb server-side (SSR). Strony wymagające autoryzacji będą renderowane na serwerze z uwzględnieniem danych sesyjnych.

- Middleware, umieszczone np. w `/src/middleware/index.ts`, będzie sprawdzało sesje użytkowników (np. na podstawie cookies) i zabezpieczało dostęp do stron przeznaczonych dla zalogowanych użytkowników. W przypadku braku aktywnej sesji, middleware będzie przekierowywał użytkownika do `/src/pages/login.astro`.

## 3. SYSTEM AUTENTYKACJI

### Wykorzystanie Supabase Auth

- Moduł autentykacji zostanie oparty na Supabase Auth, wykorzystując bibliotekę `@supabase/supabase-js`.

- Funkcje autentykacji:
  - Rejestracja: wykorzystanie `supabase.auth.signUp` do tworzenia nowego konta
  - Logowanie: wykorzystanie `supabase.auth.signIn` do uwierzytelniania użytkownika
  - Wylogowywanie: implementacja `supabase.auth.signOut` jako endpoint i akcja w interfejsie użytkownika
  - Odzyskiwanie hasła: integracja z funkcjonalnością resetu hasła Supabase, obejmująca wysyłanie emaila z linkiem resetującym oraz endpoint do finalizacji resetu

### Integracja z Astro

- Middleware autentykacji będzie integrowany z Astro, aby chronić strony wymagające logowania, m.in. poprzez sprawdzanie sesji zapisanych w cookies.

- Po stronie Astro odpowiedzialność za routing i zabezpieczenia stron zostanie rozszerzona o mechanizmy sprawdzające autentykację (np. przekierowanie do strony logowania, jeśli użytkownik nie jest zalogowany).

### Kluczowe komponenty i moduły

- Frontend:

  - Strony Astro: `login.astro`, `register.astro`, `password-recovery.astro`
  - Komponenty React: `LoginForm.tsx`, `RegisterForm.tsx`, `PasswordRecoveryForm.tsx`
  - Layout: `AuthLayout.astro` oraz zmodyfikowany główny layout (np. dla użytkowników zalogowanych)
  - Walidacja i obsługa komunikatów błędów na poziomie komponentów

- Backend:

  - Endpointy API w `/src/pages/api/auth/` z pełną walidacją danych (z wykorzystaniem `zod`) oraz obsługą wyjątków
  - Middleware autentykacji w `/src/middleware/index.ts` do zabezpieczenia stron
  - Modele danych zdefiniowane w `/src/types.ts`

- Autentykacja:
  - Integracja z Supabase Auth przy użyciu `@supabase/supabase-js`
  - Usługa `authService` w katalogu `/src/lib/services/` obsługująca logikę komunikacji z Supabase
  - Zarządzanie sesjami i cookies dla bezpiecznego przechowywania informacji o zalogowanych użytkownikach

## Wnioski

Moduł autentykacji i rejestracji będzie spójnie zintegrowany z istniejącą architekturą aplikacji opartej na Astro, React, TypeScript, Tailwind i Supabase. Realizacja funkcjonalności będzie opierać się na:

- Rozdzieleniu logiki interfejsu użytkownika na statyczne strony Astro i interaktywne komponenty React,
- Budowie bezpiecznych i walidowanych endpointów API z wykorzystaniem biblioteki `zod`,
- Implementacji systemu autentykacji opartego na Supabase Auth z middleware zabezpieczającym dostęp do chronionych zasobów.

Podejście to gwarantuje zgodność z wymaganiami funkcjonalnymi określonymi w dokumencie PRD (US-001, US-002, US-003) oraz utrzymuje spójność z pozostałymi elementami istniejącej aplikacji.
