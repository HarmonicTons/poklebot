import {
  ActualOutcome,
  filterBoards,
  getHardModeRecommendation,
  getRecommendation,
  OldBoardCards,
} from "./entropy";
import { Card } from "./poker/Card";
import { Pokle, Players } from "./pokle/Pokle";

const players2: Players = [
  {
    name: "Bex",
    positions: {
      flop: 2,
      turn: 3,
      river: 1,
    },
    cards: [new Card("A", "♥"), new Card("A", "♦")],
  },
  {
    name: "Rex",
    positions: {
      flop: 1,
      turn: 2,
      river: 3,
    },
    cards: [new Card("2", "♠"), new Card("K", "♠")],
  },
  {
    name: "Lex",
    positions: {
      flop: 3,
      turn: 1,
      river: 2,
    },
    cards: [new Card("Q", "♣"), new Card("9", "♠")],
  },
];
const pokle2 = new Pokle(players2);

const main = async () => {
  console.log("Start");
  const newCards = pokle2.validCards;
  const newBoards = pokle2.solve();

  const cards = newCards.map((c) => c.toHexArray());
  const boards = newBoards.map((b) =>
    b.map((c) => c.toHexArray())
  ) as OldBoardCards[];

  console.log("boards", newBoards.length);
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

  const boardPlayed: OldBoardCards = [
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
