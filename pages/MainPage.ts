import { expect, Page } from "@playwright/test";
import { YoutubePage } from "./YoutubePage";

export class MainPage {

    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    youtubeLink = 'Youtube';
    async open() {
        await this.page.goto('/');
    }
    getYoutubeLink() {
        return this.page.getByAltText(this.youtubeLink);
    }

    async clickYoutubeLink() {
        await this.getYoutubeLink().waitFor({ state: 'visible' });
        await this.getYoutubeLink().click();

    }
    async openYoutubeSocialMediaPage() {
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.clickYoutubeLink()
        ]);
        return new YoutubePage(newPage);
    }
}