import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import notifications from "~utils/notifications";

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

  // should probably find a better solution to this
  // perhaps the same subscription system I'm planning for rendering
  notifications.open({
    type: type || "error",
    message,
  });
}

registerHandler(logMessage, actions.logMessage);
