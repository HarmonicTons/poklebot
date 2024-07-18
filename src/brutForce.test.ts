import {
  areScoreValids,
  BoardCards,
  filterOutBoardsContainingKickers,
  Players,
} from "./brutForce";

describe("brut force", () => {
  it("filter our kickers", () => {
    const players: Players = [
      {
        name: "Pam",
        positions: {
          flop: 1,
          turn: 2,
          river: 1,
        },
        cards: [
          ["a", "♥"],
          ["e", "♦"],
        ],
      },
      {
        name: "Sam",
        positions: {
          flop: 3,
          turn: 3,
          river: 3,
        },
        cards: [
          ["8", "♦"],
          ["5", "♠"],
        ],
      },
      {
        name: "Lam",
        positions: {
          flop: 2,
          turn: 1,
          river: 2,
        },
        cards: [
          ["c", "♣"],
          ["e", "♠"],
        ],
      },
    ];

    const boards: BoardCards[] = [
      [
        ["2", "♠"],
        ["2", "♣"],
        ["a", "♠"],
        ["c", "♠"],
        ["a", "♣"],
      ],
    ];

    expect(filterOutBoardsContainingKickers(players, boards)).toEqual([]);
  });
});

describe("are score valid", () => {
  it("score today", () => {
    expect(areScoreValids([2, 1, 2], ["5c9863", "5c9863", "5c9863"])).toBe(
      false
    );
  });
});
