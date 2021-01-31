import { createStandardAction } from "typesafe-actions";
import { Pos, Entity } from "~types";

export const blueprintSelect = createStandardAction("BLUEPRINT_SELECT")<
  TemplateName
>();
export const blueprintMove = createStandardAction("BLUEPRINT_MOVE")<{
  to: Pos;
}>();
export const blueprintCancel = createStandardAction("BLUEPRINT_CANCEL")();
export const blueprintBuild = createStandardAction("BLUEPRINT_BUILD")();

export const rotateEntity = createStandardAction("ROTATE_ENTITY")<Entity>();

export const clearReflectors = createStandardAction("CLEAR_REFLECTORS")();
export const removeReflector = createStandardAction("REMOVE_REFLECTOR")<Pos>();
export const cycleReflector = createStandardAction("CYCLE_REFLECTOR")<Pos>();
