import { Pokle } from "../pokle/Pokle";

export const getRandomRecommendation = (pokle: Pokle) => {
  if (pokle.remaingBoards === null) {
    throw new Error("Pokle must be solved first");
  }
  const randomBoard =
    pokle.remaingBoards[Math.floor(Math.random() * pokle.remaingBoards.length)];
  return randomBoard;
};
