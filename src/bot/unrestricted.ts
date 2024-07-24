import { sum, sumBy } from "lodash";
import {
  ChoiceWithRecommendation,
  getChoicesWithRecommendations,
  getRecommendationIndex,
  Greediness,
} from "../entropy/entropy";
import { Card } from "../poker/Card";
import { BoardCards, FlopCards } from "../poker/Poker";
import { Pokle } from "../pokle/Pokle";
import { Recommendation } from "./Recommendation";

export const getFlopsWithRecommendations = (
  pokle: Pick<Pokle, "validCards" | "remainingBoards">,
  greediness: Greediness
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
    greediness,
  });
};

export const getTurnsWithRecommendations = (
  pokle: Pick<Pokle, "validCards" | "remainingBoards">,
  greediness: Greediness
) => {
  const cards = pokle.validCards;
  const boards = pokle.remainingBoards;
  if (cards === null || boards === null) {
    throw new Error("Pokle must be solved first");
  }

  return getChoicesWithRecommendations({
    choices: cards,
    possibleAnswers: boards,
    getOutcome: (card, board) => Pokle.getCardPattern(card, board[3], false),
    getProbabilityOfBeingAnswer: (outcomes) => {
      const probabilityOfBeingAnswer = (outcomes["🟩"] ?? 0) / boards.length;
      return probabilityOfBeingAnswer;
    },
    greediness,
  });
};

export const getRiversWithRecommendations = (
  pokle: Pick<Pokle, "validCards" | "remainingBoards">,
  greediness: Greediness
) => {
  const cards = pokle.validCards;
  const boards = pokle.remainingBoards;
  if (cards === null || boards === null) {
    throw new Error("Pokle must be solved first");
  }

  return getChoicesWithRecommendations({
    choices: cards,
    possibleAnswers: boards,
    getOutcome: (card, board) => Pokle.getCardPattern(card, board[4], false),
    getProbabilityOfBeingAnswer: (outcomes) => {
      const probabilityOfBeingAnswer = (outcomes["🟩"] ?? 0) / boards.length;
      return probabilityOfBeingAnswer;
    },
    greediness,
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

export const mergeRecommendations = (
  flopsWithRecommendation: ChoiceWithRecommendation<FlopCards, string>,
  turnsWithRecommendation: ChoiceWithRecommendation<Card, string>,
  riversWithRecommendation: ChoiceWithRecommendation<Card, string>,
  greediness: Greediness
): Recommendation => {
  const entropy = sumBy([
    flopsWithRecommendation,
    turnsWithRecommendation,
    riversWithRecommendation,
  ]);
  const probabilityOfBeingAnswer =
    flopsWithRecommendation.probabilityOfBeingAnswer *
    turnsWithRecommendation.probabilityOfBeingAnswer *
    riversWithRecommendation.probabilityOfBeingAnswer;

  const recommendationIndex = getRecommendationIndex({
    entropy,
    probabilityOfBeingAnswer,
    greediness,
  });

  const choice = [
    ...flopsWithRecommendation.choice,
    turnsWithRecommendation.choice,
    riversWithRecommendation.choice,
  ] as BoardCards;

  return {
    choice,
    entropy,
    outcomes: {},
    probabilityOfBeingAnswer,
    recommendationIndex,
  };
};

export const getUnrestrictedRecommendation = (
  pokle: Pick<Pokle, "validCards" | "remainingBoards">,
  greediness: Greediness = 0.5
): Recommendation => {
  const flopsWithRecommendation = getFlopsWithRecommendations(
    pokle,
    greediness
  ).slice(0, 10);
  const turnsWithRecommendation = getTurnsWithRecommendations(
    pokle,
    greediness
  ).slice(0, 10);
  const riversWithRecommendation = getRiversWithRecommendations(
    pokle,
    greediness
  ).slice(0, 10);

  // look for the valid board with the highest recommendation index
  let bestRecommendation: Recommendation | undefined = undefined;
  for (const flop of flopsWithRecommendation) {
    for (const turn of turnsWithRecommendation) {
      for (const river of riversWithRecommendation) {
        const recommendation = mergeRecommendations(
          flop,
          turn,
          river,
          greediness
        );
        if (
          boardIsValid(recommendation.choice) &&
          (bestRecommendation === undefined ||
            recommendation.recommendationIndex >
              bestRecommendation.recommendationIndex)
        ) {
          bestRecommendation = recommendation;
        }
      }
    }
  }

  if (bestRecommendation === undefined) {
    throw new Error("Could not find a valid board");
  }

  return bestRecommendation;
};
