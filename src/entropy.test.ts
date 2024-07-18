import { getFlopRecommendation } from "./entropy";
import { Card, CardHexArray, CardSuit, HexCardRank } from "./poker/Card";
import { BoardCards } from "./poker/Poker";

describe("entropy", () => {
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

    expect(
      getFlopRecommendation(boards, cards).flop.map((card) => card.toString())
    ).toMatchObject(["7♠", "7♦", "Q♠"]);
  });
});
