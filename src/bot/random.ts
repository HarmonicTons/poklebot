import { Pokle } from "../pokle/Pokle";

export const getRandomRecommendation = (pokle: Pokle) => {
  if (pokle.remainingBoards === null) {
    throw new Error("Pokle must be solved first");
  }
  const randomBoard =
    pokle.remainingBoards[
      Math.floor(Math.random() * pokle.remainingBoards.length)
    ];
  return randomBoard;
};
