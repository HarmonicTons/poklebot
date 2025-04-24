import { isValidHardModeGuess, playGuess } from "./utils";

describe("wordle", () => {
  describe("playGuess", () => {
    it("should return 🟩🟩🟩🟩🟩", () => {
      const pattern = playGuess({ answer: "hello", guess: "hello" });
      expect(pattern).toEqual(["🟩", "🟩", "🟩", "🟩", "🟩"]);
    });

    it("should return ⬜️⬜️⬜️⬜️⬜️", () => {
      const pattern = playGuess({ answer: "fuzzy", guess: "spate" });
      expect(pattern).toEqual(["⬜️", "⬜️", "⬜️", "⬜️", "⬜️"]);
    });

    it("should return 🟩🟩🟩⬜️🟩", () => {
      const pattern = playGuess({ answer: "abate", guess: "abase" });
      expect(pattern).toEqual(["🟩", "🟩", "🟩", "⬜️", "🟩"]);
    });

    it("should return 🟩🟩⬜️🟨🟨", () => {
      const pattern = playGuess({ answer: "abled", guess: "abode" });
      expect(pattern).toEqual(["🟩", "🟩", "⬜️", "🟨", "🟨"]);
    });

    it("should return 🟩🟩⬜️🟨⬜️", () => {
      const pattern = playGuess({ answer: "abate", guess: "abbey" });
      expect(pattern).toEqual(["🟩", "🟩", "⬜️", "🟨", "⬜️"]);
    });

    it("should return ⬜️🟩🟨⬜️🟨", () => {
      const pattern = playGuess({ answer: "lemon", guess: "hello" });
      expect(pattern).toEqual(["⬜️", "🟩", "🟨", "⬜️", "🟨"]);
    });
  });

  describe("isValidHardModeGuess", () => {
    it("should return true", () => {
      const isValid = isValidHardModeGuess({
        guess: "abase",
        previousGuess: "abate",
        previousGuessPattern: ["🟩", "🟩", "🟩", "⬜️", "🟩"],
      });
      expect(isValid).toBe(true);
    });

    it("should return false", () => {
      const isValid = isValidHardModeGuess({
        guess: "abbey",
        previousGuess: "abate",
        previousGuessPattern: ["🟩", "🟩", "⬜️", "🟨", "⬜️"],
      });
      expect(isValid).toBe(false);
    });

    it("should return true", () => {
      const isValid = isValidHardModeGuess({
        guess: "aback",
        previousGuess: "abate",
        previousGuessPattern: ["🟩", "🟩", "🟩", "⬜️", "⬜️"],
      });
      expect(isValid).toBe(true);
    });
  });
});
