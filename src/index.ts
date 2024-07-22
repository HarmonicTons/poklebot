import { DateTime } from "luxon";
import playwright from "playwright";
import {
  getGreedyRecommendation,
  getRestrictedRecommendation,
  getKamikazeRecommendation,
  getRandomRecommendation,
} from "./bot/restricted";
import { Recommendation } from "./bot/Recommendation";
import { getUnrestrictedRecommendation } from "./bot/unrestricted";
import {
  closeAllModals,
  getPlayers,
  submitGuess,
  timeout,
} from "./playwright/utils";
import { Pokle } from "./pokle/Pokle";
import { Greediness } from "./entropy/entropy";

type Mode = "random" | "restricted" | "unrestricted" | "kamikaze" | "greedy";
const modeLabel: Record<Mode, string> = {
  random: "Random 🙈",
  restricted: "Restricted 😤",
  unrestricted: "Unrestricted ⛓️‍💥",
  kamikaze: "Kamikaze 💣",
  greedy: "Greedy 🤑",
};

const main = async (mode: Mode) => {
  console.info("Fetching today's Pokle...");
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://poklegame.com/");
  await closeAllModals(page);
  const players = await getPlayers(page);

  const gameId = Pokle.getGameIdFromDate(DateTime.now());
  const pokle = new Pokle(gameId, players);
  pokle.solve();

  console.info(`Playing as: ${modeLabel[mode]}`);
  console.info("Possible boards:", (pokle.remainingBoards ?? []).length);

  for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
    // increase greediness each turn
    const greediness: Greediness = 0.5 + guessNumber * 0.1;
    const nextGuess: Recommendation = (() => {
      switch (mode) {
        case "random":
          return getRandomRecommendation(pokle, greediness);
        case "restricted":
          return getRestrictedRecommendation(pokle, greediness);
        case "unrestricted":
          return getUnrestrictedRecommendation(pokle, greediness);
        case "kamikaze":
          return getKamikazeRecommendation(pokle, greediness);
        case "greedy":
          return getGreedyRecommendation(pokle);
      }
    })();

    console.info(
      `Playing: ${JSON.stringify(
        nextGuess.choice.map((card) => card.toString())
      )} - E: ${
        isNaN(nextGuess.entropy) ? "N/A" : nextGuess.entropy.toFixed(4)
      } - P: ${nextGuess.probabilityOfBeingAnswer.toFixed(4)}`
    );

    const boardPattern = await submitGuess(
      page,
      nextGuess.choice,
      guessNumber as 1 | 2 | 3 | 4 | 5 | 6
    );

    console.info("Result:", boardPattern.join(""));

    pokle.guessBoard({
      playedBoard: nextGuess.choice,
      pattern: boardPattern,
    });

    if (boardPattern.join("") === "🟩🟩🟩🟩🟩") {
      break;
    }

    await page.screenshot({ path: `screenshots/guess${guessNumber}.png` });

    console.info("Remaining boards:", (pokle.remainingBoards ?? []).length);
  }

  await page.screenshot({ path: "screenshots/victoryScreen.png" });

  await timeout(3000);

  await page.screenshot({ path: "screenshots/statsScreen.png" });

  await browser.close();

  console.info("-------");
  console.info(`Playing as: ${modeLabel[mode]}`);
  console.info(pokle.toString());
};

main("unrestricted");
