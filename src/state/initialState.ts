import {
  VERSION,
  BASE_IMMIGRATION_RATE,
  STARTING_MORALE,
  STARTING_METAL,
  TURNS_PER_DAY,
  RIGHT,
  STARTING_FOOD,
  STARTING_POWER,
} from "~constants";
import { RawState } from "~types";

const initialState: RawState = {
  version: VERSION,
  entities: {},
  entitiesByPosition: {},
  messageLog: [],
  gameOver: false,
  victory: false,
  turnsUntilNextImmigrant: BASE_IMMIGRATION_RATE,
  morale: STARTING_MORALE,
  time: {
    isNight: false,
    turnsUntilChange: TURNS_PER_DAY,
    turn: 1,
    day: 1,
    directionWeights: { n: 0, s: 0, e: 0, w: 0 },
  },
  isBuildMenuOpen: false,
  isWeaponActive: false,
  resources: {
    METAL: STARTING_METAL,
    FOOD: STARTING_FOOD,
    POWER: STARTING_POWER,
    REFINED_METAL: 0,
  },
  jobPriorities: {
    POWER: 1,
    MINING: 2,
    FARMING: 3,
    REFINING: 4,
  },
  lastAimingDirection: RIGHT,
};

export default initialState;
