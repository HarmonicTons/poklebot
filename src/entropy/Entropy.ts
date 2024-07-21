import { orderBy, sumBy } from "lodash";

type OutcomesDistribution<O extends string | number> = Record<O, number>;
type Entropy = number;
type RecommendationIndex = number;

// value from 0 to 1, 1: will always choose the most probable answer, 0: will always choose the most entropic answer
export type Greediness = number;

export type ChoiceWithRecommendation<C, O extends string | number> = {
  choice: C;
  outcomes: OutcomesDistribution<O>;
  entropy: Entropy;
  recommendationIndex: RecommendationIndex;
  probabilityOfBeingAnswer: number;
};

/**
 * what would be the outcome if this choice was made and this answer was the correct one
 */
type GetOutcome<C, P, O extends string | number> = (
  choice: C,
  possibleAnswer: P
) => O;

/**
 * what is the probability of this choice being the correct one
 */
type GetProbabilityOfBeingAnswer<O extends string | number> = (
  outcomes: OutcomesDistribution<O>
) => number;

/**
 * Get all possible outcomes for a given choice
 */
export const getAllPossibleOutcomes = <C, P, O extends string | number>({
  choice,
  possibleAnswers,
  getOutcome,
}: {
  // current choice to evaluate
  choice: C;
  // all possible answers
  possibleAnswers: P[];
  getOutcome: GetOutcome<C, P, O>;
}): OutcomesDistribution<O> => {
  return possibleAnswers.reduce((_outcomes, possibleAnswer) => {
    const outcome = getOutcome(choice, possibleAnswer);
    if (_outcomes[outcome] === undefined) {
      _outcomes[outcome] = 1;
    } else {
      _outcomes[outcome]++;
    }
    return _outcomes;
  }, {} as OutcomesDistribution<O>);
};

/**
 * Get the entropy of a distribution of outcomes
 */
export const getEntropy = <O extends string | number>({
  outcomes,
}: {
  outcomes: OutcomesDistribution<O>;
}): number => {
  const totalNbOfOutcomes = Object.values<number>(outcomes).reduce(
    (acc, nbOfOccurences) => acc + nbOfOccurences,
    0
  );
  const probabilities = Object.values<number>(outcomes).map(
    (nbOfOccurences) => nbOfOccurences / totalNbOfOutcomes
  );
  const entropy = sumBy(probabilities, (p) =>
    p === 0 ? 0 : -p * Math.log2(p)
  );
  return entropy;
};

/**
 * Get the recommendation index of a choice from its outcomes and entropy
 */
export const getRecommendationIndex = ({
  entropy,
  probabilityOfBeingAnswer,
  entropyToProbabilityScaleFactor = 5,
  greediness,
}: {
  entropy: number;
  probabilityOfBeingAnswer: number;
  // value used to bring the probability of being answer to the same scale as entropy
  entropyToProbabilityScaleFactor?: number;
  // value from 0 to 1, 1: will always choose the most probable answer, 0: will always choose the most entropic answer
  greediness: Greediness;
}): number => {
  return (
    entropy * (1 - greediness) +
    probabilityOfBeingAnswer * entropyToProbabilityScaleFactor * greediness
  );
};

/**
 * Get recommendations for all choices
 */
export const getChoicesWithRecommendations = <C, P, O extends string | number>({
  choices,
  possibleAnswers,
  getOutcome,
  getProbabilityOfBeingAnswer,
  entropyToProbabilityScaleFactor,
  greediness,
}: {
  // all possible choices
  choices: C[];
  // all possibles answers
  possibleAnswers: P[];
  getOutcome: GetOutcome<C, P, O>;
  getProbabilityOfBeingAnswer: GetProbabilityOfBeingAnswer<O>;
  entropyToProbabilityScaleFactor?: number;
  greediness: Greediness;
}): ChoiceWithRecommendation<C, O>[] => {
  const choicesWithRecommendations = choices.map((choice) => {
    const outcomes = getAllPossibleOutcomes({
      choice,
      possibleAnswers,
      getOutcome,
    });
    const entropy = getEntropy({ outcomes });
    const probabilityOfBeingAnswer = getProbabilityOfBeingAnswer(outcomes);
    const recommendationIndex = getRecommendationIndex({
      entropy,
      probabilityOfBeingAnswer,
      entropyToProbabilityScaleFactor,
      greediness,
    });

    return {
      choice,
      outcomes,
      entropy,
      recommendationIndex,
      probabilityOfBeingAnswer,
    };
  });
  return orderBy(choicesWithRecommendations, "recommendationIndex", "desc");
};
