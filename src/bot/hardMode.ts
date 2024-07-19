import { getChoicesWithRecommendations } from "../entropy/entropy";
import { Pokle } from "../pokle/Pokle";

export const getBoardsWithRecommendations = (pokle: Pokle) => {
  const boards = pokle.remaingBoards;
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
  });
};

export const getHardModeRecommendation = (pokle: Pokle) => {
  const boardsWithEntropy = getBoardsWithRecommendations(pokle);
  return boardsWithEntropy[0];
};
