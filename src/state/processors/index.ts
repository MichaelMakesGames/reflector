import { GameState } from "../../types";
import processAI from "./processAI";
import processBombs from "./processBombs";
import processCooldowns from "./processCooldowns";
import processFactories from "./processFactories";
import processGameOver from "./processGameOver";
import processPickups from "./processPickups";
import processStairs from "./processStairs";
import processTeleporters from "./processTeleporters";

const processors: ((state: GameState) => GameState)[] = [
  processTeleporters,
  processBombs,
  processAI,
  processFactories,
  processCooldowns,
  processPickups,
  processStairs,
  processGameOver,
];

export default processors;
