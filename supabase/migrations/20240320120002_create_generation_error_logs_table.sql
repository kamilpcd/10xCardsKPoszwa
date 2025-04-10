-- Migracja: Utworzenie tabeli generation_error_logs
-- Opis: Tworzy tabelę do logowania błędów podczas generowania fiszek przez AI

-- Utworzenie tabeli
create table generation_error_logs (
    id bigserial primary key,
    user_id uuid not null references auth.users(id),
    model varchar(255) not null,
    source_text_hash varchar not null,
    source_text_length integer not null,
    error_code varchar(100) not null,
    error_message text not null,
    created_at timestamptz not null default now()
);

-- Indeksy
create index generation_error_logs_user_id_idx on generation_error_logs(user_id);

-- Włączenie RLS
alter table generation_error_logs enable row level security;

-- Polityki RLS
create policy "Użytkownicy mogą widzieć tylko swoje logi błędów"
    on generation_error_logs for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Użytkownicy mogą tworzyć swoje logi błędów"
    on generation_error_logs for insert
    to authenticated
    with check (auth.uid() = user_id); 