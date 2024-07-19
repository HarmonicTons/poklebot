import playwright from "playwright";
import { getStandardRecommendation } from "./bot/standard";
import { closeAllModals, getPlayers, submitGuess } from "./playwright/utils";
import { Pokle } from "./pokle/Pokle";

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

  for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
    const recommendation = getStandardRecommendation(pokle);

    console.log(
      "Playing:",
      recommendation.boardCards.map((card) => card.toString())
    );

    const boardPattern = await submitGuess(
      page,
      recommendation.boardCards,
      guessNumber as 1 | 2 | 3 | 4 | 5 | 6
    );

    console.log("Result:", boardPattern.join(""));

    if (boardPattern.join("") === "🟩🟩🟩🟩🟩") {
      break;
    }

    pokle.guessBoard({
      playedBoard: recommendation.boardCards,
      pattern: boardPattern,
    });
  }

  await page.screenshot({ path: "screen.png" });

  await browser.close();
};

main();
