import { getFlopsWithRecommendations } from "./standard";
import { Card } from "../poker/Card";
import { BoardCards } from "../poker/Poker";
import { Players, Pokle } from "../pokle/Pokle";

describe("standard bot", () => {
  const players: Players = [
    {
      cards: [new Card("2", "♠"), new Card("3", "♠")],
      name: "Jaz",
      positions: {
        flop: 1,
        river: 2,
        turn: 3,
      },
    },
    {
      cards: [new Card("4", "♠"), new Card("5", "♠")],
      name: "Baz",
      positions: {
        flop: 2,
        river: 3,
        turn: 1,
      },
    },
    {
      cards: [new Card("6", "♠"), new Card("7", "♠")],
      name: "Taz",
      positions: {
        flop: 3,
        river: 1,
        turn: 2,
      },
    },
  ];

  it("2 remainings boards", () => {
    const cards: Card[] = [
      new Card("2", "♠"),
      new Card("2", "♣"),
      new Card("2", "♥"),
      new Card("2", "♦"),
      new Card("3", "♠"),
      new Card("3", "♥"),
      new Card("3", "♦"),
      new Card("4", "♠"),
      new Card("4", "♣"),
      new Card("4", "♥"),
      new Card("4", "♦"),
      new Card("5", "♠"),
      new Card("5", "♣"),
      new Card("5", "♥"),
      new Card("5", "♦"),
      new Card("6", "♠"),
      new Card("6", "♣"),
      new Card("6", "♥"),
      new Card("7", "♠"),
      new Card("7", "♥"),
      new Card("7", "♦"),
      new Card("8", "♠"),
      new Card("8", "♣"),
      new Card("8", "♥"),
      new Card("9", "♠"),
      new Card("9", "♣"),
      new Card("9", "♦"),
      new Card("10", "♠"),
      new Card("10", "♣"),
      new Card("10", "♥"),
      new Card("10", "♦"),
      new Card("J", "♠"),
      new Card("J", "♣"),
      new Card("J", "♥"),
      new Card("J", "♦"),
      new Card("Q", "♠"),
      new Card("Q", "♣"),
      new Card("Q", "♦"),
      new Card("K", "♠"),
      new Card("K", "♣"),
      new Card("K", "♥"),
      new Card("K", "♦"),
      new Card("A", "♠"),
      new Card("A", "♣"),
      new Card("A", "♥"),
      new Card("A", "♦"),
    ];

    const boards: BoardCards[] = [
      [
        new Card("7", "♠"),
        new Card("7", "♦"),
        new Card("Q", "♠"),
        new Card("Q", "♣"),
        new Card("Q", "♦"),
      ],
      [
        new Card("7", "♠"),
        new Card("7", "♦"),
        new Card("Q", "♠"),
        new Card("Q", "♦"),
        new Card("Q", "♣"),
      ],
    ];

    const pokle = new Pokle(0, players);
    pokle.validCards = cards;
    pokle.validBoards = boards;

    expect(
      getFlopsWithRecommendations(pokle)[0].choice.map((card) =>
        card.toString()
      )
    ).toMatchObject(["7♠", "7♦", "Q♠"]);
  });
});
