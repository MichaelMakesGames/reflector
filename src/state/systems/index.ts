import WrappedState from "~types/WrappedState";
import aimingSystem from "./aimingSystem";
import aiSystem from "./aiSystem";
import animationToggleSystem from "./animationToggleSystem";
import bordersSystem from "./bordersSystem";
import buildingSystem from "./buildingSystem";
import colonistsSystem from "./colonistsSystem";
import colorToggleSystem from "./colorToggleSystem";
import emitterSystem from "./emitterSystem";
import eventSystem from "./eventSystem";
import gameOverSystem from "./gameOverSystem";
import hungerSystem from "./hungerSystem";
import immigrationSystem from "./immigrationSystem";
import laserRechargingSystem from "./laserRechargingSystem";
import missingResourceIndicatorSystem from "./missingResourceIndicatorSystem";
import poweredSystem from "./poweredSystem";
import productionSystem from "./productionSystem";
import reflectorSystem from "./reflectorSystem";
import timeSystem from "./timeSystem";
import waveSystem from "./waveSystem";

const systems: ((state: WrappedState) => void)[] = [
  aiSystem,
  productionSystem,
  immigrationSystem,
  colonistsSystem,
  hungerSystem,
  waveSystem,
  poweredSystem,
  reflectorSystem,
  laserRechargingSystem,
  aimingSystem,
  buildingSystem,
  eventSystem,
  timeSystem,
  gameOverSystem,
  emitterSystem,
  bordersSystem,
  missingResourceIndicatorSystem,
  colorToggleSystem,
  animationToggleSystem,
];

export default systems;
