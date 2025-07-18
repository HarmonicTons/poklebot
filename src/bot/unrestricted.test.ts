import { Card } from "../poker/Card";
import { BoardCards, getBoardFromJson } from "../poker/Poker";
import {
  getFlopsWithRecommendations,
  getUnrestrictedRecommendation,
} from "./unrestricted";

describe("unrestricted bot", () => {
  it("2 remainings boards", () => {
    const cards = Card.getAllCards();
    const validCards = cards.filter(
      (card) =>
        card.isEqual(new Card("3", "♣")) === false &&
        card.isEqual(new Card("4", "♦")) === false &&
        card.isEqual(new Card("6", "♠")) === false &&
        card.isEqual(new Card("7", "♣")) === false &&
        card.isEqual(new Card("9", "♥")) === false &&
        card.isEqual(new Card("Q", "♥")) === false
    );

    const boards: BoardCards[] = [
      getBoardFromJson(["7♠", "7♦", "Q♠", "Q♣", "Q♦"]),
      getBoardFromJson(["7♠", "7♦", "Q♠", "Q♦", "Q♣"]),
    ];

    expect(
      getFlopsWithRecommendations(
        {
          validCards,
          remainingBoards: boards,
        },
        0.5
      )[0].choice.map((card) => card.toString())
    ).toMatchObject(["7♠", "7♦", "Q♠"]);
  });

  it("26 remainings boards", () => {
    const cards = Card.getAllCards();
    const validCards = cards.filter(
      (card) =>
        card.isEqual(new Card("7", "♦")) === false &&
        card.isEqual(new Card("7", "♠")) === false &&
        card.isEqual(new Card("K", "♥")) === false &&
        card.isEqual(new Card("10", "♠")) === false &&
        card.isEqual(new Card("5", "♣")) === false &&
        card.isEqual(new Card("3", "♣")) === false
    );

    const boards: BoardCards[] = [
      ["3♠", "10♣", "K♣", "5♠", "7♣"],
      ["3♠", "10♣", "K♣", "5♥", "7♣"],
      ["3♠", "10♣", "K♣", "5♦", "7♣"],
      ["3♠", "10♦", "K♦", "5♦", "3♦"],
      ["3♥", "10♣", "K♣", "5♠", "7♣"],
      ["3♥", "10♣", "K♣", "5♥", "7♣"],
      ["3♥", "10♣", "K♣", "5♦", "7♣"],
      ["3♥", "10♦", "K♦", "5♦", "3♦"],
      ["3♦", "10♣", "K♣", "5♠", "7♣"],
      ["3♦", "10♣", "K♣", "5♥", "7♣"],
      ["3♦", "10♣", "K♣", "5♦", "7♣"],
      ["3♦", "10♦", "K♦", "5♠", "5♦"],
      ["3♦", "10♦", "K♦", "5♥", "5♦"],
      ["5♠", "10♣", "K♣", "3♠", "7♣"],
      ["5♠", "10♣", "K♣", "3♥", "7♣"],
      ["5♠", "10♣", "K♣", "3♦", "7♣"],
      ["5♠", "10♦", "K♦", "3♦", "5♦"],
      ["5♥", "10♣", "K♣", "3♠", "7♣"],
      ["5♥", "10♣", "K♣", "3♥", "7♣"],
      ["5♥", "10♣", "K♣", "3♦", "7♣"],
      ["5♥", "10♦", "K♦", "3♦", "5♦"],
      ["5♦", "10♣", "K♣", "3♠", "7♣"],
      ["5♦", "10♣", "K♣", "3♥", "7♣"],
      ["5♦", "10♣", "K♣", "3♦", "7♣"],
      ["5♦", "10♦", "K♦", "3♠", "3♦"],
      ["5♦", "10♦", "K♦", "3♥", "3♦"],
    ].map((board) =>
      getBoardFromJson(board as [string, string, string, string, string])
    );

    expect(
      getUnrestrictedRecommendation(
        {
          validCards,
          remainingBoards: boards,
        },
        0.5
      ).choice.map((card) => card.toString())
    ).toMatchObject(["2♣", "3♠", "3♥", "3♦", "7♣"]);
  });
});
