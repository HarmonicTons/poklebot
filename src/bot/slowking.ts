import { getChoiceWithRecommendation, Greediness } from "../entropy/entropy";
import { Card, CardString } from "../poker/Card";
import { BoardCards } from "../poker/Poker";
import { Pokle } from "../pokle/Pokle";
import { Recommendation } from "./Recommendation";
import { ParentMessage } from "./unrestricted";

/**
 * Slowking evaluate all 27 million possibles guesses
 */
const getSlowkingRecommendation = (
  pokle: Pick<Pokle, "validCards" | "remainingBoards">,
  greediness: Greediness,
  sliceStart: number,
  sliceEnd: number
) => {
  const cards = pokle.validCards;
  const boards = pokle.remainingBoards;
  if (cards === null || boards === null) {
    throw new Error("Pokle must be solved first");
  }

  const possibleGuesses: BoardCards[] = [];
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        for (let l = 0; l < cards.length; l++) {
          if (i === l || j === l || k === l) {
            continue;
          }
          for (let m = 0; m < cards.length; m++) {
            if (i === m || j === m || k === m || l === m) {
              continue;
            }
            possibleGuesses.push([
              cards[i],
              cards[j],
              cards[k],
              cards[m],
              cards[l],
            ]);
          }
        }
      }
    }
  }
  const playedBoards = possibleGuesses.slice(sliceStart, sliceEnd);

  return getChoiceWithRecommendation({
    choices: playedBoards,
    possibleAnswers: boards,
    getOutcome: (board1, board2) =>
      Pokle.getBoardPattern(
        board1,
        board2,
        pokle.remainingBoards as BoardCards[]
      ).join(""),
    getProbabilityOfBeingAnswer: (outcomes) => {
      return (outcomes["🟩🟩🟩🟩🟩"] ?? 0) / boards.length;
    },
    greediness,
  });
};

export type ChildrenMessage = {
  choice: CardString[];
  entropy: number;
  probabilityOfBeingAnswer: number;
  recommendationIndex: number;
};

const main = async () => {
  const parentMessage = await new Promise<ParentMessage>((resolve) => {
    process.on("message", (parentMessage: ParentMessage) => {
      resolve(parentMessage);
    });
  });
  console.log(
    `New child process looking from ${parentMessage.sliceStart} to ${parentMessage.sliceEnd}`
  );
  const recommendation: Recommendation = await getSlowkingRecommendation(
    {
      validCards: parentMessage.pokle.validCards.map((c) => Card.fromString(c)),
      remainingBoards: parentMessage.pokle.remainingBoards.map(
        ([a, b, c, d, e]) => [
          Card.fromString(a),
          Card.fromString(b),
          Card.fromString(c),
          Card.fromString(d),
          Card.fromString(e),
        ]
      ),
    },
    parentMessage.greediness,
    parentMessage.sliceStart,
    parentMessage.sliceEnd
  );

  const childrenMessage: ChildrenMessage = {
    choice: recommendation.choice.map((c) => c.toString()),
    entropy: recommendation.entropy,
    probabilityOfBeingAnswer: recommendation.probabilityOfBeingAnswer,
    recommendationIndex: recommendation.recommendationIndex,
  };

  process.send?.(childrenMessage);
};

main();
