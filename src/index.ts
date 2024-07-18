import { orderBy, sumBy } from "lodash";
import { getAllValidFlops, brutForceSolution, Players } from "./brutForce";

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

const main = async () => {
  console.log("Start");
  const { boards, cards } = brutForceSolution(players3);

  console.log(boards[0]);

  const turnCardsWithEntropy = cards.map((card) => {
    const outcomes = boards.reduce(
      (res, board) => {
        if (board[3][0] === card[0] && board[3][1] === card[1]) {
          res[0]++;
          return res;
        }
        if (board[3][0] === card[0] || board[3][1] === card[1]) {
          res[1]++;
          return res;
        }
        res[2]++;
        return res;
      },
      [0, 0, 0]
    );

    const probabilities = outcomes.map(
      (nbOfOccurences) => nbOfOccurences / boards.length
    );

    const entropy = sumBy(probabilities, (p) =>
      p === 0 ? 0 : p * Math.log2(1 / p)
    );
    return { card, entropy };
  });
  const sortedTurnCardsByEntropy = orderBy(
    turnCardsWithEntropy,
    "entropy",
    "desc"
  );
  const bestTurnChoice = sortedTurnCardsByEntropy[0].card;
  console.log("turn", bestTurnChoice);

  const riverCardsWithEntropy = cards.map((card) => {
    const outcomes = boards.reduce(
      (res, board) => {
        if (board[4][0] === card[0] && board[4][1] === card[1]) {
          res[0]++;
          return res;
        }
        if (board[4][0] === card[0] || board[4][1] === card[1]) {
          res[1]++;
          return res;
        }
        res[2]++;
        return res;
      },
      [0, 0, 0]
    );

    const probabilities = outcomes.map(
      (nbOfOccurences) => nbOfOccurences / boards.length
    );

    const entropy = sumBy(probabilities, (p) =>
      p === 0 ? 0 : p * Math.log2(1 / p)
    );
    return { card, entropy };
  });
  const sortedRiverCardsByEntropy = orderBy(
    riverCardsWithEntropy,
    "entropy",
    "desc"
  );
  const bestRiverChoice = sortedRiverCardsByEntropy[0].card;
  console.log("river", bestRiverChoice);
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
