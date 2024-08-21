import memoize from "memoizee";
import { Greediness } from "../entropy/entropy";
import { Pokle } from "../pokle/Pokle";
import {
  getGreedyRecommendation,
  getKamikazeRecommendation,
  getRandomRecommendation,
  getRestrictedRecommendation,
  getUnhurriedRecommendation,
} from "./restricted";
import {
  getSlowkingRecommendation,
  getUnrestrictedRecommendation,
} from "./unrestricted";
import { Card } from "../poker/Card";
import { BoardCards } from "../poker/Poker";

export type Mode =
  | "random"
  | "restricted"
  | "unrestricted"
  | "kamikaze"
  | "greedy"
  | "slowking"
  | "unhurried";
export const modeLabel: Record<Mode, string> = {
  random: "Random 🙈",
  restricted: "Restricted 😤",
  unrestricted: "Unrestricted ⛓️‍💥",
  kamikaze: "Kamikaze 💣",
  greedy: "Greedy 🤑",
  slowking: "Slowking 👑🐚",
  unhurried: "Unhurried 🦥",
};

const getGreediness = (guessNumber: number): Greediness => {
  if (guessNumber === 6) {
    // last chance to not lose, play the most likely board
    return 0.99;
  }
  return 0.5;
};

export const getRecommendation = memoize(
  async (mode: Mode, guessNumber: number, pokle: Pokle) => {
    // shortcut for when there's only one board left
    if (pokle.remainingBoards?.length === 1) {
      return {
        choice: pokle.remainingBoards[0],
        entropy: NaN,
        probabilityOfBeingAnswer: 1,
        recommendationIndex: 1,
      };
    }

    // shortcut for when there are only two boards left and they are both ok thanks to autocorrect
    if (pokle.remainingBoards?.length === 2) {
      const mutualResult = Pokle.getBoardPattern(
        pokle.remainingBoards[0],
        pokle.remainingBoards[1],
        pokle.remainingBoards as BoardCards[]
      ).join("");
      const autocorrected = mutualResult === "🟩🟩🟩🟩🟩";
      if (autocorrected) {
        return {
          choice: pokle.remainingBoards[0],
          entropy: NaN,
          probabilityOfBeingAnswer: 1,
          recommendationIndex: 1,
        };
      }
    }

    // shortcut for slowking when generating stats
    // if (pokle.remainingBoards?.length === 216) {
    //   return {
    //     choice: ["5♣", "5♥", "5♦", "9♦", "8♥"].map((c) =>
    //       Card.fromString(c as any)
    //     ) as BoardCards,
    //     entropy: NaN,
    //     probabilityOfBeingAnswer: NaN,
    //     recommendationIndex: NaN,
    //   };
    // }

    // increase greediness each turn
    const greediness: Greediness = getGreediness(guessNumber);
    const recommendation = (() => {
      switch (mode) {
        case "random":
          return getRandomRecommendation(pokle, greediness);
        case "restricted":
          return getRestrictedRecommendation(pokle, greediness);
        case "unrestricted":
          return getUnrestrictedRecommendation(pokle, greediness);
        case "kamikaze":
          return getKamikazeRecommendation(pokle, greediness);
        case "greedy":
          return getGreedyRecommendation(pokle);
        case "slowking":
          return getSlowkingRecommendation(pokle, greediness);
        case "unhurried":
          return getUnhurriedRecommendation(pokle);
      }
    })();

    return recommendation;
  },
  {
    normalizer: function ([mode, guessNumber, pokle]) {
      return JSON.stringify({
        mode,
        guessNumber,
        pokle,
        remainingBoards: pokle.remainingBoards,
      });
    },
  }
);
