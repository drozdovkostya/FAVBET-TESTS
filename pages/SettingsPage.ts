import { expect, Page } from "@playwright/test";

const languageDropdown = '[data-role="language-flag-icon"]'

export class SettingsPage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto('/personal-office/settings/');
    }

    async changeLanguage(language: string) {

        await this.page.locator(languageDropdown).click();
        expect(this.page.getByText(language)).toBeVisible();
        await this.page.getByText(language).click();

    }
    async verifyThemeIs(mode: string) {
        expect(await this.page.locator(`[class='favbet ${mode}']`)).toBeAttached();
    }

    async verifyLanguageIs(language: string) {
        expect(await this.page.getByText(language)).toBeVisible({ timeout: 5000 });
    }

}