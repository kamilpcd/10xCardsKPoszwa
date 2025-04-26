import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorNotification } from "../../src/components/ErrorNotification";

describe("ErrorNotification", () => {
  // Test: Komponent nie powinien się renderować gdy wiadomość jest pusta
  it("nie powinien się renderować, gdy message jest pusty", () => {
    // Arrange
    render(<ErrorNotification message="" />);

    // Act & Assert
    expect(screen.queryByText("Błąd")).not.toBeInTheDocument();
  });

  // Test: Komponent powinien renderować się poprawnie z komunikatem
  it("powinien renderować alert z komunikatem błędu", () => {
    // Arrange
    const testMessage = "Wystąpił błąd podczas przetwarzania danych";

    // Act
    render(<ErrorNotification message={testMessage} />);

    // Assert
    expect(screen.getByText("Błąd")).toBeInTheDocument();
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  // Test: Komponent powinien mieć odpowiednie style dla wariantu destructive
  it("powinien mieć odpowiednie klasy stylów dla trybu destructive", () => {
    // Arrange
    const testMessage = "Błąd krytyczny";

    // Act
    const { container } = render(<ErrorNotification message={testMessage} />);
    const alertElement = container.firstChild;

    // Assert
    expect(alertElement).toHaveClass("bg-red-50");
    expect(alertElement).toHaveClass("dark:bg-red-900/20");
    expect(alertElement).toHaveClass("border-red-300");
    expect(alertElement).toHaveClass("dark:border-red-800");
  });

  // Test: Sprawdzenie czy ikona ostrzeżenia jest renderowana
  it("powinien renderować ikonę ostrzeżenia", () => {
    // Arrange
    const testMessage = "Błąd serwera";

    // Act
    const { container } = render(<ErrorNotification message={testMessage} />);

    // Assert
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("text-red-500");
  });

  // Test: Sprawdzenie czy tytuł i opis mają odpowiednie kolory
  it("powinien renderować tytuł i opis z odpowiednimi klasami kolorów", () => {
    // Arrange
    const testMessage = "Nie udało się zapisać danych";

    // Act
    render(<ErrorNotification message={testMessage} />);

    // Assert
    const title = screen.getByText("Błąd");
    expect(title).toHaveClass("text-red-800");
    expect(title).toHaveClass("dark:text-red-300");

    const description = screen.getByText(testMessage);
    expect(description).toHaveClass("text-red-700");
    expect(description).toHaveClass("dark:text-red-200");
  });

  // Test: Scenariusz GEN-005 - Obsługa błędu podczas generowania fiszek (z planu testów)
  it("powinien wyświetlić komunikat błędu API generowania fiszek", () => {
    // Arrange
    const apiErrorMessage = "Błąd komunikacji z API AI. Spróbuj ponownie później.";

    // Act
    render(<ErrorNotification message={apiErrorMessage} />);

    // Assert
    expect(screen.getByText("Błąd")).toBeInTheDocument();
    expect(screen.getByText(apiErrorMessage)).toBeInTheDocument();

    // Dodatkowe sprawdzenie, czy komunikat jest poprawnie wyświetlany w sekcji opisu
    const description = screen.getByText(apiErrorMessage);
    expect(description).toHaveAttribute("data-slot", "alert-description");
  });

  // Test: Scenariusz SAVE-005 - Obsługa błędu podczas zapisywania fiszek (z planu testów)
  it("powinien wyświetlić komunikat błędu podczas zapisywania fiszek", () => {
    // Arrange
    const errorMessages = [
      "Błąd walidacji generation_id. Nieprawidłowy identyfikator generacji.",
      "Błąd podczas zapisywania fiszek. Spróbuj ponownie później.",
      "Błąd serwera (500). Skontaktuj się z administratorem.",
    ];

    // Act & Assert - testujemy różne możliwe komunikaty błędów
    errorMessages.forEach((errorMsg) => {
      const { unmount } = render(<ErrorNotification message={errorMsg} />);

      // Sprawdzamy czy tytuł i konkretny komunikat błędu są wyświetlane
      expect(screen.getByText("Błąd")).toBeInTheDocument();
      expect(screen.getByText(errorMsg)).toBeInTheDocument();

      // Czyścimy po każdym render
      unmount();
    });
  });

  // Test: Sprawdzenie dostępności (accessibility) - sprawdzenie atrybutów ARIA
  it("powinien posiadać poprawne atrybuty ARIA dla dostępności", () => {
    // Arrange
    const testMessage = "Błąd dostępności";

    // Act
    const { container } = render(<ErrorNotification message={testMessage} />);
    const alert = container.firstChild;

    // Assert
    expect(alert).toHaveAttribute("role", "alert");
    expect(alert).toHaveAttribute("data-slot", "alert");

    // Sprawdzenie czy alert jest dobrze oznaczony dla czytników ekranowych
    const title = screen.getByText("Błąd");
    expect(title).toHaveAttribute("data-slot", "alert-title");

    const description = screen.getByText(testMessage);
    expect(description).toHaveAttribute("data-slot", "alert-description");
  });

  // Test: Snapshot test dla wyglądu komponentu
  it("powinien renderować się zgodnie ze snapshotem", () => {
    // Arrange & Act
    const { asFragment } = render(<ErrorNotification message="Test błędu" />);

    // Assert
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 text-destructive [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800"
          data-slot="alert"
          role="alert"
        >
          <svg
            class="h-5 w-5 text-red-500"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <line
              x1="12"
              x2="12"
              y1="8"
              y2="12"
            />
            <line
              x1="12"
              x2="12.01"
              y1="16"
              y2="16"
            />
          </svg>
          <div
            class="col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight text-red-800 dark:text-red-300 ml-2"
            data-slot="alert-title"
          >
            Błąd
          </div>
          <div
            class="col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed text-red-700 dark:text-red-200 ml-2"
            data-slot="alert-description"
          >
            Test błędu
          </div>
        </div>
      </DocumentFragment>
    `);
  });
});
