import { createStandardAction } from "typesafe-actions";
import { Pos } from "~types";

export const activatePlacement = createStandardAction("ACTIVATE_PLACEMENT")<{
  template: TemplateName;
  takesTurn: boolean;
  cost?: { resource: string; amount: number };
  validitySelector?: string;
  pos?: Pos;
}>();
export const movePlacement = createStandardAction("MOVE_PLACEMENT")<{
  direction: { dx: number; dy: number };
  jumpToValid: boolean;
}>();
export const cancelPlacement = createStandardAction("CANCEL_PLACEMENT")();
export const rotatePlacement = createStandardAction("ROTATE_PLACEMENT")();
export const finishPlacement = createStandardAction("FINISH_PLACEMENT")<{
  placeAnother: boolean;
}>();

export const openBuildMenu = createStandardAction("OPEN_BUILD_MENU")();
export const closeBuildMenu = createStandardAction("CLOSE_BUILD_MENU")();

export const clearReflectors = createStandardAction("CLEAR_REFLECTORS")();
export const removeReflector = createStandardAction("REMOVE_REFLECTOR")<Pos>();
