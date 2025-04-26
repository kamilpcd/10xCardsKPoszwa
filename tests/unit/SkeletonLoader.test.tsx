import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SkeletonLoader } from "../../src/components/SkeletonLoader";
import { Skeleton } from "../../src/components/ui/skeleton";

// Mock dla komponentu Skeleton
vi.mock("../../src/components/ui/skeleton", () => ({
  Skeleton: vi.fn(({ className, ...props }) => <div data-testid="skeleton-mock" className={className} {...props} />),
}));

describe("SkeletonLoader", () => {
  // Czyszczenie po każdym teście
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("powinien renderować nagłówek z informacją o generowaniu fiszek", () => {
    // Arrange
    render(<SkeletonLoader />);

    // Act & Assert
    const headerText = screen.getByText("Generowanie fiszek...");
    expect(headerText).toBeInTheDocument();
    expect(headerText.className).toContain("text-lg font-medium");
  });

  it("powinien renderować dokładnie 3 karty zaślepki", () => {
    // Arrange
    render(<SkeletonLoader />);

    // Act
    const cards = screen
      .getAllByRole("generic")
      .filter((element) =>
        element.className.includes("bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse")
      );

    // Assert
    expect(cards).toHaveLength(3);
  });

  it("powinien używać animacji pulsowania dla kart", () => {
    // Arrange
    render(<SkeletonLoader />);

    // Act
    const animatedElements = screen
      .getAllByRole("generic")
      .filter((element) => element.className.includes("animate-pulse"));

    // Assert
    expect(animatedElements.length).toBeGreaterThanOrEqual(3);
  });

  it("powinien zawierać odpowiednią liczbę komponentów Skeleton", () => {
    // Arrange
    render(<SkeletonLoader />);

    // Act
    const skeletonElements = screen.getAllByTestId("skeleton-mock");

    // Assert
    // Każda karta ma 3 Skeleton w górnej sekcji, 4 w środkowej i 3 w dolnej = 10 na kartę, 30 łącznie
    expect(skeletonElements).toHaveLength(30);
    expect(Skeleton).toHaveBeenCalledTimes(30);
  });

  it("powinien obsługiwać tryb ciemny poprzez odpowiednie klasy CSS", () => {
    // Arrange
    render(<SkeletonLoader />);

    // Act
    const cards = screen.getAllByRole("generic").filter((element) => element.className.includes("dark:bg-gray-800"));
    const dividers = screen
      .getAllByRole("generic")
      .filter((element) => element.className.includes("dark:border-gray-700"));

    // Assert
    expect(cards).toHaveLength(3);
    expect(dividers).toHaveLength(3);
  });

  // Test z wykorzystaniem snapshota
  it("powinien renderować się zgodnie ze snapshotem", () => {
    // Arrange & Act
    const { asFragment } = render(<SkeletonLoader />);

    // Assert
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="flex flex-col space-y-4"
        >
          <div
            class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Generowanie fiszek...
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
          >
            <div
              class="flex justify-between mb-4"
            >
              <div
                class="w-full"
              >
                <div
                  class="h-6 w-3/4 mb-4"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-full mb-2"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-5/6"
                  data-testid="skeleton-mock"
                />
              </div>
            </div>
            <div
              class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
            >
              <div
                class="w-full"
              >
                <div
                  class="h-5 w-2/3 mb-3"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-full mb-2"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-full mb-2"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-4/5"
                  data-testid="skeleton-mock"
                />
              </div>
            </div>
            <div
              class="flex justify-end mt-4 space-x-2"
            >
              <div
                class="h-9 w-24"
                data-testid="skeleton-mock"
              />
              <div
                class="h-9 w-24"
                data-testid="skeleton-mock"
              />
              <div
                class="h-9 w-24"
                data-testid="skeleton-mock"
              />
            </div>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
          >
            <div
              class="flex justify-between mb-4"
            >
              <div
                class="w-full"
              >
                <div
                  class="h-6 w-3/4 mb-4"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-full mb-2"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-5/6"
                  data-testid="skeleton-mock"
                />
              </div>
            </div>
            <div
              class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
            >
              <div
                class="w-full"
              >
                <div
                  class="h-5 w-2/3 mb-3"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-full mb-2"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-full mb-2"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-4/5"
                  data-testid="skeleton-mock"
                />
              </div>
            </div>
            <div
              class="flex justify-end mt-4 space-x-2"
            >
              <div
                class="h-9 w-24"
                data-testid="skeleton-mock"
              />
              <div
                class="h-9 w-24"
                data-testid="skeleton-mock"
              />
              <div
                class="h-9 w-24"
                data-testid="skeleton-mock"
              />
            </div>
          </div>
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
          >
            <div
              class="flex justify-between mb-4"
            >
              <div
                class="w-full"
              >
                <div
                  class="h-6 w-3/4 mb-4"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-full mb-2"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-5/6"
                  data-testid="skeleton-mock"
                />
              </div>
            </div>
            <div
              class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
            >
              <div
                class="w-full"
              >
                <div
                  class="h-5 w-2/3 mb-3"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-full mb-2"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-full mb-2"
                  data-testid="skeleton-mock"
                />
                <div
                  class="h-4 w-4/5"
                  data-testid="skeleton-mock"
                />
              </div>
            </div>
            <div
              class="flex justify-end mt-4 space-x-2"
            >
              <div
                class="h-9 w-24"
                data-testid="skeleton-mock"
              />
              <div
                class="h-9 w-24"
                data-testid="skeleton-mock"
              />
              <div
                class="h-9 w-24"
                data-testid="skeleton-mock"
              />
            </div>
          </div>
        </div>
      </DocumentFragment>
    `);
  });
});
