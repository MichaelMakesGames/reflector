import { getType } from "typesafe-actions";
import * as actions from "./actions";
import { activateThrow } from "./handlers/activateThrow";
import { activateWeapon } from "./handlers/activateWeapon";
import { addEntity } from "./handlers/addEntity";
import { attack } from "./handlers/attack";
import { cancelThrow } from "./handlers/cancelThrow";
import { executeThrow } from "./handlers/executeThrow";
import { fireWeapon } from "./handlers/fireWeapon";
import { init } from "./handlers/init";
import { move } from "./handlers/move";
import { playerTookTurn } from "./handlers/playerTookTurn";
import { removeEntities } from "./handlers/removeEntities";
import { removeEntity } from "./handlers/removeEntity";
import { rotateThrow } from "./handlers/rotateThrow";
import { targetWeapon } from "./handlers/targetWeapon";
import { Action, GameState } from "~/types";
import { updateEntity } from "./handlers/updateEntity";
import { BASE_IMMIGRATION_RATE } from "~constants";

const initialState: GameState = {
  entities: {},
  entitiesByPosition: {},
  messageLog: [],
  gameOver: false,
  turnsUntilNextImmigrant: BASE_IMMIGRATION_RATE,
};

export default function reducer(
  state: GameState = initialState,
  action: Action,
): GameState {
  switch (action.type) {
    case getType(actions.fireWeapon):
      return fireWeapon(state, action);
    case getType(actions.playerTookTurn):
      return playerTookTurn(state, action);
    case getType(actions.init):
      return init(state, action);
    case getType(actions.activateWeapon):
      return activateWeapon(state, action);
    case getType(actions.targetWeapon):
      return targetWeapon(state, action);
    case getType(actions.activateThrow):
      return activateThrow(state, action);
    case getType(actions.rotateThrow):
      return rotateThrow(state, action);
    case getType(actions.cancelThrow):
      return cancelThrow(state, action);
    case getType(actions.executeThrow):
      return executeThrow(state, action);
    case getType(actions.move):
      return move(state, action);
    case getType(actions.attack):
      return attack(state, action);
    case getType(actions.addEntity):
      return addEntity(state, action);
    case getType(actions.removeEntities):
      return removeEntities(state, action);
    case getType(actions.removeEntity):
      return removeEntity(state, action);
    case getType(actions.updateEntity):
      return updateEntity(state, action);
    default: {
      if (!(action as { type: string }).type.startsWith("@@")) {
        console.warn("Unhandled action in reducer", action);
      }
      return state;
    }
  }
}
