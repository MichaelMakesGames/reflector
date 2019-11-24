import { createStandardAction } from "typesafe-actions";

export const inspect = createStandardAction("INSPECT")();
export const cancelInspect = createStandardAction("CANCEL_INSPECT")();
