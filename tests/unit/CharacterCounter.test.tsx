import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CharacterCounter } from "../../src/components/CharacterCounter";

describe("CharacterCounter", () => {
  // Po każdym teście czyścimy DOM
  afterEach(() => {
    cleanup();
  });

  // Test dla count = 0 (szary kolor)
  it("powinien wyświetlać szary tekst kiedy count = 0", () => {
    render(<CharacterCounter count={0} />);

    const counter = screen.getByText("0 / 10000 znaków");
    expect(counter.className).toContain("text-gray-500");
    expect(screen.queryByText(/potrzeba jeszcze/)).not.toBeInTheDocument();
  });

  // Test dla 0 < count < 1000 (czerwony kolor + dodatkowa informacja)
  it("powinien wyświetlać czerwony tekst i informację o brakujących znakach kiedy 0 < count < 1000", () => {
    const count = 500;
    render(<CharacterCounter count={count} />);

    const counter = screen.getByText(`${count} / 10000 znaków`);
    expect(counter.className).toContain("text-red-500");

    const infoText = screen.getByText(`(potrzeba jeszcze ${1000 - count} znaków)`);
    expect(infoText).toBeInTheDocument();
  });

  // Test dla 1000 <= count <= 10000 (zielony kolor)
  it("powinien wyświetlać zielony tekst kiedy 1000 <= count <= 10000", () => {
    const count = 5000;
    render(<CharacterCounter count={count} />);

    const counter = screen.getByText(`${count} / 10000 znaków`);
    expect(counter.className).toContain("text-green-500");
    expect(screen.queryByText(/potrzeba jeszcze/)).not.toBeInTheDocument();
  });

  // Test dla count > 10000 (czerwony kolor)
  it("powinien wyświetlać czerwony tekst kiedy count > 10000", () => {
    const count = 12000;
    render(<CharacterCounter count={count} />);

    const counter = screen.getByText(`${count} / 10000 znaków`);
    expect(counter.className).toContain("text-red-500");
    expect(screen.queryByText(/potrzeba jeszcze/)).not.toBeInTheDocument();
  });

  // Test sprawdzający wszystkie graniczne wartości dla getCounterColor
  it("powinien zwracać prawidłowe klasy kolorów dla różnych wartości count", () => {
    // Arrange
    const testCases = [
      { count: 0, expectedClass: "text-gray-500" },
      { count: 1, expectedClass: "text-red-500" },
      { count: 999, expectedClass: "text-red-500" },
      { count: 1000, expectedClass: "text-green-500" },
      { count: 5000, expectedClass: "text-green-500" },
      { count: 10000, expectedClass: "text-green-500" },
      { count: 10001, expectedClass: "text-red-500" },
    ];

    // Act & Assert
    testCases.forEach(({ count, expectedClass }) => {
      const { unmount } = render(<CharacterCounter count={count} />);
      const element = screen.getByText(new RegExp(`${count} / 10000 znaków`));
      expect(element.className).toContain(expectedClass);
      // Czyścimy po każdym renderze
      unmount();
    });
  });

  // Test z wykorzystaniem spy na metodę
  it("powinien renderować dodatkową informację o brakujących znakach tylko w odpowiednim zakresie", () => {
    // Testujemy różne przypadki graniczne
    const testCases = [
      { count: 0, shouldShowInfo: false },
      { count: 1, shouldShowInfo: true },
      { count: 999, shouldShowInfo: true },
      { count: 1000, shouldShowInfo: false },
      { count: 10000, shouldShowInfo: false },
    ];

    testCases.forEach(({ count, shouldShowInfo }) => {
      const { unmount } = render(<CharacterCounter count={count} />);

      const infoElement = screen.queryByText(new RegExp(`potrzeba jeszcze ${1000 - count} znaków`));

      if (shouldShowInfo) {
        expect(infoElement).toBeInTheDocument();
      } else {
        expect(infoElement).not.toBeInTheDocument();
      }

      unmount();
    });
  });

  // Testy z wykorzystaniem snapshotów
  it("powinien renderować się zgodnie ze snapshotem dla count=0", () => {
    const { asFragment } = render(<CharacterCounter count={0} />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="text-sm font-medium text-gray-500"
        >
          0 / 10000 znaków
        </div>
      </DocumentFragment>
    `);
  });

  it("powinien renderować się zgodnie ze snapshotem dla count=500", () => {
    const { asFragment } = render(<CharacterCounter count={500} />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="text-sm font-medium text-red-500"
        >
          500 / 10000 znaków
          <span
            class="ml-2"
          >
            (potrzeba jeszcze 500 znaków)
          </span>
        </div>
      </DocumentFragment>
    `);
  });

  it("powinien renderować się zgodnie ze snapshotem dla count=5000", () => {
    const { asFragment } = render(<CharacterCounter count={5000} />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="text-sm font-medium text-green-500"
        >
          5000 / 10000 znaków
        </div>
      </DocumentFragment>
    `);
  });

  it("powinien renderować się zgodnie ze snapshotem dla count=12000", () => {
    const { asFragment } = render(<CharacterCounter count={12000} />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="text-sm font-medium text-red-500"
        >
          12000 / 10000 znaków
        </div>
      </DocumentFragment>
    `);
  });
});
