import { orderBy } from "lodash";

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
export const ENCODED_CARD_VALUES = [
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
export type EncodedCardValue = (typeof ENCODED_CARD_VALUES)[number];

export const encodedCardValueRecord: Record<CardValue, EncodedCardValue> = {
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
export const getEncodedCardValue = (cardValue: CardValue): EncodedCardValue => {
  return encodedCardValueRecord[cardValue];
};

export const CARD_COLORS = ["♠", "♣", "♥", "♦"] as const;
export type CardColor = (typeof CARD_COLORS)[number];

export type Card = [EncodedCardValue, CardColor];

export const cardsAreEqual = (card1: Card, card2: Card) => {
  return card1[0] === card2[0] && card1[1] === card2[1];
};

export type HandCards = [Card, Card, Card, Card, Card];

export const HAND_TYPES = [
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
export type HandType = (typeof HAND_TYPES)[number];

export const ENCODED_HAND_TYPES = [
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
export type EncodedHandType = (typeof ENCODED_HAND_TYPES)[number];

export const encodedHandTypeRecord: Record<HandType, EncodedHandType> = {
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
export const getEncodedHandType = (handType: HandType): EncodedHandType => {
  return encodedHandTypeRecord[handType];
};

export type HandScore = string;

export const findHandTypeSimple = (
  handCards: HandCards
): {
  handType: EncodedHandType;
  scoringCards: Card[];
  kickers: Card[];
  handScore: HandScore;
} => {
  const cardValues = handCards
    .map(([cardValue, _]) => cardValue)
    .sort()
    .reverse();
  const cardColors = handCards.map(([_, cardColor]) => cardColor);

  const isFlush = cardColors.every((cardColor) => cardColor === cardColors[0]);

  const isStraight = cardValues.every((cardValue, index) =>
    index === 0
      ? true
      : parseInt(cardValue, 16) === parseInt(cardValues[index - 1], 16) - 1
  );

  if (isFlush && isStraight) {
    const handType = getEncodedHandType("SF");
    const scoringCards = orderCardsByRank(handCards);
    const kickers: Card[] = [];
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }

  const pairingValues = cardValues.reduce((acc, cardValue, i) => {
    if (i === 0) {
      return acc;
    }
    if (cardValue === cardValues[i - 1]) {
      acc.push(cardValue);
    }
    return acc;
  }, [] as EncodedCardValue[]);

  if (pairingValues.length === 3) {
    const allSame = pairingValues.every((pair) => pair === pairingValues[0]);
    if (allSame) {
      const handType = getEncodedHandType("4K");
      const scoringCards = orderCardsByRank(
        handCards.filter(([v, _]) => v === pairingValues[0])
      );
      const kickers = orderCardsByRank(
        handCards.filter(([v, _]) => v !== pairingValues[0])
      );
      const handScore = getHandScore(handType, scoringCards, kickers);
      return { handType, scoringCards, kickers, handScore };
    }
    const handType = getEncodedHandType("FH");
    const trio =
      pairingValues[0] === pairingValues[1]
        ? pairingValues[0]
        : pairingValues[2];
    const scoringCards = orderBy(
      handCards,
      (card) => (card[0] === trio ? 1 : 0),
      "desc"
    );
    const kickers: Card[] = [];
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }

  if (isFlush) {
    const handType = getEncodedHandType("FL");
    const scoringCards = orderCardsByRank(handCards);
    const kickers: Card[] = [];
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }

  if (isStraight) {
    const handType = getEncodedHandType("ST");
    const scoringCards = orderCardsByRank(handCards);
    const kickers: Card[] = [];
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }

  if (pairingValues.length === 2) {
    const allSame = pairingValues.every((pair) => pair === pairingValues[0]);
    if (allSame) {
      const handType = getEncodedHandType("3K");
      const scoringCards = orderCardsByRank(
        handCards.filter(([v, _]) => v === pairingValues[0])
      );
      const kickers = orderCardsByRank(
        handCards.filter(([v, _]) => v !== pairingValues[0])
      );
      const handScore = getHandScore(handType, scoringCards, kickers);
      return { handType, scoringCards, kickers, handScore };
    }
    const handType = getEncodedHandType("DP");
    const scoringCards = orderCardsByRank(
      handCards.filter(
        ([v, _]) => v === pairingValues[0] || v === pairingValues[1]
      )
    );
    const kickers = orderCardsByRank(
      handCards.filter(
        ([v, _]) => v !== pairingValues[0] && v !== pairingValues[1]
      )
    );
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }
  if (pairingValues.length === 1) {
    const handType = getEncodedHandType("P");
    const scoringCards = orderCardsByRank(
      handCards.filter(([v, _]) => v === pairingValues[0])
    );
    const kickers = orderCardsByRank(
      handCards.filter(([v, _]) => v !== pairingValues[0])
    );
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }
  const handType = getEncodedHandType("HC");
  const scoringCards: Card[] = [];
  const kickers = orderCardsByRank(handCards);
  const handScore = getHandScore(handType, scoringCards, kickers);
  return { handType, scoringCards, kickers, handScore };
};

export const orderCardsByRank = (cards: Card[]): Card[] => {
  return orderBy(cards, "0", "desc");
};

export const getHandScore = (
  handType: EncodedHandType,
  scoringCards: Card[],
  kickers: Card[]
): string => {
  return (
    handType +
    scoringCards.map(([v, _]) => v).join("") +
    kickers.map(([v, _]) => v).join("")
  );
};

export const getAllHandsOutOf6Cards = (cards: Card[]): HandCards[] => {
  const hands: HandCards[] = [];
  for (let i = 0; i < 6; i++) {
    const hand = [...cards];
    hand.splice(i, 1);
    hands.push(hand as HandCards);
  }
  return hands;
};

export const getAllHandsOutOf7Cards = (cards: Card[]): HandCards[] => {
  const hands: HandCards[] = [];
  for (let i = 0; i < 7; i++) {
    for (let j = i + 1; j < 7; j++) {
      const hand = [...cards];
      hand.splice(j, 1);
      hand.splice(i, 1);
      hands.push(hand as HandCards);
    }
  }
  return hands;
};

export const findHandType = (
  cards: Card[]
): {
  handType: EncodedHandType;
  scoringCards: Card[];
  kickers: Card[];
  handScore: HandScore;
} => {
  if (cards.length === 5) {
    return findHandTypeSimple(cards as HandCards);
  }
  if (cards.length === 6) {
    const hands = getAllHandsOutOf6Cards(cards);
    const handsWithTypes = hands.map((hand) => findHandTypeSimple(hand));
    return orderBy(handsWithTypes, "handScore", "desc")[0];
  }
  if (cards.length === 7) {
    const hands = getAllHandsOutOf7Cards(cards);
    const handsWithTypes = hands.map((hand) => findHandTypeSimple(hand));
    return orderBy(handsWithTypes, "handScore", "desc")[0];
  }
  throw new Error("Invalid number of cards");
};
