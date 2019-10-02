import { GameState } from "~/types";
import processAI from "./processAI";
import processGameOver from "./processGameOver";
import processImmigration from "./processImmigration";
import processWave from "./processWave";

const processors: ((state: GameState) => GameState)[] = [
  processAI,
  processImmigration,
  processGameOver,
  processWave,
];

export default processors;
