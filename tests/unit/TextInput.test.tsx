import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TextInput } from "@/components/TextInput";

describe("Komponent TextInput", () => {
  // Testy podstawowego renderowania
  describe("Renderowanie", () => {
    it("powinien renderować etykietę i pole tekstowe", () => {
      // Arrange
      const mockOnChange = vi.fn();

      // Act
      render(<TextInput value="" onChange={mockOnChange} />);

      // Assert
      expect(screen.getByLabelText("Tekst źródłowy")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Wprowadź tekst/)).toBeInTheDocument();
    });

    it("powinien wyświetlać przekazaną wartość", () => {
      // Arrange
      const testValue = "Przykładowy tekst";
      const mockOnChange = vi.fn();

      // Act
      render(<TextInput value={testValue} onChange={mockOnChange} />);

      // Assert
      expect(screen.getByLabelText("Tekst źródłowy")).toHaveValue(testValue);
    });
  });

  // Testy zachowania przy zmianie wartości
  describe("Obsługa zdarzeń", () => {
    it("powinien wywołać funkcję onChange przy zmianie tekstu", () => {
      // Arrange
      const mockOnChange = vi.fn();
      render(<TextInput value="" onChange={mockOnChange} />);
      const textarea = screen.getByLabelText("Tekst źródłowy");
      const newValue = "Nowy tekst";

      // Act
      fireEvent.change(textarea, { target: { value: newValue } });

      // Assert
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(newValue);
    });
  });

  // Testy walidacji
  describe("Walidacja długości tekstu", () => {
    it("powinien wyświetlić komunikat błędu gdy tekst jest za krótki", () => {
      // Arrange
      const shortText = "Krótki tekst";
      const mockOnChange = vi.fn();

      // Act
      render(<TextInput value={shortText} onChange={mockOnChange} />);

      // Assert
      expect(screen.getByText("Tekst musi zawierać co najmniej 1000 znaków.")).toBeInTheDocument();
      expect(screen.getByLabelText("Tekst źródłowy")).toHaveClass("border-red-400");
    });

    it("powinien wyświetlić komunikat błędu gdy tekst jest za długi", () => {
      // Arrange
      const longText = "a".repeat(10001);
      const mockOnChange = vi.fn();

      // Act
      render(<TextInput value={longText} onChange={mockOnChange} />);

      // Assert
      expect(screen.getByText("Tekst nie może przekraczać 10000 znaków.")).toBeInTheDocument();
      expect(screen.getByLabelText("Tekst źródłowy")).toHaveClass("border-red-400");
    });

    it("powinien mieć zielone obramowanie gdy tekst jest poprawnej długości", () => {
      // Arrange
      const validText = "a".repeat(1000);
      const mockOnChange = vi.fn();

      // Act
      render(<TextInput value={validText} onChange={mockOnChange} />);

      // Assert
      expect(screen.getByLabelText("Tekst źródłowy")).toHaveClass("border-green-400");
      expect(screen.queryByText("Tekst musi zawierać co najmniej 1000 znaków.")).not.toBeInTheDocument();
      expect(screen.queryByText("Tekst nie może przekraczać 10000 znaków.")).not.toBeInTheDocument();
    });

    it("powinien nie mieć kolorowego obramowania dla pustego pola", () => {
      // Arrange
      const mockOnChange = vi.fn();

      // Act
      render(<TextInput value="" onChange={mockOnChange} />);

      // Assert
      expect(screen.getByLabelText("Tekst źródłowy")).not.toHaveClass("border-red-400");
      expect(screen.getByLabelText("Tekst źródłowy")).not.toHaveClass("border-green-400");
    });
  });

  // Test na widoczność i zachowanie placeholdera
  describe("Placeholder", () => {
    it("powinien wyświetlać odpowiedni placeholder", () => {
      // Arrange
      const mockOnChange = vi.fn();

      // Act
      render(<TextInput value="" onChange={mockOnChange} />);

      // Assert
      expect(
        screen.getByPlaceholderText("Wprowadź tekst, minimum 1000 znaków, maksimum 10000 znaków")
      ).toBeInTheDocument();
    });
  });
});
