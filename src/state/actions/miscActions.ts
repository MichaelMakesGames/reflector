import { createStandardAction } from "typesafe-actions";

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

export const mine = createStandardAction("MINE")();

export const logMessage = createStandardAction("LOG_MESSAGE")<{
  message: string;
}>();

export const modifyResource = createStandardAction("MODIFY_RESOURCE")<{
  resource: Resource;
  amount: number;
}>();

export const increaseJobPriority = createStandardAction(
  "INCREASE_JOB_PRIORITY",
)<JobType>();
export const decreaseJobPriority = createStandardAction(
  "DECREASE_JOB_PRIORITY",
)<JobType>();
