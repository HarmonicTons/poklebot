import memoize from "memoizee";
import { Greediness } from "../entropy/entropy";
import { Pokle } from "../pokle/Pokle";
import {
  getGreedyRecommendation,
  getKamikazeRecommendation,
  getRandomRecommendation,
  getRestrictedRecommendation,
} from "./restricted";
import {
  getSlowkingRecommendation,
  getUnrestrictedRecommendation,
} from "./unrestricted";

export type Mode =
  | "random"
  | "restricted"
  | "unrestricted"
  | "kamikaze"
  | "greedy"
  | "slowking";
export const modeLabel: Record<Mode, string> = {
  random: "Random 🙈",
  restricted: "Restricted 😤",
  unrestricted: "Unrestricted ⛓️‍💥",
  kamikaze: "Kamikaze 💣",
  greedy: "Greedy 🤑",
  slowking: "Slowking 👑🐚",
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
    if (pokle.remainingBoards?.length === 1) {
      return {
        choice: pokle.remainingBoards[0],
        entropy: NaN,
        probabilityOfBeingAnswer: 1,
        recommendationIndex: 1,
      };
    }
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
