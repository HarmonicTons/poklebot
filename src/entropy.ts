import { orderBy, sumBy } from "lodash";
import { BoardCards, FlopCards } from "./brutForce";
import { Card, cardsAreEqual } from "./findHand";
import { Flop } from "./model";

export const SINGLE_OUTCOMES = ["🟩", "🟨", "⬜️"] as const;
export type SingleOutcome = (typeof SINGLE_OUTCOMES)[number];

export type FlopOutcome = [SingleOutcome, SingleOutcome, SingleOutcome];

export const getSingleOutcome = (c1: Card, c2: Card) => {
  if (c1[0] === c2[0] && c1[1] === c2[1]) {
    return "🟩";
  }
  if (c1[0] === c2[0] || c1[1] === c2[1]) {
    return "🟨";
  }
  return "⬜️";
};

export const getFlopSingleOutcome = (card: Card, flop: FlopCards) => {
  const outcomes = flop.map((flopCard) => getSingleOutcome(card, flopCard));
  if (outcomes.includes("🟩")) {
    return "🟩";
  }
  if (outcomes.includes("🟨")) {
    return "🟨";
  }
  return "⬜️";
};
export const getFlopOutcome = (f1: FlopCards, f2: FlopCards): FlopOutcome => {
  const outcomes = f1.map((card) => getFlopSingleOutcome(card, f2));
  return outcomes as FlopOutcome;
};

export const getEntropy = (
  boards: BoardCards[],
  getOutcome: (board: BoardCards) => string
): { entropy: number; outcomesDistribution: Record<string, number> } => {
  const outcomesDistribution = boards.reduce((_outcomesDistribution, board) => {
    const outcome = getOutcome(board);
    if (_outcomesDistribution[outcome] === undefined) {
      _outcomesDistribution[outcome] = 1;
    } else {
      _outcomesDistribution[outcome]++;
    }
    return _outcomesDistribution;
  }, {} as Record<string, number>);
  const probabilities = Object.values(outcomesDistribution).map(
    (nbOfOccurences) => nbOfOccurences / boards.length
  );
  const entropy = sumBy(probabilities, (p) =>
    p === 0 ? 0 : -p * Math.log2(p)
  );
  return { entropy, outcomesDistribution };
};

export const getFlopsWithEntropy = (boards: BoardCards[], cards: Card[]) => {
  const flops: [Card, Card, Card][] = [];
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        flops.push([cards[i], cards[j], cards[k]]);
      }
    }
  }
  const flopsWithEntropy = flops.map((flop) => {
    const getOutcome = (board: BoardCards) => {
      const boardFlopCards = board.slice(0, 3) as FlopCards;
      const outcome = getFlopOutcome(flop, boardFlopCards);
      // sort because the order of the cards in the flop does not matter
      return outcome.sort().join("");
    };
    const { entropy, outcomesDistribution } = getEntropy(boards, getOutcome);
    const probabilityOfBeingAnswer =
      (outcomesDistribution["🟩🟩🟩"] ?? 0) / boards.length;
    const recommendationIndex = entropy + probabilityOfBeingAnswer;
    return {
      flop,
      entropy,
      outcomesDistribution,
      probabilityOfBeingAnswer,
      recommendationIndex,
    };
  });
  return orderBy(flopsWithEntropy, "recommendationIndex", "desc");
};

export const getFlopRecommendation = (boards: BoardCards[], cards: Card[]) => {
  const flopsWithEntropy = getFlopsWithEntropy(boards, cards);
  return flopsWithEntropy[0];
};

export const getTurnsWithEntropy = (boards: BoardCards[], cards: Card[]) => {
  const turnsWithEntropy = cards.map((card) => {
    const getOutcome = (board: BoardCards) => {
      const boardTurnCard = board[3];
      return getSingleOutcome(card, boardTurnCard);
    };
    const { entropy, outcomesDistribution } = getEntropy(boards, getOutcome);
    const probabilityOfBeingAnswer =
      (outcomesDistribution["🟩"] ?? 0) / boards.length;
    const recommendationIndex = entropy + probabilityOfBeingAnswer;
    return {
      card,
      entropy,
      outcomesDistribution,
      probabilityOfBeingAnswer,
      recommendationIndex,
    };
  });
  return orderBy(turnsWithEntropy, "recommendationIndex", "desc");
};

export const getTurnRecommendation = (boards: BoardCards[], cards: Card[]) => {
  const turnsWithEntropy = getTurnsWithEntropy(boards, cards);
  const solution = turnsWithEntropy.find(
    ({ entropy, outcomesDistribution }) =>
      entropy === 0 && outcomesDistribution["🟩"] > 0
  );
  if (solution) {
    return solution;
  } else {
    const maxEntropyTurn = turnsWithEntropy[0];
    return maxEntropyTurn;
  }
};

export const getRiversWithEntropy = (boards: BoardCards[], cards: Card[]) => {
  const riversWithEntropy = cards.map((card) => {
    const getOutcome = (board: BoardCards) => {
      const boardRiverCard = board[4];
      return getSingleOutcome(card, boardRiverCard);
    };
    const { entropy, outcomesDistribution } = getEntropy(boards, getOutcome);
    const probabilityOfBeingAnswer =
      (outcomesDistribution["🟩"] ?? 0) / boards.length;
    const recommendationIndex = entropy + probabilityOfBeingAnswer;
    return {
      card,
      entropy,
      outcomesDistribution,
      probabilityOfBeingAnswer,
      recommendationIndex,
    };
  });
  return orderBy(riversWithEntropy, "recommendationIndex", "desc");
};

export const getRiverRecommendation = (boards: BoardCards[], cards: Card[]) => {
  const riversWithEntropy = getRiversWithEntropy(boards, cards);
  const solution = riversWithEntropy.find(
    ({ entropy, outcomesDistribution }) =>
      entropy === 0 && outcomesDistribution["🟩"] > 0
  );
  if (solution) {
    return solution;
  } else {
    const maxEntropyRiver = riversWithEntropy[0];
    return maxEntropyRiver;
  }
};

export type ActualOutcome = [
  SingleOutcome,
  SingleOutcome,
  SingleOutcome,
  SingleOutcome,
  SingleOutcome
];

export const filterBoards = (
  boards: BoardCards[],
  boardPlayed: BoardCards,
  actualOutcome: ActualOutcome
): BoardCards[] => {
  return boards.filter((board) => {
    const flopOutcome = getFlopOutcome(
      boardPlayed.slice(0, 3) as FlopCards,
      board.slice(0, 3) as FlopCards
    );
    if (flopOutcome.join("") !== actualOutcome.slice(0, 3).join("")) {
      return false;
    }
    const turnOutcome = getSingleOutcome(boardPlayed[3], board[3]);
    if (turnOutcome !== actualOutcome[3]) {
      return false;
    }
    const riverOutcome = getSingleOutcome(boardPlayed[4], board[4]);
    if (riverOutcome !== actualOutcome[4]) {
      return false;
    }
    return true;
  });
};
