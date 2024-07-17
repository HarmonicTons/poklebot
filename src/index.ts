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

const main = async () => {
  console.log("Start");
  const rivers = brutForceSolution(players2);
  console.log(rivers[0]);
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
