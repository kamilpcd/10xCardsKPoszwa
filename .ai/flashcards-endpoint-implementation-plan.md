# API Endpoint Implementation Plan: POST /api/flashcards

## 1. Przegląd punktu końcowego

Endpoint służy do tworzenia flashcards. Umożliwia dodanie jednej lub wielu fiszek jednocześnie. Obsługuje zarówno ręcznie tworzone fiszki (source: manual) jak i te generowane przez AI (source: ai-full lub ai-edited), zapewniając przy tym ścisłą walidację danych wejściowych oraz odpowiednie powiązanie z rekorden generacji (jeśli dotyczy). Endpoint jest zabezpieczony i dostępny wyłącznie dla uwierzytelnionych użytkowników.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Ścieżka URL:** /api/flashcards
- **Parametry / Request Body:**
  - Request Body (JSON),
  - Klucz: `flashcards` – tablica obiektów, gdzie każdy obiekt definiuje jedną fiszkę

  **Dla każdego obiektu fiszki wymagane pola:**

  - `front`: string (maksymalnie 200 znaków)
  - `back`: string (maksymalnie 500 znaków)
  - `source`: musi być jedną z wartości: `manual`, `ai-full`, `ai-edited`
  - `generation_id`:
    - dla `manual` musi być `null`
    - dla `ai-full` i `ai-edited` – wartość typu number (ID generacji)

## 3. Wykorzystywane typy

- **CreateFlashcardManualDTO:** dla fiszek tworzonych ręcznie.
- **CreateFlashcardAIDTO:** dla fiszek generowanych przez AI.
- **CreateFlashcardsDTO:** wrapper zawierający tablicę obiektów fiszek.
- **FlashcardDTO:** typ reprezentujący fiszkę w odpowiedzi (bez pola `user_id`).

## 4. Szczegóły odpowiedzi

- **Kod sukcesu:** 201 Created
- **Struktura odpowiedzi:**
  ```json
  {
    "flashcards": [
      { "id": 1, "front": "Question 1", "back": "Answer 1", "source": "manual", "generation_id": null },
      { "id": 2, "front": "Question 2", "back": "Answer 2", "source": "ai-full", "generation_id": 123 }
    ]
  }
  ```
- **Możliwe kody błędów:**
  - 400 Bad Request – błędy walidacji danych wejściowych (np. przekroczenie dozwolonej długości pól, niepoprawna wartość source, błędne generation_id)
  - 401 Unauthorized – brak autoryzacji
  - 500 Internal Server Error – błąd serwera lub operacji na bazie danych

## 5. Przepływ danych

1. Klient wysyła żądanie POST /api/flashcards z ciałem zawierającym tablicę obiektów flashcards.
2. Warstwa API (np. w `src/pages/api/flashcards.ts`) odbiera żądanie i weryfikuje autoryzację użytkownika.
3. Następuje walidacja danych pod kątem:
  - Długości pól `front` oraz `back`,
  - Poprawności wartości pola source,
  - Sprawdzania zgodności `generation_id` z wartością `source`
4. Po pomyślnej walidacji wywoływany jest serwis (`src/lib/flashcard.service.ts`), który implementuje logikę biznesową:
  - Obsługa tworzenia flashcards,
  - Powiązanie flashcards z użytkownikiem (`user_id`)
5. Flashcards zapisywane są do bazy danych przy użyciu operacji batch insert.
6. Trigger w bazie automatycznie ustawia pola `created_at` i `updated_at`
7. W przypadku błędów zapisu następuje rollback operacji, a klient otrzymuje odpowiedni błąd.
8. Wynik operacji (utworzone fiszki) jest zwracany w odpowiedzi.

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie i autoryzacja:** Endpoint dostępny tylko dla zalogowanych użytkowników. Używana jest autoryzacja z Supabase Auth, sprawdzanie, czy użytkownik ma prawo tworzyć flashcards oraz powiązać je z generacją.
- **Walidacja danych:** Dane wejściowe są walidowane przy użyciu Zod, aby zapobiec wstrzyknięciom oraz przekroczeniom limitów znaków. Sanityzujemy dane wejściowe dla zapobiegania atakom (np. SQL injection).

## 7. Obsługa błędów

- **400 Invalid Input:** Jeśli dane wejściowe nie spełniają wymagań (np. zły format, przekroczona ilość znaków, niewłaściwa wartość source, błędne generation_id), zwracany jest odpowiedni komunikat błędu.
- **401 Unauthorized:** Jeśli użytkownik nie jest uwierzytelniony lub nie ma nadanych odpowiednich uprawnień zwracany jest ten kod błędu.
- **500 Internal Server Error:** W przypadku nieprzewidzianych błędów (np. problem z bazą danych) serwer zwraca błąd 500. Dodatkowo, błędy mogą być logowane, a w specyficznych sytuacjach (np. problemy z generacją AI) rejestrowane w tabeli `generation_error_logs`.

## 8. Rozważania dotyczące wydajności

- **Batch Processing:** Efektywne przetwarzanie wielu flashcards w jednym żądaniu poprzez operację batch insert.

## 9. Kroki implementacji

1. Utworzenie nowego endpointa `/api/flashcards` w folderze `src/pages/api/flashcards.ts`.
2. Implementacja walidacji danych wejściowych przy użyciu biblioteki takiej jak Zod, zgodnie z regułami walidacji:
  - Maksymalna długość front (200 znaków) i back (500 znaków).
  - Weryfikacja poprawności wartości source i odpowiadającego generation_id.
3. Utworzenie lub modyfikacja serwisu biznesowego (FlashcardService, `src/lib/flashcard.service.ts`) odpowiedzialnego za tworzenie flashcards, który będzie zarządzał operacjami na bazie danych.
4. Integracja z bazą danych: Implementacja operacji batch insert dla tabeli flashcards oraz zapewnienie powiązania flashcards z user_id i, jeśli dotyczy, z generation_id.
5. Dodanie mechanizmu obsługi błędów wraz z odpowiednim logowaniem oraz implementacją rollback w przypadku nieudanej operacji.
