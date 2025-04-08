# Dokument wymagań produktu (PRD) - FiszkiAIkp

## 1. Przegląd produktu
FiszkiAIkp to webowa aplikacja edukacyjna umożliwiająca tworzenie wysokiej jakości fiszek, zarówno przy użyciu automatycznego generowania przez AI (poprzez API), jak i ręcznej edycji. Aplikacja adresowana jest do studentów oraz uczniów szkół podstawowych i średnich, którzy chcą wykorzystać metodę spaced repetition do efektywnej nauki. System integruje generowanie fiszek na podstawie wprowadzonego tekstu, umożliwia recenzję kandydatów oraz zarządzanie fiszkami poprzez prosty interfejs z kontami użytkowników, wyszukiwarką i paginacją. Automatyczne fiszki podlegają walidacji oraz ręcznej weryfikacji przed zapisem, a zapisane dane współpracują z gotowym algorytmem powtórek opartym na rozwiązaniach open-source.

## 2. Problem użytkownika
Użytkownicy (głównie uczniowie i studenci) napotykają na problem związany z czasochłonnością ręcznego tworzenia fiszek edukacyjnych. Początkujący mają dodatkowo trudności z optymalnym dzieleniem dużych partii informacji na zwięzłe i efektywne fiszki. Brak intuicyjnego i szybkiego sposobu generowania oraz zarządzania fiszkami ogranicza korzystanie z efektywnej metody nauki, jaką jest spaced repetition.

## 3. Wymagania funkcjonalne
1. Generowanie fiszek przez AI
   - Użytkownik wprowadza tekst wejściowy (od 1000 do 10 000 znaków) w dedykowanym polu.
   - AI, wykorzystując predefiniowany model poprzez API (określony zmienną środowiskową i stały systemowy prompt), generuje propozycje fiszek o stałej strukturze:
     - Pole "przód" – do 200 znaków.
     - Pole "tył" – do 500 znaków.
   - Fiszki generowane przez AI nie są zapisywane automatycznie, lecz przesyłane do recenzji.

2. Proces recenzji fiszek generowanych przez AI
   - Wyświetlenie listy kandydatów.
   - Umożliwienie użytkownikowi akceptacji, edycji lub odrzucenia każdej fiszki.
   - Zapis zaakceptowanych fiszek w systemie.

3. Ręczne tworzenie fiszek
   - Udostępnienie formularza do tworzenia fiszek manualnie z obowiązkowymi polami "przód" (do 200 znaków) oraz "tył" (do 500 znaków).
   - Możliwość edycji i usuwania fiszek stworzonych ręcznie.

4. Zarządzanie fiszkami
   - Prezentacja zapisanych fiszek w formie listy.
   - Prosta wyszukiwarka umożliwiająca przeszukiwanie fiszek.
   - Paginacja listy, bez dodatkowych filtrów czy kategoryzacji.

5. Konta użytkowników oraz bezpieczeństwo
   - System prostych kont użytkowników umożliwiających logowanie, rejestrację oraz autoryzację.
   - Dostęp do operacji (generowanie, recenzja, edycja, usuwanie) mają wyłącznie zalogowani użytkownicy.
   - Walidacja danych (tekstu wejściowego oraz pól "przód" i "tył") odbywa się synchronicznie na frontendzie i backendzie, z wyświetlaniem komunikatów błędów (np. div z tekstem).

6. Integracja z algorytmem powtórek
   - Zapisane fiszki są integrowane z gotowym algorytmem spaced repetition, wykorzystując bibliotekę open-source.

7. Logowanie operacji
   - Rejestrowanie w bazie danych liczby wygenerowanych fiszek przez AI.
   - Rejestrowanie liczby zaakceptowanych fiszek wraz z identyfikatorem użytkownika w celach monitorowania wskaźnika akceptacji.

## 4. Granice produktu
1. Elementy niewchodzące w zakres MVP:
   - Brak opracowywania własnego zaawansowanego algorytmu powtórek (np. SuperMemo, Anki) – wykorzystywany jest gotowy system.
   - Import dokumentów w wielu formatach, takich jak PDF czy DOCX.
   - Współdzielenie zestawów fiszek między użytkownikami.
   - Integracje z zewnętrznymi platformami edukacyjnymi.
   - Aplikacje mobilne – na początek tylko wersja webowa.
   
2. Dodatkowe funkcjonalności nie przewidziane w MVP:
   - Rozbudowane opcje edycji lub kategoryzacji fiszek.
   - Zbieranie feedbacku użytkowników lub zaawansowane metody recenzji.
   - Dodatkowe zabezpieczenia spoza standardowych praktyk autentykacji, autoryzacji i walidacji.

## 5. Historyjki użytkowników

### US-001
**Tytuł:** Rejestracja i logowanie  
**Opis:** Jako użytkownik, chcę móc założyć konto oraz się zalogować, aby uzyskać dostęp do zapisanych fiszek oraz korzystać z funkcji aplikacji.  
**Kryteria akceptacji:**
- Użytkownik może zarejestrować się, podając wymagane dane (np. adres e-mail, hasło).
- Po rejestracji użytkownik może się zalogować.
- Dostęp do funkcjonalności generowania, recenzji i zarządzania fiszkami mają jedynie zalogowani użytkownicy.

### US-002
**Tytuł:** Generowanie fiszek przez AI  
**Opis:** Jako użytkownik, chcę wkleić tekst (od 1000 do 10 000 znaków) w celu wygenerowania przez AI propozycji fiszek, aby zaoszczędzić czas przy przygotowywaniu materiałów do nauki.  
**Kryteria akceptacji:**
- System umożliwia wprowadzenie i przesłanie długiego tekstu.
- AI generuje propozycje fiszek zawierających pola "przód" (do 200 znaków) oraz "tył" (do 500 znaków) (przód - pytanie, tył - odpowiedź).
- Wygenerowane fiszki są wyświetlane jako kandydaci i nie są automatycznie zapisywane w bazie danych.

### US-003
**Tytuł:** Recenzja fiszek generowanych przez AI  
**Opis:** Jako użytkownik, chcę móc recenzować fiszki wygenerowane przez AI, aby zaakceptować, edytować lub odrzucić propozycje przed zapisaniem ich w systemie.  
**Kryteria akceptacji:**
- Użytkownik widzi listę kandydatów wygenerowanych przez AI.
- Każda fiszka ma opcje: akceptacji, edycji (poprzez modal) lub odrzucenia.
- Po akceptacji fiszka zostaje zapisana, a odrzucone fiszki nie są zapisywane w systemie.

### US-004
**Tytuł:** Ręczne tworzenie fiszek  
**Opis:** Jako użytkownik, chcę móc stworzyć fiszkę ręcznie, uzupełniając pola "przód" i "tył", aby mieć pełną kontrolę nad treścią.  
**Kryteria akceptacji:**
- Formularz do tworzenia fiszki zawiera dwa pola: "przód" (limit 200 znaków) oraz "tył" (limit 500 znaków).
- Użytkownik może zapisać fiszkę, która następnie pojawia się na liście zapisanych fiszek (w ramach widoku "Moje fiszki").
- Walidacja danych odbywa się synchronicznie, z wyświetlaniem komunikatów błędów przy nieprawidłowym wprowadzeniu danych.

### US-005
**Tytuł:** Edycja zapisanych fiszek  
**Opis:** Jako użytkownik, chcę móc edytować fiszki, zarówno stworzone ręcznie, jak i zaakceptowane z propozycji AI, aby aktualizować i poprawiać ich treść.  
**Kryteria akceptacji:**
- Opcja edycji jest dostępna dla każdej zapisanej fiszki.
- Edycja odbywa się poprzez otwarcie modala z obowiązkowymi polami do modyfikacji.
- System waliduje zmienione dane, a zaktualizowana fiszka pojawia się poprawnie na liście.

### US-006
**Tytuł:** Usuwanie fiszek  
**Opis:** Jako użytkownik, chcę móc usuwać niepotrzebne fiszki, aby utrzymać porządek w mojej bazie danych.  
**Kryteria akceptacji:**
- Każda fiszka posiada opcję usunięcia.
- Po potwierdzeniu akcji, fiszka zostaje usunięta z bazy danych i nie jest wyświetlana na liście.
- Interfejs informuje użytkownika o pomyślnym usunięciu.

### US-007
**Tytuł:** Przeglądanie i wyszukiwanie fiszek  
**Opis:** Jako użytkownik, chcę przeglądać wszystkie zapisane fiszki oraz wyszukiwać konkretne fiszki, aby szybko znaleźć interesujące mnie informacje.  
**Kryteria akceptacji:**
- Zapisane fiszki są wyświetlane na liście z paginacją.
- Dostępna jest prosta wyszukiwarka umożliwiająca filtrowanie fiszek na podstawie wpisanego tekstu.
- Wyniki wyszukiwania są poprawnie aktualizowane wraz z paginacją.

### US-008
**Tytuł:** Sesja nauki z algorytmem powtórek  
**Opis:** Jako użytkownik, chcę aby zapisane fiszki były integrowane z algorytmem powtórek opartym na spaced repetition, tak aby móc korzystać z przygotowanych materiałów w regularnych sesjach nauki.  
**Kryteria akceptacji:**
- W widoku "Sesja nauki" algorytm przygotuje dla mnie sesję nauki fiszek.
- Na start wyświetlany jest przód fiszki, poprze interakcję użytkownik wyświetla jej tył.
- Użytkownik ocenia zgodnie z oczekiwaniami algorytmu na ile przyswoił fiszkę.
- Następnie algorytm pokazuje kolejną fiszkę w ramach sesji nauki.

## 6. Metryki sukcesu
1. Akceptacja fiszek AI:
   - Co najmniej 75% propozycji wygenerowanych przez AI musi być zaakceptowanych przez użytkowników.
   - Wskaźnik akceptacji będzie monitorowany poprzez logi rejestrujące liczbę wygenerowanych oraz zaakceptowanych fiszek, powiązanych z identyfikatorem użytkownika.
   
2. Interfejs użytkownika:
   - Użytkownicy powinni mieć łatwy dostęp do funkcji tworzenia, recenzji, edycji i usuwania fiszek, a także do wyszukiwarki i paginacji.
   - Walidacja danych (zarówno po stronie klienta, jak i serwera) powinna skutecznie informować użytkownika o błędach wprowadzania danych.

4. Bezpieczeństwo:
   - System zapewnia autentykację i autoryzację użytkowników, gwarantując, że tylko zalogowani użytkownicy mogą modyfikować własne fiszki.

Podsumowując, FiszkiAI ma na celu uproszczenie procesu tworzenia fiszek oraz zwiększenie efektywności nauki dzięki integracji inteligentnej generacji treści i sprawdzonego algorytmu powtórek. Każda z historyjek użytkownika jest zaprojektowana tak, aby można ją było testować i mierzyć jej sukces przy użyciu wyżej opisanych kryteriów akceptacji. 