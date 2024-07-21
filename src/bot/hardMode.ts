import { getChoicesWithRecommendations } from "../entropy/entropy";
import { Pokle } from "../pokle/Pokle";
import { Recommendation } from "./Recommendation";

/**
 * In Hard Mode each guess must be a valid board for the game.
 * ie. the board must respect the score of each player.
 */
export const getBoardsWithRecommendations = (pokle: Pokle) => {
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
  });
};

/**
 * Hard mode will return the best valid board
 */
export const getHardModeRecommendation = (pokle: Pokle): Recommendation => {
  const boardsWithEntropy = getBoardsWithRecommendations(pokle);
  return boardsWithEntropy[0];
};

/**
 * Random mode will return a random board from the remaining boards.
 */
export const getRandomRecommendation = (pokle: Pokle): Recommendation => {
  const boardsWithEntropy = getBoardsWithRecommendations(pokle);
  return boardsWithEntropy[
    Math.floor(Math.random() * boardsWithEntropy.length)
  ];
};

/**
 * Kamikaze mode will always return the worst option.
 */
export const getKamikazeRecommendation = (pokle: Pokle): Recommendation => {
  const boardsWithEntropy = getBoardsWithRecommendations(pokle);
  return boardsWithEntropy[boardsWithEntropy.length - 1];
};
