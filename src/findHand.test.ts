import { Card, findHandType, HandCards } from "./findHand";

describe("find hand", () => {
  it("SF", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["9", "♠"],
      ["b", "♠"],
      ["8", "♠"],
      ["a", "♠"],
    ];

    expect(findHandType(handCards).handScore[0]).toBe("8");
  });

  it("4K", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["9", "♠"],
      ["7", "♠"],
      ["7", "♠"],
      ["7", "♠"],
    ];

    expect(findHandType(handCards).handScore[0]).toBe("7");
  });

  it("FH", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["7", "♠"],
      ["a", "♠"],
      ["7", "♠"],
      ["a", "♠"],
    ];

    expect(findHandType(handCards).handScore[0]).toBe("6");
  });

  it("FL", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["5", "♠"],
      ["4", "♠"],
      ["3", "♠"],
      ["2", "♠"],
    ];

    expect(findHandType(handCards).handScore[0]).toBe("5");
  });

  it("ST", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["4", "♠"],
      ["3", "♥"],
      ["5", "♠"],
    ];

    expect(findHandType(handCards).handScore[0]).toBe("4");
  });

  it("3K", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["7", "♠"],
      ["3", "♥"],
      ["7", "♠"],
    ];

    expect(findHandType(handCards).handScore[0]).toBe("3");
  });

  it("DP", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["7", "♠"],
      ["6", "♥"],
      ["b", "♠"],
    ];

    expect(findHandType(handCards).handScore[0]).toBe("2");
  });

  it("P", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["7", "♠"],
      ["3", "♥"],
      ["b", "♠"],
    ];

    expect(findHandType(handCards).handScore[0]).toBe("1");
  });

  it("HC", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["9", "♠"],
      ["3", "♥"],
      ["b", "♠"],
    ];

    expect(findHandType(handCards).handScore[0]).toBe("0");
  });
});

describe("get score", () => {
  it("SF", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["9", "♠"],
      ["b", "♠"],
      ["8", "♠"],
      ["a", "♠"],
    ];

    expect(findHandType(handCards).handScore).toBe("8ba987");
  });

  it("4K", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["9", "♠"],
      ["7", "♠"],
      ["7", "♠"],
      ["7", "♠"],
    ];

    expect(findHandType(handCards).handScore).toBe("777779");
  });

  it("FH", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["7", "♠"],
      ["a", "♠"],
      ["7", "♠"],
      ["a", "♠"],
    ];

    expect(findHandType(handCards).handScore).toBe("6777aa");
  });

  it("FL", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["5", "♠"],
      ["4", "♠"],
      ["3", "♠"],
      ["2", "♠"],
    ];

    expect(findHandType(handCards).handScore).toBe("575432");
  });

  it("ST", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["4", "♠"],
      ["3", "♥"],
      ["5", "♠"],
    ];

    expect(findHandType(handCards).handScore).toBe("476543");
  });

  it("3K", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["7", "♠"],
      ["3", "♥"],
      ["7", "♠"],
    ];

    expect(findHandType(handCards).handScore).toBe("377763");
  });

  it("DP", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["7", "♠"],
      ["6", "♥"],
      ["b", "♠"],
    ];

    expect(findHandType(handCards).handScore).toBe("27766b");
  });

  it("P", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["7", "♠"],
      ["3", "♥"],
      ["b", "♠"],
    ];

    expect(findHandType(handCards).handScore).toBe("177b63");
  });

  it("HC", () => {
    const handCards: HandCards = [
      ["7", "♠"],
      ["6", "♣"],
      ["9", "♠"],
      ["3", "♥"],
      ["b", "♠"],
    ];

    expect(findHandType(handCards).handScore).toBe("0b9763");
  });

  it("7 cards", () => {
    const handCards: Card[] = [
      ["3", "♠"],
      ["8", "♠"],
      ["9", "♠"],
      ["c", "♠"],
      ["6", "♠"],
      ["c", "♥"],
      ["8", "♦"],
    ];

    expect(findHandType(handCards).handScore).toBe("5c9863");
  });
});
