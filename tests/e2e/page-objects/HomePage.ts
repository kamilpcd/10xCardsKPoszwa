import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly navigationLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1");
    this.navigationLinks = page.locator("nav a");
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.page).toHaveTitle(/FiszkiAIkp/);
  }

  async navigateTo(linkText: string) {
    await this.navigationLinks.filter({ hasText: linkText }).click();
  }
}
