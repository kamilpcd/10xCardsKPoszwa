import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FlashcardProposalItem } from "../../src/components/FlashcardProposalItem";
import { type FlashcardProposalViewModel } from "../../src/components/FlashcardGenerateView";

// Mock komponentów UI z shadcn/ui
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className} data-testid="button">
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div className={className} data-testid="card-content">
      {children}
    </div>
  ),
  CardFooter: ({ children, className }: any) => (
    <div className={className} data-testid="card-footer">
      {children}
    </div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div className={className} data-testid="card-header">
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: ({ value, onChange, className }: any) => (
    <textarea value={value} onChange={(e: any) => onChange(e)} className={className} data-testid="textarea" />
  ),
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, className }: any) => (
    <span className={className} data-testid="badge">
      {children}
    </span>
  ),
}));

describe("FlashcardProposalItem", () => {
  // Przygotowanie mockowanych funkcji
  const mockOnAccept = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnReject = vi.fn();

  // Przygotowanie przykładowych danych
  const mockFlashcard: FlashcardProposalViewModel = {
    front: "Jakie jest największe jezioro w Polsce?",
    back: "Największym jeziorem w Polsce jest Śniardwy.",
    source: "ai-full",
    accepted: false,
    edited: false,
  };

  const mockAcceptedFlashcard: FlashcardProposalViewModel = {
    ...mockFlashcard,
    accepted: true,
  };

  const mockEditedFlashcard: FlashcardProposalViewModel = {
    ...mockFlashcard,
    accepted: true,
    edited: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderuje fiszkę w trybie widoku z poprawnymi danymi", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Assert
    expect(screen.getByText("Jakie jest największe jezioro w Polsce?")).toBeInTheDocument();
    expect(screen.getByText("Największym jeziorem w Polsce jest Śniardwy.")).toBeInTheDocument();
  });

  it("wyświetla odpowiednie odznaki dla zaakceptowanej fiszki", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockAcceptedFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Assert
    expect(screen.getByText("Zaakceptowana")).toBeInTheDocument();
  });

  it("wyświetla odpowiednie odznaki dla edytowanej fiszki", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockEditedFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Assert
    expect(screen.getByText("Zaakceptowana")).toBeInTheDocument();
    expect(screen.getByText("Edytowana")).toBeInTheDocument();
  });

  it("wywołuje onAccept po kliknięciu przycisku akceptacji", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={2}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act
    const approveButton = screen.getByText("Zatwierdź");
    fireEvent.click(approveButton);

    // Assert
    expect(mockOnAccept).toHaveBeenCalledWith(2);
  });

  it("wywołuje onReject po kliknięciu przycisku odrzucenia", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={3}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act
    const rejectButton = screen.getByText("Odrzuć");
    fireEvent.click(rejectButton);

    // Assert
    expect(mockOnReject).toHaveBeenCalledWith(3);
  });

  it("przechodzi do trybu edycji po kliknięciu przycisku edycji", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act
    const editButton = screen.getByText("Edytuj");
    fireEvent.click(editButton);

    // Assert
    expect(screen.getAllByTestId("textarea").length).toBeGreaterThan(0);
    expect(screen.getByText("Zapisz zmiany")).toBeInTheDocument();
    expect(screen.getByText("Anuluj")).toBeInTheDocument();
  });

  // NOWE TESTY

  it("wywołuje onAccept po kliknięciu przycisku cofnięcia akceptacji", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockAcceptedFlashcard}
        index={1}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act
    const cancelAcceptButton = screen.getByText("Cofnij akceptację");
    fireEvent.click(cancelAcceptButton);

    // Assert
    expect(mockOnAccept).toHaveBeenCalledWith(1);
  });

  it("edytuje i zapisuje zmiany po kliknięciu przycisku zapisu zmian", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act - przejście do trybu edycji
    const editButton = screen.getByText("Edytuj");
    fireEvent.click(editButton);

    // Edycja pól
    const textareas = screen.getAllByTestId("textarea");
    const frontTextarea = textareas[0];
    const backTextarea = textareas[1];

    fireEvent.change(frontTextarea, { target: { value: "Nowe pytanie" } });
    fireEvent.change(backTextarea, { target: { value: "Nowa odpowiedź" } });

    // Zapisanie zmian
    const saveButton = screen.getByText("Zapisz zmiany");
    fireEvent.click(saveButton);

    // Assert
    expect(mockOnEdit).toHaveBeenCalledWith(0, "Nowe pytanie", "Nowa odpowiedź");
  });

  it("nie pozwala na zapisanie fiszki z pustym frontem", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act - przejście do trybu edycji
    const editButton = screen.getByText("Edytuj");
    fireEvent.click(editButton);

    // Edycja pól - front jest pusty
    const textareas = screen.getAllByTestId("textarea");
    const frontTextarea = textareas[0];
    const backTextarea = textareas[1];

    fireEvent.change(frontTextarea, { target: { value: "" } });
    fireEvent.change(backTextarea, { target: { value: "Nowa odpowiedź" } });

    // Próba zapisania zmian
    const saveButton = screen.getByText("Zapisz zmiany");
    fireEvent.click(saveButton);

    // Assert
    expect(mockOnEdit).not.toHaveBeenCalled();
    // Sprawdzenie, czy pozostajemy w trybie edycji
    expect(screen.getByText("Zapisz zmiany")).toBeInTheDocument();
  });

  it("nie pozwala na zapisanie fiszki z pustym tyłem", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act - przejście do trybu edycji
    const editButton = screen.getByText("Edytuj");
    fireEvent.click(editButton);

    // Edycja pól - tył jest pusty
    const textareas = screen.getAllByTestId("textarea");
    const frontTextarea = textareas[0];
    const backTextarea = textareas[1];

    fireEvent.change(frontTextarea, { target: { value: "Nowe pytanie" } });
    fireEvent.change(backTextarea, { target: { value: "" } });

    // Próba zapisania zmian
    const saveButton = screen.getByText("Zapisz zmiany");
    fireEvent.click(saveButton);

    // Assert
    expect(mockOnEdit).not.toHaveBeenCalled();
    // Sprawdzenie, czy pozostajemy w trybie edycji
    expect(screen.getByText("Zapisz zmiany")).toBeInTheDocument();
  });

  it("nie pozwala na zapisanie fiszki z przekroczonym limitem znaków na froncie", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act - przejście do trybu edycji
    const editButton = screen.getByText("Edytuj");
    fireEvent.click(editButton);

    // Edycja pól - front przekracza limit
    const textareas = screen.getAllByTestId("textarea");
    const frontTextarea = textareas[0];
    const backTextarea = textareas[1];

    // Tworzenie tekstu przekraczającego limit (200 znaków)
    const longText = "A".repeat(201);

    fireEvent.change(frontTextarea, { target: { value: longText } });
    fireEvent.change(backTextarea, { target: { value: "Nowa odpowiedź" } });

    // Próba zapisania zmian
    const saveButton = screen.getByText("Zapisz zmiany");
    fireEvent.click(saveButton);

    // Assert
    expect(mockOnEdit).not.toHaveBeenCalled();
    // Sprawdzenie, czy pozostajemy w trybie edycji
    expect(screen.getByText("Zapisz zmiany")).toBeInTheDocument();
  });

  it("nie pozwala na zapisanie fiszki z przekroczonym limitem znaków na tyle", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act - przejście do trybu edycji
    const editButton = screen.getByText("Edytuj");
    fireEvent.click(editButton);

    // Edycja pól - tył przekracza limit
    const textareas = screen.getAllByTestId("textarea");
    const frontTextarea = textareas[0];
    const backTextarea = textareas[1];

    // Tworzenie tekstu przekraczającego limit (1000 znaków)
    const longText = "A".repeat(1001);

    fireEvent.change(frontTextarea, { target: { value: "Nowe pytanie" } });
    fireEvent.change(backTextarea, { target: { value: longText } });

    // Próba zapisania zmian
    const saveButton = screen.getByText("Zapisz zmiany");
    fireEvent.click(saveButton);

    // Assert
    expect(mockOnEdit).not.toHaveBeenCalled();
    // Sprawdzenie, czy pozostajemy w trybie edycji
    expect(screen.getByText("Zapisz zmiany")).toBeInTheDocument();
  });

  it("anuluje edycję fiszki po kliknięciu przycisku anulowania", () => {
    // Arrange
    render(
      <FlashcardProposalItem
        flashcard={mockFlashcard}
        index={0}
        onAccept={mockOnAccept}
        onEdit={mockOnEdit}
        onReject={mockOnReject}
      />
    );

    // Act - przejście do trybu edycji
    const editButton = screen.getByText("Edytuj");
    fireEvent.click(editButton);

    // Edycja pól
    const textareas = screen.getAllByTestId("textarea");
    const frontTextarea = textareas[0];
    const backTextarea = textareas[1];

    fireEvent.change(frontTextarea, { target: { value: "Nowe pytanie" } });
    fireEvent.change(backTextarea, { target: { value: "Nowa odpowiedź" } });

    // Anulowanie edycji
    const cancelButton = screen.getByText("Anuluj");
    fireEvent.click(cancelButton);

    // Assert
    expect(mockOnEdit).not.toHaveBeenCalled();
    // Sprawdzenie, czy wróciliśmy do trybu widoku
    expect(screen.getByText("Zatwierdź")).toBeInTheDocument();
    expect(screen.getByText("Edytuj")).toBeInTheDocument();
    expect(screen.getByText("Odrzuć")).toBeInTheDocument();

    // Sprawdzenie, czy tekst nie został zmieniony
    expect(screen.getByText("Jakie jest największe jezioro w Polsce?")).toBeInTheDocument();
    expect(screen.getByText("Największym jeziorem w Polsce jest Śniardwy.")).toBeInTheDocument();
  });
});
