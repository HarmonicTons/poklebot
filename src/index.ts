import playwright from "playwright";
import { getUnrestrictedRecommendation } from "./bot/unrestricted";
import {
  closeAllModals,
  getPlayers,
  submitGuess,
  timeout,
} from "./playwright/utils";
import { Pokle } from "./pokle/Pokle";
import {
  getHardModeRecommendation,
  getKamikazeRecommendation,
  getRandomRecommendation,
} from "./bot/hardMode";
import { Recommendation } from "./bot/Recommendation";
import { Greediness } from "./entropy/entropy";

type Mode = "random" | "hard-mode" | "unrestricted" | "kamikaze";
const modeLabel: Record<Mode, string> = {
  random: "random mode 🙈",
  "hard-mode": "hard mode 😤",
  unrestricted: "unrestricted mode 🕵️‍♂️",
  kamikaze: "kamikaze mode 💣",
};

const main = async (mode: Mode, greediness: Greediness) => {
  console.info("Fetching today's Pokle...");
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://poklegame.com/");
  await closeAllModals(page);
  const players = await getPlayers(page);

  const pokle = new Pokle(0, players);
  pokle.solve();

  console.info(`Playing in ${modeLabel[mode]}`);
  console.info("Possible boards:", (pokle.remainingBoards ?? []).length);

  for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
    const nextGuess: Recommendation = (() => {
      switch (mode) {
        case "random":
          return getRandomRecommendation(pokle, greediness);
        case "hard-mode":
          return getHardModeRecommendation(pokle, greediness);
        case "unrestricted":
          return getUnrestrictedRecommendation(pokle, greediness);
        case "kamikaze":
          return getKamikazeRecommendation(pokle, greediness);
      }
    })();

    console.info(
      `Playing: ${JSON.stringify(
        nextGuess.choice.map((card) => card.toString())
      )} - E: ${nextGuess.entropy.toFixed(
        4
      )} - P: ${nextGuess.probabilityOfBeingAnswer.toFixed(4)}`
    );

    const boardPattern = await submitGuess(
      page,
      nextGuess.choice,
      guessNumber as 1 | 2 | 3 | 4 | 5 | 6
    );

    console.info("Result:", boardPattern.join(""));

    if (boardPattern.join("") === "🟩🟩🟩🟩🟩") {
      break;
    }

    await page.screenshot({ path: `screenshots/guess${guessNumber}.png` });

    pokle.guessBoard({
      playedBoard: nextGuess.choice,
      pattern: boardPattern,
    });

    console.info("Remaining boards:", (pokle.remainingBoards ?? []).length);
  }

  await page.screenshot({ path: "screenshots/victoryScreen.png" });

  await timeout(3000);

  await page.screenshot({ path: "screenshots/statsScreen.png" });

  await browser.close();

  console.info("-------");
  console.info(pokle.toString());
};

main("hard-mode", 0.5);
