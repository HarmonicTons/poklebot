import { getHardModeRecommendation, getRecommendation } from "./entropy";
import { Card } from "./poker/Card";
import { BoardCards } from "./poker/Poker";
import { Pokle, Players, BoardPattern } from "./pokle/Pokle";

const players: Players = [
  {
    name: "Jaz",
    positions: {
      flop: 3,
      turn: 3,
      river: 1,
    },
    cards: [new Card("10", "♦"), new Card("J", "♠")],
  },
  {
    name: "Baz",
    positions: {
      flop: 1,
      turn: 2,
      river: 3,
    },
    cards: [new Card("J", "♦"), new Card("3", "♦")],
  },
  {
    name: "Raz",
    positions: {
      flop: 2,
      turn: 1,
      river: 2,
    },
    cards: [new Card("4", "♣"), new Card("3", "♠")],
  },
];
const pokle = new Pokle(players);

const main = async () => {
  console.log("PokleBot");
  const cards = pokle.validCards;
  const boards = pokle.solve();

  console.log("Possible boards:", boards.length);

  // const hardModeRecommendation = getHardModeRecommendation(boards);
  // console.log(
  //   "hard-mode recommendation:",
  //   JSON.stringify(hardModeRecommendation.board),
  //   "- E:",
  //   hardModeRecommendation.entropy.toFixed(4),
  //   " P:",
  //   hardModeRecommendation.probabilityOfBeingAnswer.toFixed(4)
  // );

  const recommendation = getRecommendation(boards, cards);
  console.log(
    "standard-mode recommendation:",
    JSON.stringify([
      ...recommendation.flop.flop,
      recommendation.turn.card,
      recommendation.river.card,
    ])
  );

  const playedBoard: BoardCards = [
    new Card("3", "♣"),
    new Card("Q", "♦"),
    new Card("A", "♦"),
    new Card("4", "♥"),
    new Card("9", "♥"),
  ];
  const pattern: BoardPattern = ["🟨", "🟨", "🟨", "🟨", "⬜️"];

  const filteredBoards = Pokle.keepOnlyBoardsMatchingPattern({
    boards,
    playedBoard,
    pattern,
  });

  console.log("Remaining boards:", filteredBoards.length);

  // const hardModeRecommendation2 = getHardModeRecommendation(filteredBoards);
  // console.log(
  //   "hard-mode recommendation:",
  //   JSON.stringify(hardModeRecommendation2.board),
  //   "- E:",
  //   hardModeRecommendation2.entropy.toFixed(4),
  //   " P:",
  //   hardModeRecommendation2.probabilityOfBeingAnswer.toFixed(4)
  // );

  const recommendation2 = getRecommendation(filteredBoards, cards);
  console.log(
    "standard-mode recommendation:",
    JSON.stringify([
      ...recommendation2.flop.flop,
      recommendation2.turn.card,
      recommendation2.river.card,
    ])
  );

  //

  const playedBoard2: BoardCards = [
    new Card("7", "♠"),
    new Card("8", "♠"),
    new Card("9", "♦"),
    new Card("4", "♠"),
    new Card("Q", "♠"),
  ];
  const pattern2: BoardPattern = ["🟨", "🟨", "🟨", "🟨", "🟩"];

  const filteredBoards2 = Pokle.keepOnlyBoardsMatchingPattern({
    boards: filteredBoards,
    playedBoard: playedBoard2,
    pattern: pattern2,
  });

  console.log("Remaining boards:", filteredBoards2.length);

  // const hardModeRecommendation3 = getHardModeRecommendation(filteredBoards2);
  // console.log(
  //   "hard-mode recommendation:",
  //   JSON.stringify(hardModeRecommendation3.board),
  //   "- E:",
  //   hardModeRecommendation3.entropy.toFixed(4),
  //   " P:",
  //   hardModeRecommendation3.probabilityOfBeingAnswer.toFixed(4)
  // );

  const recommendation3 = getRecommendation(filteredBoards2, cards);
  console.log(
    "standard-mode recommendation:",
    JSON.stringify([
      ...recommendation3.flop.flop,
      recommendation3.turn.card,
      recommendation3.river.card,
    ])
  );

  //
  /*
  const playedBoard3: BoardCards = [
    new Card("3", "♥"),
    new Card("9", "♠"),
    new Card("K", "♣"),
    new Card("4", "♦"),
    new Card("Q", "♠"),
  ];
  const pattern3: BoardPattern = ["🟩", "🟩", "⬜️", "🟩", "🟩"];

  const filteredBoards3 = Pokle.keepOnlyBoardsMatchingPattern({
    boards: filteredBoards2,
    playedBoard: playedBoard3,
    pattern: pattern3,
  });

  console.log("Remaining boards:", filteredBoards3.length);

  const hardModeRecommendation4 = getHardModeRecommendation(filteredBoards3);
  console.log(
    "hard-mode recommendation:",
    JSON.stringify(hardModeRecommendation4.board),
    "- E:",
    hardModeRecommendation4.entropy.toFixed(4),
    " P:",
    hardModeRecommendation4.probabilityOfBeingAnswer.toFixed(4)
  );

  */
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
