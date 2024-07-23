import { getChoicesWithRecommendations, Greediness } from "../entropy/entropy";
import { Pokle } from "../pokle/Pokle";
import { Recommendation } from "./Recommendation";

/**
 * In Hard Mode each guess must be a valid board for the game.
 * ie. the board must respect the score of each player.
 */
export const getBoardsWithRecommendations = (
  pokle: Pokle,
  greediness: Greediness = 0.5
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
      return (outcomes["🟩🟩🟩🟩🟩"] ?? 0) / boards.length;
    },
    greediness,
  });
};

/**
 * Hard mode will return the best valid board
 */
export const getRestrictedRecommendation = (
  pokle: Pokle,
  greediness: Greediness = 0.5
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
  greediness: Greediness = 0.5
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
  greediness: Greediness = 0.5
): Recommendation => {
  const boardsWithRecommendation = getBoardsWithRecommendations(
    pokle,
    greediness
  );
  if (
    boardsWithRecommendation[boardsWithRecommendation.length - 1] === undefined
  ) {
    console.error("No more remaining boards", JSON.stringify(pokle.guesses));
  }
  return boardsWithRecommendation[boardsWithRecommendation.length - 1];
};

/**
 * Greedy mode will always return the most probable option.
 */
export const getGreedyRecommendation = (pokle: Pokle): Recommendation => {
  // greediness at 0.99 instead of 1 to choose the best entropy when same probability
  const boardsWithRecommendation = getBoardsWithRecommendations(pokle, 0.99);
  return boardsWithRecommendation[0];
};
