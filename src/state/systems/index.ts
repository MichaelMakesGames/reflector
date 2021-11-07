import WrappedState from "../../types/WrappedState";
import absorberSystem from "./absorberSystem";
import absorberTriggerSystem from "./absorberTriggerSystem";
import aimingSystem from "./aimingSystem";
import aiSystem from "./aiSystem";
import animationToggleSystem from "./animationToggleSystem";
import audioToggleSystem from "./audioToggleSystem";
import bordersSystem from "./bordersSystem";
import buildingSystem from "./buildingSystem";
import colonistsSystem from "./colonistsSystem";
import colorToggleSystem from "./colorToggleSystem";
import directionIndicationSystem from "./directionIndicationSystem";
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
import shieldSystem from "./shieldSystem";
import storageSystem from "./storageSystem";
import timeSystem from "./timeSystem";
import waveSystem from "./waveSystem";
import windowsSystem from "./windowsSystem";

export const turnEndSystems: ((state: WrappedState) => void)[] = [
  absorberSystem,
  waveSystem,
  aiSystem,
  absorberTriggerSystem,
  productionSystem,
  immigrationSystem,
  colonistsSystem,
  hungerSystem,
  poweredSystem,
  shieldSystem,
  storageSystem,
  reflectorSystem,
  laserRechargingSystem,
  eventSystem,
  timeSystem,
  gameOverSystem,
];

export const cosmeticSystems: ((state: WrappedState) => void)[] = [
  aimingSystem,
  buildingSystem,
  emitterSystem,
  bordersSystem,
  windowsSystem,
  directionIndicationSystem,
  missingResourceIndicatorSystem,
  colorToggleSystem,
  animationToggleSystem,
  audioToggleSystem,
];
