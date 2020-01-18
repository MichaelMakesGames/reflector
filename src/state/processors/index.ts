import WrappedState from "~types/WrappedState";
import processAI from "./processAI";
import processColonists from "./processColonists";
import processGameOver from "./processGameOver";
import processHunger from "./processHunger";
import processImmigration from "./processImmigration";
import processProduction from "./processProduction";
import processReflectors from "./processReflectors";
import processTime from "./processTime";
import processWave from "./processWave";

const processors: ((state: WrappedState) => void)[] = [
  processAI,
  processColonists,
  processImmigration,
  processProduction,
  processHunger,
  processWave,
  processReflectors,
  processTime,
  processGameOver,
];

export default processors;
