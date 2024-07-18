import { BoardCards } from "./brutForce";
import { getFlopRecommendation } from "./entropy";
import { CardHexArray, CardSuit, HexCardRank } from "./poker/Card";

type CardType = CardHexArray;

describe("entropy", () => {
  it("2 remainings boards", () => {
    const cards: CardType[] = [
      ["2", "♠"],
      ["2", "♣"],
      ["2", "♥"],
      ["2", "♦"],
      ["3", "♠"],
      ["3", "♥"],
      ["3", "♦"],
      ["4", "♠"],
      ["4", "♣"],
      ["4", "♥"],
      ["4", "♦"],
      ["5", "♠"],
      ["5", "♣"],
      ["5", "♥"],
      ["5", "♦"],
      ["6", "♠"],
      ["6", "♣"],
      ["6", "♥"],
      ["7", "♠"],
      ["7", "♥"],
      ["7", "♦"],
      ["8", "♠"],
      ["8", "♣"],
      ["8", "♥"],
      ["9", "♠"],
      ["9", "♣"],
      ["9", "♦"],
      ["a", "♠"],
      ["a", "♣"],
      ["a", "♥"],
      ["a", "♦"],
      ["b", "♠"],
      ["b", "♣"],
      ["b", "♥"],
      ["b", "♦"],
      ["c", "♠"],
      ["c", "♣"],
      ["c", "♦"],
      ["d", "♠"],
      ["d", "♣"],
      ["d", "♥"],
      ["d", "♦"],
      ["e", "♠"],
      ["e", "♣"],
      ["e", "♥"],
      ["e", "♦"],
    ];
    const boards: BoardCards[] = [
      [
        ["7", "♠"],
        ["7", "♦"],
        ["c", "♠"],
        ["c", "♣"],
        ["c", "♦"],
      ],
      [
        ["7", "♠"],
        ["7", "♦"],
        ["c", "♠"],
        ["c", "♦"],
        ["c", "♣"],
      ],
    ];

    expect(getFlopRecommendation(boards, cards).flop).toMatchObject([
      ["7", "♠"],
      ["7", "♦"],
      ["c", "♠"],
    ]);
  });
});
