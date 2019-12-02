import { createStandardAction } from "typesafe-actions";

export const activateWeapon = createStandardAction("ACTIVATE_WEAPON")();

export const deactivateWeapon = createStandardAction("DEACTIVATE_WEAPON")();

export const targetWeapon = createStandardAction("TARGET_WEAPON")<{
  dx: number;
  dy: number;
}>();

export const fireWeapon = createStandardAction("FIRE_WEAPON")();
