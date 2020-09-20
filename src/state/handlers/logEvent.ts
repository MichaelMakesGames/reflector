import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";

function logEvent(
  state: WrappedState,
  action: ReturnType<typeof actions.logEvent>,
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

registerHandler(logEvent, actions.logEvent);
