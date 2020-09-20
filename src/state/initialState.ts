import {
  BASE_IMMIGRATION_RATE,
  RIGHT,
  STARTING_MORALE,
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
    turn: 1,
    directionWeights: { n: 0, s: 0, e: 0, w: 0 },
  },
  laserState: "READY",
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
    FARMING: 1,
    POWER: 2,
    MINING: 3,
    MANUFACTURING: 4,
  },
  lastAimingDirection: RIGHT,
  cursorPos: null,
  isStartOfTurn: true,
  startOfThisTurn: null,
  startOfLastTurn: null,
};

initialState.startOfThisTurn = {
  ...initialState,
  startOfThisTurn: null,
  startOfLastTurn: null,
};

export default initialState;
