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
import { getRandomRecommendation } from "./bot/random";

type Mode = "random" | "hard-mode" | "standard";
const modeLabel: Record<Mode, string> = {
  random: "random mode 🙈",
  "hard-mode": "hard mode 😤",
  standard: "standard mode 🥱",
};

const main = async (mode: Mode) => {
  console.log("Fetching today's Pokle...");
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://poklegame.com/");
  await closeAllModals(page);
  const players = await getPlayers(page);

  const pokle = new Pokle(0, players);
  pokle.solve();

  console.log(`Playing in ${modeLabel[mode]}`);
  console.log("Possible boards:", (pokle.remaingBoards ?? []).length);

  for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
    const nextGuess = (() => {
      switch (mode) {
        case "random":
          return getRandomRecommendation(pokle);
        case "hard-mode":
          return getHardModeRecommendation(pokle).choice;
        case "standard":
          return getStandardRecommendation(pokle).boardCards;
      }
    })();

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

main("hard-mode");
