import { GameState } from "~/types";
import processAI from "./processAI";
import processGameOver from "./processGameOver";
import processImmigration from "./processImmigration";
import processMigration from "./processMigration";
import processProduction from "./processProduction";
import processReflectors from "./processReflectors";
import processWave from "./processWave";
import processTime from "./processTime";

const processors: ((state: GameState) => GameState)[] = [
  processMigration,
  processAI,
  processImmigration,
  processProduction,
  processWave,
  processReflectors,
  processTime,
  processGameOver,
];

export default processors;
