import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FlashcardGenerateView from "../../src/components/FlashcardGenerateView";
import type { FlashcardProposalViewModel } from "../../src/components/FlashcardGenerateView";
import { type FlashcardProposalDTO } from "../../src/types";

// Mockowanie komponentów używanych w FlashcardGenerateView
vi.mock("../../src/components/TextInput", () => ({
  TextInput: vi.fn(({ value, onChange }) => (
    <textarea data-testid="text-input" value={value} onChange={(e) => onChange(e.target.value)} />
  )),
}));

vi.mock("../../src/components/CharacterCounter", () => ({
  CharacterCounter: vi.fn(({ count }) => <div data-testid="character-counter">Znaki: {count}</div>),
}));

vi.mock("../../src/components/GenerateButton", () => ({
  GenerateButton: vi.fn(({ onClick, disabled, isLoading }) => (
    <button data-testid="generate-button" onClick={onClick} disabled={disabled || isLoading}>
      {isLoading ? "Generowanie..." : "Generuj fiszki"}
    </button>
  )),
}));

vi.mock("../../src/components/SkeletonLoader", () => ({
  SkeletonLoader: vi.fn(() => <div data-testid="skeleton-loader">Ładowanie...</div>),
}));

// Mock dla FlashcardProposalsList, który obsługuje interakcje z fiszkami
vi.mock("../../src/components/FlashcardProposalsList", () => ({
  FlashcardProposalsList: vi.fn(({ flashcards, onAccept, onEdit, onReject }) => (
    <div data-testid="flashcard-proposals-list">
      <div data-testid="flashcards-count">Liczba fiszek: {flashcards.length}</div>
      <div data-testid="accepted-count">
        Zaakceptowane: {flashcards.filter((f: FlashcardProposalViewModel) => f.accepted).length}
      </div>
      {flashcards.map((flashcard: FlashcardProposalViewModel, index: number) => (
        <div key={index} data-testid={`flashcard-proposal-${index}`}>
          <div data-testid={`flashcard-content-${index}`}>
            {flashcard.front} / {flashcard.back}
          </div>
          <div data-testid={`flashcard-status-${index}`}>
            {flashcard.accepted ? "Zaakceptowana" : ""}
            {flashcard.edited ? "Edytowana" : ""}
          </div>
          <button data-testid={`accept-button-${index}`} onClick={() => onAccept(index)}>
            {flashcard.accepted ? "Cofnij akceptację" : "Zatwierdź"}
          </button>
          <button
            data-testid={`edit-button-${index}`}
            onClick={() => onEdit(index, `Edytowany ${flashcard.front}`, `Edytowany ${flashcard.back}`)}
          >
            Edytuj
          </button>
          <button data-testid={`reject-button-${index}`} onClick={() => onReject(index)}>
            Odrzuć
          </button>
        </div>
      ))}
    </div>
  )),
}));

vi.mock("../../src/components/BulkSaveButton", () => ({
  BulkSaveButton: vi.fn(({ flashcards, disabled, onSaveComplete }) => (
    <button data-testid="bulk-save-button" onClick={onSaveComplete} disabled={disabled}>
      Zapisz zaakceptowane ({flashcards.filter((f: FlashcardProposalViewModel) => f.accepted).length})
    </button>
  )),
}));

vi.mock("../../src/components/ErrorNotification", () => ({
  ErrorNotification: vi.fn(({ message }) => <div data-testid="error-notification">{message}</div>),
}));

// Mock globalnego fetch
const originalFetch = global.fetch;

describe("FlashcardGenerateView", () => {
  const mockFlashcardProposals = [
    { front: "Pytanie 1", back: "Odpowiedź 1", source: "ai-full" },
    { front: "Pytanie 2", back: "Odpowiedź 2", source: "ai-full" },
  ] as FlashcardProposalDTO[];

  beforeEach(() => {
    // Resetowanie mocków przed każdym testem
    vi.resetAllMocks();
    // Przywracanie oryginalnego fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // Test ID: GEN-001
  it("powinien włączyć przycisk generowania gdy tekst ma odpowiednią długość", async () => {
    // Arrange
    render(<FlashcardGenerateView />);
    const textInput = screen.getByTestId("text-input");

    // Act - zamiast wpisywania 1000 znaków, ustawiamy wartość bezpośrednio
    fireEvent.change(textInput, { target: { value: "a".repeat(1000) } });

    // Assert
    const generateButton = screen.getByTestId("generate-button");
    expect(generateButton).not.toBeDisabled();
    expect(screen.getByTestId("character-counter")).toHaveTextContent("Znaki: 1000");
  });

  // Test ID: GEN-002
  it("powinien wyłączyć przycisk generowania gdy tekst jest za krótki", async () => {
    // Arrange
    render(<FlashcardGenerateView />);
    const textInput = screen.getByTestId("text-input");

    // Act - zamiast wpisywania 999 znaków, ustawiamy wartość bezpośrednio
    fireEvent.change(textInput, { target: { value: "a".repeat(999) } });

    // Assert
    const generateButton = screen.getByTestId("generate-button");
    expect(generateButton).toBeDisabled();
    expect(screen.getByTestId("character-counter")).toHaveTextContent("Znaki: 999");
  });

  // Test ID: GEN-003
  it("powinien wyłączyć przycisk generowania gdy tekst jest za długi", async () => {
    // Arrange
    render(<FlashcardGenerateView />);
    const textInput = screen.getByTestId("text-input");

    // Act - zamiast wpisywania znaków, ustawiamy wartość bezpośrednio
    fireEvent.change(textInput, { target: { value: "a".repeat(10001) } });

    // Assert
    const generateButton = screen.getByTestId("generate-button");
    expect(generateButton).toBeDisabled();
    expect(screen.getByTestId("character-counter")).toHaveTextContent("Znaki: 10001");
  });

  // Test ID: GEN-004
  it("powinien wyświetlić SkeletonLoader i następnie listę propozycji fiszek po pomyślnym wygenerowaniu", async () => {
    // Arrange
    // Stworzenie mocka w taki sposób, aby zwracał najpierw Promise, który się nie rozwiązuje natychmiast
    let resolvePromise: (value: Response) => void;
    const responsePromise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    global.fetch = vi.fn().mockReturnValue(responsePromise);

    render(<FlashcardGenerateView />);
    const textInput = screen.getByTestId("text-input");
    fireEvent.change(textInput, { target: { value: "a".repeat(1000) } });

    // Act
    const generateButton = screen.getByTestId("generate-button");
    fireEvent.click(generateButton);

    // W tym momencie komponent powinien pokazać loader
    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();

    // Teraz symulujemy zakończenie zapytania
    if (resolvePromise) {
      resolvePromise({
        ok: true,
        json: () =>
          Promise.resolve({
            generation_id: 123,
            flashcards_proposals: mockFlashcardProposals,
            generated_count: 2,
          }),
      });
    }

    // Po zakończeniu ładowania powinna pojawić się lista fiszek
    await waitFor(() => {
      expect(screen.getByTestId("flashcard-proposals-list")).toBeInTheDocument();
    });

    // Weryfikacja wywołania fetch z odpowiednimi parametrami
    expect(global.fetch).toHaveBeenCalledWith("/api/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source_text: "a".repeat(1000) }),
    });
  });

  // Test ID: GEN-005
  it("powinien wyświetlić komunikat błędu gdy generowanie się nie powiedzie", async () => {
    // Arrange
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          message: "Wystąpił błąd podczas generowania fiszek",
        }),
    });

    render(<FlashcardGenerateView />);
    const textInput = screen.getByTestId("text-input");
    fireEvent.change(textInput, { target: { value: "a".repeat(1000) } });

    // Act
    const generateButton = screen.getByTestId("generate-button");
    fireEvent.click(generateButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId("error-notification")).toBeInTheDocument();
      expect(screen.getByTestId("error-notification")).toHaveTextContent("Wystąpił błąd podczas generowania fiszek");
    });
  });

  // Test ID: MGMT-001
  it("powinien obsługiwać akceptację i cofanie akceptacji propozycji fiszki", async () => {
    // Arrange - przygotowanie komponentu z wygenerowanymi fiszkami
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          generation_id: 123,
          flashcards_proposals: mockFlashcardProposals,
          generated_count: 2,
        }),
    });

    render(<FlashcardGenerateView />);

    // Wygenerowanie fiszek
    const textInput = screen.getByTestId("text-input");
    fireEvent.change(textInput, { target: { value: "a".repeat(1000) } });

    const generateButton = screen.getByTestId("generate-button");
    fireEvent.click(generateButton);

    // Czekamy na wyświetlenie listy fiszek
    await waitFor(() => {
      expect(screen.getByTestId("flashcard-proposals-list")).toBeInTheDocument();
    });

    // Act - klikamy przycisk akceptacji pierwszej fiszki
    const acceptButton = screen.getByTestId("accept-button-0");
    fireEvent.click(acceptButton);

    // Assert - sprawdzamy, czy licznik zaakceptowanych fiszek się zwiększył
    await waitFor(() => {
      expect(screen.getByTestId("accepted-count")).toHaveTextContent("Zaakceptowane: 1");
    });

    // Sprawdzamy, czy przycisk bulk save pokazuje 1 zaakceptowaną fiszkę
    expect(screen.getByTestId("bulk-save-button")).toHaveTextContent("Zapisz zaakceptowane (1)");
  });

  // Test ID: MGMT-003
  it("powinien obsługiwać edycję propozycji fiszki", async () => {
    // Arrange - przygotowanie komponentu z wygenerowanymi fiszkami
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          generation_id: 123,
          flashcards_proposals: mockFlashcardProposals,
          generated_count: 2,
        }),
    });

    render(<FlashcardGenerateView />);

    // Wygenerowanie fiszek
    const textInput = screen.getByTestId("text-input");
    fireEvent.change(textInput, { target: { value: "a".repeat(1000) } });

    const generateButton = screen.getByTestId("generate-button");
    fireEvent.click(generateButton);

    // Czekamy na wyświetlenie listy fiszek
    await waitFor(() => {
      expect(screen.getByTestId("flashcard-proposals-list")).toBeInTheDocument();
    });

    // Act - klikamy przycisk edycji pierwszej fiszki
    const editButton = screen.getByTestId("edit-button-0");
    fireEvent.click(editButton);

    // Assert - sprawdzamy, czy fiszka została oznaczona jako edytowana i zaakceptowana
    await waitFor(() => {
      expect(screen.getByTestId("flashcard-status-0")).toHaveTextContent("ZaakceptowanaEdytowana");
    });

    // Sprawdzamy, czy przycisk bulk save pokazuje 1 zaakceptowaną fiszkę
    expect(screen.getByTestId("bulk-save-button")).toHaveTextContent("Zapisz zaakceptowane (1)");
  });

  // Test ID: MGMT-006
  it("powinien obsługiwać odrzucanie propozycji fiszki", async () => {
    // Arrange - przygotowanie komponentu z wygenerowanymi fiszkami
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          generation_id: 123,
          flashcards_proposals: mockFlashcardProposals,
          generated_count: 2,
        }),
    });

    render(<FlashcardGenerateView />);

    // Wygenerowanie fiszek
    const textInput = screen.getByTestId("text-input");
    fireEvent.change(textInput, { target: { value: "a".repeat(1000) } });

    const generateButton = screen.getByTestId("generate-button");
    fireEvent.click(generateButton);

    // Czekamy na wyświetlenie listy fiszek
    await waitFor(() => {
      expect(screen.getByTestId("flashcard-proposals-list")).toBeInTheDocument();
      expect(screen.getByTestId("flashcards-count")).toHaveTextContent("Liczba fiszek: 2");
    });

    // Act - klikamy przycisk odrzucenia pierwszej fiszki
    const rejectButton = screen.getByTestId("reject-button-0");
    fireEvent.click(rejectButton);

    // Assert - sprawdzamy, czy liczba fiszek się zmniejszyła
    await waitFor(() => {
      expect(screen.getByTestId("flashcards-count")).toHaveTextContent("Liczba fiszek: 1");
    });
  });

  // Test ID: SAVE-006
  it("powinien resetować stan widoku po pomyślnym zapisaniu fiszek", async () => {
    // Arrange - przygotowanie komponentu z wygenerowanymi fiszkami
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          generation_id: 123,
          flashcards_proposals: mockFlashcardProposals,
          generated_count: 2,
        }),
    });

    render(<FlashcardGenerateView />);

    // Wygenerowanie fiszek
    const textInput = screen.getByTestId("text-input");
    fireEvent.change(textInput, { target: { value: "a".repeat(1000) } });

    const generateButton = screen.getByTestId("generate-button");
    fireEvent.click(generateButton);

    // Czekamy na wyświetlenie listy fiszek
    await waitFor(() => {
      expect(screen.getByTestId("flashcard-proposals-list")).toBeInTheDocument();
    });

    // Act - klikamy przycisk zapisu (wywołujący onSaveComplete)
    const saveButton = screen.getByTestId("bulk-save-button");
    fireEvent.click(saveButton);

    // Assert - sprawdzamy resetowanie stanu
    await waitFor(() => {
      // Pole tekstowe powinno być puste
      expect(screen.getByTestId("text-input")).toHaveValue("");
      // Lista fiszek powinna zniknąć
      expect(screen.queryByTestId("flashcard-proposals-list")).not.toBeInTheDocument();
    });
  });
});
