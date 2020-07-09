import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";

function logMessage(
  state: WrappedState,
  action: ReturnType<typeof actions.logMessage>,
): void {
  const { message, type } = action.payload;
  const turn = state.select.turn();
  state.setRaw({
    ...state.raw,
    messageLog: {
      ...state.raw.messageLog,
      [turn]: [
        ...(state.raw.messageLog[turn] || []),
        {
          message,
          type,
        },
      ],
    },
  });
}

registerHandler(logMessage, actions.logMessage);
