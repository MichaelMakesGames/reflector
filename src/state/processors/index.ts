import WrappedState from "~types/WrappedState";
import processAI from "./processAI";
import processColonists from "./processColonists";
import processGameOver from "./processGameOver";
import processImmigration from "./processImmigration";
import processMigration from "./processMigration";
import processProduction from "./processProduction";
import processReflectors from "./processReflectors";
import processTime from "./processTime";
import processWave from "./processWave";

const processors: ((state: WrappedState) => void)[] = [
  processMigration,
  processAI,
  processColonists,
  processImmigration,
  processMigration,
  processProduction,
  processWave,
  processReflectors,
  processTime,
  processGameOver,
];

export default processors;
