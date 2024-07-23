import fs from "fs/promises";
import { getRecommendation, Mode, modeLabel } from "./bot";
import { BoardCards } from "./poker/Poker";
import { Player, Pokle } from "./pokle/Pokle";

const main = async (gameId: number, mode: Mode) => {
  console.info(`Fetching Pokle #${gameId} from history...`);

  // get the game from the history
  const gamesHistory = (
    await fs.readFile("./src/history/games.json", "utf-8")
  ).toString();
  const { games } = JSON.parse(gamesHistory) as {
    games: { gameId: number; players: Player[] }[];
  };
  const game = games.find((game) => game.gameId === gameId);
  if (!game) {
    throw new Error(`Could not find game of gameId "${gameId}".`);
  }

  const pokle = Pokle.fromJSON(JSON.stringify(game));

  await pokle.solve();

  console.info(`Playing as: ${modeLabel[mode]}`);
  console.info("Possible boards:", (pokle.remainingBoards ?? []).length);

  for (let guessNumber = 1; guessNumber <= 6; guessNumber++) {
    const nextGuess = getRecommendation(mode, guessNumber, pokle);

    console.info(
      `Playing: ${JSON.stringify(
        nextGuess.choice.map((card) => card.toString())
      )} - E: ${
        isNaN(nextGuess.entropy) ? "N/A" : nextGuess.entropy.toFixed(4)
      } - P: ${nextGuess.probabilityOfBeingAnswer.toFixed(4)}`
    );

    const boardPattern = Pokle.getBoardPattern(
      nextGuess.choice,
      pokle.solution as BoardCards
    );

    console.info("Result:", boardPattern.join(""));

    pokle.guessBoard({
      playedBoard: nextGuess.choice,
      pattern: boardPattern,
    });

    if (pokle.isSolved) {
      break;
    }

    console.info("Remaining boards:", (pokle.remainingBoards ?? []).length);
  }

  console.info("-------");
  console.info(`Playing as: ${modeLabel[mode]}`);
  console.info(pokle.toString());
};

if (process.argv.length < 4) {
  console.error("Expected two arguments: gameId and mode");
  process.exit(1);
}

main(parseInt(process.argv[2]), process.argv[3] as Mode).catch(console.error);
