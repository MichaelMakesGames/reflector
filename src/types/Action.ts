import { ActionType } from "typesafe-actions";
import type actions from "../state/actions";

export type Action = ActionType<typeof actions>;
