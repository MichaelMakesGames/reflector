import * as actions from "~/state/actions";
import { GameState } from "~/types";
import { registerHandler } from "~state/handleAction";

function reduceMorale(
  state: GameState,
  action: ReturnType<typeof actions.reduceMorale>,
) {
  return {
    ...state,
    morale: state.morale - action.payload.amount,
  };
}

registerHandler(reduceMorale, actions.reduceMorale);
