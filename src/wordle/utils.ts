const LETTER_PATTERNS = ["🟩", "🟨", "⬜️"] as const;
export type LetterPattern = (typeof LETTER_PATTERNS)[number];
export type WordPattern = [
  LetterPattern,
  LetterPattern,
  LetterPattern,
  LetterPattern,
  LetterPattern
];

export const playGuess = ({
  answer,
  guess,
}: {
  answer: string;
  guess: string;
}): WordPattern => {
  const wordPattern: WordPattern = ["⬜️", "⬜️", "⬜️", "⬜️", "⬜️"];
  const letters = [...answer.split("")];
  for (let i = 0; i < 5; i++) {
    const letterIndex = letters.indexOf(guess[i]);
    if (letterIndex > -1) {
      if (guess[i] === answer[i]) {
        wordPattern[i] = "🟩";
      } else {
        wordPattern[i] = "🟨";
      }
      letters[letterIndex] = "_";
      continue;
    }
    wordPattern[i] = "⬜️";
  }
  return wordPattern;
};

export const isValidHardModeGuess = ({
  guess,
  previousGuess,
  previousGuessPattern,
}: {
  guess: string;
  previousGuess: string;
  previousGuessPattern: WordPattern;
}): boolean => {
  return previousGuessPattern.every((p, i) => {
    if (p === "🟩" && guess[i] !== previousGuess[i]) {
      return false;
    }
    if (p === "🟨" && guess.includes(previousGuess[i]) === false) {
      return false;
    }
    return true;
  });
};
