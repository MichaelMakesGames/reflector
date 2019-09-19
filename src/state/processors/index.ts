import { GameState } from "~/types";
import processAI from "./processAI";
import processGameOver from "./processGameOver";

const processors: ((state: GameState) => GameState)[] = [
  processAI,
  processGameOver,
];

export default processors;
