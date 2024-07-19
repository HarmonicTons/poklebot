import {
  ChoiceWithRecommendation,
  getChoicesWithRecommendations,
} from "../entropy/entropy";
import { Card } from "../poker/Card";
import { BoardCards, FlopCards } from "../poker/Poker";
import { FlopPattern, Pokle } from "../pokle/Pokle";

export const getFlopsWithRecommendations = (pokle: Pokle) => {
  const cards = pokle.validCards;
  const boards = pokle.remaingBoards;
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
      Pokle.getFlopPattern(flop, board.slice(0, 3) as FlopCards)
        // flop order does not matter
        .sort()
        .join(""),
    getProbabilityOfBeingAnswer: (outcomes) => {
      return (outcomes["🟩🟩🟩"] ?? 0) / boards.length;
    },
  });
};

export const getTurnsWithRecommendations = (pokle: Pokle) => {
  const cards = pokle.validCards;
  const boards = pokle.remaingBoards;
  if (cards === null || boards === null) {
    throw new Error("Pokle must be solved first");
  }

  return getChoicesWithRecommendations({
    choices: cards,
    possibleAnswers: boards,
    getOutcome: (card, board) => Pokle.getCardPattern(card, board[3]),
    getProbabilityOfBeingAnswer: (outcomes) => {
      return (outcomes["🟩"] ?? 0) / boards.length;
    },
  });
};

export const getRiversWithRecommendations = (pokle: Pokle) => {
  const cards = pokle.validCards;
  const boards = pokle.remaingBoards;
  if (cards === null || boards === null) {
    throw new Error("Pokle must be solved first");
  }

  return getChoicesWithRecommendations({
    choices: cards,
    possibleAnswers: boards,
    getOutcome: (card, board) => Pokle.getCardPattern(card, board[4]),
    getProbabilityOfBeingAnswer: (outcomes) => {
      return (outcomes["🟩"] ?? 0) / boards.length;
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

export const getStandardRecommendation = (pokle: Pokle) => {
  const flopsWithEntropy = getFlopsWithRecommendations(pokle).slice(0, 10);
  const turnsWithEntropy = getTurnsWithRecommendations(pokle).slice(0, 10);
  const riversWithEntropy = getRiversWithRecommendations(pokle).slice(0, 10);

  const firstRecommendation = {
    flop: flopsWithEntropy[0],
    turn: turnsWithEntropy[0],
    river: riversWithEntropy[0],
    boardCards: getBoardCards(
      flopsWithEntropy[0],
      turnsWithEntropy[0],
      riversWithEntropy[0]
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
    flop: flopsWithEntropy[0],
    turn: turnsWithEntropy[0],
    river: riversWithEntropy[0],
    boardCards: getBoardCards(
      flopsWithEntropy[0],
      turnsWithEntropy[0],
      riversWithEntropy[0]
    ),
  };

  let bestBoardRecommendationIndex = 0;
  for (const flop of flopsWithEntropy) {
    for (const turn of turnsWithEntropy) {
      for (const river of riversWithEntropy) {
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

  return bestRecommendation;
};
