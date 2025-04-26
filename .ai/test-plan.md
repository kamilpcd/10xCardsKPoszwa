# Plan Testów dla Projektu "FiszkiAIkp"

## 1. Wprowadzenie i Cele Testowania

### 1.1 Wprowadzenie

Niniejszy dokument opisuje plan testów dla aplikacji webowej "FiszkiAIkp". Aplikacja umożliwia użytkownikom generowanie fiszek edukacyjnych z podanego tekstu źródłowego przy użyciu sztucznej inteligencji (AI), a następnie ich przeglądanie, edycję i zapisywanie. Projekt oparty jest o nowoczesny stos technologiczny, w tym Astro, React, TypeScript, Supabase jako backend (BaaS) oraz integrację z zewnętrznym API AI (OpenRouter).

### 1.2 Cele Testowania

Głównymi celami procesu testowania są:

*   **Weryfikacja Funkcjonalności:** Zapewnienie, że wszystkie funkcje aplikacji działają zgodnie z wymaganiami i specyfikacją (np. generowanie fiszek, autentykacja, zapis danych).
*   **Identyfikacja i Eliminacja Błędów:** Wykrycie jak największej liczby defektów przed wdrożeniem produkcyjnym.
*   **Zapewnienie Jakości:** Ocena ogólnej jakości aplikacji pod kątem stabilności, wydajności, bezpieczeństwa i użyteczności.
*   **Weryfikacja Integracji:** Sprawdzenie poprawnej współpracy między komponentami frontendowymi, backendowymi (API), bazą danych (Supabase) oraz zewnętrznymi usługami (OpenRouter AI).
*   **Ocena Zgodności:** Potwierdzenie, że aplikacja spełnia zdefiniowane kryteria akceptacji.
*   **Zapewnienie Niezawodności:** Weryfikacja, że aplikacja działa stabilnie w różnych warunkach i poprawnie obsługuje błędy.

## 2. Zakres Testów

### 2.1 Funkcjonalności Włączone w Zakres Testów

*   **Moduł Autentykacji:**
    *   Rejestracja nowego użytkownika.
    *   Logowanie istniejącego użytkownika.
    *   Wylogowanie użytkownika.
    *   Obsługa błędów walidacji i autentykacji w formularzach.
    *   Ochrona ścieżek wymagających zalogowania (np. `/generate`).
    *   Automatyczne przekierowanie zalogowanego użytkownika ze stron `/login`, `/register`.
*   **Moduł Generowania Fiszek:**
    *   Wprowadzanie tekstu źródłowego.
    *   Walidacja długości tekstu (minimum 1000, maksimum 10000 znaków) w czasie rzeczywistym.
    *   Wyświetlanie licznika znaków i feedbacku wizualnego.
    *   Inicjowanie procesu generowania fiszek.
    *   Obsługa stanu ładowania (wyświetlanie `SkeletonLoader`, blokowanie przycisku).
    *   Komunikacja z API `/api/generations`.
    *   Obsługa błędów generowania (np. błędy API AI, błędy serwera) i ich komunikacja użytkownikowi (`ErrorNotification`).
*   **Moduł Zarządzania Propozycjami Fiszek:**
    *   Wyświetlanie listy wygenerowanych propozycji (`FlashcardProposalsList`, `FlashcardProposalItem`).
    *   Akceptowanie/Cofanie akceptacji propozycji.
    *   Edycja treści (front/back) propozycji.
    *   Walidacja podczas edycji (limity znaków, puste pola).
    *   Zapisywanie/Anulowanie edycji.
    *   Oznaczanie fiszek jako edytowane/zaakceptowane (`Badge`).
    *   Odrzucanie propozycji (usuwanie z listy).
    *   Wyświetlanie licznika zaakceptowanych fiszek.
*   **Moduł Zapisywania Fiszek:**
    *   Zapisywanie tylko zaakceptowanych fiszek.
    *   Zapisywanie wszystkich wygenerowanych fiszek.
    *   Komunikacja z API `/api/flashcards` (bulk create).
    *   Obsługa stanu zapisywania (ładowanie, blokowanie przycisków).
    *   Obsługa błędów zapisu (np. błąd walidacji `generation_id`, błąd bazy danych) i ich komunikacja użytkownikowi.
    *   Wyświetlanie komunikatu sukcesu po zapisaniu.
    *   Resetowanie stanu widoku po pomyślnym zapisie.
*   **Interfejs Użytkownika (UI) i Doświadczenie Użytkownika (UX):**
    *   Poprawność renderowania stron i komponentów.
    *   Spójność wizualna (zgodność z designem, działanie Tailwind CSS).
    *   Responsywność (jeśli dotyczy).
    *   Intuicyjność nawigacji i przepływów.
    *   Czytelność komunikatów (błędy, sukces, informacje).
    *   Dostępność strony `/password-recovery` (bez funkcjonalności backendowej).
*   **Backend API:**
    *   Poprawność działania endpointów (`/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/generations`, `/api/flashcards`).
    *   Walidacja danych wejściowych (schematy Zod).
    *   Autoryzacja (wymaganie zalogowanego użytkownika).
    *   Poprawność interakcji z serwisami (`FlashcardService`, `GenerationService`, Supabase Auth).
    *   Poprawność formatu odpowiedzi (sukces, błędy).
    *   Obsługa błędów (np. `DatabaseError`, `OpenRouterError`).
*   **Middleware:**
    *   Poprawność inicjalizacji Supabase.
    *   Poprawność sprawdzania sesji użytkownika.
    *   Poprawność ustawiania `Astro.locals`.
    *   Poprawność logiki przekierowań dla ścieżek publicznych/chronionych.

### 2.2 Funkcjonalności Wyłączone z Zakresu Testów

*   **Funkcjonalność odzyskiwania hasła po stronie backendu.** Strona `/password-recovery` istnieje, ale nie ma implementacji API do obsługi tego procesu. Testowanie ograniczy się do sprawdzenia dostępności strony i formularza.
*   Szczegółowe testy wydajności i skalowalności pod dużym obciążeniem (przeprowadzone zostaną jedynie podstawowe testy).
*   Testy użyteczności (Usability Testing) z udziałem końcowych użytkowników (mogą być przeprowadzone osobno).
*   Testy penetracyjne (mogą być przeprowadzone osobno).
*   Testowanie wewnętrznej implementacji i niezawodności usług zewnętrznych (Supabase, OpenRouter AI) - zakładamy ich poprawne działanie zgodnie z dokumentacją, skupiamy się na integracji i obsłudze ich odpowiedzi/błędów.
*   Testy kompatybilności na bardzo szerokiej gamie przeglądarek i urządzeń (skupimy się na najpopularniejszych wersjach Chrome, Firefox, Safari na desktopach).

## 3. Typy Testów do Przeprowadzenia

*   **Testy Jednostkowe (Unit Tests):**
    *   **Cel:** Weryfikacja poprawności działania izolowanych fragmentów kodu (funkcje, komponenty React, metody serwisów).
    *   **Zakres:** Funkcje pomocnicze (`utils.ts`), logika komponentów React (zarządzanie stanem, walidacja, renderowanie warunkowe - bez głębokiego renderowania), logika serwisów (`FlashcardService`, `GenerationService`, `OpenRouterService` - z zamockowanymi zależnościami), logika walidacji (Zod).
    *   **Narzędzia:** Vitest, React Testing Library (RTL).
*   **Testy Integracyjne (Integration Tests):**
    *   **Cel:** Weryfikacja poprawnej współpracy między różnymi modułami/komponentami.
    *   **Zakres:**
        *   Integracja komponentów React (np. `FlashcardGenerateView` z `TextInput`, `GenerateButton`, `FlashcardProposalsList`).
        *   Integracja serwisów backendowych (np. `GenerationService` z mockowanym `OpenRouterService` i mockowanym/rzeczywistym `Supabase`).
        *   Integracja API Routes z serwisami i Supabase (testowanie endpointów API).
        *   Integracja Middleware z logiką autentykacji Supabase.
    *   **Narzędzia:** Vitest, React Testing Library, Supertest (lub `fetch` w testach Vitest dla API), Mock Service Worker (MSW) lub `vi.mock`, testowa instancja Supabase.
*   **Testy End-to-End (E2E Tests):**
    *   **Cel:** Symulacja rzeczywistych scenariuszy użycia aplikacji z perspektywy użytkownika, weryfikacja całych przepływów w przeglądarce.
    *   **Zakres:** Krytyczne ścieżki użytkownika (rejestracja, logowanie, generowanie, edycja, zapis, wylogowanie), interakcje z UI, nawigacja, przepływ danych przez całą aplikację.
    *   **Narzędzia:** Playwright (preferowany ze względu na możliwości testowania wizualnego i API).
*   **Testy API (API Tests):**
    *   **Cel:** Bezpośrednia weryfikacja działania endpointów API (request/response, walidacja, autoryzacja, obsługa błędów).
    *   **Zakres:** Wszystkie zaimplementowane endpointy w `src/pages/api/`.
    *   **Narzędzia:** Playwright (wbudowane możliwości testowania API), Postman/Insomnia (testy manualne/eksploracyjne).
*   **Testy Wizualne Regresji (Visual Regression Tests):**
    *   **Cel:** Wykrywanie niezamierzonych zmian w wyglądzie interfejsu użytkownika poprzez porównywanie screenshotów.
    *   **Zakres:** Kluczowe komponenty UI (`src/components/ui/`), główne widoki/strony.
    *   **Narzędzia:** Playwright (z integracją porównywania obrazów), Storybook (jeśli zostanie dodany) z dodatkami.
*   **Testy Wydajności (Performance Tests - Podstawowe):**
    *   **Cel:** Wstępna ocena czasu odpowiedzi aplikacji pod umiarkowanym obciążeniem.
    *   **Zakres:** Czas odpowiedzi kluczowych API (`/api/generations`, `/api/flashcards`), czas ładowania strony `/generate`.
    *   **Narzędzia:** Narzędzia deweloperskie przeglądarki (Lighthouse, Performance), proste skrypty mierzące czas odpowiedzi API (np. k6, Playwright).
*   **Testy Bezpieczeństwa (Security Tests - Podstawowe):**
    *   **Cel:** Identyfikacja podstawowych luk bezpieczeństwa.
    *   **Zakres:** Weryfikacja ochrony ścieżek (middleware), sprawdzanie braku wycieku wrażliwych danych (np. kluczy API po stronie klienta), podstawowa walidacja danych wejściowych pod kątem XSS (choć frameworki często zapewniają ochronę).
    *   **Narzędzia:** Przegląd kodu, narzędzia deweloperskie przeglądarki, testy E2E sprawdzające dostęp.
*   **Testy Eksploracyjne (Exploratory Testing):**
    *   **Cel:** Nieskryptowane testowanie aplikacji w celu odkrycia nieoczekiwanych błędów i problemów z użytecznością.
    *   **Zakres:** Cała aplikacja.
    *   **Narzędzia:** Wiedza i doświadczenie testera.

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

Poniżej przedstawiono przykładowe scenariusze testowe wysokiego poziomu. Szczegółowe przypadki testowe zostaną opracowane osobno.

### 4.1 Autentykacja

| ID Scenariusza | Opis                                                                     | Oczekiwany Rezultat                                                                                                | Typ Testu        | Priorytet |
| :------------- | :----------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :--------------- | :-------- |
| AUTH-001       | Rejestracja nowego użytkownika z poprawnymi danymi                       | Użytkownik zostaje zarejestrowany, zalogowany (lub otrzymuje info o weryfikacji email) i przekierowany na `/generate`. | E2E, API         | Krytyczny |
| AUTH-002       | Rejestracja z istniejącym adresem email                                  | Wyświetlenie komunikatu błędu informującego, że email jest zajęty.                                                  | E2E, API         | Wysoki    |
| AUTH-003       | Rejestracja z niepoprawnym formatem email/za krótkim hasłem              | Wyświetlenie błędów walidacji przy odpowiednich polach formularza.                                                  | E2E, Jednostkowy | Wysoki    |
| AUTH-004       | Logowanie z poprawnymi danymi uwierzytelniającymi                       | Użytkownik zostaje zalogowany i przekierowany na `/generate`. Navbar wyświetla email użytkownika i przycisk Wyloguj. | E2E, API         | Krytyczny |
| AUTH-005       | Logowanie z niepoprawnymi danymi uwierzytelniającymi                     | Wyświetlenie ogólnego komunikatu o błędzie logowania.                                                               | E2E, API         | Wysoki    |
| AUTH-006       | Próba dostępu do `/generate` przez niezalogowanego użytkownika          | Użytkownik zostaje przekierowany na `/login`.                                                                      | E2E, Integracyjny| Krytyczny |
| AUTH-007       | Wylogowanie użytkownika                                                  | Sesja użytkownika zostaje zakończona, użytkownik zostaje przekierowany na `/login`. Navbar pokazuje przycisk Zaloguj. | E2E, API         | Krytyczny |
| AUTH-008       | Próba dostępu do `/login` / `/register` przez zalogowanego użytkownika | Użytkownik zostaje przekierowany na `/generate`.                                                                   | E2E, Integracyjny| Średni    |
| AUTH-010       | Dostępność strony i linku do odzyskiwania hasła                          | Strona `/password-recovery` jest dostępna. Link "Zapomniałem hasła" na stronie logowania działa.                     | E2E              | Niski     |

### 4.2 Generowanie Fiszek

| ID Scenariusza | Opis                                                                         | Oczekiwany Rezultat                                                                                                                                   | Typ Testu                 | Priorytet |
| :------------- | :--------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------ | :-------- |
| GEN-001        | Wprowadzenie tekstu spełniającego wymagania długości (1000-10000 znaków)      | Licznik znaków pokazuje poprawną liczbę, przycisk "Generuj fiszki" jest aktywny.                                                                       | E2E, Jednostkowy          | Wysoki    |
| GEN-002        | Wprowadzenie tekstu za krótkiego (< 1000 znaków)                             | Licznik znaków pokazuje błąd/ostrzeżenie, przycisk "Generuj fiszki" jest nieaktywny, wyświetlany jest komunikat o minimalnej długości.                   | E2E, Jednostkowy          | Wysoki    |
| GEN-003        | Wprowadzenie tekstu za długiego (> 10000 znaków)                            | Licznik znaków pokazuje błąd/ostrzeżenie, przycisk "Generuj fiszki" jest nieaktywny, wyświetlany jest komunikat o maksymalnej długości.                  | E2E, Jednostkowy          | Wysoki    |
| GEN-004        | Pomyślne wygenerowanie fiszek                                                | Po kliknięciu "Generuj fiszki" wyświetla się `SkeletonLoader`, a następnie lista propozycji fiszek (`FlashcardProposalsList`). Stan ładowania znika. | E2E, Integracyjny, API    | Krytyczny |
| GEN-005        | Obsługa błędu podczas generowania (np. błąd API AI)                          | Wyświetlany jest `ErrorNotification` z odpowiednim komunikatem. Stan ładowania znika.                                                                  | E2E, Integracyjny (mock)  | Wysoki    |
| GEN-006        | Próba generowania fiszek przez niezalogowanego użytkownika (jeśli możliwe API) | API `/api/generations` zwraca błąd 401 Unauthorized.                                                                                                   | API                       | Krytyczny |
| GEN-007        | Poprawność danych wysyłanych do API `/api/generations`                       | Żądanie POST zawiera poprawny `source_text` w ciele.                                                                                                | Integracyjny, API, E2E    | Wysoki    |
| GEN-008        | Poprawność danych zwracanych przez API `/api/generations`                    | Odpowiedź zawiera `generation_id`, `flashcards_proposals` (z `front`, `back`, `source: "ai-full"`), `generated_count`.                              | API, Integracyjny (mock)  | Wysoki    |

### 4.3 Zarządzanie Propozycjami Fiszek

| ID Scenariusza | Opis                                                                      | Oczekiwany Rezultat                                                                                                             | Typ Testu               | Priorytet |
| :------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------ | :---------------------- | :-------- |
| MGMT-001       | Akceptacja/Cofnięcie akceptacji fiszki                                    | Przycisk zmienia tekst ("Zatwierdź"/"Cofnij akceptację"), badge "Zaakceptowana" pojawia się/znika, licznik zaakceptowanych się aktualizuje. | E2E, Jednostkowy        | Krytyczny |
| MGMT-002       | Wejście w tryb edycji fiszki                                              | Wyświetlane są pola `Textarea` dla frontu i tyłu, przyciski "Zapisz zmiany", "Anuluj".                                           | E2E, Jednostkowy        | Wysoki    |
| MGMT-003       | Edycja fiszki i zapisanie poprawnych zmian                                | Zmiany są widoczne w widoku fiszki, fiszka jest oznaczona jako "Edytowana" i "Zaakceptowana".                                  | E2E, Jednostkowy        | Krytyczny |
| MGMT-004       | Próba zapisu edycji z pustym frontem/tyłem lub przekroczonym limitem znaków | Wyświetlane są komunikaty błędów przy odpowiednich polach, zapis jest niemożliwy.                                               | E2E, Jednostkowy        | Wysoki    |
| MGMT-005       | Anulowanie edycji fiszki                                                  | Fiszka wraca do poprzedniego stanu, tryb edycji zostaje zamknięty.                                                              | E2E, Jednostkowy        | Średni    |
| MGMT-006       | Odrzucenie fiszki                                                         | Fiszka znika z listy, licznik zaakceptowanych/ogólny się aktualizuje.                                                            | E2E, Jednostkowy        | Wysoki    |
| MGMT-007       | Wyświetlanie badge "Edytowana" i "Zaakceptowana" poprawnie                | Badge pojawiają się zgodnie ze stanem fiszki.                                                                                   | E2E, Wizualny           | Średni    |

### 4.4 Zapisywanie Fiszek

| ID Scenariusza | Opis                                                                            | Oczekiwany Rezultat                                                                                                                                                           | Typ Testu                | Priorytet |
| :------------- | :------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :-------- |
| SAVE-001       | Zapisanie zaakceptowanych fiszek (gdy są zaakceptowane)                         | Żądanie POST do `/api/flashcards` wysyłane jest z poprawnymi danymi (tylko zaakceptowane fiszki, `source` ustawiony na `ai-edited` lub `ai-full`). Wyświetla się komunikat sukcesu. | E2E, Integracyjny, API   | Krytyczny |
| SAVE-002       | Zapisanie wszystkich fiszek                                                     | Żądanie POST do `/api/flashcards` wysyłane jest z poprawnymi danymi (wszystkie fiszki). Wyświetla się komunikat sukcesu.                                                         | E2E, Integracyjny, API   | Krytyczny |
| SAVE-003       | Próba zapisania zaakceptowanych, gdy żadna nie jest zaakceptowana               | Przycisk "Zapisz zaakceptowane" jest nieaktywny.                                                                                                                                | E2E, Jednostkowy         | Wysoki    |
| SAVE-004       | Obsługa stanu ładowania podczas zapisywania                                     | Przyciski pokazują stan ładowania i są nieaktywne.                                                                                                                            | E2E, Jednostkowy         | Wysoki    |
| SAVE-005       | Obsługa błędu podczas zapisywania (np. błąd walidacji `generation_id`, błąd 500) | Wyświetlany jest `ErrorNotification` z odpowiednim komunikatem. Stan ładowania znika.                                                                                           | E2E, Integracyjny(mock) | Wysoki    |
| SAVE-006       | Resetowanie widoku po pomyślnym zapisie                                         | Po 1.5 sekundy od sukcesu, lista fiszek i pole tekstowe są czyszczone.                                                                                                        | E2E                      | Wysoki    |
| SAVE-007       | Próba zapisu przez niezalogowanego użytkownika (jeśli możliwe API)              | API `/api/flashcards` zwraca błąd 401 Unauthorized.                                                                                                                            | API                      | Krytyczny |
| SAVE-008       | Poprawność danych wysyłanych do API `/api/flashcards`                           | Ciało żądania zawiera tablicę `flashcards` zgodną ze schematem `CreateFlashcardDTO`, `generation_id` jest poprawne.                                                           | API, Integracyjny        | Wysoki    |
| SAVE-009       | Walidacja `generation_id` po stronie API (przypadek nieistniejącego ID)         | API `/api/flashcards` zwraca błąd 400 z informacją o niepoprawnym `generation_id`.                                                                                            | API, Integracyjny        | Wysoki    |

### 4.5 UI/UX

| ID Scenariusza | Opis                                                               | Oczekiwany Rezultat                                                                     | Typ Testu          | Priorytet |
| :------------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :----------------- | :-------- |
| UIUX-001       | Spójność wyglądu komponentów UI (przyciski, karty, alerty, itp.)  | Komponenty wyglądają spójnie na różnych stronach i zgodnie z biblioteką UI.             | Wizualny, E2E      | Średni    |
| UIUX-002       | Poprawność działania trybu ciemnego/jasnego                        | Aplikacja poprawnie przełącza i wyświetla style dla obu trybów.                         | Wizualny, E2E      | Średni    |
| UIUX-003       | Czytelność komunikatów o błędach i sukcesach                       | Komunikaty są jasne, zrozumiałe dla użytkownika i wyświetlane w odpowiednich miejscach. | E2E, Eksploracyjny | Wysoki    |
| UIUX-004       | Poprawność działania nawigacji (Navbar, linki)                     | Linki prowadzą do odpowiednich stron, stan zalogowania/wylogowania jest odzwierciedlony. | E2E                | Krytyczny |
| UIUX-005       | Wygląd i działanie strony powitalnej (`/`)                         | Strona wyświetla się poprawnie, zawiera oczekiwane informacje.                            | E2E, Wizualny      | Niski     |
| UIUX-006       | Wygląd i działanie SkeletonLoader                                  | Animacja ładowania jest płynna i poprawnie zastępuje treść podczas ładowania.           | E2E, Wizualny      | Średni    |

## 5. Środowisko Testowe

*   **Środowisko Lokalnego Developmentu:**
    *   Używane przez deweloperów do uruchamiania testów jednostkowych i integracyjnych podczas kodowania.
    *   Konfiguracja: Lokalna instancja aplikacji, zmienne środowiskowe z `dev` (mogą używać darmowych limitów Supabase/OpenRouter lub mocków).
*   **Środowisko Testowe/Stagingowe:**
    *   Dedykowane środowisko odzwierciedlające środowisko produkcyjne.
    *   Używane do testów E2E, testów regresji, testów API, testów eksploracyjnych przed wdrożeniem.
    *   Konfiguracja:
        *   Osobna instancja aplikacji wdrożona na platformie hostingowej (np. Vercel, Netlify, Cloudflare Pages).
        *   Osobny projekt Supabase z dedykowaną bazą danych (możliwość łatwego resetowania danych).
        *   Dedykowane klucze API dla OpenRouter (ewentualnie z niższymi limitami lub w trybie testowym, jeśli dostępny).
        *   Konfiguracja zmiennych środowiskowych dla środowiska testowego.
*   **Przeglądarki:**
    *   Google Chrome (najnowsza wersja)
    *   Mozilla Firefox (najnowsza wersja)
    *   Safari (najnowsza wersja) - jeśli dostępne zasoby
*   **Systemy Operacyjne:**
    *   Windows 10/11
    *   macOS (najnowsza wersja)

## 6. Narzędzia do Testowania

*   **Framework do testów jednostkowych i integracyjnych:** Vitest (szybki, kompatybilny z Vite/Astro)
*   **Biblioteka do testowania komponentów React:** React Testing Library (RTL)
*   **Framework do testów E2E:** Playwright (kompleksowe rozwiązanie, wsparcie dla wielu przeglądarek, testy API, testy wizualne)
*   **Mockowanie zależności (API, moduły):**
    *   `vi.mock` (wbudowane w Vitest)
    *   Mock Service Worker (MSW) - dla mockowania API na poziomie sieciowym (opcjonalnie, bardziej zaawansowane)
*   **Zarządzanie Błędami:** System śledzenia błędów (np. Jira, GitHub Issues, Trello)
*   **Repozytorium Kodu i CI/CD:** Git, GitHub/GitLab/Bitbucket (integracja testów z potokiem CI/CD)
*   **Baza danych:** Supabase (dedykowana instancja testowa)
*   **Testy API (manualne/eksploracyjne):** Postman, Insomnia
*   **Narzędzia Deweloperskie Przeglądarki:** Niezbędne do debugowania i inspekcji.

## 7. Harmonogram Testów

*   **Testy Jednostkowe i Integracyjne:** Prowadzone równolegle z rozwojem oprogramowania przez deweloperów. Powinny być częścią procesu code review i uruchamiane automatycznie w potoku CI przy każdym pushu/merge requeście.
*   **Testy API:** Rozwijane równolegle z implementacją endpointów. Uruchamiane w potoku CI.
*   **Testy E2E:** Rozwijane po ustabilizowaniu się głównych przepływów. Uruchamiane regularnie (np. co noc) na środowisku testowym oraz przed każdym wdrożeniem na produkcję.
*   **Testy Wizualne Regresji:** Uruchamiane przed wdrożeniem, po znaczących zmianach w UI. Aktualizacja baseline'ów po zaakceptowanych zmianach.
*   **Testy Eksploracyjne:** Przeprowadzane cyklicznie w trakcie sprintu/iteracji oraz intensywnie przed planowanym wdrożeniem.
*   **Testy Regresji:** Pełny zestaw krytycznych testów E2E i API uruchamiany przed każdym wdrożeniem produkcyjnym.
*   **Testy Akceptacyjne Użytkownika (UAT):** Przeprowadzane przez Product Ownera/interesariuszy na środowisku stagingowym przed finalną akceptacją wdrożenia (jeśli dotyczy).

## 8. Kryteria Akceptacji Testów

### 8.1 Kryteria Wejścia (Rozpoczęcia Testów)

*   Dostępna stabilna wersja aplikacji na środowisku testowym.
*   Ukończone i zintegrowane funkcjonalności przeznaczone do testowania.
*   Dostępna dokumentacja (wymagania, specyfikacje API - jeśli istnieją).
*   Przygotowane środowisko testowe i dane testowe.
*   Dostępne przypadki testowe (dla testów formalnych).

### 8.2 Kryteria Wyjścia (Zakończenia Testów / Zgody na Wdrożenie)

*   **Pokrycie Kodu:** Osiągnięcie ustalonego progu pokrycia kodu testami jednostkowymi i integracyjnymi (np. > 80% dla kluczowych modułów/serwisów).
*   **Wyniki Testów Automatycznych:** 100% przejścia krytycznych testów E2E i API.
*   **Status Błędów:**
    *   Brak otwartych błędów o priorytecie Krytycznym (Blocker) i Wysokim (Critical/Major).
    *   Wszystkie pozostałe błędy (Średni, Niski) przeanalizowane, udokumentowane i zaakceptowane do naprawy w przyszłych iteracjach lub świadomie zaakceptowane jako znane problemy.
*   **Ukończenie Testów:** Wykonanie zaplanowanych testów (zgodnie z zakresem i harmonogramem).
*   **Akceptacja:** Formalna akceptacja wyników testów przez Inżyniera QA i Product Ownera.

## 9. Role i Odpowiedzialności

*   **Deweloperzy:**
    *   Implementacja testów jednostkowych i integracyjnych dla swojego kodu.
    *   Naprawa błędów wykrytych podczas wszystkich faz testowania.
    *   Utrzymanie jakości kodu i pokrycia testami.
    *   Wsparcie Inżyniera QA w analizie błędów.
*   **Inżynier QA:**
    *   Stworzenie i utrzymanie Planu Testów.
    *   Projektowanie, implementacja i utrzymanie testów E2E, API, wizualnych.
    *   Wykonywanie testów manualnych i eksploracyjnych.
    *   Zarządzanie procesem zgłaszania i śledzenia błędów.
    *   Raportowanie statusu testów i jakości aplikacji.
    *   Konfiguracja i utrzymanie środowiska testowego (we współpracy z DevOps/developerami).
    *   Ocena zgodności z kryteriami akceptacji.
*   **Product Owner / Menedżer Projektu:**
    *   Definiowanie wymagań i kryteriów akceptacji.
    *   Priorytetyzacja funkcjonalności i błędów.
    *   Przeprowadzanie Testów Akceptacyjnych Użytkownika (UAT).
    *   Podejmowanie decyzji o wdrożeniu na podstawie wyników testów i oceny ryzyka.

## 10. Procedury Raportowania Błędów

*   **Narzędzie:** Dedykowany system śledzenia błędów (np. Jira, GitHub Issues).
*   **Proces Zgłaszania:** Każdy wykryty błąd powinien zostać niezwłocznie zgłoszony w systemie.
*   **Format Zgłoszenia Błędu:** Każde zgłoszenie powinno zawierać co najmniej:
    *   **Tytuł:** Krótki, zwięzły opis problemu.
    *   **Opis:** Szczegółowy opis błędu.
    *   **Kroki do Reprodukcji:** Numerowana lista kroków pozwalająca jednoznacznie odtworzyć błąd.
    *   **Wynik Oczekiwany:** Jak aplikacja powinna się zachować.
    *   **Wynik Rzeczywisty:** Jak aplikacja zachowała się w rzeczywistości.
    *   **Środowisko:** Wersja aplikacji, przeglądarka, system operacyjny, środowisko testowe (np. Staging, Local).
    *   **Priorytet/Waga (Severity):** Ocena wpływu błędu na działanie aplikacji (np. Krytyczny, Wysoki, Średni, Niski).
    *   **Załączniki:** Screenshoty, nagrania wideo, logi konsoli/sieciowe.
    *   **Przypisanie:** Osoba odpowiedzialna za analizę/naprawę (początkowo może być nieprzypisany lub przypisany do lidera zespołu).
*   **Cykl Życia Błędu:** Zgłoszony -> Analizowany -> Przypisany -> Naprawiany -> Gotowy do Testów -> Testowany (Retest) -> Zamknięty (jeśli naprawiony) / Ponownie Otwarty (jeśli nadal występuje).
*   **Komunikacja:** Regularne przeglądy zgłoszonych błędów (np. podczas spotkań zespołu) w celu priorytetyzacji i omówienia statusu.