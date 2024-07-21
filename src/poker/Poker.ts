import { Card, CardString } from "./Card";

export type PlayerCards = [Card, Card];

export const STAGES = ["flop", "turn", "river"] as const;
export type Stage = (typeof STAGES)[number];

export type FlopCards = [Card, Card, Card];

export type TurnCard = Card;
export type TurnCards = [...FlopCards, TurnCard];

export type RiverCard = Card;
export type RiverCards = [...TurnCards, Card];

export type BoardCards = RiverCards;

export const getBoardFromJson = (
  json: [string, string, string, string, string]
): BoardCards => {
  return json.map((card) => Card.fromString(card as CardString)) as BoardCards;
};
