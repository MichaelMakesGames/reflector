import * as actions from "../actions";
import { PLAYER_ID } from "../../constants";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { removeEntity } from "./removeEntity";
import { updateEntity } from "./updateEntity";

export function attack(
  state: GameState,
  action: ReturnType<typeof actions.attack>,
): GameState {
  const target = selectors.entity(state, action.payload.target);
  if (target.hitPoints) {
    state = updateEntity(
      state,
      actions.updateEntity({
        id: target.id,
        hitPoints: {
          ...target.hitPoints,
          current: target.hitPoints.current - 1,
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
