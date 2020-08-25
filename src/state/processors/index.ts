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
import processPowered from "./processPowered";
import processEmitters from "./processEmitters";
import processBorders from "./processBorders";
import processColorToggle from "./processColorToggle";
import processAnimationToggle from "./processAnimationToggle";

const processors: ((state: WrappedState) => void)[] = [
  processAI,
  processColonists,
  processImmigration,
  processProduction,
  processHunger,
  processWave,
  processPowered,
  processReflectors,
  processTime,
  processGameOver,
  processEmitters,
  processBorders,
  processColorToggle,
  processAnimationToggle,
];

export default processors;
