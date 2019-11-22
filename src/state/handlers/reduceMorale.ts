import * as actions from "~/state/actions";
import { GameState } from "~/types";
import { registerHandler } from "~state/handleAction";

function reduceMorale(
  state: GameState,
  action: ReturnType<typeof actions.reduceMorale>,
): GameState {
  return {
    ...state,
    morale: state.morale - action.payload.amount,
    messageLog: [
      ...state.messageLog,
      `${action.payload.amount} colonist${action.payload.amount === 1 ? '' : 's'} died! You have lost morale.`
    ]
  };
}

registerHandler(reduceMorale, actions.reduceMorale);
