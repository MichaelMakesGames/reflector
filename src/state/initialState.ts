import {
  VERSION,
  BASE_IMMIGRATION_RATE,
  STARTING_MORALE,
  STARTING_METAL,
  TURNS_PER_DAY,
} from "~constants";
import { GameState } from "~types";

const initialState: GameState = {
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
  resources: {
    METAL: STARTING_METAL,
  },
};

export default initialState;
