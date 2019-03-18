import * as actions from "../actions";
import { PLAYER_ID } from "../constants";
import * as selectors from "../selectors";
import { GameState } from "../types";
import { addEntity } from "./addEntity";
import { removeEntity } from "./removeEntity";

export function attack(
  state: GameState,
  action: ReturnType<typeof actions.attack>,
): GameState {
  const target = selectors.entity(state, action.payload.target);
  if (target.hitPoints) {
    state = addEntity(
      state,
      actions.addEntity({
        entity: {
          ...target,
          hitPoints: {
            ...target.hitPoints,
            current: target.hitPoints.current - 1,
          },
        },
      }),
    );
  }
  if (target.destructible) {
    state = removeEntity(state, actions.removeEntity({ entityId: target.id }));
  }
  if (target.id === PLAYER_ID) {
    state = {
      ...state,
      messageLog: [...state.messageLog, action.payload.message],
    };
  }
  return state;
}
