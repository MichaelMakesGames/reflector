import actions from "../actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function cancelInspect(
  state: WrappedState,
  action: ReturnType<typeof actions.cancelInspect>,
): void {
  const inspector = state.select.inspector();
  if (!inspector) return;
  state.act.removeEntity({ entityId: inspector.id });
}

registerHandler(cancelInspect, actions.cancelInspect);
