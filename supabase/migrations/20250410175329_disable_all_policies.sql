-- Migracja: Wyłączenie wszystkich polityk bezpieczeństwa
-- Opis: Wyłącza wszystkie wcześniej zdefiniowane polityki RLS dla tabel flashcards, generations i generation_error_logs

-- Wyłączenie polityk dla tabeli flashcards
drop policy if exists "Użytkownicy mogą widzieć tylko swoje fiszki" on flashcards;
drop policy if exists "Użytkownicy mogą tworzyć swoje fiszki" on flashcards;
drop policy if exists "Użytkownicy mogą aktualizować swoje fiszki" on flashcards;
drop policy if exists "Użytkownicy mogą usuwać swoje fiszki" on flashcards;

-- Wyłączenie polityk dla tabeli generations
drop policy if exists "Użytkownicy mogą widzieć tylko swoje generacje" on generations;
drop policy if exists "Użytkownicy mogą tworzyć swoje generacje" on generations;
drop policy if exists "Użytkownicy mogą aktualizować swoje generacje" on generations;

-- Wyłączenie polityk dla tabeli generation_error_logs
drop policy if exists "Użytkownicy mogą widzieć tylko swoje logi błędów" on generation_error_logs;
drop policy if exists "Użytkownicy mogą tworzyć swoje logi błędów" on generation_error_logs;

-- Wyłączenie RLS dla wszystkich tabel
alter table flashcards disable row level security;
alter table generations disable row level security;
alter table generation_error_logs disable row level security; 