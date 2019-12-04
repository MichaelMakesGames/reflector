import { createStandardAction } from "typesafe-actions";
import { Direction } from "~types";

export const activateWeapon = createStandardAction("ACTIVATE_WEAPON")();

export const deactivateWeapon = createStandardAction("DEACTIVATE_WEAPON")();

export const targetWeapon = createStandardAction("TARGET_WEAPON")<Direction>();

export const fireWeapon = createStandardAction("FIRE_WEAPON")();
