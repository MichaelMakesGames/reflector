import { ActionType } from "typesafe-actions";
import * as actions from "../state/actions";
export type Action = ActionType<typeof actions>;
