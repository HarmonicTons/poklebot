import { Greediness } from "../entropy/entropy";
import { Pokle } from "../pokle/Pokle";
import { Recommendation } from "./Recommendation";
import {
  getGreedyRecommendation,
  getKamikazeRecommendation,
  getRandomRecommendation,
  getRestrictedRecommendation,
} from "./restricted";
import { getUnrestrictedRecommendation } from "./unrestricted";

export type Mode =
  | "random"
  | "restricted"
  | "unrestricted"
  | "kamikaze"
  | "greedy";
export const modeLabel: Record<Mode, string> = {
  random: "Random 🙈",
  restricted: "Restricted 😤",
  unrestricted: "Unrestricted ⛓️‍💥",
  kamikaze: "Kamikaze 💣",
  greedy: "Greedy 🤑",
};

export const getRecommendation = (
  mode: Mode,
  guessNumber: number,
  pokle: Pokle
) => {
  // increase greediness each turn
  const greediness: Greediness = 0.5 + guessNumber * 0.1;
  const recommendation: Recommendation = (() => {
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
    }
  })();

  return recommendation;
};
