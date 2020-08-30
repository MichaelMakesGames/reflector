import WrappedState from "~types/WrappedState";
import processAI from "./processAI";
import processAnimationToggle from "./processAnimationToggle";
import processBorders from "./processBorders";
import processColonists from "./processColonists";
import processColorToggle from "./processColorToggle";
import processEmitters from "./processEmitters";
import processGameOver from "./processGameOver";
import processHunger from "./processHunger";
import processImmigration from "./processImmigration";
import processLaserRecharging from "./processLaserRecharging";
import processPowered from "./processPowered";
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
  processPowered,
  processReflectors,
  processLaserRecharging,
  processTime,
  processGameOver,
  processEmitters,
  processBorders,
  processColorToggle,
  processAnimationToggle,
];

export default processors;
