import { getChoicesWithRecommendations, Greediness } from "../entropy/entropy";
import { Pokle } from "../pokle/Pokle";
import { Recommendation } from "./Recommendation";

/**
 * In Hard Mode each guess must be a valid board for the game.
 * ie. the board must respect the score of each player.
 */
export const getBoardsWithRecommendations = (
  pokle: Pokle,
  greediness: Greediness
) => {
  const boards = pokle.remainingBoards;
  if (boards === null) {
    throw new Error("Pokle must be solved first");
  }

  return getChoicesWithRecommendations({
    choices: boards,
    possibleAnswers: boards,
    getOutcome: (board1, board2) =>
      Pokle.getBoardPattern(board1, board2).join(""),
    getProbabilityOfBeingAnswer: (outcomes) => {
      const solution = outcomes["🟩🟩🟩🟩🟩"] ?? 0;
      const solutionsWithAutocorrect =
        (outcomes["🟩🟩🟩🟦🟩"] ?? 0) +
        (outcomes["🟩🟩🟩🟩🟦"] ?? 0) +
        (outcomes["🟩🟩🟩🟦🟦"] ?? 0);
      return (solution + solutionsWithAutocorrect) / boards.length;
    },
    greediness,
  });
};

/**
 * Hard mode will return the best valid board
 */
export const getHardModeRecommendation = (
  pokle: Pokle,
  greediness: Greediness
): Recommendation => {
  const boardsWithRecommendation = getBoardsWithRecommendations(
    pokle,
    greediness
  );
  return boardsWithRecommendation[0];
};

/**
 * Random mode will return a random board from the remaining boards.
 */
export const getRandomRecommendation = (
  pokle: Pokle,
  greediness: Greediness
): Recommendation => {
  const boardsWithRecommendation = getBoardsWithRecommendations(
    pokle,
    greediness
  );
  return boardsWithRecommendation[
    Math.floor(Math.random() * boardsWithRecommendation.length)
  ];
};

/**
 * Kamikaze mode will always return the worst option.
 */
export const getKamikazeRecommendation = (
  pokle: Pokle,
  greediness: Greediness
): Recommendation => {
  const boardsWithRecommendation = getBoardsWithRecommendations(
    pokle,
    greediness
  );
  return boardsWithRecommendation[boardsWithRecommendation.length - 1];
};
