import { Card, CARD_RANKS, CARD_SUITS } from "../poker/Card";
import { Hand } from "../poker/Hand";
import {
  FlopCards,
  TurnCards,
  RiverCards,
  BoardCards,
  PlayerCards,
  Stage,
} from "../poker/Poker";

export type PlayerPosition = 1 | 2 | 3;

export type Player = {
  name: string;
  cards: PlayerCards;
  positions: Record<Stage, PlayerPosition>;
};

export type Players = [Player, Player, Player];

export class Pokle {
  public validCards: Card[];
  constructor(public readonly players: Players) {
    this.validCards = this.getAllValidCards();
  }

  private getAllValidCards() {
    // TODO remove obvious kickers (cannot be part of any straight)
    const usedCards: Record<string, boolean> = {};
    this.players.forEach((player) => {
      player.cards.forEach((card) => {
        usedCards[card.toString()] = true;
      });
    });

    const validCards: Card[] = [];
    for (const rank of CARD_RANKS) {
      for (const suit of CARD_SUITS) {
        const card = new Card(rank, suit);
        if (usedCards[card.toString()]) {
          continue;
        }
        validCards.push(card);
      }
    }

    return validCards;
  }

  public areScoreValids({
    stage,
    stageCards,
  }: {
    stage: Stage;
    stageCards: Card[];
  }) {
    const player1 = this.players[0];
    const player1Hand = Hand.getBestHand([...player1.cards, ...stageCards]);
    const player2 = this.players[1];
    const player2Hand = Hand.getBestHand([...player2.cards, ...stageCards]);
    const player3 = this.players[2];
    const player3Hand = Hand.getBestHand([...player3.cards, ...stageCards]);

    if (player1.positions[stage] > player2.positions[stage]) {
      if (player1Hand.isWorseThan(player2Hand) === false) {
        return false;
      }
    } else if (player2.positions[stage] > player1.positions[stage]) {
      if (player2Hand.isWorseThan(player1Hand) === false) {
        return false;
      }
    } else {
      if (player1Hand.isAsGoodAs(player2Hand) === false) {
        return false;
      }
    }

    if (player1.positions[stage] > player3.positions[stage]) {
      if (player1Hand.isWorseThan(player3Hand) === false) {
        return false;
      }
    } else if (player3.positions[stage] > player1.positions[stage]) {
      if (player3Hand.isWorseThan(player1Hand) === false) {
        return false;
      }
    } else {
      if (player1Hand.isAsGoodAs(player3Hand) === false) {
        return false;
      }
    }

    if (player3.positions[stage] > player2.positions[stage]) {
      if (player3Hand.isWorseThan(player2Hand) === false) {
        return false;
      }
    } else if (player2.positions[stage] > player3.positions[stage]) {
      if (player2Hand.isWorseThan(player3Hand) === false) {
        return false;
      }
    } else {
      if (player3Hand.isAsGoodAs(player2Hand) === false) {
        return false;
      }
    }

    return true;
  }

  public getAllPossibleFlops(): FlopCards[] {
    let flops: FlopCards[] = [];

    for (let ci1 = 0; ci1 < this.validCards.length; ci1++) {
      const c1 = this.validCards[ci1];
      for (let ci2 = ci1 + 1; ci2 < this.validCards.length; ci2++) {
        const c2 = this.validCards[ci2];
        for (let ci3 = ci2 + 1; ci3 < this.validCards.length; ci3++) {
          const c3 = this.validCards[ci3];
          const flopCards: FlopCards = [c1, c2, c3];

          if (this.areScoreValids({ stage: "flop", stageCards: flopCards })) {
            flops.push(flopCards);
          }
        }
      }
    }

    return flops;
  }

  public getAllPossibleTurns({ flops }: { flops: FlopCards[] }): TurnCards[] {
    let turns: TurnCards[] = [];

    for (const flop of flops) {
      for (let ci1 = 0; ci1 < this.validCards.length; ci1++) {
        const c1 = this.validCards[ci1];
        const isUsed = flop.some((flopCard) => flopCard.isEqual(c1));
        if (isUsed) {
          continue;
        }

        const turnCards: TurnCards = [...flop, c1];

        if (this.areScoreValids({ stage: "turn", stageCards: turnCards })) {
          turns.push(turnCards);
        }
      }
    }

    return turns;
  }

  public getAllPossibleRivers({ turns }: { turns: TurnCards[] }): RiverCards[] {
    let rivers: RiverCards[] = [];

    for (const turn of turns) {
      for (let ci1 = 0; ci1 < this.validCards.length; ci1++) {
        const c1 = this.validCards[ci1];
        const isUsed = turn.some((turnCard) => turnCard.isEqual(c1));
        if (isUsed) {
          continue;
        }

        const riverCards: RiverCards = [...turn, c1];

        if (this.areScoreValids({ stage: "river", stageCards: riverCards })) {
          rivers.push(riverCards);
        }
      }
    }

    return rivers;
  }

  public keepOnlyValidBoards({
    rivers,
  }: {
    rivers: RiverCards[];
  }): BoardCards[] {
    const validBoards: BoardCards[] = [];
    for (const board of rivers) {
      const boardCards = board.map((card) => ({
        card,
        isKicker: true,
      }));

      const flopCards = board.slice(0, 3);
      const turnCards = board.slice(0, 4);
      const riverCards = [...board];

      for (const player of this.players) {
        boardCards.forEach((boardCard) => {
          if (
            boardCard.card.rank === player.cards[0].rank ||
            boardCard.card.rank === player.cards[1].rank
          ) {
            boardCard.isKicker = false;
          }
        });
        for (const cards of [flopCards, turnCards, riverCards]) {
          const allCards = [...cards, ...player.cards];
          const hand = Hand.getBestHand(allCards);

          if (hand.rank === "ST" || hand.rank === "SF") {
            hand.primaryCards.forEach((primaryCard) => {
              boardCards.forEach((boardCard) => {
                if (
                  boardCard.card.rank === primaryCard.rank ||
                  boardCard.card.rank === primaryCard.rank
                ) {
                  boardCard.isKicker = false;
                }
              });
            });
          }
        }
      }

      const kickers = boardCards.filter((b) => b.isKicker);
      if (kickers.length === 0) {
        validBoards.push(board);
      }
    }

    return validBoards;
  }

  public solve(): BoardCards[] {
    const flops = this.getAllPossibleFlops();
    const turns = this.getAllPossibleTurns({ flops });
    const rivers = this.getAllPossibleRivers({ turns });
    const boards = this.keepOnlyValidBoards({ rivers });
    return boards;
  }
}
