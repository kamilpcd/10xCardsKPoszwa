import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Przykładowy komponent do testowania
const Counter = ({ initialCount = 0 }) => {
  const [count, setCount] = React.useState(initialCount);
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(count + 1)}>Zwiększ</button>
    </div>
  );
};

describe("Przykładowy komponent Counter", () => {
  it("renderuje się z początkową wartością 0", () => {
    // Arrange
    render(<Counter />);

    // Act - nic nie robimy, tylko sprawdzamy początkowy stan

    // Assert
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("zwiększa licznik po kliknięciu przycisku", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Counter />);

    // Act
    await user.click(screen.getByRole("button", { name: /zwiększ/i }));

    // Assert
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });
});
