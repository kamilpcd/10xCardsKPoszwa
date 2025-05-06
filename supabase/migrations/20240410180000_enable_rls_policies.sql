-- Migracja: Włączenie polityk bezpieczeństwa RLS
-- Opis: Włącza Row Level Security i definiuje polityki dostępu dla wszystkich tabel

-- Włączenie RLS dla wszystkich tabel
alter table flashcards enable row level security;
alter table generations enable row level security;
alter table generation_error_logs enable row level security;

-- Polityki RLS dla tabeli flashcards
create policy "Użytkownicy mogą widzieć tylko swoje fiszki"
    on flashcards for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Użytkownicy mogą tworzyć swoje fiszki"
    on flashcards for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Użytkownicy mogą aktualizować swoje fiszki"
    on flashcards for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Użytkownicy mogą usuwać swoje fiszki"
    on flashcards for delete
    to authenticated
    using (auth.uid() = user_id);

-- Polityki RLS dla tabeli generations
create policy "Użytkownicy mogą widzieć tylko swoje generacje"
    on generations for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Użytkownicy mogą tworzyć swoje generacje"
    on generations for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Użytkownicy mogą aktualizować swoje generacje"
    on generations for update
    to authenticated
    using (auth.uid() = user_id);

-- Polityki RLS dla tabeli generation_error_logs
create policy "Użytkownicy mogą widzieć tylko swoje logi błędów"
    on generation_error_logs for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Użytkownicy mogą tworzyć swoje logi błędów"
    on generation_error_logs for insert
    to authenticated
    with check (auth.uid() = user_id); 