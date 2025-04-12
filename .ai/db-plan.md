# Schemat bazy danych PostgreSQL

## Tabele

### 1. Tabela `users`

THIS TABLE IS MANAGED BY SUPABASE AUTH

- `id` UUID PRIMARY KEY
- `email` VARCHAR(255) NOT NULL UNIQUE
- `encrypted_password` VARCHAR NOT NULL
- `encrypted_password` VARCHAR NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `confirmed_at` TIMESTAMPTZ

### 2. Tabela `flashcards`

- `id` BIGSERIAL PRIMARY KEY
- `front` VARCHAR(200) NOT NULL
- `back` VARCHAR(500) NOT NULL
- `source` VARCHAR(20) NOT NULL
  - CHECK constraint: wartość musi być jedną z 'ai-full', 'ai-edited', 'manual'
- `generation_id` BIGINT ON DELETE SET NULL
  - Klucz obcy odnoszący się do `generations(id)`
- `user_id` UUID NOT NULL
  - Klucz obcy odnoszący się do `users(id)`
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  - Automatyczne uzupełnianie przez trigger
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  - Automatyczne uzupełnianie przez trigger

### 3. Tabela `generations`

- `id` BIGSERIAL PRIMARY KEY
- `user_id` UUID NOT NULL
  - Klucz obcy odnoszący się do `users(id)`
- `model` VARCHAR(255) NOT NULL
- `generated_count` INTEGER NOT NULL
- `accepted_unedited_count` INTEGER NULLABLE
- `accepted_edited_count` INTEGER NULLABLE
- `source_text_hash` VARCHAR NOT NULL
- `source_text_length` INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)
- `generation_duration` INTEGER -- Czas trwania operacji generowania(ms)
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

### 3. Tabela `generation_error_logs`

- `model` VARCHAR(255) NOT NULL
- `source_text_hash` VARCHAR NOT NULL
- `source_text_length` INTEGER NOT NULL
- `error_code` VARCHAR(100) NOT NULL
- `error_message` TEXT NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

## Relacje między tabelami

Jeden użytkownik (users) ma wiele fiszek (flashcards).
- Jeden użytkownik (users) ma wiele rekordów w tabeli generations.
- Jeden użytkownik (users) ma wiele rekordów w tabeli generation_error_logs.
- Każda fiszka (flashcards) może opcjonalnie odnosić się do jednej generatio (generations) poprzez generation_id

## Indeksy

- Tabela `flashcards`:
  - Indeks na kolumnie `user_id` dla optymalizacji zapytań związanych z użytkownikami.
  - Indeks na kolumnie `generation_id` w celu przyspieszenia wyszukiwania id generowania.
- Tabela `generations`:
  - Indeks na kolumnie `user_id` dla optymalizacji zapytań związanych z użytkownikami.
- Tabela `generations_error_logs`:
  - Indeks na kolumnie `user_id` dla optymalizacji zapytań związanych z użytkownikami.
- Pozostałe indeksy są domyślnie tworzone na podstawie kluczy głównych i obcych.

## Zasady i mechanizmy

- Automatyczne uzupełnianie pól `created_at` oraz `updated_at` realizowane przez odpowiednie triggery w bazie danych.
- Walidacja długości pól `front` (do 200 znaków) i `back` (do 500 znaków) odbywa się głównie na warstwie front-endowej, przy czym typy danych są dobrane zgodnie z wymaganiami.
- Polityki bezpieczeństwa są zarządzane wyłącznie przez Supabase Auth, wykorzystując `user_id` do kontroli dostępu.

## Dodatkowe uwagi

- Tabela `users` jest zarządzana przez Supabase Auth i nie jest definiowana w tym schemacie.
- Schemat jest zgodny z zasadami normalizacji (3NF) i zapewnia integralność danych poprzez odpowiednie ograniczenia, klucze i indeksy.
- CHECK constraint w tabeli `flashcards` gwarantuje, że pole `source` przyjmuje tylko dozwolone wartości: 'ai-full', 'ai-edited', 'manual'.
