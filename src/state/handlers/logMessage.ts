import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";

function logMessage(
  state: WrappedState,
  action: ReturnType<typeof actions.logMessage>,
): void {
  const { message } = action.payload;
  state.setRaw({
    ...state.raw,
    messageLog: [...state.raw.messageLog, message],
  });
}

registerHandler(logMessage, actions.logMessage);
