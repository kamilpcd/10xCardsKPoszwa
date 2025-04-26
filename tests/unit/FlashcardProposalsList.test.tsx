
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FlashcardProposalsList } from "../../src/components/FlashcardProposalsList";
import { FlashcardProposalItem } from "../../src/components/FlashcardProposalItem";
import { type FlashcardProposalViewModel } from "../../src/components/FlashcardGenerateView";

// Mockowanie komponentu dziecka
vi.mock("../../src/components/FlashcardProposalItem", () => ({
  FlashcardProposalItem: vi.fn(() => <div data-testid="flashcard-proposal-item" />),
}));

describe("FlashcardProposalsList", () => {
  // Przygotowanie mockowanych funkcji
  const mockOnAccept = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnReject = vi.fn();

  // Przygotowanie przykładowych danych zgodnych z typem FlashcardProposalViewModel
  const mockFlashcards: FlashcardProposalViewModel[] = [
    { front: "Pytanie 1", back: "Odpowiedź 1", source: "ai-full", accepted: true, edited: false },
    { front: "Pytanie 2", back: "Odpowiedź 2", source: "ai-full", accepted: false, edited: false },
    { front: "Pytanie 3", back: "Odpowiedź 3", source: "ai-full", accepted: true, edited: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("nie renderuje nic, gdy lista fiszek jest pusta", () => {
    // Arrange
    const { container } = render(
      <FlashcardProposalsList flashcards={[]} onAccept={mockOnAccept} onEdit={mockOnEdit} onReject={mockOnReject} />
    );

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it("renderuje nagłówek i licznik zaakceptowanych fiszek", () => {
    // Arrange
    render(
      <FlashcardProposalsList
        flashcards={mockFlashcards}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Assert
    expect(screen.getByText("Wygenerowane propozycje fiszek")).toBeInTheDocument();
    expect(screen.getByText("Zaakceptowano: 2/3")).toBeInTheDocument();
  });

  it("renderuje odpowiednią liczbę komponentów FlashcardProposalItem", () => {
    // Arrange
    render(
      <FlashcardProposalsList
        flashcards={mockFlashcards}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Assert
    const items = screen.getAllByTestId("flashcard-proposal-item");
    expect(items).toHaveLength(3);
    expect(FlashcardProposalItem).toHaveBeenCalledTimes(3);
  });

  it("przekazuje odpowiednie props do komponentów dzieci", () => {
    // Arrange
    render(
      <FlashcardProposalsList
        flashcards={mockFlashcards}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Assert
    // Sprawdzamy wszystkie wywołania zbiorczo
    const calls = vi.mocked(FlashcardProposalItem).mock.calls;

    // Sprawdzamy każde wywołanie z osobna
    expect(calls[0][0]).toEqual({
      flashcard: mockFlashcards[0],
      index: 0,
      onAccept: mockOnAccept,
      onEdit: mockOnEdit,
      onReject: mockOnReject,
    });

    expect(calls[1][0]).toEqual({
      flashcard: mockFlashcards[1],
      index: 1,
      onAccept: mockOnAccept,
      onEdit: mockOnEdit,
      onReject: mockOnReject,
    });

    expect(calls[2][0]).toEqual({
      flashcard: mockFlashcards[2],
      index: 2,
      onAccept: mockOnAccept,
      onEdit: mockOnEdit,
      onReject: mockOnReject,
    });
  });
});
