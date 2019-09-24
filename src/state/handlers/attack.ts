import * as actions from "~/state/actions";
import { PLAYER_ID } from "~/constants";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function attack(
  state: GameState,
  action: ReturnType<typeof actions.attack>,
): GameState {
  let newState = state;
  const target = selectors.entityById(newState, action.payload.target);

  if (target.destructible) {
    newState = handleAction(newState, actions.destroy({ entityId: target.id }));
  }
  if (target.id === PLAYER_ID) {
    newState = {
      ...newState,
      messageLog: [...newState.messageLog, action.payload.message],
    };
  }
  return newState;
}

registerHandler(attack, actions.attack);
