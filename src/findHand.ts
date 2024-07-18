import { orderBy } from "lodash";
import { CardType, HexCardRank } from "./poker/Card";
import {
  HexHandRank,
  getHexHandRank,
  HandCards,
  HandScore,
} from "./poker/Hand";

export const findHandTypeSimple = (
  handCards: HandCards
): {
  handType: HexHandRank;
  scoringCards: CardType[];
  kickers: CardType[];
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
    const handType = getHexHandRank("SF");
    const scoringCards = orderCardsByRank(handCards);
    const kickers: CardType[] = [];
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
  }, [] as HexCardRank[]);

  if (pairingValues.length === 3) {
    const allSame = pairingValues.every((pair) => pair === pairingValues[0]);
    if (allSame) {
      const handType = getHexHandRank("4K");
      const scoringCards = orderCardsByRank(
        handCards.filter(([v, _]) => v === pairingValues[0])
      );
      const kickers = orderCardsByRank(
        handCards.filter(([v, _]) => v !== pairingValues[0])
      );
      const handScore = getHandScore(handType, scoringCards, kickers);
      return { handType, scoringCards, kickers, handScore };
    }
    const handType = getHexHandRank("FH");
    const trio =
      pairingValues[0] === pairingValues[1]
        ? pairingValues[0]
        : pairingValues[2];
    const scoringCards = orderBy(
      handCards,
      (card) => (card[0] === trio ? 1 : 0),
      "desc"
    );
    const kickers: CardType[] = [];
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }

  if (isFlush) {
    const handType = getHexHandRank("FL");
    const scoringCards = orderCardsByRank(handCards);
    const kickers: CardType[] = [];
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }

  if (isStraight) {
    const handType = getHexHandRank("ST");
    const scoringCards = orderCardsByRank(handCards);
    const kickers: CardType[] = [];
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }

  if (pairingValues.length === 2) {
    const allSame = pairingValues.every((pair) => pair === pairingValues[0]);
    if (allSame) {
      const handType = getHexHandRank("3K");
      const scoringCards = orderCardsByRank(
        handCards.filter(([v, _]) => v === pairingValues[0])
      );
      const kickers = orderCardsByRank(
        handCards.filter(([v, _]) => v !== pairingValues[0])
      );
      const handScore = getHandScore(handType, scoringCards, kickers);
      return { handType, scoringCards, kickers, handScore };
    }
    const handType = getHexHandRank("DP");
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
    const handType = getHexHandRank("P");
    const scoringCards = orderCardsByRank(
      handCards.filter(([v, _]) => v === pairingValues[0])
    );
    const kickers = orderCardsByRank(
      handCards.filter(([v, _]) => v !== pairingValues[0])
    );
    const handScore = getHandScore(handType, scoringCards, kickers);
    return { handType, scoringCards, kickers, handScore };
  }
  const handType = getHexHandRank("HC");
  const scoringCards: CardType[] = [];
  const kickers = orderCardsByRank(handCards);
  const handScore = getHandScore(handType, scoringCards, kickers);
  return { handType, scoringCards, kickers, handScore };
};

export const orderCardsByRank = (cards: CardType[]): CardType[] => {
  return orderBy(cards, "0", "desc");
};

export const getHandScore = (
  handType: HexHandRank,
  scoringCards: CardType[],
  kickers: CardType[]
): string => {
  return (
    handType +
    scoringCards.map(([v, _]) => v).join("") +
    kickers.map(([v, _]) => v).join("")
  );
};

export const getAllHandsOutOf6Cards = (cards: CardType[]): HandCards[] => {
  const hands: HandCards[] = [];
  for (let i = 0; i < 6; i++) {
    const hand = [...cards];
    hand.splice(i, 1);
    hands.push(hand as HandCards);
  }
  return hands;
};

export const getAllHandsOutOf7Cards = (cards: CardType[]): HandCards[] => {
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
  cards: CardType[]
): {
  handType: HexHandRank;
  scoringCards: CardType[];
  kickers: CardType[];
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
