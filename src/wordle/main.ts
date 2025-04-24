import { getChoicesWithRecommendations } from "../entropy/entropy";
import { isValidHardModeGuess, playGuess } from "./utils";
import { passedWords, allScrabbleWords } from "./words";

const main = async () => {
  console.log(`All scrabble 5 letters words: ${allScrabbleWords.length}`);
  console.log(`Passed wordle words: ${passedWords.length}`);
  const allConsonnes = "bcdfghjklmnpqrstvwxsz".split("");
  const onlyConsonnesWords = allScrabbleWords.filter(
    (w) =>
      allConsonnes.includes(w[0]) &&
      allConsonnes.includes(w[1]) &&
      allConsonnes.includes(w[2]) &&
      allConsonnes.includes(w[3]) &&
      allConsonnes.includes(w[4])
  );
  console.log(`Words only made of consonnes: ${onlyConsonnesWords.length}`);
  const pluralWords = allScrabbleWords.filter(
    (w) => (w.endsWith("s") && allConsonnes.includes(w[3])) || w.endsWith("es")
  );
  console.log(`Words finishing by ES or "consonne + S": ${pluralWords.length}`);

  const validWords = allScrabbleWords
    .filter((word) => !onlyConsonnesWords.includes(word))
    .filter((word) => !passedWords.includes(word))
    .filter((word) => !pluralWords.includes(word));

  console.log(`Remaining valid words: ${validWords.length}`);
  const res = getChoicesWithRecommendations({
    choices: validWords,
    possibleAnswers: validWords,
    getOutcome: (answer, guess) => playGuess({ answer, guess }).join(""),
    getProbabilityOfBeingAnswer: () => 0,
    greediness: 0,
    entropyToProbabilityScaleFactor: 5,
  });
  console.log(
    res
      .map(
        ({ choice, entropy }) =>
          `${choice.toUpperCase()} (${entropy.toFixed(2)})`
      )
      .slice(0, 5)
      .join("\n")
  );
  console.log("...");
  console.log(
    res
      .map(
        ({ choice, entropy }) =>
          `${choice.toUpperCase()} (${entropy.toFixed(2)})`
      )
      .slice(-5)
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
