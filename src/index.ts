import { orderBy, sumBy } from "lodash";
import { brutForceSolution, Players, FlopCards, BoardCards } from "./brutForce";
import { Card } from "./findHand";
import {
  getFlopsWithEntropy,
  getRiversWithEntropy,
  getTurnsWithEntropy,
} from "./entropy";

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
  const { boards, cards } = brutForceSolution(players2);

  console.log(boards[0]);

  const flopsWithEntropy = getFlopsWithEntropy(boards, cards);
  const bestFlopChoice = flopsWithEntropy[0];
  console.log("flop", bestFlopChoice);

  // TURN
  const turnsWithEntropy = getTurnsWithEntropy(boards, cards);
  const bestTurnChoice = turnsWithEntropy[0];
  console.log("turn", bestTurnChoice);

  // RIVER
  const riversWithEntropy = getRiversWithEntropy(boards, cards);
  const bestRiverChoice = riversWithEntropy[0];
  console.log("river", bestRiverChoice);
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
