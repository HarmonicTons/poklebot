import { CardType } from "./Card";

export type HandCards = [CardType, CardType, CardType, CardType, CardType];

export const HAND_RANKS = [
  "HC",
  "P",
  "DP",
  "3K",
  "ST",
  "FL",
  "FH",
  "4K",
  "SF",
] as const;
export type HandRank = (typeof HAND_RANKS)[number];

export const HEX_HAND_RANKS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
] as const;
export type HexHandRank = (typeof HEX_HAND_RANKS)[number];

export const hexHandRankRecord: Record<HandRank, HexHandRank> = {
  HC: "0",
  P: "1",
  DP: "2",
  "3K": "3",
  ST: "4",
  FL: "5",
  FH: "6",
  "4K": "7",
  SF: "8",
};
export const getHexHandRank = (handRank: HandRank): HexHandRank => {
  return hexHandRankRecord[handRank];
};

export type HandScore = string;

export class Hand {
  constructor(public readonly cards: HandCards) {}

  private init() {}
}
