import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function reduceMorale(
  state: WrappedState,
  action: ReturnType<typeof actions.reduceMorale>,
): void {
  state.setRaw({
    ...state.raw,
    morale: state.raw.morale - action.payload.amount,
  });
}

registerHandler(reduceMorale, actions.reduceMorale);
