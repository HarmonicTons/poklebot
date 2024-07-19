import playwright from "playwright";
import { getPlayers } from "./utils";
import fs from "fs/promises";

const main = async () => {
  const jsonString = (await fs.readFile("./src/games.json")).toString();
  const games = JSON.parse(jsonString);

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://poklegame.com/");
  const players = await getPlayers(page);
  console.log(players);

  games.games.push({
    id: games.games[games.games.length - 1].id + 1,
    players,
  });
  const newJsonString = JSON.stringify(games, null, 2);
  await fs.writeFile("./src/games.json", newJsonString);

  await browser.close();
};

main();
