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

  const solutions = pokle.validBoards as BoardCards[];
  const nbGuesses = [];

  for (const solution of solutions) {
    console.info("=======");
    console.info("solution", JSON.stringify(solution));
    // console.info(`Playing as: ${modeLabel[mode]}`);
    // console.info("Possible boards:", (pokle.remainingBoards ?? []).length);

    for (let guessNumber = 1; guessNumber <= 12; guessNumber++) {
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
        solution,
        pokle.remainingBoards as BoardCards[]
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

    // console.info("-------");
    // console.info(`Playing as: ${modeLabel[mode]}`);
    // console.info(pokle.toString());

    nbGuesses.push(pokle.guesses.length);
    pokle.resetGuesses();
  }
  console.info("=======");

  const averageGuesses =
    nbGuesses.reduce((a, b) => a + b, 0) / nbGuesses.length;
  console.info(`Average number of guesses: ${averageGuesses.toFixed(2)}`);
  const medianGuesses = nbGuesses.sort((a, b) => a - b)[
    Math.floor(nbGuesses.length / 2)
  ];
  console.info(`Median number of guesses: ${medianGuesses}`);

  const guessesDistribution = nbGuesses.reduce((acc, nb) => {
    acc[nb] = (acc[nb] ?? 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  console.info("Guesses distribution", guessesDistribution);
};

if (process.argv.length < 4) {
  console.error("Expected two arguments: gameId and mode");
  process.exit(1);
}

main(parseInt(process.argv[2]), process.argv[3] as Mode).catch(console.error);
