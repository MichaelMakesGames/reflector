import { GameState } from "~/types";
import processAI from "./processAI";
import processGameOver from "./processGameOver";
import processImmigration from "./processImmigration";

const processors: ((state: GameState) => GameState)[] = [
  processAI,
  processImmigration,
  processGameOver,
];

export default processors;
