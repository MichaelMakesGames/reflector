import { createStandardAction, ActionType, getType } from "typesafe-actions";
import { Entity } from "../types";

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

export const ready = createStandardAction("READY")<{ entityId: string }>();

export const init = createStandardAction("INIT")();
