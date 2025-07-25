import fs from "fs/promises";
import { DateTime } from "luxon";
import playwright from "playwright";
import { getRecommendation, Mode, modeLabel } from "./bot";
import { postGameOnDiscord } from "./discord/postMessage";
import {
  closeAllModals,
  getPlayers,
  submitGuess,
  timeout,
} from "./playwright/utils";
import { Player, Pokle } from "./pokle/Pokle";
import { Card } from "./poker/Card";

const main = async (mode: Mode, debug = false, sendToDiscord = true) => {
  console.info("Fetching today's Pokle...");
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://poklegame.com/");
  await closeAllModals(page);
  const players = await getPlayers(page);

  const gameId = Pokle.getGameIdFromDate(DateTime.now());
  const pokle = new Pokle(gameId, players);
  await pokle.solve();

  console.info(`Playing as: ${modeLabel[mode]}`);
  console.info("Possible boards:", (pokle.remainingBoards ?? []).length);

  for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
    const nextGuess = await getRecommendation(mode, guessNumber, pokle);

    console.info(
      `Playing: ${JSON.stringify(
        nextGuess.choice.map((card: Card) => card.toString())
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

    if (pokle.isSolved) {
      break;
    }

    if (debug) {
      await page.screenshot({ path: `screenshots/guess${guessNumber}.png` });
    }

    console.info("Remaining boards:", (pokle.remainingBoards ?? []).length);
  }
  if (debug) {
    await page.screenshot({ path: "screenshots/victoryScreen.png" });
    await timeout(3000);
    await page.screenshot({ path: "screenshots/statsScreen.png" });
  }
  await browser.close();

  // add the game to the history
  const gamesHistory = (
    await fs.readFile("./src/history/games.json", "utf-8")
  ).toString();
  const { games } = JSON.parse(gamesHistory) as {
    games: { gameId: number; players: Player[] }[];
  };
  const prevGame = games.find((game) => game.gameId === gameId);
  if (!prevGame) {
    games.push(pokle.toJSON());
    await fs.writeFile("./src/history/games.json", JSON.stringify({ games }));
  }

  if (sendToDiscord) {
    await postGameOnDiscord(pokle);
    console.info("Posted game to Discord");
  }
};

if (process.argv.length < 3) {
  console.error("Expected one argument: mode");
  process.exit(1);
}

main(process.argv[2] as Mode).catch(console.error);
