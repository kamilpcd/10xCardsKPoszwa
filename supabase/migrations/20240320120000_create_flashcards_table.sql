-- Migracja: Utworzenie tabeli flashcards
-- Opis: Tworzy tabelę przechowującą fiszki użytkowników wraz z politykami bezpieczeństwa

-- Utworzenie tabeli
create table flashcards (
    id bigserial primary key,
    front varchar(200) not null,
    back varchar(500) not null,
    source varchar(20) not null check (source in ('ai-full', 'ai-edited', 'manual')),
    generation_id bigint,
    user_id uuid not null references auth.users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Indeksy
create index flashcards_user_id_idx on flashcards(user_id);
create index flashcards_generation_id_idx on flashcards(generation_id);

-- Trigger dla updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_flashcards_updated_at
    before update on flashcards
    for each row
    execute function update_updated_at_column();

-- Włączenie RLS
alter table flashcards enable row level security;

-- Polityki RLS
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