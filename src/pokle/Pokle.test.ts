import { Card, CardString } from "../poker/Card";
import { BoardCards, FlopCards } from "../poker/Poker";
import { BoardPattern, Players, Pokle } from "./Pokle";

describe("Pokle", () => {
  describe("get all valid cards", () => {
    it("should have 46 valid cards", () => {
      const players: Players = [
        {
          cards: [new Card("2", "♠"), new Card("5", "♠")],
          name: "Jaz",
          positions: {
            flop: 1,
            river: 2,
            turn: 3,
          },
        },
        {
          cards: [new Card("10", "♠"), new Card("K", "♠")],
          name: "Baz",
          positions: {
            flop: 2,
            river: 3,
            turn: 1,
          },
        },
        {
          cards: [new Card("A", "♠"), new Card("8", "♠")],
          name: "Taz",
          positions: {
            flop: 3,
            river: 1,
            turn: 2,
          },
        },
      ];

      const pokle = new Pokle(0, players);
      pokle.getAllValidCards();
      expect((pokle.validCards ?? []).length).toBe(46);
    });

    it("should have 42 valid cards because all the 2s are obvious kickers", () => {
      const players: Players = [
        {
          cards: [new Card("7", "♠"), new Card("9", "♠")],
          name: "Jaz",
          positions: {
            flop: 1,
            river: 2,
            turn: 3,
          },
        },
        {
          cards: [new Card("10", "♠"), new Card("J", "♠")],
          name: "Baz",
          positions: {
            flop: 2,
            river: 3,
            turn: 1,
          },
        },
        {
          cards: [new Card("K", "♠"), new Card("K", "♥")],
          name: "Taz",
          positions: {
            flop: 3,
            river: 1,
            turn: 2,
          },
        },
      ];

      const pokle = new Pokle(0, players);
      pokle.getAllValidCards();
      expect((pokle.validCards ?? []).length).toBe(42);
    });
  });

  describe("are score valids", () => {
    const players: Players = [
      {
        cards: [new Card("6", "♦"), new Card("3", "♣")],
        name: "Cat",
        positions: {
          flop: 3,
          turn: 3,
          river: 2,
        },
      },
      {
        cards: [new Card("Q", "♥"), new Card("8", "♦")],
        name: "Pat",
        positions: {
          flop: 2,
          turn: 1,
          river: 1,
        },
      },
      {
        cards: [new Card("7", "♣"), new Card("9", "♥")],
        name: "Nat",
        positions: {
          flop: 1,
          turn: 2,
          river: 2,
        },
      },
    ];

    const pokle = new Pokle(0, players);

    it("should be a valid flop", () => {
      expect(
        pokle.areScoreValids({
          stage: "flop",
          stageCards: [
            new Card("7", "♦"),
            new Card("7", "♠"),
            new Card("Q", "♠"),
          ],
        })
      ).toBe(true);
    });

    it("should be an invalid flop", () => {
      expect(
        pokle.areScoreValids({
          stage: "flop",
          stageCards: [
            new Card("7", "♦"),
            new Card("6", "♠"),
            new Card("Q", "♠"),
          ],
        })
      ).toBe(false);
    });

    it("should be a valid turn", () => {
      expect(
        pokle.areScoreValids({
          stage: "turn",
          stageCards: [
            new Card("7", "♦"),
            new Card("7", "♠"),
            new Card("Q", "♠"),
            new Card("Q", "♦"),
          ],
        })
      ).toBe(true);
    });

    it("should be an invalid turn", () => {
      expect(
        pokle.areScoreValids({
          stage: "turn",
          stageCards: [
            new Card("7", "♦"),
            new Card("7", "♠"),
            new Card("Q", "♠"),
            new Card("4", "♦"),
          ],
        })
      ).toBe(false);
    });

    it("should be a valid river", () => {
      expect(
        pokle.areScoreValids({
          stage: "river",
          stageCards: [
            new Card("7", "♦"),
            new Card("7", "♠"),
            new Card("Q", "♠"),
            new Card("Q", "♦"),
            new Card("Q", "♣"),
          ],
        })
      ).toBe(true);
    });

    it("should be an invalid river", () => {
      expect(
        pokle.areScoreValids({
          stage: "river",
          stageCards: [
            new Card("7", "♦"),
            new Card("7", "♠"),
            new Card("Q", "♠"),
            new Card("Q", "♦"),
            new Card("4", "♣"),
          ],
        })
      ).toBe(false);
    });
  });

  describe("keep only valid boards", () => {
    it("should remove the board", () => {
      const players: Players = [
        {
          name: "Pam",
          positions: {
            flop: 1,
            turn: 2,
            river: 1,
          },
          cards: [new Card("10", "♥"), new Card("A", "♦")],
        },
        {
          name: "Sam",
          positions: {
            flop: 3,
            turn: 3,
            river: 3,
          },
          cards: [new Card("8", "♦"), new Card("5", "♠")],
        },
        {
          name: "Lam",
          positions: {
            flop: 2,
            turn: 1,
            river: 2,
          },
          cards: [new Card("Q", "♣"), new Card("A", "♠")],
        },
      ];

      const pokle = new Pokle(0, players);

      const boards: BoardCards[] = [
        [
          new Card("2", "♠"),
          new Card("2", "♣"),
          new Card("10", "♠"),
          new Card("Q", "♠"),
          new Card("10", "♣"),
        ],
      ];

      pokle.possibleRivers = boards;
      pokle.keepOnlyValidBoards();
      expect(pokle.remainingBoards).toEqual([]);
    });

    it("should keep the board", () => {
      const players: Players = [
        {
          cards: [new Card("6", "♦"), new Card("3", "♣")],
          name: "Cat",
          positions: {
            flop: 3,
            turn: 3,
            river: 2,
          },
        },
        {
          cards: [new Card("Q", "♥"), new Card("8", "♦")],
          name: "Pat",
          positions: {
            flop: 2,
            turn: 1,
            river: 1,
          },
        },
        {
          cards: [new Card("7", "♣"), new Card("9", "♥")],
          name: "Nat",
          positions: {
            flop: 1,
            turn: 2,
            river: 2,
          },
        },
      ];

      const pokle = new Pokle(0, players);

      const boards: BoardCards[] = [
        [
          new Card("7", "♦"),
          new Card("7", "♠"),
          new Card("Q", "♠"),
          new Card("Q", "♦"),
          new Card("Q", "♣"),
        ],
      ];

      pokle.possibleRivers = boards;
      pokle.keepOnlyValidBoards();
      expect(pokle.remainingBoards).toEqual(boards);
    });

    it("should keep the board (straight)", () => {
      const players: Players = [
        {
          name: "Pam",
          cards: ["4♥", "2♠"].map((c) => Card.fromString(c as CardString)) as [
            Card,
            Card
          ],
          positions: { flop: 1, turn: 1, river: 2 },
        },
        {
          name: "Sam",
          cards: ["9♦", "Q♠"].map((c) => Card.fromString(c as CardString)) as [
            Card,
            Card
          ],
          positions: { flop: 2, turn: 3, river: 3 },
        },
        {
          name: "Lam",
          cards: ["3♣", "A♣"].map((c) => Card.fromString(c as CardString)) as [
            Card,
            Card
          ],
          positions: { flop: 3, turn: 2, river: 1 },
        },
      ];

      const pokle = new Pokle(0, players);

      const boards: BoardCards[] = [
        [
          new Card("2", "♣"),
          new Card("2", "♦"),
          new Card("9", "♣"),
          new Card("4", "♣"),
          new Card("5", "♣"),
        ],
      ];

      pokle.possibleRivers = boards;
      pokle.keepOnlyValidBoards();
      expect(pokle.remainingBoards).toEqual(boards);
    });
  });

  describe("pattern", () => {
    describe("card pattern", () => {
      it("should return 🟩", () => {
        const card1 = new Card("2", "♠");
        const card2 = new Card("2", "♠");
        expect(Pokle.getCardPattern(card1, card2)).toBe("🟩");
      });
      it("should return 🟩 when autocorrect is on", () => {
        const card1 = new Card("2", "♠");
        const card2 = new Card("2", "♣");
        expect(Pokle.getCardPattern(card1, card2, true)).toBe("🟩");
      });
      it("should return 🟨 for same rank", () => {
        const card1 = new Card("2", "♠");
        const card2 = new Card("2", "♣");
        expect(Pokle.getCardPattern(card1, card2)).toBe("🟨");
      });
      it("should return 🟨 for same suit", () => {
        const card1 = new Card("2", "♠");
        const card2 = new Card("3", "♠");
        expect(Pokle.getCardPattern(card1, card2)).toBe("🟨");
      });
      it("should return ⬜️", () => {
        const card1 = new Card("2", "♠");
        const card2 = new Card("3", "♣");
        expect(Pokle.getCardPattern(card1, card2)).toBe("⬜️");
      });
    });

    describe("flop pattern", () => {
      it("should return 🟩🟩🟩", () => {
        const flop1: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
        ];
        const flop2: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
        ];
        expect(Pokle.getFlopPattern(flop1, flop2)).toEqual(["🟩", "🟩", "🟩"]);
      });

      it("should return 🟩🟩🟩 order does not matter", () => {
        const flop1: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
        ];
        const flop2: FlopCards = [
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("2", "♠"),
        ];
        expect(Pokle.getFlopPattern(flop1, flop2)).toEqual(["🟩", "🟩", "🟩"]);
      });

      it("should return 🟨🟨🟨", () => {
        const flop1: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
        ];
        const flop2: FlopCards = [
          new Card("5", "♠"),
          new Card("6", "♠"),
          new Card("7", "♠"),
        ];
        expect(Pokle.getFlopPattern(flop1, flop2)).toEqual(["🟨", "🟨", "🟨"]);
      });

      it("should return ⬜️⬜️⬜️", () => {
        const flop1: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
        ];
        const flop2: FlopCards = [
          new Card("5", "♣"),
          new Card("6", "♣"),
          new Card("7", "♣"),
        ];
        expect(Pokle.getFlopPattern(flop1, flop2)).toEqual([
          "⬜️",
          "⬜️",
          "⬜️",
        ]);
      });

      it("should return 🟩🟨⬜️", () => {
        const flop1: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♣"),
          new Card("5", "♣"),
        ];
        const flop2: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
        ];
        expect(Pokle.getFlopPattern(flop1, flop2)).toEqual(["🟩", "🟨", "⬜️"]);
      });

      it("should return 🟩🟨⬜️ whith same suit in 🟩 and ⬜️", () => {
        const flop1: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♣"),
          new Card("5", "♠"),
        ];
        const flop2: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♦"),
          new Card("4", "♦"),
        ];
        expect(Pokle.getFlopPattern(flop1, flop2)).toEqual(["🟩", "🟨", "⬜️"]);
      });

      it("should return 🟩🟨⬜️ whith same suit in 🟩 and ⬜️ in different places", () => {
        const flop1: FlopCards = [
          new Card("2", "♠"),
          new Card("3", "♣"),
          new Card("5", "♠"),
        ];
        const flop2: FlopCards = [
          new Card("3", "♦"),
          new Card("2", "♠"),
          new Card("4", "♦"),
        ];
        expect(Pokle.getFlopPattern(flop1, flop2)).toEqual(["🟩", "🟨", "⬜️"]);
      });
    });

    describe("board pattern", () => {
      it("should return 🟩🟩🟩🟩🟩", () => {
        const board1: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♠"),
          new Card("6", "♠"),
        ];
        const board2: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♠"),
          new Card("6", "♠"),
        ];
        expect(Pokle.getBoardPattern(board1, board2)).toEqual([
          "🟩",
          "🟩",
          "🟩",
          "🟩",
          "🟩",
        ]);
      });

      it("should return 🟩⬜️⬜️🟨⬜️", () => {
        const board1: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♣"),
          new Card("5", "♠"),
          new Card("6", "♠"),
        ];
        const board2: BoardCards = [
          new Card("2", "♠"),
          new Card("5", "♦"),
          new Card("5", "♥"),
          new Card("6", "♠"),
          new Card("7", "♦"),
        ];
        expect(Pokle.getBoardPattern(board1, board2)).toEqual([
          "🟩",
          "⬜️",
          "⬜️",
          "🟨",
          "⬜️",
        ]);
      });

      it("should return 🟩🟩🟩🟩🟩 with autocorrected turn", () => {
        const board1: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♠"),
          new Card("6", "♠"),
        ];
        const board2: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♣"),
          new Card("6", "♠"),
        ];
        expect(Pokle.getBoardPattern(board1, board2)).toEqual([
          "🟩",
          "🟩",
          "🟩",
          "🟩",
          "🟩",
        ]);
      });

      it("should return 🟩🟩🟩🟩🟩 with autocorrected river", () => {
        const board1: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♠"),
          new Card("6", "♣"),
        ];
        const board2: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♠"),
          new Card("6", "♠"),
        ];
        expect(Pokle.getBoardPattern(board1, board2)).toEqual([
          "🟩",
          "🟩",
          "🟩",
          "🟩",
          "🟩",
        ]);
      });

      it("should autocorrect only when the rank of the river and turn are ok", () => {
        const board1: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♠"),
          new Card("6", "♣"),
        ];
        const board2: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♦"),
          new Card("7", "♣"),
        ];
        expect(Pokle.getBoardPattern(board1, board2)).toEqual([
          "🟩",
          "🟩",
          "🟩",
          "🟨",
          "🟨",
        ]);
      });
    });

    describe("keep only board matching pattern", () => {
      const players: Players = [
        {
          cards: [new Card("6", "♦"), new Card("3", "♣")],
          name: "Cat",
          positions: {
            flop: 3,
            turn: 3,
            river: 2,
          },
        },
        {
          cards: [new Card("Q", "♥"), new Card("8", "♦")],
          name: "Pat",
          positions: {
            flop: 2,
            turn: 1,
            river: 1,
          },
        },
        {
          cards: [new Card("7", "♣"), new Card("9", "♥")],
          name: "Nat",
          positions: {
            flop: 1,
            turn: 2,
            river: 2,
          },
        },
      ];

      it("should keep board", () => {
        const playedBoard: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♠"),
          new Card("6", "♠"),
        ];
        const boards: BoardCards[] = [
          [
            new Card("2", "♣"),
            new Card("3", "♣"),
            new Card("4", "♣"),
            new Card("5", "♠"),
            new Card("6", "♠"),
          ],
        ];
        const pattern: BoardPattern = ["🟨", "🟨", "🟨", "🟩", "🟩"];
        const pokle = new Pokle(0, players);
        pokle.validBoards = boards;
        pokle.guessBoard({ playedBoard, pattern });
        expect(pokle.remainingBoards).toEqual(boards);
      });

      it("should keep board (random fail)", () => {
        const playedBoard: BoardCards = [
          new Card("2", "♦"),
          new Card("4", "♣"),
          new Card("Q", "♦"),
          new Card("A", "♥"),
          new Card("5", "♣"),
        ];
        const boards: BoardCards[] = [
          [
            new Card("2", "♣"),
            new Card("2", "♦"),
            new Card("9", "♣"),
            new Card("4", "♣"),
            new Card("5", "♣"),
          ],
        ];
        const pattern: BoardPattern = ["🟩", "🟨", "⬜️", "⬜️", "🟩"];
        const pokle = new Pokle(0, players);
        pokle.validBoards = boards;
        pokle.guessBoard({ playedBoard, pattern });
        expect(pokle.remainingBoards).toEqual(boards);
      });

      it("should remove board", () => {
        const playedBoard: BoardCards = [
          new Card("2", "♠"),
          new Card("3", "♠"),
          new Card("4", "♠"),
          new Card("5", "♠"),
          new Card("6", "♠"),
        ];
        const boards: BoardCards[] = [
          [
            new Card("2", "♣"),
            new Card("3", "♣"),
            new Card("4", "♣"),
            new Card("5", "♠"),
            new Card("6", "♠"),
          ],
        ];
        const pattern: BoardPattern = ["⬜️", "🟨", "🟨", "🟩", "🟩"];
        const pokle = new Pokle(0, players);
        pokle.validBoards = boards;
        pokle.guessBoard({ playedBoard, pattern });
        expect(pokle.remainingBoards).toEqual([]);
      });
    });
  });
});
