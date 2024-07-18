import { BoardCards, brutForceSolution, Players } from "./brutForce";
import {
  ActualOutcome,
  filterBoards,
  getFlopRecommendation,
  getRecommendation,
  getRiverRecommendation,
  getTurnRecommendation,
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
const actualSolution3: BoardCards = [
  ["7", "♦"],
  ["7", "♠"],
  ["c", "♠"],
  ["c", "♦"],
  ["c", "♣"],
];

const main = async () => {
  console.log("Start");
  const { boards, cards } = brutForceSolution(players3);

  console.log(boards[0]);

  const recommendation = getRecommendation(boards, cards);
  console.log("recommendation", recommendation);

  const boardPlayed: BoardCards = [
    ["2", "♥"],
    ["8", "♥"],
    ["9", "♣"],
    ["a", "♠"],
    ["8", "♠"],
  ];
  const actualOutcome: ActualOutcome = ["⬜️", "⬜️", "⬜️", "⬜️", "⬜️"];

  const filteredBoards = filterBoards(boards, boardPlayed, actualOutcome);

  console.log(filteredBoards.length);

  const recommendation2 = getRecommendation(filteredBoards, cards);
  console.log("recommendation", recommendation2);
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
