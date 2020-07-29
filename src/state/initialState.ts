import {
  BASE_IMMIGRATION_RATE,
  RIGHT,
  STARTING_MORALE,
  TURNS_PER_DAY,
  VERSION,
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
  isWeaponActive: false,
  resources: {
    METAL: 0,
    FOOD: 0,
    POWER: 0,
    MACHINERY: 0,
  },
  resourceChanges: {
    METAL: [],
    FOOD: [],
    POWER: [],
    MACHINERY: [],
  },
  resourceChangesThisTurn: {
    METAL: [],
    FOOD: [],
    POWER: [],
    MACHINERY: [],
  },
  jobPriorities: {
    POWER: 1,
    MINING: 2,
    FARMING: 3,
    MANUFACTURING: 4,
  },
  lastAimingDirection: RIGHT,
  cursorPos: null,
};

export default initialState;
