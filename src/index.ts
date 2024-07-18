import { orderBy, sumBy } from "lodash";
import { brutForceSolution, Players, FlopCards, BoardCards } from "./brutForce";
import { Card } from "./findHand";

const players: Players = [
  {
    name: "Pam",
    positions: {
      flop: 1,
      turn: 2,
      river: 1,
    },
    cards: [
      ["a", "♥"],
      ["e", "♦"],
    ],
  },
  {
    name: "Sam",
    positions: {
      flop: 3,
      turn: 3,
      river: 3,
    },
    cards: [
      ["8", "♦"],
      ["5", "♠"],
    ],
  },
  {
    name: "Lam",
    positions: {
      flop: 2,
      turn: 1,
      river: 2,
    },
    cards: [
      ["c", "♣"],
      ["e", "♠"],
    ],
  },
];

const players2: Players = [
  {
    name: "Bex",
    positions: {
      flop: 2,
      turn: 3,
      river: 1,
    },
    cards: [
      ["e", "♥"],
      ["e", "♦"],
    ],
  },
  {
    name: "Rex",
    positions: {
      flop: 1,
      turn: 2,
      river: 3,
    },
    cards: [
      ["2", "♠"],
      ["d", "♠"],
    ],
  },
  {
    name: "Lex",
    positions: {
      flop: 3,
      turn: 1,
      river: 2,
    },
    cards: [
      ["c", "♣"],
      ["9", "♠"],
    ],
  },
];

const players3: Players = [
  {
    name: "Cat",
    positions: {
      flop: 3,
      turn: 3,
      river: 2,
    },
    cards: [
      ["6", "♦"],
      ["3", "♣"],
    ],
  },
  {
    name: "Pat",
    positions: {
      flop: 2,
      turn: 1,
      river: 1,
    },
    cards: [
      ["c", "♥"],
      ["8", "♦"],
    ],
  },
  {
    name: "Nat",
    positions: {
      flop: 1,
      turn: 2,
      river: 2,
    },
    cards: [
      ["7", "♣"],
      ["9", "♥"],
    ],
  },
];

const SINGLE_OUTCOMES = ["🟩", "🟨", "⬜️"] as const;
type SingleOutcome = (typeof SINGLE_OUTCOMES)[number];

type FlopOutcome = `${SingleOutcome}${SingleOutcome}${SingleOutcome}`;

const getSingleOutcome = (c1: Card, c2: Card) => {
  if (c1[0] === c2[0] && c1[1] === c2[1]) {
    return "🟩";
  }
  if (c1[0] === c2[0] || c1[1] === c2[1]) {
    return "🟨";
  }
  return "⬜️";
};

const getFlopSingleOutcome = (card: Card, flop: FlopCards) => {
  const outcomes = flop.map((flopCard) => getSingleOutcome(card, flopCard));
  if (outcomes.includes("🟩")) {
    return "🟩";
  }
  if (outcomes.includes("🟨")) {
    return "🟨";
  }
  return "⬜️";
};
const getFlopOutcome = (f1: FlopCards, f2: FlopCards): FlopOutcome => {
  const outcomes = f1.map((card) => getFlopSingleOutcome(card, f2));
  return outcomes.join("") as FlopOutcome;
};

const getEntropy = (
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

const main = async () => {
  console.log("Start");
  const { boards, cards } = brutForceSolution(players2);

  console.log(boards[0]);

  // FLOP
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
  const sortedFlopsByEntropy = orderBy(flopsWithEntropy, "entropy", "desc");
  const bestFlopChoice = sortedFlopsByEntropy[0];
  console.log("flop", bestFlopChoice);

  // TURN
  const turnsWithEntropy = cards.map((card) => {
    const getOutcome = (board: BoardCards) => {
      const boardTurnCard = board[3];
      return getSingleOutcome(card, boardTurnCard);
    };
    const { entropy, outcomesDistribution } = getEntropy(boards, getOutcome);
    return { card, entropy, outcomesDistribution };
  });
  const sortedTurnsByEntropy = orderBy(turnsWithEntropy, "entropy", "desc");
  const bestTurnChoice = sortedTurnsByEntropy[0];
  console.log("turn", bestTurnChoice);

  // RIVER
  const riversWithEntropy = cards.map((card) => {
    const getOutcome = (board: BoardCards) => {
      const boardRiverCard = board[4];
      return getSingleOutcome(card, boardRiverCard);
    };
    const { entropy, outcomesDistribution } = getEntropy(boards, getOutcome);
    return { card, entropy, outcomesDistribution };
  });
  const sortedRiversByEntropy = orderBy(riversWithEntropy, "entropy", "desc");
  const bestRiverChoice = sortedRiversByEntropy[0];
  console.log("river", bestRiverChoice);
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
