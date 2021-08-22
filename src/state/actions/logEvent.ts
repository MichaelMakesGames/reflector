import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const logEvent = createAction("LOG_EVENT")<{
  type: string;
  count?: number;
}>();
export default logEvent;

function logEventHandler(
  state: WrappedState,
  action: ReturnType<typeof logEvent>
): void {
  const { type } = action.payload;
  const count = action.payload.count || 1;
  state.setRaw({
    ...state.raw,
    events: {
      ...state.raw.events,
      [type]: (state.raw.events[type] || 0) + count,
    },
  });
}

registerHandler(logEventHandler, logEvent);
