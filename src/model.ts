export const CARD_VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;
export type CardValue = (typeof CARD_VALUES)[number];
export const CARD_COLORS = ["♠", "♣", "♥", "♦"] as const;
export type CardColor = (typeof CARD_COLORS)[number];

export type Card = {
  value: CardValue;
  color: CardColor;
};

export type Hand = [Card, Card];

export const STAGES = ["flop", "turn", "river"] as const;
export type Stage = (typeof STAGES)[number];

export type StagesScore = Record<Stage, 1 | 2 | 3>;

export type Player = {
  name: string;
  hand: Hand;
  stagesScore: StagesScore;
};

export type Problem = [Player, Player, Player];

export type Flop = [Card, Card, Card];
export type Turn = Card;
export type River = Card;

export type Guess = {
  flop: Flop;
  turn: Turn;
  river: River;
};

export const POKER_HANDS = [
  "High card",
  "Pair",
  "Two pairs",
  "Three of a kind",
  "Straight",
  "Flush",
  "Full house",
  "Four of a kind",
  "Straight flush",
] as const;
export type PokerHand = (typeof POKER_HANDS)[number];
