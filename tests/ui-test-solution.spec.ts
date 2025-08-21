// test-file.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage';
import { LivePage } from '../pages/LivePage';
import { SettingsPage } from '../pages/SettingsPage';

const videoName = 'FAVBET | Support Those Who Support Us: ENGLAND | 2022 FIFA World Cup';

test.describe.serial('Favbest tests', () => {

  const username = process.env.USER;
  const password = process.env.PASS;

  let loginPage;
  let mainPage;
  let livePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginWithCredentials(username, password);
    await expect(page).toHaveURL('/uk/casino/');
  });

  test('Test 1 - Favorites Management', async ({ page }) => {

    livePage = new LivePage(page);
    await livePage.open();
    await expect(page).toHaveURL('/en/live/all/');

    await livePage.getLiveGameLinks();
    await livePage.removeAllGamesFromFavourite();

    await livePage.addRandomLiveGameToFavorites(4);


    await livePage.clickOnFavoritesButton();
    await page.reload();
    await expect(page).toHaveURL('/en/live/favorites/');

    await expect(await livePage.getFavorites()).toHaveCount(4);

    await livePage.removeFirstGameFromFavourites();
    await livePage.removeFirstGameFromFavourites();

    await expect(await livePage.getFavorites()).toHaveCount(2);

    await livePage.removeFirstGameFromFavourites();
    await livePage.removeFirstGameFromFavourites();

    await livePage.verifyNoFavouriteGames();

  });

  test('YouTube Social Network Integration', async ({ page }) => {

    loginPage = new LoginPage(page);
    mainPage = new MainPage(page);

    let youtubePage = await mainPage.openYoutubeSocialMediaPage();

    await youtubePage.acceptAllCookiesButton().click();
    await expect(youtubePage.page).toHaveURL('https://www.youtube.com/@favbetua');

    // Search video
    let searchResults = await youtubePage.searchVideoInChannel(videoName);
    await expect(searchResults.getByText(videoName)).toBeVisible();

  });

  test('Test 3 - Settings Configuration', async ({ page }) => {

    let settingsPage = new SettingsPage(page);
    await settingsPage.open();
    await expect(page).toHaveURL('uk/personal-office/settings/');

    // Check language change
    await settingsPage.verifyLanguageIs('Українська');
    await expect(page.locator('[data-role="settings-wrapper"]')).toHaveScreenshot('Ukrainian.png');
    await settingsPage.changeLanguage('Англійська');
    await settingsPage.verifyLanguageIs('English');
    await expect(page.locator('[data-role="settings-wrapper"]')).toHaveScreenshot('English.png');

    // Check dark/light mode
    await settingsPage.verifyThemeIs('dark');
    await expect(page.locator('[data-role="settings-wrapper"]')).toHaveScreenshot('Settings-dark.png');
    await page.getByText('Light').click();
    await settingsPage.verifyThemeIs('light');
    await expect(page.locator('[data-role="settings-wrapper"]')).toHaveScreenshot('Settings-light.png');

  });
}); 