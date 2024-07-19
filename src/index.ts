import playwright from "playwright";
import { getStandardRecommendation } from "./bot/standard";
import { closeAllModals, getPlayers, submitGuess } from "./playwright/utils";
import { Pokle } from "./pokle/Pokle";
import { getHardModeRecommendation } from "./bot/hardMode";

const playInHardMode = false;

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

  const statsPromise = page.waitForRequest("/stats_add.php");

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

    pokle.guessBoard({
      playedBoard: nextGuess,
      pattern: boardPattern,
    });
  }

  await page.screenshot({ path: "screen.png" });

  await statsPromise;

  await browser.close();
};

main();
