import playwright from "playwright";
import { getPlayers } from "./utils";

const main = async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://poklegame.com/");
  const players = await getPlayers(page);
  console.log(players);

  await browser.close();
};

main();
