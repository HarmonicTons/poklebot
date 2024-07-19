import { getHardModeRecommendation } from "./bot/hardMode";
import { getStandardRecommendation } from "./bot/standard";
import { Card } from "./poker/Card";
import { BoardCards } from "./poker/Poker";
import { Pokle, Players, BoardPattern } from "./pokle/Pokle";
import games from "./games.json";

const game = games.games[games.games.length - 1];
const pokle = Pokle.fromJSON(game.id, game.players);

const main = async () => {
  console.log("PokleBot");
  pokle.solve();

  console.log("Possible boards:", (pokle.remaingBoards as BoardCards[]).length);

  const hardModeRecommendation = getHardModeRecommendation(pokle);
  console.log(
    "hard-mode recommendation:",
    JSON.stringify(hardModeRecommendation.choice),
    "- E:",
    hardModeRecommendation.entropy.toFixed(4),
    " P:",
    hardModeRecommendation.probabilityOfBeingAnswer.toFixed(4)
  );

  const recommendation = getStandardRecommendation(pokle);
  console.log(
    "standard recommendation:",
    JSON.stringify([
      ...recommendation.flop.choice,
      recommendation.turn.choice,
      recommendation.river.choice,
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

  pokle.guessBoard({
    playedBoard,
    pattern,
  });

  console.log(
    "Remaining boards:",
    (pokle.remaingBoards as BoardCards[]).length
  );

  const hardModeRecommendation2 = getHardModeRecommendation(pokle);
  console.log(
    "hard-mode recommendation:",
    JSON.stringify(hardModeRecommendation2.choice),
    "- E:",
    hardModeRecommendation2.entropy.toFixed(4),
    " P:",
    hardModeRecommendation2.probabilityOfBeingAnswer.toFixed(4)
  );

  const recommendation2 = getStandardRecommendation(pokle);
  console.log(
    "standard recommendation:",
    JSON.stringify([
      ...recommendation2.flop.choice,
      recommendation2.turn.choice,
      recommendation2.river.choice,
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

  pokle.guessBoard({
    playedBoard: playedBoard2,
    pattern: pattern2,
  });

  console.log(
    "Remaining boards:",
    (pokle.remaingBoards as BoardCards[]).length
  );

  const hardModeRecommendation3 = getHardModeRecommendation(pokle);
  console.log(
    "hard-mode recommendation:",
    JSON.stringify(hardModeRecommendation3.choice),
    "- E:",
    hardModeRecommendation3.entropy.toFixed(4),
    " P:",
    hardModeRecommendation3.probabilityOfBeingAnswer.toFixed(4)
  );

  const recommendation3 = getStandardRecommendation(pokle);
  console.log(
    "standard recommendation:",
    JSON.stringify([
      ...recommendation3.flop.choice,
      recommendation3.turn.choice,
      recommendation3.river.choice,
    ])
  );

  pokle.guessBoard({
    playedBoard: [
      new Card("3", "♥"),
      new Card("8", "♦"),
      new Card("9", "♠"),
      new Card("4", "♦"),
      new Card("Q", "♠"),
    ],
    pattern: ["🟩", "🟩", "🟩", "🟩", "🟩"],
  });

  console.log(pokle.toString());
};

main()
  .then(() => console.log("End"))
  .catch(console.error);
