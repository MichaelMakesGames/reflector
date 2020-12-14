import { createStandardAction } from "typesafe-actions";
import { Pos, Direction } from "~types";
import { ResourceCode } from "~data/resources";
import { JobTypeCode } from "~data/jobTypes";

export const move = createStandardAction("MOVE")<{
  entityId: string;
  dx: number;
  dy: number;
}>();

export const setAutoMovePath = createStandardAction("SET_AUTO_MOVE_PATH")<
  Pos[]
>();
export const setAutoMovePathToCursor = createStandardAction(
  "SET_AUTO_MOVE_PATH_TO_CURSOR",
)();
export const cancelAutoMove = createStandardAction("CANCEL_AUTO_MOVE")();
export const autoMove = createStandardAction("AUTO_MOVE")();

export const playerTookTurn = createStandardAction("PLAYER_TOOK_TURN")();

export const newGame = createStandardAction("NEW_GAME")();
export const continueVictory = createStandardAction("CONTINUE_VICTORY")();

export const reduceMorale = createStandardAction("REDUCE_MORALE")<{
  amount: number;
}>();

export const destroy = createStandardAction("DESTROY")<string>();

export const logMessage = createStandardAction("LOG_MESSAGE")<{
  message: string;
  type?: string;
}>();

export const modifyResource = createStandardAction("MODIFY_RESOURCE")<{
  resource: ResourceCode;
  amount: number;
  reason: string;
}>();

export const increaseJobPriority = createStandardAction(
  "INCREASE_JOB_PRIORITY",
)<JobTypeCode>();
export const decreaseJobPriority = createStandardAction(
  "DECREASE_JOB_PRIORITY",
)<JobTypeCode>();
export const setJobPriority = createStandardAction("SET_JOB_PRIORITY")<{
  jobType: JobTypeCode;
  priority: number;
}>();

export const makeMeRich = createStandardAction("MAKE_ME_RICH")();

export const setCursorPos = createStandardAction(
  "SET_CURSOR_POS",
)<Pos | null>();
export const moveCursor = createStandardAction("MOVE_CURSOR")<Direction>();

export const undoTurn = createStandardAction("UNDO_TURN")();

export const logEvent = createStandardAction("LOG_EVENT")<{
  type: string;
  count?: number;
}>();
