import { DateTime } from "luxon";
import { timeout } from "../playwright/utils";
import {
  Card,
  CARD_RANKS,
  CARD_SUITS,
  CardString,
  hexCardRankRecord,
} from "../poker/Card";
import { Hand } from "../poker/Hand";
import {
  BoardCards,
  FlopCards,
  getBoardFromJson,
  PlayerCards,
  RiverCards,
  Stage,
  TurnCards,
} from "../poker/Poker";

export type PlayerPosition = 1 | 2 | 3;

export type Player = {
  name: string;
  cards: PlayerCards;
  positions: Record<Stage, PlayerPosition>;
};

export type Players = [Player, Player, Player];

const CARD_PATTERNS = ["🟩", "🟨", "⬜️"] as const;
export type CardPattern = (typeof CARD_PATTERNS)[number];

export type FlopPattern = [CardPattern, CardPattern, CardPattern];
export type BoardPattern = [
  CardPattern,
  CardPattern,
  CardPattern,
  CardPattern,
  CardPattern
];

export type Guess = {
  number: number;
  playedBoard: BoardCards;
  pattern: BoardPattern;
  remainingBoards: BoardCards[];
};

export class Pokle {
  public areAllPossibleSolutionsComputed = false;
  public validCards: Card[] | null = null;
  public possibleFlops: FlopCards[] | null = null;
  public possibleTurns: TurnCards[] | null = null;
  public possibleRivers: RiverCards[] | null = null;
  public validBoards: BoardCards[] | null = null;
  public isSolved = false;

  public guesses: Guess[] = [];

  constructor(
    public readonly gameId: number,
    public readonly players: Players,
    public solution: BoardCards | null = null
  ) {}

  public get remainingBoards() {
    return this.guesses.length === 0
      ? this.validBoards
      : this.guesses[this.guesses.length - 1].remainingBoards;
  }

  public getAllValidCards() {
    const playersCards = this.players.flatMap((player) => player.cards);

    const usedCards: Record<string, boolean> = {};
    this.players.forEach((player) => {
      player.cards.forEach((card) => {
        usedCards[card.toString()] = true;
      });
    });

    const validCards: Card[] = [];
    for (const rank of CARD_RANKS) {
      // check that this rank is not an obvious kicker
      // meaning that it could form a hand with at least one player's cards
      const isObviousKicker = playersCards.every((playerCard) => {
        const couldBePartOfTheSameStraight = Hand.couldBePartOfTheSameStraight(
          hexCardRankRecord[rank],
          playerCard.hexRank
        );
        const isSameRank = hexCardRankRecord[rank] === playerCard.hexRank;
        const couldBeKicker =
          couldBePartOfTheSameStraight === false && isSameRank === false;
        return couldBeKicker;
      });

      if (isObviousKicker) {
        continue;
      }
      for (const suit of CARD_SUITS) {
        const card = new Card(rank, suit);
        if (usedCards[card.toString()]) {
          continue;
        }
        validCards.push(card);
      }
    }

    this.validCards = validCards;
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

  public getAllPossibleFlops(): void {
    if (this.validCards === null) {
      throw new Error("validCards must be set before calling this method");
    }
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

    this.possibleFlops = flops;
  }

  public getAllPossibleTurns(): void {
    if (this.validCards === null || this.possibleFlops === null) {
      throw new Error("possibleFlops must be set before calling this method");
    }
    let turns: TurnCards[] = [];

    for (const flop of this.possibleFlops) {
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

    this.possibleTurns = turns;
  }

  public getAllPossibleRivers(): void {
    if (this.validCards === null || this.possibleTurns === null) {
      throw new Error("possibleTurns must be set before calling this method");
    }
    let rivers: RiverCards[] = [];

    for (const turn of this.possibleTurns) {
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

    this.possibleRivers = rivers;
  }

  public keepOnlyValidBoards(): void {
    if (this.possibleRivers === null) {
      throw new Error("possibleRivers must be set before calling this method");
    }

    const validBoards: BoardCards[] = [];
    for (const board of this.possibleRivers) {
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

    this.validBoards = validBoards;
  }

  public async solve(): Promise<void> {
    console.debug("Solving Pokle...");
    await this.getAllValidCards();
    await timeout(100);
    console.debug(`${this.validCards?.length} valid cards`);
    await this.getAllPossibleFlops();
    await timeout(100);
    console.debug(`${this.possibleFlops?.length} possible flops`);
    await this.getAllPossibleTurns();
    await timeout(100);
    console.debug(`${this.possibleTurns?.length} possible turns`);
    await this.getAllPossibleRivers();
    await timeout(100);
    console.debug(`${this.possibleRivers?.length} possible rivers`);
    await this.keepOnlyValidBoards();
    await timeout(100);
    console.debug(`${this.validBoards?.length} valid boards`);
    this.areAllPossibleSolutionsComputed = true;
  }

  public static getGameIdFromDate(date: DateTime): number {
    const pokleStartDateTimestamp = 1656972000000;
    const pokleStartDate = DateTime.fromMillis(pokleStartDateTimestamp);
    const diff = date.diff(pokleStartDate, "days").days;
    return Math.floor(diff);
  }

  public static getCardPattern(
    card1: Card,
    card2: Card,
    autocorrect: boolean = false
  ): CardPattern {
    if (card1.isEqual(card2)) {
      return "🟩";
    }
    if (autocorrect && card1.rank === card2.rank) {
      return "🟩";
    }
    if (card1.rank === card2.rank || card1.suit === card2.suit) {
      return "🟨";
    }
    return "⬜️";
  }

  public static getFlopCardPattern(
    card: Card,
    actualFlop: Card[]
  ): CardPattern {
    const patterns = actualFlop.map((flopCard) =>
      Pokle.getCardPattern(card, flopCard)
    );
    if (patterns.includes("🟩")) {
      return "🟩";
    }
    if (patterns.includes("🟨")) {
      return "🟨";
    }
    return "⬜️";
  }

  public static getFlopPattern(
    playedFlop: FlopCards,
    actualFlop: FlopCards
  ): FlopPattern {
    const pattern: FlopPattern = ["⬜️", "⬜️", "⬜️"];

    const greenCards: Card[] = [];

    for (let i = 0; i < 3; i++) {
      const playedCard = playedFlop[i];
      const cardPattern = this.getFlopCardPattern(playedCard, actualFlop);
      if (cardPattern === "🟩") {
        pattern[i] = "🟩";
        greenCards.push(playedCard);
      }
    }
    // once a card has been greened-out its rank or suit cannot
    // make another card yellow
    const actualFlopWithoutGreenCards = actualFlop.filter((c) =>
      greenCards.every((gc) => !gc.isEqual(c))
    );
    for (let i = 0; i < 3; i++) {
      if (pattern[i] === "🟩") {
        continue;
      }
      const playedCard = playedFlop[i];
      const cardPattern = this.getFlopCardPattern(
        playedCard,
        actualFlopWithoutGreenCards
      );
      pattern[i] = cardPattern;
    }

    return pattern;
  }

  public static getBoardPattern = (
    playedBoard: BoardCards,
    actualBoard: BoardCards,
    remainingBoards: BoardCards[]
  ): BoardPattern => {
    const flopPattern = Pokle.getFlopPattern(
      playedBoard.slice(0, 3) as FlopCards,
      actualBoard.slice(0, 3) as FlopCards
    );
    const turnPattern = Pokle.getCardPattern(
      playedBoard[3],
      actualBoard[3],
      false
    );
    const riverPattern = Pokle.getCardPattern(
      playedBoard[4],
      actualBoard[4],
      false
    );
    // if the flop is correct, the turn and river card color does not matter anymore
    const autocorrect =
      flopPattern.join("") === "🟩🟩🟩" &&
      (turnPattern === "🟨" || turnPattern === "🟩") &&
      (riverPattern === "🟨" || riverPattern === "🟩");
    if (autocorrect) {
      // still has to be a valid solution for it to be autocorrected
      const isValidSolution = remainingBoards.find((b) =>
        b.every((c, i) => c.isEqual(playedBoard[i]))
      );
      if (isValidSolution) {
        const turnPatternAutocorrected = Pokle.getCardPattern(
          playedBoard[3],
          actualBoard[3],
          autocorrect
        );
        const riverPatternAutocorrected = Pokle.getCardPattern(
          playedBoard[4],
          actualBoard[4],
          autocorrect
        );
        if (
          turnPatternAutocorrected === "🟩" &&
          riverPatternAutocorrected === "🟩"
        ) {
          return ["🟩", "🟩", "🟩", "🟩", "🟩"];
        }
      }
    }

    return [...flopPattern, turnPattern, riverPattern] as BoardPattern;
  };

  public static getPattern(
    playedCards: Card[],
    actualCards: Card[],
    remainingBoards: BoardCards[]
  ): string[] {
    if (playedCards.length !== actualCards.length) {
      throw new Error("playedCards and actualCards must have the same length");
    }
    if (playedCards.length === 1) {
      return [Pokle.getCardPattern(playedCards[0], actualCards[0])];
    }
    if (playedCards.length === 3) {
      return Pokle.getFlopPattern(
        playedCards as FlopCards,
        actualCards as FlopCards
      );
    }
    if (playedCards.length === 5) {
      return Pokle.getBoardPattern(
        playedCards as BoardCards,
        actualCards as BoardCards,
        remainingBoards
      );
    }
    throw new Error("Unsupported number of cards");
  }

  public resetGuesses(): void {
    this.guesses = [];
    this.isSolved = false;
  }

  public guessBoard({
    playedBoard,
    pattern,
  }: {
    playedBoard: BoardCards;
    pattern: BoardPattern;
  }): void {
    if (this.remainingBoards === null) {
      throw new Error("Pokle must be solved before");
    }

    const nextRemaingBoards = this.remainingBoards.filter((board) => {
      const flopPattern = Pokle.getFlopPattern(
        playedBoard.slice(0, 3) as FlopCards,
        board.slice(0, 3) as FlopCards
      );
      if (flopPattern.join("") !== pattern.slice(0, 3).join("")) {
        return false;
      }
      const turnOutcome = Pokle.getCardPattern(playedBoard[3], board[3], false);
      if (turnOutcome !== pattern[3]) {
        return false;
      }
      const riverOutcome = Pokle.getCardPattern(
        playedBoard[4],
        board[4],
        false
      );
      if (riverOutcome !== pattern[4]) {
        return false;
      }
      return true;
    });

    this.guesses.push({
      number: this.guesses.length + 1,
      playedBoard,
      pattern,
      remainingBoards: nextRemaingBoards,
    });

    if (pattern.join("") === "🟩🟩🟩🟩🟩") {
      this.isSolved = true;
      if (this.solution === null) {
        this.solution = playedBoard;
      }
    }
  }

  public toString(): string {
    if (this.validBoards === null) {
      throw new Error("Pokle must be solved before");
    }

    const patterns = this.guesses
      .map(
        (guess) =>
          guess.pattern.join("").replaceAll("⬜️", ":white_large_square:") +
          (guess.pattern.join("") === "🟩🟩🟩🟩🟩"
            ? ""
            : " - " + guess.remainingBoards.length + " remaining")
      )
      .join("\n");
    const playedBoards = this.guesses
      .map((guess) => guess.playedBoard.join(" "))
      .join("\n");

    return `#Poklebot #${this.gameId} - ${this.validBoards.length} possible solutions
${patterns}

Guesses:
||${playedBoards}||`;
  }

  public toJSON() {
    return {
      gameId: this.gameId,
      players: this.players,
      solution: this.solution,
    };
  }

  public static fromJSON(json: string): Pokle {
    const { gameId, players, solution } = JSON.parse(json);
    return new Pokle(
      gameId,
      players.map((player: any) => {
        return {
          ...player,
          cards: player.cards.map((card: CardString) => Card.fromString(card)),
        };
      }),
      getBoardFromJson(solution)
    );
  }
}
