# Testy w projekcie FiszkiAIkp

Ten dokument zawiera informacje o strukturze testów, konwencjach i dobrych praktykach dla testów w projekcie FiszkiAIkp.

## Struktura katalogów

```
tests/
├── e2e/                # Testy end-to-end z użyciem Playwright
│   ├── page-objects/   # Klasy POM (Page Object Model)
│   └── *.spec.ts       # Pliki testów E2E
├── unit/               # Testy jednostkowe z użyciem Vitest
│   └── *.test.{ts,tsx} # Pliki testów jednostkowych
└── setup/              # Konfiguracja środowiska testowego
    └── vitest.setup.ts # Konfiguracja Vitest
```

## Testy jednostkowe (Vitest)

### Uruchamianie testów

- `npm test` - uruchomienie testów jednostkowych
- `npm run test:watch` - uruchomienie testów w trybie watch
- `npm run test:ui` - uruchomienie testów z interfejsem UI
- `npm run test:coverage` - sprawdzenie pokrycia kodu testami

### Konwencje

- Nazwy plików testowych powinny kończyć się na `.test.ts` lub `.test.tsx`
- Używaj struktury Arrange-Act-Assert (AAA) w testach
- Grupuj testy za pomocą bloków `describe`
- Używaj `it` do definiowania przypadków testowych
- Pisz testy, które są niezależne od siebie
- Korzystaj z funkcji mockujących z `vi` zamiast rzeczywistych implementacji

## Testy E2E (Playwright)

### Uruchamianie testów

- `npm run test:e2e` - uruchomienie testów E2E
- `npm run test:e2e:ui` - uruchomienie testów E2E z interfejsem UI
- `npm run test:e2e:codegen` - generator testów E2E

### Konwencje

- Nazwy plików testowych powinny kończyć się na `.spec.ts`
- Używaj Page Object Model (POM) dla lepszej organizacji testów
- Twórz odizolowane konteksty przeglądarki dla niezależnych testów
- Używaj selektorów lokatorów zamiast selektorów CSS lub XPath
- Wykorzystuj zrzuty ekranu do testów regresji wizualnej
- Używaj struktury Arrange-Act-Assert (AAA) w testach

## Dobre praktyki

- Pisz testy, które sprawdzają rzeczywiste scenariusze użytkownika
- Testuj edge cases i obsługę błędów
- Unikaj zależności między testami
- Używaj mocków tylko wtedy, gdy jest to konieczne
- Regularnie aktualizuj testy w miarę rozwoju aplikacji
- Utrzymuj wysokie pokrycie kodu testami (min. 70%)
- Uruchamiaj testy w CI przed wdrożeniem zmian
