import WrappedState from "~types/WrappedState";
import processAI from "./processAI";
import processAiming from "./processAiming";
import processAnimationToggle from "./processAnimationToggle";
import processBorders from "./processBorders";
import processBuilding from "./processBuilding";
import processColonists from "./processColonists";
import processColorToggle from "./processColorToggle";
import processEmitters from "./processEmitters";
import processEvents from "./processEvents";
import processGameOver from "./processGameOver";
import processHunger from "./processHunger";
import processImmigration from "./processImmigration";
import processLaserRecharging from "./processLaserRecharging";
import processMissingResourceIndicators from "./processMissingResourceIndicators";
import processPowered from "./processPowered";
import processProduction from "./processProduction";
import processReflectors from "./processReflectors";
import processTime from "./processTime";
import processWave from "./processWave";

const processors: ((state: WrappedState) => void)[] = [
  processAI,
  processProduction,
  processImmigration,
  processColonists,
  processHunger,
  processWave,
  processPowered,
  processReflectors,
  processLaserRecharging,
  processAiming,
  processBuilding,
  processEvents,
  processTime,
  processGameOver,
  processEmitters,
  processBorders,
  processMissingResourceIndicators,
  processColorToggle,
  processAnimationToggle,
];

export default processors;
