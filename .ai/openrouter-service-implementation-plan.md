# Przewodnik implementacji usługi OpenRouter

## 1. Opis usługi

Usługa OpenRouter pozwala na integrację z interfejsem API OpenRouter w celu wzbogacenia czatów opartych na modelach LLM. Jej głównym celem jest automatyczne generowanie treści, weryfikacja odpowiedzi oraz wspomaganie użytkowników w efektywnym przetwarzaniu informacji na bazie wiadomości wejściowych.

## 2. Opis konstruktora

Konstruktor usługi odpowiada za inicjalizację:

- Inicjować konfigurację API (np. `OPENROUTER_API_KEY` z pliku .env, baza URL, itp.).
- Ustawiania domyślnych parametrów modelu (`temperature`, `top_p` `frequency_penalty`, `presence_penalty` itp.).
- Konfiguracji komunikatów systemowych (role: 'system') i użytkownika (role: 'user').
- Ustawień response_format dla walidacji wyników z API.
- Akceptować opcjonalne parametry inicjalizacyjne (np. timeout, retries).

Dzięki temu konstruktor tworzy środowisko gotowe do przesyłania zapytań do API OpenRouter zgodnie z oczekiwaniami.

## 3. Publiczne metody i pola

1. `sendChatMessage(userMessage: string): Promise<ResponseType>` - Metoda wysyłająca komunikat użytkownika do API OpenRouter, uwzględniając wczesniej ustawiony komunikat systemowy oraz konfigurację modelu.
2. `setSystemMessage(message: string): void` - Ustawia komunikat systemowy, który zostanie dołączony do zapytań.
3. `setUserMessage(message: string): void` - Ustawia komunikat użytkownika.
4. `setModel(name: string, parameters: ModelParameters): void` - Pozwala na wybór modelu (model: [model-name]) oraz ustawienie jego parametrów (temperature, top_p, frequency_penalty, presence_penalty). Publiczne pola konfiguracyjne, takie jak `apiUrl`, `apiKey` oraz domyślne ustawienia modelu.
4. `setResponseFormat(schema: JSONSchema): void` - Konfiguruje schemat JSON dla strukturalnych odpowiedzi (response_format)

## 4. Prywatne metody i pola

Kluczowe komponenty wewnętrzne:

- **executeRequest(requestPayload: RequestPayload): Promise<ApiResponse>**
   - Realizuje wywołanie HTTP do API OpenRouter, zarządza retry oraz parsowaniem odpowiedzi.
-**buildRequestPayload(): RequestPayload**
   - Buduje ładunek żądania zawierający:
      - Komunikat systemowy, np.
         ```json
         { "role": "system", "content": "[system-message]" }
         ```
      - Komunikat użytkownika, np.
         ```json
         { "role": "user", "content": "[user-message]" }
         ```
      - Structured output wykorzystujący response_format (JSON schema).
      - Nazwę modelu i parametry modelu.
- Prywatne pola przechowujące bieżącą konfigurację: currentSystemMessage, currentUserMessage, currentResponseFormat, currentModelName oraz currentModelParameters.

## 5. Obsługa błędów

Obsługa błędów powinna obejmować:

- Walidację odpowiedzi API – sprawdzanie zgodności otrzymanego JSON z oczekiwanym schematem.
- Obsługę błędów sieciowych (np. timeout, brak połączenia) oraz wdrożenie mechanizmu retry z backoff.
- Rzucanie specyficznych wyjątków dla przypadków błędów autentykacji (np. niepoprawny API key) oraz przekroczenia limitów API.
- Logowanie błędów z zachowaniem zasad bezpieczeństwa (bez rejestrowania poufnych danych).

## 6. Kwestie bezpieczeństwa

W aspekcie bezpieczeństwa należy zwrócić uwagę na:

- Przechowywanie kluczy API w zmiennych środowiskowych.
- Ograniczenie logowania danych wrażliwych – unikanie zapisywania pełnych ładunków zawierających klucze API.

## 7. Plan wdrożenia krok po kroku

1. Analiza wymagań i konfiguracja projektu
   - Zapoznać się z dokumentacją API OpenRouter.
   - Upewnić się, że wszystkie zależności (Astro, TypeScript, React, Tailwind, Shadcn/ui) są poprawnie skonfigurowane.

2. Implementacja modułu klienta API
   - Utworzyć moduł (np. `src/lib/openrouter.ts`) dedykowany do komunikacji z API OpenRouter.
   - Zaimplementować funkcje do ustawienia komunikatów systemowego i użytkownika oraz konfiguracji parametrów modelu.
   - Wdrożyć metodę `executeRequest()` obsługującą wywołania HTTP z mechanizmem retry i backoff.

3. Implementacja warstwy logiki czatu
   - Utworzyć interfejs publiczny do wysyłania wiadomości czatowych, konsolidujący konfigurację komunikatów i parametrów modelu.
   - Umożliwić dynamiczną modyfikację konfiguracji (np. zmiana komunikatu systemowego w czasie rzeczywistym).

4. Obsługa strukturalnych odpowiedzi API
   - Zaimplementować metodę `buildRequestPayload()`, która tworzy odpowiedni ładunek z komunikatem systemowym, użytkownika oraz określa schemat odpowiedzi (response_format).
   - Zaimplementować funkcje walidujące i parsujące odpowiedzi z API.

5. Implementacja obsługi błędów i logowania
   - Zaimplementować szczegółową obsługę wyjątków dla różnych scenariuszy (błąd sieciowy, błąd autentykacji, niepoprawna struktura odpowiedzi).
   - Dodać mechanizmy logowania błędów, pamiętając o zasadach bezpieczeństwa i nie rejestrowaniu danych wrażliwych.
