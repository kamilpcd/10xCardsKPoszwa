# Plan implementacji widoku Generowania fiszek

## 1. Przegląd

Widok generowania fiszek umożliwia użytkownikowi wprowadzenie długiego tekstu (1000-10000 znaków) w celu wygenerowania propozycji fiszek przez AI. Użytkownik otrzymuje listę wygenerowanych propozycji, które może zaakceptować, edytować lub odrzucić, a także zapisać wybrane propozycje fiszek do bazy danych. Widok posiada walidację długości tekstu, licznik znaków oraz mechanizmy zarządzania stanem ładowania i obsługi błędów.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką: `/generate`.

## 3. Struktura komponentów

- **FlashcardGenerateView** - główny kontener widoku: zawiera logikę i strukturę strony.
  - **TextInput** - komponent do wprowadzania długiego tekstu wejściowego.
  - **CharacterCounter** - wyświetla aktualną liczbę znaków.
  - **GenerateButton** - przycisk inicjujący generację fiszek.
  - **SkeletonLoader** - komponent: wskaźnik ładowania (skeleton) podczas oczekiwania na odpowiedź API.
  - **FlashcardProposalsList** - sekcja wyświetlająca listę propozycji fiszek otrzymanych z API.
    - **FlashcardProposalItem** - pojedynczy element listy zawierający propozycję fiszki.
  - **BulkSaveButton** - przycisk do zapisu wszystkich fiszek lub tylko zaakceptowanych.
  - **ErrorNotification** - komponent do wyświetlania komunikatów o błędach.

## 4. Szczegóły komponentów

### FlashcardGenerateView

- **Opis:** Główny widok, integrujący wszystkie komponenty, które są niezbędne do generowania oraz przeglądania fiszek.
- **Elementy:** Formularz zawierający TextInput, CharacterCounter, GenerateButton, FlashcardProposalsList, SkeletonLoader oraz ErrorNotification.
- **Obsługiwane interakcje:**
  - Zmiana wartości w polu tekstowym,
  - Zmiana liczby znaków w CharacterCounter,
  - Kliknięcie przycisku do generowania,
  - Interakcje z kartami fiszek obejmujące: zatwierdzanie, edycję, odrzucenie,
  - Kliknięcie przycisku zapisu.
- **Walidacja:** Sprawdzenie, czy tekst ma od 1000 do 10000 znaków.
- **Typy:** Użycie DTO: `CreateGenerationCommandDTO` oraz `GenerationResponseDTO`.
- **Propsy:** Może otrzymywać ewentualne funkcje callback dla potwierdzenia zapisu lub przekierowania po zapisaniu.

### TextInput

- **Opis:** Komponent textarea do wprowadzania długiego tekstu wejściowego przez użytkownika.
- **Elementy:** <textarea>, placeholder, etykieta.
- **Obsługiwane zdarzenia:** onChange (aktualizacja tekstu i licznika znaków)
- **Walidacja:** Minimalna długość 1000 znaków, maksymalna 10000 znaków (na bieżąco).
- **Typy:** Lokalny string state, typ `CreateGenerationCommandDTO` przy wysyłce do API.
- **Propsy:** value, onChange, placeholder.

### CharacterCounter

- **Opis:** Komponent wyświetlający liczbę wprowadzonych znaków.
- **Elementy:** Prosty element <span> lub <div>.
- **Obsługiwane zdarzenia:** Aktualizacja na podstawie wartości z TextInput.
- **Typy:** number (liczba znaków).
- **Propsy:** count.

### GenerateButton

- **Opis:** Przycisk inicjujący proces generowania fiszek.
- **Elementy:** <button> z etykietą "Generuj fiszki".
- **Obsługiwane zdarzenia:** onClick wywołujący funkcję wysyłającą żądanie do API.
- **Walidacja:** Przycisk aktywny tylko, gdy tekst spełnia wymagania długości.
- **Typy:** Funckja callback na click.
- **Propsy:** disabled, onClick (zależne od stanu walidacji i ładowania).

### SkeletonLoader

- **Opis:** Komponent do wizualizacji ładowania, wyświetlany podczas oczekiwania na odpowiedź z API.
- **Elementy:** Szablon UI (skeleton) imitujący strukturę kart, które będą wyświetlone.
- **Obsługiwane zdarzenia:** Brak – stan wyłącznie wizualny.
- **Typy:** Brak (Stateless).
- **Propsy:** Możliwe przyjmowanie opcjonalnie parametrów stylizacyjnych.

### FlashcardProposalsList

- **Opis:** Komponent wyświetlający listę wygenerowanych propozycji fiszek otrzymanych z API.
- **Elementy:** Lista elementów (np. ul/li lub komponenty grid), każdy reprezentowany przez `FlashcardProposalItem`.
- **Obsługiwane zdarzenia:** Przekazywanie zdarzeń do poszczególnych kart (akceptacja, edycja, odrzucenie).
- **Walidacja:** Brak - dane przychodzące z API są już poddane walidacji.
- **Typy:** Tablica obiektów typu `FlashcardProposalViewModel`.
- **Propsy:** flashcards (lista propozycji), onAccept, onEdit, onReject.

### FlashcardProposalItem

- **Opis:** Pojedyncza karta reprezentująca jedną propozycję fiszki.
- **Elementy:** Wyświetlanie pól "przód" (max 200 znaków) i "tył" (max 500 znaków) oraz przyciski akcji "Zatwierdź", "Edytuj", "Odrzuć".
- **Obsługiwane zdarzenia:** onClick dla każdego przycisku, który modyfikuje stan danej fiszki (np. oznaczenie jako zaakceptowane, otwarcie trybu edycji, usunięcie z listy).
- **Walidacja:** W przypadku gdy edycja jest aktywna, wprowadzane dane muszą spełniać warunki - front (do 200 znaków), back (do 500 znaków).
- **Typy:** Rozszerzony typ `FlashcardProposalViewModel`, lokalny model stanu, np. z flagą accepted/edited.
- **Propsy:** flashcard (dane propozycji fiszki), onAccept, onEdit, onReject.

### ErrorNotification

- **Opis:** Komponent do wyświetlania komunikatów błędów (np. błędy API lub walidacji formularza).
- **Elementy:** <div> z komunikatem błędu, ikona błędu.
- **Obsługiwane zdarzenia:** Brak - komponent informacyjny.
- **Walidacja:** Przekazany komunikat nie powinien być pusty.
- **Typy:** string (komunikat błędu).
- **Propsy:** message, ewentualnie typ błędu.

### BulkSaveButton

- **Opis:** Komponent zawierający przyciski umożliwiający zbiorczy zapis wszystkich wygenerowanych fiszek lub tylko tych, które zostały zaakceptowane. Umożliwia wysłanie danych do backendu w jednym żądaniu.
- **Elementy:** Dwa przyciski: "Zapisz wszystkie", "Zapisz zaakceptowane".
- **Obsługiwane zdarzenia:** onClick dla każdego przycisku, który wywołuje odpowiednią funkcję wysyłającą żądanie do API.
- **Walidacja:** Aktywowany jedynie gdy istnieją fiszki do zapisu; dane fiszek muszą spełniać walidację: front (do 200 znaków), back (do 500 znaków).
- **Typy:** Wykorzystuje typy zdefiniowane w `types.ts`, w tym interfejs `CreateFlashcardsDTO` (bazujący na typie `CreateFlashcardsDTO` który jest union type `CreateFlashcardManualDTO` | `CreateFlashcardAIDTO`)
- **Propsy:** onSaveAll, onSaveAccepted, disabled.

## 5. Typy

- **CreateGenerationCommandDTO:** {source_text: string} - wysyłany do endpointu `/api/generations`.

- **GenerationResponseDTO:** { generation_id: number,flashcards_proposals: FlashcardProposalDTO[], generated_count: number } - struktura odpowiedzi z API

- **FlashcardProposalDTO:** { front: string, back: string, source: "ai-full" } - pojedyncza propozycja fiszki.

- **FlashcardProposalDTO:** { front: string, back: string, source: "ai-full" | "ai-edited", accepted: boolean, edited: boolean } – rozszerzony model reprezentujący stan propozycji fiszki, umożliwiający dynamiczne ustawienie pola source podczas wysyłania danych do endpointu `/flashcards`.

- **CreateFlashcardsDTO:** { flashcards: CreateFlashcardDTO[], generation_id: number } - obiekt wysyłany do endpointu `api/flashcards` zawierający tablicę fiszek do zapisu oraz generation_id. 
CreateFlashcardDTO[] jest to union type CreateFlashcardManualDTO | CreateFlashcardAIDTO. 

## 6. Zarządzanie stanem

Stan widoku zarządzany za pomocą hooków React (useState, useEffect). Kluczowe stany:

- Wartość pola tekstowego (textValue).
- Stan ładowania (isLoading) dla wywołania API.
- Stan błędów (errorMessage) dla komuniaktów o błędach.
- Lista propozycji fiszek (flashcards), wraz z ich lokalnymi flagami (np. accepted, edited).
- Opcjonalny stan dla trybu edycji fiszki. Koniecznie wydzielić logikę API do customowego hooka (np. useGenerateFlashcards) do obsługi logiki API.

## 7. Integracja API

- **Endpointy:**
  - POST `/api/generations` do wysłania tekstu i otrzymania propozycji fiszek. Payload: CreateGenerationCommandDTO { source_text: string }, otrzymujemy odpowiedź zawierającą:
     - generation_id,
     - flashcards_proposals,
     - generated_count.
  - POST `/api/flashcards` Po zaznaczeniu fiszek do zapisu poprzez BulkSaveButton, wysyłane jest żądanie POST `/api/flashcards`. Payload musi być zgodny z typem `CreateFlashcardDTO` (union typu `CreateFlashcardManualDTO` oraz `CreateFlashcardAIDTO` z pliku `src/types.ts`) - każda fiszka musi mieć front ≤ 200 znaków, back ≤ 500 znaków, odpowiedni source oraz generation_id. Umożliwia to zapisanie danych do bazy.
  - Walidacja odpowiedzi: sprawdzenie statusu HTTP, obsługa błędów 400 (walidacja) oraz 500 (błędy serwera). 

## 8. Interakcje użytkownika

- Użytkownik wkleja tekst w polu TextInput, przy czym CharacterCounter aktualizuje liczbę znaków.
- Po kliknięciu GenerateButton (Generuj fiszki):
  - widok sprawdza walidację tekstu, uruchamia SkeletonLoader 
  - wysyła żądanie do `/api/generations`.
  - uruchamia SkeletonLoader oraz przycisk jest dezaktywowany.
- Po otrzymaniu odpowiedzi, `FlashcardProposalsList` wyświetla listę fiszek (komponenty `FlashcardProposalItem`).
- Każda karta umożliwia:
  - Zatwierdzenie propozycji, która oznacza fiszkę do zapisu.
  - Edycję - otwarcie trybu edycji z możliwością korekty tekstu z walidacją.
  - Odrzucenie - usunięcie propozycji z listy.
- Komponent `BulkSaveButton` umożkuwua wts kabue wybranych fiszek do zapisania w bazie (wywołanie POST `/api/flashcards`)

## 9. Warunki i walidacja

- Tekst wejściowy musi mieć od 1000 do 10000 znaków.
- W formularzu edycji: pole "przód" do 200 znaków, pole "tył" do 500 znaków.
- Przycisk generowania aktywowany tylko przy poprawnym walidowanym tekście.
- Walidacja odpowiedzi API: komunikaty błędów wyświetlane w ErrorNotification.

## 10. Obsługa błędów

- Wyświetlanie komunikatów o błędach w przypadku niepowodzenia walidacji formularza.
- Obsługa odpowiedzi 400 (błędne dane) oraz 500 (błąd serwera) z wyświetleniem odpowiednich wiadomości i możliwość ponownego wysłania żądania.
- W przypadku niepowodzenia zapisu fiszek, stan ładowania jest resetowany, a użytkownik informowany o błędzie

## 11. Kroki implementacji

1. Utworzenie nowej strony widoku /generate w strukturze Astro.
2. Implementacja głównego komponentu FlashcardGenerateView.
3. Stworzenie komponentu TextInput z walidacją długości tekstu.
4. Utworzenie komponentu CharacterCounter.
5. Stworzenie komponentu GenerateButton i podpięcie akcji wysyłania żądania do POST /api/generations.
6. Implementacja hooka (np. useGenerateFlashcards) do obsługi logiki API i zarządzania stanem.
7. Utworzenie komponentu SkeletonLoader do wizualizacji ładowania.
8. Stworzenie komponentów FlashcardProposalsList i FlashcardProposalItem z obsługą akcji (zatwierdzanie, edycja, odrzucenie).
9. Integracja wyświetlania komunikatów błędów przez ErrorNotification.
10. Implementacja komponentu BulkSaveButton, który będzie zbiorczo wysyłał żądanie do endpointu POST /api/flashcards, korzystając z typu CreateFlashcardsDTO do walidacji danych.
11. Testowanie interakcji użytkownika oraz walidacji (scenariusze poprawne i błędne).
12. Dostrojenie responsywności i poprawienie aspektów dostępności.
13. Finalny code review i refaktoryzacja przed wdrożeniem.