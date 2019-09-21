import * as actions from "~/state/actions";
import { PLAYER_ID } from "~/constants";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import { destroy } from "./destroy";

export function attack(
  state: GameState,
  action: ReturnType<typeof actions.attack>,
): GameState {
  let newState = state;
  const target = selectors.entity(newState, action.payload.target);

  if (target.destructible) {
    newState = destroy(newState, actions.destroy({ entityId: target.id }));
  }
  if (target.id === PLAYER_ID) {
    newState = {
      ...newState,
      messageLog: [...newState.messageLog, action.payload.message],
    };
  }
  return newState;
}
