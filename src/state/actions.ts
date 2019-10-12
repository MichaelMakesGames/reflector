import { createStandardAction } from "typesafe-actions";
import { Entity } from "~/types/Entity";

export const addEntity = createStandardAction("ADD_ENTITY")<{
  entity: Entity;
}>();

export const removeEntity = createStandardAction("REMOVE_ENTITY")<{
  entityId: string;
}>();

export const removeEntities = createStandardAction("REMOVE_ENTITIES")<{
  entityIds: string[];
}>();

export const updateEntity = createStandardAction("UPDATE_ENTITY")<Entity>();

export const move = createStandardAction("MOVE")<{
  entityId: string;
  dx: number;
  dy: number;
}>();

export const activateWeapon = createStandardAction("ACTIVATE_WEAPON")<{
  slot: number;
}>();

export const targetWeapon = createStandardAction("TARGET_WEAPON")<{
  dx: number;
  dy: number;
}>();

export const fireWeapon = createStandardAction("FIRE_WEAPON")();

export const activatePlacement = createStandardAction("ACTIVATE_PLACEMENT")<{
  template: string;
  takesTurn: boolean;
  cost?: { resource: string; amount: number };
}>();
export const cancelPlacement = createStandardAction("CANCEL_PLACEMENT")();
export const rotatePlacement = createStandardAction("ROTATE_PLACEMENT")();
export const finishPlacement = createStandardAction("FINISH_PLACEMENT")();

export const attack = createStandardAction("ATTACK")<{
  target: string;
  message: string;
}>();

export const playerTookTurn = createStandardAction("PLAYER_TOOK_TURN")();

export const init = createStandardAction("INIT")();

export const reduceMorale = createStandardAction("REDUCE_MORALE")<{
  amount: number;
}>();

export const destroy = createStandardAction("DESTROY")<{ entityId: string }>();

export const openBuildMenu = createStandardAction("OPEN_BUILD_MENU")();
export const closeBuildMenu = createStandardAction("CLOSE_BUILD_MENU")();

export const clearReflectors = createStandardAction("CLEAR_REFLECTORS")();
