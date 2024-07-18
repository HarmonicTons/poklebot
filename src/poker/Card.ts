import { orderBy } from "lodash";

export const CARD_RANKS = [
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
export type CardRank = (typeof CARD_RANKS)[number];
export const HEX_CARD_RANK = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
] as const;
export type HexCardRank = (typeof HEX_CARD_RANK)[number];

export const hexCardRankRecord: Record<CardRank, HexCardRank> = {
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "a",
  J: "b",
  Q: "c",
  K: "d",
  A: "e",
};

export const CARD_SUITS = ["♠", "♣", "♥", "♦"] as const;
export type CardSuit = (typeof CARD_SUITS)[number];

export type CardString = `${CardRank}${CardSuit}`;

export class Card {
  constructor(public rank: CardRank, public suit: CardSuit) {}

  public toString(): CardString {
    return `${this.rank}${this.suit}`;
  }

  public isEqual(card: Card) {
    return this.rank === card.rank && this.suit === card.suit;
  }

  public get hexRank(): HexCardRank {
    return hexCardRankRecord[this.rank];
  }

  public static orderByRank(cards: Card[]): Card[] {
    return orderBy(cards, "hexRank", "desc");
  }

  public static fromString(str: CardString): Card {
    return new Card(str[0] as CardRank, str[1] as CardSuit);
  }
}
