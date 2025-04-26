import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { GenerateButton } from "@/components/GenerateButton";

describe("GenerateButton", () => {
  // Arrange - przygotowanie wspólnych elementów dla testów
  const onClickMock = vi.fn();

  // Czyszczenie po każdym teście
  afterEach(() => {
    cleanup();
    onClickMock.mockReset();
  });

  it("renderuje przycisk z domyślnym tekstem", () => {
    // Arrange
    render(<GenerateButton onClick={onClickMock} disabled={false} />);

    // Act & Assert
    expect(screen.getByText("Generuj fiszki")).toBeInTheDocument();
  });

  it('renderuje spinner i tekst "Generowanie..." w stanie ładowania', () => {
    // Arrange
    render(<GenerateButton onClick={onClickMock} disabled={false} isLoading={true} />);

    // Act & Assert
    expect(screen.getByText("Generowanie...")).toBeInTheDocument();
    expect(document.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  it("wywołuje funkcję onClick po kliknięciu", () => {
    // Arrange
    render(<GenerateButton onClick={onClickMock} disabled={false} />);
    const button = screen.getByText("Generuj fiszki");

    // Act
    fireEvent.click(button);

    // Assert
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("ma właściwość disabled gdy disabled=true", () => {
    // Arrange
    render(<GenerateButton onClick={onClickMock} disabled={true} />);
    const button = screen.getByText("Generuj fiszki");

    // Assert
    expect(button).toBeDisabled();
  });

  it("nie wywołuje funkcji onClick gdy przycisk jest disabled", () => {
    // Arrange
    render(<GenerateButton onClick={onClickMock} disabled={true} />);
    const button = screen.getByText("Generuj fiszki");

    // Act
    fireEvent.click(button);

    // Assert
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it("ma odpowiednie style", () => {
    // Arrange
    render(<GenerateButton onClick={onClickMock} disabled={false} />);
    const button = screen.getByText("Generuj fiszki");

    // Assert
    expect(button).toHaveClass("bg-blue-600");
    expect(button).toHaveClass("hover:bg-blue-700");
    expect(button).toHaveClass("text-white");
  });

  // Testy z wykorzystaniem snapshotów
  it("powinien renderować się zgodnie ze snapshotem w stanie domyślnym", () => {
    const { asFragment } = render(<GenerateButton onClick={onClickMock} disabled={false} />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <button
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 bg-blue-600 hover:bg-blue-700 text-white"
          data-slot="button"
        >
          Generuj fiszki
        </button>
      </DocumentFragment>
    `);
  });

  it("powinien renderować się zgodnie ze snapshotem w stanie ładowania", () => {
    const { asFragment } = render(<GenerateButton onClick={onClickMock} disabled={false} isLoading={true} />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <button
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 bg-blue-600 hover:bg-blue-700 text-white"
          data-slot="button"
        >
          <span
            class="flex items-center"
          >
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
            Generowanie...
          </span>
        </button>
      </DocumentFragment>
    `);
  });

  it("powinien renderować się zgodnie ze snapshotem w stanie disabled", () => {
    const { asFragment } = render(<GenerateButton onClick={onClickMock} disabled={true} />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <button
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 px-4 py-2 has-[>svg]:px-3 bg-blue-600 hover:bg-blue-700 text-white"
          data-slot="button"
          disabled=""
        >
          Generuj fiszki
        </button>
      </DocumentFragment>
    `);
  });
});
