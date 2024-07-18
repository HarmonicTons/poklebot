import {
  areScoreValids,
  BoardCards,
  filterOutBoardsContainingKickers,
  Players,
} from "./brutForce";

describe("filter our kickers", () => {
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

  it("many of the same", () => {
    const players: Players = [
      {
        name: "Cat",
        positions: {
          flop: 3,
          turn: 3,
          river: 2,
        },
        cards: [
          ["6", "♦"],
          ["3", "♣"],
        ],
      },
      {
        name: "Pat",
        positions: {
          flop: 2,
          turn: 1,
          river: 1,
        },
        cards: [
          ["c", "♥"],
          ["8", "♦"],
        ],
      },
      {
        name: "Nat",
        positions: {
          flop: 1,
          turn: 2,
          river: 2,
        },
        cards: [
          ["7", "♣"],
          ["9", "♥"],
        ],
      },
    ];

    const boards: BoardCards[] = [
      [
        ["7", "♦"],
        ["7", "♠"],
        ["c", "♠"],
        ["c", "♦"],
        ["c", "♣"],
      ],
    ];

    expect(filterOutBoardsContainingKickers(players, boards)).toEqual(boards);
  });
});

describe("are score valid", () => {
  it("score today", () => {
    expect(areScoreValids([2, 1, 2], ["5c9863", "5c9863", "5c9863"])).toBe(
      false
    );
  });

  it("score today 2", () => {
    expect(areScoreValids([2, 1, 2], ["6ccc77", "7cccc8", "6ccc77"])).toBe(
      true
    );
  });

  it("score today 3", () => {
    expect(areScoreValids([3, 1, 2], ["2cc776", "6ccc77", "6777cc"])).toBe(
      true
    );
  });
});
