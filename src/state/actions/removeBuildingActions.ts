import { createStandardAction } from "typesafe-actions";
import { Pos } from "~types";

export const executeRemoveBuilding = createStandardAction(
  "EXECUTE_REMOVE_BUILDING",
)<Pos>();
