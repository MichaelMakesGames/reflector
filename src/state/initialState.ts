import {
  BASE_IMMIGRATION_RATE,
  RIGHT,
  STARTING_MORALE,
  VERSION,
} from "~constants";
import { RawState } from "~types";
import { TutorialId } from "~types/TutorialId";

export function createInitialState({
  completedTutorials,
}: {
  completedTutorials: TutorialId[];
}) {
  const initialState: RawState = {
    version: VERSION,
    entities: {},
    entitiesByPosition: {},
    entitiesByComp: {},
    messageLog: [],
    gameOver: false,
    victory: false,
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
    events: {},
    lastAimingDirection: RIGHT,
    cursorPos: null,
    isAutoMoving: false,
    startOfThisTurn: null,
    startOfLastTurn: null,
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

  initialState.startOfThisTurn = {
    ...initialState,
    startOfThisTurn: null,
    startOfLastTurn: null,
  };

  return initialState;
}
