-- Migracja: Utworzenie tabeli generations
-- Opis: Tworzy tabelę przechowującą informacje o generowaniach fiszek przez AI

-- Utworzenie tabeli
create table generations (
    id bigserial primary key,
    user_id uuid not null references auth.users(id),
    model varchar(255) not null,
    generated_count integer not null,
    accepted_unedited_count integer,
    accepted_edited_count integer,
    source_text_hash varchar not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    generation_duration integer,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Indeksy
create index generations_user_id_idx on generations(user_id);

-- Trigger dla updated_at
create trigger update_generations_updated_at
    before update on generations
    for each row
    execute function update_updated_at_column();

-- Klucz obcy w tabeli flashcards
alter table flashcards
add constraint flashcards_generation_id_fkey
foreign key (generation_id)
references generations(id)
on delete set null;

-- Włączenie RLS
alter table generations enable row level security;

-- Polityki RLS
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