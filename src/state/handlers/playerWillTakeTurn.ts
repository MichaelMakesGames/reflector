import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";

function playerWillTakeTurn(
  state: WrappedState,
  action: ReturnType<typeof actions.playerWillTakeTurn>,
): void {
  state.setRaw({
    ...state.raw,
    previousState: {
      ...state.raw,
      previousState: null,
    },
  });
}

registerHandler(playerWillTakeTurn, actions.playerWillTakeTurn);
