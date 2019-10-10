import { GameState } from "~/types";
import processAI from "./processAI";
import processGameOver from "./processGameOver";
import processImmigration from "./processImmigration";
import processMigration from "./processMigration";
import processReflectors from "./processReflectors";
import processWave from "./processWave";

const processors: ((state: GameState) => GameState)[] = [
  processAI,
  processImmigration,
  processMigration,
  processGameOver,
  processWave,
  processReflectors,
];

export default processors;
