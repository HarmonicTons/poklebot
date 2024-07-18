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
export const getHexCardRank = (cardRank: CardRank): HexCardRank => {
  return hexCardRankRecord[cardRank];
};

export const CARD_SUITS = ["♠", "♣", "♥", "♦"] as const;
export type CardSuite = (typeof CARD_SUITS)[number];

export type CardType = [HexCardRank, CardSuite];

export const cardsAreEqual = (card1: CardType, card2: CardType) => {
  return card1[0] === card2[0] && card1[1] === card2[1];
};

export class Card {
  constructor(public rank: HexCardRank, public suit: CardSuite) {}

  public toString() {
    return `${this.rank}${this.suit}`;
  }

  public isEqual(card: Card) {
    return this.rank === card.rank && this.suit === card.suit;
  }
}
