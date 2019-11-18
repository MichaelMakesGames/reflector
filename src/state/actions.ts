import { createStandardAction } from "typesafe-actions";
import { Entity, Pos } from "~/types/Entity";
import { GameState } from "~types";

export const addEntity = createStandardAction("ADD_ENTITY")<{
  entity: Entity;
}>();

export const removeEntity = createStandardAction("REMOVE_ENTITY")<{
  entityId: string;
}>();

export const removeEntities = createStandardAction("REMOVE_ENTITIES")<{
  entityIds: string[];
}>();

export const updateEntity = createStandardAction("UPDATE_ENTITY")<Entity>();

export const move = createStandardAction("MOVE")<{
  entityId: string;
  dx: number;
  dy: number;
}>();

export const activateWeapon = createStandardAction("ACTIVATE_WEAPON")<{
  slot: number;
}>();

export const targetWeapon = createStandardAction("TARGET_WEAPON")<{
  dx: number;
  dy: number;
}>();

export const fireWeapon = createStandardAction("FIRE_WEAPON")();

export const activatePlacement = createStandardAction("ACTIVATE_PLACEMENT")<{
  template: string;
  takesTurn: boolean;
  cost?: { resource: string; amount: number };
  validitySelector?: string;
  pos?: Pos;
}>();
export const movePlacement = createStandardAction("MOVE_PLACEMENT")<{
  direction: { dx: number; dy: number };
  jumpToValid: boolean;
}>();
export const cancelPlacement = createStandardAction("CANCEL_PLACEMENT")();
export const rotatePlacement = createStandardAction("ROTATE_PLACEMENT")();
export const finishPlacement = createStandardAction("FINISH_PLACEMENT")();

export const attack = createStandardAction("ATTACK")<{
  target: string;
  message: string;
}>();

export const playerTookTurn = createStandardAction("PLAYER_TOOK_TURN")();

export const newGame = createStandardAction("NEW_GAME")();
export const loadGame = createStandardAction("LOAD_GAME")<{
  state: GameState;
}>();

export const reduceMorale = createStandardAction("REDUCE_MORALE")<{
  amount: number;
}>();

export const destroy = createStandardAction("DESTROY")<{ entityId: string }>();

export const openBuildMenu = createStandardAction("OPEN_BUILD_MENU")();
export const closeBuildMenu = createStandardAction("CLOSE_BUILD_MENU")();

export const clearReflectors = createStandardAction("CLEAR_REFLECTORS")();
export const removeReflector = createStandardAction("REMOVE_REFLECTOR")();

export const mine = createStandardAction("MINE")();

export const inspect = createStandardAction("INSPECT")();
export const cancelInspect = createStandardAction("CANCEL_INSPECT")();
