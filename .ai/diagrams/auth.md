<authentication_analysis>
Analiza autentykacji:

1. Przepływy: Logowanie, Rejestracja, Odzyskiwanie hasła, Wylogowanie, Odświeżanie tokenu.
2. Aktorzy: Przeglądarka, Middleware, Astro API, Supabase Auth.
3. Weryfikacja: Po logowaniu token jest dołączany do cookies, a middleware weryfikuje token przy każdym żądaniu.
4. Opis kroków:
   - Logowanie: Formularz logowania -> API -> Supabase -> zwrot tokenu i utworzenie sesji.
   - Rejestracja: Formularz rejestracji -> API -> Supabase -> utworzenie konta i logowanie.
   - Odzyskiwanie hasła: Formularz odzyskiwania -> API -> Supabase -> wysłanie emaila resetowego, następnie reset hasła.
   - Wylogowanie: Żądanie wylogowania -> API -> Supabase -> usunięcie sesji.
   - Odświeżanie tokenu: W przypadku wygaśnięcia tokenu, API inicjuje proces odświeżania poprzez Supabase.
     </authentication_analysis>

<mermaid_diagram>

```mermaid
sequenceDiagram
autonumber
participant Browser as Przeglądarka
participant Middleware as Middleware
participant AstroAPI as "Astro API"
participant Supabase as "Supabase Auth"

%% Logowanie
Browser->>Browser: Wprowadza dane logowania
Browser->>AstroAPI: POST /api/auth/login (email, hasło)
activate AstroAPI
AstroAPI->>Supabase: signIn(email, password)
activate Supabase
Supabase-->>AstroAPI: Zwraca token/sesję
deactivate Supabase
AstroAPI->>Browser: Przekazuje potwierdzenie logowania (ustawia cookie)
deactivate AstroAPI
Browser->>Middleware: Żądanie zasobu
Middleware->>AstroAPI: Weryfikacja tokenu
AstroAPI-->>Middleware: Token ważny
Middleware->>Browser: Dostęp przyznany

%% Rejestracja
Browser->>Browser: Wprowadza dane rejestracji
Browser->>AstroAPI: POST /api/auth/register (email, hasło, potwierdzenie)
activate AstroAPI
AstroAPI->>Supabase: signUp(email, password)
activate Supabase
Supabase-->>AstroAPI: Konto utworzone
deactivate Supabase
AstroAPI->>Browser: Potwierdzenie rejestracji i logowania
deactivate AstroAPI

%% Odzyskiwanie hasła
Browser->>Browser: Wprowadza adres email
Browser->>AstroAPI: POST /api/auth/password-recovery (email)
activate AstroAPI
AstroAPI->>Supabase: Wysyłanie emaila resetowego
activate Supabase
Supabase-->>AstroAPI: Email wysłany
deactivate Supabase
AstroAPI->>Browser: Potwierdzenie wysłania emaila
deactivate AstroAPI
Browser->>Browser: Otrzymuje email z tokenem
Browser->>AstroAPI: POST /api/auth/reset-password (token, nowe hasło)
activate AstroAPI
AstroAPI->>Supabase: Reset hasła
activate Supabase
Supabase-->>AstroAPI: Potwierdzenie resetu
deactivate Supabase
AstroAPI->>Browser: Reset hasła udany
deactivate AstroAPI

%% Wylogowanie
Browser->>AstroAPI: POST /api/auth/logout
activate AstroAPI
AstroAPI->>Supabase: signOut
activate Supabase
Supabase-->>AstroAPI: Potwierdzenie wylogowania
deactivate Supabase
AstroAPI->>Browser: Sesja usunięta, przekierowanie do logowania
deactivate AstroAPI

%% Odświeżanie tokenu
alt Token ważny
    Browser->>Middleware: Żądanie zasobu
    Middleware->>AstroAPI: Weryfikacja tokenu
    AstroAPI-->>Middleware: Token ważny
    Middleware->>Browser: Dostęp przyznany
else Token wygasły
    Browser->>AstroAPI: POST /api/auth/refresh-token
    activate AstroAPI
    AstroAPI->>Supabase: refresh token
    activate Supabase
    Supabase-->>AstroAPI: Nowy token
    deactivate Supabase
    AstroAPI->>Browser: Nowy token ustawiony
    deactivate AstroAPI
end
```

</mermaid_diagram>
