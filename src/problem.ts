import { Guess, Problem, STAGES } from "./model";
import { sum } from "lodash";

const stageScoresIsValid = (stageScores: number[]): boolean => {
  return sum(stageScores) === 6 && stageScores.includes(1);
};

export const problemIsValid = (problem: Problem): boolean => {
  const players = problem.map((player) => player.name);
  const playersAreUnique = new Set(players).size === players.length;
  if (!playersAreUnique) {
    return false;
  }

  const allStagesAreValid = STAGES.every((stage) => {
    const stageScores = problem.reduce((scores, player) => {
      return [...scores, player.stagesScore[stage]];
    }, [] as number[]);
    const stageIsValid = stageScoresIsValid(stageScores);
    return stageIsValid;
  });

  if (allStagesAreValid === false) {
    return false;
  }

  return true;
};
