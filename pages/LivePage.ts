import { expect, Locator, Page } from "@playwright/test";

export class LivePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    eventsContainer = '[data-role="events-container"] > div';
    eventFavoriteStarIcon = '[data-role="event-favorite-star-icon"]';
    favoritesLinkText = '[data-role="sports-favorites-link-text"]';
    lineoutApiUrl = 'https://www.favbet.ua/service/lineout/frontend_api2/';
    noFavoutiteGames = `//span[text()="You don't have any favorite events yet."]`;
    liveGameLinks = 'a[data-role^="sport-id"]';

    async open() {
        await this.page.goto('/en/live/all/');
    }

    async addRandomLiveGameToFavorites(quantity: number) {

        let liveGameLinks = await this.getLiveGameLinks();

        while (quantity > 0) {
            let randomNumber = Math.floor(Math.random() * liveGameLinks.length);
            let randomGameLink = await liveGameLinks.splice(randomNumber, 1);

            console.log(`Game ${randomGameLink} was added to favourites.`)
            await this.chooseSport(randomGameLink);
            const gamesAddToFavouriteButton = await this.eventFavouriteStarLocator(0);
            await expect(gamesAddToFavouriteButton).toHaveAttribute('fill', 'none');
            await gamesAddToFavouriteButton.click();
            await expect(gamesAddToFavouriteButton).toHaveAttribute('fill', '#F2C94C');
            quantity--;
        }

    }

    async addGameToFavorites(eventIndex: number, game: string) {
        await this.chooseSport(game);
        console.log('added');
        const gamesAddToFavouriteButton = await this.eventFavouriteStarLocator(eventIndex);
        await expect(gamesAddToFavouriteButton).toHaveAttribute('fill', 'none');
        await gamesAddToFavouriteButton.click();
        await expect(gamesAddToFavouriteButton).toHaveAttribute('fill', '#F2C94C');
    }

    async getFavorites() {
        return this.page.locator(`${this.eventsContainer} ${this.eventFavoriteStarIcon}`);
    }

    async removeFirstGameFromFavourites() {
         await this.removeGameFromFavorites(0);
    }

    async removeGameFromFavorites(eventIndex: number) {
        const removeGameFromFavoritesButton = await this.eventFavouriteStarLocator(eventIndex);

        await removeGameFromFavoritesButton.click();
        try {
            await this.page.waitForResponse(this.lineoutApiUrl, { timeout: 2000 });
        }
        catch (e) {
            console.log('All favourites games are removed');
        }

    }

    async removeAllGamesFromFavourite() {
        const responsePromise = this.page.waitForResponse(this.lineoutApiUrl);
        await this.clickOnFavoritesButton();
        await this.page.waitForTimeout(2000);
        await responsePromise;
        let favouriteListStarts = await this.page.locator(this.eventsContainer).locator(this.eventFavoriteStarIcon).count();
        while (favouriteListStarts > 0) {
            await this.removeGameFromFavorites(0);
            favouriteListStarts--;
            console.log(favouriteListStarts);
        }
    }

    async eventFavouriteStarLocator(eventIndex: number, gameTitleFilter?: string): Promise<Locator> {
        if (gameTitleFilter) {
            return this.page
                .locator(this.eventsContainer, { hasText: gameTitleFilter })
                .locator(this.eventFavoriteStarIcon)
                .nth(eventIndex);
        } else {
            return this.page
                .locator(`${this.eventsContainer} ${this.eventFavoriteStarIcon}`)
                .nth(eventIndex);
        }
    }

    async clickOnFavoritesButton() {
        await this.page.locator(this.favoritesLinkText).click();
    }

    async verifyNoFavouriteGames() {
        await expect(this.page.locator(this.noFavoutiteGames)).toBeVisible();

    }

    async chooseSport(game?: any) {
        const result = this.page.locator(`${this.liveGameLinks}[href="${game}"]`);
        await result.click();
    }


    async getLiveGameLinks() {
        await this.page.waitForTimeout(3000);
        let elements = await this.page.locator(this.liveGameLinks).all()

        let hrefs = await Promise.all(elements.map(el => el.getAttribute('href')));
        return hrefs.filter(href => href && href.includes('/live'));
    }
}
