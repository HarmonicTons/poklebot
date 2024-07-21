import { ChoiceWithRecommendation } from "../entropy/entropy";
import { BoardCards } from "../poker/Poker";

export type Recommendation = ChoiceWithRecommendation<BoardCards, string>;
