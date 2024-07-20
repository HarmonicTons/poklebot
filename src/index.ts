import playwright from "playwright";
import { getStandardRecommendation } from "./bot/standard";
import {
  closeAllModals,
  getPlayers,
  submitGuess,
  timeout,
} from "./playwright/utils";
import { Pokle } from "./pokle/Pokle";
import { getHardModeRecommendation } from "./bot/hardMode";

const playInHardMode = true;

const main = async () => {
  console.log("Fetching today's Pokle...");
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://poklegame.com/");
  await closeAllModals(page);
  const players = await getPlayers(page);

  const pokle = new Pokle(0, players);
  pokle.solve();

  console.log(
    `Playing in ${playInHardMode ? "hard-mode 😤" : "standard-mode 🥱"}`
  );
  console.log("Possible boards:", (pokle.remaingBoards ?? []).length);

  for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
    const nextGuess = playInHardMode
      ? getHardModeRecommendation(pokle).choice
      : getStandardRecommendation(pokle).boardCards;

    console.log(
      "Playing:",
      nextGuess.map((card) => card.toString())
    );

    const boardPattern = await submitGuess(
      page,
      nextGuess,
      guessNumber as 1 | 2 | 3 | 4 | 5 | 6
    );

    console.log("Result:", boardPattern.join(""));

    if (boardPattern.join("") === "🟩🟩🟩🟩🟩") {
      break;
    }

    await page.screenshot({ path: `screenshots/guess${guessNumber}.png` });

    pokle.guessBoard({
      playedBoard: nextGuess,
      pattern: boardPattern,
    });

    console.log("Remaining boards:", (pokle.remaingBoards ?? []).length);
  }

  await page.screenshot({ path: "screenshots/victoryScreen.png" });

  await timeout(3000);

  await page.screenshot({ path: "screenshots/statsScreen.png" });

  await browser.close();
};

main();
