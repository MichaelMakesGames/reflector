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
  let newState = state;
  const target = selectors.entity(newState, action.payload.target);
  if (target.hitPoints) {
    newState = updateEntity(
      newState,
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
    newState = removeEntity(
      newState,
      actions.removeEntity({ entityId: target.id }),
    );
  }
  if (target.id === PLAYER_ID) {
    newState = {
      ...newState,
      messageLog: [...newState.messageLog, action.payload.message],
    };
  }
  return newState;
}
