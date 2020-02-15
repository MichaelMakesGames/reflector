import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function cancelDisableMode(
  state: WrappedState,
  action: ReturnType<typeof actions.cancelDisableMode>,
): void {
  const disableMarker = state.select.disableMarker();
  if (!disableMarker) return;

  state.act.removeEntity(disableMarker.id);
}

registerHandler(cancelDisableMode, actions.cancelDisableMode);
