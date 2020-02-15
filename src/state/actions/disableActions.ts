import { createStandardAction } from "typesafe-actions";
import { Pos } from "~types";

export const toggleDisabled = createStandardAction("TOGGLE_DISABLED")<Pos>();
export const activateDisableMode = createStandardAction(
  "ACTIVATE_DISABLE_MODE",
)();
export const cancelDisableMode = createStandardAction("CANCEL_DISABLE_MODE")();
