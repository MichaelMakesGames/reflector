import { getType } from "typesafe-actions";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { ControlCode } from "~types/ControlCode";
import { Tutorial } from "~types/Tutorial";
import { TutorialId } from "~types/TutorialId";
import { BuildingCategoryCode } from "./buildingCategories";
import { ResourceCode } from "./resources";

const tutorials: Record<TutorialId, Tutorial> = {
  [TutorialId.Basics]: {
    id: TutorialId.Basics,
    label: "Basics",
    steps: [
      {
        text:
          "Reflector is a turn-based game. Colonists ENTITY:COLONIST and enemies ENTITY:ENEMY_DRONE move when you move. Try moving by clicking the map, or using the wasd or arrow keys.",
        checkForCompletion: (prevState, nextState, action) => {
          return ([
            getType(actions.move),
            getType(actions.autoMove),
          ] as string[]).includes(action.type);
        },
      },
      {
        text:
          'You need to build places for colonists to work. Let\'s start by building a farm. In the bottom menu, click "Production" then click "Farm", or use the number keys to make your selection.',
        checkForCompletion: (prevState, nextState, action) => {
          return (
            action.type === getType(actions.activatePlacement) &&
            action.payload.template === "FARM"
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Production}"]`,
          `[data-building="FARM"]`,
        ],
      },
      {
        text:
          "Farms are free to build, but must be built on fertile land ENTITY:FERTILE. Click the location you want to build. You might need to move if no fertile land is in range.\n\nIf you prefer keyboard controls, hold alt and press wasd or arrows to move the blueprint, then press space to build.",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select
              .entitiesWithTemplate("FARM")
              .filter((e) => e.jobProvider).length >= 1
          );
        },
      },
      {
        text:
          "Great! Your colonists need 10 food each per day, and 1 farm should be enough for now. Right click the map, press q, or click the cancel button at the bottom to stop placing farms.",
        checkForCompletion: (prevState, nextState, action) => {
          return !nextState.select.placingTarget();
        },
        elementHighlightSelectors: [
          `[data-section="BOTTOM_MENU"] [data-control-code="${ControlCode.Back}"]`,
        ],
      },
      {
        text:
          'Unlike farms, most buildings require resources to build, so let\'s place a couple mining spots on ore for your other colonists to work at.\n\nSelect "Production", then "Mining Spot", then place two of them on ore ENTITY:ORE.',
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select
              .entitiesWithTemplate("MINING_SPOT")
              .filter((e) => e.jobProvider).length >= 1
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Production}"]`,
          `[data-building="MINING_SPOT"]`,
        ],
      },
      {
        text:
          "That's one down, but one colonist still needs a job. Place another mining spot on ore ENTITY:ORE.",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select
              .entitiesWithTemplate("MINING_SPOT")
              .filter((e) => e.jobProvider).length >= 2
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Production}"]`,
          `[data-building="MINING_SPOT"]`,
        ],
      },
      {
        text:
          "Your colonists will automatically move to your farms and mining spots to work, but remember, they only move when you move. You can skip your turn without moving by clicking the wait button at the bottom or pressing z. Move or wait until you have 20 metal.",
        checkForCompletion: (prevState, nextState, action) => {
          return nextState.select.resource(ResourceCode.Metal) >= 20;
        },
        elementHighlightSelectors: [
          `[data-control-code="${ControlCode.Wait}"]`,
          `[data-resource="${ResourceCode.Metal}"]`,
        ],
      },
      {
        text:
          "Many buildings and jobs require power to function. To start producing power, let's build a windmill, under the production category.",
        checkForCompletion: (prevState, nextState, action) => {
          return (
            nextState.select
              .entitiesWithTemplate("WINDMILL")
              .filter((e) => e.production).length >= 1
          );
        },
        elementHighlightSelectors: [
          `[data-building-category="${BuildingCategoryCode.Production}"]`,
          `[data-building="WINDMILL"]`,
        ],
      },
      {
        text:
          "You're off to a great start! Continue collecting resources and building your colony. Next you might want to build a Residence (in Misc) or replace your Mining Spot with a powered Mine (in Production). You'll learn about combat at night.",
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
        text:
          'It is now night. Your colonists will stop working and go to sleep, and enemies will attack, so it\'s time to learn how to fight!\n\nTo activate your laser, click "Activate" or press "f".',
        checkForCompletion: (prevState, nextState, action) =>
          nextState.select.isWeaponActive(),
        elementHighlightSelectors: [
          `[data-control-code="${ControlCode.Fire}"]`,
        ],
      },
      {
        text:
          "You are now aiming your laser, but haven't fired yet. Use the arrow buttons, arrow keys, or wasd to change what direction you're aiming in.",
        checkForCompletion: (prevState, nextState, action) =>
          action.type === getType(actions.targetWeapon),
        elementHighlightSelectors: [`#AIMING_ARROWS`],
      },
      {
        text:
          "Now let's reflect that laser! You can place reflectors within 2 spaces of yourself. To do so, click with the blue borders while aiming. Try placing one on your laser.\n\nFor keyboard controls, hold alt and press the arrow keys or wasd to select a position, then press space.",
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
        text:
          "Great! You can click (or press space) again to rotate the reflector.",
        checkForCompletion: (prevState, nextState, action) => {
          return Boolean(
            action.type === getType(actions.rotateEntity) &&
              action.payload.reflector,
          );
        },
      },
      {
        text: "And click (or press space) again to remove the reflector.",
        checkForCompletion: (prevState, nextState, action) => {
          return action.type === getType(actions.removeReflector);
        },
      },
      {
        text:
          'Once you are ready to fire, press "f" again or click "Fire". The ENTITY:LASER_BURST indicates what will be destroyed by the laser.',
        checkForCompletion: (prevState, nextState, action) => {
          return action.type === getType(actions.fireWeapon);
        },
        elementHighlightSelectors: [
          `[data-control-code="${ControlCode.Fire}"]`,
        ],
      },
      {
        text:
          "Your laser needs to recharge. It will be ready to fire again next turn.",
        checkForCompletion: (prevState, nextState, action) => {
          return prevState.select.turn() < nextState.select.turn();
        },
        elementHighlightSelectors: [`[data-status="LASER"]`],
      },
      {
        text:
          'You now know the basics of combat. Make the most of each shot and try to hit multiple enemies. When you have the resources to spare, experiment with projectors and splitters (in the "Laser" building category).\n\nYou\'re on your own now. Good luck!',
        checkForCompletion: () => false,
        elementHighlightSelectors: [`[data-status="LASER"]`],
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
        text:
          "Uh-oh, looks like you've lost morale! This happens whenever a colonist dies, or if you don't have enough food (10 per colonist) at night. Morale cannot be recovered, and if you run out, you lose!\n\nYou can undo your most recent turn by clicking the undo button in the bottom menu or pressing ctrl+z.",
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
        text:
          "You have more jobs than colonists. Colonists will fill higher priority jobs first. Click and drag a job to change priority, or press j for keyboard controls.",
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
        text:
          'You can also disable jobs on a building-by-building basis as well. Right-click a building and then click "Disable Jobs" to do so. ',
        checkForCompletion: (prevState, nextState, action) => {
          const allowedActionTypes: string[] = [
            getType(actions.toggleDisabled),
          ];
          return allowedActionTypes.includes(action.type);
        },
      },
      {
        text:
          'Colonists will completely ignore jobs at a disabled building. You can re-enable them by right-clicking and selecting "Enable Jobs". Use building disabling and job priorities to control where your colonists work.',
        checkForCompletion: () => false,
        isDismissible: true,
      },
    ],
    triggerSelector: selectors.areThereMoreJobsThanColonists,
  },
};

export default tutorials;
