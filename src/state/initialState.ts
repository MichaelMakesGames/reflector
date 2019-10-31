import {
  VERSION,
  BASE_IMMIGRATION_RATE,
  STARTING_MORALE,
  TURNS_BETWEEN_WAVES_BASE,
  RIGHT,
  UP,
  DOWN,
  LEFT,
  STARTING_METAL,
} from "~constants";
import { choose } from "~utils/rng";
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
  wave: {
    turnsUntilCurrentWaveEnd: 0,
    turnsUntilNextWaveStart: TURNS_BETWEEN_WAVES_BASE,
    direction: choose([UP, DOWN, LEFT, RIGHT]),
  },
  isBuildMenuOpen: false,
  resources: {
    METAL: STARTING_METAL,
  },
};

export default initialState;
