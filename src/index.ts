import { getHardModeRecommendation, getRecommendation } from "./entropy";
import { Card } from "./poker/Card";
import { BoardCards } from "./poker/Poker";
import { Pokle, Players, BoardPattern } from "./pokle/Pokle";

const players: Players = [
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
const pokle = new Pokle(players);

const main = async () => {
  console.log("PokleBot");
  const cards = pokle.validCards;
  const boards = pokle.solve();

  console.log("Possible boards:", boards.length);

  const hardModeRecommendation = getHardModeRecommendation(boards);
  console.log(
    "hard-mode recommendation:",
    JSON.stringify(hardModeRecommendation.board),
    "- E:",
    hardModeRecommendation.entropy.toFixed(4),
    " P:",
    hardModeRecommendation.probabilityOfBeingAnswer.toFixed(4)
  );

  const recommendation = getRecommendation(boards, cards);
  console.log(
    "standard-mode recommendation:",
    JSON.stringify([
      ...recommendation.flop.flop,
      recommendation.turn.card,
      recommendation.river.card,
    ])
  );

  // const playedBoard: BoardCards = [
  //   new Card("7", "♦"),
  //   new Card("9", "♣"),
  //   new Card("J", "♥"),
  //   new Card("10", "♠"),
  //   new Card("8", "♥"),
  // ];
  // const pattern: BoardPattern = ["🟩", "⬜️", "⬜️", "⬜️", "⬜️"];

  // const filteredBoards = Pokle.keepOnlyBoardsMatchingPattern({
  //   boards,
  //   playedBoard,
  //   pattern,
  // });

  // console.log(filteredBoards.length);

  // const hardModeRecommendation2 = getHardModeRecommendation(filteredBoards);
  // console.log("hard-mode recommendation", hardModeRecommendation2);

  // const recommendation2 = getRecommendation(filteredBoards, cards);
  // console.log(
  //   "recommendation",
  //   recommendation2.flop,
  //   recommendation2.turn,
  //   recommendation2.river
  // );
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
