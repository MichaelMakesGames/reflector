import { createStandardAction } from "typesafe-actions";
import { Pos } from "~types";

export const activateRemoveBuilding = createStandardAction(
  "ACTIVATE_REMOVE_BUILDING",
)();
export const executeRemoveBuilding = createStandardAction(
  "EXECUTE_REMOVE_BUILDING",
)<Pos>();
export const cancelRemoveBuilding = createStandardAction(
  "CANCEL_REMOVE_BUILDING",
)();
