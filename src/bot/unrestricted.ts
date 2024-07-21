import {
  ChoiceWithRecommendation,
  getChoicesWithRecommendations,
} from "../entropy/entropy";
import { Card } from "../poker/Card";
import { BoardCards, FlopCards } from "../poker/Poker";
import { Pokle } from "../pokle/Pokle";

export const getFlopsWithRecommendations = (
  pokle: Pick<Pokle, "validCards" | "remainingBoards">
) => {
  const cards = pokle.validCards;
  const boards = pokle.remainingBoards;
  if (cards === null || boards === null) {
    throw new Error("Pokle must be solved first");
  }

  const flops: FlopCards[] = [];
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        flops.push([cards[i], cards[j], cards[k]]);
      }
    }
  }

  return getChoicesWithRecommendations({
    choices: flops,
    possibleAnswers: boards,
    getOutcome: (flop, board) =>
      Pokle.getFlopPattern(flop, board.slice(0, 3) as FlopCards).join(""),
    getProbabilityOfBeingAnswer: (outcomes) => {
      return (outcomes["🟩🟩🟩"] ?? 0) / boards.length;
    },
  });
};

export const getTurnsWithRecommendations = (
  pokle: Pick<Pokle, "validCards" | "remainingBoards">
) => {
  const cards = pokle.validCards;
  const boards = pokle.remainingBoards;
  if (cards === null || boards === null) {
    throw new Error("Pokle must be solved first");
  }

  // TODO: not sure about this, since in unrestricted mode we look for the flop
  // independently of the turn and river
  const autocorrect = true;

  return getChoicesWithRecommendations({
    choices: cards,
    possibleAnswers: boards,
    getOutcome: (card, board) => Pokle.getCardPattern(card, board[3]),
    getProbabilityOfBeingAnswer: (outcomes) => {
      const probabilityOfBeingAnswer =
        ((outcomes["🟩"] ?? 0) + (outcomes["🟦"] ?? 0)) / boards.length;
      return probabilityOfBeingAnswer;
    },
  });
};

export const getRiversWithRecommendations = (
  pokle: Pick<Pokle, "validCards" | "remainingBoards">
) => {
  const cards = pokle.validCards;
  const boards = pokle.remainingBoards;
  if (cards === null || boards === null) {
    throw new Error("Pokle must be solved first");
  }

  // TODO: not sure about this, since in unrestricted mode we look for the flop
  // independently of the turn and river
  const autocorrect = true;

  return getChoicesWithRecommendations({
    choices: cards,
    possibleAnswers: boards,
    getOutcome: (card, board) => Pokle.getCardPattern(card, board[4]),
    getProbabilityOfBeingAnswer: (outcomes) => {
      const probabilityOfBeingAnswer =
        ((outcomes["🟩"] ?? 0) + (outcomes["🟦"] ?? 0)) / boards.length;
      return probabilityOfBeingAnswer;
    },
  });
};

/**
 * Check that no card is duplicated in the board
 */
export const boardIsValid = (board: BoardCards): boolean => {
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      const c1 = board[i];
      const c2 = board[j];
      if (c1.isEqual(c2)) {
        return false;
      }
    }
  }
  return true;
};

const getBoardCards = (
  flopWithEntropy: ChoiceWithRecommendation<FlopCards, any>,
  turnWithEntropy: ChoiceWithRecommendation<Card, any>,
  riverWithEntropy: ChoiceWithRecommendation<Card, any>
): BoardCards => {
  return [
    ...flopWithEntropy.choice,
    turnWithEntropy.choice,
    riverWithEntropy.choice,
  ];
};

export const getUnrestrictedRecommendation = (
  pokle: Pick<Pokle, "validCards" | "remainingBoards">
) => {
  const flopsWithRecommendation = getFlopsWithRecommendations(pokle).slice(
    0,
    10
  );
  const turnsWithRecommendation = getTurnsWithRecommendations(pokle).slice(
    0,
    10
  );
  const riversWithRecommendation = getRiversWithRecommendations(pokle).slice(
    0,
    10
  );

  const firstRecommendation = {
    flop: flopsWithRecommendation[0],
    turn: turnsWithRecommendation[0],
    river: riversWithRecommendation[0],
    boardCards: getBoardCards(
      flopsWithRecommendation[0],
      turnsWithRecommendation[0],
      riversWithRecommendation[0]
    ),
  };
  const firstBoard = [
    ...firstRecommendation.flop.choice,
    firstRecommendation.turn.choice,
    firstRecommendation.river.choice,
  ] as BoardCards;
  if (boardIsValid(firstBoard)) {
    return firstRecommendation;
  }

  // look for the valid board with the highest recommendation index
  let bestRecommendation = {
    flop: flopsWithRecommendation[0],
    turn: turnsWithRecommendation[0],
    river: riversWithRecommendation[0],
    boardCards: getBoardCards(
      flopsWithRecommendation[0],
      turnsWithRecommendation[0],
      riversWithRecommendation[0]
    ),
  };

  let bestBoardRecommendationIndex = 0;
  for (const flop of flopsWithRecommendation) {
    for (const turn of turnsWithRecommendation) {
      for (const river of riversWithRecommendation) {
        const board = [...flop.choice, turn.choice, river.choice] as BoardCards;
        const boardRecommendationIndex =
          flop.recommendationIndex +
          turn.recommendationIndex +
          river.recommendationIndex;
        if (
          boardIsValid(board) &&
          boardRecommendationIndex > bestBoardRecommendationIndex
        ) {
          bestRecommendation = {
            flop,
            turn,
            river,
            boardCards: getBoardCards(flop, turn, river),
          };
          bestBoardRecommendationIndex = boardRecommendationIndex;
        }
      }
    }
  }

  if (bestBoardRecommendationIndex === 0) {
    throw new Error("Could not find a valid board");
  }

  return bestRecommendation;
};
