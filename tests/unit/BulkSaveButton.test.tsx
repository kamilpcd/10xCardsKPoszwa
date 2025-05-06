import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { BulkSaveButton } from "@/components/BulkSaveButton";
import type { FlashcardProposalViewModel } from "@/components/FlashcardGenerateView";

// Mock globalnego fetch
const originalFetch = global.fetch;

describe("BulkSaveButton", () => {
  // Arrange - przygotowanie wspólnych elementów dla testów
  const mockOnSaveComplete = vi.fn();
  const generationId = 123;

  let mockFlashcards: FlashcardProposalViewModel[];

  // Ustawienie mocków przed każdym testem
  beforeEach(() => {
    // Domyślne fiszki testowe - jedna zaakceptowana, jedna niezaakceptowana
    mockFlashcards = [
      { front: "Pytanie 1", back: "Odpowiedź 1", accepted: true, edited: false, source: "ai-full" },
      { front: "Pytanie 2", back: "Odpowiedź 2", accepted: false, edited: false, source: "ai-full" },
    ];

    // Mock funkcji fetch
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    // Mockowanie setTimeout
    vi.useFakeTimers();

    // Reset mocków
    mockOnSaveComplete.mockReset();
  });

  // Czyszczenie po każdym teście
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // SAVE-003: Próba zapisania zaakceptowanych, gdy żadna nie jest zaakceptowana
  it("dezaktywuje przycisk 'Zapisz zaakceptowane' gdy nie ma zaakceptowanych fiszek", () => {
    // Arrange
    const noAcceptedFlashcards = mockFlashcards.map((card) => ({ ...card, accepted: false }));
    render(
      <BulkSaveButton
        flashcards={noAcceptedFlashcards}
        generationId={generationId}
        disabled={false}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    // Act & Assert
    const saveAcceptedButton = screen.getByText(/Zapisz zaakceptowane/);
    expect(saveAcceptedButton).toBeDisabled();
  });

  // SAVE-003: Weryfikacja czy przycisk 'Zapisz wszystkie' jest nieaktywny gdy nie ma fiszek
  it("dezaktywuje przycisk 'Zapisz wszystkie' gdy nie ma żadnych fiszek", () => {
    // Arrange
    render(
      <BulkSaveButton
        flashcards={[]}
        generationId={generationId}
        disabled={false}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    // Act & Assert
    const saveAllButton = screen.getByText(/Zapisz wszystkie/);
    expect(saveAllButton).toBeDisabled();
  });

  // SAVE-001: Zapisanie zaakceptowanych fiszek
  it("wysyła tylko zaakceptowane fiszki do API po kliknięciu 'Zapisz zaakceptowane'", async () => {
    // Arrange
    render(
      <BulkSaveButton
        flashcards={mockFlashcards}
        generationId={generationId}
        disabled={false}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    // Act
    await act(async () => {
      const saveAcceptedButton = screen.getByText(/Zapisz zaakceptowane/);
      fireEvent.click(saveAcceptedButton);
    });

    // Assert
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flashcards: [
          {
            front: "Pytanie 1",
            back: "Odpowiedź 1",
            source: "ai-full",
            generation_id: 123,
          },
        ],
      }),
    });
  });

  // SAVE-002: Zapisanie wszystkich fiszek
  it("wysyła wszystkie fiszki do API po kliknięciu 'Zapisz wszystkie'", async () => {
    // Arrange
    render(
      <BulkSaveButton
        flashcards={mockFlashcards}
        generationId={generationId}
        disabled={false}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    // Act
    await act(async () => {
      const saveAllButton = screen.getByText(/Zapisz wszystkie/);
      fireEvent.click(saveAllButton);
    });

    // Assert
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flashcards: [
          {
            front: "Pytanie 1",
            back: "Odpowiedź 1",
            source: "ai-full",
            generation_id: 123,
          },
          {
            front: "Pytanie 2",
            back: "Odpowiedź 2",
            source: "ai-full",
            generation_id: 123,
          },
        ],
      }),
    });
  });

  // SAVE-004: Obsługa stanu ładowania podczas zapisywania
  it("wyświetla stan ładowania podczas zapisywania", async () => {
    // Arrange - opóźniamy odpowiedź z API
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ success: true }),
            });
          }, 1000);
        })
    );

    render(
      <BulkSaveButton
        flashcards={mockFlashcards}
        generationId={generationId}
        disabled={false}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    // Act
    await act(async () => {
      const saveAcceptedButton = screen.getByText(/Zapisz zaakceptowane/);
      fireEvent.click(saveAcceptedButton);
    });

    // Assert - używamy getAllByText zamiast getByText, ponieważ może być kilka elementów z tym tekstem
    const loadingElements = screen.getAllByText("Zapisywanie...");
    expect(loadingElements.length).toBeGreaterThan(0);
    expect(document.querySelector("svg.animate-spin")).toBeInTheDocument();

    // Przyspieszamy zegar by zakończyć operację asynchroniczną
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
  });

  // SAVE-005: Obsługa błędu podczas zapisywania
  it("wyświetla komunikat błędu przy niepowodzeniu zapisu", async () => {
    // Arrange - symulujemy błąd z API
    const errorMessage = "Wystąpił błąd podczas zapisywania fiszek";
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      })
    );

    render(
      <BulkSaveButton
        flashcards={mockFlashcards}
        generationId={generationId}
        disabled={false}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    // Act
    await act(async () => {
      const saveAcceptedButton = screen.getByText(/Zapisz zaakceptowane/);
      fireEvent.click(saveAcceptedButton);

      // Rozwiązujemy wszystkie oczekujące obietnice
      await vi.runAllTimersAsync();
    });

    // Assert
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  }, 10000); // Zwiększamy timeout do 10 sekund

  // Test sprawdzający, czy po sukcesie wyświetlony jest komunikat
  it("wyświetla komunikat sukcesu po pomyślnym zapisie", async () => {
    // Arrange
    render(
      <BulkSaveButton
        flashcards={mockFlashcards}
        generationId={generationId}
        disabled={false}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    // Act
    await act(async () => {
      const saveAcceptedButton = screen.getByText(/Zapisz zaakceptowane/);
      fireEvent.click(saveAcceptedButton);

      // Rozwiązujemy wszystkie oczekujące obietnice
      await vi.runAllTimersAsync();
    });

    // Assert
    expect(screen.getByText("Fiszki zostały pomyślnie zapisane!")).toBeInTheDocument();
  }, 10000); // Zwiększamy timeout do 10 sekund

  // Test weryfikujący wywołanie callbacku onSaveComplete po sukcesie
  it("wywołuje funkcję onSaveComplete po pomyślnym zapisie", async () => {
    // Arrange - dodajemy bezpośrednią implementację setTimeout do testów
    vi.spyOn(global, "setTimeout").mockImplementation((callback) => {
      callback();
      return 123 as unknown as NodeJS.Timeout; // wartość zwrotna niepotrzebna w teście
    });

    render(
      <BulkSaveButton
        flashcards={mockFlashcards}
        generationId={generationId}
        disabled={false}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    // Act
    await act(async () => {
      const saveAcceptedButton = screen.getByText(/Zapisz zaakceptowane/);
      fireEvent.click(saveAcceptedButton);
    });

    // Assert
    expect(mockOnSaveComplete).toHaveBeenCalledTimes(1);
  });

  // Test sprawdzający, czy prawidłowo oznaczane jest źródło fiszki jako 'ai-edited'
  it("prawidłowo ustawia źródło fiszki jako 'ai-edited' dla edytowanych fiszek", async () => {
    // Arrange - ustawiamy jedną fiszkę jako edytowaną
    const editedFlashcards = [{ ...mockFlashcards[0], edited: true, accepted: true }];

    render(
      <BulkSaveButton
        flashcards={editedFlashcards}
        generationId={generationId}
        disabled={false}
        onSaveComplete={mockOnSaveComplete}
      />
    );

    // Act
    await act(async () => {
      const saveAcceptedButton = screen.getByText(/Zapisz zaakceptowane/);
      fireEvent.click(saveAcceptedButton);
    });

    // Assert
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flashcards: [
          {
            front: "Pytanie 1",
            back: "Odpowiedź 1",
            source: "ai-edited",
            generation_id: 123,
          },
        ],
      }),
    });
  });
});
