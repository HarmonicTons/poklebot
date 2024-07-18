import { orderBy, sumBy } from "lodash";
import { BoardCards, FlopCards } from "./brutForce";
import { Card, CardSuit, HexCardRank } from "./poker/Card";

type CardType = [HexCardRank, CardSuit];

export const SINGLE_OUTCOMES = ["🟩", "🟨", "⬜️"] as const;
export type SingleOutcome = (typeof SINGLE_OUTCOMES)[number];

export type FlopOutcome = [SingleOutcome, SingleOutcome, SingleOutcome];
export type BoardOutcome = [
  SingleOutcome,
  SingleOutcome,
  SingleOutcome,
  SingleOutcome,
  SingleOutcome
];

export const getSingleOutcome = (c1: CardType, c2: CardType) => {
  if (c1[0] === c2[0] && c1[1] === c2[1]) {
    return "🟩";
  }
  if (c1[0] === c2[0] || c1[1] === c2[1]) {
    return "🟨";
  }
  return "⬜️";
};

export const getFlopSingleOutcome = (card: CardType, flop: FlopCards) => {
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
export const getBoardOutcome = (
  b1: BoardCards,
  b2: BoardCards
): BoardOutcome => {
  const flopOutcome = getFlopOutcome(
    b1.slice(0, 3) as FlopCards,
    b2.slice(0, 3) as FlopCards
  );
  const turnOutcome = getSingleOutcome(b1[3], b2[3]);
  const riverOutcome = getSingleOutcome(b1[4], b2[4]);
  return [...flopOutcome, turnOutcome, riverOutcome] as BoardOutcome;
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

export const getBoardWithEntropy = (boards: BoardCards[]) => {
  const boardsWithEntropy = boards.map((board) => {
    const getOutcome = (board2: BoardCards) => {
      return getBoardOutcome(board, board2).join("");
    };
    const { entropy, outcomesDistribution } = getEntropy(boards, getOutcome);
    const probabilityOfBeingAnswer =
      (outcomesDistribution["🟩🟩🟩🟩🟩"] ?? 0) / boards.length;
    const recommendationIndex = entropy + probabilityOfBeingAnswer;
    return {
      board,
      entropy,
      outcomesDistribution,
      probabilityOfBeingAnswer,
      recommendationIndex,
    };
  });
  return orderBy(boardsWithEntropy, "recommendationIndex", "desc");
};

export const getFlopsWithEntropy = (
  boards: BoardCards[],
  cards: CardType[]
) => {
  const flops: [CardType, CardType, CardType][] = [];
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

export const getFlopRecommendation = (
  boards: BoardCards[],
  cards: CardType[]
) => {
  const flopsWithEntropy = getFlopsWithEntropy(boards, cards);
  return flopsWithEntropy[0];
};

export const getTurnsWithEntropy = (
  boards: BoardCards[],
  cards: CardType[]
) => {
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

export const getTurnRecommendation = (
  boards: BoardCards[],
  cards: CardType[]
) => {
  const turnsWithEntropy = getTurnsWithEntropy(boards, cards);
  return turnsWithEntropy[0];
};

export const getRiversWithEntropy = (
  boards: BoardCards[],
  cards: CardType[]
) => {
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

export const getRiverRecommendation = (
  boards: BoardCards[],
  cards: CardType[]
) => {
  const riversWithEntropy = getRiversWithEntropy(boards, cards);
  return riversWithEntropy[0];
};

export const boardIsValid = (board: BoardCards): boolean => {
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      const c1 = Card.fromHexArray(board[i]);
      const c2 = Card.fromHexArray(board[j]);
      if (c1.isEqual(c2)) {
        return false;
      }
    }
  }
  return true;
};

export const getHardModeRecommendation = (boards: BoardCards[]) => {
  const boardsWithEntropy = getBoardWithEntropy(boards);
  return boardsWithEntropy[0];
};

export const getRecommendation = (boards: BoardCards[], cards: CardType[]) => {
  const flopsWithEntropy = getFlopsWithEntropy(boards, cards).slice(0, 10);
  const turnsWithEntropy = getTurnsWithEntropy(boards, cards).slice(0, 10);
  const riversWithEntropy = getRiversWithEntropy(boards, cards).slice(0, 10);

  const firstRecommendation = {
    flop: flopsWithEntropy[0],
    turn: turnsWithEntropy[0],
    river: riversWithEntropy[0],
  };
  const firstBoard = [
    ...firstRecommendation.flop.flop,
    firstRecommendation.turn.card,
    firstRecommendation.river.card,
  ] as BoardCards;
  if (boardIsValid(firstBoard)) {
    return firstRecommendation;
  }

  let bestRecommendation = {
    flop: flopsWithEntropy[0],
    turn: turnsWithEntropy[0],
    river: riversWithEntropy[0],
  };

  let bestBoardRecommendationIndex = 0;
  for (const flop of flopsWithEntropy) {
    for (const turn of turnsWithEntropy) {
      for (const river of riversWithEntropy) {
        const board = [...flop.flop, turn.card, river.card] as BoardCards;
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
          };
          bestBoardRecommendationIndex = boardRecommendationIndex;
        }
      }
    }
  }

  return bestRecommendation;
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
