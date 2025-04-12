# API Endpoint Implementation Plan: POST /api/generations

## 1. Przegląd punktu końcowego

Endpoint POST /api/generations umożliwia wysłanie długiego tekstu (1000-10000 znaków) w celu wygenerowania propozycji fiszek przez AI. Po walidacji tekstu wywoływana jest zewnętrzna usługa AI (Openrouter.ai) do generowania fiszek, a wyniki wraz z metadanymi zapisywane są w bazie danych. W odpowiedzi użytkownik otrzymuje identyfikator generacji, propozycje fiszek oraz liczbę wygenerowanych fiszek.

## 2. Szczegóły żądania

- **Metoda HTTP**: POST
- **Struktura URL**: /api/generations
- **Parametry**:
  - **Wymagane**:
    - `source_text` (string) – długi tekst wejściowy zawierający od 1000 do 10000 znaków
  - **Opcjonalne**: brak
- **Request Body** (przykład):
  ```json
  {
    "source_text": "Długi tekst wejściowy dla generowania fiszek..."
  }
  ```
- **Walidacja**: Sprawdzenie, czy długość `source_text` mieści się w przedziale 1000-10000 znaków.

## 3. Wykorzystywane typy

- DTO/Command Modele:
  - `CreateGenerationCommandDTO` – model do inicjacji generacji, zawierający pole `source_text`.
  - `GenerationResponseDTO` – model odpowiedzi, zawierający:
    - `generation_id` (number)
    - `flashcards_proposals` (lista obiektów typu `FlashcardProposalDTO`)
    - `generated_count` (number)
  - `FlashcardProposalDTO`: Pojedyncza propozycja fiszki z polami:
    -  `front` (string)
    - `back` (string)
    - `source` - wartość stała: "ai-full"

## 4. Szczegóły odpowiedzi

- **Kod sukcesu**: 201 Created
- **Struktura odpowiedzi** (przykład):
  ```json
  {
    "generation_id": 123,
    "flashcards_proposals": [
      { "front": "Generated Question", "back": "Generated Answer", "source": "ai-full" }
      // ... inne propozycje
    ],
    "generated_count": 5
  }
  ```
- **Błędy**:
  - 400 Bad Request – gdy dane wejściowe są nieprawidłowe (np. zła długość `source_text`)
  - 401 Unauthorized – gdy użytkownik nie jest zalogowany lub nie ma dostępu
  - 500 Internal Server Error – w przypadku błędów usługi AI lub innych błędów serwerowych (błędy zapisywane w tabeli `generation_error_logs`)

## 5. Przepływ danych

1. Użytkownik wysyła żądanie POST /api/generations z `source_text`.
2. Warstwa walidacji sprawdza, czy `source_text` spełnia wymogi długościowe (za pomocą biblioteki `zod`).
3. W przypadku pozytywnej walidacji, kontroler przekazuje dane do warstwy serwisowej (`generation.service`).
4. Warstwa serwisowa:
   - Wywołuje zewnętrzną usługę AI (Openrouter.ai) w celu wygenerowania propozycji fiszek.
   - Oblicza i zapisuje metadane generacji w tabeli `generations` (m.in. `model`, `generated_count`, `source_text_hash`, `source_text_length`, `generation_duration`)
5. W przypadku błędu w usłudze AI, błąd jest rejestrowany w tabeli `generation_error_logs` z opowiednimi danymi (`error_code`, `error_message`, `model`).
6. Ostatecznie, kontroler zwraca odpowiedź z danymi generacji zgodnie z modelem `GenerationResponseDTO`

## 6. Względy bezpieczeństwa

- Uwierzytelnianie i autoryzacja:
  - Endpoint wymaga autoryzacji przy pomocy mechanizmu Supabase Auth.
  - Upewnić się, że każdy request posiada poprawne dane uwierzytelniające.
- Walidacja danych wejściowych:
  - Sprawdzenie długości `source_text` aby zapobiec przetwarzaniu zbyt krótkich lub zbyt długich tekstów przy pomocy `zod`
- Obsługa danych:
  - Sanitizacja wejścia, aby zapobiec potencjalnym atakom typu injection.
- Ograniczenie ekspozycji błędów:
  - Szczegóły błędów nie powinny być zwracane użytkownikowi. Niepełne informacje o błędach powinny być logowane wewnętrznie.

## 7. Obsługa błędów

- **400 Bad Request**: Błąd walidacji (np. `source_text` nie spełnia wymogów długości).
- **401 Unauthorized**: Brak autoryzacji lub nieważny token.
- **500 Internal Server Error**: Błąd wewnętrzny serwera, w tym błędy generowane przez usługę AI. Błędy są logowane w tabeli `generation_error_logs` z informacjami o modelu, kodzie błędu, komunikacie i czasie wystąpienia.

## 8. Rozważania dotyczące wydajności
- Timeout dla wywołania AI: 60 sekund na czas oczekiwania, inaczej błąd timeout
- Zapewnienie, że żądanie walidacji odbywa się szybką i asynchronicznie przed przetwarzaniem ciężkiej operacji generowania.
- Implementuj mechanizmy monitorowania wydajności endpointu i serwisu AI.

## 9. Etapy wdrożenia


1. Implementacja endpointu POST /api/generations zgodnie z zasadami Astro i backend.mdc:
   - Utworzenie pliku API w katalogu `src/pages/api`, np. `generations.ts`
   - Dodanie middleware do obsługi autoryzacji (przy użyciu Supabase Auth).
2. Implementacja walidacji wejścia:
   - Sprawdzenie długości `source_text` (1000-10000 znaków) za pomocą biblioteki `zod`.
3. Implementacja warstwy serwisowej:
   - Wyodrębnienie logiki do osobnego serwisu ( `generation.service` w `src/lib/services`).
   - Integracja z usługą Openrouter.ai do generowania fiszek. Na etapie developmentu skorzystamy z mocków zamiast wywoływania serwisu AI.
   - Zapisywanie metadanych generacji w tabeli `generations`.
4. Implementacja mechanizmu logowania błędów:
   - W przypadku błędów w usłudze AI, rejestracja błędu w tabeli `generation_error_logs` z odpowiednimi informacjami.
5. Dodanie mechanizmu uwierzytelniania poprzez Supabase Auth.
6. Implementacja logiki endpointu, wykorzystującej utworzony serwis.
7. Dodanie szczegółowego logowania akcji i błędów.