import { createStandardAction, ActionType, getType } from "typesafe-actions";
import { Entity } from "./types";

export const addEntity = createStandardAction("ADD_ENTITY")<{
  entity: Entity;
}>();

export const removeEntity = createStandardAction("REMOVE_ENTITY")<{
  entityId: string;
}>();

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
export const fireWeaponSuccess = createStandardAction("FIRE_WEAPON_SUCCESS")<{
  entityId: string;
}>();

export const activateThrow = createStandardAction("ACTIVATE_THROW")<{
  entity: Entity;
}>();
export const cancelThrow = createStandardAction("CANCEL_THROW")();
export const rotateThrow = createStandardAction("ROTATE_THROW")();
export const executeThrow = createStandardAction("THROW")();

export const attack = createStandardAction("ATTACK")<{ target: string }>();

export const playerTookTurn = createStandardAction("PLAYER_TOOK_TURN")();

export const init = createStandardAction("INIT")();
