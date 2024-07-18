import {
  Card,
  CARD_SUITS,
  CardRank,
  CardString,
  CardSuit,
  HEX_CARD_RANK,
  HexCardRank,
} from "./poker/Card";
import { Hand } from "./poker/Hand";

type CardType = [HexCardRank, CardSuit];

export type PlayerCards = [CardType, CardType];
export type PlayersCards = [PlayerCards, PlayerCards, PlayerCards];
export type PlayerPosition = 1 | 2 | 3;
export type PlayersPositions = [PlayerPosition, PlayerPosition, PlayerPosition];

export type Player = {
  name: string;
  cards: PlayerCards;
  positions: {
    flop: PlayerPosition;
    turn: PlayerPosition;
    river: PlayerPosition;
  };
};
export type Players = [Player, Player, Player];

export type FlopCards = [CardType, CardType, CardType];

export const brutForceSolution = (
  players: Players
): { boards: BoardCards[]; cards: CardType[] } => {
  const validCards = getValidCards(players);

  const flops = getAllValidFlops(players, validCards);

  const turns = getAllValidTurns(players, validCards, flops);

  const boards = getAllValidRivers(players, validCards, turns);

  const validBoards = filterOutBoardsContainingKickers(players, boards);

  return { boards: validBoards, cards: validCards };
};

export const getValidCards = (players: Players): CardType[] => {
  // TODO remove obvious kickers (cannot be part of any straight)
  const usedCards: Record<string, boolean> = {};
  players.forEach((player) => {
    player.cards.forEach(([v, c]) => {
      usedCards[`${v}${c}`] = true;
    });
  });

  const validCards: CardType[] = [];

  for (let i = 0; i < HEX_CARD_RANK.length; i++) {
    const v1 = HEX_CARD_RANK[i];
    for (let j = 0; j < CARD_SUITS.length; j++) {
      const c1 = CARD_SUITS[j];
      if (usedCards[`${v1}${c1}`]) {
        continue;
      }
      validCards.push([v1, c1]);
    }
  }
  console.log("validCards", validCards.length);
  return validCards;
};

export const areScoreValids = (
  playersPositions: [PlayerPosition, PlayerPosition, PlayerPosition],
  playersScores: [string, string, string]
): boolean => {
  if (playersPositions[0] > playersPositions[1]) {
    if (playersScores[0] >= playersScores[1]) {
      return false;
    }
  } else if (playersPositions[0] < playersPositions[1]) {
    if (playersScores[0] <= playersScores[1]) {
      return false;
    }
  } else {
    if (playersScores[0] !== playersScores[1]) {
      return false;
    }
  }

  if (playersPositions[0] > playersPositions[2]) {
    if (playersScores[0] > playersScores[2]) {
      return false;
    }
  } else if (playersPositions[0] < playersPositions[2]) {
    if (playersScores[0] <= playersScores[2]) {
      return false;
    }
  } else {
    if (playersScores[0] !== playersScores[2]) {
      return false;
    }
  }

  if (playersPositions[2] > playersPositions[1]) {
    if (playersScores[2] >= playersScores[1]) {
      return false;
    }
  } else if (playersPositions[2] < playersPositions[1]) {
    if (playersScores[2] <= playersScores[1]) {
      return false;
    }
  } else {
    if (playersScores[2] !== playersScores[1]) {
      return false;
    }
  }
  return true;
};

export const isFlopValid = (
  flopCards: FlopCards,
  players: Players
): boolean => {
  const p1Score = Hand.getBestHand(
    [...players[0].cards, ...flopCards].map((c) => Card.fromHexArray(c))
  ).hexScore;
  const p2Score = Hand.getBestHand(
    [...players[1].cards, ...flopCards].map((c) => Card.fromHexArray(c))
  ).hexScore;
  const p3Score = Hand.getBestHand(
    [...players[2].cards, ...flopCards].map((c) => Card.fromHexArray(c))
  ).hexScore;

  return areScoreValids(
    [
      players[0].positions.flop,
      players[1].positions.flop,
      players[2].positions.flop,
    ],
    [p1Score, p2Score, p3Score]
  );
};

export const getAllValidFlops = (
  players: Players,
  validCards: CardType[]
): FlopCards[] => {
  let n = 0;
  let flops: FlopCards[] = [];

  for (let ci1 = 0; ci1 < validCards.length; ci1++) {
    const c1 = validCards[ci1];
    for (let ci2 = ci1 + 1; ci2 < validCards.length; ci2++) {
      const c2 = validCards[ci2];
      for (let ci3 = ci2 + 1; ci3 < validCards.length; ci3++) {
        const c3 = validCards[ci3];
        const flopCards: FlopCards = [c1, c2, c3];

        const p1Score = Hand.getBestHand(
          [...players[0].cards, ...flopCards].map((c) => Card.fromHexArray(c))
        ).hexScore;
        const p2Score = Hand.getBestHand(
          [...players[1].cards, ...flopCards].map((c) => Card.fromHexArray(c))
        ).hexScore;
        const p3Score = Hand.getBestHand(
          [...players[2].cards, ...flopCards].map((c) => Card.fromHexArray(c))
        ).hexScore;

        n++;
        if (
          areScoreValids(
            [
              players[0].positions.flop,
              players[1].positions.flop,
              players[2].positions.flop,
            ],
            [p1Score, p2Score, p3Score]
          ) === true
        ) {
          flops.push(flopCards);
        }
      }
    }
  }

  console.log(`flops: ${flops.length}/${n}`);

  return flops;
};

export type TurnCards = [CardType, CardType, CardType, CardType];

export const getAllValidTurns = (
  players: Players,
  validCards: CardType[],
  flops: FlopCards[]
): TurnCards[] => {
  let n = 0;
  let turns: TurnCards[] = [];

  for (const flop of flops) {
    for (let ci1 = 0; ci1 < validCards.length; ci1++) {
      const c1 = validCards[ci1];
      const isUsed = flop.some((f) => f[0] === c1[0] && f[1] === c1[1]);
      if (isUsed) {
        continue;
      }
      n++;

      const turnCards: TurnCards = [...flop, c1];

      const p1Cards = [...players[0].cards, ...turnCards];
      const p1Score = Hand.getBestHand(
        p1Cards.map((c) => Card.fromHexArray(c))
      ).hexScore;
      const p2Cards = [...players[1].cards, ...turnCards];
      const p2Score = Hand.getBestHand(
        p2Cards.map((c) => Card.fromHexArray(c))
      ).hexScore;
      const p3Cards = [...players[2].cards, ...turnCards];
      const p3Score = Hand.getBestHand(
        p3Cards.map((c) => Card.fromHexArray(c))
      ).hexScore;

      n++;
      if (
        areScoreValids(
          [
            players[0].positions.turn,
            players[1].positions.turn,
            players[2].positions.turn,
          ],
          [p1Score, p2Score, p3Score]
        ) === true
      ) {
        turns.push(turnCards);
      }
    }
  }

  console.log(`turns: ${turns.length}/${n}`);

  return turns;
};

export type BoardCards = [CardType, CardType, CardType, CardType, CardType];

export const getAllValidRivers = (
  players: Players,
  validCards: CardType[],
  turns: TurnCards[]
): BoardCards[] => {
  let n = 0;
  let rivers: BoardCards[] = [];

  for (const turn of turns) {
    for (let ci1 = 0; ci1 < validCards.length; ci1++) {
      const c1 = validCards[ci1];
      const isUsed = turn.some((t) => t[0] === c1[0] && t[1] === c1[1]);
      if (isUsed) {
        continue;
      }

      const riverCards: BoardCards = [...turn, c1];

      const p1Cards = [...players[0].cards, ...riverCards];
      const p1Score = Hand.getBestHand(
        p1Cards.map((c) => Card.fromHexArray(c))
      ).hexScore;
      const p2Cards = [...players[1].cards, ...riverCards];
      const p2Score = Hand.getBestHand(
        p2Cards.map((c) => Card.fromHexArray(c))
      ).hexScore;
      const p3Cards = [...players[2].cards, ...riverCards];
      const p3Score = Hand.getBestHand(
        p3Cards.map((c) => Card.fromHexArray(c))
      ).hexScore;

      n++;
      if (
        areScoreValids(
          [
            players[0].positions.river,
            players[1].positions.river,
            players[2].positions.river,
          ],
          [p1Score, p2Score, p3Score]
        ) === true
      ) {
        rivers.push(riverCards);
      }
    }
  }

  console.log(`rivers: ${rivers.length}/${n}`);

  return rivers;
};

/**
 * No kickers on the board
 * The rank of each board card will always be a part of at least one player's hand in at least one phase.
 * "part of a hand" means the significant card(s) in: Pair, Two Pair, Three of a Kind or Four of a Kind (not kickers)
 */
export const filterOutBoardsContainingKickers = (
  players: Players,
  boards: BoardCards[]
): BoardCards[] => {
  let n = 0;
  const filteredBoards: BoardCards[] = [];
  for (const board of boards) {
    const boardCards = board.map((card) => ({
      card,
      isKicker: true,
    }));

    const flopCards = board.slice(0, 3);
    const turnCards = board.slice(0, 4);
    const riverCards = [...board];

    for (const player of players) {
      boardCards.forEach((boardCard) => {
        if (
          boardCard.card[0] === player.cards[0][0] ||
          boardCard.card[0] === player.cards[1][0]
        ) {
          boardCard.isKicker = false;
        }
      });
      for (const cards of [flopCards, turnCards, riverCards]) {
        const allCards = [...cards, ...player.cards];
        const hand = Hand.getBestHand(
          allCards.map((c) => Card.fromHexArray(c))
        );

        if (hand.rank === "ST" || hand.rank === "SF") {
          hand.primaryCards.forEach((primaryCard) => {
            boardCards.forEach((boardCard) => {
              if (
                boardCard.card[0] === primaryCard.rank ||
                boardCard.card[0] === primaryCard.rank
              ) {
                boardCard.isKicker = false;
              }
            });
          });
        }
      }
    }
    n++;
    const kickers = boardCards.filter((b) => b.isKicker);
    if (kickers.length === 0) {
      filteredBoards.push(board);
    }
  }

  console.log(`kickers-out: ${filteredBoards.length}/${n}`);

  return filteredBoards;
};
