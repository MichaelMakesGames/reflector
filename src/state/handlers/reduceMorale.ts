import * as actions from "~/state/actions";
import { GameState } from "~/types";

export function reduceMorale(
  state: GameState,
  action: ReturnType<typeof actions.reduceMorale>,
) {
  return {
    ...state,
    morale: state.morale - action.payload.amount,
  };
}
