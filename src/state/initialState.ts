import {
  BASE_IMMIGRATION_RATE,
  RIGHT,
  STARTING_MORALE,
  VERSION,
  NEW_COLONISTS_PER_DAY,
  FOOD_PER_COLONIST,
} from "../constants";
import { RawState } from "../types";
import { TutorialId } from "../types/TutorialId";

export function createInitialState({
  completedTutorials,
  mapType,
}: {
  completedTutorials: TutorialId[];
  mapType: string;
}) {
  const initialState: RawState = {
    version: VERSION,
    mapType: mapType ?? "standard",
    entities: {},
    entitiesByPosition: {},
    entitiesByComp: {},
    messageLog: [],
    gameOver: false,
    victory: false,
    morale: STARTING_MORALE,
    time: {
      turn: 0,
      directionWeights: { n: 0, s: 0, e: 0, w: 0 },
    },
    laserState: "READY",
    resources: {
      METAL: 0,
      FOOD: NEW_COLONISTS_PER_DAY * FOOD_PER_COLONIST * 2,
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
      FARMS: 1,
      MINING_SPOTS: 2,
      MINES: 3,
      FACTORIES: 4,
    },
    events: {},
    lastAimingDirection: RIGHT,
    isAutoMoving: false,
    lastMoveWasFast: false,
    bordersKey: null,
    tutorials: {
      completed: completedTutorials,
      active: completedTutorials.includes(TutorialId.Basics)
        ? []
        : [
            {
              id: TutorialId.Basics,
              step: 0,
            },
          ],
    },
  };

  return initialState;
}
