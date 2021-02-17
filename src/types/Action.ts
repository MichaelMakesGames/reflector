import { ActionType } from "typesafe-actions";
import actions from "~state/actions";

export type Action = ActionType<typeof actions>;
