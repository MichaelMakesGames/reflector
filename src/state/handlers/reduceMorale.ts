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
    messageLog: [
      ...state.raw.messageLog,
      `${action.payload.amount} colonist${
        action.payload.amount === 1 ? "" : "s"
      } died! You have lost morale.`,
    ],
  });
}

registerHandler(reduceMorale, actions.reduceMorale);
