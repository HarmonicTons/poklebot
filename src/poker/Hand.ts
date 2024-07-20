import { orderBy } from "lodash";
import { Card, HexCardRank } from "./Card";

export type HandCards = [Card, Card, Card, Card, Card];

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

export type HexHandScore = string;

export class Hand {
  public rank: HandRank;
  public primaryCards: Card[];
  public kickers: Card[];
  constructor(public readonly cards: HandCards) {
    const { handRank, primaryCards, kickers } = this.init(cards);
    this.rank = handRank;
    this.primaryCards = primaryCards;
    this.kickers = kickers;
  }

  private init(cards: HandCards): {
    handRank: HandRank;
    primaryCards: Card[];
    kickers: Card[];
  } {
    const cardHexRanks = this.cards
      .map((card) => card.hexRank)
      .sort()
      .reverse();
    const cardSuits = this.cards.map((card) => card.suit);

    const isFlush = cardSuits.every((suit) => suit === cardSuits[0]);

    const isStraight = cardHexRanks.every((hexRank, index) => {
      if (index === 0) {
        return true;
      }
      // aces can be treated as 1 or A
      if (hexRank === "5" && index === 1 && cardHexRanks[0] === "e") {
        return true;
      }
      return (
        parseInt(hexRank, 16) === parseInt(cardHexRanks[index - 1], 16) - 1
      );
    });

    // SF
    if (isFlush && isStraight) {
      const primaryCards = Card.orderByRank(cards);
      const kickers: Card[] = [];
      return { handRank: "SF", primaryCards, kickers };
    }

    const pairingValues = cardHexRanks.reduce((_pairingValues, cardRank, i) => {
      if (i === 0) {
        return _pairingValues;
      }
      if (cardRank === cardHexRanks[i - 1]) {
        _pairingValues.push(cardRank);
      }
      return _pairingValues;
    }, [] as HexCardRank[]);

    // 4K or FH
    if (pairingValues.length === 3) {
      const allSame = pairingValues.every((pair) => pair === pairingValues[0]);
      if (allSame) {
        const primaryCards = Card.orderByRank(
          cards.filter((card) => card.hexRank === pairingValues[0])
        );
        const kickers = Card.orderByRank(
          cards.filter((card) => card.hexRank !== pairingValues[0])
        );
        return { handRank: "4K", primaryCards, kickers };
      }
      const trio =
        pairingValues[0] === pairingValues[1]
          ? pairingValues[0]
          : pairingValues[2];
      const primaryCards = orderBy(
        cards,
        (card) => (card.hexRank === trio ? 1 : 0),
        "desc"
      );
      const kickers: Card[] = [];
      return { handRank: "FH", primaryCards, kickers };
    }

    // FL
    if (isFlush) {
      const primaryCards = Card.orderByRank(cards);
      const kickers: Card[] = [];
      return { handRank: "FL", primaryCards, kickers };
    }

    // ST
    if (isStraight) {
      const primaryCards = Card.orderByRank(cards);
      const kickers: Card[] = [];
      return { handRank: "ST", primaryCards, kickers };
    }

    // 3K or DP
    if (pairingValues.length === 2) {
      const allSame = pairingValues.every((pair) => pair === pairingValues[0]);
      if (allSame) {
        const primaryCards = Card.orderByRank(
          cards.filter((card) => card.hexRank === pairingValues[0])
        );
        const kickers = Card.orderByRank(
          cards.filter((card) => card.hexRank !== pairingValues[0])
        );
        return { handRank: "3K", primaryCards, kickers };
      }
      const primaryCards = Card.orderByRank(
        cards.filter(
          (card) =>
            card.hexRank === pairingValues[0] ||
            card.hexRank === pairingValues[1]
        )
      );
      const kickers = Card.orderByRank(
        cards.filter(
          (card) =>
            card.hexRank !== pairingValues[0] &&
            card.hexRank !== pairingValues[1]
        )
      );
      return { handRank: "DP", primaryCards, kickers };
    }

    // P
    if (pairingValues.length === 1) {
      const primaryCards = Card.orderByRank(
        cards.filter((card) => card.hexRank === pairingValues[0])
      );
      const kickers = Card.orderByRank(
        cards.filter((card) => card.hexRank !== pairingValues[0])
      );
      return { handRank: "P", primaryCards, kickers };
    }

    // HC
    const primaryCards: Card[] = [];
    const kickers = Card.orderByRank(cards);
    return { handRank: "HC", primaryCards, kickers };
  }

  public get hexRank(): HexHandRank {
    return hexHandRankRecord[this.rank];
  }

  public get hexScore(): HexHandScore {
    const score =
      this.hexRank +
      this.primaryCards.map((card) => card.hexRank).join("") +
      this.kickers.map((card) => card.hexRank).join("");

    // handle special case for straight where the ace is the lowest card
    if (score === "4e5432") {
      return "454321";
    }
    if (score === "8e5432") {
      return "854321";
    }
    return score;
  }

  public static orderByScore(hands: Hand[]): Hand[] {
    return orderBy(hands, "hexScore", "desc");
  }

  public static getBestHand(cards: Card[]): Hand {
    if (cards.length === 5) {
      return new Hand(cards as HandCards);
    }

    if (cards.length === 6) {
      const handsCards: HandCards[] = [];
      for (let i = 0; i < 6; i++) {
        const hand = [...cards];
        hand.splice(i, 1);
        handsCards.push(hand as HandCards);
      }
      const hands = handsCards.map((handCards) => new Hand(handCards));
      return Hand.orderByScore(hands)[0];
    }

    if (cards.length === 7) {
      const handsCards: HandCards[] = [];
      for (let i = 0; i < 7; i++) {
        for (let j = i + 1; j < 7; j++) {
          const hand = [...cards];
          hand.splice(j, 1);
          hand.splice(i, 1);
          handsCards.push(hand as HandCards);
        }
      }
      const hands = handsCards.map((handCards) => new Hand(handCards));
      return Hand.orderByScore(hands)[0];
    }

    throw new Error("Invalid number of cards");
  }

  public isAsGoodAs(hand: Hand): boolean {
    return this.hexScore === hand.hexScore;
  }

  public isBetterThan(hand: Hand): boolean {
    return this.hexScore > hand.hexScore;
  }

  public isWorseThan(hand: Hand): boolean {
    return this.hexScore < hand.hexScore;
  }
}
