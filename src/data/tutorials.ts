import { getType } from "typesafe-actions";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { ControlCode } from "~types/ControlCode";
import { Tutorial } from "~types/Tutorial";
import { TutorialId } from "~types/TutorialId";
import { BuildingCategoryCode } from "./buildingCategories";
import { ResourceCode } from "./resources";
import { RawState } from "~types";

const tutorials: Record<TutorialId, Tutorial> = {
  [TutorialId.Basics]: {
    id: TutorialId.Basics,
    label: "Basics",
    steps: [
      {
        text: "tutorials.basics.0",
        checkForCompletion: (prevState, nextState, action) => {
          return ([
            getType(actions.move),
            getType(actions.autoMove),
          ] as string[]).includes(action.type);
        },
      },
      {
        text: "tutorials.basics.1",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            action.type === getType(actions.blueprintSelect) &&
            action.payload === "BLUEPRINT_FARM"
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Production}"]`,
          `[data-building="BUILDING_FARM"]`,
        ],
      },
      {
        text: "tutorials.basics.2",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select
              .entitiesWithTemplate("BUILDING_FARM")
              .filter((e) => e.jobProvider).length >= 1
          );
        },
      },
      {
        text: "tutorials.basics.3",
        checkForCompletion: (prevState, nextState, action) => {
          return !nextState.select.blueprint();
        },
        elementHighlightSelectors: [
          `[data-section="BOTTOM_MENU"] [data-control-code="${ControlCode.Back}"]`,
        ],
      },
      {
        text: "tutorials.basics.4",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select
              .entitiesWithTemplate("BUILDING_MINING_SPOT")
              .filter((e) => e.jobProvider).length >= 1
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Production}"]`,
          `[data-building="BUILDING_MINING_SPOT"]`,
        ],
      },
      {
        text: "tutorials.basics.5",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select
              .entitiesWithTemplate("BUILDING_MINING_SPOT")
              .filter((e) => e.jobProvider).length >= 2
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Production}"]`,
          `[data-building="BUILDING_MINING_SPOT"]`,
        ],
      },
      {
        text: "tutorials.basics.6",
        checkForCompletion: (prevState, nextState, action) => {
          return nextState.select.resource(ResourceCode.Metal) >= 20;
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
            nextState.select
              .entitiesWithTemplate("BUILDING_WINDMILL")
              .filter((e) => e.production).length >= 1
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Production}"]`,
          `[data-building="BUILDING_WINDMILL"]`,
        ],
      },
      {
        text: "tutorials.basics.8",
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
          action.type === getType(actions.targetWeapon),
        elementHighlightSelectors: [`#AIMING_ARROWS`],
      },
      {
        text: "tutorials.combat.2",
        checkForCompletion: (prevState, nextState, action) => {
          return Boolean(
            action.type === getType(actions.addEntity) &&
              action.payload.reflector &&
              action.payload.pos &&
              nextState.select
                .entitiesAtPosition(action.payload.pos)
                .some((e) => e.laser),
          );
        },
      },
      {
        text: "tutorials.combat.3",
        checkForCompletion: (prevState, nextState, action) => {
          return Boolean(
            action.type === getType(actions.addEntity) &&
              action.payload.reflector &&
              action.payload.pos &&
              nextState.select.entitiesWithComps("reflector").length >= 2,
          );
        },
      },
      {
        text: "tutorials.combat.4",
        checkForCompletion: (prevState, nextState, action) => {
          return Boolean(
            action.type === getType(actions.rotateEntity) &&
              action.payload.reflector,
          );
        },
      },
      {
        text: "tutorials.combat.5",
        checkForCompletion: (prevState, nextState, action) => {
          return action.type === getType(actions.removeReflector);
        },
      },
      {
        text: "tutorials.combat.6",
        checkForCompletion: (prevState, nextState, action) => {
          return action.type === getType(actions.fireWeapon);
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
            getType(actions.setJobPriority),
            getType(actions.increaseJobPriority),
            getType(actions.decreaseJobPriority),
          ];
          return allowedActionTypes.includes(action.type);
        },
        elementHighlightSelectors: [`[data-section="JOBS"]`],
      },
      {
        text: "tutorials.jobPriorities.1",
        checkForCompletion: (prevState, nextState, action) => {
          const allowedActionTypes: string[] = [
            getType(actions.toggleDisabled),
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
      !selectors.isNight(state),
  },
  [TutorialId.Deconstruct]: {
    id: TutorialId.Deconstruct,
    label: "Deconstruction",
    steps: [
      {
        text: "tutorials.deconstruct.0",
        checkForCompletion: (prevState, nextState, action) =>
          action.type === getType(actions.executeRemoveBuilding),
        isDismissible: true,
      },
      {
        text: "tutorials.deconstruct.1",
        checkForCompletion: () => false,
        isDismissible: true,
        elementHighlightSelectors: [`[data-section="INSPECTOR"]`],
      },
    ],
    triggerSelector: (state: RawState) => {
      const blueprint = selectors.blueprint(state);
      if (!blueprint || !blueprint.pos) return false;
      const { pos } = blueprint;
      const entitiesAtPos = selectors.entitiesAtPosition(state, pos);
      return (
        blueprint.blueprint.builds === "BUILDING_MINE" &&
        entitiesAtPos.some((e) => e.template === "BUILDING_MINING_SPOT")
      );
    },
  },
  [TutorialId.Residence]: {
    id: TutorialId.Residence,
    label: "Residences and Tents",
    steps: [
      {
        text: "tutorials.residence.0",
        checkForCompletion: () => false,
        isDismissible: true,
      },
    ],
    triggerSelector: (state: RawState) =>
      selectors.homelessColonists(state).length > 0 && selectors.isNight(state),
  },
};

export default tutorials;
