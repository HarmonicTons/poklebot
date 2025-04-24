import { getChoicesWithRecommendations } from "../entropy/entropy";
import { isValidHardModeGuess, playGuess } from "./utils";
import { wordleWords, passedWords } from "./words";

const main = async () => {
  const remainingWords = wordleWords.filter(
    (word) => !passedWords.includes(word)
  );
  console.log(`Remaining words: ${remainingWords.length}`);
  const res = getChoicesWithRecommendations({
    choices: remainingWords,
    possibleAnswers: remainingWords,
    getOutcome: (answer, guess) => playGuess({ answer, guess }).join(""),
    getProbabilityOfBeingAnswer: () => 0,
    greediness: 0,
    entropyToProbabilityScaleFactor: 5,
  });
  console.log(
    res
      .map(({ choice, entropy }) => `${choice} ${entropy.toFixed(2)}`)
      .join("\n")
  );
  // for (const firstGuess of [...wordleWords].splice(0, 100)) {
  //   const pattern = playGuess({ answer, guess: firstGuess });
  //   const remainingWords = wordleWords.filter((word) =>
  //     isValidHardModeGuess({
  //       guess: word,
  //       previousGuess: firstGuess,
  //       previousGuessPattern: pattern,
  //     })
  //   );
  //   console.log(firstGuess, pattern, remainingWords.length);
  // }
};

main().catch(console.error);
