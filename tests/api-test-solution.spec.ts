import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const enum BonusesAPI {
  BET_INSURANCE = "getriskfreelist",
  FREE_SPINS = "getfreespinlist"
}

const enum instantGameOperations {
  getFavouriteInstantGames = "get",
  addInstantGameToFavorites = "save",
  removeInstantGameFromFavorites = "delete"
}
const username = process.env.USER;
const password = process.env.PASS;

test.describe.serial('Favbest tests', () => {

  let PHPSESSID: string;

  test.beforeAll(async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    let loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.loginWithCredentials(username, password);
    await expect(page).toHaveURL('https://www.favbet.ua/uk/casino/');
    PHPSESSID = (await context.cookies()).filter(cookie => cookie.name === 'PHPSESSID')[0].value;
    console.log(`PHPSESSID: ${PHPSESSID}`);

  });

  test('Test 1 - Bonuses API', async () => {

    await getBonuses(BonusesAPI.FREE_SPINS, PHPSESSID)
      .then(bonuses => { return bonuses.length })
      .then(count => expect(count).toBe(2));

    await getBonuses(BonusesAPI.BET_INSURANCE, PHPSESSID)
      .then(bonuses => { return bonuses.length })
      .then(count => expect(count).toBe(0));
  });

  test('Test 2 - Instant Games Favorites API', async () => {

    await performInstantGameFavoritesOperation(PHPSESSID, instantGameOperations.removeInstantGameFromFavorites, 'mines-favbet');

    let gamesCount = await performInstantGameFavoritesOperation(PHPSESSID, instantGameOperations.getFavouriteInstantGames)
      .then(games => { return games.length });

    await performInstantGameFavoritesOperation(PHPSESSID, instantGameOperations.addInstantGameToFavorites, 'mines-favbet');

    await performInstantGameFavoritesOperation(PHPSESSID, instantGameOperations.getFavouriteInstantGames)
      .then(games => { return games.length })
      .then(count => expect(count).toBe(gamesCount+1));

    await performInstantGameFavoritesOperation(PHPSESSID, instantGameOperations.removeInstantGameFromFavorites, 'mines-favbet');

    await performInstantGameFavoritesOperation(PHPSESSID, instantGameOperations.getFavouriteInstantGames)
      .then(games => { return games.length })
      .then(count => expect(count).toBe(gamesCount));


  });

});

async function getBonuses(bonus: BonusesAPI, PHPSESSID: string) {
  let result = await fetch(`https://www.favbet.ua/accounting/api/crm_roxy/${bonus}`, {
    "headers": {
      "accept": "*/*",
      "content-type": "application/json",
      "x-device-id": "2d6362068a392b1a9ea5e54e11a462f6",
      "cookie": `PHPSESSID=${PHPSESSID};`,
    },
    "body": "state_list%5B%5D=5&state_list%5B%5D=10&state_list%5B%5D=100&state_list%5B%5D=0&state_list%5B%5D=-1&state_list%5B%5D=1&page=1&page_size=10&platform=desktop",
    "method": "POST"
  });

  let data = await result.json();

  return data.response.response.map((item: any) => {
    return item.freespinId;
  });


}

async function performInstantGameFavoritesOperation(PHPSESSID: string, operation: instantGameOperations, gameId?: string) {

  let result = await fetch(`https://www.favbet.ua/service/pds/v1/favorites/${operation}`, {
    "headers": {
      "accept": "*/*",
      "content-type": "application/json",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "x-device-id": "2d6362068a392b1a9ea5e54e11a462f6",
      "cookie": `PHPSESSID=${PHPSESSID};`,
      "Referer": "https://www.favbet.ua/en/instant-games/"
    },
    "body": `{\"casino_games\":[{\"id\":\"${gameId}\"}]}`,
    "method": "POST"
  });

  let data = await result.json();

  return operation == instantGameOperations.addInstantGameToFavorites ? [] : data.data.casino_games;
}