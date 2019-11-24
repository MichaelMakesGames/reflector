import { createStandardAction } from "typesafe-actions";

export const activateWeapon = createStandardAction("ACTIVATE_WEAPON")<{
  slot: number;
}>();

export const targetWeapon = createStandardAction("TARGET_WEAPON")<{
  dx: number;
  dy: number;
}>();

export const fireWeapon = createStandardAction("FIRE_WEAPON")();
