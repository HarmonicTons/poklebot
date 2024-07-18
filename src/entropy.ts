import { orderBy, sumBy } from "lodash";
import { BoardCards, FlopCards } from "./brutForce";
import { Card } from "./findHand";

export const SINGLE_OUTCOMES = ["🟩", "🟨", "⬜️"] as const;
export type SingleOutcome = (typeof SINGLE_OUTCOMES)[number];

export type FlopOutcome = `${SingleOutcome}${SingleOutcome}${SingleOutcome}`;

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
  return outcomes.join("") as FlopOutcome;
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
      return getFlopOutcome(flop, boardFlopCards);
    };
    const { entropy, outcomesDistribution } = getEntropy(boards, getOutcome);
    return { flop, entropy, outcomesDistribution };
  });
  return orderBy(flopsWithEntropy, "entropy", "desc");
};

export const getTurnsWithEntropy = (boards: BoardCards[], cards: Card[]) => {
  const turnsWithEntropy = cards.map((card) => {
    const getOutcome = (board: BoardCards) => {
      const boardTurnCard = board[3];
      return getSingleOutcome(card, boardTurnCard);
    };
    const { entropy, outcomesDistribution } = getEntropy(boards, getOutcome);
    return { card, entropy, outcomesDistribution };
  });
  return orderBy(turnsWithEntropy, "entropy", "desc");
};

export const getRiversWithEntropy = (boards: BoardCards[], cards: Card[]) => {
  const riversWithEntropy = cards.map((card) => {
    const getOutcome = (board: BoardCards) => {
      const boardRiverCard = board[4];
      return getSingleOutcome(card, boardRiverCard);
    };
    const { entropy, outcomesDistribution } = getEntropy(boards, getOutcome);
    return { card, entropy, outcomesDistribution };
  });
  return orderBy(riversWithEntropy, "entropy", "desc");
};
