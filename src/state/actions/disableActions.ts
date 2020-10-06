import { createStandardAction } from "typesafe-actions";
import { Pos } from "~types";

export const toggleDisabled = createStandardAction("TOGGLE_DISABLED")<Pos>();
