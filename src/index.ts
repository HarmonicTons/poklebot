import { BoardCards, brutForceSolution, Players } from "./brutForce";
import {
  ActualOutcome,
  filterBoards,
  getHardModeRecommendation,
  getRecommendation,
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

const players4: Players = [
  {
    name: "Jaz",
    positions: {
      flop: 3,
      turn: 2,
      river: 3,
    },
    cards: [
      ["b", "♦"],
      ["9", "♥"],
    ],
  },
  {
    name: "Baz",
    positions: {
      flop: 1,
      turn: 1,
      river: 2,
    },
    cards: [
      ["6", "♦"],
      ["7", "♥"],
    ],
  },
  {
    name: "Raz",
    positions: {
      flop: 2,
      turn: 3,
      river: 1,
    },
    cards: [
      ["a", "♠"],
      ["d", "♠"],
    ],
  },
];

const main = async () => {
  console.log("Start");
  const { boards, cards } = brutForceSolution(players2);

  console.log(boards[0]);

  const hardModeRecommendation = getHardModeRecommendation(boards);
  console.log("hard-mode recommendation", hardModeRecommendation);

  const recommendation = getRecommendation(boards, cards);
  console.log(
    "recommendation",
    recommendation.flop,
    recommendation.turn,
    recommendation.river
  );

  const boardPlayed: BoardCards = [
    ["7", "♦"],
    ["9", "♣"],
    ["b", "♥"],
    ["a", "♠"],
    ["8", "♥"],
  ];
  const actualOutcome: ActualOutcome = ["🟩", "⬜️", "⬜️", "⬜️", "⬜️"];

  const filteredBoards = filterBoards(boards, boardPlayed, actualOutcome);

  console.log(filteredBoards.length);

  const hardModeRecommendation2 = getHardModeRecommendation(filteredBoards);
  console.log("hard-mode recommendation", hardModeRecommendation2);

  const recommendation2 = getRecommendation(filteredBoards, cards);
  console.log(
    "recommendation",
    recommendation2.flop,
    recommendation2.turn,
    recommendation2.river
  );

  // const boardPlayed2: BoardCards = [
  //   ["2", "♠"],
  //   ["7", "♠"],
  //   ["c", "♣"],
  //   ["9", "♣"],
  //   ["b", "♠"],
  // ];
  // const actualOutcome2: ActualOutcome = ["🟨", "🟨", "🟨", "🟨", "🟩"];

  // const filteredBoards2 = filterBoards(
  //   filteredBoards,
  //   boardPlayed2,
  //   actualOutcome2
  // );

  // console.log(filteredBoards2.length);

  // const recommendation3 = getRecommendation(filteredBoards2, cards);
  // console.log(
  //   "recommendation",
  //   recommendation3.flop,
  //   recommendation3.turn,
  //   recommendation3.river
  // );
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
