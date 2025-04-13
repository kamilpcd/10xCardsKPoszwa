# Architektura UI dla FiszkiAIkp

## 1. Przegląd struktury UI

W tej strukturze interfejsu użytkownika zaprojektowano modułowy system oparty na React, Shadcn/ui oraz Tailwind. System jest responsywny, dostosowany do urządzeń mobilnych oraz spełnia wymagania dotyczące dostępności (WCAG AA). Główne widoki obejmują: ekran uwierzytelniania, dashboard, widok generowania fiszek, widok listy fiszek z modalem edycji/usuwania, panel użytkownika oraz ekran sesji powtórkowych.

## 2. Lista widoków

- **Ekran uwierzytelniania**

  - Ścieżka: `/login` i `/register`
  - Główny cel: Umożliwić użytkownikom logowanie i rejestrację.
  - Kluczowe informacje: Formularz logowania/rejestracji z polami e-mail oraz hasło, komunikaty o błędach.
  - Kluczowe komponenty: Formularz logowania/rejestracji, pola input, przyciski, komponent walidacji.
  - UX / dostępność: Prosty formularz, czytelne komunikaty błędów, obsługa klawiatury, zabezpiecznia JWT
  - Bezpieczeństwo: Weryfikacja danych wejściowych, szyfrowanie haseł, ochrona przed atakami typu brute force.

- **Widok generowania fiszek**

  - Ścieżka: `/generate`
  - Główny cel: Umożliwić użytkownikowi wprowadzenie tekstu i wygenerowanie propozycji fiszek przez AI oraz ich rewizję przez użytkownika (zaakceptuj, edytuj lub odrzuć).
  - Kluczowe informacje: Pole do wprowadzenia długiego tekstu (1000-10000 znaków), licznik znaków, lista propozycji fiszek wygenerowanych przez AI, przyciski akceptacji, edycji lub odrzucenia.
  - Kluczowe komponenty: Komponent wejścia tekstowego, przycisk "Generuj", sekcja wyników (lista propozycji fiszek), przyciski akcji (Zapisz wszystkie, zapisz zaakceptowane), wskaźnik ładowania (skeleton), informacje o błędach.
  - UX / dostępność: Intuicyjny formularz, walidacja długości tekstu (1000-10000 znaków), repsonsywność, czytelne komunikaty i inline komunikaty o błędach.
  - Bezpieczeństwo: Weryfikacja danych wejściowych, ograniczenia na długość tekstu, zabezpieczenie przed wielokrotnym uruchomieniem operacji.

- **Widok listy fiszek (Moje fiszki)**

  - Ścieżka: `/flashcards`
  - Główny cel: Prezentacja zapisanych fiszek użytkownika oraz umożliwienie ich edycji i usunięcia.
  - Kluczowe informacje: Lista fiszek z informacjami o pytaniu oraz odpowiedzi.
  - Kluczowe komponenty: Lista elementów, komponent modalu edycji, formularz z walidacją, przyciski akcji (usuwanie, potwierdzenie operacji).
  - UX / dostępność: Intuicyjne rozmieszczenie elementów, dostępność klawiaturowa modyfikacji.
  - Bezpieczeństwo: Potwierdzenie przed usunięciem, walidacja aktualizacji.

- **Modal edycji fiszek**

  - Ścieżka: Wyświetlanie nad widokiem listy fiszek.
  - Główny cel: Umoliwienie edycji fiszek z walidacją danych bez zapisu w czasie rzeczywistym.
  - Kluczowe informacje: Formularz do edycji fiszki, pola: "Przód", "Tył" oraz komunikaty walidacyjne.
  - Kluczowe komponenty: Modal z formularze, przyciski: "Zapisz", "Anuluj".
  - UX / dostępność: Intuicyjny modal, dostępność dla czytników ekranu.
  - Bezpieczeństwo: Walidacja danych po stronie klienta przed wysłaniem zmian.    

- **Panel użytkownika**

  - Ścieżka: `/profile`
  - Główny cel: Wyświetlenie danych konta użytkownika oraz umożliwienie zarządzania ustawieniami.
  - Kluczowe informacje: Dane profilu, opcje edycji profilu, przycisk do wylogowania.
  - Kluczowe komponenty: Formularz do edycji profilu, przyciski akcji.
  - UX / dostępność: Łatwy dostęp do ustawień użytkownika, prosty oraz czytelny interfejs.
  - Bezpieczeństwo: Bezpieczne wylogowanie.

- **Ekran sesji powtórkowych**
  - Ścieżka: `/session`
  - Główny cel: Umożliwić przeprowadzenie sesji nauki z wykorzystaniem algorytmu powtórek.
  - Kluczowe informacje: Wyświetlana fiszka (przód), opcja wyświetlenia odpowiedzi (tył), przyciski oceny stopnia przyswojenia.
  - Kluczowe komponenty: Komponent wyświetlenia fiszki, przyciski akcji (np. "Ocena", "Pokaż odpowiedź"), system oceny, pasek postępu, licznik sesji.
  - UX / dostępność: Minimalistyczny interfejs skupiający uwagę na treści, duże przyciski, intuicyjna nawigacja między fiszkami.
  - Bezpieczeństwo: Ochrona danych sesji, walidacja interakcji, odpowiednia logika przejścia do kolejnych fiszek.

## 3. Mapa podróży użytkownika

1. Użytkownik wchodzi na stronę logowania lub rejestracji (`/login` lub `/register`).
2. Po autoryzacji następuje przekierowanie do widoku generowania fiszek.
3. Użytkownik wprowadza tekst do generowania fiszek i inicjuje proces generacji.
4. API zwraca propozycje fiszek, które są prezentowane na widoku generowania.
4. Użytkownik recenzuje propozycje fiszek:
   - Akceptuje, edytuje lub odrzuca poszczególne fiszki (opcjonalnie otwarcie modala edycji).
   - Zmiany są zbiorczo zatwierdzane i przesyłane do API.
5. Po zapisaniu fiszek, użytkownik przechodzi do widoku listy fiszek (`/flashcards`):
   - Przegląda zapisane fiszki, korzysta z modalu edycji dla wprowadzenia zmian lub usuwa fiszki.
6. Użytkownik może przejść do panelu użytkownika (`/profile`) w celu zarządzania kontem i ustawieniami oraz opcjonalnie rozpocząć sesję powtórek.
7. Użytkownik rozpoczyna sesję powtórek (`/session`):
   - System prezentuje fiszki, użytkownik wyświetla odpowiedzi i ocenia poziom przyswojenia.
8. Użytkownik może wrócić do dashboardu lub wylogować się.
9. W przypadku błędów (np. walidacji, problemów z API) użytkownik otrzymuje komunikaty inline.

## 4. Układ i struktura nawigacji

- **Główna nawigacja**: Dostępna jako górne menu w layoucie strony po zalogowaniu.
- **Elementy nawigacyjne**: Linki do widoków: "Generowanie fiszek", "Moje fiszki", "Sesja nauki", "Profil" oraz przycisk wylogowania.
- **Responsywność**: W widoku mobilnym nawigacja przekształca się w menu hamburger, umożliwiając łatwy dostęp do pozostałych widoków.
- **Przepływ**: Nawigacja umożliwia bezproblemowe przechodzenie między widokami, zachowując kontekst użytkownika i jego dane sesyjne.

## 5. Kluczowe komponenty

- **Formularz uwierzytelniania**: Komponenty logowania i rejestracji z obsługą walidacji.
- **Komponent generowania fiszek:** Z polem tekstowym i przyciskiem uruchamiającym proces generacji, z wskaźnikiem ładowania.
- **Lista fiszek:** Interaktywny komponent wyświetlający listę fiszek z opcjami edycji i usuwania.
- **Modal edycji:** Komponent umożliwiający edycję fiszek z walidacją danych przed zatwierdzeniem.
- **Toast notifications:** Komponent do wyświetlania komunikatów o sukcesach oraz błędach.
- **Menu Nawigacji:** Elementy nawigacyjne ułatwiające przemieszczanie się między widokami.
- **Komponent sesji powtórek:** Interaktywny układ wyświetlania fiszek podczas sesji nauki z mechanizmem oceny.

