import { Problem } from "./model";
import { problemIsValid } from "./problem";

const problem: Problem = [
  {
    name: "Bex",
    hand: [
      {
        value: "K",
        color: "♥",
      },
      {
        value: "8",
        color: "♥",
      },
    ],
    stagesScore: {
      flop: 1,
      turn: 1,
      river: 3,
    },
  },
  {
    name: "Rex",
    hand: [
      {
        value: "Q",
        color: "♠",
      },
      {
        value: "J",
        color: "♦",
      },
    ],
    stagesScore: {
      flop: 3,
      turn: 2,
      river: 1,
    },
  },
  {
    name: "Lex",
    hand: [
      {
        value: "10",
        color: "♠",
      },
      {
        value: "3",
        color: "♣",
      },
    ],
    stagesScore: {
      flop: 2,
      turn: 3,
      river: 2,
    },
  },
];

const main = async () => {
  console.log("Start");
  const isValid = problemIsValid(problem);
  if (!isValid) {
    throw new Error("Problem is not valid");
  }
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
