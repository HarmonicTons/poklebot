import { getChoicesWithRecommendations } from "../entropy/entropy";
import { BoardCards } from "../poker/Poker";
import { Pokle } from "../pokle/Pokle";

export const getBoardsWithRecommendations = (boards: BoardCards[]) => {
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

export const getHardModeRecommendation = (boards: BoardCards[]) => {
  const boardsWithEntropy = getBoardsWithRecommendations(boards);
  return boardsWithEntropy[0];
};
