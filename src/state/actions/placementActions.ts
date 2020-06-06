import { createStandardAction } from "typesafe-actions";
import { Pos, Entity } from "~types";
import { ResourceCode } from "~data/resources";

export const activatePlacement = createStandardAction("ACTIVATE_PLACEMENT")<{
  template: TemplateName;
  takesTurn: boolean;
  cost?: { resource: ResourceCode; amount: number };
  validitySelector?: string;
  pos?: Pos;
}>();
export const movePlacement = createStandardAction("MOVE_PLACEMENT")<{
  to: Pos;
}>();
export const cancelPlacement = createStandardAction("CANCEL_PLACEMENT")();
export const rotateEntity = createStandardAction("ROTATE_ENTITY")<Entity>();
export const finishPlacement = createStandardAction("FINISH_PLACEMENT")<{
  placeAnother: boolean;
}>();

export const clearReflectors = createStandardAction("CLEAR_REFLECTORS")();
export const removeReflector = createStandardAction("REMOVE_REFLECTOR")<Pos>();
export const cycleReflector = createStandardAction("CYCLE_REFLECTOR")<Pos>();
