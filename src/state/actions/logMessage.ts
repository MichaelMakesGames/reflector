import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";
import notifications from "../../lib/notifications";

const logMessage = createAction("LOG_MESSAGE")<{
  message: string;
  type: "error" | "success" | "info";
}>();
export default logMessage;

function logMessageHandler(
  state: WrappedState,
  action: ReturnType<typeof logMessage>
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
    type,
    message,
  });
  if (type === "success") {
    state.audio.play("ui_chime");
  } else if (type === "error") {
    state.audio.play("ui_alert");
  }
}

registerHandler(logMessageHandler, logMessage);
