import { test, expect } from "@playwright/test";
import { HomePage } from "./page-objects/HomePage";

test.describe("Strona główna", () => {
  test("powinna załadować się poprawnie", async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);

    // Act
    await homePage.goto();

    // Assert
    await homePage.expectPageLoaded();
  });

  test("powinna pozwalać na nawigację", async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    await homePage.goto();

    // Act & Assert - sprawdzanie czy linki nawigacyjne są widoczne
    await expect(homePage.navigationLinks).toHaveCount(1, { timeout: 5000 });
  });
});
