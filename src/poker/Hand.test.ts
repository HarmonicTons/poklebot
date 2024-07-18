import { Card } from "./Card";
import { Hand, HandCards } from "./Hand";

describe("Hand", () => {
  describe("Hand rank", () => {
    it("SF", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("9", "♠"),
        new Card("J", "♠"),
        new Card("8", "♠"),
        new Card("10", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.rank).toBe("SF");
    });

    it("4K", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("9", "♠"),
        new Card("7", "♠"),
        new Card("7", "♠"),
        new Card("7", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.rank).toBe("4K");
    });

    it("FH", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("7", "♠"),
        new Card("A", "♠"),
        new Card("7", "♠"),
        new Card("A", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.rank).toBe("FH");
    });

    it("FL", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("5", "♠"),
        new Card("4", "♠"),
        new Card("3", "♠"),
        new Card("2", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.rank).toBe("FL");
    });

    it("ST", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("4", "♠"),
        new Card("3", "♥"),
        new Card("5", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.rank).toBe("ST");
    });

    it("3K", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("7", "♠"),
        new Card("3", "♥"),
        new Card("7", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.rank).toBe("3K");
    });

    it("DP", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("7", "♠"),
        new Card("6", "♥"),
        new Card("A", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.rank).toBe("DP");
    });

    it("P", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("7", "♠"),
        new Card("3", "♥"),
        new Card("A", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.rank).toBe("P");
    });

    it("HC", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("9", "♠"),
        new Card("3", "♥"),
        new Card("A", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.rank).toBe("HC");
    });
  });

  describe("Hand score", () => {
    it("SF", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("9", "♠"),
        new Card("J", "♠"),
        new Card("8", "♠"),
        new Card("10", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.hexScore).toBe("8ba987");
    });

    it("4K", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("9", "♠"),
        new Card("7", "♠"),
        new Card("7", "♠"),
        new Card("7", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.hexScore).toBe("777779");
    });

    it("FH", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("7", "♠"),
        new Card("10", "♠"),
        new Card("7", "♠"),
        new Card("10", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.hexScore).toBe("6777aa");
    });

    it("FL", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("5", "♠"),
        new Card("4", "♠"),
        new Card("3", "♠"),
        new Card("2", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.hexScore).toBe("575432");
    });

    it("ST", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("4", "♠"),
        new Card("3", "♥"),
        new Card("5", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.hexScore).toBe("476543");
    });

    it("3K", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("7", "♠"),
        new Card("3", "♥"),
        new Card("7", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.hexScore).toBe("377763");
    });

    it("DP", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("7", "♠"),
        new Card("6", "♥"),
        new Card("J", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.hexScore).toBe("27766b");
    });

    it("P", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("7", "♠"),
        new Card("3", "♥"),
        new Card("J", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.hexScore).toBe("177b63");
    });

    it("HC", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("6", "♣"),
        new Card("9", "♠"),
        new Card("3", "♥"),
        new Card("J", "♠"),
      ];
      const hand = new Hand(handCards);
      expect(hand.hexScore).toBe("0b9763");
    });
  });

  describe("Get best hand", () => {
    it("5 cards", () => {
      const handCards: HandCards = [
        new Card("7", "♠"),
        new Card("9", "♠"),
        new Card("J", "♠"),
        new Card("8", "♠"),
        new Card("10", "♠"),
      ];
      const bestHand = Hand.getBestHand(handCards);
      expect(bestHand.hexScore).toBe("8ba987");
    });

    it("6 cards", () => {
      const handCards: Card[] = [
        new Card("7", "♠"),
        new Card("7", "♠"),
        new Card("Q", "♠"),
        new Card("Q", "♠"),
        new Card("Q", "♠"),
        new Card("8", "♦"),
      ];
      const bestHand = Hand.getBestHand(handCards);
      expect(bestHand.hexScore).toBe("6ccc77");
    });

    it("7 cards", () => {
      const handCards: Card[] = [
        new Card("3", "♠"),
        new Card("8", "♠"),
        new Card("9", "♠"),
        new Card("Q", "♠"),
        new Card("6", "♠"),
        new Card("Q", "♥"),
        new Card("8", "♦"),
      ];
      const bestHand = Hand.getBestHand(handCards);
      expect(bestHand.hexScore).toBe("5c9863");
    });

    it("too many pairs", () => {
      const handCards: Card[] = [
        new Card("7", "♦"),
        new Card("7", "♠"),
        new Card("Q", "♠"),
        new Card("Q", "♦"),
        new Card("Q", "♣"),
        new Card("Q", "♥"),
        new Card("8", "♦"),
      ];
      const bestHand = Hand.getBestHand(handCards);
      expect(bestHand.hexScore).toBe("7cccc8");
    });
  });
});
