import { expect, Page } from "@playwright/test";

export class YoutubePage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    searchButton = '#icon-button';
    searchField = '#input #container input'
    searchResults = '#contents #video-title'

    async open() {
        await this.page.goto('/');
    }
    acceptAllCookiesButton() {
        return this.page.getByRole('button', { name: 'Accept all' });
    }

    async searchVideoInChannel(videoName: string) {
        await this.page.locator(this.searchButton).getByRole('button', { name: 'Search' }).click();
        await this.page.locator(this.searchField).fill(videoName);
        await this.page.keyboard.press('Enter');
        let videoTiles = await this.page.locator(this.searchResults);
        return videoTiles;
    }

}