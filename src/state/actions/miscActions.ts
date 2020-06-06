import { createStandardAction } from "typesafe-actions";
import { Pos, Direction } from "~types";
import { ResourceCode } from "~data/resources";

export const move = createStandardAction("MOVE")<{
  entityId: string;
  dx: number;
  dy: number;
}>();

export const playerTookTurn = createStandardAction("PLAYER_TOOK_TURN")();

export const newGame = createStandardAction("NEW_GAME")();

export const reduceMorale = createStandardAction("REDUCE_MORALE")<{
  amount: number;
}>();

export const destroy = createStandardAction("DESTROY")<string>();

export const logMessage = createStandardAction("LOG_MESSAGE")<{
  message: string;
}>();

export const modifyResource = createStandardAction("MODIFY_RESOURCE")<{
  resource: ResourceCode;
  amount: number;
}>();

export const increaseJobPriority = createStandardAction(
  "INCREASE_JOB_PRIORITY",
)<JobType>();
export const decreaseJobPriority = createStandardAction(
  "DECREASE_JOB_PRIORITY",
)<JobType>();

export const makeMeRich = createStandardAction("MAKE_ME_RICH")();

export const setCursorPos = createStandardAction(
  "SET_CURSOR_POS",
)<Pos | null>();
export const moveCursor = createStandardAction("MOVE_CURSOR")<Direction>();
