import { getType } from "typesafe-actions";
import selectors from "../state/selectors";
import { ControlCode } from "../types/ControlCode";
import { Tutorial } from "../types/Tutorial";
import { TutorialId } from "../types/TutorialId";
import { BuildingCategoryCode } from "./buildingCategories";
import { ResourceCode } from "./resources";
import { RawState } from "../types";

const tutorials: Record<TutorialId, Tutorial> = {
  [TutorialId.Basics]: {
    id: TutorialId.Basics,
    label: "Basics",
    steps: [
      {
        text: "tutorials.basics.0",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            [
              getType(nextState.actions.move),
              getType(nextState.actions.autoMove),
            ] as string[]
          ).includes(action.type);
        },
      },
      {
        text: "tutorials.basics.1",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            action.type === getType(nextState.actions.blueprintSelect) &&
            action.payload === "BLUEPRINT_FARM"
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Work}"]`,
          `[data-building="BUILDING_FARM"]`,
        ],
      },
      {
        text: "tutorials.basics.2",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select.entitiesWithTemplate("BUILDING_FARM").length >= 1
          );
        },
      },
      {
        text: "tutorials.basics.3",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select.entitiesWithTemplate("BUILDING_MINING_SPOT")
              .length >= 1
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Work}"]`,
          `[data-building="BUILDING_MINING_SPOT"]`,
        ],
      },
      {
        text: "tutorials.basics.4",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select.entitiesWithTemplate("BUILDING_MINING_SPOT")
              .length >= 2
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Work}"]`,
          `[data-building="BUILDING_MINING_SPOT"]`,
        ],
      },
      {
        text: "tutorials.basics.5",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select.entitiesWithTemplate("BUILDING_TENT").length >= 3
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Housing}"]`,
          `[data-building="BUILDING_TENT"]`,
        ],
      },
      {
        text: "tutorials.basics.6",
        checkForCompletion: (prevState, nextState, action) => {
          return nextState.select.resource(ResourceCode.Metal) >= 8;
        },
        elementHighlightSelectors: [
          `[data-control-code="${ControlCode.Wait}"]`,
          `[data-resource="${ResourceCode.Metal}"]`,
        ],
      },
      {
        text: "tutorials.basics.7",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select.entitiesWithTemplate("BUILDING_WINDMILL").length >=
            1
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Power}"]`,
          `[data-building="BUILDING_WINDMILL"]`,
        ],
      },
      {
        text: "tutorials.basics.8",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select.entitiesWithTemplate("BUILDING_PROJECTOR_BASIC")
              .length >= 1
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Defense}"]`,
          `[data-building="BUILDING_PROJECTOR_BASIC"]`,
        ],
      },
      {
        text: "tutorials.basics.9",
        checkForCompletion: () => false,
        isDismissible: true,
      },
    ],
    triggerSelector: () => true,
  },
  [TutorialId.Combat]: {
    id: TutorialId.Combat,
    label: "Combat",
    steps: [
      {
        text: "tutorials.combat.0",
        checkForCompletion: (prevState, nextState, action) =>
          nextState.select.isWeaponActive(),
        elementHighlightSelectors: [
          `[data-control-code="${ControlCode.Fire}"]`,
        ],
      },
      {
        text: "tutorials.combat.1",
        checkForCompletion: (prevState, nextState, action) =>
          action.type === getType(nextState.actions.targetWeapon),
        elementHighlightSelectors: [`#AIMING_ARROWS`],
      },
      {
        text: "tutorials.combat.2",
        checkForCompletion: (prevState, nextState, action) => {
          return Boolean(
            action.type === getType(nextState.actions.addEntity) &&
              action.payload.reflector &&
              action.payload.pos &&
              nextState.select
                .entitiesAtPosition(action.payload.pos)
                .some((e) => e.laser)
          );
        },
      },
      {
        text: "tutorials.combat.3",
        checkForCompletion: (prevState, nextState, action) => {
          return Boolean(
            action.type === getType(nextState.actions.addEntity) &&
              action.payload.reflector &&
              action.payload.pos &&
              nextState.select.entitiesWithComps("reflector").length >= 2
          );
        },
      },
      {
        text: "tutorials.combat.4",
        checkForCompletion: (prevState, nextState, action) => {
          return Boolean(
            action.type === getType(nextState.actions.rotateEntity) &&
              action.payload.reflector
          );
        },
      },
      {
        text: "tutorials.combat.5",
        checkForCompletion: (prevState, nextState, action) => {
          return action.type === getType(nextState.actions.removeReflector);
        },
      },
      {
        text: "tutorials.combat.6",
        checkForCompletion: (prevState, nextState, action) => {
          return action.type === getType(nextState.actions.fireWeapon);
        },
        elementHighlightSelectors: [
          `[data-control-code="${ControlCode.Fire}"]`,
        ],
      },
      {
        text: "tutorials.combat.7",
        checkForCompletion: (prevState, nextState, action) => {
          return prevState.select.turn() < nextState.select.turn();
        },
        elementHighlightSelectors: [`[data-status="LASER"]`],
      },
      {
        text: "tutorials.combat.8",
        checkForCompletion: () => false,
        isDismissible: true,
      },
    ],
    triggerSelector: selectors.areEnemiesPresent,
  },
  [TutorialId.Morale]: {
    id: TutorialId.Morale,
    label: "Morale",
    steps: [
      {
        text: "tutorials.morale.0",
        checkForCompletion: () => false,
        isDismissible: true,
        elementHighlightSelectors: [
          `[data-status="MORALE"]`,
          `[data-control-code="${ControlCode.Undo}"]`,
        ],
      },
    ],
    triggerSelector: selectors.hasLostMorale,
  },
  [TutorialId.JobPriorities]: {
    id: TutorialId.JobPriorities,
    label: "Job Priorities",
    steps: [
      {
        text: "tutorials.jobPriorities.0",
        checkForCompletion: (prevState, nextState, action) => {
          const allowedActionTypes: string[] = [
            getType(nextState.actions.setJobPriority),
            getType(nextState.actions.increaseJobPriority),
            getType(nextState.actions.decreaseJobPriority),
          ];
          return allowedActionTypes.includes(action.type);
        },
        elementHighlightSelectors: [`[data-section="JOBS"]`],
      },
      {
        text: "tutorials.jobPriorities.1",
        checkForCompletion: (prevState, nextState, action) => {
          const allowedActionTypes: string[] = [
            getType(nextState.actions.toggleDisabled),
          ];
          return allowedActionTypes.includes(action.type);
        },
      },
      {
        text: "tutorials.jobPriorities.2",
        checkForCompletion: () => false,
        isDismissible: true,
      },
    ],
    triggerSelector: (state: RawState) =>
      selectors.areThereMoreJobsThanColonists(state) &&
      !selectors.isNight(state) &&
      selectors.day(state) > 0,
  },
  [TutorialId.Residence]: {
    id: TutorialId.Residence,
    label: "Residences and Tents",
    steps: [
      {
        text: "tutorials.residence.0",
        checkForCompletion: () => false,
        isDismissible: true,
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Housing}"]`,
          `[data-building="BUILDING_TENT"]`,
          `[data-building="BUILDING_RESIDENCE"]`,
        ],
      },
    ],
    triggerSelector: (state: RawState) =>
      selectors.homelessColonists(state).length > 0 &&
      selectors.isNight(state) &&
      selectors.day(state) > 0,
  },
  [TutorialId.Rotate]: {
    id: TutorialId.Rotate,
    label: "Rotatable Buildings",
    steps: [
      {
        text: "tutorials.rotate.0",
        checkForCompletion: () => false,
        isDismissible: true,
        elementHighlightSelectors: [
          `[data-control-code="${ControlCode.RotateBuilding}"]`,
        ],
      },
    ],
    triggerSelector: (state: RawState) =>
      Boolean(selectors.blueprint(state)?.rotatable),
  },
};

export default tutorials;
